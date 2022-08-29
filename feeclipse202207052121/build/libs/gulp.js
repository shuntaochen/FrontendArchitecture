const gulp = require('gulp')
const gulpUtil = require('gulp-util')
const path = require('path')
const sass = require('gulp-sass')(require('sass'))
const shell = require('gulp-shell')
const browsersync = require('browser-sync').create('namedefault')
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
// var bslucee = require('browser-sync').create('browserSyncLucee');

const wpk = require('./webpack')



function enter() {
    return new Promise(resolve => {
        gulpUtil.log('src *.scss', 'pipe to dest css', gulpUtil.colors.magenta('run gulp tasks'));
        console.log('path is:', path.resolve('.'));
        resolve()
    })
}

function ugly() {
    return new Promise(resolve => {
        gulp.src('calo/*.js').pipe(concat('calo.min.js')).pipe(uglify()).pipe(gulp.dest('dist'))
        resolve()
    })
}

function css() {
    return new Promise(resolve => {
        console.log('building sass files');
        gulp.src("src/htmls/abcs.css").pipe(cleanCSS({ compatibility: 'ie8' }))
            .pipe(gulp.dest('dist/'))
        resolve()
    })
}

function scss() {
    return new Promise(resolve => {
        console.log('building sass files');
        gulp.src("sass/build.scss")
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('dist/css/'))
        resolve()
    })
}


function dorebuild(cb) {
    console.log('path watch is:', path.resolve('.'))
    // wpk.run()
    scss()
    // css()
    cb()
}

function watch() {
    return new Promise(resolve => {
        gulp.watch(['sass/**/*.scss', 'src/**/*.html', 'src/**/*.js', 'src/**/*.css', "*.js"], dorebuild).on('change', function () {
            browsersync.reload()
        })
        resolve()
    })

}

function httpserver() {
    return new Promise(resolve => {
        console.log('httpserver root:', path.resolve('.'));
        gulp.src('dist/*').pipe(shell('http-server ./dist'))
        resolve()
    })
}

function browserSyn() {
    return new Promise(resolve => {
        browsersync.init({
            proxy: "localhost:8080/",
            browser: "google chrome",
            reloadOnRestart: true
        });

        // bslucee.init({
        //     proxy: "localhost:8888/myproject",
        //     browser: "vivaldi",
        //     port: 3010,
        //     reloadOnRestart: true,
        //     ui: {
        //         port: 3011
        //     }
        // });
        resolve()
    })
}




module.exports = {
    enter, scss, css, ugly, watch, httpserver, browserSyn
}