'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var babel = require('gulp-babel');
var del = require('del');
var webpack = require('webpack');
var gwebpack = require('gulp-webpack');
var WebpackDevServer = require("webpack-dev-server");

var eslint= require('gulp-eslint');
var karma = require('karma').server;

var webpackDemoConfig = require('./demo/webpack.demo.config.js');

gulp.task('clean', function(cb){
  del(['dist'], cb)
});

gulp.task("babel", ['clean'], function() {
  return gulp.src('lib/*.js*')
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});

gulp.task('demo', ['build'], function(callback) {
  var compiler = webpackDemoConfig;

  new WebpackDevServer(compiler, {
      contentBase: './demo',
      hot: true,
      publicPath: '/demo/assets/',
      stats: {
        colors: true
      }
  }).listen(8081, "localhost", function(err) {
    if(err) throw new gutil.PluginError("webpack-dev-server", err);
    gutil.log("[demo]", "http://localhost:8081/");
  });
});

gulp.task('lint', function () {
  return gulp.src(['lib/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
});


gulp.task("karma", ['lint'], function() {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  });
});

gulp.task('test', ['karma']);
gulp.task('build', ['lint', 'clean', 'babel']);
gulp.task('default', ['demo']);
