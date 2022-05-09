/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-02-10 09:54:52
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-02-10 19:13:48
 * @content: edit your page content
 */
// Copyright (c) 2017 PlanGrid, Inc.

import React, { Component, useState, useEffect } from 'react';
// import ReactDataGrid from 'react-data-grid';
import CSV from 'comma-separated-values';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid'

function CsvViewer(props)  {
  const container = document.getElementById('pg-viewer');
  const [height, setHeight] = React.useState( container.clientHeight);
  const [width, setWidth] = React.useState( container.clientWidth);

  const [rows, setRows] = React.useState( []);
  const [columns, setColumns] = React.useState( []);

  const parse=(data) =>{
    const rows = [];
    const columns = [];
    let id = 0
    new CSV(data).forEach((array,rowId) => {

        if (columns.length < 1) {
          array.forEach((cell, idx) => {
            columns.push({
              id:idx,
              field: `key-${idx}`,
              headerName: cell,
              width:150
            });
          });
        } else {
          // array.forEach((cell, idx) => {
            const row = {  };
            columns.forEach((col,index)=>{
              // row=Object.assign(row,{col.field:})
              row['id']=id++
              row[col.field]=array[index]
              
            })
            rows.push(row)
          // });
        }
    });
    setRows(rows)
    setColumns(columns)

    // return { rows, columns };
  }

  // constructor(props) {
  //   super(props);
  //   this.state = CsvViewer.parse(props.data);
  // }

  // componentWillReceiveProps(nextProps) {
  //   this.setState(CsvViewer.parse(nextProps.data));
  // }
  useEffect(() => {
    try{
      parse(props.data)
    }catch(e){
    }
  }, [props.data])

  const render=()=> {
    const containerStyles = {
      width: `${width}px`,
      height: `${height}px`,
      overflow: 'auto',
    };
    return (
      // <div>124355</div>
      <div style={containerStyles}>
      <DataGrid rows={rows} columns={columns} />
      </div>
      // <ReactDataGrid
      //   columns={columns}
      //   rowsCount={rows.length}
      //   rowGetter={i => rows[i]}
      //   minHeight={this.props.height || 650}
      // />
    );
  }
  return render()
}

export default CsvViewer;
