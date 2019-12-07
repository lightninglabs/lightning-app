package com.lightningapp;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.concurrent.Executors;
import androidx.biometric.BiometricPrompt;

public class FingerprintDialogModule extends ReactContextBaseJavaModule {
    public FingerprintDialogModule(ReactApplicationContext reactContext) {
        super(reactContext); //required by React Native
    }

    @Override
    //getName is required to define the name of the module represented in JavaScript
    public String getName() {
        return "FingerprintDialog";
    }

    @ReactMethod
    public void getBiometricPrompt() {
        val executor = Executors.newSingleThreadExecutor();
        BiometricPrompt.Builder()
          .setTitle("Use your fingerprint to unlock")
          .setSubtitle("Lightning App requires authentication to continue")
          .setDescription("Use your fingerprint to unlock the app or press cancel and enter in your pin")
          .setNegativeButton("Cancel")
          .build();
    }
}
