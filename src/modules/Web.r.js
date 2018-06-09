/**
 * Created by liuliyuan on 2018/6/8.
 */
import React,{Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {Sider,RouteWithSubRoutes,Footer, Header} from 'components'
import {Switch,Route,Link } from 'react-router-dom';
import {logout} from 'ducks/user'
import { Layout,Tabs } from 'antd';
import {composeMenus} from 'utils'
import routes from './routes'
import './index.less'

const TabPane = Tabs.TabPane;
const { Content } = Layout;
const menusData = composeMenus(routes);
const getMenu = menusData.filter(item => item && item.component);

class Web extends Component{
    static propTypes = {
        collapsed:PropTypes.bool.isRequired,
        history:PropTypes.object.isRequired
    }
    static defaultProps = {
        collapsed:false,
    }

    constructor(props) {
        super(props);
        const panes = [
            {
                ...getMenu[0], closable: false
            },
        ];
        this.state = {
            collapsed:false,
            activeKey: panes[0].path,
            panes,
        };
    }

    //给其它组件传数据
    changeCollapsed=collapsed=>{
        this.mounted && this.setState({
            collapsed
        })
    }
    checkLoggedIn= props =>{
        const {loggedIn,history} = props;
        if(!loggedIn){
            history.replace('/login');
        }
    }

    onChange = (activeKey) => {
        this.setState({ activeKey });
    }
    onEdit = (targetKey, action) => {
        this[action](targetKey);
    }
    addTabPane = (item,activeKey) => {
        const panes = this.state.panes;
        if(!!item){
            panes.push({ ...item });
            this.mounted && this.setState({
                panes,
                activeKey
            });
        }else{
            this.mounted && this.setState({
                activeKey
            });
        }
    }
    remove = (targetKey) => {
        let activeKey = this.state.activeKey;
        let lastIndex;
        this.state.panes.forEach((pane, i) => {
            if (pane.path === targetKey) {
                lastIndex = i - 1;
            }
        });
        const panes = this.state.panes.filter(pane => pane.path !== targetKey);
        if (lastIndex >= 0 && activeKey === targetKey) {
            activeKey = panes[lastIndex].path;
        }
        this.mounted && this.setState({ panes, activeKey });
        this.props.history.push(activeKey);
    }

    mounted=true
    componentWillUnmount(){
        this.mounted=null;
    }
    componentWillMount(){
        const pathname = this.props.history.location.pathname;
        if(pathname !== '/web' ||  pathname !== '/web/home'){
            this.props.history.replace('/web/home');
        }
        this.checkLoggedIn(this.props)
    }
    componentWillReceiveProps(nextProps){
        this.checkLoggedIn(nextProps)
    }
    render(){
        return(
            <Layout style={{backgroundColor:'#fff'}}>
                <Sider
                    collapsed={this.state.collapsed}
                    menusData={routes}
                    panes={this.state.panes}
                    activeKey={this.state.activeKey}
                    changeCollapsed={this.changeCollapsed.bind(this)}
                    addTabPane={this.addTabPane.bind(this)}
                />
                <Layout style={{ msFlex:'1 1 auto', msOverflowY: 'hidden',minHeight:'100vh'}}>
                    <Header
                        menusData={menusData}
                        changeCollapsed={this.changeCollapsed.bind(this)}
                        logout={()=>this.props.logout()}
                    />

                    <Content style={{ margin: '12px 12px 0'}}>

                            <Tabs
                                hideAdd
                                onChange={this.onChange}
                                activeKey={this.state.activeKey}
                                type="editable-card"
                                onEdit={this.onEdit}
                                className='ISA-tabs'
                                style={{margin:'20px 0',background:'#fff'}}
                            >

                                {
                                    this.state.panes.map(pane => {
                                        return (
                                            <TabPane
                                                tab={
                                                    <Link to={pane.path}>
                                                        {pane.name}
                                                    </Link>
                                                }
                                                key={pane.path}
                                                closable={pane.closable}
                                            >

                                                <Switch>
                                                    {
                                                        composeMenus(routes).map((route, i) => {
                                                            return (
                                                                <RouteWithSubRoutes key={i} {...route}/>
                                                            )
                                                        })
                                                    }
                                                    <Route path="*" component={()=><div>no match</div>} />
                                                </Switch>

                                            </TabPane>
                                        )
                                    })
                                }
                            </Tabs>
                    </Content>
                    <Footer />
                </Layout>
            </Layout>
        )
    }
}
export default connect(state=>({
    loggedIn:state.user.get('loggedIn')
}),dispatch=>({
    logout:logout(dispatch)
}))(Web)