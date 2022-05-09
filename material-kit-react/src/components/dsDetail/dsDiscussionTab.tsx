/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-17 11:19:45
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-05-09 13:48:19
 * @content: edit your page content
 */
import { Box, Button, Pagination, CardContent, List, Grow, Select, Stack, TextField, Typography, Accordion, AccordionDetails, AccordionSummary, ListItem, ListItemAvatar, ListItemText, Divider } from '@mui/material';
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { ExpandCircleDown as ExpandMoreIcon } from '@mui/icons-material';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';

import { CommentState, isChangedAction } from '../../store/slices/commentSlice'
import { getCommentAction, submitCommentAction } from '../../store/slices/commentSlice'

import { useDispatch } from 'react-redux'
import { useSelector } from "../../redux/hooks"
import { Backdrop, CircularProgress } from '@mui/material'

import Axios from '../../common/axios/axios'
import { USER_INFO_KEY } from '../../store/actions/usersActions'

import moment from 'moment';
import { useSnackbar } from 'notistack';

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

function ReplyEntry(props: any) {
  return (
    <Box>
      {/* {props.index !== 0 ? <Divider variant="inset" component="li" /> : null} */}
      <Divider variant="inset" component="li" />
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <UserAvatar userLoginName={props.reply.creator} />
        </ListItemAvatar>
        <ListItemText
          sx={{ width: '100%', paddingBottom: '16px', whiteSpace: 'pre-line',wordBreak: 'break-all' }}
          primary={props.reply.content + '\n  '}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
              >
                {`${props.reply.creatorFullName} replied ${moment(props.reply.createTime).fromNow()}`}
              </Typography>

            </React.Fragment>
          }
        />
      </ListItem>

    </Box>
  )
}

function ReplyForm(props: any) {
  const dispatch = useDispatch()
  const { datasetId } = useParams()

  const [compState, setCompState] = React.useState({
    needCheck: false,
    content: {
      value: '',
      error: false,
      helperText: ''
    }
  });

  const validate = (): boolean => {
    if (compState.needCheck !== true) {
      return true
    }
    let isValidate = true
    let newState = {
      ...compState
    }

    if (compState.content.value.trim() === '') {
      newState.content = {
        ...newState.content,
        error: true,
        helperText: 'Need input.'
      }
      isValidate = false
    } else {
      newState.content = {
        ...newState.content,
        error: false,
        helperText: ''
      }
    }
    setCompState(newState)
    return isValidate;
  };

  const handleSubmit = () => {
    compState.needCheck = true;
    if (validate()) {
      dispatch(submitCommentAction({
        classObj: datasetId,
        classType: "dataset",
        parentId: props.topic.id,
        title: '',
        visibleScale: props.topic.visibleScale,
        content: compState.content.value,
      }))
      props.onClose(true);

      setCompState({
        ...compState,
        content: {
          ...compState.content,
          value: ''
        }
      })
    }
  };

  return (
    <Stack
      direction="row"
      sx={{ width: '100%', border: '1px solid rgb(222, 223, 224);' }}
      spacing={1}>
      <Stack
        direction="column"
        sx={{
          width: '20%',
          padding: '20px',
          borderRight: '1px solid rgb(222, 223, 224);'
        }}
        alignItems="center"
        // justifyContent="center"
        spacing={'16px'}>
        <UserAvatar userLoginName={props.userInfo.login} />
        <Typography variant="h6" gutterBottom component="div">
          {props.userInfo.nickName}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        justifyContent="right"
        sx={{ width: '100%', padding: '20px' }}
        alignItems="flex-end"
        spacing={2}>
        <TextField
          label="Content"
          // label="Content(reply visable scale as the same as topic.)"
          required
          multiline
          minRows={3}
          sx={{ width: '100%' }}
          error={compState.content.error}
          helperText={compState.content.helperText}
          value={compState.content.value}
          onChange={(event: any) => setCompState({
            ...compState,
            content: {
              ...compState.content,
              value: event.target.value,
            }
          })}
          onBlur={(event) => validate()}
        />
        <Button variant="contained"
          onClick={handleSubmit}
        >
          Reply
        </Button>
      </Stack>
    </Stack>
  )
}

