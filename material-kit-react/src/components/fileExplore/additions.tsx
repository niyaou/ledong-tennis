/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-04-12 13:28:41
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-05-10 16:47:31
 * @content: edit your page content
 */
/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-17 11:19:45
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-12 13:27:54
 * @content: edit your page content
 */
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import TreeItem, { treeItemClasses, TreeItemProps } from '@mui/lab/TreeItem';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText, { ListItemTextProps, listItemTextClasses } from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { styled } from '@mui/material/styles';
import { SvgIconProps } from '@mui/material/SvgIcon';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FileTree } from '../../common/interface';
import { fileLengthFormat } from '../../common/utils/dateUtils';
import useStyles from '../../common/styles';
import { useSelector } from "../../redux/hooks";
import {
  rootProjects, selectedFolderContent
  , toggleFolderTreeExpand, copyIDSFilesToDataSet, pathConfig, searchActiveAction, searchDeActiveAction, selectedByParams, updateSelectedParams,
  mergeActiveAction, mergeDeActiveAction, mergeIndexAction
} from '../../store/actions/filesAndFoldersActions';
import { indexOf } from 'lodash'
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import DoneIcon from '@mui/icons-material/Done';
import { uploadFileTagsAndScenesAction, uploadFileFolderIndexAction } from '../../store/slices/uploadFileSlice'
import HorizontalRuleSharpIcon from '@mui/icons-material/HorizontalRuleSharp';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SearchParamsBtn from '../exploreDs/searchParamsBtn';
import RangeTextField from '../widget/rangeTextField';
import Collapse from '@mui/material/Collapse';
import { InputBase } from '@mui/material';
import FolderIconUrl from '../../assert/folderIcon.png';
import ImageIconUrl from '../../assert/imageIcon.png';
import TextIconUrl from '../../assert/textIcon.png';
import BlankFolderIconUrl from '../../assert/blankfolder.png';
import TextGreenIconUrl from '../../assert/textIconGreen.png';
import VideoIconUrl from '../../assert/videoIcon.png';
import ZipIconUrl from '../../assert/zipIcon.png';
import AudioIconUrl from '../../assert/audioIcon.png';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import InsightsIcon from '@mui/icons-material/Insights';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useSnackbar } from 'notistack';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import SearchIcon from '@mui/icons-material/Search';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import qs from 'qs'
import {
  CardHeader, Checkbox, Divider, Box, Button, Modal, Grid,
  Card, Tabs, Tab, Fade, CardMedia, Paper, Stack, Backdrop, Grow,
  CircularProgress, TextField, Typography, Select, MenuItem, FormControl, InputLabel, Input, FormControlLabel, Switch
} from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LowCascader from './lowCascader'
import ExtensionIcon from '@mui/icons-material/Extension';
import { findIndex } from 'lodash';


type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  color?: string;
  labelIcon: React.ElementType<SvgIconProps>;
  labelInfo?: string;
  labelText: string;
  level: number;
  initialed: boolean;
};


