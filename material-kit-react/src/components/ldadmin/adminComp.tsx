/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-17 11:19:45
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-05-10 15:48:44
 * @content: edit your page content
 */
import { Backdrop,CircularProgress,Button, Card,Grow, CardHeader, Checkbox, Divider, Grid, Stack, List, ListItem, ListItemIcon, ListItemText ,Box} from '@mui/material';
import React,{useEffect} from 'react';
import { useDispatch } from 'react-redux';
import UserManagement from './userManagement'
import Additions from '../fileExplore/additions'
import { useSelector } from "../../redux/hooks";
import { tagsInfoAction ,scenceInfoAction} from '../../store/slices/tagsSlice'
import { rootProjects, selectedFolderContent
  ,toggleFolderTreeExpand, copyIDSFilesToDataSet, pathConfig,
   searchActiveAction, searchDeActiveAction,selectedByParams,labelsStatisticAction } from '../../store/actions/filesAndFoldersActions';
   import { exploreUsersAction ,exploreCoachAction,exploreCourtAction} from '../../store/slices/dominationSlice'
function not(a: readonly number[], b: readonly number[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly number[], b: readonly number[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: readonly number[], b: readonly number[]) {
  return [...a, ...not(b, a)];
}

function AdminComp(props) {
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


useEffect(() => {
        dispatch(exploreUsersAction())
        dispatch(exploreCoachAction())
        dispatch(exploreCourtAction())
  // dispatch(tagsInfoAction())
  // dispatch(scenceInfoAction())
  // dispatch(labelsStatisticAction())
},[])


  const numberOfChecked = (items: readonly number[]) =>
    intersection(checked, items).length;




  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={false}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Stack
        spacing={5}
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        sx={{ height: '100%', width: '100%' }}>
        
        <UserManagement />
      
        <Additions 
        sx={{marginRight:30,}}/>
        {/* <Grid item><DsFolderTree  datasetId={datasetId} editType={true} /></Grid> */}
      </Stack>
    </Box>
  );
}
export default AdminComp