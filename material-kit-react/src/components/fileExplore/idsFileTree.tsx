/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-17 11:19:45
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-05-09 13:39:20
 * @content: edit your page content
 */

import CachedIcon from '@mui/icons-material/Cached';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { TreeItemProps } from '@mui/lab/TreeItem';
import { Box, Checkbox, Grid, Paper, Stack, Typography, Button } from '@mui/material';
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
  pathConfig, rootProjects, selectedFolderContent,selectedAndMoveByParams,exploreModeAction,updateSelectedParams,
} from '../../store/actions/filesAndFoldersActions';
//  import {
//   rootProjects, selectedFolderContent
//   , toggleFolderTreeExpand, copyIDSFilesToDataSet, pathConfig, searchActiveAction, searchDeActiveAction, selectedByParams, updateSelectedParams,
//   mergeActiveAction, mergeDeActiveAction, mergeIndexAction
// } from '../../store/actions/filesAndFoldersActions';
import FileViewerComponent from "./fileviewer";
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



function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}


function IdsFileTree(props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(true);
  const [treeSets, setTreeSets] = React.useState({ path: '', raw: '' });
  let eventPup = false
  // const setEventPup]
  // const [exploreMode, setExploreMode] = React.useState(false)
  const user = useSelector((state) => state.users)
  const classes = useStyles();
  const dispatch = useDispatch()
  const { files, folders, rootPath, restNodes, currentIndex, searchActive, mergeActive, fileStatistic, searchParams,exploreMode } = useSelector((state) => state.filesAndFolders)
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
        dispatch(updateSelectedParams({...searchParams,filePath:treeSets.raw}))
    //   }
    // }
    console.log("🚀 ~ file: idsFileTree.tsx ~ line 124 ~ IdsFileTree ~ treeSets", treeSets,searchParams)
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




const parsePathList=()=>{
  return element.map(e=>{return e.filePath})
}






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



  const parseIconUrl = (path, isFolder) => {
    path = path[path.length - 1]
    if (isFolder) {
      return FolderIconUrl
    } else

      if (['jpg', 'jpeg', 'gif', 'bmp', 'png'].indexOf(path) > -1) {
        return ImageIconUrl
      } else


        if (['csv', 'xlsx', 'js', 'txt', 'json'].indexOf(path) > -1) {
          return TextGreenIconUrl
        } else
          if (['mp3',].indexOf(path) > -1) {
            return AudioIconUrl
          } else
            if (['mp4', 'avi'].indexOf(path) > -1) {
              return VideoIconUrl
            } else
              if (['zip'].indexOf(path) > -1) {
                return ZipIconUrl
              } else {
                return TextIconUrl
              }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setFileIndexChecked(fileIndex)
      setSelectedNode(element[fileIndex])
    } else {
      setFileIndexChecked(-1)
      setSelectedNode(null)
    }
  };

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
                  dispatch(selectedByParams({...searchParams,queryType:-1,pageNo:currentIndex - 1,sortValues:element[0]},  pageParams.size))
                } else {
                  dispatch(selectedFolderContent(treeSets.raw, currentIndex - 1, pageParams.size))
                }
              } else {
                // 下一页
                if (searchActive) {
                  dispatch(selectedByParams({...searchParams,queryType:1,pageNo:currentIndex + 1,sortValues:element[element.length-1]},  pageParams.size))
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




  const fileItem = (folder, index) => {
    return (<Grid item xs={1} key={index}>
      <Paper elevation={0} sx={{ background: 'transparent', '& :hover': { background: 'rgb(0,0,0,0.1)' } }}>
        <Tooltip title={folder.fileName} placement="top">
          <Stack
            direction="column"
            justifyContent="center"
            alignItems=""
            spacing={0}
            sx={{ cursor: !folder.isDir ? 'auto' : 'pointer', '& :hover': { background: 'transparent' } }}
            onMouseEnter={() => {
              setFileIndex(index)
            }}
            onMouseLeave={() => {
              setFileIndex(-1)
            }}
            onClick={(event) => {

            }}>
            {index === fileIndex || index === fileIndexChecked ? (<Checkbox {...label}
              disabled={mergeActive && !folder.isDir}
              checked={fileIndexChecked === index}
              onChange={handleChange}
              sx={{ alignSelf: 'flex-start !important' }} size="small" />)
              : (<Box sx={{ height: '38px', width: '100%' }}></Box>)}
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={0}
              sx={{ cursor: !folder.isDir ? 'auto' : 'pointer', '& :hover': { background: 'transparent' } }}
              onClick={(event) => {
                if (folder.isDir) {
                  handleClick(event, folder)
                } else {
                  // setExploreMode(true)
                  dispatch(exploreModeAction(true))
                  // 点击设置文件
                  dispatch(fileSelectedViews({ root: { path: folder.filePath, fileType: folder.filePath.split('.').reverse()[0] }, leaf: [] }))
                  setFileIndexChecked(fileIndex)
                  setSelectedNode(element[fileIndex])
                }
              }}>
              <img src={parseIconUrl(folder.filePath.split('.'), folder.isDir)} />
              <Typography gutterBottom variant="body2"
                sx={{
                  color: 'rgba(0, 0, 0, 0.6)',
                  whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '90%', textAlign: 'center'
                }} >
                {folder.fileName}
              </Typography>
            </Stack>
          </Stack>

        </Tooltip>
      </Paper>
    </Grid>
    )
  }


  return (<Stack
    direction="column"
    justifyContent="flex-start"
    alignItems="flex-start"
    spacing={0}
    sx={{ height: '100%', width: '85%', paddingTop: 2, overflowY: 'auto' }}  >
    {exploreMode ? (<> <FileViewerComponent exploreMode={exploreMode} sx={{ width: '100%', height: '800px' }} back={() => { dispatch(exploreModeAction(false)) }} /></>) : (<>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        sx={{ width: '100%' }}    >
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb">
          {treeSets && treeSets.path !== '' ? (<Typography gutterBottom variant="body2"
            sx={{ cursor: searchActive?'auto': 'pointer' }}
            color="inherit"
            onClick={() => {
              if(searchActive){
                return
              }
              let rawPath = rootPath.rootPath
              setTreeSets({ path: '', raw: '' })
              dispatch(selectedFolderContent(rawPath, pageParams.num, pageParams.size))
              dispatch(folderContentStatistic(rawPath))
            }}
          >
            全部文件
          </Typography>) : (<Typography gutterBottom variant="body2"
            color="inherit"
            sx={{}}
          >
            全部文件
          </Typography>)}

          {treeSets.path && treeSets.path.map((tree, index) => {
            return (
              <Typography gutterBottom variant="body2" key={index}
                sx={{ cursor: index === (treeSets.path.length - 1) ? 'auto' :searchActive?'auto':  'pointer' }}
                color="inherit"
                onClick={() => {
                  if(searchActive){
                    return
                  }
                  let rawPath = rootPath.rootPath + '/' + treeSets.path.slice(0, index + 1).join('/')
                  setTreePath(rawPath)
                  dispatch(selectedFolderContent(rawPath, pageParams.num, pageParams.size))
                  dispatch(folderContentStatistic(rawPath))
                }}
              >
                {tree}
              </Typography>)
          })}
        </Breadcrumbs>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={5}
        >
          <Typography gutterBottom variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)' }} >
            {currentSelectFolderTree &&currentSelectFolderTree.root.filePath &&`目标文件夹：${currentSelectFolderTree.root.filePath}`}
          </Typography>


          {currentSelectFolderTree && searchActive && (
            <Button variant="outlined" disabled={!element || element.length === 0} size="small" onClick={() => {
              // parsePathList()
              dispatch(selectedAndMoveByParams({filePaths:parsePathList(),destFilePath:currentSelectFolderTree.root.filePath})) 
             }}>添加当前页结果</Button>
          )}
          {currentSelectFolderTree && searchActive&&(
            <Button variant="outlined" disabled={!element || element.length === 0} size="small" onClick={() => { 
              dispatch(selectedAndMoveByParams({...searchParams,destFilePath:currentSelectFolderTree.root.filePath}))       
            }}>添加全部结果</Button>
          )}

          <Typography gutterBottom variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)' }} >
            {!searchActive && <IconButton
              aria-label="expand row"
              size="small"
              onClick={async () => {

                dispatch(selectedFolderContent(treeSets.raw || rootPath.rootPath, currentIndex, pageParams.size))
                dispatch(labelsStatisticAction())
                dispatch(folderContentStatistic(treeSets.raw || rootPath.rootPath))
              }}
            >
              <CachedIcon />
            </IconButton>}

            已全部加载,共{element.length}个</Typography>
        </Stack>

      </Stack>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={0}
        sx={{ height: 'auto', width: '100%', paddingTop: 0, overflowY: 'auto' }}>
        {/* {folders && folders.map((folder, index) => fileItem(folder, index))}
        {files && files.map((file, index) => fileItem(file, index))} */}
        {currentIndex > 1 && fileNav(-1)}
        {element && element.map((file, index) => fileItem(file, index))}
        {restNodes > 0 && fileNav(1)}
      </Grid>
    </>)}
  </Stack>
  )
}
export default IdsFileTree