// export interface INewTopic {
//   onClose: (needReload: boolean) => void;
// }

function NewTopic(props: any) {
  const { datasetId } = useParams()
  const dispatch = useDispatch()

  const [compState, setCompState] = React.useState({
    needCheck: false,
    title: {
      value: '',
      error: false,
      helperText: ''
    },
    visibleScale: 1,
    content: {
      value: '',
      error: false,
      helperText: ''
    }
  });

  const validate = (): boolean => {
    if (compState.needCheck !== true) {
      return true
    }
    let isValidate = true
    let newState = {
      ...compState
    }
    if (compState.title.value.length > 200) {
      newState.title = {
        ...compState.title,
        error: true,
        helperText: 'Title size max length is 200.'
      }
      isValidate = false
    } else if (compState.title.value.trim() === '') {
      newState.title = {
        ...compState.title,
        error: true,
        helperText: 'Need input.'
      }
      isValidate = false
    } else {
      newState.title = {
        ...compState.title,
        error: false,
        helperText: ''
      }
    }

    if (compState.content.value.length > 10000) {
      newState.content = {
        ...newState.content,
        error: true,
        helperText: 'Content size max length is 10000.'
      }
      isValidate = false
    } else if (compState.content.value.trim() === '') {
      newState.content = {
        ...newState.content,
        error: true,
        helperText: 'Need input.'
      }
      isValidate = false
    } else {
      newState.content = {
        ...newState.content,
        error: false,
        helperText: ''
      }
    }
    setCompState(newState)
    return isValidate;
  };

  const handleClose = () => {
    props.onClose(false);
  };


  const handleSubmit = () => {
    compState.needCheck = true;
    if (validate()) {
      dispatch(submitCommentAction({
        classObj: datasetId,
        classType: "dataset",
        title: compState.title.value,
        visibleScale: compState.visibleScale,
        content: compState.content.value,
      }))
      props.onClose(true);
    }
  };

  return (
    <Stack
      direction="row"
      sx={{ width: '100%', border: '1px solid rgb(222, 223, 224);' }}
      spacing={1}>
      <Stack
        direction="column"
        sx={{
          width: '20%',
          padding: '20px',
          borderRight: '1px solid rgb(222, 223, 224);'
        }}
        alignItems="center"
        // justifyContent="center"
        spacing={'16px'}>
        <UserAvatar userLoginName={props.userInfo.login} />
        <Typography variant="h6" gutterBottom component="div">
          {props.userInfo.nickName}
        </Typography>
      </Stack>
      <Stack
        direction="column"
        sx={{ width: '100%', padding: '20px' }}
        spacing={'16px'}>
        <TextField
          required
          error={compState.title.error}
          helperText={compState.title.helperText}
          label="Title"
          onChange={(event: any) => setCompState({
            ...compState,
            title: {
              ...compState.title,
              value: event.target.value,
            }
          })}
          onBlur={(event) => validate()}
        // variant="standard"
        />
        {/* <FormControl required>
          <FormLabel>Visiable scale</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={compState.visibleScale}
            onChange={(event) => setCompState({
              ...compState,
              visibleScale: Number(event.target.value),
            })}
          >
            <FormControlLabel value="1" control={<Radio />} label="public" />
            <FormControlLabel value="2" control={<Radio />} label="private" />
          </RadioGroup>
        </FormControl> */}
        <TextField
          label="Content"
          required
          error={compState.content.error}
          helperText={compState.content.helperText}
          multiline
          minRows={8}
          // maxRows={10}
          value={compState.content.value}
          onChange={(event: any) => setCompState({
            ...compState,
            content: {
              ...compState.content,
              value: event.target.value,
            }
          })}
          onBlur={(event) => validate()}
        // variant="standard"
        />
        <Stack
          direction="row"
          justifyContent="right"
          sx={{ width: '100%' }}
          alignItems="right"
          spacing={2}>
          <Button variant="outlined"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button variant="contained"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}

function DsDiscussionTab(props: any) {
  const comment: CommentState = useSelector((state) => state.comment)
  const loading = useSelector((state) => state.comment.loading)
  const userInfo = useSelector((state) => state.users.userInfo)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { datasetId } = useParams()
  // const [datasetId, setDatasetId] = React.useState(paramDatasetId);

  let navigate = useNavigate();
  const dispatch = useDispatch()

  const [showContent, setShowContent] = React.useState('listTopic');

  const loadList = () => {
    dispatch(getCommentAction({
      classObj: datasetId,
      classType: "dataset",
      page: 0,
      size: 10,
    }))
  }

  useEffect(() => {
    if (comment.isChanged === true) {
      loadList()
      setShowContent('listTopic');
    }
  }, [comment.isChanged])

  useEffect(() => {
    dispatch(isChangedAction())
  }, [datasetId])

  useEffect(() => {
    if (comment.loadError) {
      enqueueSnackbar(comment.errorMsg, {
        variant: 'error',
        autoHideDuration: 3000,
      });
    }
  }, [comment.loadError])


  const showNewTopic = () => {
    setShowContent('newTopic');
  };

  const showListTopic = (needReload: boolean) => {
    setShowContent('listTopic');
  };

  const stepIndex = props.stepIndex
  const currentStepIndex = props.currentStepIndex
  const checked = stepIndex === currentStepIndex

  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleChangePage = (event, newPage) => {
    dispatch(getCommentAction({
      classObj: datasetId,
      classType: "dataset",
      page: newPage - 1,
      size: 10,
    }))
  };

  const commentWidth = 1100

  return (<Grow in={checked}>
    <Box sx={{ minWidth: 1200, width: '100%' }} >
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={false}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}>
        <Stack
          direction="row"
          justifyContent="right"
          sx={{ width: '100%' }}
          alignItems="right"
          spacing={2}>
          <Button variant="outlined"
            onClick={showNewTopic}
          >
            New Topic
          </Button>
        </Stack>
        {
          showContent === 'newTopic' ? <NewTopic userInfo={userInfo} onClose={showListTopic} /> : null
        }
        {
          showContent === 'listTopic' ? <Stack
            direction="column"
            justifyContent="center"
            sx={{ width: '100%' }}
            spacing={1}>
            {
              comment.isChanged ?
                null :
                comment.pager.content.map((row) => (
                  <Accordion
                    key={row.id}
                    sx={{ width: '100%' }} expanded={expanded === `panel${row.id}`} onChange={handleChange(`panel${row.id}`)}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id={"panel1bh-header"}
                    >
                      <Stack
                        direction="row"
                        sx={{ width: '100%', paddingLeft: '16px' }}
                        spacing={2}>
                        <UserAvatar userLoginName={row.creator} />
                        <Stack
                          direction="column"
                          sx={{ paddingLeft: '16px', paddingRight: '16px' }}>
                          <Typography variant="h6"
                            sx={{ wordBreak: 'break-all' }}
                          >
                            {row.title}
                          </Typography>
                          <Typography sx={{ color: 'text.secondary' }}>{` ${row.creatorFullName} last created ${moment(row.createTime).fromNow()}`}</Typography>
                        </Stack>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body1" sx={{ width: commentWidth, paddingBottom: '16px', whiteSpace: 'pre-line',wordBreak: 'break-all' }}>
                        {row.content}
                      </Typography>
                      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        {row.children.map((reply, index) => <ReplyEntry key={reply.id} reply={reply} index={index} />)}
                      </List>
                      <ReplyForm topic={row} userInfo={userInfo} onClose={showListTopic} />
                    </AccordionDetails>
                  </Accordion>
                ))}
          </Stack> : null
        }
        <Pagination
          sx={{ marginTop: '3% !important', marginBottom: '2% !important' }}
          count={comment.pager.totalPages}
          onChange={handleChangePage}
          size="large"
          color="primary"
          showFirstButton showLastButton
        />
      </Stack>
    </Box>
  </Grow>)
}
export default DsDiscussionTab