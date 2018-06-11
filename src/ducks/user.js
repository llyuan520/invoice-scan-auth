/**
 * Created by liuliyuan on 2018/6/8.
 */
import {createActions,handleActions} from 'redux-actions';
//TODO:  npm immutable 的时候必须加上版本号 4.0.0-rc.9  要不然 getIn() 用不了
import {fromJS} from 'immutable';
import {request} from 'utils'
export const {personal,token,loggedIn} = createActions({
    PERSONAL:{
        /**增加*/
        INCREMENT:info => info,
    },
    TOKEN:{
        /**增加*/
        INCREMENT:token => token,
    },
    LOGGED_IN:{
        /**增加*/
        LOGIN:() => true,
        /**删除*/
        LOGOUT:() => false
    }
})
const initialState = fromJS({
    /**用户个人信息*/
    personal:{
        realname:null,
        username:'欢迎您！',
        userId:null,
        phoneNumber:null,
        companyName: null,
    },
    /**登录凭证*/
    token:null,

    /**是否登录成功*/
    loggedIn:false,
})
export default handleActions({
    [personal.increment]:(state,{payload})=>{
        return state.set('personal',payload)
    },
    [token.increment]:(state,{payload})=>{
        return state.set('token',payload)
    },
    [loggedIn.login]:(state,{payload})=>{
        return state.set('loggedIn',payload)
    },
    [loggedIn.logout]:state=>{
        localStorage.clear();
        return initialState
    }
},initialState)

export const login = dispatch => async ({username,password,success,fail})=>{
    try {
        //正常登录获取token
        await request.post('/authorize/login',{
            username,
            password,
            token_type:'jwt',
        }).then(res=>{
            request.testSuccess(res.data,data=>{
                dispatch(token.increment(data.token))
                //获取用户信息
                dispatch(personal.increment({...data,username:username}))
                dispatch(loggedIn.login())
                //执行登录成功回调
                success && success()
            },err=>{
                fail && fail(err)
            })
        }).catch(err=>{
            console.log(err)
            fail && fail(err.message)
        })

    }catch(err) {
        console.log(err)
    }
}

export const logout = dispatch => async ()=>{
    //登出
    dispatch(loggedIn.logout())
}

export const saveToken = dispatch => async (data) =>{
    try {
        dispatch(token.increment(data))
    }catch (err){
        console.log(err)
    }
}