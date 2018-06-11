/**
 * Created by liuliyuan on 2018/6/8.
 */
import Immutable from 'immutable'
import {LOCATION_CHANGE} from 'react-router-redux'

const initialState = Immutable.fromJS({
    //locationBeforeTransitions: null
    location:null
});
export default (state = initialState, action) => {
    if (action.type === LOCATION_CHANGE) {
        return state.set('location', action.payload);
    }
    return state;
};