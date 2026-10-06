package com.readiz.randomgame;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.webkit.WebView;
import androidx.core.content.FileProvider;
import org.json.JSONObject;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/** Foreground update checks; gameplay stays offline and never opens remote pages. */
class AndroidUpdates {
    interface GameState { void accept(boolean busy); }
    static final String RELEASES = "https://github.com/Readiz/RandomGame/releases/";
    static final String METADATA = RELEASES + "latest/download/random-game.apk.json";
    static final long MAX_SIZE = 50L * 1024 * 1024;
    final Activity activity;
    private final WebView web;
    private final ExecutorService worker = Executors.newSingleThreadExecutor();
    private final Handler handler = new Handler(Looper.getMainLooper());
    private final Runnable offer = this::maybeOffer;
    private boolean resumed, closed, downloading, waitingPermission, suppressOffer;
    private int entry;
    private Release pending;
    private File ready;
    private String failure;
    private AlertDialog dialog;

    AndroidUpdates(Activity activity, WebView web) {
        this.activity = activity;
        this.web = web;
    }

    void onResume() {
        resumed = true;
        entry++;
        pending = null;
        suppressOffer = downloading || waitingPermission || ready != null;
        check(); // Check every foreground entry, without a daily cooldown.
        if (waitingPermission) {
            waitingPermission = false;
            if (canInstall()) installReady();
            else { ready = null; showError("설치 허용을 켜지 않아 업데이트를 중단했습니다. 다음 앱 진입 시 다시 안내합니다."); }
        } else if (ready != null) installReady();
        else if (downloading) showDownloading();
        if (failure != null) { String message = failure; failure = null; showError(message); }
    }

    void onPause() {
        resumed = false;
        handler.removeCallbacks(offer);
        dismiss();
    }

    void onPageFinished() {
        if (resumed && pending != null) scheduleOffer();
    }

    int installedVersion() throws Exception {
        return activity.getPackageManager().getPackageInfo(activity.getPackageName(), 0).versionCode;
    }

    private void check() {
        final int currentEntry = entry;
        execute(() -> {
            Release release = null;
            try { release = fetchRelease(); }
            catch (Exception ignored) { /* An offline check must never block app entry. */ }
            final Release result = release;
            handler.post(() -> {
                if (closed || entry != currentEntry) return;
                try {
                    if (result != null && result.versionCode > installedVersion() && !suppressOffer) {
                        pending = result;
                        scheduleOffer();
                    }
                } catch (Exception ignored) { }
            });
        });
    }

    void execute(Runnable task) { worker.execute(task); }

    Release fetchRelease() throws Exception {
        HttpURLConnection connection = connect(METADATA);
        try {
            int status = connection.getResponseCode();
            if (status != 200) throw new IOException();
            try (InputStream input = connection.getInputStream(); ByteArrayOutputStream output = new ByteArrayOutputStream()) {
                byte[] buffer = new byte[2048];
                int count;
                while ((count = input.read(buffer)) != -1) {
                    if (output.size() + count > 8192) throw new IOException();
                    output.write(buffer, 0, count);
                }
                return new Release(new JSONObject(output.toString(StandardCharsets.UTF_8.name())));
            }
        } finally { connection.disconnect(); }
    }

    private void scheduleOffer() {
        handler.removeCallbacks(offer);
        if (resumed && !closed) handler.postDelayed(offer, 500);
    }

    void checkGame(GameState callback) {
        if (!AssetPolicy.HOME.equals(web.getUrl())) { callback.accept(true); return; }
        // Wait for an empty lobby. Do not cover countdowns, combat, or the result reveal.
        web.evaluateJavascript("document.querySelector('main')?.dataset.phase !== 'lobby' || !!document.querySelector('.fighter')", value ->
                callback.accept(!"false".equals(value)));
    }

