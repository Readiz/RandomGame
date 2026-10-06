#!/usr/bin/env bash
set -euo pipefail
umask 077

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
version="$(node --input-type=commonjs -e 'process.stdout.write(require(process.argv[1]).version)' "$repo_root/package.json")"
if [[ ! "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo 'Android versionName must be a single numeric three-part version.' >&2
  exit 1
fi
gradle_version='8.13'
cache_dir="${XDG_CACHE_HOME:-$HOME/.cache}/random-game-android"
gradle_dir="${RANDOM_GAME_GRADLE_HOME:-$cache_dir/gradle-$gradle_version}"
signing_dir="${RANDOM_GAME_SIGNING_DIR:-$HOME/.config/random-game/android-signing}"
export RANDOM_GAME_SIGNING_DIR="$signing_dir"

if [[ -z "${JAVA_HOME:-}" && -x /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home/bin/java ]]; then
  export JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
fi
if [[ -z "${JAVA_HOME:-}" || ! -x "$JAVA_HOME/bin/java" ]]; then
  echo 'JDK 17 is required (set JAVA_HOME).' >&2
  exit 1
fi
export PATH="$JAVA_HOME/bin:$PATH"
if [[ -z "${ANDROID_HOME:-}" && -d /opt/homebrew/share/android-commandlinetools/platforms/android-36 ]]; then
  export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
fi
if [[ -z "${ANDROID_HOME:-}" || ! -d "$ANDROID_HOME/platforms/android-36" || ! -x "$ANDROID_HOME/build-tools/35.0.0/apksigner" ]]; then
  echo 'Android SDK platform 36 and build-tools 35.0.0 are required (set ANDROID_HOME).' >&2
  exit 1
fi

mkdir -p "$cache_dir" "$signing_dir" "$repo_root/outputs/android"
if [[ ! -f "$signing_dir/release.jks" && ! -f "$signing_dir/password" ]]; then
  python3 - "$signing_dir/password" <<'PY'
import pathlib, secrets, sys
path = pathlib.Path(sys.argv[1])
path.write_text(secrets.token_urlsafe(36) + '\n')
path.chmod(0o600)
PY
  "$JAVA_HOME/bin/keytool" -genkeypair -noprompt -keystore "$signing_dir/release.jks" \
    -storepass:file "$signing_dir/password" -keypass:file "$signing_dir/password" \
    -alias random-game -keyalg RSA -keysize 3072 -validity 10000 -dname 'CN=Readiz Random Game'
  chmod 600 "$signing_dir/release.jks"
fi
if [[ ! -f "$signing_dir/release.jks" || ! -f "$signing_dir/password" ]]; then
  echo 'Incomplete Android signing key; restore the original key and password before building.' >&2
  exit 1
fi

if [[ ! -x "$gradle_dir/bin/gradle" ]]; then
  zip_file="$cache_dir/gradle-$gradle_version-bin.zip"
  curl -fsSL "https://services.gradle.org/distributions/gradle-$gradle_version-bin.zip" -o "$zip_file"
  expected="$(curl -fsSL "https://services.gradle.org/distributions/gradle-$gradle_version-bin.zip.sha256" | tr -d '[:space:]')"
  actual="$(shasum -a 256 "$zip_file" | cut -d ' ' -f 1)"
  if [[ "$actual" != "$expected" ]]; then
    echo 'Gradle download checksum mismatch.' >&2
    rm -f "$zip_file"
    exit 1
  fi
  unzip -q "$zip_file" -d "$cache_dir"
  rm -f "$zip_file"
fi

(cd "$repo_root" && npm test && npm run build:android:web)
cp "$repo_root/img/favicon.svg" "$repo_root/android/app/build/generated/assets/game/favicon.svg"
"$gradle_dir/bin/gradle" -p "$repo_root/android" --no-daemon :app:testDebugUnitTest :app:lintRelease :app:assembleRelease :app:assembleDebug
source_apk="$repo_root/android/app/build/outputs/apk/release/app-release.apk"
versioned="$repo_root/outputs/android/random-game-$version.apk"
latest="$repo_root/outputs/android/random-game.apk"
"$ANDROID_HOME/build-tools/35.0.0/apksigner" verify --verbose "$source_apk"
cp "$source_apk" "$versioned"
cp "$source_apk" "$latest.tmp"
mv -f "$latest.tmp" "$latest"
(cd "$repo_root/outputs/android" && shasum -a 256 "$(basename "$versioned")" > "$(basename "$versioned").sha256")
python3 - "$latest" "$repo_root/android/app/build/outputs/apk/release/output-metadata.json" <<'PY'
import hashlib, json, pathlib, sys
apk = pathlib.Path(sys.argv[1])
build = json.loads(pathlib.Path(sys.argv[2]).read_text())
entry = build['elements'][0]
release = dict(packageName=build['applicationId'], versionCode=entry['versionCode'],
               versionName=entry['versionName'], size=apk.stat().st_size,
               sha256=hashlib.sha256(apk.read_bytes()).hexdigest())
temporary = pathlib.Path(str(apk) + '.json.tmp')
temporary.write_text(json.dumps(release) + '\n')
temporary.replace(str(apk) + '.json')
PY
echo "APK ready: $latest"
