/**
 * author       : liuliyuan
 * createTime   : 2017/12/5 18:10
 * description  :
 * 服务超时可以用
 *  https://github.com/softonic/axios-retry
 *  https://github.com/axios/axios/issues/164#issuecomment-327837467
 * 这个方法解决
 */
import Axios from 'axios';
import {notification,message} from 'antd'
import {logout} from 'ducks/user'

const request = Axios.create({
    baseURL:window.baseURL,
    timeout:20000,
});
request.getToken = ()=>{
    return request.getState().user.get('token') || false
}
request.testSuccess = (data,success,fail) => {
    if(data.status===200){
        success && success(data.result)
    }else{
        console.log(data.msg);
        fail && fail(data.msg)
    }
};

const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const errortext = codeMessage[response.status] || response.statusText;
    notification.error({
        message: `请求错误 ${response.status}: ${response.url}`,
        description: errortext,
    });
    const error = new Error(errortext);
    error.name = response.status;
    error.response = response;
    throw error;
}

request.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    if(request.getToken()){
        config.headers={
            //Authorization:request.getToken(),
            'jwt-token':request.getToken(),
        }
        if(config.method==='get'){
            let obj = config.params;
            let temp = {};
            if(config.params){
                for(let i in obj) {
                    if((obj[i] + "").replace(/\s+/g,"") !== "" || obj[i] === null){
                        temp[i] = obj[i];
                    }
                }
                config.params = {
                    _t: Date.parse(new Date())/1000,
                    ...temp
                }
            }

            config.params = {
                ...config.params,
                _t: Date.parse(new Date())/1000,
            }

        }else if(config.method==='delete'){
            config.params = {
                _t: Date.parse(new Date())/1000,
                ...config.params
            }
        }
    }

    /*config.params = {
     ...config.params,
     _t: Date.parse(new Date())/1000,
     }*/

    return config;
}, function (error) {
    // 对请求错误做些什么
    checkStatus(error)
    message.error('网络请求超时',4)
    return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use(function (response) {

    return response;

}, function (error) {

    if(error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
        error.message = "请求超时";
        // return message.error('请求超时',4)
    }
    // 对响应错误做点什么
    else if (error.response) {
        switch (error.response.status) {
            case 400:
                error.message = '请求错误'
                break
            case 401:
                // 返回 401 清除token信息并跳转到登录页面
                request.dispatch && logout(request.dispatch)()
                error.message = '登录超时,请重新登录'
                break;
            case 403:
                error.message = '拒绝访问'
                break

            case 404:
                error.message = `请求地址出错: ${error.response.config.url}`
                break

            case 408:
                error.message = '请求超时'
                break

            case 500:
                error.message = '服务器内部错误'
                break

            case 501:
                error.message = '服务未实现'
                break

            case 502:
                error.message = '网关错误'
                break

            case 503:
                error.message = '服务不可用'
                break

            case 504:
                error.message = '网关超时'
                break

            case 505:
                error.message = 'HTTP版本不受支持'
                break
            default:
                error.message = error.response.statusText;
            //message.error(error.response.statusText,4)
            //no default statusText
        }
        //message.error(error.message)
    }else{
        //message.error('网络错误')
        error.message = "网络错误";
    }
    return Promise.reject(error);
});


export default request;