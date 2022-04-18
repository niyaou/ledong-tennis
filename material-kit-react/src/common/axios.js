/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-04-18 12:05:49
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-18 12:05:49
 * @content: edit your page content
 */
/* eslint-disable */
import axios from 'axios';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Backdrop, CircularProgress } from '@mui/material';
import { USER_INFO_KEY } from '../store/actions/usersActions'
import { logOut } from '../store/actions/usersActions';

const Axios = axios.create({
    timeout: 12000, // 设置超时时长
})

// 设置post请求头
// Axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'



export const ACCESS_TOKEN = 'accept_token'
export const DAS_TOKEN = 'access_token'

// 请求前拦截
Axios.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    const userStr = localStorage.getItem(USER_INFO_KEY)
    if (userStr && userStr !== 'null') {
        const user = JSON.parse(userStr)

        const token = user.token
        const userId = user.login
        const fullName = user.nickName
        if (token) {
            config.headers[ACCESS_TOKEN] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
        }
        if (userId) {
            config.headers['userId'] = userId
        }
        if (fullName) {
            config.headers['fullName'] = encodeURIComponent(fullName)
        }
    }
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