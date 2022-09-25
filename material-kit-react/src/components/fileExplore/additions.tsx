/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-04-12 13:28:41
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-05-11 15:42:33
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
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
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
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

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
import ArticleIcon from '@mui/icons-material/Article';
import qs from 'qs'
import {
  CardHeader, Checkbox, Divider, Box, Button, Modal, Grid,
  Card, Tabs, Tab, Fade, CardMedia, Paper, Stack, Backdrop, Grow,
  CircularProgress, TextField, Autocomplete, Typography, Select, MenuItem, FormControl, InputLabel, Input, FormControlLabel, Switch
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
import { findIndex, find } from 'lodash';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { exploreUsersAction, exploreRecentCourse, selectCourse as selectCourseAction, createCard } from '../../store/slices/dominationSlice'
import moment from 'moment'
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

  const { areas, users, selectCourse ,createSuccess} = useSelector((state) => state.domination)
  const [scenesValue, setScenesValue] = React.useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(false);
  const [openSearch, setOpenSearch] = React.useState(false);
  const [startTime, setStartTime] = React.useState(new Date());
  const [endTime, setEndTime] = React.useState(new Date);

  const [courseEdit, setCourseEdit] = React.useState({
    startTime: new Date(), endTime: new Date(), coach: '', spendingTime: 1, courtSpend: 0, coachSpend: 0, descript: '',
    court: '', grade: '', membersObj: null
  });

  // Object.assign(membobj, {
  //   [s.openId]: [s.courseSpend,s.courseTimes]
  // })
  const datasetId = props.datasetId
  let eventPup = false

  const [dataSetInfo, setDataSetInfo] = React.useState(null)
  const { datasets } = useSelector((state) => state.dsExplore)

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

  const [userOptions, setUserOptions] = React.useState([]);

  const [memberValue, setMemberValue] = React.useState<string | null>('');
  const [inputValue, setInputValue] = React.useState('');

  useEffect(() => {

    if (users && users.length > 0) {
      let r = users.filter(u => u.prepaidCard).map(user => { return user.prepaidCard })
      console.log("🚀 ~ file: additions.tsx ~ line 154 ~ useEffect ~ r", r)
      setUserOptions(r)
    }

  }, [users])

  useEffect(() => {
    if (createSuccess) {
      enqueueSnackbar(`课程添加成功`, {
        variant: 'success',
        autoHideDuration: 3000,
      })
    }
    console.log("🚀 ~ file: additions.tsx ~ line 182 ~ useEffect ~ courseEdit", courseEdit)
  }, [courseEdit,createSuccess])

  useEffect(() => {

    if (selectCourse) {
      let after = {
        ...courseEdit, startTime: new Date(selectCourse.start), endTime: new Date(selectCourse.end),
        court: courseEdit.court, coach: courseEdit.coach
      }

      setStartTime(after.startTime)
      setEndTime(after.endTime)
      setCourseEdit(after)
    }

  }, [selectCourse])

  // users.map(user => { return { ...user, label: user.prepaidCard } })


  const [rawNode, setRawNode] = React.useState();
  const [labelNode, setLabelNode] = React.useState();





  // useEffect(() => {
  //   if (mergeActive) {
  //     setLabelNode(nodeSelected)
  //   } else {
  //     setCurrentNodeSelected(nodeSelected)
  //   }
  // }, [nodeSelected])

  // useEffect(() => {
  //   if (mergeActive) {
  //     setLabelNode(currentNodeSelected)
  //   } else {
  //     setLabelNode(null)
  //   }
  // }, [mergeActive])

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
            console.log("🚀 ~ file: additions.tsx ~ line 310 ~ Additions ~  standardDateValue,uploadFiles", courseEdit, standardDateValue, uploadFiles)
            dispatch(createCard(courseEdit))
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


  const memberItem = (m, idx) => {
    let mi = find(users, { 'prepaidCard': m.name })
    return (<Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      spacing={1}

      key={`member-${idx}`}
      sx={{ color: 'rgb(0,0,0,0.6)', width: '100%' }}>
      <Typography variant="subtitle1"
        sx={{
          color: 'rgba(0, 0, 0, 0.6)',
          minWidth: '50px',
        }} >
        {mi.prepaidCard}
      </Typography>
      {m.type !== 1 && <Typography variant="subtitle1"
        id="outlined-password-input"
        color='secondary'
      >
        {m.type === 2 ? '扣次卡一次' : '年卡'}
      </Typography>}

      {m.type === 1 && <TextField
        id="outlined-password-input"
        label="课时费"
        size="small"
        sx={{ width: '100px' }}
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        value={m.spendFee}
        onChange={(e) => {
          labelArr[idx].spendFee = parseInt(e.target.value)
          let a = labelArr.concat()
          setLabelArr(a)
          let member = courseEdit.membersObj
          member[mi.id] = [parseInt(e.target.value), 0,0]
          let after = { ...courseEdit, membersObj: member }
          // spendFee:0,times:0 
          // console.log("🚀 ~ file: additions.tsx ~ line 665 ~ Additions ~ newValue", newValue)
          //   let after= {...courseEdit ,startTime: newValue }
          //   setStartTime(newValue)
          //   let diff= moment(after.endTime,'YYYY-MM-DD HH:mm').diff( moment(after.startTime,'YYYY-MM-DD HH:mm'),'minutes')
          //   after= {...courseEdit , spendingTime:diff}
          //   console.log("🚀 ~ file: additions.tsx ~ line 665 ~ Additions ~ diff", diff)
          setCourseEdit(after)
        }}
      />}
      {m.type !== 1 && <Tooltip title={'课时费'} placement="top">

        <IconButton
          aria-label="expand row"
          size="small"
          onClick={async () => {
            let pos = labelArr.findIndex(e => e.name === m.name)

            labelArr[pos].type = 1
            // labelArr[pos].spendFee = 0
            // let member = courseEdit.membersObj
            // member[mi.id] = [0, 1]
            // let after = { ...courseEdit, membersObj: member }
            let a = labelArr.concat()
            setLabelArr(a)
            // setCourseEdit(after)
          }}
        >
          <ArticleIcon />
        </IconButton>
      </Tooltip>
      }
      {m.type !== 2 && <Tooltip title={'次卡'} placement="top">
        <IconButton
          aria-label="expand row"
          size="small"
          onClick={async () => {
            let pos = labelArr.findIndex(e => e.name === m.name)
            labelArr[pos].type = 2
            labelArr[pos].spendFee = 0
            let member = courseEdit.membersObj
            member[mi.id] = [0, 1,0]
            let after = { ...courseEdit, membersObj: member }
            let a = labelArr.concat()
            setLabelArr(a)
            setCourseEdit(after)
          }}
        >
          <CalendarMonthIcon />
        </IconButton>
      </Tooltip>
      }
      {m.type !== 3 && <Tooltip title={'年卡'} placement="top">
        <IconButton
          aria-label="expand row"
          size="small"
          onClick={async () => {
            let pos = labelArr.findIndex(e => e.name === m.name)
            labelArr[pos].type = 3
            labelArr[pos].spendFee = 0
            let member = courseEdit.membersObj
            member[mi.id] = [0, 0,1]
            let after = { ...courseEdit, membersObj: member }
            let a = labelArr.concat()
            setLabelArr(a)
            setCourseEdit(after)
          }}
        >
          <MonetizationOnIcon />
        </IconButton>
      </Tooltip>
      }
      <IconButton
        aria-label="expand row"
        size="small"
        onClick={async () => {


          let pos = labelArr.findIndex(e => e.name === m.name)
          labelArr.splice(pos, 1)
          let a = labelArr.concat()
          setLabelArr(a)
        }}
      >
        <HighlightOffIcon />
      </IconButton>
    </Stack>)
  }




  const [age, setAge] = React.useState('');

  const [labelArr, setLabelArr] = React.useState([]);


  const [value, setValue] = React.useState<Date | null>(
    null
  );
  // new Date(),

  const appendArr = (item) => {
    let ids = labelArr.findIndex(e => e.name === item)
    if (ids >= 0) {
      return
    }
    let member = users.find(u => u.prepaidCard === item)
    labelArr.push({ name: item, type: 1, spendFee: 0, times: 0 })
    let a = labelArr.concat()
    let temp = {}
    temp = Object.assign(temp, {
      [member.id]: [0, courseEdit.spendingTime]
    })
    let after = { ...courseEdit, membersObj: { ...courseEdit.membersObj, ...temp } }

    // const [courseEdit, setCourseEdit] = React.useState({ startTime: new Date(),endTime: new Date(),coach:'',spendingTime:0 ,courtSpend:0,coachSpend:0,descript:'',
    // court:'',grade:'',membersObj:{}});

    setCourseEdit(after)

    setLabelArr(a)
    {/* const [courseEdit, setCourseEdit] = React.useState({ startTime:'',endTime:'',coach:'',spendingTime:'' ,courtSpend:0,coachSpend:0,descript:'',
  court:'',grade:'',membersObj:{}}); */}

    // Object.assign(membobj, {
    //   [s.openId]: [s.courseSpend,s.courseTimes]
    // })
  }

  const searchForm = (<Stack
    direction="column"
    justifyContent="center"
    alignItems="center"
    spacing={2}
    sx={{ color: 'rgb(0,0,0,0.6)' }}>

    {selectCourse && (<Typography gutterBottom variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)' }} >
      {selectCourse.court}
    </Typography>)}
    {!selectCourse && <FormControl sx={{ width: 350, }}>
      <InputLabel id="demo-controlled-open-select-label1">校区</InputLabel>
      <Select label="FileTypes" labelId="demo-controlled-open-select-label12"
        name='FileTypes'
        size="small"
        onChange={(e) => {
          let after = { ...courseEdit, court: e.target.value }
          setCourseEdit(after)
        }}
        value={[courseEdit.court]}>
        {areas.map((dict, index) => { return (<MenuItem key={index} value={dict}>{dict}</MenuItem>) })}
      </Select>
    </FormControl>}



    {!selectCourse && <FormControl sx={{ m: 1, minWidth: 120, width: '100%' }}>
      <InputLabel id="demo-controlled-open-select-label1">教练</InputLabel>
      <Select label="FileTypes" labelId="demo-controlled-open-select-label12"
        name='FileTypes'
        size="small"
        onChange={(e) => {
          let after = { ...courseEdit, coach: e.target.value }
          setCourseEdit(after)
        }}
        value={[courseEdit.coach]}>
        {users && users.filter((user) => user.coach === 1 || user.clubId === 3).map((dict, index) => { return (<MenuItem key={index} value={dict.id}>{dict.realName}</MenuItem>) })}
      </Select>
    </FormControl>}

    {!selectCourse && <FormControl sx={{ m: 1, minWidth: 120, width: '100%' }}>
      <TextField
        id="outlined-password-input"
        label="备注"
        size="small"
        value={courseEdit.descript}
        onChange={(e) => {
          let after = { ...courseEdit, descript: e.target.value }
          setCourseEdit(after)
        }}
      />
    </FormControl>}


    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormControl sx={{ m: 1, minWidth: 120, width: '100%' }} size="small">
        <DateTimePicker
          label="开始时间"
          value={startTime}
          onChange={(newValue) => {
            console.log("🚀 ~ file: additions.tsx ~ line 665 ~ Additions ~ newValue", newValue)
            let after = { ...courseEdit, startTime: newValue }
            setStartTime(newValue)
            let diff = moment(after.endTime, 'YYYY-MM-DD HH:mm').diff(moment(after.startTime, 'YYYY-MM-DD HH:mm'), 'minutes')
            if(diff<=60){
              diff=1
            }else if(diff<=90){
              diff=1.5
            }else if(diff<=120){
              diff=2
            }      else if(diff<=180){
              diff=2.5
            }
            after = { ...courseEdit, spendingTime: diff }
            console.log("🚀 ~ file: additions.tsx ~ line 665 ~ Additions ~ diff", diff)
            setCourseEdit(after)
          }}
          renderInput={(params) => {
            return (<TextField {...params} />)
          }}
        />
      </FormControl>
    </LocalizationProvider>

    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormControl sx={{ m: 1, minWidth: 120, width: '100%' }} size="small">
        <DateTimePicker
          label="结束时间"
          value={endTime}
          onChange={(newValue) => {
            let after = { ...courseEdit, endTime: newValue }
            let diff = moment(after.endTime, 'YYYY-MM-DD HH:mm').diff(moment(after.startTime, 'YYYY-MM-DD HH:mm'), 'minutes')
            setEndTime(newValue)
            console.log("🚀 ~ file: additions.tsx ~ line 678 ~ Additions ~ diff", diff)
            if(diff<=60){
              diff=1
            }else if(diff<=90){
              diff=1.5
            }else if(diff<=120){
              diff=2
            }      else if(diff<=180){
              diff=2.5
            }
            after = { ...courseEdit, spendingTime: diff }
            setCourseEdit(after)
          }}
          renderInput={(params) => <TextField {...params} />}
        />

      </FormControl>
    </LocalizationProvider>
    {!selectCourse && <FormControl sx={{ m: 1, minWidth: 120, width: '100%' }}  >
      <Autocomplete
        sx={{ width: 350, }}
        disablePortal
        size="small"
        id="combo-box-demo"
        value={memberValue}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        onChange={(event: any, newValue: string | null) => {
          console.log("🚀 ~ file: additions.tsx ~ line 589 ~ Additions ~ newValue", newValue)
          // appendArr( find(users, { 'prepaidCard': newValue }))
          if (newValue) {
            appendArr(newValue)
          }
        }}
        options={userOptions}

        renderInput={(params) => <TextField {...params} label="添加学员" />}
      />
    </FormControl>}

    {labelArr.map((value, index) => memberItem(value, index))}

    {!selectCourse && <FormControl sx={{ m: 1, width: '100%' }} >
      <Button variant="contained" size="small" startIcon={<AutoAwesomeMotionIcon />}
        onClick={() => {
          console.log("🚀 ~ file: additions.tsx ~ line 310 ~ Additions ~  standardDateValue,uploadFiles", courseEdit)
          dispatch(createCard(courseEdit))
        }}>
        确认添加
      </Button>

    </FormControl>}

    {selectCourse && (<FormControl sx={{ m: 1, width: '100%' }} >
      <Button variant="contained" size="small" startIcon={<AutoAwesomeMotionIcon />}
        onClick={() => {
        }}>
        确认修改
      </Button>

    </FormControl>)}
    {selectCourse && (<FormControl sx={{ m: 1, width: '100%' }} >
      <Button variant="outlined" size="small" startIcon={<HighlightOffIcon />}
        onClick={() => {
          dispatch(selectCourseAction(null))
        }}>
        取消
      </Button>

    </FormControl>)}





  </Stack>)



  //  {scenseSetDialog}
  return (<>


    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={5}
      sx={{ height: '100%', width: '15%', minWidth: '400px', paddingRight: '30px', paddingLeft: '30px', paddingTop: 5, overflowY: 'auto', background: '#f5f6fa' }}
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