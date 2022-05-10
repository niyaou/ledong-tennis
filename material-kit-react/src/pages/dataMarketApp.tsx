/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-11-29 16:42:01
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-05-10 14:39:35
 * @content: 数据集项目工程页，用于构建应用框架，搭建路由，管理全局状态
 */

import { Slide } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import React, { useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { SnackbarProvider } from 'notistack';
import { connect, useDispatch } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RequireAuth from "../common/authProvider";
import Axios from '../common/axios/axios';
import { Themes } from '../common/theme';
import NavBar from '../components/nav/navBar';
import { initUser } from '../store/actions/usersActions';
import DominationPage from './dominationPage';
import LoginPage from './loginPage';

// background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
const useStyles = makeStyles({
    app: {
    },
  });

  
function PangooDMApplication() {
    const classes = useStyles();
    const dispatch = useDispatch()
    
    useEffect(() => {
        Axios.dispatch = dispatch;
        dispatch(initUser())
      }, [])


    return (
        <SnackbarProvider className={classes.app}  maxSnack={3}    anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        TransitionComponent={Slide}>
            <ThemeProvider theme={Themes}>
                <BrowserRouter>
                    <Routes>
                        <Route element={<NavBar />}>
                            <Route path="/" element={
                                <RequireAuth>
                                    <DominationPage />
                                </RequireAuth>
                       
                            } />
                             {/* <Route path="/audit" element={
                                 <RequireAuth>
                                <AuditDataSet />
                                 </RequireAuth>
                            } /> */}
                            {/* <Route path="/explore" element={
                                // <RequireAuth>
                                    <ExploreDataSet />
                                // </RequireAuth>
                            } /> */}
                            {/* <Route path="/explore/:classes" element={
                                <RequireAuth>
                                    <ExploreDataSet />
                                </RequireAuth>
                            } /> */}
                            {/* <Route path="/editlist" element={
                                <RequireAuth>
                                    <ListEditor />
                                </RequireAuth>
                            } /> */}
                             {/* <Route path="/permission" element={
                                <RequireAuth>
                                    <PermissionApply />
                                </RequireAuth>
                            } /> */}
                            {/* <Route path="/dataset" element={
                                <RequireAuth>
                                    <DataSetDetailContainer />
                                </RequireAuth>
                            } > */}
                                {/* <Route path=":datasetId" element={<RequireAuth>
                                    <SpecificationDataSet />
                                </RequireAuth>
                                } />
                            </Route> */}
                            {/* <Route path="/create" element={
                                <RequireAuth>
                                    <CreateDataSet />
                                </RequireAuth>
                            } /> */}
                            {/* <Route path="/create/:datasetId" element={
                                <RequireAuth>
                                    <CreateDataSet />
                                </RequireAuth>
                            } /> */}
                            {/* <Route path="/edit/:datasetId" element={
                                <RequireAuth>
                                    <EditDatasetPage />
                                </RequireAuth>
                            } /> */}
                            <Route path="/login" element={<LoginPage />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
            </SnackbarProvider>
    )
}


const mapStateToProps = (state) => ({ users: state.users })
export default connect(mapStateToProps, {})(PangooDMApplication)
