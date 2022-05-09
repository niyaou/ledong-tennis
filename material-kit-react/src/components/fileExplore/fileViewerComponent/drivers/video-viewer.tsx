/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-02-10 15:35:59
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-02-14 16:12:35
 * @content: edit your page content
 */
// Copyright (c) 2017 PlanGrid, Inc.

import React, { Component, useState, useEffect } from 'react';
import Loading from '../loading';

function VideoViewer(props)  {
  const container = document.getElementById('pg-viewer');
  const [height, setHeight] = React.useState( container.clientHeight);
  const [width, setWidth] = React.useState( container.clientWidth);

  const [sheets, setSheets] = React.useState( []);
  const [names, setName] = React.useState( []);
  const [curSheetIndex, setCurSheetIndex] = React.useState( 0);
  const [loading, setLoading] = React.useState( false);

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     loading: true,
  //   };
  // }

  // onCanPlay() {
  //   this.setState({ loading: false });
  // }

  // renderLoading() {
  //   if (this.state.loading) {
  //     return <Loading />;
  //   }
  //   return null;
  // }
  useEffect(() => {
  }, [props.data])


  const render=()=> {
    const visibility = loading ? 'hidden' : 'visible';
    const containerStyles = {
      width: `${width}px`,
      height: `${height}px`,
      overflow: 'hidden',
    };
    
    return (
      <div style={containerStyles}>
        <div className="video-container">
          <video
            style={containerStyles}
            controls
            type={`video/${props.fileType}`}
            src={props.data}
          >
            Video playback is not supported by your browser.
          </video>
        </div>
      </div>
    );
  }
  
  return render()
}

export default VideoViewer;
