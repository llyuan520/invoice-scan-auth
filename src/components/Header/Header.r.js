/**
 * Created by liuliyuan on 2018/6/8.
 */
import React,{Component} from 'react'
import { Layout,Menu,Avatar,Icon,Modal,Dropdown,Tooltip,Spin,Tag,message } from 'antd'
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import NoticeIcon from '../NoticeIcon';
import { request } from 'utils'
import './header.less'
//模拟数据
import mockAxios from '../../components/NoticeIcon/__mocks__/api.mock'
mockAxios(request);

const { Header} = Layout;
const confirm = Modal.confirm;

class WimsHeader extends Component {

    state = {
        collapsed: false,
        fetchingNotices:false,
        data:[],
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
    getNoticeData() {
        const notices = this.state.data;
        if (notices.length === 0) {
            return {};
        }
        const newNotices = notices.map(notice => {
            const newNotice = { ...notice };
            if (newNotice.datetime) {
                newNotice.datetime = moment(notice.datetime).fromNow();
            }
            // transform id to item key
            if (newNotice.id) {
                newNotice.key = newNotice.id;
            }
            if (newNotice.extra && newNotice.status) {
                const color = {
                    todo: '',
                    processing: 'blue',
                    urgent: 'red',
                    doing: 'gold',
                }[newNotice.status];
                newNotice.extra = (
                    <Tag color={color} style={{ marginRight: 0 }}>
                        {newNotice.extra}
                    </Tag>
                );
            }
            return newNotice;
        });
        return groupBy(newNotices, 'type');
    }
    handleNoticeClear = type => {
        message.success(`清空了${type}`);
        const data = this.state.data.filter(item=>item.type !== type)
        this.setState({
            data
        })
    };
    componentWillMount(){
        this.setState({
            fetchingNotices: true
        })
        request.get('/notices').then(({data}) => {
                if(data.code===200){
                    this.setState({
                        data:data.data,
                        fetchingNotices: false
                    })
                }else{
                    message.error(data.msg, 4);
                    this.setState({
                        fetchingNotices: false
                    })
                }
            })
            .catch(err => {
                this.setState({
                    fetchingNotices: false
                })
                message.error(err.message)
            });
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
        const noticeData = this.getNoticeData();
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
                    <Tooltip title="使用文档">
                        <a
                            target="_blank"
                            href="/web/home"
                            rel="noopener noreferrer"
                            className='action'
                        >
                            <Icon type="question-circle-o" />
                        </a>
                    </Tooltip>

                    <NoticeIcon
                        className='action'
                        count={12}
                        onItemClick={(item, tabProps) => {
                            //console.log(item, tabProps); // eslint-disable-line
                        }}
                        notices={this.state.data}
                        onClear={this.handleNoticeClear}
                        loading={this.state.fetchingNotices}
                        popupAlign={{ offset: [20, -16] }}
                    >
                        <NoticeIcon.Tab
                            list={noticeData['通知']}
                            title="通知"
                            emptyText="你已查看所有通知"
                            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
                        />
                        <NoticeIcon.Tab
                            list={noticeData['消息']}
                            title="消息"
                            emptyText="您已读完所有消息"
                            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
                        />
                        <NoticeIcon.Tab
                            list={noticeData['待办']}
                            title="待办"
                            emptyText="你已完成所有待办"
                            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
                        />
                    </NoticeIcon>

                    {this.props.username ? (
                        <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
                          <span className='action account'>
                            <Avatar size="small" className='avatar' icon="user"  style={{ backgroundColor: '#87d068',color:'#fff'}} />
                              {/*src={'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'}*/}
                              <span className='name'>{ this.props.username }</span>
                          </span>
                        </Dropdown>
                    ) : (
                        <Spin size="small" style={{ marginLeft: 8 }} />
                    )}


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