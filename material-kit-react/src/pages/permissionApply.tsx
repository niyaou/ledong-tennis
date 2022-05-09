/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-11-29 17:48:11
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-22 14:23:13
 * @content: 首页列表编辑页面
 */
import AddCommentIcon from '@mui/icons-material/AddComment';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardControlKeyIcon from '@mui/icons-material/KeyboardControlKey';
import LastPageIcon from '@mui/icons-material/LastPage';
import Grid from '@mui/material/Grid';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import { Backdrop, Box, Card, CardContent, CardMedia, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import { ThemeProvider } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import imgUrl from '../assert/pexel.jpeg';
import useStyles from '../common/styles';
import { Themes } from '../common/theme';
import { fileLengthFormat, format } from '../common/utils/dateUtils';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Footer from '../components/nav/footer';
import Header from '../components/nav/header';
import { useSelector } from "../redux/hooks";
import Divider from '@mui/material/Divider';
import { add2SortList, getRecommandDataSetAction, openAddDataSetDialog, removeSortOrder, searchDataSetAction, sortDataSetAction, topSortOrder, upSortOrder } from '../store/slices/editListSlice';
import { applyPermission, appliesListAction ,appliesOperateAction} from '../store/actions/usersActions';
import { cloneDeep } from 'lodash'
import Button from '@mui/material/Button';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Check from '@mui/icons-material/Check';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import { styled } from '@mui/material/styles';
import ButtonGroup from '@mui/material/ButtonGroup';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import moment from 'moment';



interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}


function UserAvatar(props: any) {
  const [avatar, setAvatar] = React.useState('');

  const delayGet = () => {
    setTimeout(() => {
      if (localStorage.getItem('cache_request_user_avatar_' + props.userLoginName) !== "loading") {
        let cacheAvatar = localStorage.getItem('cache_user_avatar_' + props.userLoginName)
        setAvatar(cacheAvatar)
      } else {
        delayGet()
      }
    }, 1000)
  }
  useEffect(() => {
    if (props.userLoginName !== '') {
      let cacheAvatar = localStorage.getItem('cache_user_avatar_' + props.userLoginName)
      if (cacheAvatar == null) {
        try {
          // Using an IIFE
          (async function getUserAvatar() {
            if (localStorage.getItem('cache_request_user_avatar_' + props.userLoginName) !== "loading") {
              localStorage.setItem('cache_request_user_avatar_' + props.userLoginName, "loading")
              const res = await Axios.get(`/api/pangoo-usersystem-v2/user?login=${props.userLoginName}`)
              cacheAvatar = res.data.data.content[0].avatar
              localStorage.setItem('cache_user_avatar_' + props.userLoginName, cacheAvatar)
              localStorage.removeItem('cache_request_user_avatar_' + props.userLoginName)
              setAvatar(cacheAvatar)
            } else {
              delayGet()
            }

          })();
        } catch (e) {
          console.error(e)
        }
      } else {
        setAvatar(cacheAvatar)
      }

    }
  }, [props.userLoginName])

  return (
    <Avatar
      alt={props.userLoginName}
      src={avatar}
      sx={{ width: 56, height: 56 }}
    />
  )
}

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
      color: '#784af4',
    }),
    '& .QontoStepIcon-completedIcon': {
      color: '#784af4',
      zIndex: 1,
      fontSize: 18,
    },
    '& .QontoStepIcon-circle': {
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: 'currentColor',
    },
  }),
);

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;
  // <Check className="QontoStepIcon-completedIcon" />
  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <div className="QontoStepIcon-circle" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}


const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
  }),
}));



const steps1 = ['not have permission', 'Approving', 'Access raw files'];
const steps2 = ['not have permission', 'Approving', 'Access Download files'];


function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}



