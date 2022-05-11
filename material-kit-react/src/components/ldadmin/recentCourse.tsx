/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-17 11:19:45
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-05-11 09:55:59
 * @content: edit your page content
 */
import {
  Paper, Typography, Backdrop, CircularProgress, Button, Card, Grow, CardHeader, Checkbox,
  Divider, Grid, Stack, List, ListItem, ListItemIcon, ListItemText, Box
} from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import UserManagement from './userManagement'
import Additions from '../fileExplore/additions'
import { useSelector } from "../../redux/hooks";
import { exploreUsersAction, exploreRecentCourse } from '../../store/slices/dominationSlice'
import { tagsInfoAction, scenceInfoAction } from '../../store/slices/tagsSlice'
import {
  rootProjects, selectedFolderContent
  , toggleFolderTreeExpand, copyIDSFilesToDataSet, pathConfig, searchActiveAction, searchDeActiveAction, selectedByParams, labelsStatisticAction
} from '../../store/actions/filesAndFoldersActions';
import { find } from 'lodash';
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
  const { users, course } = useSelector((state) => state.domination)
  const [checked, setChecked] = React.useState<readonly number[]>([]);
  const [left, setLeft] = React.useState<readonly number[]>([0, 1, 2, 3]);
  const [right, setRight] = React.useState<readonly number[]>([4, 5, 6, 7]);
  const dispatch = useDispatch()
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const findName=(id)=>{
    let item = find(users, { 'id': id })||{}
    return item.prepaidCard||id
  }
  const findCoach=(id)=>{
    let item = find(users, { 'id': id })||{}
    return item.realName||id
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
    dispatch(exploreRecentCourse({ page: 0, num: 50 }))
  }, [])


  const courseItem = (item, index) => {
    return (
      <Paper  key={`item-${index}`} elevation={1} sx={{minWidth:'850px', background: 'transparent', '& :hover': { background: 'rgb(0,0,0,0.1)' } }}>
        <Stack
          
          spacing={2}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ padding:1,background: 'transparent', '& :hover': { background: 'transparent' }}}
        >
             <Stack
           
           spacing={2}
           direction="row"
           justifyContent="flex-start"
           alignItems="flex-start"
           sx={{ background: 'transparent', '& :hover': { background: 'transparent' }}}
         >
       
          <Stack
           
            spacing={2}
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            sx={{ background: 'transparent', '& :hover': { background: 'transparent' }}}
          >
            <Typography gutterBottom variant="body2"
              sx={{
                color: 'rgba(0, 0, 0, 0.6)',
                minWidth: '80px',
              }} >
              {item.court}
            </Typography>
            <Typography gutterBottom variant="body2"
              sx={{
                color: 'rgba(0, 0, 0, 0.6)',

              }} >
              {item.descript}
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
              {item.start}
            </Typography>
            <Typography gutterBottom variant="body2"
              sx={{
                color: 'rgba(0, 0, 0, 0.6)',
                minWidth: '180px',
              }} >
              {item.spendingTime}
            </Typography>
            <Typography gutterBottom variant="body2"
              sx={{
                color: 'rgba(0, 0, 0, 0.6)',
                minWidth: '180px',
              }} >
              {item.end}
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
              {findCoach(item.coach)}
            </Typography>
            <Stack
           
            spacing={2}
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            sx={{

            }}
          >
            {item.member.map((m,idx) =>(
                <Typography gutterBottom variant="body2"
                key={`${m}a5-${index}`}
                sx={{
                  color: 'rgba(0, 0, 0, 0.6)',
                }} >
                {findName(m)}
              </Typography>
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
          <Button variant="outlined" size="small">修改</Button>
          <Button variant="outlined" size="small">删除</Button>
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
        {course && course.map((c, i) => courseItem(c, i))}
        {/* <Grid item><DsFolderTree  datasetId={datasetId} editType={true} /></Grid> */}
      </Stack>
    </Box>
  );
}
export default RecentCourse