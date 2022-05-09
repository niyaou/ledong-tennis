/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-11-29 17:47:48
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-01-18 17:33:43
 * @content: 数据集详情页面
 */

import { Stack } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { Outlet } from 'react-router-dom';
import useStyles from '../common/styles';
import { createThemes } from '../common/theme';
import Header from '../components/nav/header';
import SubFooter from '../components/nav/subFooter';
const DataSetDetailContainer = () => {
  const classes = useStyles();
    return (
      <ThemeProvider theme={createThemes}>
      {/* <img src={imgURL} className={classes.searchBanner} /> */}
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        spacing={0}
      >
        <Header styleTyle={3} />
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={1} 
          className={classes.globalMarginTop}>
        </Stack>
        <Outlet />
        <SubFooter />
        </Stack>
      </ThemeProvider>
    )
  }
  
  export default DataSetDetailContainer