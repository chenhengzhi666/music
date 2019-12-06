const {
    override,
    addLessLoader,
    addPostcssPlugins,
    addWebpackAlias
} = require('customize-cra');

const path = require('path');
const paths = require('react-scripts/config/paths');
// 修改打包文件路径（build => dist）
paths.appBuild = path.join(path.dirname(paths.appBuild), 'dist');

// 关闭 sourcemap
process.env.GENERATE_SOURCEMAP = 'false';

module.exports = {
    webpack: override(
        addLessLoader(),    // 配置支持less
        addWebpackAlias({   // 配置别名
            "@": path.resolve(__dirname, "src")
        }),
        addPostcssPlugins(  // 配置像素转rem
            [
                require('postcss-pxtorem')(
                    {
                        rootValue: 16,
                        propList: ['*', '!font-size'],
                        minPixelValue: 2,
                        selectorBlackList: ['am-']
                    })
            ]
        ),
        (config, env) => {
            console.log(config)
            return config;
        }
    ),
    paths: (paths, env) => {
        // console.log(paths)
        // ...add your paths config
        return paths;
    },
}