package com.readiz.randomgame;

import android.content.Context;
import android.media.AudioAttributes;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.provider.Settings;
import org.json.JSONArray;
import org.json.JSONTokener;

final class GameHaptics {
    private final Context context;
    private final Vibrator vibrator;
    private boolean active;

    GameHaptics(Context context) {
        this.context = context;
        vibrator = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
    }

    void setActive(boolean value) {
        active = value;
        if (!value) cancel();
    }

    void cancel() {
        if (vibrator != null) vibrator.cancel();
    }

    void play(String raw) {
        // A named, fixed result cue is the only request allowed to use full amplitude.
        boolean result = "\"result\"".equals(raw);
        long[] pattern = result ? new long[]{0, 180, 70, 200, 70, 200} : parsePattern(raw);
        if (pattern == null || vibrator == null) return;
        if (pattern.length == 0) { cancel(); return; }
        if (!active || !vibrator.hasVibrator()
                || Settings.System.getInt(context.getContentResolver(), Settings.System.HAPTIC_FEEDBACK_ENABLED, 1) == 0) return;
        try {
            AudioAttributes attributes = new AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_ASSISTANCE_SONIFICATION)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION).build();
            if (Build.VERSION.SDK_INT >= 26) {
                VibrationEffect effect = result
                        ? VibrationEffect.createWaveform(pattern, new int[]{0, 255, 0, 255, 0, 255}, -1)
                        : VibrationEffect.createWaveform(pattern, -1);
                vibrator.vibrate(effect, attributes);
            } else vibrator.vibrate(pattern, -1, attributes);
        } catch (IllegalArgumentException | SecurityException ignored) { }
    }

    static long[] parsePattern(String raw) {
        if (raw == null || raw.length() > 256) return null;
        try {
            JSONTokener parser = new JSONTokener(raw);
            Object value = parser.nextValue();
            if (parser.nextClean() != 0) return null;
            JSONArray values = value instanceof JSONArray ? (JSONArray) value : new JSONArray().put(value);
            if (values.length() > 9) return null;
            long[] waveform = new long[values.length() + 1];
            long total = 0;
            for (int i = 0; i < values.length(); i++) {
                Object item = values.get(i);
                if (!(item instanceof Number)) return null;
                double duration = ((Number) item).doubleValue();
                if (!Double.isFinite(duration) || duration < 0 || duration > 200 || duration != Math.floor(duration)) return null;
                waveform[i + 1] = (long) duration;
                total += (long) duration;
            }
            if (total > 1000) return null;
            return total == 0 ? new long[0] : waveform;
        } catch (Exception ignored) { return null; }
    }
}
