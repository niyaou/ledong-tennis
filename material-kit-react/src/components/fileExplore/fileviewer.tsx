/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-17 11:19:45
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-05-05 15:41:12
 * @content: edit your page content
 */
import React, { useEffect, useState } from 'react';
import imgUrl from '../../assert/filledimg.png';
import DsFolderTree from './dsFolderTree'
import FileViewer from './fileViewerComponent/viewerIndex'
import { Box, Button, Card, CardContent, Grow, Stack } from '@mui/material';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { useSelector } from "../../redux/hooks";
import { useDispatch } from 'react-redux';
import { grey } from '@mui/material/colors';
import { Typography, List } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SummaryTree from './summaryTree'
import useStyles from '../../common/styles';
import { styled } from '@mui/material/styles';
import ListSubheader from '@mui/material/ListSubheader';
import Axios from '../../common/axios/axios'
import {filteLabelClear} from '../../store/actions/filesAndFoldersActions'
const FireNav = styled(List)<{ component?: React.ElementType }>({
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 2,
  },
  '& .MuiListItemText-primary': {
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
});



function FileViewerComponent(props) {
  const url = process.env.HTTP_DM
  const type = props.type
  const path = props.path
  const back = props.back
  const exploreMode = props.exploreMode
  const { selectFileTree, currentSelectFolderTree } = useSelector((state) => state.inSensitive)
  const { folders, cacheTree, rootPath, searchActive, nodeSelected, searchParams,
    mergeActive, currentIndex, labelStatistic, successed, errorMsg: indexErrorMsg } = useSelector((state) => state.filesAndFolders)

  const [statistic, setStatistic] = React.useState({})

  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const dispatch=useDispatch()

  const parsJsonStatistic = (jsonStr) => {
    let staticstic = {}
    if (jsonStr.statistic) {

      setStatistic({label:jsonStr.statistic})
    } else {

      for (let key in jsonStr) {
        if (Array.isArray(jsonStr[key])) {
          for (let child in jsonStr[key]) {
            if (jsonStr[key][child]['label']) {
              if (staticstic[jsonStr[key][child]['label']]) {
                staticstic[jsonStr[key][child]['label']].push(jsonStr[key][child])
                // staticstic[jsonStr[key][child]['category']]+=1
              } else {
                staticstic[jsonStr[key][child]['label']] = [jsonStr[key][child]]
                // staticstic[jsonStr[key][child]['category']] = 1
                
              }
            }
          }
          
        }
      }
      
      console.log("🚀 ~ file: fileviewer.tsx ~ line 86 ~ parsJsonStatistic ~ { label: staticstic }", { label: staticstic })
      setStatistic({ label: staticstic })
    }

  }

  const fetch = (path) => {
    // xhr.send();
    let params = { url: path, method: 'get' }
    params = Object.assign(params, { responseType: props.responseType })
    params = Object.assign(params, { url: `/api/pangoo-warehouse/file/warehouse/down?filePath=${path}` })

    Axios(params).then((response) => {
      let resp = response.data
      try {
        setData(resp);
        parsJsonStatistic(resp)
      } catch (e) {
        setError({ error: 'fetch error' });
      }
      // data=resp
    }).catch(e => {
      setError({ error: 'fetch error' });
    })
  }




  useEffect(() => {
    if (nodeSelected && nodeSelected.labelFilePath && exploreMode) {
      try {
        fetch(nodeSelected.labelFilePath);
      } catch (e) {
        setError({ error: 'fetch error' });
      }
    }
  }, [nodeSelected])

  // useEffect(() => {
  //   console.log("🚀 ~ file: fileviewer.tsx ~ line 120 ~ FileViewerComponent ~ statistic", statistic)
  // }, [statistic])

  return (<Stack
    direction="column"
    justifyContent="start"
    alignItems="start"
    spacing={3}
    sx={{ width: '100%' }}>
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb">
      <Typography gutterBottom variant="body2"
        color="inherit"
        sx={{ fontWeight: 'bold', cursor: 'pointer' }}
        onClick={() => {
          back()
          dispatch(filteLabelClear())
        }}
      >
        返回
      </Typography>
    </Breadcrumbs>
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="start"
      spacing={3}
      sx={{ width: '100%' }}>
      <FireNav
        dense={true}
        sx={{
          minWidth: 300, position: 'relative',
          overflowX: 'auto',
          height: '90%',
        }}
        key={`summary`}
        component='nav'
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center">
              <span >
                Summary
              </span>

            </Stack>
          </ListSubheader>
        }
      >


        {/* <SummaryTree statistic={{
          "totalSize": 16634416,
          "totalCount": 53,
 
          "label": {
            "van": 1,
            "car": 4,
            "truck": 1,
            "traffic_light": 1,
            "animal": 82,
            "traffic_sign": 1,
            "pedestrian": 1
          }
      }} />     */}
        <SummaryTree statistic={statistic} />
      </FireNav>
      <Box sx={{ width: '80%', height: 800, border: '1px solid #80808052', borderRadius: '10px' }} >
        {/* &outputQuality=0.5 */}
        {selectFileTree ? (
          <FileViewer
            fileType={selectFileTree.root.fileType}
            filePath={`/file/warehouse/down?filePath=${encodeURIComponent(selectFileTree.root.path)}`}
            responseType={`blob`}
            sx={{ width: '100%', height: 800, borderRadius: '10px' }}
            id="select"
          />
        ) : (<Box sx={{ width: '100%', height: 800, borderRadius: '10px', lineHeight: '800px', textAlign: 'center' }} >
          <Inventory2Icon sx={{ color: grey['A400'], fontSize: '40px' }} />
        </Box>)}

      </Box>

    </Stack>
  </Stack>)


}

export default FileViewerComponent