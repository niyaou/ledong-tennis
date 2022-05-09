/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-17 11:19:45
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-12 15:42:52
 * @content: edit your page content
 */
import { Stack ,Typography} from '@mui/material';
import React ,{ useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import fileExploreUrl from '../../assert/fileexp1.png';
import DsFolderTree from '../fileExplore/dsFolderTree'
import FileViewerComponent from "./fileviewer";

function DataFolderExplore(props) {
    const ds = props.ds
    useEffect(()=>{
      },[ds])

    return (<Stack
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
        sx={{width: '100%'}}
        >   

        <FileViewerComponent sx={{width:'100%',height:'800px'}}/>
        </Stack>)
}
export default DataFolderExplore