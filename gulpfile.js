//;off
var gulp = require('gulp');
var cssmin = require('gulp-cssmin');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var version = require('gulp-version-number');
var htmlReplace = require('gulp-html-replace');
var connect = require('gulp-connect');
	
var CONF = {
	src : 'src',
	output : 'dest',
    release : 'release',
    demo : 'release'
};

gulp.task('default');

gulp.task('server', function() {
    connect.server({
        port : 80,
        root : CONF.src,
        //livereload : true
    });
});

/**
 * Release to external
 * https://svn.baidu.com/babel/trunk/neisou/neisouweb/src/main/webapp/WEB-INF/jsp/hi/contact
 */
gulp.task('release', function(){
    gulp.src(CONF.src + '/*.html')
        .pipe(htmlReplace({
            'css': '/web/hicontact/style/css/contact.min.css',
            'js': {
                src : '/web/hicontact/js/',
                tpl : '<script type="text/javascript" src="%s%f.min.js"></script>'
                
            },
            'jsp_charset' : {
                src: null,
                tpl: '<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8" %>'
            }
        }))
        .pipe(version({
            'value' : '%MDS%',
            'append' : {
                'key' : 'version',
                'to' : ['css', 'js']
            },
            'output' : {
                'file' : CONF.release + '/html/version.json'
            }
        }))
        .pipe(rename({
            extname:'.jsp'
        }))
        .pipe(gulp.dest(CONF.release + '/html/'));
        
    
    gulp.src(CONF.src + '/style/css/*.css')
        .pipe(concat('contact.min.css'))
        .pipe(cssmin())
        .pipe(gulp.dest(CONF.release + '/resource/style/css/'));
        
    gulp.src(
        [
            CONF.src + '/js/zepto.min.js',
            CONF.src + '/js/zepto.data.min.js',
            CONF.src + '/js/nativeFrame.js',
            CONF.src + '/js/index.js'
        ])
        .pipe(concat('index.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(CONF.release + '/resource/js/'));
        
    gulp.src(
        [
            CONF.src + '/js/zepto.min.js',
            CONF.src + '/js/contribute.js'
        ])
        .pipe(concat('contribute.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(CONF.release + '/resource/js/'));
        
    gulp.src(CONF.src + '/style/image/**/*')
        .pipe(gulp.dest(CONF.release + '/resource/style/image'));
});