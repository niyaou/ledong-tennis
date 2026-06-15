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

import { Button, Card, Stack, MenuItem, NoSsr, Paper, Box, Typography, Select, AvatarGroup, TextField, Avatar, FormControl, Checkbox, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Modal, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

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
  const [balanceWarningOpen, setBalanceWarningOpen] = useState<boolean>(false);
  const [balanceWarnings, setBalanceWarnings] = useState<any>({ currentDebt: [], afterDebt: [] });
  const [pendingCourse, setPendingCourse] = useState<any>(null);

  const toNumber = (value, defaultValue = 0) => {
    const numberValue = parseFloat(value)
    return Number.isFinite(numberValue) ? numberValue : defaultValue
  }

  const TIMES_CARD_UNIT_PRICE = 200
  const ANNUAL_CARD_UNIT_PRICE = 150

  const calculateTotalBalance = (restCharge, timesCount, annualCount) => {
    return toNumber(restCharge) + toNumber(timesCount) * TIMES_CARD_UNIT_PRICE + toNumber(annualCount) * ANNUAL_CARD_UNIT_PRICE
  }

  const calculateBalanceWarnings = (membersObj) => {
    const currentDebt = []
    const afterDebt = []

    Object.entries(membersObj || {}).forEach(([memberNumber, spendInfo]: any) => {
      const user = find(users, (u) => String(u.number) === String(memberNumber))
      if (!user) {
        return
      }

      const currentBalance = calculateTotalBalance(user.restCharge, user.timesCount, user.annualCount)
      const deduction = calculateTotalBalance(spendInfo?.[0], spendInfo?.[1], spendInfo?.[2])
      const afterBalance = currentBalance - deduction

      if (currentBalance < 0) {
        currentDebt.push({
          name: user.name,
          number: user.number,
          currentBalance,
          restCharge: toNumber(user.restCharge),
          timesCount: toNumber(user.timesCount),
          annualCount: toNumber(user.annualCount),
        })
      }

      if (currentBalance >= 0 && afterBalance < 0) {
        afterDebt.push({
          name: user.name,
          number: user.number,
          currentBalance,
          deduction,
          afterBalance,
          spendFee: toNumber(spendInfo?.[0]),
          times: toNumber(spendInfo?.[1]),
          annual: toNumber(spendInfo?.[2]),
        })
      }
    })

    return { currentDebt, afterDebt }
  }

  const submitCourse = (course) => {
    dispatch(createCard(course))
    setTimeout(() => {
      unSubmittedCourse(excelData)
    }, 3000)
  }

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
        for (let i = 0; i < workbook.SheetNames.length; i++) {
          const sheetName = workbook.SheetNames[i];
          // console.log("🚀 ~ handleFileUpload ~ sheetName:", sheetName)
          if (i > 4) {
            console.log("🚀 ~ handleFileUpload ~ sheetName:    and break", sheetName)
            break
          }


          const sheet = workbook.Sheets[sheetName];
          const jsonData = utils.sheet_to_json(sheet, { header: 1, range: 1 });
          console.log('---------sheetName', sheetName, jsonData)
          // const filt = jsonData.filter(j => j[5] !== '单独订场') //奇怪为啥要过滤
          const filt = [...jsonData]
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
    
    const adultFieldValue = item[8]
    const hasAdultField = (adultFieldValue === '成人' || adultFieldValue === '儿童') || (item.length > 11 && (item.length - 11) % 5 !== 0)
    const remarkIndex = hasAdultField ? 11 : 10
    const memberStartIndex = hasAdultField ? 12 : 11
    const membersDataLength = item.length - memberStartIndex
    const isAdult = hasAdultField ? (adultFieldValue === '儿童' ? 0 : 1) : 1
    
    let course = {
      startTime: item[2], endTime: item[3], coach: coachId, spendingTime: item[4], courtSpend: 0, coachSpend: 0, descript: item[remarkIndex] || '备注无',
      court: courtName, courseType: coureseType.indexOf(item[5].replace('单独', '')) - 2, membersObj: null, isAdult: isAdult
    }

    let membersObj = {}
    if (course.courseType > -1 ) {
      course.membersObj = membersObj
      if(membersDataLength > 0){
      let membs = Math.ceil(membersDataLength / 5)
      for (let i = 0; i < membs; i++) {
        let memberBaseIndex = i * 5 + memberStartIndex
        let membId = find(users, { 'name': item[memberBaseIndex] })
        if(  typeof membId==='undefined'){
          console.log("🚀 ~ error submit ~ item:数据错误，请修改日志  ", )
          return 
        }
        membId = membId.number
     

        membersObj[membId] = [0, 0, 0, item[memberBaseIndex + 3], item[memberBaseIndex + 4]]
        let idx = ['课时费', '次卡', '年卡'].indexOf(item[memberBaseIndex + 1])
        membersObj[membId][idx] = item[memberBaseIndex + 2]
        for (let j = 0;j < membersObj[membId].length; j++) {
          if(  membersObj[membId][idx]===null){
            console.log("🚀 ~ error submit ~ item:数据错误，请修改日志", )
            return 
          }
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
    const warnings = calculateBalanceWarnings(course.membersObj)
    if (warnings.currentDebt.length > 0 || warnings.afterDebt.length > 0) {
      setBalanceWarnings(warnings)
      setPendingCourse(course)
      setBalanceWarningOpen(true)
      return
    }

    submitCourse(course)
  }

  // useEffect(() => {
  //   console.log('--------coach', coach, users)
  // }, [excelData])

  const courseItem = (item) => {
    const adultFieldValue = item[8]
    const hasAdultField = (adultFieldValue === '成人' || adultFieldValue === '儿童') || (item.length > 11 && (item.length - 11) % 5 !== 0)
    const courseTypeLabel = hasAdultField ? (adultFieldValue || '成人') : '成人'
    const lightIndex = hasAdultField ? 9 : 8
    const fieldFeeIndex = hasAdultField ? 10 : 9
    const remarkIndex = hasAdultField ? 11 : 10
    const memberStartIndex = hasAdultField ? 12 : 11
    const memberDisplayCount = Math.max(0, Math.floor((item.length - memberStartIndex) / 5))
    const membersToShow = Math.min(12, memberDisplayCount)

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
          {item[2]}~{item[3]}, 上课 {item[4]}小时，  课程类别: {item[5]} , 校区： {item[6]}  上课人数:{item[7]}  <br />, 课程类型:{courseTypeLabel}, 灯光:{item[lightIndex] ?? '--'}，场地费:{item[fieldFeeIndex] ?? '--'} ,  备注:{item[remarkIndex] ?? '无'}
        </Typography>
      </Stack>
      <Stack
        spacing={2}
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        sx={{ padding: 1, background: 'transparent', '& :hover': { background: 'transparent' } }}
      >
        {Array.from({ length: membersToShow }, (_, index) => index).map(idx => {
          const memberBaseIndex = memberStartIndex + idx * 5
          return (<Stack key={`course-member-${item[0]}-${item[2]}-${idx}`}><Typography>{`${item[memberBaseIndex]}, 课型（ ${item[memberBaseIndex + 1]}）, 扣费数量 ${item[memberBaseIndex + 2]}， 等效价格：${item[memberBaseIndex + 3]}， 上课人数：${item[memberBaseIndex + 4]} `}</Typography></Stack>)
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
      <Dialog
        open={balanceWarningOpen}
        onClose={() => {
          setBalanceWarningOpen(false)
          setPendingCourse(null)
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>客户余额不足确认</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            {balanceWarnings.currentDebt.length > 0 && (
              <Box>
                <Typography variant="subtitle1">已经欠费</Typography>
                {balanceWarnings.currentDebt.map((customer) => (
                  <Box key={`current-debt-${customer.number}`} sx={{ mt: 1 }}>
                    <Typography variant="body2">{customer.name}（{customer.number}）</Typography>
                    <Typography variant="body2" sx={{ color: 'error.main', ml: 2 }}>
                      当前折算余额 {customer.currentBalance} = 余额 {customer.restCharge} + 次卡 {customer.timesCount} * {TIMES_CARD_UNIT_PRICE} + 年卡 {customer.annualCount} * {ANNUAL_CARD_UNIT_PRICE}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
            {balanceWarnings.afterDebt.length > 0 && (
              <Box>
                <Typography variant="subtitle1">扣除后会欠费</Typography>
                {balanceWarnings.afterDebt.map((customer) => (
                  <Box key={`after-debt-${customer.number}`} sx={{ mt: 1 }}>
                    <Typography variant="body2">{customer.name}（{customer.number}）</Typography>
                    <Typography variant="body2" sx={{ color: 'error.main', ml: 2 }}>
                      当前折算余额 {customer.currentBalance}，本次扣除 {customer.deduction} = 课时费 {customer.spendFee} + 次卡 {customer.times} * {TIMES_CARD_UNIT_PRICE} + 年卡 {customer.annual} * {ANNUAL_CARD_UNIT_PRICE}，扣后 {customer.afterBalance}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setBalanceWarningOpen(false)
              setPendingCourse(null)
            }}
          >
            取消
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (pendingCourse) {
                submitCourse(pendingCourse)
              }
              setBalanceWarningOpen(false)
              setPendingCourse(null)
            }}
          >
            继续
          </Button>
        </DialogActions>
      </Dialog>
    </Stack >
  );
}
export default Autoloading
