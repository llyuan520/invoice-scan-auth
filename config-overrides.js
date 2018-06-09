/**
 * Created by liuliyuan on 2018/6/8.
 */
const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');

module.exports = function override(config, env) {
       config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
       config = rewireLess.withLoaderOptions({
             modifyVars: { "@primary-color": "#1890ff" },
       })(config, env);
    return config;
};