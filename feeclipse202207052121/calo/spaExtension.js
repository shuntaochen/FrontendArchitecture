
(function (o) {
    o.spaPath = o.spaPath || "./"
    const root = o.rootel
    o.routes = {} || o.routes
    o.templateStore = {} || o.templateStore

    var stringToHTML = function (str) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(str, 'text/html');
        return doc.body;
    };
    o.navigate = function (route) {
        if (!window.templateLoaded && route !== "/") {
            console.log("only route template is loaded, rquesting others cannot succeed")
            return
        }
        window.history.pushState({ route }, '', route)
        if (route.indexOf('?') !== -1) {
            calo.query = getQueryJson(route)
            const parts = route.split('?')
            route = parts[0]
        } else {
            calo.query = {}
        }
        root.innerHTML = ''
        var hm = stringToHTML(decodeURI(calo.templateStore[route]))
        var script = hm.getElementsByTagName('script')[0]?.text;
        root.appendChild(hm)
        if (script)
            eval(script)
        o.run.apply(o)

    }

    o.router = function (routes) {
        var router = calo.routes || {}
        router = { ...router, ...routes }
        const templateStore = o.templateStore || {}
        var proms = []
        for (const key in router) {
            if (Object.hasOwnProperty.call(router, key)) {
                var p = new Promise(resolve => {
                    const htmlName = router[key];
                    getHtmlOrJson(o.spaPath + htmlName + "?_=" + Math.random(), function (text) {
                        templateStore[key] = encodeURI(text);
                        resolve()
                    })

                })
                proms.push(p)
            }
        }
        Promise.all(proms).then(function () {
            window.templateLoaded = true
            console.log('all templates has been loaded')
        })
    }
    window.calo = o || {
        model: {}
    }

})(window.calo)

