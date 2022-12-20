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
import DsFolderTree from '../fileExplore/dsFolderTree'
import DataFolderExplore from '../fileExplore/folderExploreComponent'
import FsResourceManagement from '../createDs/fsResourseManagement'
import { Button, Card, Stack, NoSsr, Paper, Box, Typography, AvatarGroup, TextField, Avatar, FormControl, Checkbox, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Modal } from '@mui/material';
import IdsFileTree from '../fileExplore/idsFileTree'
import { makeStyles, createStyles } from '@mui/styles';
import FolderIcon from '@mui/icons-material/Folder';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import CachedIcon from '@mui/icons-material/Cached';
import { useSelector } from "../../redux/hooks";
import { useSnackbar } from 'notistack';
import IconButton from '@mui/material/IconButton';
import { useDispatch } from 'react-redux';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import {
    selectedAndMoveTaskAction, deleteSelectedAndMoveTaskAction
} from '../../store/actions/inSensitiveActions';
import { exploreUsersAction, exploreRecentCourse, selectCourse as selectCourseAction, exploreRecentCard, updateExpiredTime ,updateChargeAnnotation,retreatRecentCourse} from '../../store/slices/dominationSlice'
import {createUserAccount} from '../../store/actions/usersActions';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import moment from 'moment';
import { classNames } from 'cascader/helpers';
var pinyin = require('../../common/utils/pinyinUtil.js')

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.primary[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
}));


