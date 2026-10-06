package com.readiz.randomgame;

import android.content.Context;
import android.os.Vibrator;
import android.provider.Settings;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.RuntimeEnvironment;
import org.robolectric.annotation.Config;
import static org.junit.Assert.*;
import static org.robolectric.Shadows.shadowOf;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = 28)
public class GameHapticsTest {
    @Test public void webDurationsBecomeOneNonRepeatingNativeWaveform() {
        assertArrayEquals(new long[]{0,28}, GameHaptics.parsePattern("28"));
        assertArrayEquals(new long[]{0,30,25,50}, GameHaptics.parsePattern("[30,25,50]"));
        assertArrayEquals(new long[]{}, GameHaptics.parsePattern("0"));
        assertArrayEquals(new long[]{}, GameHaptics.parsePattern("[]"));
    }
    @Test public void invalidAndExcessiveRequestsAreRejected() {
        for (String raw : new String[]{"null","{}","true","\"28\"","[-1]","[1.5]","201","[28]garbage","[200,200,200,200,200,200]","[1,1,1,1,1,1,1,1,1,1]"})
            assertNull(raw, GameHaptics.parsePattern(raw));
    }
    @Test public void backgroundAndCancellationCannotLeaveTheMotorRunning() {
        Context context = RuntimeEnvironment.getApplication();
        Vibrator motor = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
        shadowOf(motor).setHasVibrator(true);
        GameHaptics haptics = new GameHaptics(context);
        haptics.play("28");
        assertFalse(shadowOf(motor).isVibrating());
        haptics.setActive(true);
        haptics.play("[30,25,50]");
        assertTrue(shadowOf(motor).isVibrating());
        haptics.setActive(false);
        assertFalse(shadowOf(motor).isVibrating());
        haptics.play("100");
        assertFalse(shadowOf(motor).isVibrating());
        haptics.play("\"result\"");
        assertFalse(shadowOf(motor).isVibrating());
        haptics.setActive(true);
        haptics.play("\"result\"");
        assertTrue(shadowOf(motor).isVibrating());
        haptics.setActive(false);
        assertFalse(shadowOf(motor).isVibrating());
        haptics.setActive(true);
        haptics.play("\"result\"");
        haptics.play("0");
        assertFalse(shadowOf(motor).isVibrating());
    }
    @Test public void resultCuePlaysThreeLongPulsesWithoutRepeating() {
        assertResultCue();
    }
    @Test @Config(sdk = 23) public void resultCueAlsoWorksBeforeAmplitudeControl() {
        assertResultCue();
    }
    private void assertResultCue() {
        Context context = RuntimeEnvironment.getApplication();
        Vibrator motor = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
        shadowOf(motor).setHasVibrator(true);
        GameHaptics haptics = new GameHaptics(context);
        haptics.setActive(true);
        haptics.play("\"result\"");
        assertTrue(shadowOf(motor).isVibrating());
        assertArrayEquals(new long[]{0,180,70,200,70,200}, shadowOf(motor).getPattern());
        assertEquals(-1, shadowOf(motor).getRepeat());
    }
    @Test public void resultCueRespectsDevicePreferenceAndRejectsUnknownCommands() {
        Context context = RuntimeEnvironment.getApplication();
        Vibrator motor = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
        shadowOf(motor).setHasVibrator(true);
        GameHaptics haptics = new GameHaptics(context);
        haptics.setActive(true);
        for (String raw : new String[]{"result", "\"result\"garbage", "\"strong\"", "{\"result\":true}"}) {
            haptics.play(raw);
            assertFalse(raw, shadowOf(motor).isVibrating());
        }
        Settings.System.putInt(context.getContentResolver(), Settings.System.HAPTIC_FEEDBACK_ENABLED, 0);
        haptics.play("\"result\"");
        assertFalse(shadowOf(motor).isVibrating());
    }
}
