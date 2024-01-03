/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-04-27 10:14:51
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-29 15:53:43
 * @content: edit your page content
 */
import React, { useEffect } from 'react';

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




function Analyse(props) {
    const dispatch = useDispatch()

    const CircleButton = styled(Button)({ borderRadius: '20px', })

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { court, users, sortValue, monthValue, charedLog, spendLog, createSuccess, course, analyseCourt, revenueCourt, courseDetail } = useSelector((state) => state.domination)

    const { success } = useSelector((state) => state.users)


    const [charedLogRec, setCharedLogRec] = React.useState(charedLog);


    const [prepaidCard, setPrepaidCard] = React.useState({});

    const [detailMode, setDetailMode] = React.useState(false);
    const [userSort, setUserSort] = React.useState(false);
    const [customerName, setCustomerName] = React.useState('');
    const [customerOpenId, setCustomerOpenId] = React.useState('');
    const [annualTimes, setAnnualTimes] = React.useState(prepaidCard.annualCount || 0);
    const [expiredTime, setExpiredTime] = React.useState(prepaidCard.annualExpireTime || '');
    const [open, setOpen] = React.useState(0);//0 关；  1 金额  ；  2   次数

    const [timeRange, setTimeRange] = React.useState([moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').add(1, 'days').format('YYYY-MM-DD')]);
    const [coachName, setCoachName] = React.useState('');
    useEffect(() => {
        dispatch(exploreCourseAnalyse({ startTime: moment().startOf('month').format('YYYY-MM-DD'), endTime: moment().endOf('month').add(1, 'days').format('YYYY-MM-DD') }))
    }, [])


    useEffect(() => {
        console.log('-----analyseCourt,revenueCourt,courseDetail-----', analyseCourt, revenueCourt, courseDetail)
    }, [analyseCourt, revenueCourt, courseDetail])


    const currentList = (coach) => {
        dispatch(exploreCourseDetail({ coach, startTime: timeRange[0], endTime: timeRange[1] }))
    }


    const generateExcel = (jsonData, fileName) => {
        const worksheet = XLSX.utils.json_to_sheet(jsonData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, fileName);
    }


    const finacialItem = () => {
        return (
            monthValue.map((a, ids) => {
                return (
                    <CircleButton
                        key={ids}
                        value={a}
                        size="small"
                        variant={1 === 1 ? "contained" : "outlined"}
                        sx={{ margin: '5px' }}
                        onClick={
                            (e) => {
                                console.log(e.target.value)
                                var idx = monthValue.indexOf(e.target.value)
                                var def = idx - moment().month()
                                console.log(e.target.value, idx, def)
                                if (idx === 12) {
                                    dispatch(exploreCourseAnalyse({
                                        startTime: moment().startOf('year').subtract(1,'years').format('YYYY-MM-DD'),
                                        endTime: moment().endOf('year').subtract(1,'years').format('YYYY-MM-DD')
                                    }))
                                } else {

                                    dispatch(exploreCourseAnalyse({
                                        startTime: moment().add(def, "month").startOf('month').subtract(1,'years').format('YYYY-MM-DD'),
                                        endTime: moment().add(def, "month").endOf('month').add(1, 'days').subtract(1,'years').format('YYYY-MM-DD')
                                    }))
                                    setTimeRange([moment().add(def, "month").startOf('month').format('YYYY-MM-DD'), moment().add(def, "month").endOf('month').add(1, 'days').format('YYYY-MM-DD')])
                                }

                                // if (!values.includes(e.target.value)) {
                                //   values.push(e.target.value)
                                // } else {
                                //   values = values.filter(value => e.target.value !== value)
                                // }
                                // params[props.searchType] = values
                                // delete params["topic"];
                                // navigate(`/explore?${qs.stringify(params, { arrayFormat: 'brackets' })}`)
                            }
                        }
                    >
                        {a}
                    </CircleButton>
                )
            }))
    }



    const fileItem = (user, index) => {

        var member = Object.values(user)[0]
        // console.log(user, member)
        return (<Grid item xs={6} key={index} space={1}>
            <Paper elevation={1} sx={{ background: user.prepaidCard ? 'transparent' : 'rgba(0,0,0,0.1)', '& :hover': { background: 'rgb(0,0,0,0.1)' } }}>
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={0}
                    sx={{ cursor: 'pointer', '& :hover': { background: 'transparent' } }}
                    onMouseEnter={() => {

                    }}
                    onMouseLeave={() => {

                    }}
                    onClick={(event) => {


                    }}>
                    {/* <Avatar alt="Remy Sharp" src={user.avator} /> */}


                    <Typography gutterBottom variant="body2"
                        sx={{
                            // background: 'transparent',
                            '& :hover': { background: '#985541' },
                            // color: 'rgba(0, 0, 0, 0.6)',
                            whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '8%', textAlign: 'center'
                        }} >
                        {Object.keys(user)[0]}
                    </Typography>
                    {/* <Typography gutterBottom variant="body2"
                        sx={{
                            // background: 'transparent',
                            '& :hover': { background: '#985541' },
                            // color: 'rgba(0, 0, 0, 0.6)',
                            whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '10%', textAlign: 'center'
                        }} >
                        {user}
                    </Typography> */}
                    <Typography gutterBottom variant="body2"
                        sx={{
                            // background: 'transparent',
                            '& :hover': { background: '#985541' },
                            // color: 'rgba(0, 0, 0, 0.6)',
                            whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '13%', textAlign: 'center'
                        }} >
                        上课： {member.courses}节
                    </Typography>
                    <Typography gutterBottom variant="body2"
                        sx={{
                            // background: 'transparent',
                            '& :hover': { background: '#985541' },
                            // color: 'rgba(0, 0, 0, 0.6)',
                            whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '13%', textAlign: 'center'
                        }} >
                        学生： {member.members}人
                    </Typography>
                    <Typography gutterBottom variant="body2"
                        sx={{
                            // background: 'transparent',
                            '& :hover': { background: '#985541' },
                            // color: 'rgba(0, 0, 0, 0.6)',
                            whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '13%', textAlign: 'center'
                        }} >
                        满班率：{member.analyse.toFixed(2)}
                    </Typography>
                    <Typography gutterBottom variant="body2"
                        sx={{
                            // background: 'transparent',
                            '& :hover': { background: '#985541' },
                            // color: 'rgba(0, 0, 0, 0.6)',
                            whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '13%', textAlign: 'center'
                        }} >
                        课时数：{member.workTime}
                    </Typography>
                    <Typography gutterBottom variant="body2"
                        sx={{
                            // background: 'transparent',
                            '& :hover': { background: '#985541' },
                            // color: 'rgba(0, 0, 0, 0.6)',
                            whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '30%', textAlign: 'center'
                        }} >
                        体验课：{member.deal || 0}/{member.trial || 0} ,成单率:{((member.deal || 0) / (member.trial || 0)).toFixed(2) * 100}%
                    </Typography>
                </Stack>


            </Paper>
        </Grid>
        )
    }


    const revenueItem = (user, index) => {

        var member = Object.values(user)[0]
        var color = '#69d147'
        Object.keys(user).forEach(key => {
            if (key.includes('校区') || key.trim() === '' || key.includes('总共')) {
                color = '#e1e2e4'
            }
        })
        return (<Grid item xs={4} key={index} space={1}>
            <Paper elevation={1} sx={{ background: user.prepaidCard ? 'transparent' : 'rgba(0,0,0,0.1)', '& :hover': { background: 'rgb(0,0,0,0.1)' } }}>
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={0}
                    sx={{ background: color, cursor: 'pointer', '& :hover': { background: 'transparent' } }}
                    onMouseEnter={() => {

                    }}
                    onMouseLeave={() => {

                    }}
                    onClick={(event) => {
                        console.log('----------点迹收入详情---------', Object.keys(user)[0], member)
                        if (!Object.keys(user)[0].includes('总共') && !Object.keys(user)[0].includes('校区') && Object.keys(user)[0].trim() !== '') {
                            setCoachName(Object.keys(user)[0])
                            currentList(Object.keys(user)[0])
                        }

                    }}>
                    {/* <Avatar alt="Remy Sharp" src={user.avator} /> */}


                    <Typography gutterBottom variant="body2"
                        sx={{
                            // background: 'transparent',
                            '& :hover': { background: '#985541' },
                            // color: 'rgba(0, 0, 0, 0.6)',
                            whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '30%', textAlign: 'center'
                        }} >
                        {Object.keys(user)[0]}
                    </Typography>
                    {/* <Typography gutterBottom variant="body2"
                        sx={{
                            // background: 'transparent',
                            '& :hover': { background: '#985541' },
                            // color: 'rgba(0, 0, 0, 0.6)',
                            whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '10%', textAlign: 'center'
                        }} >
                        {user}
                    </Typography> */}
                    <Typography gutterBottom variant="body2"
                        sx={{
                            // background: 'transparent',
                            '& :hover': { background: '#985541' },
                            // color: 'rgba(0, 0, 0, 0.6)',
                            whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '20%', textAlign: 'center'
                        }} >
                        充值： {Object.keys(user)[0] === '总共' ? member.charge / 1: member.charge}元
                    </Typography>
                    <Typography gutterBottom variant="body2"
                        sx={{
                            // background: 'transparent',
                            '& :hover': { background: '#985541' },
                            // color: 'rgba(0, 0, 0, 0.6)',
                            whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '20%', textAlign: 'center'
                        }} >
                        消费： {Object.keys(user)[0] === '总共' ? member.spend / 1: member.spend}元
                    </Typography>
                    <Typography gutterBottom variant="body2"
                        sx={{
                            // background: 'transparent',
                            '& :hover': { background: '#985541' },
                            // color: 'rgba(0, 0, 0, 0.6)',
                            whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '20%', textAlign: 'center'
                        }} >
                        未消费： {member.equival }元
                    </Typography>


                </Stack>


            </Paper>
        </Grid>
        )
    }


    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',

        boxShadow: 0,
        p: 4,
    };








    return (
        <Stack justifyContent="flex-start"
            alignItems="flex-start"
            sx={{ marginLeft: 2, overflowY: 'auto', height: '100%', paddingBottom: -2 }}
            spacing={5}
        >
            <Button variant="outlined" size="small"
                onClick={() => {
                    // dispatch(selectCourse(item))

                    var courtItems = []
                    analyseCourt.forEach(item => {
                        var courtItem = {}
                        for (let key in item) {
                            if (typeof item[key] === 'object') {
                                courtItem = Object.assign(courtItem, { name: key })
                                // 如果属性值是对象，则继续遍历
                                for (let subKey in item[key]) {
                                    courtItem[subKey] = item[key][subKey]
                                }
                            }
                        }
                        courtItems.push(courtItem)
                    })
                    generateExcel(courtItems, '课程统计.xlsx')




                    courtItems = []
                    var shools = []
                    revenueCourt.forEach(item => {
                        var courtItem = {}
                        for (let key in item) {
                            if (typeof item[key] === 'object') {
                                if (key === '总共' || typeof key === 'undefined') {
                                    continue
                                }
                                courtItem = Object.assign(courtItem, { name: key })
                                // 如果属性值是对象，则继续遍历
                                for (let subKey in item[key]) {
                                    courtItem[subKey] = item[key][subKey]
                                }
                            }
                        }
                        if (courtItem.name && courtItem.name.includes('校区')) {
                            shools.push(courtItem)
                        } else {
                            courtItems.push(courtItem)
                        }

                    })
                    generateExcel([...courtItems, ...shools], '充值消课统计.xlsx')
                    // , revenueCourt, courseDetail
                }}>下载excel</Button>
            <Stack justifyContent="flex-start"
                alignItems="center"
                spacing={2}
                direction="row"
            >
                {finacialItem()}

                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={async () => {
                        if (detailMode) {
                            setDetailMode(!detailMode)
                            setCustomerName('')
                        }


                    }}
                >
                    {detailMode ? <ArrowBackIcon /> : <CachedIcon onClick={async () => {
                        dispatch(exploreUsersAction())

                    }} />}
                </IconButton>
            </Stack>

            <Stack justifyContent="flex-start"
                spacing={2}
                direction="row"
            >
                满班率
            </Stack>

            <Stack justifyContent="flex-start"
                spacing={2}
                direction="row"
            >
                <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={4}
                    sx={{ height: '10%', width: '100%' }}>
                    {analyseCourt && analyseCourt.map((file, index) => fileItem(file, index))}
                </Grid>
            </Stack>

            <Stack justifyContent="flex-start"
                spacing={2}
                direction="row"
            >
                充值消课
            </Stack>

            <Stack justifyContent="flex-start"
                spacing={2}
                direction="row"
            >

                <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={4}
                    sx={{ height: '10%', width: '100%' }}>
                    {revenueCourt && revenueCourt.map((file, index) => revenueItem(file, index))}
                </Grid>

            </Stack>
            <Stack justifyContent="flex-start"
                spacing={2}
                direction="row"
            >
                {coachName}
            </Stack>
            <Stack justifyContent="flex-start"
                spacing={2}
                direction="row"
            >
                <Typography component='p' paragraph={true}>

                    {courseDetail.split("\r\n").map((i, key) => {
                        return <div key={key}>{i}</div>;
                    })}
                </Typography>
            </Stack>

            <Typography gutterBottom variant="body2">&nbsp;</Typography>


        </Stack >
    );
}
export default Analyse