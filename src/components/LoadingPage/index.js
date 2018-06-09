/**
 * Created by liuliyuan on 2018/6/8.
 */
import React from 'react';
import {Spin} from 'antd'

export default ({isLoading, error}) => {
    // Handle the loading state
    if (isLoading) {
        return <Spin>&nbsp;</Spin>;
    }
    // Handle the error state
    else if (error) {
        return <div>页面加载出错，请重试</div>;
    }
    else {
        return null;
    }
};