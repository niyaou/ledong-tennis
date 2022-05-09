/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-04-13 15:40:44
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-22 14:23:04
 * @content: edit your page content
 */

import XLSX from 'xlsx';
import { Document, Page, pdfjs  ,workerSrc } from "react-pdf/dist/esm/entry.webpack5";
import React, { Component, useState, useEffect } from 'react';
import CsvViewer from './csv-viewer';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';

import {CircularProgress,Tooltip,Typography,Stack,IconButton} from '@mui/material';
const pdf = require('./js/pdf.min.js')
// pdfjs.GlobalWorkerOptions.workerSrc =  `//cdnjs.cat.net/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function XlxsViewer(props) {
  // pdfjs.GlobalWorkerOptions.workerSrc =  pdf;
  // constructor(props) {
    //   super(props);
    //   this.state = this.parse();
  // }
  const container = document.getElementById('pg-viewer');
  const [height, setHeight] = React.useState(container.clientHeight);
  const [width, setWidth] = React.useState(container.clientWidth);

  const [sheets, setSheets] = React.useState([]);
  const [names, setName] = React.useState([]);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [numPages, setNumPages] = React.useState(0);

  const [pageWidth, setPageWidth] = React.useState(container.clientWidth);
  const [curSheetIndex, setCurSheetIndex] = React.useState(0);

  const pageZoomOut = () => {
    if (pageWidth <= 600) {
      return
    }
    setPageWidth( pageWidth * 0.8 )
  }
  const pageZoomIn = () => {
    setPageWidth( pageWidth * 1.2 )
  }  
  const pageZoomInit = () => {
    setPageWidth( container.clientWidth )
  }


  const renderSheetData = (sheet) => {
    const csvProps = Object.assign({}, props, { data: sheet });
    if (!sheet) {
      return (
        <>1</>
      );
    } else {
      return (
        <CsvViewer {...csvProps} />
      );
    }

  }
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  const render = () => {
    const containerStyles = {
      width: `${width}px`,
      height: `${height}px`,
      overflow: 'auto',
      background:'#545a60'
    };
    return (
      <Stack 
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={0}
      sx={containerStyles}
      >
        <Document
          file={props.data}
          onLoadSuccess={onDocumentLoadSuccess}
          renderMode="canvas"
          options={{
            cMapUrl: 'cmaps/',
            cMapPacked: true,
          }}
          loading="正在努力加载中" //加载时提示语句
        >
          <Page pageNumber={pageNumber} width={pageWidth} height={height}  loading={ <CircularProgress color="inherit" />} />
        </Document>
        <Stack 
             direction="row"
             justifyContent="space-between"
             alignItems="center"
             spacing={0}
             sx={{ background:"rgba(0,0,0,0.5)",position:'absolute',bottom:'15%',width:'15%',height:'5%',borderRadius:'30px',color:'white'}}
             >
          <Tooltip title={pageNumber == 1 ? "已是第一页" : "上一页"} >
          <IconButton
          aria-label="expand row"
          size="small"
          color="inherit" 
          disabled={pageNumber===1}
          onClick={ () => {
            setPageNumber(pageNumber-1)
          }}>
          <KeyboardArrowLeftIcon />
        </IconButton>

          </Tooltip>
          {/* <Input value={pageNumberFocus ? pageNumberInput : pageNumber}
            onFocus={this.onPageNumberFocus}
            onBlur={this.onPageNumberBlur}
            onChange={this.onPageNumberChange}
            onPressEnter={this.toPage} type="number" /> */}
          {pageNumber}   / {numPages}
          <Tooltip title={pageNumber == numPages ? "已是最后一页" : "下一页"}>
          <IconButton
               color="inherit" 
          aria-label="expand row"
          size="small"
          disabled={pageNumber===numPages}
          onClick={async () => {
            setPageNumber(pageNumber+1)
          }}
        >
          <ChevronRightIcon />
        </IconButton>
          </Tooltip>
          <Tooltip title={"放大"}
         >
          <IconButton
            color="inherit" 
          aria-label="expand row"
          size="small"
          disabled={pageWidth/width>2}
          onClick={async () => {
            pageZoomIn()
          }}
        >
          <ControlPointIcon />
        </IconButton>
          </Tooltip>
          <Tooltip title={"缩小"}>
          <IconButton
          aria-label="expand row"
          size="small"
          color="inherit" 
          disabled={width /pageWidth>2}
          onClick={async () => {
            pageZoomOut()
          }}
        >
          <HorizontalRuleIcon />
        </IconButton>
          </Tooltip>
          <Tooltip title={1===1 ? "恢复默认" : '适合窗口'}>
          <IconButton
                 color="inherit" 
          aria-label="expand row"
          size="small"
          onClick={async () => {
            pageZoomInit()
          }}
        >
          <ZoomInMapIcon />
        </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    );
  }
  return render()
}

export default XlxsViewer;
