/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-17 11:19:45
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-28 16:40:13
 * @content: edit your page content
 */
import {  Divider,IconButton } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import EditIcon from '@mui/icons-material/Edit';
import FolderIcon from '@mui/icons-material/Folder';
import HorizontalRuleSharpIcon from '@mui/icons-material/HorizontalRuleSharp';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Stack,Paper } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText, { listItemTextClasses, ListItemTextProps } from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FileTree } from '../../common/interface';
import useStyles from '../../common/styles';
import { useSelector } from "../../redux/hooks";
import { datasetFolderContent,clearDatasetFilesCache, deleteDatasetFolders,
   selectInsensitivePath, toggleDsTreeExpand, updateDatasetFolders, fileSelectedViews } from '../../store/actions/filesAndFoldersActions';
import { rootProjects,createInsensitiveFolder,deleteInsensitiveFolder } from '../../store/actions/inSensitiveActions';
import { useSnackbar } from 'notistack';
import CachedIcon from '@mui/icons-material/Cached';
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

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',

  boxShadow: 0,
  p: 4,
};

interface folderModal {
  open: boolean;
  title?: string;
  type?: number;
  id?: number;
  callback?: Function;
}
function DsFolderTree(props) {
  const [dataSetInfo ,setDataSetInfo]= React.useState(null)
  const { datasets} = useSelector((state) => state.dsExplore)
  const [openParams, setOpen] = React.useState<folderModal>({ open: false });
  const [folderName, setFolderName] = React.useState('NewFolder');
  const editType = props.editType
  const currentFolderName = () => folderName
  let eventPup = false
  // const datasetId = props.datasetId
  const classes = useStyles();
  const dispatch = useDispatch()
  const inputRef = useRef();
  const {  cacheTree,createFolderSuccess,errorMsg,folderAsyncStatus ,currentSelectFolderTree} = useSelector((state) => state.inSensitive)
  const {     rootPath } = useSelector((state) => state.filesAndFolders)
  const [displayTree, setDisplayTree] = React.useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [folderList, setFolderList] = React.useState<FileTree[]>([]);
  useEffect(() => {
    setOpen({ open: false })
    setDisplayTree(cacheTree)
    }, [cacheTree])


    useEffect(() => {
      if (rootPath) {
        dispatch(rootProjects(rootPath.insensitivePath))
      }
    }, [rootPath])


    useEffect(() => {
      dispatch(clearDatasetFilesCache())
      return ()=>{
        dispatch(clearDatasetFilesCache())
      }
      }, [])


      

  useEffect(() => {
    if (createFolderSuccess) {
   
      enqueueSnackbar('创建成功,请刷新列表查看', {
        variant: 'success',
        autoHideDuration: 3000,
      })
    }

    if (errorMsg) {
      enqueueSnackbar(errorMsg, {
        variant: 'error',
        autoHideDuration: 3000,
      })
    }

    if (folderAsyncStatus) {
      enqueueSnackbar(`${folderAsyncStatus.processMsg}， 请稍后刷新列表查看`, {
        variant: 'warning',
        autoHideDuration: 3000,
      })
    }
    
  }, [createFolderSuccess,errorMsg,folderAsyncStatus])
  

  const handleMoreClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, tree: FileTree) => {
    let id = tree.root.id
    dispatch(datasetFolderContent(tree.root.filePath, (tree.currentIndex + 1), tree.pageSize, id))
  }


  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, tree: FileTree) => {
    if (eventPup) {
      eventPup = false
      return
    }
    if (tree.root.isDir) {
      if (!tree.initialed) {
        let id = tree.root.id
        dispatch(datasetFolderContent(tree.root.filePath, 1, tree.pageSize, id))
      } else {
        dispatch(toggleDsTreeExpand(tree))
      }
      dispatch(selectInsensitivePath(tree))
    } else {
      dispatch(fileSelectedViews(tree))
    }

  };

  const fileNameModal = (
    <Modal
      open={openParams.open}
      onClose={() => { setOpen({ open: false }) }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} >
        <Stack
          direction="column"
          justifyContent="space-around"
          alignItems="center"
          spacing={5}>

          <Typography id="modal-modal-title" variant="body2" component="div">
            {openParams.title}
          </Typography>
          {openParams.type !== 2 ? (<TextField
            label="Name"
            id="outlined-size-small"
            value={folderName}
            inputProps={{ maxLength: 20 }}
            inputRef={inputRef}
            onChange={(event) => {
              const {
                target: { value, name },
              } = event;
              setFolderName(value)

            }}
            size="small"
          />) : null}
          <Stack
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            spacing={3}>

            <Button variant="contained" size="small" onClick={() => { openParams.callback() }}>Submit</Button>
            <Button variant="outlined" size="small" onClick={() => { setOpen({ open: false }) }}>Cancel</Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  )



  const moreBtn = (tree, level) => {
    const marginRange = 2
    return (
      <>
        <ListItemButton

          onClick={(event) => handleMoreClick(event, tree)} key={`...moreBtn`} sx={{ pl: marginRange * level }}>
          <ListItemIcon>
            <MoreHorizIcon />
          </ListItemIcon>
          <ListItemText primary={`${tree.restNodes} more`} />
        </ListItemButton>
      </>
    )
  }

  const leafsListItem = (tree, level) => {
    const marginRange = 1

    let id = tree.root.id
    let name = tree.root.fileName

    if (tree.root.isDir) {
      let item = (<React.Fragment key={`1${id}${tree.root.id}`}><ListItemButton
        onClick={(event) => handleClick(event, tree)} key={`${id}${tree.root.id}`} sx={{ pl: marginRange * level, background: tree.choicen ? '#dedede' : 'transparent' }}>
        {tree.expanded ? <ArrowDropDownOutlinedIcon /> : < ArrowRightOutlinedIcon />}
        <ListItemIcon>
          <FolderIcon />
        </ListItemIcon>
        <Tooltip title={name} placement="top">
          <ListItemText primary={name} />
        </Tooltip>
        {editType ? (<ListItemIcon onClick={(event) => {
          eventPup = true
          event.preventDefault()
          // 
          setOpen({
            open: true,
            title: 'Please enter folder name',
            type: 1,
            id: tree.root.id,
            callback: () => {
              dispatch(createInsensitiveFolder(tree.root.filePath, inputRef.current.value))
              setOpen({ open: false })
            }
          })
        }}>
          <Tooltip title="New Folder" placement="top">
            <AddBoxIcon />
          </Tooltip>
        </ListItemIcon>) : null}
        {editType ? (
          <ListItemIcon onClick={(event) => {
            eventPup = true
            event.preventDefault()
            setOpen({
              open: true,
              title: 'Do you want to delete this Folder ?',
              type: 2,
              id: tree.root.id,
              callback: () => {
                dispatch(deleteInsensitiveFolder( tree.root.filePath))
                setOpen({ open: false })
              }
            })
          }}>
            <Tooltip title="remove Folder" placement="top">

              <IndeterminateCheckBoxIcon />
            </Tooltip>
          </ListItemIcon>) : null}

      </ListItemButton>

        {tree.expanded ? tree.leaf.map((child) => leafsListItem(child, level + 1)) : null}
        {tree.restNodes > 0 && tree.expanded ? moreBtn(tree, level + 1) : null}


      </React.Fragment>)
      return item
    } else {
      let item = (<React.Fragment key={`2${id}${tree.root.id}`} ><ListItemButton
      onClick={(event) =>{}} key={`${id}-${tree.root.id}`}
      sx={{ pl: marginRange * level, background: tree.choicen ? '#dedede' : 'transparent' }}>
      <HorizontalRuleSharpIcon sx={{ color: 'white' }} />
      <ListItemIcon>
        <InsertDriveFileIcon />
      </ListItemIcon>
      <Tooltip title={name} placement="top">
        <ListItemText primary={name} />
      </Tooltip>
    
     
    </ListItemButton>
    </React.Fragment>)
    return item
    
    }

  }





  const parseFolderList = (displayTree.map((tree, index) => {
    return leafsListItem(tree, 1)
  }))


  return (
    <Paper elevation={0} variant={'outlined'} sx={{ background: 'transparent',height:'100%',borderRadius:'0px',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    minWidth: 300,}}>
    <nav aria-label="main mailbox folders" style={{height:'100%'}}>
      <FireNav
        dense={true}
        sx={{
          minWidth: 300,
          overflow: 'auto',
          height: '100%',
          background:'transparent'
        }}
        key={`folder`}
        component='nav'
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader" sx={{background:'transparent'}}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center">
              <span >
                脱敏目录
              </span>
              <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center">
                   <IconButton
          aria-label="expand row"
          size="small"
          onClick={async () => {

            if (rootPath) {
              dispatch(rootProjects(rootPath.insensitivePath))
            }
         
          }}
        >
          <CachedIcon />
        </IconButton>
             <ListItemIcon onClick={(event) => {
                eventPup = true
                event.preventDefault()
                setOpen({
                  open: true,
                  title: 'Please enter new folder name',
                  type: 1,
                  callback: () => {
                    dispatch(createInsensitiveFolder(rootPath.insensitivePath, inputRef.current.value))
                    setOpen({ open: false })
                  }
                })
              }}>
                <Tooltip title="New Folder" placement="top">
                  <AddBoxIcon />
                </Tooltip>
              </ListItemIcon>
                </Stack>
           
            </Stack>
          </ListSubheader>
        }
      >
        {parseFolderList}
      </FireNav>

   
      {fileNameModal}
    </nav>
    </Paper>)
}
export default DsFolderTree