/**
 * Created by liuliyuan on 2018/6/8.
 */
import React,{Component} from 'react'
import { Layout,Menu,Avatar,Icon,Modal,Dropdown } from 'antd'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import './header.less'

const { Header} = Layout;
const confirm = Modal.confirm;

class WimsHeader extends Component {

    state = {
        collapsed: false,
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        },()=>{
            this.props.changeCollapsed(this.state.collapsed);
        });
    }
    handleMenuCollapse = ({ key })=>{
        if(key==='logout') {
            confirm({
                title: '系统提示',
                content: '确定要退出吗',
                onOk: () => this.props.logout(),
                onCancel() {

                },
            });
        }else if(key === 'admin') {
            this.props.history.push(`/${key}`)
        }else if(key === 'message'){
            return false
        }else{
            this.props.history.push(`/web/${key}`)
        }
    }
    render() {

        const menu = (
            <Menu className='menu' selectedKeys={[]} onClick={this.handleMenuCollapse}>
                <Menu.Item key='admin' disabled>
                    <Icon type="user" />个人中心
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="logout">
                    <Icon type="logout" />退出登录
                </Menu.Item>
            </Menu>
        );

        return (
            <Header className="header">
                <Icon
                    className='trigger'
                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle}
                />
                <div style={{display: 'inline-block'}}>
                    <h1>发票扫描验真平台</h1>
                </div>
                <div className='right'>
                        <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
                          <span className='action account'>
                            <Avatar size="small" className='avatar' icon="user"  style={{ backgroundColor: '#87d068',color:'#fff'}} />
                              {/*src={'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'}*/}
                              <span className='name'>{ this.props.username ? this.props.username : '欢迎您！'}</span>
                          </span>
                        </Dropdown>
                </div>
            </Header>
        )
    }
}

export default withRouter(connect(state=>{
    return {
        username:state.user.getIn(['personal','username'])
    }
})(WimsHeader))