function SearchTask(props) {
    const dispatch = useDispatch()
    const index = props.index
    const CircleButton = styled(Button)({ borderRadius: '20px', })
    const [checked, setChecked] = React.useState<readonly number[]>([]);
    const [left, setLeft] = React.useState<readonly number[]>([0, 1, 2, 3]);
    const [right, setRight] = React.useState<readonly number[]>([4, 5, 6, 7]);
    // const { taskQueue, deleteTaskSuccess, cacheTree, createFolderSuccess, errorMsg, folderAsyncStatus, currentSelectFolderTree } = useSelector((state) => state.inSensitive)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { areas, users, sortValue, recentPrepayedCard, createSuccess } = useSelector((state) => state.domination)

    const { success } = useSelector((state) => state.users)


    const [prepaidCard, setPrepaidCard] = React.useState({ balance: 0, balanceTimes: 0, expiredTime: null, restCount: 0 });
    const [courseList, setCourseList] = React.useState([]);
    const [detailMode, setDetailMode] = React.useState(false);
    const [userSort, setUserSort] = React.useState(false);
    const [customerName, setCustomerName] = React.useState('');
    const [customerOpenId, setCustomerOpenId] = React.useState('');
    const [annualTimes, setAnnualTimes] = React.useState(prepaidCard.restCount || 0);
    const [expiredTime, setExpiredTime] = React.useState(prepaidCard.expiredTime || '');
    const [open, setOpen] = React.useState(0);//0 关；  1 金额  ；  2   次数

    const [create, setCreate] = React.useState(0);//0 关；  1 显示

    const [changeFee, setChangeFee] = React.useState(0);//0 关；  1 金额  ；  2   次数
    const [changeCount, setChangeCount] = React.useState(0);//0 关；  1 金额  ；  2   次数
    const [changeDesc, setChangeDesc] = React.useState('');

    const [createUser, setCreateUser] = React.useState({number:'',name:''});//创建用户数据
    useEffect(() => {

        if (users) {
            console.log('-----user',users)
            setDetailMode(false)
            let sorts = users.concat()
            sorts.sort((a, b) => {
                return pinyin.pinyinUtil.getFirstLetter((a.name ).substring(0, 1)).toUpperCase() > pinyin.pinyinUtil.getFirstLetter((b.name).substring(0, 1)).toUpperCase() ? 1 : -1
            })
            setUserSort(sorts)
        }
        else {
            setUserSort([])
        }
    }, [users])


    useEffect(() => {
        if (prepaidCard && customerName) {
            setDetailMode(true)
            console.log("🚀 ~ file: searchTask.tsx ~ line 71 ~ SearchTask ~ prepaidCard", prepaidCard)
        }
    }, [prepaidCard])


    useEffect(() => {
        if (open !== 0 || expiredTime!=='') {
            setTimeout(() => {
                dispatch(exploreRecentCard(customerName))
            }, 2200)
            //     setDetailMode(true)
            //     console.log("🚀 ~ file: searchTask.tsx ~ line 71 ~ SearchTask ~ prepaidCard", prepaidCard)
        }
        setOpen(0)
        setChangeFee(0)
        setChangeCount(0)
        setChangeDesc('')
        setExpiredTime('')

    }, [createSuccess])


    useEffect(() => {
        if (success) {
            setCreate(0)
            enqueueSnackbar(`添加会员成功`, {
                variant: 'success',
                autoHideDuration: 3000,
              })
              dispatch(exploreUsersAction())
        }
    }, [success])

    


    useEffect(() => {
        if (recentPrepayedCard) {
            let card = recentPrepayedCard.filter(card => typeof card.balance !== 'undefined')[0]
            // let courselist = recentPrepayedCard.filter(card => typeof card.description !== 'undefined')
            let courselist = recentPrepayedCard.filter(card => typeof card.balance === 'undefined')
            // setDetailMode(true)
            setPrepaidCard(card)
            setExpiredTime(card.expiredTime || '')
            setAnnualTimes(card.restCount || 0)
            setCourseList(courselist)
            console.log("🚀 ~ file: searchTask.tsx ~   1line 733 ~ SearchTask ~ prepaidCard", card, courselist)
        }
    }, [recentPrepayedCard])




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
                充值卡余额：{prepaidCard.balance}
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
                次卡余额：  {prepaidCard.balanceTimes}
            </Typography>
            <Typography gutterBottom variant="body2"
                sx={{
                    color: 'rgba(0, 0, 0, 0.6)',
                }} >
                年卡到期时间  {prepaidCard.expiredTime}
            </Typography>
            <Typography gutterBottom variant="body2"
                sx={{
                    color: 'rgba(0, 0, 0, 0.6)',
                }} >
                剩余年卡次数  {prepaidCard.restCount}
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
            <TextField
                label="年卡次数"
                // label="Content(reply visable scale as the same as topic.)"
                required
                value={annualTimes}
                onChange={(event: any) => {
                    setAnnualTimes(event.target.value)
                }}

            />

            <Button variant="contained" size="small"
                disabled={!expiredTime && !annualTimes}

                onClick={() => {

                    dispatch(updateExpiredTime({ cardId: customerName, time: moment(expiredTime).format('YYYY-MM-DD'), rest: parseInt(annualTimes) }))
               
               }}>修改年卡时间次数</Button>

        </Stack>)


    const fileItem = (user, index) => {
        // console.log(user)
        return (<Grid item xs={3} key={index} space={1}>
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
                        if (user.prepaidCard) {
                            setCustomerName(user.prepaidCard)
                            setCustomerOpenId(user.openId)
                            dispatch(exploreRecentCard(user.prepaidCard))
                        }
                    }}>
                    {/* <Avatar alt="Remy Sharp" src={user.avator} /> */}


                    <Typography gutterBottom variant="body2"
                        sx={{
                            // background: 'transparent',
                            '& :hover': { background: '#985541' },
                            // color: 'rgba(0, 0, 0, 0.6)',
                            whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '90%', textAlign: 'center'
                        }} >
                        {user.name}  
                    </Typography>
                    <Typography gutterBottom variant="body2"
                        sx={{
                            // background: 'transparent',
                            '& :hover': { background: '#985541' },
                            // color: 'rgba(0, 0, 0, 0.6)',
                            whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '90%', textAlign: 'center'
                        }} >
                       电话 {user.number} 
                    </Typography>
                    <Typography gutterBottom variant="body2"
                        sx={{
                            // background: 'transparent',
                            '& :hover': { background: '#985541' },
                            // color: 'rgba(0, 0, 0, 0.6)',
                            whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '90%', textAlign: 'center'
                        }} >
                      余额：{user.restCharge} , 次卡：{user.timesCount}, 年卡：{user.annualCount}
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


    const uploadWaitingModal = (
        <Modal
            open={open !== 0}
            onClose={() => { setOpen(0) }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style} >
                <Stack
                    direction="column"
                    justifyContent="space-around"
                    alignItems="center"
                    spacing={1}>
                    <TextField
                        id="outlined-password-input"
                        label="充值余额"
                        value={changeFee}
                        onChange={(e) => {
                            setChangeFee(e.target.value);
                        }}
                    />
                    <TextField
                        id="outlined-password-input2"
                        label="充值次数"
                        value={changeCount}
                        onChange={(e) => {
                            setChangeCount(e.target.value);
                        }}
                    />
                    <TextField
                        id="outlined-password-input3"
                        label="备注"
                        value={changeDesc}
                        onChange={(e) => {
                            setChangeDesc(e.target.value);
                        }}
                    />
                    <Button variant="contained" size="small"


                        onClick={() => {
                            dispatch(updateChargeAnnotation({ openId: customerOpenId, coachId: '13551226924', cardId: customerName, amount: parseInt(changeFee), time: moment(expiredTime).format('YYYY-MM-DD'), times: parseInt(changeCount), description: changeDesc }))
                        }}>确定充值</Button>
                </Stack>
            </Box>
        </Modal>
    )



    
    const createModal = (
        <Modal
            open={create !== 0}
            onClose={() => { setCreate(0) }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style} >
                <Stack
                    direction="column"
                    justifyContent="space-around"
                    alignItems="center"
                    spacing={1}>
                    <TextField
                        id="outlined-password-input"
                        label="名字"
                        value={createUser.name}
                        onChange={(e) => {
                            setCreateUser({...createUser,name:e.target.value});
                        }}
                    />
                    <TextField
                        id="outlined-password-input2"
                        label="电话"
                        value={createUser.number}
                        onChange={(e) => {
                            setCreateUser({...createUser,number:e.target.value});
                        }}
                    />
                   
                    <Button variant="contained" size="small"
                        onClick={() => {
                            dispatch( createUserAccount(createUser.name,createUser.number))
                            console.log('------确定添加---',createUser)
                        }}>确定添加</Button>

                </Stack>
            </Box>
        </Modal>
    )



    const courseItem = (course, index) => {


        return (<Paper key={`course-item-${index}`} elevation={1} sx={{
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
                    {course.openId}
                </Typography>
                <Typography gutterBottom variant="body2"
                    sx={{
                        color: 'rgba(0, 0, 0, 0.6)',
                        minWidth: '80px',
                    }} >
                    {course.time}
                </Typography>
                <Typography gutterBottom variant="body2"
                    sx={{
                        color: 'rgba(0, 0, 0, 0.6)',
                        minWidth: '80px',
                    }} >
                    {course.description}
                </Typography>
                {typeof course.amount !== 'undefined' && (<Typography gutterBottom variant="body2"
                    sx={{
                        color: 'rgba(0, 0, 0, 0.6)',
                        minWidth: '80px',
                    }} >
                    充值{course.amount}元，次数{course.times}
                </Typography>)}
                {typeof course.annualTimes !== 'undefined' && (<Typography gutterBottom variant="body2"
                    sx={{
                        color: 'rgba(0, 0, 0, 0.6)',
                        minWidth: '80px',
                    }} >
                    充值年卡，次数{course.annualTimes}，到期时间{course.expiredTime}
                </Typography>)}

                {typeof course.course === 'undefined'&&(<Button  color="primary"
                    sx={{
                        color: 'rgba(0, 0, 0, 0.6)',
                        minWidth: '80px',
                    }}
                    onClick={()=>{
                        console.log(course,customerName)
                        dispatch(retreatRecentCourse({cardId:customerName,time:course.time}))
                    }}
                     >

                   删除
                </Button>)}
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
                    <CircleButton
                            
                            size="small"
                            variant={1 === 1 ? "contained" : "outlined"}
                            sx={{ margin: '5px' }}
                            onClick={
                                (e) => {
                                    setCreate(1)
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
                          添加会员
                        </CircleButton>

                {!detailMode && sortValue.map((a, ids) => {
                    return (
                        <CircleButton
                            key={ids}
                            value={a}
                            size="small"
                            variant={1 === 1 ? "contained" : "outlined"}
                            sx={{ margin: '5px' }}
                            onClick={
                                (e) => {
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
                })}
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
                    {detailMode ? <ArrowBackIcon /> : <CachedIcon />}
                </IconButton>
            </Stack>
            {!detailMode && (<Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={4}
                sx={{ height: '10%', width: '100%' }}>
                {userSort && userSort.map((file, index) => fileItem(file, index))}
            </Grid>)}

            {detailMode && finacialItem}
            {detailMode && courseList && courseList.map((c, i) => courseItem(c, i))}

            <Typography gutterBottom variant="body2">&nbsp;</Typography>
            {uploadWaitingModal}
            {createModal}
     
        </Stack>
    );
}
export default SearchTask