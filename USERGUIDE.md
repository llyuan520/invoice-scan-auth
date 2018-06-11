# 开发指南

该指南针对wims项目

- [创建新模块](#创建新模块)
- [编写测试代码](#编写测试代码)
- [代码拆分](#代码拆分)
- [使用CSS模块](#使用CSS模块)
- [使用STORYBOOK](#使用STORYBOOK)
- [设置API请求代理](#设置api请求代理)
- [网络请求Mock](#网络请求Mock)


## 创建新模块

使用 `wims-tools` 工具快速创建标准模块文件目录(自己手动创建亦可)

1.`$cd [folder name]`

2.`$wims create [module name]`

执行完以上命令将会创建wims项目标准模块目录结构

![module.png](http://upload-images.jianshu.io/upload_images/5677873-9410d03a2a66e439.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 编写测试代码

测试代码写在模块目录下的`__test__`目录中，文件名为 `[name].test.js`或者 `[name].spec.js`

wims中使用的测试库为[Jest](http://facebook.github.io/jest/)

测试DOM以及模拟点击操作，我们使用 [Enzyme](http://airbnb.io/enzyme/)

一个简单 Jest+Enzyme 例子，测试组件是否能正常渲染:
```js
 import React from 'react'
 import Footer from '../Footer.react'
 import { render } from 'enzyme';
 describe('Footer suite',()=>{
    it('should render without throwing an error',()=>{
        expect(render(<Footer />).find('footer').length).toEqual(1)
    })
 })
```

## 代码拆分

使用es7的动态import，我们可以将代码拆分，在我们需要的时候再进行加载

babel中开启 stage3 (wims项目默认开启)

例子:

### `moduleA.js`

```js
const moduleA = 'Hello';

export { moduleA };
```
### `App.js`

```js
import React, { Component } from 'react';

class App extends Component {
  handleClick = () => {
    import('./moduleA')
      .then(({ moduleA }) => {
        // Use moduleA
      })
      .catch(err => {
        // Handle failure
      });
  };

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>Load</button>
      </div>
    );
  }
}

export default App;
```

## 使用CSS模块

有时候在编写组件的时候，为了避免使用的样式名与已有的冲突，可以使用css module(wims项目默认支持)

例子:

### `styles.css`

```css
.left{
    float:left;
    border-left:1px solid #ccc;
}
.right{
    float:right;
    border-right:1px solid #ccc;
}
```

### `App.js`

```js
import styles from './styles.css'
const App = props =>(
    <div>
        <div className={styles.left}></div>
        <div className={styles.right}></div>
    </div>
)
export default App
```
使用css module之后，在生成样式名的时候会根据目录名、模块名+哈希值的方式产生一个独一无二的className
这样就能避免className冲突

## 使用STORYBOOK

在开发组件过程中，可以通过StoryBook来切换各个组件的开发

```sh
npm i -g @storybook/cli
cd wims
getstorybook
npm run storybook
```

![storybook.png](https://github.com/storybooks/storybook/raw/master/app/react/docs/demo.gif)

## 设置API请求代理

使用ajax、fetch过程中，可以使用代理来设置请求的域名

首先打开`package.json`,加入这一行

`"proxy": "http://localhost:4000"`


## 网络请求Mock

以 `axios` 库为例，配合 `axios-mock-adapter` 我们可以编写如下代码:

```js
import * as constants from '../constants'
import MockAdapter from 'axios-mock-adapter';
const Mock = axios => {
    const mock = new MockAdapter(axios,{delayResponse:1000});
    /* 根据ID查询公司信息 */
    mock.onGet(constants.GET_COMPANY_BY_ID).reply(config=>{
        const {companyId} = config.params;
        var res = {
            httpStatus:200,
            info:{
                code:0,
                message:'',
                status:''
            }
        }
        if(companyId==='119'){
            res.info = {
                code:200,
                message:'查询成功',
                status:'success',
                companyInfo:{
                    ...
                }
            }
        }else{
            res.httpStatus = 208;
            res.info = {
                            code:208,
                            message:'找不到该公司',
                            status:'failure',
                            companyInfo:null
                        }
        }
        return [
            res.httpStatus,
            res.info
        ]
    })
}
export default Mock;
```

然后在 `actions` 文件中使用
```js
import mockAxios from './__mocks__/api.mock'
const axios = Axios.create(asyncConfig);
mockAxios(axios);
/** 根据ID查询公司信息
 * @company_id
 * */
export const getCompanyInformation = companyId => axios.get(constants.GET_COMPANY_BY_ID,{
    params:{
        [constants.ID]:companyId,
    }
});

```

这样便可以拦截请求并模拟数据返回