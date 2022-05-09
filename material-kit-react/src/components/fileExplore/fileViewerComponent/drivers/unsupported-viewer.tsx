/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-02-09 13:41:43
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-02-09 13:42:21
 * @content: edit your page content
 */
// Copyright (c) 2017 PlanGrid, Inc.

import React from 'react';

const UnsupportedViewer = props => (
  <div className="pg-driver-view">
    <div className="unsupported-message">
      {props.unsupportedComponent
        ? <props.unsupportedComponent {...props} />
        : <p className="alert"><b>{`.${props.fileType}`}</b> is not supported.</p>}
    </div>
  </div>
);

export default UnsupportedViewer;
