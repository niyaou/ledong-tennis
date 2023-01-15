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

import { styled } from '@mui/material/styles';


import CachedIcon from '@mui/icons-material/Cached';
import { useSelector } from "../../redux/hooks";
import { useSnackbar } from 'notistack';
import IconButton from '@mui/material/IconButton';
import { useDispatch } from 'react-redux';

import { exploreUsersAction, exploreRecentCourse, selectCourse as selectCourseAction, exploreCourseAnalyse, exploreRecentCharge, exploreRecentSpend, exploreMemberCourse, updateExpiredTime, updateChargeAnnotation, } from '../../store/slices/dominationSlice'
import { createUserAccount } from '../../store/actions/usersActions';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import moment from 'moment';
import { get} from 'lodash'
var pinyin = require('../../common/utils/pinyinUtil.js')




function Analyse(props) {
    const dispatch = useDispatch()

    const CircleButton = styled(Button)({ borderRadius: '20px', })

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { court, users, sortValue, charedLog, spendLog, createSuccess, course, analyseCourt } = useSelector((state) => state.domination)

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

  

    useEffect(() => {
        dispatch(exploreCourseAnalyse)
    }, [])






    const finacialItem =
        (<Stack
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
            direction="row"
        >
            <Typography gutterBottom variant="body2"
                sx={{
                    color: 'rgba(0, 0, 0, 0.6)',

                }} >
                会员名称：{customerName}
            </Typography>
            <Typography gutterBottom variant="body2"
                sx={{
                    color: 'rgba(0, 0, 0, 0.6)', cursor: 'pointer',
                }}
                onClick={() => {
                    setOpen(1)
                    console.log('-------1------11--------11----1----')
                    // dispatch(updateEx1piredTime({cardId:customerName,time: moment(expiredTime).format( 'YYYY-MM-DD'),rest:parseInt(annualTimes)}))
                }}
            >
                充值卡余额：{prepaidCard.restCharge}
            </Typography>
            <Typography gutterBottom variant="body2"
                sx={{
                    color: 'rgba(0, 0, 0, 0.6)', cursor: 'pointer',
                }}
                onClick={() => {
                    console.log('---------------------2222--------')
                    setOpen(2)
                    // dispatch(updateExpiredTime({cardId:customerName,time: moment(expiredTime).format( 'YYYY-MM-DD'),rest:parseInt(annualTimes)}))
                }}
            >
                次卡余额：  {prepaidCard.timesCount}
            </Typography>
            {/* <Typography gutterBottom variant="body2"
                sx={{
                    color: 'rgba(0, 0, 0, 0.6)',
                }} >
                次卡到期时间  {prepaidCard.timesExpireTime}
            </Typography> */}
            <Typography gutterBottom variant="body2"
                sx={{
                    color: 'rgba(0, 0, 0, 0.6)',
                }} >
                剩余年卡次数  {prepaidCard.annualCount}
            </Typography>
            <Typography gutterBottom variant="body2"
                sx={{
                    color: 'rgba(0, 0, 0, 0.6)',
                }} >
                年卡到期时间  {prepaidCard.annualExpireTime}
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <FormControl sx={{ m: 1, minWidth: 120, }} size="small">
                    <TextField
                        id="date"
                        label="Birthday"
                        type="date"
                        value={expiredTime}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(newValue) => {
                            console.log("🚀 ~ file: additions.tsx ~ line 665 ~ Additions ~ newValue", newValue)
                            setExpiredTime(newValue.currentTarget.value)
                        }}
                    />
                    {/* <DatePicker
                        label="年卡到期时间"
                        value={expiredTime}
                        onChange={(newValue) => {
                            console.log("🚀 ~ file: additions.tsx ~ line 665 ~ Additions ~ newValue", newValue)
                            setExpiredTime(newValue)
                        }}
                        renderInput={(params) => {
                            return (<TextField {...params} />)
                        }}
                    /> */}
                </FormControl>
            </LocalizationProvider>


            <Button variant="contained" size="small"
                disabled={expiredTime === ''}

                onClick={() => {
                    console.log('---expiredTime-', expiredTime)
                    dispatch(updateExpiredTime({ number: customerOpenId, annualExpireTime: moment(expiredTime).format('YYYY-MM-DD') }))

                }}>修改年卡时间次数</Button>

        </Stack>)


    const fileItem = (user, index) => {
     
        var member=Object.values(user)[0]
        console.log(user,member)
        return (<Grid item xs={4} key={index} space={1}>
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
                            whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '10%', textAlign: 'center'
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
                       上课： {member.courses}节
                    </Typography>
                    <Typography gutterBottom variant="body2"
                        sx={{
                            // background: 'transparent',
                            '& :hover': { background: '#985541' },
                            // color: 'rgba(0, 0, 0, 0.6)',
                            whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '20%', textAlign: 'center'
                        }} >
                      学生： {member.members}人
                    </Typography>
                    <Typography gutterBottom variant="body2"
                        sx={{
                            // background: 'transparent',
                            '& :hover': { background: '#985541' },
                            // color: 'rgba(0, 0, 0, 0.6)',
                            whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '20%', textAlign: 'center'
                        }} >
                        满班率：{member.analyse}
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








    const chargeItem = (charge) => {

        return (<Paper key={`charge-item-${charge.id}`} elevation={1} sx={{
            minWidth: '850px',
            background: 'transparent',
            '& :hover': { background: 'rgb(0,0,0,0.1)' }
        }}>
            <Stack

                spacing={2}
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                sx={{ padding: 1, background: 'transparent', '& :hover': { background: 'transparent' } }}
            >

                <Typography gutterBottom variant="body2"
                    sx={{
                        color: 'rgba(0, 0, 0, 0.6)',
                        minWidth: '80px',
                    }} >
                    {charge.chargedTime}
                </Typography>
                <Typography gutterBottom variant="body2"
                    sx={{
                        color: 'rgba(0, 0, 0, 0.6)',
                        minWidth: '80px',
                    }} >
                    {charge.description}
                </Typography>
                <Typography gutterBottom variant="body2"
                    sx={{
                        color: 'rgba(0, 0, 0, 0.6)',
                        minWidth: '80px',
                    }} >
                    充值{charge.charge}元，次卡{charge.times},年卡{charge.annualTimes}
                </Typography>


                <Button
                    variant="outlined"
                    color="primary"
                    sx={{
                        color: 'rgba(0, 0, 0, 0.6)',
                        minWidth: '80px',
                    }}
                    onClick={() => {
                        console.log(course, customerName)
                        // dispatch(retreatRecentCourse({cardId:customerName,time:course.time}))
                    }}
                >

                    删除
                </Button>
            </Stack>
        </Paper>)
    }


    return (
        <Stack justifyContent="flex-start"
            alignItems="flex-start"
            sx={{ marginLeft: 2, overflowY: 'auto', height: '100%', paddingBottom: -2 }}
            spacing={2}
        >
            <Stack justifyContent="flex-start"
                alignItems="center"
                spacing={2}
                direction="row"
            >


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
            <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={4}
                sx={{ height: '10%', width: '100%' }}>
                {analyseCourt && analyseCourt.map((file, index) => fileItem(file, index))}
            </Grid>


            <Stack justifyContent="flex-start"

                spacing={2}
                direction="row"
            >


            </Stack>


            <Typography gutterBottom variant="body2">&nbsp;</Typography>


        </Stack>
    );
}
export default Analyse