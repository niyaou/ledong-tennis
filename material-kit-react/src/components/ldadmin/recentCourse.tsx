/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-17 11:19:45
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-05-11 16:02:13
 * @content: edit your page content
 */
import {
  Paper, Typography, Backdrop, CircularProgress, Button, Card, Grow, CardHeader, Checkbox,
  Divider, Grid, Stack, List, ListItem, ListItemIcon, ListItemText, Box, IconButton, TextField
} from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useSelector } from "../../redux/hooks";
import { useNavigate } from 'react-router-dom';
import { exploreUsersAction, exploreRecentCourse, selectCourse, deleteCourese, retreatCourseMember, notifyCourse, updateCourese } from '../../store/slices/dominationSlice'

import CachedIcon from '@mui/icons-material/Cached';

import moment from 'moment';
import { findIndex, find } from 'lodash';
function not(a: readonly number[], b: readonly number[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly number[], b: readonly number[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: readonly number[], b: readonly number[]) {
  return [...a, ...not(b, a)];
}

function RecentCourse(props) {
  const datasetId = props.datasetId
  const index = props.index
  const { users, course, selectCourse: selectCourseItem, loadError } = useSelector((state) => state.domination)
  const [checked, setChecked] = React.useState<readonly number[]>([]);
  const [left, setLeft] = React.useState<readonly number[]>([0, 1, 2, 3]);
  const [right, setRight] = React.useState<readonly number[]>([4, 5, 6, 7]);
  const dispatch = useDispatch()
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);
  let navigate = useNavigate();
  const findName = (id) => {
    let item = find(users, { 'id': id }) || {}
    return item.prepaidCard || id
  }
  const findCoach = (id) => {
    let item = find(users, { 'id': id }) || {}
    return item.realName || id
  }

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };


  const numberOfChecked = (items: readonly number[]) =>
    intersection(checked, items).length;



  useEffect(() => {
    dispatch(exploreRecentCourse({
      pageNum: 1, startTime: moment().subtract(45, 'days').startOf('month').format('YYYY-MM-DD hh:mm:ss'),
      endTime: moment().endOf('month').format('YYYY-MM-DD hh:mm:ss')
    }))

  }, [])

  // useEffect(() => {
  //   if (loadError) {
  //     navigate('/login')
  //   }
  // }, [loadError])


  const courseItem = (item, index) => {
    let quantities = 0
    for(var i of item.spend){
      quantities+=  i.quantities
    }
    return (
      <Paper key={`item-course-${item.id}`} elevation={1} sx={{
        minWidth: '850px',
        background: selectCourseItem && selectCourseItem.coach.number === item.coach.number && selectCourseItem.startTime === item.startTime ? 'rgb(0,0,0,0.05)' : 'transparent',
        '& :hover': { background: 'rgb(0,0,0,0.1)' }
      }}>
        <Stack

          spacing={2}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ padding: 1, background: 'transparent', '& :hover': { background: 'transparent' } }}
        >
          <Stack

            spacing={2}
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            sx={{ background: 'transparent', '& :hover': { background: 'transparent' } }}
          >

            <Stack

              spacing={2}
              direction="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              sx={{ background: 'transparent', '& :hover': { background: 'transparent' } }}
            >
              <Typography gutterBottom variant="body2"
                sx={{
                  color: 'rgba(0, 0, 0, 0.6)',
                  minWidth: '80px',
                }} >
                {item.court?.name}
              </Typography>
              <Typography gutterBottom variant="body2"
                sx={{
                  color: 'rgba(0, 0, 0, 0.6)',

                }} >
            人数 {quantities},   {item.description} 
              </Typography>
            </Stack>


            <Stack

              spacing={2}
              direction="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              sx={{
              }}
            >
              <Typography gutterBottom variant="body2"
                sx={{
                  color: 'rgba(0, 0, 0, 0.6)',
                  minWidth: '180px',
                }} >
                {item.startTime}
              </Typography>
              <Typography gutterBottom variant="body2"
                sx={{
                  color: 'rgba(0, 0, 0, 0.6)',
                  minWidth: '180px',
                }} >
                {item.duration}小时  ,{item.courseType === -2 ? '体验课未成单' : item.courseType === -1 ? '体验课成单' : item.courseType === 0 ? '订场' : item.courseType === 1 ? '班课' : '私教'}
              </Typography>
              <Typography gutterBottom variant="body2"
                sx={{
                  color: 'rgba(0, 0, 0, 0.6)',
                  minWidth: '180px',
                }} >
                {item.endTime}
              </Typography>
            </Stack>

            <Stack

              spacing={2}
              direction="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              sx={{

              }}
            >
              <Typography gutterBottom variant="body2"
                sx={{
                  color: 'rgba(0, 0, 0, 0.6)',
                }} >
                {item.coach?.name}
              </Typography>
              <Stack

                spacing={2}
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                sx={{

                }}
              >
                {item.member.map((m, idx) => (
                    <Button variant="contained" size="small"
                      disabled={item.notified > 0}
                      key={`${m}a5-${m.number}`}
                      onClick={() => {
                        dispatch(retreatCourseMember({ courseId: item.id, number: m.number }))
                      }}>   {m.name}</Button>
                  // <Typography gutterBottom variant="body2"
                   
                  //   sx={{
                  //     color: 'rgba(0, 0, 0, 0.6)',
                  //   }} >

                  // </Typography>
                ))}
              </Stack>
            </Stack>
          </Stack>
          <Stack

            spacing={2}
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            sx={{

            }}
          >
            {item.courseType >= 0 && (<Button variant="contained" size="small"
              disabled={item.notified > 0}
              onClick={() => {
                dispatch(notifyCourse(item.id))
              }}>短信通知</Button>)}
            {item.courseType === -2 && (<Button variant="contained" size="small" onClick={() => {
              dispatch(updateCourese(item.id))
            }}>体验课成单</Button>)}
            <Button variant="contained" color="warning" size="small"
              onClick={() => {
                dispatch(deleteCourese(item.id))
              }}
            >删除</Button>
          </Stack>
        </Stack>
      </Paper>)
  }
  return (
    <Box sx={{ height: '100%', width: '100%' }}>

      <Stack
        spacing={2}
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <IconButton
          aria-label="expand row"
          size="small"
          onClick={async () => {
            // if(detailMode){
            //     setDetailMode(!detailMode)
            //     setCustomerName('')
            // }
            dispatch(exploreRecentCourse({
              pageNum: 1, startTime: moment().subtract(45, 'days').startOf('month').format('YYYY-MM-DD hh:mm:ss'),
              endTime: moment().endOf('month').format('YYYY-MM-DD hh:mm:ss')
            }))

          }}
        >
          <CachedIcon />
        </IconButton>

        {course && course.map((c, i) => courseItem(c, i))}
        {/* <Grid item><DsFolderTree  datasetId={datasetId} editType={true} /></Grid> */}
      </Stack>
    </Box>
  );
}
export default RecentCourse