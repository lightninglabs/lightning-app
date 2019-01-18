#!/bin/bash

./gradlew ${1:-installDevMinSdkDevKernelDebug} --stacktrace && adb shell am start -n engineering.lightning.LightningApp/host.exp.exponent.MainActivity
