'use strict';

var path = require('path');
var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var concat = require('gulp-concat');
var ejsmin = require('gulp-ejsmin');
var uglify = require('gulp-uglify');


//config paths
var build = {
	public: './www/public',
	views: './www/views',
	server: './www/server'
};

gulp.task('css-minify', function () {
    gulp.src('./public/css/*.css')
        .pipe(minifycss({keepBreaks: false}))
        .pipe(gulp.dest(build.public+'/css'));
});

gulp.task('js-minify', function () {
    gulp.src('./public/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(build.public+'/js'));
});

gulp.task('ejs-minify', function () {
    gulp.src('./views/*.ejs')
        .pipe(ejsmin({removeComment: true}))
        .pipe(gulp.dest(build.views));
    gulp.src('./views/bookmarks/*.ejs')
        .pipe(ejsmin({removeComment: true}))
        .pipe(gulp.dest(build.views + '/bookmarks'));
});

gulp.task('html-minify', function () {
    gulp.src('./views/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(build.views));
});


gulp.task('build',['css-minify','js-minify','ejs-minify', 'html-minify']);