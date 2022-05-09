/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-11-29 17:46:34
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-05-09 13:48:31
 * @content: 数据集栏目列表以及搜索列表页面
 */
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { Button, IconButton, InputBase, Paper, Stack, Typography, Backdrop, CircularProgress, Pagination } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import useStyles from '../common/styles';
import ExploreList from '../components/exploreDs/exploreList';
import Footer from '../components/nav/footer';
import Header from '../components/nav/header';
import SearchParamsBtn from '../components/exploreDs/searchParamsBtn';
import TopicBtn from '../components/exploreDs/topicBtn';
import { useSelector } from "../redux/hooks";
import { defaultPageAble, PageableParmas } from "../common/interface"
import { ThemeProvider } from '@mui/material/styles';
import { Themes } from '../common/theme'
import { getDataDictionaryAction, getDataSetAction, getDataSetByTopicAction } from '../store/slices/exploreSlice'
import qs from 'qs'
import { useSnackbar } from 'notistack';


let pageSize = 30

function ExploreDataSet() {
  const classes = useStyles();
  const dispatch = useDispatch()
  const location = useLocation();
  let navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  let params = qs.parse(location.search.substring(1, location.search.length));

  const { loading, dataDictionary, pager, loadError, errorMsg } = useSelector((state) => state.explore)

  const getDataSetByParams = (page: number, size: number) => {
    // debugger
    if (params.topic) {
      dispatch(getDataSetByTopicAction({
        type: params.topic,
        page: page,
        size: size,
      }))
    } else {
      dispatch(getDataSetAction({
        ...params,
        page,
        size,
      }))
    }
  }

  useEffect(() => {
    dispatch(getDataDictionaryAction(['dataType', 'labelType', 'taskType', 'usedScene']))
    getDataSetByParams(0, pageSize)
  }, [])

  useEffect(() => {
    getDataSetByParams(0, pageSize)
  }, [location.search])

  const indexClick = (v) => {
    getDataSetByParams(v, pageSize)
  }

  const [searchContent, setSearchContent] = React.useState(params['searchContent'] || '');


  useEffect(() => {
    if (loadError) {
      enqueueSnackbar(errorMsg, {
        variant: 'error',
        autoHideDuration: 3000,
      });
    }
  }, [loadError])

  return (
    <ThemeProvider theme={
      Themes
    }>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={false}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* <img src={imgURL} className={classes.searchBanner} /> */}
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        spacing={0}
      >
        <Header styleTyle={2} />
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={1} className={classes.searchBannerWrap}>
          <Paper
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 600 }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              value={searchContent}
              onKeyDown={(event: any) => {
                if (event.keyCode === 13) {
                  params["searchContent"] = searchContent
                  navigate(`/explore?${qs.stringify(params, { arrayFormat: 'brackets' })}`)
                }
              }}
              onChange={(event: any) => {
                setSearchContent(event.target.value)
              }}
              placeholder="   Search For DataSets Which You Need"
              inputProps={{ 'aria-label': 'Search For DataSets Which You Need' }}
            />
            <IconButton sx={{ p: '10px' }} aria-label="search"
              onClick={
                (e) => {
                  // let params = qs.parse(location.search.substring(1, location.search.length))
                  params["searchContent"] = searchContent
                  navigate(`/explore?${qs.stringify(params, { arrayFormat: 'brackets' })}`)
                }
              }
            >
              <SearchIcon />
            </IconButton>
          </Paper>
        </Stack>
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="stretch"
          spacing={2}
          sx={{ marginTop: '5px' }}
          className={classes.list}
        >
          <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={2} sx={{ marginTop: '1%' }}>
            <SearchParamsBtn params={params} searchParams={dataDictionary.dataType} searchType={"dataTypeIds"} label={"Data Type"} />
            <SearchParamsBtn params={params} searchParams={dataDictionary.labelType} searchType={"labelTypeIds"} label={"Label Type"} />
            <SearchParamsBtn params={params} searchParams={dataDictionary.taskType} searchType={"taskTypeIds"} label={"Task Type"} />
            <SearchParamsBtn params={params} searchParams={dataDictionary.usedScene} searchType={"usedSceneIds"} label={"Used Scene"} />
            <TopicBtn params={params}/>
          </Stack>
          <Typography variant="h6" sx={{ fontWeight: 400 }}>{pager.totalElements} Datasets</Typography>
          <ExploreList dslist={pager.content || []} />
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ marginTop: '3% !important', marginBottom: '2% !important' }}>
            <Pagination count={pager.totalPages} showFirstButton showLastButton color="primary"
              onChange={(event, page) => {
                indexClick(page - 1)
              }} />
          </Stack>
        </Stack>
      </Stack>
      <Footer />
    </ThemeProvider>
  )
}

export default ExploreDataSet
