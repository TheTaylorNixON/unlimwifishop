'use strict';

const gulp = require('gulp'),
      del = require('del'),
      browserSync = require('browser-sync').create(),
      sass = require('gulp-sass'),
      sassGlob= require('gulp-sass-glob'),
      srcmaps = require('gulp-srcmaps'),
      autoprefixer = require('gulp-autoprefixer'),
      cssunit = require('gulp-css-unit'),
      normalize = require('node-normalize-scss');

gulp.task('clean', function () {
    return del('./app')
});

gulp.task('copy:fonts', function() {
    return gulp.src('./src/fonts/**/*.*')
        .pipe(gulp.dest('./app/fonts'));
});

gulp.task('copy:images', function() {
    return gulp.src('./src/img/**/*.*')
        .pipe(gulp.dest('./app/img'));
});

gulp.task('copy:js', function() {
    return gulp.src('./src/js/**/*.js')
        .pipe(gulp.dest('./app/js'));
});

gulp.task('copy:html', function() {
    return gulp.src('./src/**/*.html')
        .pipe(gulp.dest('./app/'));
});

gulp.task('css', function () {
    return gulp.src('./src/sass/app.scss')
        .pipe(srcmaps.init())
        .pipe(sassGlob())
        .pipe(sass({includePaths: require('node-normalize-scss').includePaths}).on('error', sass.logError))
        .pipe(autoprefixer({ browsers: ['last 3 versions'], }))
        .pipe(cssunit({ type: 'px-to-rem', rootSize: 16 }))
        .pipe(srcmaps.write())
        .pipe(gulp.dest('./app/css'))
});

gulp.task('serve', function() {
    browserSync.init({
        open: false,
        notify: false,
        directory: true,
        // index: 'about.html',
        server: {
            baseDir: './app'
        }
    });
    browserSync.watch('./app/**/*.*', browserSync.reload);
});

gulp.task('watch', function () {
    gulp.watch('./src/sass/**/*.scss', gulp.series('css'));
    gulp.watch('./src/**/*.html', gulp.series('copy:html'));
    gulp.watch('./src/images/**/*.*', gulp.series('copy:images'));
    gulp.watch('./src/fonts/**/*.*', gulp.series('copy:fonts'));
    gulp.watch('./src/js/**/*.*', gulp.series('copy:js'));
});


gulp.task('default', gulp.series(
    'clean',
    gulp.parallel(
        'copy:images',
        'copy:fonts',
        'copy:js',
        'copy:html'
    ),
    gulp.parallel(
        'css'
    ),
    gulp.parallel(
        'watch',
        'serve'
    )
));