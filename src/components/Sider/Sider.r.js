/**
 * Created by liuliyuan on 2018/6/8.
 */
import React, { Component } from 'react';
import { Layout, Menu,Icon} from 'antd';
import {withRouter,Link} from 'react-router-dom';
import PropTypes from 'prop-types'
import {composeMenus} from 'utils'
/*import logo from './images/logo.png'*/
import './index.less'

const { Sider } = Layout;
const { SubMenu } = Menu;

class ISASider extends Component {

    //自行包装sider时要加入，为了让layout正确识别
    static __ANT_LAYOUT_SIDER = true
    constructor(props){
        super(props);
        this.state = {
            selectedPath:props.history.location.pathname,
            openKeys: [],
        };
    }

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    getNavMenuItems=(menusData)=>{

        if (!menusData) {
            return [];
        }
        return menusData.map((item) => {
            if (!item.name) {  //|| item.path === '/web/home'
                return null;
            }

            if (item.children && item.children.some(child => child.name)) {

                return (
                    <SubMenu
                        title={
                            item.icon ? (
                                <span>
                              <Icon type={item.icon} />
                              <span>{item.name}</span>
                            </span>
                            ) : item.name
                        }
                        key={item.key || item.path}
                    >
                        {this.getNavMenuItems(item.children)}
                    </SubMenu>
                )
            }

            const icon = item.icon && <Icon type={item.icon} />;

            return (
                <Menu.Item key={item.key || item.path}>
                    <Link
                        to={item.path}
                        target={item.target}
                        replace={item.path === this.props.location.pathname}
                    >
                        {icon}<span>{item.name}</span>
                    </Link>
                </Menu.Item>
            )

        });
    }
    onOpenChange = (openKeys) => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (openKeys.indexOf(latestOpenKey) === -1) {
            this.mounted && this.setState({
                openKeys
            });
        } else {
            this.mounted && this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    }

    getPath =(path)=>{
        const menusData = composeMenus(this.props.menusData);
        const getMenu = menusData.filter(item => item && item.path === path)[0];
        const isExist = this.props.panes.map(item=>item.path === getMenu.path).indexOf(true) > -1;
        isExist === false ? this.props.addTabPane(getMenu, path) : this.props.addTabPane(undefined, path)
    }

    handleClick = (e) => {
        this.getPath(e.key);
        this.mounted && this.setState({
            selectedPath: e.key,
        });
    }

    // 根据地址显示左侧的展开和选中导航
    resetSelectedNav = (props)=>{
        let path = props.history.location.pathname,
            openKeys = [`/${path.split(/\//)[1]}`],
            url_two = path.split(/\//)[2],
            url_three = path.split(/\//)[3];

        if(url_two){
            openKeys=[`${openKeys}/${url_two}`]
        }
        if(url_three){
            openKeys =[...openKeys,`${openKeys}/${url_three}`]
        }

        this.mounted && this.setState({
            openKeys,
            selectedPath: path.indexOf('/web/home') === -1 ? openKeys[1] : openKeys[0]
        });
    }
    componentWillMount(){
        if(this.props.panes.length === 1 ){
            this.setState({
                openKeys:[],
            });
        }
    }

    mounted=true
    componentWillUnmount(){
        this.mounted=null;
    }
    componentDidMount(){
        // 刷新时根据地址显示导航
        this.resetSelectedNav(this.props)
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.collapsed){
            this.mounted && this.setState({
                openKeys:[]
            });
        }else{
            // 通过非导航跳转，根据新的地址显示导航
            this.resetSelectedNav(nextProps)
        }

        if(nextProps.panes.length < 2 ){
            this.mounted &&  this.setState({
                openKeys:[],
                selectedPath:'/web/home'
            });
        }
    }
    render() {
        return (
            <Sider
                trigger={null}
                collapsible
                collapsed={this.props.collapsed}
                className="vtax-custom-trigger"
            >
                <div className="logo">
                    {/*<img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" alt="logo" />
                    <img alt="Ant Design" src="https://gw.alipayobjects.com/zos/rmsportal/DkKNubTaaVsKURhcVGkh.svg" />*/}
                    {/*<Link to="/">
                        <img src={logo} alt="logo" />
                        <h1>碧桂园增值税管理系统</h1>
                    </Link>*/}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    onClick={this.handleClick}
                    onOpenChange={this.onOpenChange}
                    selectedKeys={[this.state.selectedPath]}
                    openKeys={this.state.openKeys}
                    style={{ marginTop: '16px', width: '100%' }}
                >
                    {this.getNavMenuItems(this.props.menusData)}
                </Menu>
            </Sider>
        )
    }
}
export default withRouter(ISASider)