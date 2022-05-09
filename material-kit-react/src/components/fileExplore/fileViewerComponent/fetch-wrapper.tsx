/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-02-09 11:55:27
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-24 15:33:13
 * @content: edit your page content
 */
// Copyright (c) 2017 PlanGrid, Inc.

import React, { Component, useState, useEffect, useRef } from 'react';
import Error from './error';
import Loading from './loading';
import Axios from '../../../common/axios/axios'
import { isEqual } from 'lodash'

function WithFetching(props) {
    const [error, setError] = React.useState(null);
    const [data, setData] = React.useState(null);
    const [path, setPath] = React.useState(null);

    const onError = props.onError
    // let data = null

    const WrappedComponent = props.children
    // const url = process.env.HTTP_DM
    const url = process.env.HTTP_FACTORY

    const usePreviousPath = (path: any, data: any) => {
        const ref = useRef<Object>()
        useEffect(() => {
            ref.current = { path, data }

        })
        return ref.current
    }
    const usePreviousData = (data: any) => {
        const ref = useRef()
        const v = { path, data }
        useEffect(() => {
            ref.current = path

        })
        return ref.current
    }
    const prePropsPath = usePreviousPath(props.filePath, data)
    //   const prePropsData = usePreviousData(data)

    const fetch = (path) => {
        // xhr.send();
        let params = { url: path, method: 'get' }
        params = Object.assign(params, { responseType: props.responseType })
        params = Object.assign(params, { url: `/api/pangoo-warehouse${props.filePath}` })
        if (props.responseType === 'url') {
            try {
                setData(`${url}/${props.filePath}`);
            } catch (e) {
                console.log("🚀 ~ file: fetch-wrapper.tsx ~ line 56 ~ fetch ~ e", e)
            }
            // data=( `${url}/${props.filePath}` );
        } else {
            Axios(params).then((response) => {
                let resp = response.data
                try {
                    setData(resp);
                } catch (e) {
                    setError({ error: 'fetch error' });
                }
                // data=resp
            }).catch(e=>{
                 setError({ error: 'fetch error' });
            })
        }

    }

    useEffect(() => {
        try {
            fetch(props.filePath);
        } catch (e) {
            if (onError) {
                onError(e);
            }
            setError({ error: 'fetch error' });
        }
    }, [props.filePath,])


    const render = () => {
        if (error) {
            return <Error {...props} error={error} />;
        }
        if (data) {
            // if (typeof prePropsPath === 'undefined' || (isEqual(prePropsPath.path, props.filePath) && isEqual(prePropsPath.data, data))) {
            return <WrappedComponent {...props} data={data} />;
            // }
        }
        return (
            <Loading />
        );
    }
    return render()
}

export default WithFetching;