    private void maybeOffer() {
        if (!resumed || closed || pending == null || downloading || suppressOffer || dialog != null) return;
        final int currentEntry = entry;
        checkGame(busy -> {
            if (!resumed || closed || currentEntry != entry || pending == null || dialog != null) return;
            if (busy) { handler.postDelayed(offer, 3000); return; }
            Release release = pending;
            pending = null;
            dialog = new AlertDialog.Builder(activity)
                    .setTitle("새 버전이 있습니다")
                    .setMessage("운빨망겜 " + release.versionName + " 버전으로 업데이트할 수 있습니다.")
                    .setPositiveButton("업데이트", (d, which) -> { dialog = null; download(release); })
                    .setNegativeButton("나중에", (d, which) -> dialog = null)
                    .setOnCancelListener(d -> dialog = null).create();
            dialog.show();
        });
    }

    private void download(Release release) {
        if (downloading) return;
        downloading = true;
        suppressOffer = true;
        showDownloading();
        execute(() -> {
            File file = null;
            String error = null;
            try { file = downloadRelease(release); }
            catch (Exception ignored) { error = "업데이트 파일을 받지 못했습니다. 연결을 확인하고 앱에 다시 진입해 주세요."; }
            final File downloaded = file;
            final String message = error;
            handler.post(() -> {
                if (closed) return;
                downloading = false;
                dismiss();
                ready = downloaded;
                if (!resumed) { failure = message; return; }
                if (message != null) showError(message);
                else installReady();
            });
        });
    }

    File downloadRelease(Release release) throws Exception {
        File directory = new File(activity.getCacheDir(), "updates");
        if (!directory.isDirectory() && !directory.mkdirs()) throw new IOException();
        File partial = File.createTempFile("update-", ".part", directory);
        File target = new File(directory, "update.apk");
        HttpURLConnection connection = null;
        try {
            // Pin the APK to the checked tag so publishing another release cannot race this download.
            connection = connect(release.apkUrl());
            int status = connection.getResponseCode();
            if (status != 200) throw new IOException();
            try (InputStream input = connection.getInputStream(); FileOutputStream output = new FileOutputStream(partial)) {
                copyVerified(input, output, release);
            }
            PackageInfo archive = activity.getPackageManager().getPackageArchiveInfo(partial.getPath(), 0);
            if (archive == null || !activity.getPackageName().equals(archive.packageName)
                    || archive.versionCode != release.versionCode || archive.versionCode <= installedVersion()
                    || !release.versionName.equals(archive.versionName))
                throw new IOException();
            if (!partial.renameTo(target)) throw new IOException();
            return target;
        } finally { if (connection != null) connection.disconnect(); partial.delete(); }
    }

    static void copyVerified(InputStream input, java.io.OutputStream output, Release release) throws Exception {
        MessageDigest hash = MessageDigest.getInstance("SHA-256");
        long total = 0, deadline = System.nanoTime() + 300_000_000_000L;
        byte[] buffer = new byte[32768];
        int count;
        while ((count = input.read(buffer)) != -1) {
            total += count;
            if (total > release.size || System.nanoTime() > deadline || Thread.currentThread().isInterrupted())
                throw new IOException();
            hash.update(buffer, 0, count);
            output.write(buffer, 0, count);
        }
        StringBuilder digest = new StringBuilder();
        for (byte value : hash.digest()) digest.append(String.format(java.util.Locale.ROOT, "%02x", value & 255));
        if (total != release.size || !digest.toString().equals(release.sha256)) throw new IOException();
    }

    static boolean allowsDownload(URL url) {
        if (!"https".equals(url.getProtocol()) || url.getUserInfo() != null
                || (url.getPort() != -1 && url.getPort() != 443)) return false;
        if ("github.com".equals(url.getHost())) {
            return url.getPath().startsWith("/Readiz/RandomGame/releases/download/")
                    || "/Readiz/RandomGame/releases/latest/download/random-game.apk.json".equals(url.getPath());
        }
        return "release-assets.githubusercontent.com".equals(url.getHost());
    }

