package com.drip;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.rnfs.RNFSPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import cl.json.RNSharePackage;
import cl.json.ShareApplication;
import io.realm.react.RealmReactPackage;
import com.horcrux.svg.SvgPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication, ShareApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNFSPackage(),
            new ReactNativeDocumentPicker(),
            new RNSharePackage(),
            new RealmReactPackage(),
            new SvgPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
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

  @Override
    public String getFileProviderAuthority() {
      return "com.drip.provider";
    }
}
