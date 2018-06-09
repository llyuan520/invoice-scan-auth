/**
 * Created by liuliyuan on 2018/6/8.
 */
import React, { Component } from 'react';
import { Layout} from 'antd';
export default class Footer extends Component {
    render() {
        return (
            <Layout style={{
                justifyContent:'flex-end'
            }}>
                <footer style={{ textAlign: 'center',padding:'50px 0' }}>
                    ©Copyright 深圳喜盈佳企业云服务有限公司 版权所有 粤ICP备18055094号
                </footer>
            </Layout>
        );
    }
}