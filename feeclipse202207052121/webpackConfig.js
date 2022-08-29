const glob = require('glob')
const path = require('path')
const fs = require('fs')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const smp = new SpeedMeasurePlugin()
const MiniCssExtractPlugin = require('mini-css-extract-plugin')


var getHtmlConfig = function (name, title) {
    return {
        title: title,
        filename: 'view/' + name + '.html', //filename配置的html文件目录是相对于Config.output.path路径而言的，不是相对于当前项目目录结构的。
        template: './src/view/' + name + '.html',
        inject: true,
        hash: true, minify: {
            collapseWhitespace: true, removeComments: true, minifyJS: true, minifyCSS: true, //删除空格、换行
        },
        chunks: ['common', name]
    };
};

const hwp = new HtmlWebpackPlugin({
    title: 'myhomepage', filename: 'index.html', template: './src/htmls/template.html', inject: true,
    templateParameters: {
        author: 'calos'//process.env.SOME_VAR,
    },
    // minify: {
    //     collapseWhitespace: true, removeComments: true, minifyJS: true, minifyCSS: true, //删除空格、换行
    // },
    hash: true, chunks: ['common', 'index']
})

const wdp = new webpack.DefinePlugin({
    Hook: "DoCallback",
    AppName: JSON.stringify('HappyBuilder'),
    AppVersion: '1.0'
})


function getConfigs(settings) {
    var configs = []
    {
        // var config = getConfig({ calomin: './dist/Site1/calo.min.js', ...{ helper: './src/helper.js' } }, settings)  //, html: './src/htmls/template.html'
        var config = getConfig({ index: './src/index.js' }, settings, {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].js'//'[name].[hash].js',
            // assetModuleFilename: "[name][ext]",
        }, [hwp])
        configs.push(config) //smp.wrap(config),speed measure plugin is conflict with minicss plugin,,,
    }

    // {
    //     const files = fs.readdirSync('./calo')
    //     const f1 = files.map(file => ('./calo/' + file))
    //     var config = getConfig(f1, settings, 'calobundle.js', [])//hwp
    //     configs.push(smp.wrap(config))
    // }


    return configs
}

function getConfig(entry, settings, output, plugins) {
    const config = {
        mode: settings.devEnv || 'development',
        entry: entry,
        externals: {
            //jquery: 'jquery'//use CDN instead maybe, so activate this,
        },
        output: output,
        plugins: [
            new MiniCssExtractPlugin(),
            wdp, ...plugins],
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', { targets: "defaults" }]
                            ],
                            plugins: ["@babel/plugin-transform-classes"]
                        }
                    }
                },
                {
                    // test: /\.string$/i,
                    test: /\.html$/,
                    loader: 'html-loader',
                    exclude: /\.html$/,
                    options: {
                        sources: true
                    }
                },
                {
                    test: /\.(jpe?g|png|gif)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: '[name]_[hash:6]. [ext]',
                            outputPath: 'images',
                            //esModule: false
                        }
                    }
                },
                {
                    test: /\.(sa|sc|c)ss$/i,
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
                },
                // {
                //     test: /\.(png|jpg|gif)$/i,
                //     use: [
                //         {
                //             loader: 'url-loader',
                //             options: {
                //                 limit: 8192,
                //             },
                //         },
                //     ],
                // }
            ]
        }
    }
    return config;
}


module.exports = getConfigs
