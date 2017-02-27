module.exports = {
  "bundles": {
    "dist/app-build": {
      "includes": [
        "[*.js]",
        "*.html!text",
        "*.css!text"
      ],
      "options": {
        "inject": true,
        "minify": true,
        "depCache": true,
        "rev": false
      }
    },
    "dist/aurelia": {
      "includes": [
        "aurelia-framework",
        "aurelia-bootstrapper",
        "aurelia-fetch-client",
        "aurelia-router",
        "aurelia-animator-css",
        "aurelia-templating-binding",
        "aurelia-polyfills",
        "aurelia-templating-resources",
        "aurelia-templating-router",
        "aurelia-loader-default",
        "aurelia-history-browser",
        "aurelia-logging-console",
        'aurelia-materialize-bridge',
        'aurelia-materialize-bridge/**/*.js',
        'aurelia-materialize-bridge/**/*.html!text',
        'aurelia-materialize-bridge/**/*.css!text',
        'aurelia-dialog',
        'oribella-aurelia-sortable',
        'oribella-aurelia-sortable/**/*.js',
        'text',
        'materialize',
        'trumbowyg',
        'trumbowyg/**/*.css!text',
        'font-awesome/**/*.css!text',
        'cropperjs',
        'pickerjs',
        'moment'
      ],
      "options": {
        "inject": true,
        "minify": true,
        "depCache": false,
        "rev": false
      }
    }
  }
};
