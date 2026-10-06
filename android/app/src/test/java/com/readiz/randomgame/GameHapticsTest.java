package com.readiz.randomgame;

import android.content.Context;
import android.os.Vibrator;
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
        haptics.setActive(true);
        haptics.play("28");
        haptics.play("0");
        assertFalse(shadowOf(motor).isVibrating());
    }
}
