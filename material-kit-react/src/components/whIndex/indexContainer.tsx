/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-04-11 15:37:12
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-27 10:16:00
 * @content: edit your page content
 */
import React from 'react';
import DsFolderTree from '../fileExplore/dsFolderTree'
import DataFolderExplore from '../fileExplore/folderExploreComponent'
import FsResourceManagement from '../createDs/fsResourseManagement'
import { useSelector } from "../../redux/hooks";
import { Button, Card, Box,CardHeader, Checkbox, Divider, Grid, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import IdsFileTree from '../fileExplore/idsFileTree'
import SearchTask from '../searchComponent/searchTask'
function IndexContainer(props) {
    const index = props.index
  
    const [checked, setChecked] = React.useState<readonly number[]>([]);
    const [left, setLeft] = React.useState<readonly number[]>([0, 1, 2, 3]);
    const [right, setRight] = React.useState<readonly number[]>([4, 5, 6, 7]);
  

  
    return (
      <Box   justifyContent="space-around" alignItems="center" sx={{width:'96vw',height:'97%',padding:'20px 0 0 10px'}}>
     {index===0?<FsResourceManagement />:<SearchTask />}
      </Box>
    );
  }
  export default IndexContainer