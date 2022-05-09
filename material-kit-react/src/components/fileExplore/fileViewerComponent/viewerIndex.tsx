/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-02-09 13:30:18
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-13 15:41:56
 * @content: edit your page content
 */
// Copyright (c) 2017 PlanGrid, Inc.
import React, { Component, useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import 'styles/main.scss';
import WithFetching from './fetch-wrapper';
import { Box, Button, Card, CardContent, Grow, Stack } from '@mui/material';
import {
    PhotoViewer,
    UnsupportedViewer,
    JSONViewer,
    DocxViewer,
    CsvViewer,
    XlsxViewer,
    TextViewer,
    VideoViewer,
    PdfViewer,
} from './drivers';

function FileViewer(props) {

    // const container = document.getElementById('pg-viewer');
    // const [width, setWidth] = React.useState(0);
    // const [loading, setLoading] = React.useState(true);
    // useEffect(() => {
    //     const heightN = container ? container.clientHeight : 0;
    //     const widthN = container ? container.clientWidth : 0;
    //     setHeight(heightN)
    //     setWidth(widthN)

    // },[])


    let responseType = props.responseType||''

    const getDriver = () => {
        if(typeof props.data !=='undefined'){
            props.data=null
        }
        switch (props.fileType) {
              case 'csv': {
                responseType='json'
                return CsvViewer;
              }
              case 'xls': 
              case 'xlsx': {
                responseType= 'arraybuffer' 
                return XlsxViewer;
              }
             case 'js':
             case 'sql':
             case 'md':
             case 'txt': {
                responseType='txt'
                return TextViewer;
              }
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'bmp':
            case 'png': {
                responseType='blob'
                return PhotoViewer;
            }
            case 'json': {
                responseType='json'
                return JSONViewer;
            }
              case 'pdf': {
                responseType='blob'
                return PdfViewer;
              }
              // case 'doc': 
              // case 'docx': {
              //   responseType='url'
              //   return DocxViewer;
              // }
            //   case 'mp3': {
            //     return AudioViewer;
            //   }
              case 'webm':
              case 'mp3':
              case 'mp4': {
                responseType='url'
                return VideoViewer;
              }
            //   case 'wexbim': {
            //     return XBimViewer;
            //   }
            default: {
                return UnsupportedViewer;
            }
        }
    }
    const Driver = getDriver();
    
    return (
        <Box sx={props.sx} id="pg-viewer" >
            <div className="pg-viewer-wrapper">
                <div className="pg-viewer" >
                    <WithFetching  {...props} children={Driver} responseType={responseType} />
                </div>
            </div>
        </Box>
    )
}





export default FileViewer;

