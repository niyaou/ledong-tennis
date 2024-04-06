/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-04-27 10:14:51
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-29 15:53:43
 * @content: edit your page content
 */
import React, { useEffect, useState } from 'react';

import { Button, Card, Stack, MenuItem, NoSsr, Paper, Box, Typography, Select, AvatarGroup, TextField, Avatar, FormControl, Checkbox, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Modal } from '@mui/material';

import { keyframes, styled } from '@mui/material/styles';


import CachedIcon from '@mui/icons-material/Cached';
import { useSelector } from "../../redux/hooks";
import { useSnackbar } from 'notistack';
import IconButton from '@mui/material/IconButton';
import { useDispatch } from 'react-redux';

import {
  exploreUsersAction, exploreRecentCourse, selectCourse as selectCourseAction, exploreCourseAnalyse, exploreCourseDetail,
  exploreRecentCharge, exploreRecentSpend, exploreMemberCourse, updateExpiredTime, updateChargeAnnotation,
} from '../../store/slices/dominationSlice'
import { createUserAccount } from '../../store/actions/usersActions';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import moment from 'moment';
import { get } from 'lodash'
import Axios from '../../common/axios/axios'
import XLSX from 'xlsx'
var pinyin = require('../../common/utils/pinyinUtil.js')

import { read, utils } from 'xlsx';


function Autoloading(props) {
  const dispatch = useDispatch()

  const CircleButton = styled(Button)({ borderRadius: '20px', })
  const { areas, users, selectCourse, createSuccess, coach, court } = useSelector((state) => state.domination)
 


  const [excelData, setExcelData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        let excelD = []
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = read(data, { type: 'array' });
        console.log('----sheet length,', workbook.SheetNames.length)
        for (let i in workbook.SheetNames) {
          if ((i as number) > 4) {
            break
          }

          const sheetName = workbook.SheetNames[i];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = utils.sheet_to_json(sheet, { header: 1 });
          console.log('---------i', i,)
          if (jsonData.length > 1) {
            const numGroups = Math.min(12, Math.floor((jsonData[1].length - 10) / 5)); // 最多12组
            excelD.push(jsonData[1])
            console.log('--------excel===', sheetName, jsonData, '一共有学员', numGroups)
          }
        }
        console.log('--------excel===11111111', excelD)
       
        Axios.post(`/api/prepaidCard/course/duplicate`,excelD).then(res=>{
          console.log('---------res from web ',res)
          setExcelData(res.data);
          setLoading(false);
        }).catch((e)=>{
          setLoading(false);
        })

      };
      reader.readAsArrayBuffer(file);
    }
  };

const handleSubmitCourse=(item) => {
  console.log("🚀 ~ handleSubmitCourse ~ item:", item)
 
}

  useEffect(()=>{
    console.log('--------coach',coach,users)
  },[excelData])

  const courseItem = (item) => {
    return (<Paper key={`item-course-${item[0]}-${item[2]}`} elevation={3} sx={{
      minWidth: '850px',
      background: 'transparent',
      '& :hover': { background: 'rgb(0,0,0,0.1)' }
    }}>
      <Stack

        spacing={2}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ padding: 1, background: 'transparent', '& :hover': { background: 'transparent' } }}
      >
        {item[0]} : {item[1]}
      </Stack>
      <Stack

        spacing={2}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ padding: 1, background: 'transparent', '& :hover': { background: 'transparent' } }}
      >{item[2]}~{item[3]}, 上课 {item[4]}小时，  课程类别: {item[5]} , 校区： {item[6]}  上课人数:{item[7]}  , 灯光:{item[8]}，场地费:{item[9]} </Stack>
      <Stack
        spacing={2}
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        sx={{ padding: 1, background: 'transparent', '& :hover': { background: 'transparent' } }}
      >
        {Array.from({ length: Math.min(12, Math.floor((item.length - 11) / 5)) }, (_, index) => index).map(idx => {
          return (<Stack><Typography>{`${item[11 + idx * 5]}, 课型（ ${item[12 + idx * 5]}）, 扣费数量 ${item[13 + idx * 5]}， 等效价格：${item[14 + idx * 5]}， 上课人数：${item[15 + idx * 5]} `}</Typography></Stack>)
        })}
      </Stack>
      <Button variant='contained' onClick={()=>{handleSubmitCourse(item)}}>提交</Button>
    </Paper>)
  }




  return (
    <Stack justifyContent="flex-start"
      alignItems="flex-start"
      sx={{ marginLeft: 2, overflowY: 'auto', height: '100%', paddingBottom: -2 }}
      spacing={5}
    >

      <input
        accept=".xlsx"
        style={{ display: 'none' }}
        id="contained-button-file"
        type="file"
        onChange={handleFileUpload}
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" component="span">
      上传excel
        </Button>
      </label>
      {excelData.map(item => { return courseItem(item) })}
    </Stack >
  );
}
export default Autoloading