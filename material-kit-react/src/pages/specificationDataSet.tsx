/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-11-29 17:47:48
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-03-29 13:47:50
 * @content: 数据集详情页面
 */

import React, { useEffect, useState, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
import { RemoveRedEye as Preview, FavoriteBorderSharp, FavoriteRounded, Publish as Publish } from '@mui/icons-material';
import { BrowserRouter, Routes, Route, useNavigate, Link, useLocation, Navigate, Outlet, useParams } from 'react-router-dom';
import { Box, Button, Modal, ModalUnstyled, Card, Tabs, Tab, Fade, CardMedia, Paper, Stack, Backdrop, CircularProgress, TextField, Typography, Select, MenuItem, Divider, FormControl, InputLabel, Input, FormControlLabel, Switch } from '@mui/material';
import { styled, ThemeProvider } from '@mui/material/styles';
import { dsTheme } from '../common/theme';
import useStyles from '../common/styles';
import DsReviews from "../components/createDs/dsReviews";
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import DsDataDisplayTab from "../components/dsDetail/dsDataDisplayTab";
import DsDiscussionTab from "../components/dsDetail/dsDiscussionTab";
import DsBranchesTab from "../components/dsDetail/dsBranchesTab";
import DsDiffTab from "../components/dsDetail/dsDiffTab";
import { datasetById, datasetFavorate } from '../store/actions/dsExploreActions'
import { useSelector } from "../redux/hooks";
import { publishAction, auditAction, publishClearAction } from '../store/slices/publishSlice'
import { useSnackbar } from 'notistack';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { clearDatasetFilesCache,folderAsyncStatusAction } from "../store/actions/filesAndFoldersActions"
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import Chip from '@mui/material/Chip';
import ErrorIcon from '@mui/icons-material/Error';
import { truncate } from 'lodash'
import imgUrl from '../assert/pexel.jpeg'
import CommitIcon from '@mui/icons-material/Commit';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';


interface folderModal {
  open: boolean;
  title?: string;
  subtitle?: string;
  callback?: Function;
  auditStatus?: number;
  auditRefusedReason?: string;
}

const SpecificationDataSet = () => {
  const inputRef = useRef();
  const AUTO_HIDE_DURATION = 3000
  const [auditText, setAuditText] = React.useState('');
  const [openParams, setOpen] = React.useState<folderModal>({ open: false });
  const [auditParams, setAudit] = React.useState<folderModal>({ open: false });
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch()
  const { datasetId } = useParams()
  const navigate = useNavigate()
  const classes = useStyles();
  const location = useLocation()
  // const [ds, setDs] = useState(location.state)
  const [ds, setDs] = useState(null)
  const { loading, datasets, needRefresh,loadError:exploreError } = useSelector((state) => state.dsExplore)
  const { errorMsg, loadError, isSuccess } = useSelector((state) => state.publish)
  const { datasetInfo } = useSelector((state) => state.inSensitive)
  let auditContent = ''
  useEffect(() => {
    dispatch(clearDatasetFilesCache())
    dispatch(datasetById(datasetId))
    return () => {
      dispatch(clearDatasetFilesCache())
      dispatch(publishClearAction())
    }
  }, [])

  useEffect(() => {
    if(exploreError){
      navigate('/explore')
      return 
    }
    if (loadError) {
      enqueueSnackbar(errorMsg, {
        variant: 'error',
        autoHideDuration: 3000
      });
    }
    if (isSuccess) {
      enqueueSnackbar('The dataSet has been updated ', {
        variant: 'success',
        autoHideDuration: 3000,
      });
      dispatch(datasetById(datasetId))
    }

  }, [loadError, isSuccess,exploreError])

  useEffect(() => {
    if (ds === null && datasets.length === 0) {
      dispatch(datasetById(datasetId))
    } else if (datasets.length > 0) {
      if (datasets[0]) {
        setDs(datasets[0])
      } else {
        navigate('/explore')
      }
    }
    if (needRefresh) {
      dispatch(datasetById(datasetId))
    }
  }, [datasets, needRefresh, ds])

  useEffect(() => {
    setDs(datasetInfo)
  }, [datasetInfo])


  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '0px solid #000',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };


  const fileNameModal = (
    <Modal
      open={openParams.open}
      onClose={() => { setOpen({ open: false }) }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Stack
          direction="column"
          justifyContent="space-around"
          alignItems="center"
          spacing={3}>
          <Typography id="modal-modal-title" variant="body2" component="div">
            {openParams.title}
          </Typography>
          <Typography id="modal-modal-title" variant="body2" component="div">
            {openParams.subtitle}
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            spacing={3}>
            <Button variant="contained" size="small" onClick={() => { openParams.callback(1) }}>Develop</Button>
            <Button variant="contained" size="small" onClick={() => { openParams.callback(2) }}>Release</Button>
            <Button variant="outlined" size="small" onClick={() => { setOpen({ open: false }) }}>Cancel</Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  )


  const auditModal = (
    <Modal
      open={auditParams.open}
      onClose={() => { setOpen({ open: false }) }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Stack
          direction="column"
          justifyContent="space-around"
          alignItems="center"
          spacing={3}>
          <Typography id="modal-modal-title" variant="body2" component="div">
            {auditParams.title}
          </Typography>
          <TextField
            id="outlined-password-input"
            label="Refuse Reason"
            value={auditText}
            inputRef={inputRef}
            size="small"
            onChange={(e) => {
              setAuditText(e.target.value);
              auditContent = e.target.value
            }}
          />
          <Stack
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            spacing={3}>
            <Button variant="contained" size="small" color="warning" onClick={() => { auditParams.callback() }}>Release</Button>
            <Button variant="outlined" size="small" onClick={() => { setAudit({ open: false }) }}>Cancel</Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  )



  const RadiusButton = styled(Button)({ borderRadius: '20px', })
  const [favor, setFavor] = React.useState(0);
  const FontTypo = styled(Typography)({
    fontFamily: 'Tahoma, sans-serif'
  })
  const [value, setValue] = React.useState('data');
    const {userInfo} = useSelector((state) => state.users)

    
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    dispatch(clearDatasetFilesCache())
    setValue(newValue);
  };
  return (
    <ThemeProvider theme={dsTheme}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Stack
        direction="column"

        justifyContent="center"
        alignItems="flex-start"
        spacing={1}
        sx={{ width: '70%', marginLeft: '-10px' }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={1}
          className={classes.dsMarginTop}
          sx={{ width: '100%' }}>
          <Stack
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            spacing={3}
          >
            <CardMedia
              component="img"
              sx={{
                width: '150px', height: '100px', borderRadius: 1
              }}
              src={ds && ds.coverImg ? ds.coverImg : imgUrl}
              alt="random"
            />
            <Stack
              direction="column"
              justifyContent="space-around"
              alignItems="flex-start"
              spacing={2}
            >
              <Typography variant="h6" sx={{
                fontFamily: 'Tahoma, sans-serif'
              }}>
                {ds ? ds.dataSetName : ''}
              </Typography>
              <Typography variant="body1" sx={{
                fontFamily: 'Tahoma, sans-serif'
              }}>
                {ds ? ds.dataSetSubName : ''}
              </Typography>
              <Typography variant="subtitle2" sx={{
                fontFamily: 'Tahoma, sans-serif'
              }}>
                created by {ds ? ds.creatorFullName || ds.creator : ''}

              </Typography>

            </Stack>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-around"
            alignItems="flex-start"
            spacing={2}
          >

            {ds && (
              <Tooltip title={ds && ds.tag ? ds.tag : ds.dataVersion} placement="top">

                <Chip variant="outlined" icon={<CommitIcon />} label={ds && typeof ds.dataVersion !== 'undefined' ? truncate(ds.tag || `#${ds.dataVersion}` || '', {
                  'length': 12,
                  'omission': '..'
                }) : ''} />
              </Tooltip>
            )}


            {ds && ds.auditRefusedReason ? (<Tooltip title={ds ? ds.auditRefusedReason : ''} placement="top">
              <Chip icon={<ErrorIcon />} label={ds ? truncate(ds.auditRefusedReason || '', {
                'length': 12,
                'omission': '..'
              }) : ''} />
            </Tooltip>) : null}


            {ds &&  ds.auditStatus === 0  ? (<Tooltip title={ds.dataSetStatus===0?'draft':'auditting'} placement="top">
              <Chip icon={<PrivacyTipIcon />} label={ds ? truncate(ds.auditRefusedReason || '', {
                'length': 1,
                'omission': ''
              }) : ''} />
            </Tooltip>) : null}

            {userInfo && userInfo.roles.indexOf('admin') > -1 && ds && ds.auditStatus !== 1 && ds.dataSetStatus !== 0 ? (
              <RadiusButton variant="contained" startIcon={<BookmarkAddedIcon />} size="small"
                onClick={() => {
                  dispatch(auditAction({ datasetId, auditStatus: 1, auditRefusedReason: '' }))
                }}
              >
                Audit
              </RadiusButton>
            ) : null}
            {userInfo && userInfo.roles.indexOf('admin')>-1 &&ds && ds.auditStatus !== 1 && ds.dataSetStatus !== 0 ? (
              <RadiusButton variant="contained" color="warning" startIcon={<BookmarkAddedIcon />} size="small"
                onClick={() => {
                  setAudit({
                    open: true,
                    subtitle: '',
                    title: 'Submit message if dataSet need to be updated  ',
                    callback: () => {
                      dispatch(auditAction({ datasetId, auditStatus: 2, auditRefusedReason: inputRef.current.value }))
                      setAudit({ open: false })
                      dispatch(folderAsyncStatusAction(datasetId))
                    }
                  })

                }}
              >
                Refuse
              </RadiusButton>
            ) : null}
            {ds && ds.dataSetStatus === 0 ? (
              <RadiusButton variant="contained" startIcon={<Publish />} size="small"
                onClick={() => {
                  // dispatch(publishAction({ datasetid, dataSetStatus: 1 }))
                  setOpen({
                    open: true,
                    subtitle: 'Choice publish status',
                    title: 'Be sure that once published ,it can not be withdrawn ',
                    callback: (dataSetStatus) => {
                      dispatch(publishAction({ datasetId, dataSetStatus }))
                      setOpen({ open: false })
                    }
                  })

                }}
              >
                Publish
              </RadiusButton>
            ) : null}
            {ds && ds.dataSetStatus === 0 ? (<RadiusButton variant="contained" startIcon={<InsertDriveFileIcon />} size="small"
              onClick={() => {
                navigate(`/edit/${datasetId}`, { state: { ds, modified: ds.family.length > 1 } })
              }}
            >
              Edit
            </RadiusButton>) : null}
            <RadiusButton variant="outlined" startIcon={<Preview />} size="small">
              Usages | {ds ? ds.visitCount : '-'}
            </RadiusButton>
            <RadiusButton variant="outlined" startIcon={(ds ? ds.favourite : false) ? <FavoriteRounded /> : <FavoriteBorderSharp />} size="small"
              onClick={() => { dispatch(datasetFavorate(datasetId, !ds.favourite)) }}>
              Favorites | {ds ? ds.favouriteCount : '-'}
            </RadiusButton>
          </Stack>

        </Stack>

        {fileNameModal}
        {auditModal}
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="data" label="Data" />
          <Tab value="discussion" label="Discussion" />
          <Tab value="branch" label="Branches" />
          {ds && ds.statistic ? <Tab value="diff" label="Diff" /> : null}
        </Tabs>
        <Divider variant="fullWidth" sx={{ width: '100%', marginTop: '0 !important' }} ></Divider>
        {value === 'data' ? (<DsDataDisplayTab content={ds ? ds.dataSetDescribe : ''} ds={ds} />) : value === 'discussion' ? (<DsDiscussionTab />) : value === 'branch' ? (<DsBranchesTab ds={ds} />) : (<DsDiffTab ds={ds} />)}

      </Stack >
    </ThemeProvider>
  )
}

export default SpecificationDataSet