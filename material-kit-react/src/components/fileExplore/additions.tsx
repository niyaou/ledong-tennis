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
import { exploreUsersAction, exploreRecentCourse, selectCourse as selectCourseAction, createCard, updateCourese } from '../../store/slices/dominationSlice'
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

  const { areas, users, selectCourse, createSuccess, coach, court } = useSelector((state) => state.domination)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [startTime, setStartTime] = React.useState(new Date());
  const [endTime, setEndTime] = React.useState(new Date);

  const [courseEdit, setCourseEdit] = React.useState({
    startTime: new Date(), endTime: new Date(), coach: '', spendingTime: 1, courtSpend: 0, coachSpend: 0, descript: '',
    court: '', courseType: 0, membersObj: null, isAdult: 1
  });



  const dispatch = useDispatch()
  const { folders, cacheTree, rootPath, searchActive, nodeSelected, searchParams,
    mergeActive, currentIndex, labelStatistic, successed, errorMsg: indexErrorMsg,
    searchMoveStatus, exploreMode } = useSelector((state) => state.filesAndFolders)
  const { tags, scenes } = useSelector((state) => state.tagsInfo)
  const { errorMsg, isSuccess } = useSelector((state) => state.uploadFiles)


  const [currentNodeSelected, setCurrentNodeSelected] = React.useState();

  const [userOptions, setUserOptions] = React.useState([]);

  const [memberValue, setMemberValue] = React.useState<string | null>('');
  const [inputValue, setInputValue] = React.useState('');

  useEffect(() => {

    if (users && users.length > 0) {
      setUserOptions(users.map(u => u.name))
    }

  }, [users])

  useEffect(() => {
    if (createSuccess) {
      enqueueSnackbar(`课程操作成功`, {
        variant: 'success',
        autoHideDuration: 3000,
      })
    }
    console.log("🚀 ~ file: additions.tsx ~ line 182 ~ useEffect ~ courseEdit", courseEdit)
    dispatch(exploreRecentCourse({
      pageNum: 1, startTime: moment().subtract(45, 'days').startOf('month').format('YYYY-MM-DD hh:mm:ss'),
      endTime: moment().endOf('month').format('YYYY-MM-DD hh:mm:ss')
    }))

  }, [createSuccess])

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








  useEffect(() => {
    if (searchMoveStatus) {
      enqueueSnackbar(`${searchMoveStatus.processMsg},请稍后刷新页面查看`, {
        variant: 'warning',
        autoHideDuration: 3000,
      })
    }

  }, [searchMoveStatus])





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
  }, [errorMsg, isSuccess])





  const memberItem = (m, idx) => {
    let mi = find(users, { 'name': m.name })
    console.log('------memberItem----', m)
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
        {mi.name}
      </Typography>
      {/* {m.type !== 1 && <Typography variant="subtitle1"
        id="outlined-password-input"
        color='secondary'
      >
        {m.type === 2 ? '扣次卡一次' : '年卡'}
      </Typography>} */}

      {m.type === 1 && <TextField
        id="outlined-password-input"
        label="课时费"
        size="small"
        sx={{ width: '100px' }}
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        value={m.spendFee}
        onChange={(e) => {
          labelArr[idx].spendFee = parseInt(e.target.value || 0)
          let a = labelArr.concat()
          setLabelArr(a)
          let member = courseEdit.membersObj
          member[mi.number] = [parseInt(e.target.value), 0, 0, 0, labelArr[idx].quantities]
          let after = { ...courseEdit, membersObj: member }

          setCourseEdit(after)
        }}
      />}


      {m.type === 2 && <TextField
        id="outlined-password-input"
        label="扣次卡"
        size="small"
        sx={{ width: '100px' }}
        inputProps={{ inputMode: 'numeric', }}
        value={m.times}
        onChange={(e) => {
          let pos = labelArr.findIndex(e => e.name === m.name)
          labelArr[pos].type = 2
          labelArr[pos].spendFee = 0
          labelArr[pos].times = parseFloat(e.target.value || 0).toFixed(1);

          let member = courseEdit.membersObj
          member[mi.number] = [0, parseFloat(e.target.value).toFixed(1), 0, labelArr[pos].perTime, labelArr[pos].quantities]
          let after = { ...courseEdit, membersObj: member }
          let a = labelArr.concat()
          setLabelArr(a)
          setCourseEdit(after)
        }}
      />}

      {m.type === 3 && <TextField
        id="outlined-password-input"
        label="扣年
        卡"
        size="small"
        sx={{ width: '100px' }}
        inputProps={{ inputMode: 'numeric', }}
        value={m.annualTimes}
        onChange={(e) => {

          let pos = labelArr.findIndex(e => e.name === m.name)
          labelArr[pos].type = 3
          labelArr[pos].spendFee = 0
          labelArr[pos].times = 0
          labelArr[pos].annualTimes = parseFloat(e.target.value || 0).toFixed(1);

          let member = courseEdit.membersObj
          member[mi.number] = [0, 0, parseFloat(e.target.value).toFixed(1), labelArr[pos].perTime, labelArr[pos].quantities]
          let after = { ...courseEdit, membersObj: member }
          let a = labelArr.concat()
          setLabelArr(a)
          setCourseEdit(after)
        }}
      />}

      {m.type !== 1 && <TextField
        id="outlined-password-input"
        label="单价"
        size="small"
        sx={{ width: '100px' }}
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        value={m.perTime}
        onChange={(e) => {

          let pos = labelArr.findIndex(e => e.name === m.name)


          labelArr[pos].perTime = parseInt(e.target.value || 0)

          let member = courseEdit.membersObj
          member[mi.number][3] = parseInt(e.target.value)
          let after = { ...courseEdit, membersObj: member }
          let a = labelArr.concat()
          setLabelArr(a)
          setCourseEdit(after)
        }}
      />}
      <TextField
        id="outlined-password-input"
        label="人数"
        size="small"
        sx={{ width: '100px' }}
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        value={m.quantities}
        onChange={(e) => {

          let pos = labelArr.findIndex(e => e.name === m.name)


          labelArr[pos].quantities = parseInt(e.target.value || 0)

          let member = courseEdit.membersObj
          member[mi.number][4] = parseInt(e.target.value)
          let after = { ...courseEdit, membersObj: member }
          let a = labelArr.concat()
          setLabelArr(a)
          setCourseEdit(after)
        }}
      />
      {m.type !== 1 && <Tooltip title={'课时费'} placement="top">

        <IconButton
          aria-label="expand row"
          size="small"
          onClick={async () => {
            let pos = labelArr.findIndex(e => e.name === m.name)
            labelArr[pos].type = 1
            let a = labelArr.concat()
            setLabelArr(a)

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
            member[mi.number] = [0, 1, 0, 0,1]
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
            member[mi.number] = [0, 0, 1, 0,1]
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
    console.log('-------', item)
    let ids = labelArr.findIndex(e => e.name === item)
    if (ids >= 0) {
      console.log('---exit duplicate item----', item)
      return
    }
    let member = users.find(u => u.name === item)
    labelArr.push({ name: item, type: 1, spendFee: 0, times: 0, annualTimes: 0, perTime: 0, quantities: 1 })
    let a = labelArr.concat()
    let temp = {}
    temp = Object.assign(temp, {
      [member.number]: [0, courseEdit.spendingTime, 0, 0]
    })
    let after = { ...courseEdit, membersObj: { ...courseEdit.membersObj, ...temp } }

    setCourseEdit(after)

    setLabelArr(a)

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
    {!selectCourse && <FormControl sx={{ width: '100%', }}>
      <InputLabel id="demo-controlled-open-select-label1">校区</InputLabel>
      <Select label="FileTypes" labelId="demo-controlled-open-select-label12"
        name='FileTypes'
        size="small"
        onChange={(e) => {
          let after = { ...courseEdit, court: e.target.value }
          setCourseEdit(after)
        }}
        value={[courseEdit.court]}>
        {court && court.map((dict, index) => { return (<MenuItem key={`select2-${dict.name}`} value={dict.name}>{dict.name}</MenuItem>) })}
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
        {coach && coach.map((dict, index) => { return (<MenuItem key={`select-${dict.number}`} value={dict.number}>{dict.name}</MenuItem>) })}
      </Select>
    </FormControl>}

    <FormControl sx={{ width: '100%', }}>
      <InputLabel id="demo-controlled-open-select-label1">课时类型</InputLabel>
      <Select label="FileTypes" labelId="demo-controlled-open-select-label12"
        name='FileTypes'
        size="small"
        onChange={(e) => {
          let after = { ...courseEdit, courseType: e.target.value }
          console.log('----课时类型---', after)
          setCourseEdit(after)
        }}
        value={[courseEdit.courseType]}>
        {['体验课未成单', '体验课成单', '订场', '班课', '私教'].map((dict, index) => { return (<MenuItem key={`courseType-${dict}`} value={index - 2}>{dict}</MenuItem>) })}
      </Select>
    </FormControl>

    <FormControl sx={{ width: '100%' }}>
      <InputLabel>课程类型</InputLabel>
      <Select
        value={courseEdit.isAdult}
        onChange={(e) => {
          let after = { ...courseEdit, isAdult: e.target.value };
          setCourseEdit(after);
        }}
      >
        <MenuItem value={1}>成人课程</MenuItem>
        <MenuItem value={0}>儿童课程</MenuItem>
      </Select>
    </FormControl>




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
            if (diff <= 60) {
              diff = 1
            } else if (diff <= 90) {
              diff = 1.5
            } else if (diff <= 120) {
              diff = 2
            } else if (diff <= 150) {
              diff = 2.5
            } else {
              diff = 3
            }
            after = { ...courseEdit, spendingTime: diff, startTime: newValue }
            console.log("🚀 ~ file: additions.tsx ~ line 665 ~ Additions ~ diff", diff, after)
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
            if (diff <= 60) {
              diff = 1
            } else if (diff <= 90) {
              diff = 1.5
            } else if (diff <= 120) {
              diff = 2
            } else if (diff <= 150) {
              diff = 2.5
            } else {
              diff = 3
            }
            after = { ...courseEdit, spendingTime: diff, endTime: newValue }
            console.log("🚀 ~ file: additions.tsx ~ line 665 ~ Additions ~ diff", diff, after)
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
          let diff = courseEdit.spendingTime
          if (diff > 3) {
            if (diff <= 60) {
              diff = 1
            } else if (diff <= 90) {
              diff = 1.5
            } else if (diff <= 120) {
              diff = 2
            } else if (diff <= 180) {
              diff = 2.5
            } else {
              diff = 3
            }
            courseEdit.spendingTime = diff
          }
          
          console.log("🚀 ~ file: additions.tsx ~ line 310 ~ Additions ~  standardDateValue,uploadFiles", courseEdit)
          dispatch(createCard(courseEdit))
        }}>
        确认添加
      </Button>

    </FormControl>}

    {selectCourse && (<FormControl sx={{ m: 1, width: '100%' }} >
      <Button variant="contained" size="small" startIcon={<AutoAwesomeMotionIcon />}
        onClick={() => {

          console.log("🚀 ~ file: additions.tsx ~ line 310 ~ Additions ~  standardDateValue,uploadFiles", selectCourse, startTime, endTime)
          dispatch(updateCourese({ courseId: selectCourse.id, startTime: startTime, endTime: endTime }))
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
      sx={{ height: '100%', width: '15%', minWidth: '500px', paddingRight: '30px', paddingLeft: '30px', paddingTop: 5, overflowY: 'auto', background: '#f5f6fa' }}
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