var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function() {
    return gulp.src('assets/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass()) // Using gulp-sass
        // .pipe(cssnano())  
        .pipe(concat('custom.css'))
        .pipe(autoprefixer({
            browsers : ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('assets/css'))

    .pipe(browserSync.reload({
        stream: true
    }))
});

gulp.task('images', function() {
    return gulp.src('assets/images/**/*.+(png|jpg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
    return gulp.src('assets/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean:dist', function() {
    return del.sync('dist');
});

gulp.task('useref', function() {
    return gulp.src('assets/*.html')
        .pipe(useref())
        // Minifies only if it's a CSS file
        .pipe(gulpIf('*.css', cssnano()))
        // Minifies only if it's a JavaScript file
        .pipe(gulpIf('*.js', uglify().on('error', function(error) {
            // we have an error
            console.log(error); 
          })))
        .pipe(gulp.dest('dist'))
});



gulp.task('watch', ['browserSync', 'sass'], function() {
    gulp.watch('assets/scss/*.scss', ['sass']);
    gulp.watch('assets/*.html', browserSync.reload);
    gulp.watch('assets/js/*.js', browserSync.reload);
    // Other watchers
});

gulp.task('build', function(callback) {
    runSequence('clean:dist', ['useref', 'images', 'fonts'],
        callback
    )
})

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: './assets/'
        },
    })
})