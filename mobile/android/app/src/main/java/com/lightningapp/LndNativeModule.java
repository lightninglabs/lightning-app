package com.lightningapp;

import android.content.res.AssetManager;
import android.os.FileObserver;
import android.util.Base64;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

import lndmobile.Callback;
import lndmobile.Lndmobile;
import lndmobile.RecvStream;
import lndmobile.SendStream;


public class LndNativeModule extends ReactContextBaseJavaModule {

    private static final String streamEventName = "streamEvent";
    private static final String streamIdKey = "streamId";
    private static final String respB64DataKey = "data";
    private static final String respErrorKey = "error";
    private static final String respEventTypeKey = "event";
    private static final String respEventTypeData = "data";
    private static final String respEventTypeError = "error";
    private static final String logEventName = "logs";

    private Map<String, SendStream> activeStreams = new HashMap<>();
    private Map<String, Method> syncMethods = new HashMap<>();
    private Map<String, Method> streamMethods = new HashMap<>();

    private FileObserver logObserver;

    private static boolean isReceiveStream(Method m) {
        return m.toString().contains("RecvStream");
    }

    private static boolean isSendStream(Method m) {
        return m.toString().contains("SendStream");
    }

    private static boolean isStream(Method m) {
        return isReceiveStream(m) || isSendStream(m);
    }

    public LndNativeModule(ReactApplicationContext reactContext) {
        super(reactContext);

        Method[] methods = Lndmobile.class.getDeclaredMethods();
        for (Method m : methods) {
            String name = m.getName();
            name = name.substring(0, 1).toUpperCase() + name.substring(1);
            if (isStream(m)) {
                streamMethods.put(name, m);
            } else {
                syncMethods.put(name, m);
            }
        }
    }

    @Override
    public String getName() {
        return "LndReactModule";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        return constants;
    }

    class NativeCallback implements Callback {
        Promise promise;

        NativeCallback(Promise promise) {
            this.promise = promise;
        }

        @Override
        public void onError(Exception e) {
            promise.reject("LndNativeModule", e);
        }

        @Override
        public void onResponse(byte[] bytes) {
            String b64 = "";
            if (bytes != null && bytes.length > 0) {
                b64 = Base64.encodeToString(bytes, Base64.NO_WRAP);
            }

            WritableMap params = Arguments.createMap();
            params.putString(respB64DataKey, b64);

            promise.resolve(params);
        }
    }

    class ReceiveStream implements RecvStream {
        String streamID;

        ReceiveStream(String id) {
            this.streamID = id;
        }

        @Override
        public void onError(Exception e) {
            WritableMap params = Arguments.createMap();
            params.putString(streamIdKey, streamID);
            params.putString(respEventTypeKey, respEventTypeError);
            params.putString(respErrorKey, e.getLocalizedMessage());
            getReactApplicationContext()
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(streamEventName, params);
        }

        @Override
        public void onResponse(byte[] bytes) {
            String b64 = "";
            if (bytes != null && bytes.length > 0) {
                b64 = Base64.encodeToString(bytes, Base64.NO_WRAP);
            }

            WritableMap params = Arguments.createMap();
            params.putString(streamIdKey, streamID);
            params.putString(respEventTypeKey, respEventTypeData);
            params.putString(respB64DataKey, b64);
            getReactApplicationContext()
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(streamEventName, params);
        }
    }

    @ReactMethod
    public void start(final Promise promise) {
        File appDir = getReactApplicationContext().getFilesDir();
        copyConfig(appDir);

        final String logDir = appDir + "/logs/bitcoin/testnet";
        final String logFile = logDir + "/lnd.log";

        FileInputStream stream = null;
        while (true) {
            try {
                stream = new FileInputStream(logFile);
            } catch (FileNotFoundException e) {
                File dir = new File(logDir);
                dir.mkdirs();
                File f = new File(logFile);
                try {
                    f.createNewFile();
                    continue;
                } catch (IOException e1) {
                    e1.printStackTrace();
                    return;
                }
            }
            break;
        }

        final InputStreamReader istream = new InputStreamReader(stream);
        final BufferedReader buf = new BufferedReader(istream);
        try {
            readToEnd(buf, false);
        } catch (IOException e) {
            e.printStackTrace();
            return;
        }

        logObserver = new FileObserver(logFile) {
            @Override
            public void onEvent(int event, String file) {
                if(event != FileObserver.MODIFY) {
                    return;
                }
                try {
                    readToEnd(buf, true);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        };
        logObserver.startWatching();
        Log.i("LndNativeModule", "Started watching " + logFile);

        final String args = "--lnddir=" + appDir;
        Log.i("LndNativeModule", "Starting LND with args " + args);

        Runnable startLnd = new Runnable() {
            @Override
            public void run() {
                Lndmobile.start(args, new NativeCallback(promise));
            }
        };
        new Thread(startLnd).start();
    }

    private void readToEnd(BufferedReader buf, boolean emit) throws IOException {
        String s = "";
        while ( (s = buf.readLine()) != null ) {
            if (!emit) {
                continue;
            }
            getReactApplicationContext()
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(logEventName, s);
        }
    }

    private void copyConfig(File appDir) {
        File conf = new File(appDir, "lnd.conf");
        AssetManager am = getCurrentActivity().getAssets();

        try (InputStream in = am.open("lnd.conf")) {
            copy(in, conf);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void copy(InputStream in, File dst) throws IOException {
        try (OutputStream out = new FileOutputStream(dst)) {
            byte[] buf = new byte[1024];
            int len;
            while ((len = in.read(buf)) > 0) {
                out.write(buf, 0, len);
            }
        }
    }

    @ReactMethod
    public void sendCommand(String method, String msg, final Promise promise) {
        Method m = syncMethods.get(method);
        if (m == null) {
            promise.reject("LndNativeModule", "method not found");
            return;
        }

        byte[] b = Base64.decode(msg, Base64.NO_WRAP);

        try {
            m.invoke(null, b, new NativeCallback(promise));
        } catch (IllegalAccessException | InvocationTargetException e) {
            e.printStackTrace();
            promise.reject("LndNativeModule", e);
        }
    }

    @ReactMethod
    public void sendStreamCommand(String method, String streamId, String msg) {
        Method m = streamMethods.get(method);
        if (m == null) {
            return;
        }
        ReceiveStream r = new ReceiveStream(streamId);

        try {
            if (isSendStream(m)) {
                Object sendStream = m.invoke(null, r);
                this.activeStreams.put(streamId, (SendStream) sendStream);
            } else {
                byte[] b = Base64.decode(msg, Base64.NO_WRAP);
                m.invoke(null, b, r);
            }
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void sendStreamWrite(String streamId, String msg) {
        SendStream stream = activeStreams.get(streamId);
        if (stream == null) {
            return;
        }

        byte[] b = Base64.decode(msg, Base64.NO_WRAP);
        try {
            stream.send(b);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}