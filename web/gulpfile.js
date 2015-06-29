var gulp = require('gulp');
var reactify = require('reactify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var open = require('gulp-open');
var inject = require('gulp-inject');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var util = require('gulp-util');
var del = require('del');

var paths = {
  js : 'src/javascripts/**/*.js',
  css : 'src/styles/**/*.scss',
  views : 'src/views/**/*.jsx',
  js_build : 'build/javascripts/**/*.js',
  css_build : 'build/styles/**/*.css'
};

var getBundleName = function () {
  var version = require('./package.json').version;
  var name = require('./package.json').name;
  return version + '.' + name;
};

gulp.task('clean', function (cb) {
  return del([
    paths.js_build,
    paths.css_build,
    'build/index.html'
    ], cb);
});

gulp.task('build-styles', function () {
  return gulp.src(paths.css)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/styles'));
});

gulp.task('build-javascripts',function(){
  var bundler = browserify({
    entries : ['./src/javascripts/main.js'],
    transform: [reactify],
    debug : true,
    extensions : ['jsx']
  });

  return bundler
    .bundle()
    .pipe(source(getBundleName() + '.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build/javascripts/'));
});

gulp.task('copy-index',function(){
  return gulp.src('./src/index.html')
    .pipe(gulp.dest('./build'));
});

gulp.task('inject-client',function(){
  return gulp.src('./build/index.html')
    .pipe(inject(gulp.src([paths.js_build,paths.css_build],{read: false}),{
      relative:true
    }))
    .pipe(gulp.dest('./build'));
});

// In later versions of grunt, we'll be able to run things in series. But at the time of writing, multiple injects will clobber each other, so we'll use run-sequence to help us out.
gulp.task('inject',function(callback){
  runSequence('copy-index','inject-client',callback);
});

gulp.task('open-index',function(){
  return gulp.src('./build/index.html')
    .pipe(open());
});

gulp.task('build',function(){
    runSequence('clean','build-styles','build-javascripts','inject');
});

gulp.task('watch',['build'],function(){
  return watch([
    paths.js,
    paths.css,
    paths.views
  ],function(){
    runSequence('build','open-index');
  });
});

gulp.task('start',['watch']);