    static HttpURLConnection connect(String address) throws Exception {
        URL url = new URL(address);
        for (int hop = 0; hop <= 5; hop++) {
            if (!allowsDownload(url)) throw new IOException("Invalid update origin");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setConnectTimeout(10000);
            connection.setReadTimeout(15000);
            connection.setInstanceFollowRedirects(false);
            connection.setUseCaches(false);
            connection.setRequestProperty("Cache-Control", "no-cache");
            connection.setRequestProperty("User-Agent", "ReadizCoffee/" + BuildConfig.VERSION_NAME);
            try {
                int status = connection.getResponseCode();
                if (status != 301 && status != 302 && status != 303 && status != 307 && status != 308)
                    return connection;
                String location = connection.getHeaderField("Location");
                if (location == null) throw new IOException("Missing redirect");
                url = new URL(url, location);
            } catch (Exception error) {
                connection.disconnect();
                throw error;
            }
            connection.disconnect();
        }
        throw new IOException("Too many update redirects");
    }

    boolean canInstall() {
        return Build.VERSION.SDK_INT < 26 || activity.getPackageManager().canRequestPackageInstalls();
    }

    private void installReady() {
        if (!resumed || closed || ready == null) return;
        if (!canInstall()) {
            dialog = new AlertDialog.Builder(activity).setTitle("업데이트 설치 허용")
                    .setMessage("다음 설정 화면에서 운빨망겜의 ‘이 출처 허용’을 켜고 돌아오면 설치를 계속합니다.")
                    .setPositiveButton("설정 열기", (d, which) -> {
                        dialog = null;
                        waitingPermission = true;
                        try { openPermissionSettings(); }
                        catch (Exception ignored) { waitingPermission = false; ready = null; showError("설치 설정을 열 수 없습니다. GitHub의 Readiz/RandomGame 최신 릴리스에서 APK를 직접 받아 주세요."); }
                    })
                    .setNegativeButton("나중에", (d, which) -> { dialog = null; ready = null; })
                    .setOnCancelListener(d -> { dialog = null; ready = null; }).create();
            dialog.show();
            return;
        }
        File file = ready;
        ready = null;
        try { openInstaller(file); }
        catch (Exception ignored) { showError("설치 화면을 열 수 없습니다. GitHub의 Readiz/RandomGame 최신 릴리스에서 APK를 직접 받아 주세요."); }
    }

    void openPermissionSettings() {
        activity.startActivity(new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                Uri.parse("package:" + activity.getPackageName())));
    }

    void openInstaller(File file) {
        Uri uri = FileProvider.getUriForFile(activity, activity.getPackageName() + ".updates", file);
        activity.startActivity(new Intent(Intent.ACTION_VIEW)
                .setDataAndType(uri, "application/vnd.android.package-archive")
                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION));
        // Android's package installer enforces the installed app's signing identity.
    }

    private void showDownloading() {
        if (!resumed) return;
        dismiss();
        dialog = new AlertDialog.Builder(activity).setTitle("업데이트 다운로드 중")
                .setMessage("파일을 받은 뒤 설치 화면을 엽니다.").setCancelable(false).create();
        dialog.show();
    }

    private void showError(String message) {
        if (!resumed || closed) return;
        dismiss();
        dialog = new AlertDialog.Builder(activity).setTitle("업데이트 안내").setMessage(message)
                .setPositiveButton("확인", (d, which) -> dialog = null)
                .setOnCancelListener(d -> dialog = null).create();
        dialog.show();
    }

    private void dismiss() { if (dialog != null) { dialog.dismiss(); dialog = null; } }

    void close() {
        closed = true;
        onPause();
        worker.shutdownNow();
        handler.removeCallbacksAndMessages(null);
    }

    static final class Release {
        final int versionCode;
        final String versionName, sha256;
        final long size;
        Release(JSONObject value) throws Exception {
            versionCode = value.getInt("versionCode");
            versionName = value.getString("versionName");
            sha256 = value.getString("sha256");
            size = value.getLong("size");
            if (!"com.readiz.randomgame".equals(value.getString("packageName")) || versionCode < 1
                    || !versionName.matches("[0-9]+\\.[0-9]+\\.[0-9]+")
                    || !sha256.matches("[a-f0-9]{64}") || size < 1 || size > MAX_SIZE)
                throw new IOException();
        }
        String apkUrl() { return RELEASES + "download/android-v" + versionName + "/random-game.apk"; }
    }
}
