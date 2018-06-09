/**
 * Created by liuliyuan on 2018/6/8.
 * 需要在redux中管理的数据必须要在这里注册reducer
 */
import { combineReducers } from 'redux'
import user from '../ducks/user'
import router from './routeReducer'
//import { routerReducer as router } from 'react-router-redux'


const rootReducer = combineReducers({
    //every modules reducer should be define here
    //[home.NAME]:home.reducer,
    user,
    router
})

export default rootReducer