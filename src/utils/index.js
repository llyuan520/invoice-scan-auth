/**
 * Created by liuliyuan on 2018/6/8.
 */
import React from 'react'
import request from './request'
import DocumentTitle from 'react-document-title'
import composeMenus from './composeMenus'

const wrapPage = (title,Component) => props => <DocumentTitle title={`${title}`}>{<Component {...props}/>}</DocumentTitle>

const getQueryString=name=>{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  decodeURI(r[2]); return null;
}

export {request,composeMenus,getQueryString,wrapPage}