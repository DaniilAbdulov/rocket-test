const { configure } = require('quasar/wrappers');
module.exports = configure(function (/* ctx */) {
  return {
    eslint: {
      warnings: true,
      errors: true,
    },
    // boot: [
    //     'axios',
    // ],
    css: ['app.scss'],
    extras: ['roboto-font', 'material-icons'],
    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
    build: {
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node16',
      },
      vueRouterMode: 'hash', // available values: 'hash', 'history'
    },
    devServer: {
      open: true,
    },
    framework: {
      config: {},
      plugins: [],
    },
    animations: [],
    ssr: {
      pwa: false,
      prodPort: 3000,
      middlewares: [
        'render', // keep this as last one
      ],
    },
    pwa: {
      workboxMode: 'generateSW', // or 'injectManifest'
      injectPwaMetaTags: true,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false,
    },
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },
    capacitor: {
      hideSplashscreen: true,
    },
    electron: {
      inspectPort: 5858,
      bundler: 'packager', // 'packager' or 'builder'
      packager: {},
      builder: {
        appId: 'my-package',
      },
    },
    bex: {
      contentScripts: ['my-content-script'],
    },
  };
});
