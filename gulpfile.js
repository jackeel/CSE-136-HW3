'use strict';

var path = require('path');
var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var concat = require('gulp-concat');
var ejsmin = require('gulp-ejsmin');
var uglify = require('gulp-uglify');

var uncss = require('gulp-uncss');

//config paths
var build = {
	public: './www/public',
	views: './www/views',
	server: './www/server'
};

gulp.task('uncss-minify', function () {
    // Strip style.css
    gulp.src('./public/css/style.css')
        .pipe(uncss({
            html: ['./views/index.ejs', './views/bookmarks/edit.ejs'],
            ignore: ['#sidebar li a.inactive-folder', '#sidebar li a.active-folder', 'div#pagination a.active', 'div#pagination a:hover:not(.active)']
        }))
        .pipe(minifycss({keepBreaks: false}))
        .pipe(rename('style.css'))
        .pipe(gulp.dest(build.public+'/css'));

    // Strip signup.css
    gulp.src('./public/css/signup.css')
        .pipe(uncss({
            html: ['./views/login.ejs', './views/signup.ejs', './views/passwordReset.ejs', './views/404.html']
        }))
        .pipe(minifycss({keepBreaks: false}))
        .pipe(rename('signup.css'))
        .pipe(gulp.dest(build.public+'/css'));

    // Strip font-awesome css and re-minifies it
    gulp.src('./public/font-awesome/css/font-awesome.min.css')
        .pipe(uncss({
            html: ['./views/index.ejs']
        }))
        .pipe(minifycss({keepBreaks: false}))
        .pipe(rename('font-awesome.min.css'))
        .pipe(gulp.dest(build.public+'/font-awesome/css'));
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


gulp.task('build',['uncss-minify','js-minify','ejs-minify', 'html-minify']);