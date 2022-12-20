/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-17 11:19:45
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-05-10 16:14:10
 * @content: edit your page content
 */

import CachedIcon from '@mui/icons-material/Cached';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { TreeItemProps } from '@mui/lab/TreeItem';
import { Box, Checkbox, Grid, Paper, Stack, Typography, Button, Avatar ,Divider} from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemText, { listItemTextClasses, ListItemTextProps } from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import { SvgIconProps } from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AudioIconUrl from '../../assert/audioIcon.png';
import FolderIconUrl from '../../assert/folderIcon.png';
import ForwardUrl from '../../assert/forward.png';
import ImageIconUrl from '../../assert/imageIcon.png';
import TextIconUrl from '../../assert/textIcon.png';
import TextGreenIconUrl from '../../assert/textIconGreen.png';
import VideoIconUrl from '../../assert/videoIcon.png';
import ZipIconUrl from '../../assert/zipIcon.png';
import useStyles from '../../common/styles';
import { useSelector } from "../../redux/hooks";
import {
  fileSelectedViews, folderContentStatistic, labelsStatisticAction, nodeSelected, selectedByParams,
  pathConfig, rootProjects, selectedFolderContent, selectedAndMoveByParams, exploreModeAction, updateSelectedParams,
} from '../../store/actions/filesAndFoldersActions';
import RecentCourse from './recentCourse'
type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  color?: string;
  labelIcon: React.ElementType<SvgIconProps>;
  labelInfo?: string;
  labelText: string;
  level: number;
  initialed: boolean;
};

const FireNav = styled(List)<{ component?: React.ElementType }>({
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 2,
  },
  '& .MuiListItemText-primary': {
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
});



