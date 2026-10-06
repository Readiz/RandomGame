package com.readiz.randomgame;

import android.net.Uri;

final class AssetPolicy {
    static final String ORIGIN = "https://appassets.androidplatform.net";
    static final String HOME = ORIGIN + "/assets/game/index.html";

    static boolean allowsResource(Uri uri) {
        String path = uri.getPath();
        return "https".equals(uri.getScheme())
                && "appassets.androidplatform.net".equals(uri.getAuthority())
                && uri.getQuery() == null && uri.getFragment() == null
                && path != null && path.startsWith("/assets/game/")
                && !path.contains("..") && !path.contains("\\");
    }

    static boolean allowsMessage(Uri origin, boolean mainFrame, String pageUrl) {
        return mainFrame && ORIGIN.equals(origin.toString()) && HOME.equals(pageUrl);
    }
}
