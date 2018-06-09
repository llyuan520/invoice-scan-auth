/**
 * Created by liuliyuan on 2018/6/8.
 */
import {wrapPage} from 'utils'
import Home from './Home'
import Auth from './Invoice/Auth'
import Ocr from './Invoice/Ocr'

import Menu from './Admin/Menu'
import Oauth2Server from './Admin/Oauth2Server'
import Oauth2Client from './Admin/Oauth2Client'
import Permission from './Admin/Permission'
import Role from './Admin/Role'
import User from './Admin/User'

import List from './Org/List'
import Manager from './Org/Manager'

import CodeGenerator from './DevTools/CodeGenerator'
import DynamicForm from './DevTools/DynamicForm'
import Template from './DevTools/Template'
import DataBaseMaintain from './DevTools/DataBaseMaintain'
import Schedule from './DevTools/Schedule'

const routes = [
    {
        path:'/web/home',
        component:wrapPage('发票扫描验真平台 – 首页',Home),
        name:'首页',
        icon:'home',
        exact:true
    }, {
        path:'/web/invoice',
        name:'发票管理',
        icon:'file',
        exact:true,
        children: [
            {
                path:'/web/invoice/auth',
                component:wrapPage('发票验真', Auth),
                name:'发票验真',
                exact:true,
            },{
                path:'/web/invoice/ocr',
                component:wrapPage('影像识别', Ocr),
                name:'影像识别',
                exact:true,
            },{
                path:'/web/invoice',
                redirect:true,
                to:'/web/invoice/auth'
            }
        ]
    }, {
        path:'/web/admin',
        name:'系统设置',
        icon:'setting',
        exact:true,
        children: [
            {
                path:'/web/admin/menu',
                component:wrapPage('菜单管理', Menu),
                name:'菜单管理',
                exact:true,
            },{
                path:'/web/admin/oauth2Server',
                component:wrapPage('oauth2-server', Oauth2Server),
                name:'oauth2-server',
                exact:true,
            }, {
                path: '/web/admin/oauth2Client',
                component: wrapPage('oauth2-client', Oauth2Client),
                name: 'oauth2-client',
                exact: true,
            },{
                path:'/web/admin/permission',
                component:wrapPage('权限管理', Permission),
                name:'权限管理',
                exact:true,
            },{
                path:'/web/admin/role',
                component:wrapPage('角色管理', Role),
                name:'角色管理',
                exact:true,
            },{
                path:'/web/admin/user',
                component:wrapPage('用户管理', User),
                name:'用户管理',
                exact:true,
            },{
                path:'/web/admin',
                redirect:true,
                to:'/web/admin/menu'
            }
        ]
    }, {
        path:'/web/Org',
        name:'组织架构',
        icon:'team',
        exact:true,
        children: [
            {
                path:'/web/Org/list',
                component:wrapPage('机构管理', List),
                name:'机构管理',
                exact:true,
            },{
                path:'/web/Org/manager',
                component:wrapPage('综合设置', Manager),
                name:'综合设置',
                exact:true,
            },{
                path:'/web/Org',
                redirect:true,
                to:'/web/Org/list'
            }
        ]
    }, {
        path:'/web/devTools',
        name:'开发人员工具',
        icon:'api',
        exact:true,
        children: [
            {
                path:'/web/devTools/codeGenerator',
                component:wrapPage('代码生成器', CodeGenerator),
                name:'代码生成器 ',
                exact:true,
            },{
                path:'/web/devTools/dynamicForm',
                component:wrapPage('动态表单', DynamicForm),
                name:'动态表单',
                exact:true,
            }, {
                path:'/web/devTools/template',
                component:wrapPage('模板管理', Template),
                name:'模板管理',
                exact:true,
            },{
                path:'/web/devTools/databaseMaintain',
                component:wrapPage('数据库维护', DataBaseMaintain),
                name:'数据库维护',
                exact:true,
            },{
                path:'/web/devTools/schedule',
                component:wrapPage('定时任务', Schedule),
                name:'定时任务',
                exact:true,
            },{
                path:'/web/devTools',
                redirect:true,
                to:'/web/devTools/codeGenerator'
            }
        ]
    }, {
        path:'/web',
        redirect:true,
        to:'/web/home'
    }
]

export default routes