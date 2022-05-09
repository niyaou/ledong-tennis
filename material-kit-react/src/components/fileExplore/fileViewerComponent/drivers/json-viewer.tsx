/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-02-09 13:41:43
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-02-10 19:14:01
 * @content: edit your page content
 */
// Copyright (c) 2017 PlanGrid, Inc.


import React, { Component, useState, useEffect } from 'react';
import ReactJson from 'react-json-view'

function JSONViewer(props) {

  const container = document.getElementById('pg-viewer');
  const [height, setHeight] = React.useState( container.clientHeight);
  const [width, setWidth] = React.useState( container.clientWidth);



  const render = () => {
    const containerStyles = {
      width: `${width}px`,
      height: `${height}px`,
      overflow: 'auto',
    };

  
    return (
      <div className="photo-viewer-container"  >
             <ReactJson src={props.data} style={containerStyles}/>
      </div>
    );
  }

  return render()
}

export default JSONViewer