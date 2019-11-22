const {
    override,
    addLessLoader,
    addPostcssPlugins,
    addWebpackAlias
} = require('customize-cra');

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
        ),
    )
}