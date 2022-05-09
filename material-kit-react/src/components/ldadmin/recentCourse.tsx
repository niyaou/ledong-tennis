/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-17 11:19:45
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-05-09 15:38:45
 * @content: edit your page content
 */
import { Backdrop,CircularProgress,Button, Card,Grow, CardHeader, Checkbox, Divider, Grid, Stack, List, ListItem, ListItemIcon, ListItemText ,Box} from '@mui/material';
import React,{useEffect} from 'react';
import { useDispatch } from 'react-redux';
import UserManagement from './userManagement'
import Additions from '../fileExplore/additions'
import { useSelector } from "../../redux/hooks";
import { exploreUsersAction ,exploreRecentCourse} from '../../store/slices/dominationSlice'
import { tagsInfoAction ,scenceInfoAction} from '../../store/slices/tagsSlice'
import { rootProjects, selectedFolderContent
  ,toggleFolderTreeExpand, copyIDSFilesToDataSet, pathConfig, searchActiveAction, searchDeActiveAction,selectedByParams,labelsStatisticAction } from '../../store/actions/filesAndFoldersActions';

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
  const { loading ,searchActive,mergeActive} = useSelector((state) => state.filesAndFolders)
  const [checked, setChecked] = React.useState<readonly number[]>([]);
  const [left, setLeft] = React.useState<readonly number[]>([0, 1, 2, 3]);
  const [right, setRight] = React.useState<readonly number[]>([4, 5, 6, 7]);
  const dispatch =useDispatch()
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

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
        dispatch(exploreRecentCourse({page:0,num:50}))
    }, [])
  

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
    
      <Stack
        spacing={2}
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        sx={{ height: '100%', width: '100%' }}>
        
     123
        {/* <Grid item><DsFolderTree  datasetId={datasetId} editType={true} /></Grid> */}
      </Stack>
    </Box>
  );
}
export default RecentCourse