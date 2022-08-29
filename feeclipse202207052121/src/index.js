

import sty1 from "./abcs.css"
import sty2 from "./htmls/abcs1.module.css"

console.log(sty1);
console.log(sty2);

console.log('css imported by loader:');

const btn = document.createElement('button')
btn.innerText = "hello"
btn.className = "mycustomclassname"
btn.style.color = 'green'
document.body.append(btn)
console.log(1);


// const UglifyJS = require('uglify-js')

// console.log(APPName)
// Hook = function () {
//     console.log(2);
// }
// Hook()

class Me {
    get() {
        console.log('me');
    }
}

// const html = require("html-loader!../pages/users.html");
// console.log(html);


// var code = {
//     "file1.js": require('./helper'),
// };
// var result = UglifyJS.minify(code);
// console.log(result.code);


const pic = require('./images/loadertest.jpg')

console.log(pic)
const img = document.createElement('img')
img.src = pic.default;
document.body.appendChild(img);

// const template = require('html-loader!./htmls/template.html')//this displays html file in js code; using test \.string can compile the html templates, it returns a path or esModule
// const div1 = document.createElement('div')
// div1.innerHTML = template.default
// document.body.append(div1)

import $ from 'jquery'
import 'bootstrap'
window.$ = $
$('body').append('<div>usingjquery</div>')
