/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-11-29 17:46:34
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-05-09 13:48:22
 * @content: 数据集栏目列表以及搜索列表页面
 */
import { ArrowBackIosSharp, ArrowForwardIosSharp } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { Button, IconButton, InputBase, Paper, Stack, Typography,Backdrop,CircularProgress,Pagination  } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import useStyles from '../common/styles';
import ExploreList from '../components/exploreDs/exploreList';
import Footer from '../components/nav/footer';
import Header from '../components/nav/header';
import SearchParamsBtn from '../components/exploreDs/searchParamsBtn';
import { useSelector } from "../redux/hooks";
import { exploreAuditDatasets } from "../store/actions/dsExploreActions"
import { defaultPageAble, PageableParmas } from "../common/interface"
import { fill } from 'lodash'
import { ThemeProvider } from '@mui/material/styles';
import {Themes} from '../common/theme'

function AuditDataSet() {
  const classes = useStyles();
  let { dsSets } = useParams()

  const dispatch = useDispatch()
  const { loading, datasets } = useSelector((state) => state.dsExplore)
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  dsSets = dsSets || ''
  const dslist = []

  for (let codePoint of dsSets.split('')) {
    dslist.push(codePoint)
  }

  const specificPage=()=> {
    let params: PageableParmas<number> = {
      page: pageIndex,
      size: 5,
    }
    dispatch(exploreAuditDatasets(params,0))
  }

  useEffect(() => {
    specificPage()
  }, [])

  useEffect(() => {
    specificPage()
  }, [pageIndex])


  useEffect(() => {
    if (typeof datasets.totalPages !== 'undefined' && datasets.totalPages > 0) {
      setTotalPages(datasets.totalPages)
    }
  }, [datasets])



  const findPageIndex = () => {
    return fill(Array(totalPages), 0)
  }

  const indexClick = (v) => {
    setPageIndex(parseInt(v))
  }


  let searchParams = ['Audio', 'Box2D', 'Box3D', 'Cuboid2D', 'Classification', 'Audio', 'Box2D', 'Box3D', 'Cuboid2D', 'Classification']


  const RadiusButton = styled(Button)({ borderRadius: '20px', })
  const CircleButton = styled(Button)({
    padding: '20',
    borderRadius: '50%',
    minWidth: '30px',
  })


  return (
    <ThemeProvider  theme={
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
        <Header styleTyle={1} />
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={1} className={classes.auditBannerWrap}>
          {/* <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 600,color: 'white' }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1,color:'white' }}
              placeholder="   There are dataSets which need to be audited"
              inputProps={{ 'aria-label': 'Search For DataSets Which You Need' }}
              disabled
            />
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper> */}
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
         
            <RadiusButton variant="contained"  size="small" color="primary">
              AUDIT DATASET
            </RadiusButton>

            {/* <SearchParamsBtn searchParams={searchParams} /> */}
          </Stack>
          <Typography variant="h6" sx={{ fontWeight: 400 }}>{datasets.totalElements} Datasets</Typography>
          <ExploreList dslist={datasets.content||[]}/>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ marginTop: '3% !important', marginBottom: '2% !important' }}>
          <Pagination count={totalPages} showFirstButton showLastButton color="primary" 
          onChange={(event,page)=>{
          indexClick(page-1)
          }} />
            {/* <IconButton color="primary">
              <ArrowBackIosSharp />
            </IconButton>
            {findPageIndex().map((_p, index) => (<CircleButton
             onClick={()=>indexClick(index)} key={index + 1} 
             variant={index===pageIndex? "contained":"text"}
             size="small">{index + 1}</CircleButton>))}

            <IconButton color="primary">
              <ArrowForwardIosSharp />
            </IconButton> */}
          </Stack>
        </Stack>
      </Stack>
      <Footer />
    </ThemeProvider>
  )
}


export default AuditDataSet
