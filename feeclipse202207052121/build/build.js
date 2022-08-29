require('./global/global')
require('dotenv').config()
const fs = require('fs')

const lib = {}
lib.start = new Promise(function (resolve) {
    resolve()
})
const dirPath = __dirname + '/libs';
const helpers = fs.readdirSync(dirPath)
helpers.forEach(helper => {
    lib[helper.split('.js')[0]] = require('./libs/' + helper)
})

console.log(process.env.Stage);

lib.start
    // .then(lib.httprequests.baidu)
    .then(lib.gulp.enter)
    // .then(lib.gulp.scss)
    // .then(lib.gulp.css)
    // .then(lib.gulp.ugly)
    .then(lib.webpack.run)
    .then(lib.gulp.watch)
    .then(lib.gulp.httpserver)
    .then(lib.gulp.browserSyn)
    .catch(console.log)