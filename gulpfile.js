var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var cssmin = require('gulp-cssmin');
var concatCss = require('gulp-concat-css');

gulp.task('scripts', function() {
  return gulp.src(['./src/js/mapbox.js', './src/js/awesome-markers.js', './src/js/locate.js', './src/js/fullscreen.min.js'])
    .pipe(uglify())
    .pipe(concat('mapbox.min.js'))
    .pipe(gulp.dest('build/js'));
});
gulp.task('move', function(){
	return gulp.src(['./src/js/open-map.js'])
	.pipe(gulp.dest('build/js/'));
});

gulp.task('img', function () {
	return gulp.src('./src/css/images/*')
	.pipe(imagemin({optimizationLevel: 5}))
	.pipe(gulp.dest('./build/css/images'))
});

gulp.task('css', function () {
	return gulp.src(['./src/css/mapbox.css', './src/css/locate.css', './src/css/fullscreen.css', './src/css/awesome-markers.css'])
	.pipe(concatCss('mapbox.min.css'))
	.pipe(cssmin())
	.pipe(gulp.dest('./build/css/'))
});

gulp.task('default', ['scripts', 'img', 'css', 'move']);