/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-11-29 17:34:34
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-05-10 14:43:46
 * @content:数据集网站首页
 */
import { Backdrop, CircularProgress, Typography, Stack, Avatar, Card, CardMedia, Box, Divider, Button, Grid, CardContent, CardActions } from '@mui/material'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { Search as Search, Star as Star, Favorite, TrendingUp as Trending, Facebook, YouTube, Twitter } from '@mui/icons-material';
import React, { useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { logOut } from '../store/actions/usersActions'
import { useSelector } from "../redux/hooks"
import { exploreUsersAction } from '../store/slices/dominationSlice'
import { searchDeActiveAction } from '../store/actions/filesAndFoldersActions'
import bottomURL from '../assert/logo_white.png'
import contentImgURL from '../assert/content.png';
import { makeStyles } from '@mui/styles';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import DataSetList from '../components/exploreDs/datasetList'
import Header from '../components/nav/header'
import IndexContainer from '../components/whIndex/indexContainer'
import SideMenu from '../components/sidebar/sideMenu'
import DsFolderTree from '../components/fileExplore/dsFolderTree'
import useStyles from '../common/styles'
import { Themes } from '../common/theme'
import { useSnackbar } from 'notistack';
import Footer from '../components/nav/footer';

function DominationPage() {
  const classes = useStyles();

  const dominationData = useSelector((state) => state.domination)
  const loading = useSelector((state) => state.domination.loading)
  const {loadError,errorMsg} = useSelector((state) => state.domination)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.users)

  const [index, setIndex] = React.useState<number>(0);
  useEffect(() => {
    dispatch(exploreUsersAction())
  }, []) 
  
  useEffect(() => {

  if(errorMsg){
    navigate('/login')
    return
  }
  }, [errorMsg])

  useEffect(() => {
    if (loadError) {
      enqueueSnackbar(dominationData.errorMsg, {
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
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        spacing={0}
        className={classes.root}
      >
        <Header styleTyle={2} />
        <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={0} className={classes.content}>
          <SideMenu indexChange={(current) => {
            setIndex(current)
            dispatch(searchDeActiveAction())
          }} />
 
          <IndexContainer index={index} />
        </Stack>
      </Stack>


    </ThemeProvider>
  )
}

// const mapStateToProps = (state) => ({ users: state.users })

// export default connect(mapStateToProps, {})(DominationPage)

export default DominationPage