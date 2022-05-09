/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-02-09 13:41:31
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-03-25 14:57:37
 * @content: edit your page content
 */
// Copyright (c) 2017 PlanGrid, Inc.

import { Box, Button, Modal, ModalUnstyled, Card, Tabs, Tab, Fade, CardMedia, Paper, Stack, Backdrop, CircularProgress, TextField, Typography, Select, MenuItem, Divider, FormControl, InputLabel, Input, FormControlLabel, Switch } from '@mui/material';

import React, { Component, useState, useRef,useEffect } from 'react';
import * as THREE from 'three';
import { isEqual } from 'lodash'

function TextViewer(props) {
  const ref =useRef()
  const container = document.getElementById('pg-viewer');
  const [height, setHeight] = React.useState( container.clientHeight);
  const [width, setWidth] = React.useState( container.clientWidth);
  const [url, setUrl] = React.useState('/');
  const [content, setContent] = React.useState('');
  const usePrevious = (value: any) => {
    const ref = useRef()
    useEffect(() => {
      ref.current = value
    })
    return ref.current
  }


const preProps = usePrevious(props)

useEffect(()=>{
  if(isEqual(preProps,props)){return}
  if(props.data){
    if(typeof props.data ==='string'){
      setContent(props.data)
    }else{
      try{
        const  READER = new FileReader();
        READER.addEventListener("loadend", function(e) {
          setContent(e.target.result as string)
        });
        READER.readAsText(props.data);
        
      }catch(e){
         console.log("🚀 ~ file: text-viewer.tsx ~ line 84 ~ useEffect ~ e", e)
      }
    }

  }
},[props])


  const render = () => {
    const containerStyles = {
      width: `${width}px`,
      height: `${height}px`,
      borderRadius: '10px',
    };

    return (
      <Box className="photo-viewer-container"  sx={{overflowX:'auto',height:`${height}px`}}>
      {content}
      </Box>
    );
  }

  return render()
}

export default TextViewer