/**
 * Created by liuliyuan on 2018/6/8.
 */
import { compose,createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import rootReducer from '../reducers'
import storage from 'redux-persist/es/storage'
import immutableTransform from 'redux-persist-transform-immutable'
import { persistStore, persistReducer} from 'redux-persist'

const config = {
    transforms:[immutableTransform()],
    key: 'root', // key is required
    storage, // storage is now required
}

const persistedReducer = persistReducer(config, rootReducer);
const middleware = applyMiddleware(thunk,promiseMiddleware);

const configureStore = preloadedState => {

    const store = createStore(persistedReducer, preloadedState, compose(
        middleware,
        global.devToolsExtension ? global.devToolsExtension() : f => f
        )
    )
    let persistor = persistStore(store)
    return {
        persistor,
        store
    }
}
export default configureStore