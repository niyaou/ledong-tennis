/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-17 11:19:45
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-03-28 16:02:27
 * @content: edit your page content
 */
import { Box, Button, Card, CardContent, Tooltip,IconButton, Grow, Select, Stack, Modal, TextField, Typography, Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import React, { useState, useEffect } from 'react';
import DataFolderExplore from '../fileExplore/folderExploreComponent';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import { ExpandCircleDown as ExpandMoreIcon } from '@mui/icons-material';
import { BrowserRouter, Routes, Route, useNavigate, Link, useLocation, Navigate, Outlet, useParams } from 'react-router-dom';
import { styled, ThemeProvider } from '@mui/material/styles';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { connect, useDispatch } from 'react-redux';
import Avatar, { AvatarClasses, AvatarProps } from '@mui/material/Avatar';
import CommitIcon from '@mui/icons-material/Commit';
import moment from 'moment';
import BarChartIcon from '@mui/icons-material/BarChart';
import StorageIcon from '@mui/icons-material/Storage';
import { fileLengthFormat } from '../../common/utils/dateUtils'
import SellIcon from '@mui/icons-material/Sell';
import DeleteIcon from '@mui/icons-material/Delete';
import { dictionary, createDataSet, deleteDataSet } from "../../store/actions/inSensitiveActions"
import { useSelector } from "../../redux/hooks";
import { useSnackbar } from 'notistack';
import { datasetById, datasetFavorate } from '../../store/actions/dsExploreActions'
import { cloneDeep } from 'lodash'
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import { truncate } from 'lodash'
interface FormValues {
  username?: string;
  password?: string;
}
function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xaa;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: name,
  };
}

const BranchAvator = styled(Avatar)({
  fontSize: 8
}
)

interface BranchModal {
  open: boolean;
  branch?: object;
  callback?: Function;
}

