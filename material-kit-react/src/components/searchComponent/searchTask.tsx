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
import { Button, Card, Stack, NoSsr, Paper, Box, Typography, AvatarGroup,TextField, Avatar,FormControl, Checkbox, Divider, Grid, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import IdsFileTree from '../fileExplore/idsFileTree'
import { makeStyles, createStyles } from '@mui/styles';
import FolderIcon from '@mui/icons-material/Folder';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import FolderIconUrl from '../../assert/folderIcon.png'
import CircularProgress, {
    circularProgressClasses,
    CircularProgressProps,
} from '@mui/material/CircularProgress';
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
import { exploreUsersAction, exploreRecentCourse, selectCourse as selectCourseAction, exploreRecentCard } from '../../store/slices/dominationSlice'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
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
    const { taskQueue, deleteTaskSuccess, cacheTree, createFolderSuccess, errorMsg, folderAsyncStatus, currentSelectFolderTree } = useSelector((state) => state.inSensitive)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { areas, users, sortValue, recentPrepayedCard } = useSelector((state) => state.domination)
    const [prepaidCard, setPrepaidCard] = React.useState({ balance: 0, balanceTimes: 0, expiredTime: null });
    const [courseList, setCourseList] = React.useState([]);
    const [detailMode, setDetailMode] = React.useState(false);
    const [userSort, setUserSort] = React.useState(false);
    const [customerName, setCustomerName] = React.useState('');
    const [expiredTime, setExpiredTime] = React.useState(prepaidCard.expiredTime||'');

    useEffect(() => {

        if (users) {
            setDetailMode(false)
            let sorts = users.concat()
            sorts.sort((a, b) => {
                return pinyin.pinyinUtil.getFirstLetter((a.realName || a.nickName).substring(0, 1)).toUpperCase() > pinyin.pinyinUtil.getFirstLetter((b.realName || b.nickName).substring(0, 1)).toUpperCase() ? 1 : -1
            })
            setUserSort(sorts)
        }
        else {
            setUserSort([])
        }
    }, [users])

    useEffect(() => {

        if (prepaidCard&& customerName ) {
            setDetailMode(true)
            console.log("🚀 ~ file: searchTask.tsx ~ line 71 ~ SearchTask ~ prepaidCard", prepaidCard)
        }
    }, [prepaidCard])

    useEffect(() => {

        if (recentPrepayedCard) {
            let card = recentPrepayedCard.filter(card => typeof card.balance !== 'undefined')[0]
            // let courselist = recentPrepayedCard.filter(card => typeof card.description !== 'undefined')
            let courselist = recentPrepayedCard.filter(card => typeof card.balance === 'undefined')
            // setDetailMode(true)
            setPrepaidCard(card)
            setCourseList(courselist)
            console.log("🚀 ~ file: searchTask.tsx ~ line 733 ~ SearchTask ~ prepaidCard", card, courselist)
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
                    color: 'rgba(0, 0, 0, 0.6)',

                }} >
                充值卡余额：{prepaidCard.balance}
            </Typography>
            <Typography gutterBottom variant="body2"
                sx={{
                    color: 'rgba(0, 0, 0, 0.6)',
                }} >
                次卡余额：  {prepaidCard.balanceTimes}
            </Typography>
            <Typography gutterBottom variant="body2"
                sx={{
                    color: 'rgba(0, 0, 0, 0.6)',
                }} >
                年卡到期时间  {prepaidCard.expiredTime}
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormControl sx={{ m: 1, minWidth: 120, }} size="small">
        <DatePicker
          label="年卡到期时间"
          value={expiredTime}
          onChange={(newValue) => {
            console.log("🚀 ~ file: additions.tsx ~ line 665 ~ Additions ~ newValue", newValue)
            // let after = { ...courseEdit, startTime: newValue }
            // setStartTime(newValue)
            // let diff = moment(after.endTime, 'YYYY-MM-DD HH:mm').diff(moment(after.startTime, 'YYYY-MM-DD HH:mm'), 'minutes')
            // after = { ...courseEdit, spendingTime: diff }
            // console.log("🚀 ~ file: additions.tsx ~ line 665 ~ Additions ~ diff", diff)
            setExpiredTime(newValue)
          }}
          renderInput={(params) => {
            return (<TextField {...params} />)
          }}
        />
      </FormControl>
    </LocalizationProvider>
            <Button variant="contained" size="small"  onClick={() => {
             
            }}>修改时间</Button>
          
        </Stack>)


    const fileItem = (user, index) => {
        return (<Grid item xs={1} key={index} space={1}>
            <Paper elevation={1} sx={{ background: user.prepaidCard?'transparent':'rgba(0,0,0,0.1)', '& :hover': { background: 'rgb(0,0,0,0.1)' } }}>

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
                            dispatch(exploreRecentCard(user.prepaidCard))
                        }
                    }}>
                    <Avatar alt="Remy Sharp" src={user.avator} />


                    <Typography gutterBottom variant="body2"
                        sx={{
                            background:'transparent',
                            '& :hover': { background: 'transparent' },
                            color: 'rgba(0, 0, 0, 0.6)',
                            whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '90%', textAlign: 'center'
                        }} >
                        {user.realName || user.nickName}
                    </Typography>

                </Stack>


            </Paper>
        </Grid>
        )
    }

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
                { typeof course.amount!=='undefined'&& (<Typography gutterBottom variant="body2"
                    sx={{
                        color: 'rgba(0, 0, 0, 0.6)',
                        minWidth: '80px',
                    }} >
                    充值{course.amount}
                </Typography>)}
                
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
                        if(detailMode){
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
            {detailMode && courseList&& courseList.map((c,i)=> courseItem(c,i)           )}

            <Typography gutterBottom variant="body2">&nbsp;</Typography>
        </Stack>
    );
}
export default SearchTask