const PermissionApply = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [value, setValue] = React.useState(0);
  const [applies, setApplies] = React.useState([]);
  const { userInfo, loading, errorMsg, loadError, success,appliesList } = useSelector((state) => state.users)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  useEffect(() => {
    if (loadError) {
      enqueueSnackbar(errorMsg, {
        variant: 'error',
        autoHideDuration: 3000,
      });
    }
    if (success) {
      enqueueSnackbar('successed, ', {
        variant: 'success',
        autoHideDuration: 3000,
      });
      if(value===1){
        dispatch(appliesListAction(0, 200))
      }
    }
  }, [loadError, success])


  useEffect(() => {
    if (value === 1) {
      dispatch(appliesListAction(0, 200))
    }
  }, [value])


  return (
    <ThemeProvider theme={
      Themes
    }>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 2 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Header styleTyle={3} />
      <Box sx={{ paddingTop: '75px' }}>
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          spacing={5}
        >
          <Stack direction="row" justifyContent="space-between"
            alignItems="flex-start"
            className={classes.list}
            spacing={2}>
            <Typography variant="h5" sx={{ fontFamily: 'Candara,Calibri,Segoe,Segoe UI,Optima,Arial,sans-serif' }} >
              <IconButton key={"del"} aria-label="delete" color="primary" size="small"   >
                <AddModeratorIcon />
              </IconButton>
              Confidential Files Visit &nbsp; &&  &nbsp; Download privileges</Typography>


          </Stack>
          <Stack direction="column" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ width: '100%' }} >
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{ width: '70%' }}>
              <Tab label="Your privileges" {...a11yProps(0)} />
              {userInfo.roles.indexOf('admin') > -1 && (<Tab label="Applies list" {...a11yProps(1)} />)}

            </Tabs>
            <Divider sx={{ width: '70%' }} />
          </Stack>

          {value === 0 ? (<><Paper sx={{ width: '70%', height: 180 }} variant="outlined" >
            <Stack
              direction="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              spacing={5}
              sx={{ width: '100%', padding: 2 }}
            >
              <Stack
                direction="column"
                justifyContent="flex-start"
                alignItems="flex-start"
                sx={{ width: '100%' }}
                spacing={2}>

                <Typography variant="subtitle1" sx={{ fontFamily: 'Dejavu Sans' }} >
                  <IconButton key={"del"} aria-label="delete" color="info" size="small"   >
                    <FolderSpecialIcon />
                  </IconButton>
                  Confidential Files Visit &nbsp;</Typography>
                <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={2} sx={{ width: '100%' }}>
                  <Typography variant="body2" sx={{ fontFamily: 'Dejavu Sans', color: '#a1a1a1' }} >
                    with this privilege, you can visit raw files which has not been covered by the mask
                  </Typography>
                  <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2} sx={{ width: '100%' }}>

                    <Stepper alternativeLabel activeStep={userInfo.applicationStatus.sensitive.status} connector={<QontoConnector />} sx={{ width: '65%' }}>
                      {steps1.map((label, index) => (
                        <Step key={label}>
                          <StepLabel StepIconComponent={QontoStepIcon}>{label}&nbsp; {index === 2 && userInfo.applicationStatus.sensitive.expiredDate? `${moment(userInfo.applicationStatus.sensitive.expiredDate).fromNow()}` : ''}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                    {userInfo.applicationStatus.sensitive.status !== 0 ? null : (<><Typography variant="body2" sx={{ fontFamily: 'Dejavu Sans', color: '#a1a1a1' }} >
                      Apply the privilege for :
                    </Typography>
                      <ButtonGroup variant="outlined" aria-label="outlined primary button group" size="small">
                        <Button onClick={() => {
                          dispatch(applyPermission(1, 1))
                        }}>1 Day</Button>
                        <Button onClick={() => {
                          dispatch(applyPermission(1, 7))
                        }}>1 Week</Button>
                        <Button onClick={() => {
                          dispatch(applyPermission(1, 30))
                        }}>1 Month</Button>
                      </ButtonGroup></>)}
                  </Stack>
                </Stack>
              </Stack>

            </Stack>
          </Paper>
            <Paper sx={{ width: '70%', height: 180 }} variant="outlined">
              <Stack
                direction="column"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={5}
                sx={{ width: '100%' }}
              >
                <Stack
                  direction="column"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  sx={{ width: '100%', padding: 2 }}
                  spacing={2}>

                  <Typography variant="subtitle1" sx={{ fontFamily: 'Dejavu Sans' }} >
                    <IconButton key={"del"} aria-label="delete" color="info" size="small"   >
                      <CloudDownloadIcon />
                    </IconButton>
                    Download DataSet Files  &nbsp;</Typography>
                  <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={2} sx={{ width: '100%' }}>
                    <Typography variant="body2" sx={{ fontFamily: 'Dejavu Sans', color: '#a1a1a1' }} >
                      with this privilege, you can download dataset files through the browser
                    </Typography>
                    <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2} sx={{ width: '100%' }}>
                      <Stepper alternativeLabel activeStep={userInfo.applicationStatus.download.status} connector={<QontoConnector />} sx={{ width: '65%' }}>
                        {steps2.map((label,index) => (
                          <Step key={label}>
                            <StepLabel StepIconComponent={QontoStepIcon}>{label}&nbsp; {index === 2 && userInfo.applicationStatus.download.expiredDate? `${moment(userInfo.applicationStatus.download.expiredDate).fromNow()}`:''}</StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                      {userInfo.applicationStatus.download.status !== 0 ? null : (<><Typography variant="body2" sx={{ fontFamily: 'Dejavu Sans', color: '#a1a1a1' }} >
                        Apply the privilege for :
                      </Typography>
                        <ButtonGroup variant="outlined" aria-label="outlined primary button group" size="small">
                          <Button onClick={() => {
                            dispatch(applyPermission(0, 1))
                          }}>1 Day</Button>
                          <Button onClick={() => {
                            dispatch(applyPermission(0, 7))
                          }}>1 Week</Button>
                          <Button onClick={() => {
                            dispatch(applyPermission(0, 30))
                          }}>1 Month</Button>
                        </ButtonGroup></>)}
                    </Stack>
                  </Stack>
                </Stack>

              </Stack>





            </Paper></>) : (
            <Grid container spacing={{ xs: 2, md: 3 }} sx={{ width: '75% !important' }}>
              {appliesList && appliesList.map((apply, index) => (
                <Grid item xs={2} sm={4} md={4} key={index}>
                  <Paper sx={{ height: 120 }} variant="outlined">
                    <Stack
                      direction="row"
                      sx={{
                        width: '100%', height: '100%', paddingLeft: 2
                      }}
                      alignItems="center"
                      justifyContent="flex-start"
                      spacing={2}>
                      <UserAvatar userLoginName={apply.creator} />
                      <Stack
                        direction="column"
                        sx={{
                        }}
                        alignItems="flex-start"
                        justifyContent="center"
                        spacing={2}>
                        <Typography variant="body2" >
                          {apply.creatorFullName}
                        </Typography>
                        <Typography variant="body2" >
                        apply {apply.type===0?'download':' raw files'} privilege expired after {apply.effectiveDayNum} days 
                          <ButtonGroup variant="outlined" aria-label="outlined primary button group" size="small">
                            <IconButton aria-label="delete" size="small" onClick={()=>{
                              if(apply){

                                dispatch(appliesOperateAction(apply.id,1))
                              }
                            }}>
                              <CheckCircleIcon fontSize="inherit" color="primary" />
                            </IconButton>
                            <IconButton aria-label="delete" size="small" onClick={()=>{
                              if(apply){
                              dispatch(appliesOperateAction(apply.id,2))
                              }
                            }}>
                              <RemoveCircleIcon fontSize="inherit" color="warning" />
                            </IconButton>
                          </ButtonGroup>
                        </Typography>
        
                      </Stack>

                    </Stack>
                  </Paper>
                </Grid>
              ))}

            </Grid>)}




          <Footer />
        </Stack>
      </Box >
    </ThemeProvider >
  )
}

export default PermissionApply