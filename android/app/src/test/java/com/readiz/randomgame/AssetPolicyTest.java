package com.readiz.randomgame;

import android.net.Uri;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;
import static org.junit.Assert.*;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = 28)
public class AssetPolicyTest {
    @Test public void bundledResourcesHaveOneOriginAndCannotTraverseAssets() {
        assertTrue(AssetPolicy.allowsResource(Uri.parse(AssetPolicy.HOME)));
        assertTrue(AssetPolicy.allowsResource(Uri.parse(AssetPolicy.ORIGIN + "/assets/game/assets/main.js")));
        for (String url : new String[]{"http://appassets.androidplatform.net/assets/game/index.html", "https://evil.test/assets/game/index.html", "https://u@appassets.androidplatform.net/assets/game/index.html", "file:///android_asset/game/index.html", AssetPolicy.ORIGIN + "/assets/game/../private", AssetPolicy.ORIGIN + "/assets/game/%2e%2e/private", AssetPolicy.ORIGIN + "/assets/other/index.html", AssetPolicy.HOME + "?url=https://evil.test"})
            assertFalse(url, AssetPolicy.allowsResource(Uri.parse(url)));
    }
    @Test public void onlyTheBundledMainFrameCanSendHaptics() {
        assertTrue(AssetPolicy.allowsMessage(Uri.parse(AssetPolicy.ORIGIN), true, AssetPolicy.HOME));
        assertFalse(AssetPolicy.allowsMessage(Uri.parse(AssetPolicy.ORIGIN), false, AssetPolicy.HOME));
        assertFalse(AssetPolicy.allowsMessage(Uri.parse("https://evil.test"), true, AssetPolicy.HOME));
        assertFalse(AssetPolicy.allowsMessage(Uri.parse(AssetPolicy.ORIGIN), true, "https://evil.test/"));
    }
}
