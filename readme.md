```
npm i -g gulp
npm i -D gulp
npm i -D node-cmd
npm i -D del


gulp
npm install -D babel-loader @babel/core @babel/preset-env webpack
1. use webpack to build js, add many loaders; use gulp to build css and html.
//Referenced Jason Vanderslice somehow,,
```

todos:

```
1. webpack calo folder into one bundle.js, and use htmlwebpackplugin
2. whenready method, make calo, then develop pages, 
3. move pages folder to dist/pages folder, launch dist folder and run app, 
```

### framework use:

```
<div calo>

        <label>selected is:</label>
        <span @model="selected"></span>

        <select @Change="select">
            <option>choose:</option>
            <option @model="list1|"></option>
        </select>
        <button @click="login">login</button>

        data is here: <input @model="user" />
        label is here:
        <label @model="user"> </label>
        <div>
            <input type="checkbox" name="group" value="2" @click="multichoose" />
            <input type="checkbox" name="group" value="3" @click="multichoose" />
            <input type="checkbox" name="group" value="4" @click="multichoose" />
        </div>

        <div><input type="radio" @click="multichoose" value="3" name="group1">
            <input type="radio" @click="multichoose" value="4" name="group1">
            <input type="radio" @click="multichoose" value="5" name="group1">
            <input type="radio" @click="multichoose" value="6" name="group1">
        </div>



        <div @model="task">
            <span @model="task.id"></span>
            <span @model="task.name"></span>
        </div>

        <div @Show="show">
            234
        </div>
        <div @model="jobs|x">
            <span @model="x.id"></span>
            <span @model="x.name"></span>
            <a @model="x.link"><span @model="x.title"></span></a>

        </div>


    </div>
```

```
    <script>
      makeCalo({
            model: {
                user: 'chen',
                selected: 2,
                list1: [2, 3, 4],
                show: true,
                task: {
                    id: 2,
                    name: 'mytask'
                },
                jobs: [
                    {
                        id: 1, name: 'job1', link: 'https://baidu.com',
                        title: 'go to baidu'
                    },
                    {
                        id: 2, name: 'job2', link: 'https://youku.com',
                        title: 'go to youku'
                    }
                ],

            },
            login: function () {
                alert(2)
            },
            select: function (el) {
                const selectVal = this.model.list1[el.selectedIndex - 1];
                this.model.selected = selectVal;
            },
            multichoose: function (el) {
                this.model.show = this.model.show === true ? false : true;
                if (el.checked)
                    console.log(el);
            }

        })
    </script>

```


### virtual dom imp:

```
const virtualDom= document.querySelector("[calo]").cloneNode(true);

document.querySelector("[calo]").innerHTML=virtualDom.innerHTML

calo.run.apply(calo)
```

```
1. callPlugin or makePlugin are methods that can be called outside the scope, but will take effect, plugin and the whole scope share the same model, so, there is no that passing value issue,
```