export const ExpandListText = styled(({ classes, ...props }: ListItemTextProps) => (<ListItemText {...props} classes={classes} />))(({ theme }) => ({
  [`& .${listItemTextClasses.primary}`]: {
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
}))



function UserManagement(props) {
  const CircleButton = styled(Button)({ borderRadius: '20px', })
  const {areas, users,court } = useSelector((state) => state.domination)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(true);
  const [treeSets, setTreeSets] = React.useState({ path: '', raw: '' });
  let eventPup = false
  // const setEventPup]
  // const [exploreMode, setExploreMode] = React.useState(false)
  const user = useSelector((state) => state.users)
  const classes = useStyles();
  const dispatch = useDispatch()
  const { files, folders, rootPath, restNodes, currentIndex, searchActive, mergeActive, fileStatistic, searchParams, exploreMode } = useSelector((state) => state.filesAndFolders)
  const { cacheTree, createFolderSuccess, errorMsg, folderAsyncStatus, currentSelectFolderTree } = useSelector((state) => state.inSensitive)
  const [element, setElement] = React.useState([])
  const [pageParams, setPageParams] = React.useState({ num: 1, size: 50 })

  const [selectedNode, setSelectedNode] = React.useState(null)


  useEffect(() => {
    let ele = folders.concat(files)
    setElement(ele)
    setFileIndex(-1)
    setFileIndexChecked(-1)
    setSelectedNode(null)
  }, [folders, files])

  // useEffect(() => {
  //   if (folders.length === 0) {
  //     dispatch(pathConfig())
  //   }
  // }, [])


  useEffect(() => {
    // if(treeSets.raw){
    //   if(Object.keys(searchParams).length===0){
    //     dispatch(selectedByParams({...searchParams,filePath:treeSets.raw,  pageNo: 1, pageSize: 50, queryType: 0},pageParams.size))
    //   }else{
    dispatch(updateSelectedParams({ ...searchParams, filePath: treeSets.raw }))
    //   }
    // }
    console.log("🚀 ~ file: idsFileTree.tsx ~ line 124 ~ IdsFileTree ~ treeSets", treeSets, searchParams)
  }, [treeSets])

  useEffect(() => {
    if (rootPath) {
      dispatch(rootProjects(rootPath.rootPath))
      dispatch(folderContentStatistic(rootPath.rootPath))
    }
  }, [rootPath])

  useEffect(() => {
    dispatch(nodeSelected(selectedNode))
  }, [selectedNode])


  useEffect(() => {
    if (!searchActive && rootPath) {
      console.log("🚀 ~ file: idsFileTree.tsx ~ line 127 ~ useEffect ~ pageParams", pageParams)
      dispatch(selectedFolderContent(treeSets.raw || rootPath.rootPath, currentIndex, pageParams.size))
      dispatch(folderContentStatistic(treeSets.raw || rootPath.rootPath))
    }
  }, [searchActive])


  useEffect(() => {
    if (!exploreMode) {
      setFileIndexChecked(-1)
      setSelectedNode(null)
    }
  }, [exploreMode])





  const setTreePath = (filePath) => {
    let path = filePath.replace(rootPath.rootPath, '')
    path = path.split('/')
    if (path[0] === '') {
      path.shift()
    }
    let node = { path, raw: filePath }
    setTreeSets(node)
  }

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, folder) => {
    setTreePath(folder.filePath)
    dispatch(selectedFolderContent(folder.filePath, pageParams.num, pageParams.size))
    dispatch(folderContentStatistic(folder.filePath))

  };
  const arr = []




  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  const [fileIndex, setFileIndex] = React.useState(-1)
  const [fileIndexChecked, setFileIndexChecked] = React.useState(-1)


  const fileNav = (navType) => {
    return (<Grid item xs={1} key={`${navType}-1`}>
      <Paper elevation={0} sx={{ background: 'transparent', '& :hover': { background: 'rgb(0,0,0,0.1)' } }}>

        <Stack
          direction="column"
          justifyContent="center"
          alignItems=""
          spacing={0}
          sx={{ cursor: 'pointer', '& :hover': { background: 'transparent' } }}

          onClick={(event) => {

          }}>
          <Box sx={{ height: '38px', width: '100%' }}></Box>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={0}
            sx={{ cursor: 'pointer', '& :hover': { background: 'transparent' } }}
            onClick={(event) => {
              if (navType === -1) {
                //上一页
                if (searchActive) {
                  dispatch(selectedByParams({ ...searchParams, queryType: -1, pageNo: currentIndex - 1, sortValues: element[0] }, pageParams.size))
                } else {
                  dispatch(selectedFolderContent(treeSets.raw, currentIndex - 1, pageParams.size))
                }
              } else {
                // 下一页
                if (searchActive) {
                  dispatch(selectedByParams({ ...searchParams, queryType: 1, pageNo: currentIndex + 1, sortValues: element[element.length - 1] }, pageParams.size))
                } else {
                  dispatch(selectedFolderContent(treeSets.raw, currentIndex + 1, pageParams.size))
                }
              }



            }


            }>
            <img src={ForwardUrl} style={{ transform: navType === -1 ? 'rotateY(180deg)' : ' rotateY(0deg)' }} />
            <Typography gutterBottom variant="body2"
              sx={{
                color: 'rgba(0, 0, 0, 0.6)',
                whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '90%', textAlign: 'center'
              }} >
              {navType === -1 ? '上一页' : '下一页'}
            </Typography>
          </Stack>
        </Stack>


      </Paper>
    </Grid>
    )
  }




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


  return (<Stack
    direction="column"
    justifyContent="flex-start"
    alignItems="flex-start"
    spacing={0}
    sx={{ height: '100%', width: '85%', paddingTop: 2, overflowY: 'auto' ,
}}  >
   
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        sx={{ width: '100%' ,    marginBottom:5}}    >
        {court.map((a, ids) => {return (
          <CircleButton
            key={a.name}
            value={a.name}
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
            {a.name}
          </CircleButton>
        )})}



        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={5}
        >
          <Typography gutterBottom variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)' }} >
            {currentSelectFolderTree && currentSelectFolderTree.root.filePath && `目标文件夹：${currentSelectFolderTree.root.filePath}`}
          </Typography>
         
        </Stack>
     
      </Stack>
      {/* <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={1}
        sx={{ height: 'auto', width: '100%', paddingTop: 0, overflowY: 'auto' }}>
   
        {users && users.map((file, index) => fileItem(file, index))}
   
      </Grid> */}
      <RecentCourse />
  
  </Stack>
  )
}
export default UserManagement