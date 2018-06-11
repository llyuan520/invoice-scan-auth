import React,{Component} from 'react';
import { Provider } from 'react-redux';
import mainRoutes from './routes';
import { PersistGate } from 'redux-persist/integration/react';
import createHistory from 'history/createBrowserHistory';
import configureStore from 'store/configureStore'
import { ConnectedRouter } from 'react-router-redux';
import { LocaleProvider } from 'antd';
import {request} from 'utils/index'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const {store,persistor} = configureStore();
const history = createHistory();
const onBeforeLift = () => {
    // take some action before the gate lifts
    request.dispatch = store.dispatch;
    request.getState = store.getState;
    const rootLoading = window.document.getElementById('root-loading');
    if (rootLoading) {
        rootLoading.style.opacity = '0';
        setTimeout(() => {
            rootLoading.style.display = 'none';
        },         500);
    }
};

const Loading = props => <div>loading</div>

export default class App extends Component {

    render() {
        return (
            <LocaleProvider locale={zhCN}>
              <Provider store={store}>
                <PersistGate
                    loading={<Loading />}
                    onBeforeLift={onBeforeLift}
                    persistor={persistor}
                >
                  <ConnectedRouter history={history} >
                      {
                          mainRoutes
                      }
                  </ConnectedRouter>
                </PersistGate>
              </Provider>
            </LocaleProvider>
        );
    }
}
