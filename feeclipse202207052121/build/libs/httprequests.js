const request = require('request')

function baidu() {
    return new Promise(resolve => {
        const j = request.jar();
        const cookie = request.cookie('key1=value1');
        const url = 'http://www.google.com';
        j.setCookie(cookie, url);
        request({ url: url, jar: j, timeout: 2000 }, function (error, response, body) {
            console.log(error);
            console.log(body);
        })
        resolve()
    })
}

module.exports = {
    baidu
}