function DsBranchesTab(props) {
  const [openParams, setOpen] = React.useState<BranchModal>({ open: false });
  const [tagText, setTagText] = React.useState('');
  let size = function () { return Math.floor(0.5 + Math.random() * 8) * 100 }
  let navigate = useNavigate();
  const dispatch = useDispatch()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { dsDictionary, createFolderSuccess, errorMsg, datasetInfo, deleteFolderSuccess } = useSelector((state) => state.inSensitive)
  const { loading, datasets, needRefresh } = useSelector((state) => state.dsExplore)
  const [parentDs, setParentDs] = useState(null)
  const stepIndex = props.stepIndex
  const currentStepIndex = props.currentStepIndex
  const checked = stepIndex === currentStepIndex

  const [ds, setDs] = useState(props.ds)
  const RadiusButton = styled(Button)({ borderRadius: '20px', })

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


  useEffect(() => {
    if (!ds.parentId) {
      setParentDs(ds)
    } else if (ds.family) {
      ds.family.map((item) => {
        if (item.id === ds.parentId) {
          setParentDs(item)
        }
      })
    }
  }, [ds])
  // navigate(`/explore`)

  useEffect(() => {
    if (datasets.length > 0) {
      if (datasets[0]) {
        setDs(datasets[0])
      } else {
        navigate('/explore')
      }
    }
  }, [datasets])

  useEffect(() => {
    if (createFolderSuccess) {
      enqueueSnackbar('created success', {
        variant: 'success',
        autoHideDuration: 3000,
      })
      if (datasetInfo && typeof datasetInfo.id !== 'undefined') {
        setDs(datasetInfo)
      }
    }

    if (errorMsg) {
      enqueueSnackbar(errorMsg, {
        variant: 'error',
        autoHideDuration: 3000,
      });
      setDs(ds)
    }

    if (deleteFolderSuccess) {
      if (parentDs) {
        dispatch(datasetById(parentDs.id))
      }
    }
  }, [datasets, createFolderSuccess, errorMsg, datasetInfo, deleteFolderSuccess])



  const tagBranch = (branch) => {

    let payload = cloneDeep(branch)
    payload.tag = tagText
    dispatch(createDataSet(payload, 'tag'))
    setOpen({ open: false })
  }

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
            tag #{openParams.branch ? openParams.branch.dataVersion : ''} branch
          </Typography>
          <TextField
            id="outlined-password-input"
            label="Tag Title"
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
            <Button variant="contained" size="small" disabled={tagText===''} onClick={() => { tagBranch(openParams.branch) }}>Submit</Button>
            <Button variant="outlined" size="small" onClick={() => { setOpen({ open: false }) }}>Cancel</Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  )


  const versionComponent = (payload) => (
    <Card key={payload.id} sx={{ p: 1, width: 1100, borderColor: 'gainsboro', borderRadius: '0', m: '0 0 -1px -1px !important', borderStyle: 'solid', borderWidth: 1, boxShadow: 'none' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >

        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
          sx={{ cursor: payload.id === ds.id?'auto':'pointer' }}
          onClick={() => {
            if (payload.id === ds.id) {
              return
            }
            dispatch(datasetById(payload.id))
            navigate(`/dataset/${payload.id}`)
          }}
        >
          <BranchAvator sx={{ width: 48, height: 48, fontSize: 6 }} {...stringAvatar(payload.dataSetStatus === 0 ? 'Draft' : payload.dataSetStatus === 1 ? 'develop' : 'release')} />
          <Typography gutterBottom variant="h6" >
            {payload.title}
          </Typography>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}  >
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
              <Typography variant="caption">
                {payload.creator}
              </Typography>
              <Typography variant="caption">
                ·
              </Typography>
              <Typography variant="caption">
                {`Last updated ${moment(payload.modifyTime).fromNow()}`}
              </Typography>
            </Stack>


            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>

              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} >

                <Typography variant="caption" sx={{ color: 'gray', display: 'contents' }}>
                  <StorageIcon />
                  {payload.statistic ? fileLengthFormat(payload.statistic.totalSize || 0, 1) : ''}
                </Typography>
              </Stack>
              <Typography variant="caption">
                ·
              </Typography>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} >
                <Typography variant="caption" sx={{ color: 'gray', display: 'contents' }}>
                  <BarChartIcon />
                  {payload.statistic === null ? 0 : payload.statistic.totalCount} Files
                </Typography>
              </Stack>
            </Stack>


          </Stack>


        </Stack>

        {payload.id === ds.id && (<IconButton
          aria-label="expand row"
          size="small"
        >
          <FmdGoodIcon />
        </IconButton>)}


        {/* 分割付 */}
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
        >
          {payload.dataSetStatus === 0 ? null : (<>
            <Typography variant="caption" sx={{ color: 'gray', display: 'contents' }}>
              <SellIcon />
            </Typography>
            {/* <Tooltip title={ payload.tag ||`#${payload.dataVersion}`}> */}
            <Typography variant="caption" sx={payload.tag ? { color: 'gray', display: 'contents' } : { cursor: 'pointer' }} onClick={() => {
              if (!payload.tag) {
                setOpen({ open: true, branch: payload })
              }
            }}>
              {`${truncate(  payload.tag ||`#${payload.dataVersion}` , {
                'length': 12,
                'omission': '..'
              })|| 'tag this branch'}`}
            </Typography>
            {/* </Tooltip> */}
            <Typography variant="caption">
              ·
            </Typography>
          </>)}



          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} >
            <Typography variant="caption" sx={{ color: 'gray', display: 'contents' }}>
              {`#${payload.dataVersion}`}
            </Typography>
          </Stack>
          <Typography variant="caption">
            ·
          </Typography>
          {payload.dataSetStatus === 0 ? (<Stack direction="row" alignItems="center" justifyContent="center" spacing={2} >
            <Typography variant="caption" sx={{ color: 'gray', display: 'contents', cursor: 'pointer' }}
              onClick={() => {
                payload.family = [datasetInfo]
                dispatch(deleteDataSet(payload))
              }}>
              <DeleteIcon />
            </Typography>
          </Stack>) : null}

        </Stack>
      </Stack>
    </Card>
  )

  return (<Grow in={checked}>
    <Box sx={{ minWidth: 1200, width: '100%' }} >

      <Stack
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        spacing={3}
        sx={{ mb: 3 }}
      >

        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          sx={{ width: 1100, marginTop: '2%' }}
          spacing={5}
        >
          <Typography variant="body2" sx={{ color: 'gray', display: 'contents' }}>
            <CommitIcon />
            Active branches
          </Typography>
          <RadiusButton variant="contained" startIcon={<DeviceHubIcon />} size="small"

            disabled={ds && ds.family && (ds.family[0].dataSetStatus === 0 || ds.family[0].auditStatus !==1)}
            onClick={() => {
              navigate(`/edit/${ds.id}`, { state: { ds, branch: true,modified:true } })
            }}
          >
            New Branch
          </RadiusButton>

        </Stack>
        {ds ? (<Stack direction="column" alignItems="flex-start" justifyContent="flex-start" sx={{ m: '50px !important' }} >
          {ds.family && ds.family.map((item) => versionComponent(item))}
        </Stack>) : null}
      </Stack>
      {fileNameModal}
    </Box>
  </Grow>)
}
export default DsBranchesTab