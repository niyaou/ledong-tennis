/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-02-10 14:07:27
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-02-10 14:45:10
 * @content: edit your page content
 */
// Copyright (c) 2017 PlanGrid, Inc.

import XLSX from 'xlsx';

import React, { Component, useState, useEffect } from 'react';
import CsvViewer from './csv-viewer';

function XlxsViewer(props){
  // constructor(props) {
  //   super(props);
  //   this.state = this.parse();
  // }
  const container = document.getElementById('pg-viewer');
  const [height, setHeight] = React.useState( container.clientHeight);
  const [width, setWidth] = React.useState( container.clientWidth);

  const [sheets, setSheets] = React.useState( []);
  const [names, setName] = React.useState( []);
  const [curSheetIndex, setCurSheetIndex] = React.useState( 0);



  const parse=()=> {
    const dataArr = new Uint8Array(props.data);
    const arr = [];

    for (let i = 0; i !== dataArr.length; i += 1) {
      arr.push(String.fromCharCode(dataArr[i]));
    }

    const workbook = XLSX.read(arr.join(''), { type: 'binary' });
    const names = Object.keys(workbook.Sheets);
    const sheets = names.map(name => (
      XLSX.utils.sheet_to_csv(workbook.Sheets[name])
    ));
    setSheets(sheets)
    setName(names)
    return { sheets, names, curSheetIndex: 0 };
  }

  useEffect(() => {
    parse(props.data)
  }, [props.data])

  const renderSheetNames=(names) =>{
    const sheets = names.map((name, index) => (
      <input
        key={name}
        type="button"
        value={name}
        onClick={() => {
         setCurSheetIndex( index )
        }}
      />
    ));

    return (
      <div className="sheet-names">
        {sheets}
      </div>
    );
  }

  const renderSheetData=(sheet) =>{
    const csvProps = Object.assign({}, props, { data: sheet });
    if(!sheet){
      return (
      <>1</>
      );
    }else{
      return (
        <CsvViewer {...csvProps} />
      );
    }
   
  }

  const render=()=> {
    const containerStyles = {
      width: `${width}px`,
      height: `${height}px`,
      overflow: 'auto',
    };
    return (
      <div style={containerStyles}>
        {renderSheetNames(names)}
        {renderSheetData(sheets[curSheetIndex || 0])}
      </div>
    );
  }
  return render()
}

export default XlxsViewer;
