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
import { Button, Card, Stack, NoSsr, Paper, Box, Typography, AvatarGroup, Avatar, Checkbox, Divider, Grid, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import IdsFileTree from '../fileExplore/idsFileTree'
import { makeStyles, createStyles } from '@mui/styles';
import FolderIcon from '@mui/icons-material/Folder';
import { styled } from '@mui/material/styles';
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
    const [detailMode, setDetailMode] = React.useState(false);
    const [userSort, setUserSort] = React.useState(false);

    useEffect(() => {

        if (users) {
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

        if (prepaidCard) {
            setDetailMode(true)
            console.log("🚀 ~ file: searchTask.tsx ~ line 71 ~ SearchTask ~ prepaidCard", prepaidCard)
        }
    }, [prepaidCard])

    useEffect(() => {

        if (recentPrepayedCard) {
            let card = recentPrepayedCard.filter(card => typeof card.balance !== 'undefined')[0]
            setDetailMode(true)
            setPrepaidCard(card)
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
        </Stack>)


    const fileItem = (user, index) => {
        return (<Grid item xs={1} key={index} space={1}>
            <Paper elevation={1} sx={{ background: 'transparent', '& :hover': { background: 'rgb(0,0,0,0.1)' } }}>

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
                            dispatch(exploreRecentCard(user.prepaidCard))
                        }
                    }}>
                    <Avatar alt="Remy Sharp" src={user.avator} />


                    <Typography gutterBottom variant="body2"
                        sx={{
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



    return (
        <Stack justifyContent="flex-start"
            alignItems="flex-start"
            sx={{ marginLeft: 2, overflowY: 'auto', height: '100%', paddingBottom: -2 }}
        >
            <Stack justifyContent="flex-start"
                alignItems="center"
                spacing={2}
                direction="row"
            >
                {sortValue.map((a, ids) => {
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
                        setDetailMode(!detailMode)


                    }}
                >
                    <CachedIcon />
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
            <Typography gutterBottom variant="body2">&nbsp;</Typography>
        </Stack>
    );
}
export default SearchTask