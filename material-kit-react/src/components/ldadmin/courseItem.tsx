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
import UserManagement from './userManagement'
import Additions from '../fileExplore/additions'
import { useSelector } from "../../redux/hooks";
import { useNavigate } from 'react-router-dom';
import { exploreUsersAction, exploreRecentCourse, selectCourse } from '../../store/slices/dominationSlice'
import { tagsInfoAction, scenceInfoAction } from '../../store/slices/tagsSlice'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CachedIcon from '@mui/icons-material/Cached';
import {
  rootProjects, selectedFolderContent
  , toggleFolderTreeExpand, copyIDSFilesToDataSet, pathConfig, searchActiveAction, searchDeActiveAction, selectedByParams, labelsStatisticAction
} from '../../store/actions/filesAndFoldersActions';
import { find } from 'lodash';

function CourseItem(props) {
  let spend = props.item
  let item = props.item.course
  let edit = props.edit
  let deletedFunc = props.deletedFunc
  let partialDelete = props.partialDelete

  return (
    <Paper key={`item-course-${item.id}`} elevation={1} sx={{
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
              {item.court.name}
            </Typography>
            <Typography gutterBottom variant="body2"
              sx={{
                color: 'rgba(0, 0, 0, 0.6)',

              }} >
              {item.description}
            </Typography>
           {spend.charge>0&& (<Typography gutterBottom variant="body2"
              sx={{
                color: 'rgba(0, 0, 0, 0.6)',

              }} >
              消费{spend.charge}元
            </Typography>)}
            {spend.times>0 && (<Typography gutterBottom variant="body2"
              sx={{
                color: 'rgba(0, 0, 0, 0.6)',

              }} >
              消费{spend.times}次
            </Typography>)}
            {spend.annualTimes>0 && (<Typography gutterBottom variant="body2"
              sx={{
                color: 'rgba(0, 0, 0, 0.6)',

              }} >
              消费年卡{spend.annualTimes}次
            </Typography>)}
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
              {item.duration}小时  ,{item.courseType===0?'订场':item.courseType===1?'班课':'私教'}
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
              {item.coach.name}
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
                <Button variant="outlined" size="small" key={`${m}a5-${m.number}`}
                  onClick={() => {
                    // dispatch(selectCourse(item))
                    partialDelete(item, m)
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
          {/* <Button variant="outlined" size="small" onClick={() => {

            edit(item)

          }}>编辑</Button> */}
          {/* <Button variant="outlined" size="small"
            onClick={() => {
              // dispatch(selectCourse(item))

              deletedFunc(item)

            }}
          >删除</Button> */}
        </Stack>
      </Stack>
    </Paper>)


}
export default CourseItem