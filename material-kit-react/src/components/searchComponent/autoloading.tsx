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
  exploreRecentCharge, exploreRecentSpend, exploreMemberCourse, updateExpiredTime, updateChargeAnnotation,createCard
} from '../../store/slices/dominationSlice'
import { createUserAccount } from '../../store/actions/usersActions';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import moment from 'moment';
import { get, find } from 'lodash'
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
    console.log("🚀 ~ handleFileUpload ~ file:", file)
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        let excelD = []
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = read(data, { type: 'array' });
        // console.log('----sheet length,',workbook, workbook.SheetNames.length)
        for (let i in workbook.SheetNames) {
          const sheetName = workbook.SheetNames[i];
          // console.log("🚀 ~ handleFileUpload ~ sheetName:", sheetName)
          if ((i as number) > 4) {
            console.log("🚀 ~ handleFileUpload ~ sheetName:    and break", sheetName)
            break
          }


          const sheet = workbook.Sheets[sheetName];
          const jsonData = utils.sheet_to_json(sheet, { header: 1, range: 1 });
          console.log('---------sheetName', sheetName, jsonData)
          const filt = jsonData.filter(j => j[5] !== '单独订场')
          console.log('---------sheetName', sheetName, filt)
          excelD = [...excelD, ...filt]
          // if (jsonData.length > 1) {
          //   const numGroups = Math.min(12, Math.floor((jsonData[1].length - 10) / 5)); // 最多12组
          //   console.log('--------excel===', sheetName, jsonData, '一共有学员', numGroups)
          // }
        }

        // console.log('--------excel===11111111', excelD)
        // 去掉每个数组末尾的所有空字符串
        const processedExcelD = excelD.map(row => {
          // 从后往前找到第一个非空字符串的位置
          let lastNonEmptyIndex = row.length - 1;
          while (lastNonEmptyIndex >= 0 && row[lastNonEmptyIndex] === '') {
            lastNonEmptyIndex--;
          }
          // 返回截取到最后一个非空元素的数组
          return row.slice(0, lastNonEmptyIndex + 1);
        });
        
        // setExcelData(res.data)
        unSubmittedCourse(processedExcelD)

      };
      reader.onerror = (e) => {
        console.log("🚀 ~ handleFileUpload ~ onerror e:", e)


      }
      reader.readAsArrayBuffer(file);
    }
  };

const unSubmittedCourse=async (excelD)=>{
  Axios.post(`/api/prepaidCard/course/duplicate`, excelD).then(res => {
    console.log('---------res from web ', res)
    setExcelData(res.data);
    setLoading(false);
  }).catch((e) => {
    console.log("🚀 ~ Axios.post ~ e:", e)
    setLoading(false);
  })
}

  const handleSubmitCourse = (item) => {
    const coureseType = ['体验课未成单', '体验课成单', '订场','班课', '私教' ]

    let coachObj = find(coach, { 'name': item[0] })
    let coachId = coachObj ? coachObj.number : null
    
    let courtObj = find(court, { 'name': item[6] })
    let courtName = courtObj ? courtObj.name : null
    
    let course = {
      startTime: item[2], endTime: item[3], coach: coachId, spendingTime: item[4], courtSpend: 0, coachSpend: 0, descript: item[10] || '备注无',
      court: courtName, courseType: coureseType.indexOf(item[5]) - 2, membersObj: null
    }

    let membersObj = {}
    if (course.courseType > 0) {
      let membs = Math.ceil((item.length - 11) / 5)
      for (let i = 0; i < membs; i++) {
        let membId = find(users, { 'name': item[i * 5 + 11] })
        if(  typeof membId==='undefined'){
          console.log("🚀 ~ error submit ~ item:数据错误，请修改日志", )
          return 
        }
        membId = membId.number
     

        membersObj[membId] = [0, 0, 0, item[i * 5 + 11 + 3], item[i * 5 + 11 + 4]]
        let idx = ['课时费', '次卡', '年卡'].indexOf(item[i * 5 + 11 + 1])
        membersObj[membId][idx] = item[i * 5 + 11 + 2]
        for (let j = 0;j < membersObj[membId].length; j++) {
          if(  membersObj[membId][idx]===null){
            console.log("🚀 ~ error submit ~ item:数据错误，请修改日志", )
            return 
          }
        }
      }
      course.membersObj = membersObj
    }

    console.log("🚀 ~ handleSubmitCourse ~ item:", item, course)
    
    // 检查必填字段是否有效（包括空字符串、undefined、null等情况）
    if(!course.court || !course.coach || course.courseType === null || course.courseType === undefined || course.courseType < -2){
      alert('数据错误，请修改日志 - 教练、场地或课程类型不正确')
      return
    }
    dispatch(createCard(course))
    setTimeout(()=>{
      unSubmittedCourse(excelData)

    },3000)
  }

  // useEffect(() => {
  //   console.log('--------coach', coach, users)
  // }, [excelData])

  const courseItem = (item) => {
    return (<Paper key={`item-course-${item[0]}-${item[2]}-${item[3]}`} elevation={3} sx={{
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
      ><Typography >
          {item[2]}~{item[3]}, 上课 {item[4]}小时，  课程类别: {item[5]} , 校区： {item[6]}  上课人数:{item[7]}  <br />, 灯光:{item[8]}，场地费:{item[9]} ,  备注:{item[10]}
        </Typography>
      </Stack>
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
      <Button variant='contained' onClick={() => { handleSubmitCourse(item) }}>提交</Button>
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
