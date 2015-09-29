var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var karma = require('gulp-karma');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function (done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function () {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function () {
  return bower.commands.install()
    .on('log', function (data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function (done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

/**
 * JSHINT
 * Checks the source code with some defined guidelines from the .jshintrc
 */
gulp.task('jshint', function () {
  return gulp
    .src('www/main/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

/**
 * TEST UNIT
 * Description
 */
var karmaConfigFactory = require(process.cwd() + '/karma-unit.config.js');
var karmaConfig;
karmaConfigFactory({
  set: function (c) {
    karmaConfig = c;
  }
});
gulp.task('test', function () {
  return gulp
    .src(karmaConfig.files)
    .pipe(karma({
      configFile: 'karma-unit.config.js',
      action:     'run'
    }))
    .on('error', function (err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});
