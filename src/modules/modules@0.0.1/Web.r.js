/**
 * Created by liuliyuan on 2018/6/8.
 */
import React,{Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {Sider,RouteWithSubRoutes,Footer, Header} from 'components'
import {Switch,Route } from 'react-router-dom';
import {logout} from 'ducks/user'
import { Layout,message } from 'antd';
import {composeMenus,request} from 'utils'
import routes from '../routes'
import '../index.less'


const { Content } = Layout;
const menusData = composeMenus(routes);

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
        this.state = {
            collapsed:false,
            result:[],
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

    getMenu = () =>{
        request.get('/menu',{
        })
            .then(({data}) => {
                if(data.status===200){
                    const result = data.result.data;
                    console.log(result)
                }else{
                    message.error(data.message)
                }
            })
            .catch(err => {
                console.log(err)
            });
    }

    mounted=true
    componentWillUnmount(){
        this.mounted=null;
    }
    componentWillMount(){
        this.checkLoggedIn(this.props)
        this.getMenu();
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
                    changeCollapsed={this.changeCollapsed.bind(this)}
                />
                <Layout style={{ msFlex:'1 1 auto', msOverflowY: 'hidden',minHeight:'100vh'}}>
                    <Header
                        menusData={menusData}
                        changeCollapsed={this.changeCollapsed.bind(this)}
                        logout={()=>this.props.logout()}
                    />

                    <Content style={{ margin: '12px 12px 0'}}>
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