export const ExpandListText = styled(({ classes, ...props }: ListItemTextProps) => (<ListItemText {...props} classes={classes} />))(({ theme }) => ({
  [`& .${listItemTextClasses.primary}`]: {
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
}))



function Additions(props) {
  const [tagsValue, setTagsValue] = React.useState([]);

  const { areas, users } = useSelector((state) => state.domination)
  const [scenesValue, setScenesValue] = React.useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(false);
  const [openSearch, setOpenSearch] = React.useState(false);
  const [treeSets, setTreeSets] = React.useState({ path: '', raw: '' });

  const datasetId = props.datasetId
  let eventPup = false

  const [dataSetInfo, setDataSetInfo] = React.useState(null)
  const { datasets } = useSelector((state) => state.dsExplore)
  const user = useSelector((state) => state.users)
  const classes = useStyles();
  const dispatch = useDispatch()
  const { folders, cacheTree, rootPath, searchActive, nodeSelected, searchParams,
    mergeActive, currentIndex, labelStatistic, successed, errorMsg: indexErrorMsg,
    searchMoveStatus, exploreMode } = useSelector((state) => state.filesAndFolders)
  const { tags, scenes } = useSelector((state) => state.tagsInfo)
  const { errorMsg, isSuccess } = useSelector((state) => state.uploadFiles)
  const [folderList, setFolderList] = React.useState<FileTree[]>([]);


  const [currentNodeSelected, setCurrentNodeSelected] = React.useState();
  const [restLabelItem, setRestLabelItem] = React.useState(labelStatistic || []);

  const [rawNode, setRawNode] = React.useState();
  const [labelNode, setLabelNode] = React.useState();


  useEffect(() => {

    if (labelStatistic && labelStatistic.length > 0) {
      setRestLabelItem(labelStatistic)
    }

  }, [labelStatistic])


  useEffect(() => {

    if (mergeActive) {
      setLabelNode(nodeSelected)
    } else {
      setCurrentNodeSelected(nodeSelected)
    }

  }, [nodeSelected])

  useEffect(() => {
    if (mergeActive) {
      setLabelNode(currentNodeSelected)
    } else {
      setLabelNode(null)
    }
  }, [mergeActive])

  useEffect(() => {
    if (searchMoveStatus) {
      enqueueSnackbar(`${searchMoveStatus.processMsg},请稍后刷新页面查看`, {
        variant: 'warning',
        autoHideDuration: 3000,
      })
    }

  }, [searchMoveStatus])


  useEffect(() => {
    if (successed) {
      enqueueSnackbar('开始关联标注文件,请稍后刷新页面查看', {
        variant: 'warning',
        autoHideDuration: 3000,
      })
      setLabelNode(undefined)
    }
    if (indexErrorMsg) {
      enqueueSnackbar(`开始关联标注文件失败,${indexErrorMsg}`, {
        variant: 'error',
        autoHideDuration: 3000,
      })
    }

  }, [successed, indexErrorMsg])



  const location = useLocation();
  let params = qs.parse(location.search.substring(1, location.search.length));
  const [searchContent, setSearchContent] = React.useState('');
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('lg');

  const [tagsArr, setTagsArr] = React.useState([]);
  const [scenesArr, setScenesArr] = React.useState([]);
  const [queryParams, setQueryParams] = React.useState({ ...searchParams, pageNo: 1, pageSize: 50, queryType: 0 });
  const [uploadFiles, setUploadFiles] = React.useState([])
  const [openStandard, setOpenStandard] = React.useState(false);
  const Input = styled('input')({
    display: 'none',
  });


  useEffect(() => {
    console.log("🚀 ~ file: additions.tsx ~ line 228 ~ useEffect ~ uploadFiles", uploadFiles)
  }, [uploadFiles])


  const choiceFiles = (e) => {
    let files = []
    for (let i = 0; i < e.target.files.length; i++) {
      files.push(e.target.files[i])
    }
    let totalSize = files.reduce((totalSize, file) => {
      return totalSize + file.size
    }, 0)


    if (totalSize > 100 * 1024 * 1024) {
      enqueueSnackbar(`upload files total size must be less than ${Math.floor(100)}MB`, {
        variant: 'warning',
        autoHideDuration: 3000,
      })
      return
    }

    setUploadFiles(e.target.files)
  }


  const [standardDateValue, setStandardDateValue] = React.useState<Date | null>(
    new Date()
  );



  const standardSetDialog = (folderPath) => (
    <Dialog
      open={openStandard}
      fullWidth={fullWidth}
      maxWidth='md'
      sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '600px' } }}
      onClose={() => { setOpenStandard(false) }}
    >
      <DialogTitle>向{folderPath.replace(rootPath && rootPath.rootPath || '', '')}文件夹添加标定文件</DialogTitle>
      <DialogContent>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="flex-start"
          spacing={2}
          sx={{ color: 'rgb(0,0,0,0.6)' }}>

          {uploadFiles && uploadFiles[0] && (
            <Typography gutterBottom variant="body2" sx={{ wordBreak: 'break-all', maxWidth: '90%', width: '90%', color: 'rgba(0, 0, 0, 0.6)' }} >
              标定文件：{uploadFiles[0].name}
            </Typography>
          )}
          {uploadFiles && uploadFiles[0] && (
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="标定日期"
                value={standardDateValue}
                onChange={(newValue) => {
                  setStandardDateValue(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          )}
          <label htmlFor="contained-button-file">
            <Input accept="*/*" id="contained-button-file" type="file"
              onChange={choiceFiles}
            />
            <Button variant="contained" component="span">
              Upload
            </Button>
          </label>

        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={
          (e) => {

            // setQueryParams({ ...queryParams, senceAttArray: scenesArr.join(',').replace('&', '%26'), attArray: tagsArr.join(',').replace('&', '%26') })
            // setOpenSearch(false)
            console.log("🚀 ~ file: additions.tsx ~ line 310 ~ Additions ~  standardDateValue,uploadFiles", standardDateValue, uploadFiles)
            setOpenStandard(false)
          }
        }>提交</Button>

        <Button onClick={() => { setOpenStandard(false) }}>关闭</Button>
      </DialogActions>
    </Dialog>
  )



  const handleClose = () => {
    setOpen(false);
    setOpenSearch(false)
  };


  const handleTagSubmit = () => {
    dispatch(uploadFileTagsAndScenesAction({ tags: tagsArr, scenes: scenesArr, fileId: currentNodeSelected.id }))
  };



  const transformTags = (array) => {
    let newArr = array.map(tag => {
      let nextTtag = { value: tag.id }
      nextTtag = { ...nextTtag, label: tag.name }
      nextTtag = { ...nextTtag, children: transformTags(tag.children, tag.id) }
      return nextTtag
    })
    return newArr
  }



  useEffect(() => {
    setQueryParams({ ...queryParams, fileName: searchContent })
  }, [searchContent])



  useEffect(() => {
    // if (searchActive) {
    if (searchParams && searchParams.filePath) {
      setQueryParams({ pageNo: 1, pageSize: 50, queryType: 0, filePath: searchParams.filePath })
    } else {
      setQueryParams({ pageNo: 1, pageSize: 50, queryType: 0, })
    }
    setTagsArr([])
    setScenesArr([])
    setSearchContent('')
    // }

  }, [searchActive])


  useEffect(() => {
    if (folders && folders.length > 0) {
      setFolderList(folders.map((folder) => { return { root: folder, leaf: [] } }))
    }
  }, [cacheTree])

  useEffect(() => {
    if (errorMsg) {
      enqueueSnackbar(`${errorMsg},请稍后刷新页面查看`, {
        variant: 'warning',
        autoHideDuration: 3000,
      })
    }
    if (isSuccess) {
      enqueueSnackbar('开始更新标签,请稍后刷新页面查看', {
        variant: 'success',
        autoHideDuration: 3000,
      })
    }
    setOpen(false);
  }, [errorMsg, isSuccess])




  const tagSetDialog = (dialogType) => (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={dialogType === 'set' ? open : openSearch}
      sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '600px' } }}
      onClose={handleClose}
    >
      <DialogTitle>设置标签和场景</DialogTitle>
      <DialogContent>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="flex-start"
          spacing={2}
          sx={{ color: 'rgb(0,0,0,0.6)' }}>
          <LowCascader items={transformTags(tags)} title={'设置标签'} tagsAndScenes={!searchActive && currentNodeSelected && currentNodeSelected.attsArray || []} callBack={(arr) => {
            setTagsArr(arr)
          }} />
          <LowCascader items={transformTags(scenes)} title={'设置场景'} tagsAndScenes={!searchActive && currentNodeSelected && currentNodeSelected.senceAttsArray || []}
            callBack={(arr) => {
              // callBack(arr)
              setScenesArr(arr)


            }} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={
          (e) => {
            if (dialogType === 'set') { handleTagSubmit() }
            if (dialogType === 'search') {
              setQueryParams({ ...queryParams, senceAttArray: scenesArr.join(',').replace('&', '%26'), attArray: tagsArr.join(',').replace('&', '%26') })
              setOpenSearch(false)
            }
          }
        }>提交</Button>

        <Button onClick={handleClose}>关闭</Button>
      </DialogActions>
    </Dialog>
  )







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

  const [age, setAge] = React.useState('');

  const [labelArr, setLabelArr] = React.useState([]);


  const [value, setValue] = React.useState<Date | null>(
    null
  );
  // new Date(),

  const appendArr = () => {
    labelArr.push(labelArr.length + 1)
    let a = labelArr.concat()
    setLabelArr(a)
  }

  const searchForm = (<Stack
    direction="column"
    justifyContent="center"
    alignItems="center"
    spacing={2}
    sx={{ color: 'rgb(0,0,0,0.6)' }}>
   

    <FormControl sx={{  width: 300, }}>
      <InputLabel id="demo-controlled-open-select-label1">校区</InputLabel>
      <Select label="FileTypes" labelId="demo-controlled-open-select-label12"
        name='FileTypes'
        
        onChange={() => { }}
        value={['1']}>
        {areas.map((dict, index) => { return (<MenuItem key={index} value={dict}>{dict}</MenuItem>) })}
      </Select>
    </FormControl>

    <FormControl sx={{ m: 1, minWidth: 120, width: '100%' }}>
      <InputLabel id="demo-controlled-open-select-label1">课程类型</InputLabel>
      <Select label="FileTypes" labelId="demo-controlled-open-select-label12"
        name='FileTypes'
        onChange={() => { }}
        value={['班课']}>
        {['班课','私教'].map((dict, index) => { return (<MenuItem key={index} value={dict}>{dict}</MenuItem>) })}
      </Select>
    </FormControl>

    <FormControl sx={{ m: 1, minWidth: 120, width: '100%' }}>
      <InputLabel id="demo-controlled-open-select-label1">教练</InputLabel>
      <Select label="FileTypes" labelId="demo-controlled-open-select-label12"
        name='FileTypes'
        onChange={() => { }}
        value={['']}>
        {users&&users.filter((user) => user.coach===1||user.clubId===3).map((dict, index) => { return (<MenuItem key={index} value={dict.realName}>{dict.realName}</MenuItem>) })}
      </Select>
    </FormControl>


    <LocalizationProvider dateAdapter={AdapterMoment}>
      <FormControl sx={{ m: 1, minWidth: 120, width: '100%' }} size="small">
        <DateTimePicker
          label="开始时间"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            setQueryParams({ ...queryParams, startTimeCreateTime: newValue.format('YYYY-MM-DD') })
          }}
          renderInput={(params) => <TextField {...params} />}
        />

      </FormControl>
    </LocalizationProvider>
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <FormControl sx={{ m: 1, minWidth: 120, width: '100%' }} size="small">
        <DateTimePicker
          label="结束时间"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);

            setQueryParams({ ...queryParams, endTimeCreateTime: newValue.format('YYYY-MM-DD') })

          }}
          renderInput={(params) => <TextField {...params} />}
        />

      </FormControl>
    </LocalizationProvider>
    <FormControl sx={{ m: 1, width: '100%' }} >
      <Button variant="outlined" size="small" startIcon={<AutoAwesomeMotionIcon />}
        onClick={() => {
          setOpenSearch(true)
        }}>
        增加学员
      </Button>

    </FormControl>

    <FormControl sx={{ m: 1, width: '100%' }} >
      <Button variant="contained" size="small" startIcon={<AutoAwesomeMotionIcon />}
        onClick={() => {
          setOpenSearch(true)
        }}>
       确认添加
      </Button>

    </FormControl>

    {labelArr.map((value, i) => {
      return (<RangeTextField modified={true} key={i} sx={{ width: '100%' }} title={value}
        minCallBack={(minValue) => {
          let labelArray = queryParams.labelArray || []
          const index = labelArray.findIndex(e => e.label === value);
          if (index > -1) {
            labelArray[index]['min'] = minValue
          } else {
            labelArray.push({ label: value, min: minValue })
          }
          setQueryParams({ ...queryParams, labelArray: labelArray })
        }}
        maxCallBack={(maxValue) => {
          let labelArray = queryParams.labelArray || []
          const index = labelArray.findIndex(e => e.label === value);
          if (index > -1) {
            labelArray[index]['max'] = maxValue
          } else {
            labelArray.push({ label: value, max: maxValue })
          }
          setQueryParams({ ...queryParams, labelArray: labelArray })

        }}

        pop={(textKey) => {
          let pos = labelArr.indexOf(textKey)
          let removedItem = labelArr.splice(pos, 1)
          let a = labelArr.concat()
          setLabelArr(a)
        }} />)
    })}

    {/* <Button variant="outlined" startIcon={<AddBoxIcon />} color={'inherit'} sx={{ width: '100%' }}
      onClick={
        (e) => {
          appendArr()
        }
      }
    >
      添加标注类型筛选
    </Button> */}

    {/* <FormControl sx={{ m: 1, width: '100%' }}>
      <InputLabel >添加标注类型筛选 </InputLabel>
      <Select label="添加标注类型筛选" labelId="demo-controlled-open-select-label2"
        name='添加标注类型筛选'

        onChange={(event) => {
          const {
            target: { value, name },
          } = event;
          labelArr.push(value)
          let a = labelArr.concat()
          setLabelArr(a)
        }}
        value={''} >
        {restLabelItem ? restLabelItem.map((dict, index) => { return (<MenuItem key={index} value={dict.label}>{dict.label}</MenuItem>) }) : null}
      </Select>
    </FormControl> */}



    {/* <IconButton sx={{ p: '10px' }} aria-label="search" 
        onClick={
          (e) => {
          }
        }
      >
         <Typography gutterBottom variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)' }} >
       添加标注类型筛选
      </Typography>
        <AddBoxIcon />
      </IconButton> */}
  </Stack>)



  //  {scenseSetDialog}
  return (<>
    {standardSetDialog(currentNodeSelected && currentNodeSelected.filePath || '')}
    {tagSetDialog('set')}
    {tagSetDialog('search')}
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={5}
      sx={{ height: '100%', width: '15%', minWidth: '300px', paddingRight: '30px', paddingLeft: '30px', paddingTop: 5, overflowY: 'auto', background: '#f5f6fa' }}
    >
      <Typography gutterBottom variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)' }} >
        记录课程
      </Typography>
      {/* sx={{ height: '100%', width: '95%', paddingTop: 2, paddingLeft: '10px !important', overflowY: 'auto', }}> */}


      {/* {searchActive ? */}
      <Grow in={true}
        style={{ transformOrigin: '0 0 0' }}
        {...(searchActive ? { timeout: 1000 } : {})}

      >{searchForm}</Grow>



    </Stack>
  </>
  )
}
export default Additions