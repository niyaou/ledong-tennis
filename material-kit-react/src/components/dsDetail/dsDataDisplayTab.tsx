/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-17 11:19:45
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-03-30 13:31:43
 * @content: edit your page content
 */
import { Box, Button, Card, CardContent, Grow, Stack, Typography, Tooltip, Modal, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { styled, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import DataFolderExplore from '../fileExplore/folderExploreComponent';
import MetaDisplay from './metaDisplay';
import { connect, useDispatch } from 'react-redux';
import Collapse from '@mui/material/Collapse';
import { createThemes } from '../../common/theme';
import DownloadIcon from '@mui/icons-material/Download';
import IconButton from '@mui/material/IconButton';
import FilePresentRoundedIcon from '@mui/icons-material/FilePresentRounded';
import { useSnackbar } from 'notistack';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import { annotationAction } from '../../store/slices/publishSlice'
import { useSelector } from "../../redux/hooks";
import {  folderAsyncStatusAction } from '../../store/actions/filesAndFoldersActions'
export interface State extends SnackbarOrigin {
  open: boolean;
}
interface AnnotModal {
  open: boolean;
  branch?: object;
  callback?: Function;
}


function DsDataDisplayTab(props) {
  const HTTP_DM = process.env.HTTP_DM
  const [openParams, setOpen] = React.useState<AnnotModal>({ open: false });
  let size = function () { return Math.floor(0.5 + Math.random() * 8) * 100 }
  let navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch()
  const content = props.content
  const ds = props.ds
  const user = useSelector((state) => state.users)
  const [dsFiles, setDsFiles] = React.useState(null)
  const [isExpanded, setIsExpanded] = React.useState(false);
  const stepIndex = props.stepIndex
  const currentStepIndex = props.currentStepIndex
  const checked = stepIndex === currentStepIndex
  const [tagText, setTagText] = React.useState('');
  const { errorMsg, loadError, isSuccess, dataSet, loading } = useSelector((state) => state.publish)
  const { folderAsyncStatus } = useSelector((state) => state.inSensitive)
  const [asyncStatus, setAsyncStatus] = React.useState(undefined);
  const [state, setState] = React.useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'right',
  });

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

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  useEffect(() => {
    if (dataSet) {
      setDsFiles(dataSet)
    }
    if (isSuccess) {
      enqueueSnackbar('on going to copy files to destination path', {
        variant: 'success',
        autoHideDuration: 3000,
      })
      setOpen({ ...openParams, open: false, });
      setTagText('');
    }
  }, [dataSet, isSuccess])

  useEffect(() => {
    if (ds) {
      setDsFiles(ds)
      if(!asyncStatus && ds.id){
        dispatch(folderAsyncStatusAction(ds.id))
      }
    }
    if(folderAsyncStatus){
      setAsyncStatus(folderAsyncStatus)
    }
  }, [ds,folderAsyncStatus])


  const annotationModal = (
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
            copy files to folder for creating a new cvat task
          </Typography>
          <TextField
            id="outlined-password-input"
            label="folder name"
            value={tagText}
            onChange={(e) => {
              setTagText(e.target.value);
            }}
          />
          <Stack
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            spacing={3}>
            <Button variant="contained" size="small" disabled={tagText.trim() === ''} onClick={() => {
              dispatch(annotationAction({ id: dsFiles.id, path: tagText.trim() }))
            }}>Submit</Button>
            <Button variant="outlined" size="small" onClick={() => { setOpen({ open: false }) }}>Cancel</Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  )



  const description = (
    <ThemeProvider theme={createThemes}>
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        sx={{ width: '100%' }}
      >
        <Button disabled variant='outlined' fullWidth>Description</Button>
        <Card sx={{ width: '100%' }}>
          <CardContent>
            <Collapse in={isExpanded} collapsedSize={500}>
              <span dangerouslySetInnerHTML={{ __html: content }} />
            </Collapse>
            <Button variant="text" fullWidth type="submit" color="secondary" sx={{ color: 'rgba(0, 0, 0, 0.26)' }} onClick={() => {
              setIsExpanded(!isExpanded);
            }}>{isExpanded ? 'collapse' : 'expand'}</Button>

          </CardContent>
        </Card>
      </Stack>
    </ThemeProvider>)

  const download = (<Card variant="outlined" sx={{ width: '100%', }}> <CardContent >
    <Stack
      direction="row"
      justifyContent="space-evenly"
      alignItems="center"
      spacing={0}
    >
      <Tooltip title={'you can archive the dataSet files by the path provided'} placement="top">
        <Typography variant="subtitle1" component="div" sx={{ cursor: 'help' }}>
          Mount Path
        </Typography>
      </Tooltip>
      <Tooltip title={'paste path to clipboard'} placement="top">
        <Typography variant="body2" component="div" sx={{ cursor: 'pointer' }}
          onClick={async () => {
            navigator.clipboard.writeText(dsFiles.dataSetRootPath)
            const text = await navigator.clipboard.readText();
            setState({ ...state, open: true, });
          }}>
          {dsFiles && dsFiles.dataSetRootPath}
        </Typography>
      </Tooltip>
      <Tooltip title={'paste path to clipboard'} placement="top">
        <IconButton
          aria-label="expand row"
          size="small"
          onClick={async () => {
            navigator.clipboard.writeText(dsFiles.dataSetRootPath)
            const text = await navigator.clipboard.readText();
            setState({ ...state, open: true });
          }}
        >
          <FilePresentRoundedIcon />
        </IconButton>
      </Tooltip>

      {user.userInfo.applicationStatus.download.status===2 ? ds && (ds.isZip ? (<Tooltip title={'download this dataSet'} placement="top">
        <a href={`${HTTP_DM}/dataSet/file/tree/downzip/${ds.id}?acceptToken=${user.userInfo.token}`} download>
          <IconButton
            aria-label="expand row"
            size="small"
          >
            <DownloadIcon />
          </IconButton>
        </a>
      </Tooltip>) : (<IconButton
        aria-label="expand row"
        size="small"
        onClick={() => {
          enqueueSnackbar(`正在压缩数据集文件，请稍后刷新页面再试`, {
            variant: 'warning',
            autoHideDuration: 3000,
          })
        }
        }
      >
        <DownloadIcon />
      </IconButton>)):(  <Typography variant="subtitle1" component="div" sx={{ cursor: 'pointer' }}
      onClick={() => { 
        navigate(`/permission`)
      }}>
        apply for download
      </Typography>)}


      <Typography variant="subtitle1" component="div">
        &nbsp;
      </Typography>
      <Typography variant="subtitle1" component="div">
        &nbsp;
      </Typography>
      <Typography variant="subtitle1" component="div">
        &nbsp;
      </Typography>
      <Typography variant="subtitle1" component="div">
        &nbsp;
      </Typography>
      {dsFiles && (dsFiles.dataSetLabelPath ? (<Tooltip title={'you can create an annotation task in cvat  by the path provided'} placement="top">
        <Typography variant="subtitle1" component="div" sx={{ cursor: 'help' }}>Annotation Files Path</Typography></Tooltip>) : (
        <Tooltip title={'copy files to annotation dictionary for creating cvat annotation task'} placement="top">
          <Typography variant="body2" component="div" sx={{ cursor: 'pointer' }}
            onClick={async () => {
              // navigator.clipboard.writeText(dsFiles.dataSetRootPath)
              // const text = await navigator.clipboard.readText();
              // setState({ ...state, open: true, });
              setOpen({ open: true })
            }}>
            click here to create annotation dictionary
          </Typography>
        </Tooltip>))}


      <Tooltip title={'paste path to clipboard'} placement="top">
        <Typography variant="body2" component="div" sx={{ cursor: 'pointer' }}
          onClick={async () => {
            navigator.clipboard.writeText(dsFiles.dataSetRootPath)
            const text = await navigator.clipboard.readText();
            setState({ ...state, open: true });


          }}>
          {dsFiles && dsFiles.dataSetLabelPath}
        </Typography>
      </Tooltip>


    </Stack>
  </CardContent>
  </Card >)

  const fileExplore = (<><DataFolderExplore ds={dsFiles} folderAsyncStatus={asyncStatus} /></>)

  return (<Grow in={checked}>
    <Box sx={{ minWidth: 1200, width: '100%' }} >

      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center">

        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ width: '100%', height: '50%', marginTop: '2%', mb: '10%' }}
          spacing={3}>

          <Card variant="outlined" sx={{ width: '100%', }}><MetaDisplay ds={ds || {}} /></Card>
          {annotationModal}
          {dsFiles && dsFiles.dataSetStatus !== 0 && download}
          {description}
          {fileExplore}
        </Stack>
      </Stack>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={state.open}
        autoHideDuration={2000}
        onClose={handleClose}
        message="pasted to clipboard"
        key={'top-center'}
      />
    </Box>

  </Grow>)
}
export default DsDataDisplayTab