/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-02-09 16:46:04
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-22 14:23:02
 * @content: edit your page content
 */
// Copyright (c) 2017 PlanGrid, Inc.


import React, { Component, useState, useEffect } from 'react';
import Loading from '../loading';
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

function DocxViewer(props) {
  const container = document.getElementById('pg-viewer');
  const [height, setHeight] = React.useState(container.clientHeight);
  const [width, setWidth] = React.useState(container.clientWidth);
  const url = process.env.HTTP_FACTORY
  
  const docurl = `${url}${props.filePath}`

  useEffect(() => {
    // setHeight(800)
    // setWidth(600)
  }, [])




  // const render = () => {
    const containerStyles = {
      width: `${width}px`,
      height: `${height}px`,
    };

    const docs = [
      {
        uri:
          docurl,
          fileData:props.data
      },

    ];
    var root = React.createElement('IFrame',  { "id": "msdoc-iframe", "title": "msdoc-iframe", "src": "https://view.officeapps.live.com/op/embed.aspx?src=" + encodeURIComponent(docurl), "frameBorder": "0" });
    return (
      <div className="dock-viewer-container"  >
{root}
        
      </div>);
 

}

export default DocxViewer;