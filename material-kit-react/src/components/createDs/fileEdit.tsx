/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-17 11:19:45
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-01 15:09:15
 * @content: edit your page content
 */
import { Button, Card, Fade, Modal, Box, FormControl, Input, InputLabel, MenuItem, IconButton, Select, Stack, TextField, Typography, Grow } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { Field, Form } from 'react-final-form';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import ReactWEditor from 'wangeditor-for-react';
import Draggable, { DraggableCore } from 'react-draggable';
import FsResourceManagement from './fsResourseManagement'
import { useSelector } from "../../redux/hooks";
import { datasetById, datasetFavorate } from '../../store/actions/dsExploreActions'
import { submitDatasetFiles, uploadFilesAction } from '../../store/actions/filesAndFoldersActions'
import { useDispatch } from 'react-redux';
import { styled } from '@mui/material/styles';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import SendIcon from '@mui/icons-material/Send';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { clearDatasetFilesCache } from "../../store/actions/filesAndFoldersActions"
import { useSnackbar } from 'notistack';
interface FormValues {
  username?: string;
  password?: string;
}





function FilesEdit(props) {
  const maxFileCount = 20
  const maxFileLength = 1024 * 1024 * 1024 * 5
  const [uploadFiles, setUploadFiles] = useState([])
  const [canExtract, setCanExtract] = useState(false)
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch()
  let navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const skip = props.skip
  const datasetId = props.datasetId
  const done = props.done
  const stepIndex = props.stepIndex
  const currentStepIndex = props.currentStepIndex
  const checked = stepIndex === currentStepIndex
  const { currentSelectFolderTree, loading, postFilesSuccess, errorMsg, uploadSuccess, folderAsyncStatus } = useSelector((state) => state.inSensitive)
  const [dataSetInfo, setDataSetInfo] = React.useState(null)
  const { datasets } = useSelector((state) => state.dsExplore)
  const usePrevious = (value: any) => {
    const ref = useRef()
    useEffect(() => {
      ref.current = value
    })
    return ref.current
  }

  useEffect(() => {
    if (datasets.length > 0) {
      if (datasets[0]) {
        setDataSetInfo(datasets[0])
      }
    }
  }, [datasets])

  const preDataSetInfo = usePrevious(dataSetInfo)

  useEffect(() => {
    if (preDataSetInfo && dataSetInfo && typeof dataSetInfo.id !== 'undefined' && preDataSetInfo.id !== dataSetInfo.id) {
      dispatch(datasetById(dataSetInfo.id))
    }
  }, [dataSetInfo])






  useEffect(() => {
    if (postFilesSuccess) {
      done()
    }
  }, [currentSelectFolderTree, postFilesSuccess])


  useEffect(() => {
    setOpen(loading)
  }, [loading])


  useEffect(() => {
    if (uploadSuccess) {
      setCanExtract(false)
      setUploadFiles([])
      if(folderAsyncStatus.warningMsg!==''){
        enqueueSnackbar(folderAsyncStatus.warningMsg, {
          variant: 'warning',
          autoHideDuration: 3000,
        })
      }else{
        enqueueSnackbar('files update success', {
          variant: 'success',
          autoHideDuration: 3000,
        })
      }
    }
  }, [uploadSuccess])

  useEffect(() => {
    if (uploadFiles.length === 1 && uploadFiles[0].type.indexOf('zip') > -1) {
      setCanExtract(true)
    } else {
      setCanExtract(false)
    }
  }, [uploadFiles])



  useEffect(() => {
    setOpen(loading)
  }, [loading, errorMsg])


  const onSubmit = (auth: FormValues) => {
  }

  const choiceFiles = (e) => {
    let files = []
    for (let i = 0; i < e.target.files.length; i++) {
      files.push(e.target.files[i])
    }
    let totalSize = files.reduce((totalSize, file) => {
      return totalSize + file.size
    },0)
    let length = files.length

    if (length > maxFileCount) {
      enqueueSnackbar(`upload files must be less than ${maxFileCount}`, {
        variant: 'warning',
        autoHideDuration: 3000,
      })
      return
    }
    if (totalSize > maxFileLength) {
      enqueueSnackbar(`upload files total size must be less than ${Math.floor(maxFileLength/1024/1024/1024)}GB`, {
        variant: 'warning',
        autoHideDuration: 3000,
      })
      return
    }

    // enqueueSnackbar('files update success', {
    //   variant: 'success',
    //   autoHideDuration: 3000,
    // })

    setUploadFiles(e.target.files)
  }

  const Input = styled('input')({
    display: 'none',
  });

  const style = {
    position: 'absolute' as 'absolute',
    top: '70%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'transparent',
    boxShadow: 0,
    p: 4,
  };

  const uploadWaitingModal = (
    <Modal
      open={open}
      onClose={() => { setOpen(false) }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} >
        <Stack
          direction="column"
          justifyContent="space-around"
          alignItems="center"
          spacing={1}>
          {folderAsyncStatus && (<Typography variant="subtitle2" color="secondary"> {folderAsyncStatus.processMsg}</Typography>)}
          <CircularProgress color="secondary" />
        </Stack>
      </Box>
    </Modal>
  )


  return (<Grow in={checked}>
    <Card sx={{ minWidth: 1200, background: '#f4f4f4' }} raised>
      {uploadWaitingModal}
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center">
            <form onSubmit={handleSubmit} >

              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                sx={{ width: 900, height: '50%', marginTop: '7%', mb: '10%' }}
                spacing={2}>

                <Typography variant="button" display="block" gutterBottom>
                  DataSet Files Setting

                </Typography >
                {currentSelectFolderTree ? (<><Typography variant="body2" display="block" gutterBottom>
                  selected folder: {currentSelectFolderTree.root.srcFilePath}
                </Typography >
                  <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={5}>
                    {uploadFiles.length > 0 ? null : (<label htmlFor="contained-button-file">
                      <Input accept="*/*" id="contained-button-file" multiple type="file" onChange={choiceFiles} />
                      <Button variant="contained" component="span" size="small" startIcon={<SendIcon />}
                      >
                        Choice Files
                      </Button>
                    </label>)}
                    <Chip label={uploadFiles.length === 0 ? 'choice upload files' : `${uploadFiles.length}files`} variant="outlined" onDelete={() => {
                      setUploadFiles([])
                    }} />
                  </Stack>
                </>) : null}

                {currentSelectFolderTree && uploadFiles.length > 0 ? (<Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={5}>
                  <Button variant="contained" component="span" startIcon={<SendIcon />}
                    onClick={() => {
                      dispatch(uploadFilesAction(dataSetInfo.id, false, uploadFiles, currentSelectFolderTree.root.id))
                    }}>
                    Upload Files
                  </Button>
                  <Button variant="contained" component="span" color="primary" aria-label="upload picture" startIcon={<FolderZipIcon />}
                    disabled={!canExtract}
                    onClick={() => {
                      dispatch(uploadFilesAction(dataSetInfo.id, true, uploadFiles, currentSelectFolderTree.root.id))
                    }}>
                    Extract Zip
                  </Button>
                </Stack>) : null}


                <FsResourceManagement datasetId={datasetId} />

                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={5}>
                  <Button variant="contained" type="submit" color="secondary" onClick={
                    () => {
                      dispatch(clearDatasetFilesCache())
                      navigate(`/dataset/${dataSetInfo.id}`)
                    }
                  }>done</Button>
                  {/* <Button variant="contained" type="submit" color="primary" onClick={postFiles}>Done</Button> */}
                </Stack>
              </Stack>
            </form>
          </Stack>
        )} />
    </Card>
  </Grow>)
}
export default FilesEdit