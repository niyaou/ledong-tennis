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
    selectedAndMoveTaskAction,deleteSelectedAndMoveTaskAction
} from '../../store/actions/inSensitiveActions';
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

    const [checked, setChecked] = React.useState<readonly number[]>([]);
    const [left, setLeft] = React.useState<readonly number[]>([0, 1, 2, 3]);
    const [right, setRight] = React.useState<readonly number[]>([4, 5, 6, 7]);
    const { taskQueue, deleteTaskSuccess,cacheTree, createFolderSuccess, errorMsg, folderAsyncStatus, currentSelectFolderTree } = useSelector((state) => state.inSensitive)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [tasks, setTasks] = React.useState([{
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    },
    {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    },
    {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    },
    {
        id: 1, target: '/pangoo/ids/tast/123', status: '排队', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '排队', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '排队', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    },
    {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    },
    {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '排队', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    },
    {
        id: 1, target: '/pangoo/ids/tast/123', status: '排队', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    },
    {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '排队', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    },
    {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '排队', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '排队', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }, {
        id: 1, target: '/pangoo/ids/tast/123', status: '进行中', processing: 42, total: 100,
        percent: 43, params: { name: '124', attr: ['123', 'gfd'] }, path: ['/pangoo/ids/task/1.a', '/pangoo/ids/task/2.a', '/pangoo/ids/task/3.a', '/pangoo/ids/task/4.a']
    }]);

    useEffect(() => {
        dispatch(selectedAndMoveTaskAction())

    }, [])

    useEffect(() => {
        if(deleteTaskSuccess){
            dispatch(selectedAndMoveTaskAction())
            enqueueSnackbar('删除成功', {
                variant: 'success',
                autoHideDuration: 3000,
              })
        }
  

    }, [deleteTaskSuccess])



    const taskCard = (taskInfo, index) => {
        return (<Grid item xs={2} key={index}

            sx={{ height: 150, marginTop: 4 }}>
            <Paper elevation={1} >
                <Stack
                    spacing={2}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ height: 160 }}
                >
                    <img src={FolderIconUrl} />
                    <Stack
                        spacing={1}
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="flex-start">
                        <Tooltip title={taskInfo.filePath} placement="top">
                            <Typography gutterBottom variant="subtitle2"
                                sx={{
                                    color: 'rgb(0,0,0,0.8)',
                                    maxWidth: 150,
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                }}
                                color="inherit"
                            >
                                {taskInfo.filePath}
                            </Typography>
                        </Tooltip>

                        <Typography gutterBottom variant="subtitle2"
                            sx={{ color: 'rgb(0,0,0,0.9)' }}
                            color="inherit"
                        >
                            {taskInfo.destFilePath ? '通过文件列表添加' : '通过搜索条件添加'}
                        </Typography>
                        <Typography gutterBottom variant="subtitle2"
                            sx={{ color: 'rgb(0,0,0,0.9)' }}
                            color="inherit"
                        >
                            {taskInfo.processMsg} &nbsp; {`${taskInfo.total - taskInfo.queueList}/${taskInfo.total}`}
                        </Typography>
                        {(parseInt(taskInfo.processCode) === 0 || taskInfo.queueList === taskInfo.total) && (<Button variant="outlined" size="small"
                            onClick={() => {
                                dispatch(deleteSelectedAndMoveTaskAction(taskInfo.taskId))
                             }}
                        >
                            删除
                        </Button>)}
                        {parseInt(taskInfo.processCode) === 1 && taskInfo.total !== taskInfo.queueList&&
                            (<BorderLinearProgress variant="determinate" value={(taskInfo.total - taskInfo.queueList) * 100 / taskInfo.total} sx={{ width: 150 }} />)}

                    </Stack>
                </Stack>
            </Paper></Grid>)
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
                <Typography gutterBottom variant="body2"
                    sx={{ color: 'rgb(0,0,0,0.6)' }}
                    color="inherit"
                    onClick={() => {
                    }}
                >
                    搜索结果添加任务
                </Typography>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={async () => {
                        dispatch(selectedAndMoveTaskAction())


                    }}
                >
                    <CachedIcon />
                </IconButton>
            </Stack>

            <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={4}
                sx={{ height: '10%', width: '100%' }}>
                {taskQueue.map((taskInfo, index) => taskCard(taskInfo, index))}
            </Grid>
            <Typography gutterBottom variant="body2">&nbsp;</Typography>
        </Stack>
    );
}
export default SearchTask