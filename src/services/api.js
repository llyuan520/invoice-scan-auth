/**
 * Created by liuliyuan on 2018/6/14.
 */
import {request} from 'utils'
import { store } from '../store';
import { personal,token,loggedIn} from '../ducks/user'
const dispatch = store.dispatch;

export function accountLogin(options) {
    return request.post('/authorize/login',{
        username: options.username,
        password: options.password,
        token_type:'jwt',
    }).then(res=>{
        const data = res.data;
        if(data.status===200){
            options.success && options.success();
            const result = data.result;
            dispatch(token.increment(result.token))
            //获取用户信息
            dispatch(personal.increment({...result,username: options.username}))
            dispatch(loggedIn.login())
        }else{
            return Promise.reject(data.msg);
        }
    }).catch(err=>{
        console.log(err)
        options.fail && options.fail(err);
    })
}

export function logout(){
    return  dispatch(loggedIn.logout())
}