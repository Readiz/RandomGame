package com.readiz.randomgame;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewCompat;
import androidx.webkit.WebViewFeature;
import java.io.ByteArrayInputStream;
import java.util.Collections;

public final class MainActivity extends Activity {
    private WebView webView;
    private GameHaptics haptics;
    private AndroidUpdates updates;

    @SuppressLint("SetJavaScriptEnabled")
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(12, 13, 15));
        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(12, 13, 15));
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        webView.setVerticalScrollBarEnabled(false);
        webView.setHorizontalScrollBarEnabled(false);
        root.addView(webView, new FrameLayout.LayoutParams(-1, -1));
        // Native layout owns cutout padding; consume it so CSS cannot apply it twice.
        ViewCompat.setOnApplyWindowInsetsListener(root, (view, insets) -> {
            Insets cutout = insets.getInsets(WindowInsetsCompat.Type.displayCutout());
            view.setPadding(cutout.left, cutout.top, cutout.right, cutout.bottom);
            return WindowInsetsCompat.CONSUMED;
        });
        setContentView(root);
        hideSystemBars();

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setSupportZoom(false);
        settings.setUseWideViewPort(true);
        settings.setUserAgentString(settings.getUserAgentString() + " ReadizCoffee/" + BuildConfig.VERSION_NAME);
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);

        haptics = new GameHaptics(this);
        if (WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) {
            WebViewCompat.addWebMessageListener(webView, "ReadizHaptics",
                    Collections.singleton(AssetPolicy.ORIGIN), (view, message, origin, mainFrame, reply) -> {
                if (AssetPolicy.allowsMessage(origin, mainFrame, view.getUrl())) haptics.play(message.getData());
            });
        }
        WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this)).build();
        webView.setWebViewClient(new WebViewClient() {
            @Override public void onPageFinished(WebView view, String url) {
                if (updates != null) updates.onPageFinished();
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return !AssetPolicy.HOME.equals(request.getUrl().toString());
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return !AssetPolicy.HOME.equals(url);
            }
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                if ("GET".equals(request.getMethod()) && AssetPolicy.allowsResource(request.getUrl())) {
                    WebResourceResponse resource = loader.shouldInterceptRequest(request.getUrl());
                    if (resource != null) return resource;
                }
                return new WebResourceResponse("text/plain", "UTF-8", 403, "Blocked", Collections.emptyMap(), new ByteArrayInputStream(new byte[0]));
            }
        });
        updates = new AndroidUpdates(this, webView);
        webView.loadUrl(AssetPolicy.HOME);
    }

    private void hideSystemBars() {
        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(getWindow(), webView);
        controller.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
        controller.hide(WindowInsetsCompat.Type.systemBars());
    }
    @Override public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus && webView != null) hideSystemBars();
    }
    private void reportVisibility(boolean hidden) {
        webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('readiz-app-visibility',{detail:{hidden:" + hidden + "}}))", null);
    }
    @Override protected void onResume() {
        super.onResume();
        if (webView != null) {
            webView.onResume();
            reportVisibility(false);
            haptics.setActive(true);
        }
        if (updates != null) updates.onResume();
    }
    @Override protected void onPause() {
        if (updates != null) updates.onPause();
        if (webView != null) {
            haptics.setActive(false);
            reportVisibility(true);
            webView.onPause();
        }
        super.onPause();
    }
    @Override protected void onDestroy() {
        if (updates != null) updates.close();
        if (haptics != null) haptics.setActive(false);
        if (webView != null) {
            ((FrameLayout) webView.getParent()).removeView(webView);
            webView.destroy();
        }
        super.onDestroy();
    }
}
