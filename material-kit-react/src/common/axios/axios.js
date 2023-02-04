/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-01 14:47:35
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-05-09 14:23:23
 * @content: edit your page content
 */
import axios from 'axios';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Backdrop, CircularProgress } from '@mui/material';
import { USER_INFO_KEY } from '../../store/actions/usersActions'
import { logOut } from '../../store/actions/usersActions';

const Axios = axios.create({
    timeout: 38000, // 设置超时时长
})

// 设置post请求头
// Axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'


const secure = process.env.CODE
export const ACCESS_TOKEN = 'accept_token'
export const DAS_TOKEN = 'access_token'

// 请求前拦截
Axios.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    const userStr = localStorage.getItem(USER_INFO_KEY)
    if (userStr && userStr !== 'null') {
            config.headers['Authorization'] = `Bearer ${userStr}` // 让每个请求携带自定义 token 请根据实际情况自行修改
    }
    config.headers['secure']=secure
    return config
}, err => {
    return Promise.reject(err)
})

// 返回后拦截
Axios.interceptors.response.use(res => {
    const headers = res.headers
    return res
}, (err) => {
    if (err.response && err.response.status === 401) {
        Axios.dispatch(logOut())
    }
    return Promise.reject(err)
})

// 把组件引入，并定义成原型属性方便使用
Component.prototype.$axios = Axios

export default Axios