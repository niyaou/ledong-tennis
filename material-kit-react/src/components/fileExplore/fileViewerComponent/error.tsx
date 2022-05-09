/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-02-09 11:55:44
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-02-09 11:56:06
 * @content: edit your page content
 */
// Copyright (c) 2017 PlanGrid, Inc.

import React from 'react';


const Error = props => (
  <div className="error-message">
    {props.errorComponent
      ? <props.errorComponent {...props} />
      : <p className="alert">Unable to preview file</p>}
  </div>
);

export default Error;
