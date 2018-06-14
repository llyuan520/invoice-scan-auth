/**
 * Created by liuliyuan on 2018/6/8.
 */
import React,{Component} from 'react';
import PropTypes from 'prop-types'
import {Form,Input,Button} from 'antd'
import {connect} from 'react-redux';
import { compose } from 'redux';
import { accountLogin } from 'services/api';
import './index.less';

const FormItem = Form.Item;

class Login extends Component {
    static propTypes={
        login:PropTypes.func.isRequired
    }

    state={
        error:{
            visible:false,
            msg:'出错了！'
        },
        loading:false
    }

    handleSubmit = (e) => {
        e && e.preventDefault();
        const {form,login} = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                this.toggleLoading(true)
                login({
                    username:values.username,
                    password:values.password,
                    success:()=>{
                    },
                    fail:err=>{
                        this.setError(err)
                        this.toggleLoading(false)
                    },
                })

            }
        });
    }

    toggleLoading=b=>{
        this.setState({
            loading:b
        })
    }
    hiddenErr = () => {
        this.mount && this.setState(prevState=>({
            error:{
                visible:false
            }
        }))
    }
    setError=(msg, time = 4000)=>{
        clearTimeout(this.timer);
        this.setState({
            error:{
                visible:true,
                msg
            }
        },()=>{
            if(time){
                this.timer = setTimeout(()=>{
                    this.hiddenErr();
                },time)
            }
        })
    }
    checkLoggedIn= props =>{
        const {loggedIn,history} = props;
        if(loggedIn){
            history.replace('/web');
        }
    }
    componentWillMount(){
        this.checkLoggedIn(this.props)
    }
    componentWillReceiveProps(nextProps){
        this.checkLoggedIn(nextProps)
    }

    render(){
        const {getFieldDecorator} = this.props.form
        return(
            <div id="login-container">
                <div className="login-header-content">
                    <img src="/imgs/login-logo.png" alt="logo"/>
                </div>
                <div className="login-content clearfix">
                    <div className="login-content-left">
                        <Form onSubmit={this.handleSubmit} className="loginForm">
                            <h2 className="welcome">登录</h2>
                            <h4 className="welcomeSpan">您好！欢迎使用喜盈佳发票管理系统</h4>
                            <FormItem>
                                {getFieldDecorator('username', {
                                    initialValue: 'admin',
                                    rules: [
                                        {
                                            required: true, message: '请输入帐号!'
                                        }
                                    ],
                                })(
                                    <Input placeholder="帐号" />
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('password', {
                                    initialValue: 'admin@invoice2018',
                                    rules: [{ required: true, message: '请输入密码!' }],
                                })(
                                    <Input type="password" placeholder="密码" />
                                )}
                            </FormItem>
                            <FormItem>
                                <Button loading={this.state.loading} type="primary" htmlType="submit" className="loginFormButton">
                                    登录
                                </Button>
                            </FormItem>
                        </Form>
                        <div className="loginFormFooter">如需帮助，请拨打4000 888 600</div>
                    </div>
                    <div className="login-content-right">
                        <img src="/imgs/login-banner.jpg"  alt="login-banner"/>
                    </div>
                </div>
                <footer className="login-footer">
                    ©Copyright 深圳喜盈佳企业云服务有限公司 版权所有 粤ICP备18055094号
                </footer>
            </div>
        )
    }
}

const enhance = compose(
    connect(state=>({
        loggedIn:state.user.get('loggedIn')
    }),dispatch=>({
        login:accountLogin,
    })),
    Form.create()
)
export default enhance(Login);