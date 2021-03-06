package com.homemade;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.airbnb.android.react.lottie.LottiePackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.marianhello.react.BackgroundGeolocationPackage;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.rssignaturecapture.RSSignatureCapturePackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.auth0.lock.react.LockReactPackage;
import com.imagepicker.ImagePickerPackage;
import com.rnfs.RNFSPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new LottiePackage(),
            new LinearGradientPackage(),
            new BackgroundGeolocationPackage(),
            new RNGeocoderPackage(),
            new VectorIconsPackage(),
            new RSSignatureCapturePackage(),
            new MapsPackage(),
            new LockReactPackage(),
            new ImagePickerPackage(),
            new RNFSPackage(),
            new RNFetchBlobPackage(),
            new RCTCameraPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
