const {
    override,
    addLessLoader,
    addPostcssPlugins,
    addWebpackAlias
} = require('customize-cra');

// const path = require('path');
// const paths = require('react-scripts/config/paths');
// 修改打包文件路径（build => dist）
// paths.appBuild = path.join(path.dirname(paths.appBuild), 'dist');

// 关闭 sourcemap
process.env.GENERATE_SOURCEMAP = "false";

module.exports = {
    webpack: override(
        addLessLoader(),
        addWebpackAlias({
            "@": require('path').resolve(__dirname, "src")
        }),
        addPostcssPlugins(
            [
                require('postcss-pxtorem')(
                    {
                        rootValue: 16,
                        propList: ['*', '!font-size'],
                        minPixelValue: 2,
                        selectorBlackList: ['am-']
                    })
            ]
        )
    ),
    paths: (paths, env) => {
        // console.log(paths)
        // ...add your paths config
        return paths;
    },
}