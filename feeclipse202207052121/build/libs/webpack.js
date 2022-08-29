const webpack = require('webpack')
const settings = { devEnv: 'development' }

function run() {
    return new Promise(resolve => {
        console.log('running webpack');
        webpack(require('../../webpackConfig')(settings), function (error, stats) {
            if (error)
                writeLog(error, stats)
        })
        resolve()
    })
}

module.exports = {
    run
}