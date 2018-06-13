/**
 * Created by liuliyuan on 2018/6/8.
 */
import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { RouteWithSubRoutes } from 'components';
import { Login } from 'components';
import { Layout } from 'antd';
import Web from 'modules/modules@0.0.1/Web.r';
//import Web from 'modules/Web.r';
import Exception403 from 'modules/Exception/403'
import Exception404 from 'modules/Exception/404'
import Exception500 from 'modules/Exception/500'
import { wrapPage } from 'utils';
const routes = [
    {
        path: '/web',
        component: Web,
        name: '主页'
    }, {
        path: '/login',
        component: wrapPage('发票扫描验真平台 - 登录', Login),
        name: '登录'
    },{
        path:'/403',
        component:Exception403,
        name:'403',
    },{
        path:'/404',
        component:Exception404,
        name:'404',
    },{
        path:'/500',
        component:Exception500,
        name:'500',
    }, {
        path: '*',
        redirect: true,
        to: '/web'
    },
];
const mainRoute = (
    <Route
        render={({location}) => {

            const homeRoute = () => (
                <Redirect to="/login"/>
            );
            return(
                <Layout>
                    <Route exact={true} strict={true} path="/" render={homeRoute} />
                    <Switch>
                        {routes.map((route, index) => (
                            <RouteWithSubRoutes key={index} {...route}/>
                        ))}
                    </Switch>

                </Layout>
            );
        }}
    />
);

export default mainRoute;