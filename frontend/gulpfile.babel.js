var gulp = require('gulp');
var mergeStream = require('merge-stream');
var plugins = require('gulp-load-plugins')();
var webpack = require('webpack-stream');

function testAssets(options = {}) {
  var config = Object.assign(require('./config/webpack')('test'), options);
  const javascript = gulp.src(['spec/**/*.spec.js']).pipe(webpack(config))
  return mergeStream(javascript, gulp.src(require.resolve('phantomjs-polyfill/bind-polyfill')));
}

gulp.task('spec-app', function() {
  return testAssets({watch: false})
      .pipe(plugins.jasmineBrowser.specRunner({console: true}))
      .pipe(plugins.jasmineBrowser.headless({driver: 'phantomjs'}));
});

gulp.task('spec', function(callback) {
  runSequence('spec-server', 'spec-app', callback);
});

gulp.task('jasmine', function() {
  var plugin = new (require('gulp-jasmine-browser/webpack/jasmine-plugin'))();
  return testAssets({plugins: [plugin]})
      .pipe(plugins.jasmineBrowser.specRunner())
      .pipe(plugins.jasmineBrowser.server({whenReady: plugin.whenReady}));
});
