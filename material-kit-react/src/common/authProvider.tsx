/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-11-23 14:48:09
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-05-09 14:22:23
 * @content: edit your page content
 */
import * as React from "react";
import { connect } from 'react-redux';
import {
  Navigate, useLocation,useParams
} from "react-router-dom";
import { useSelector } from "../redux/hooks";

 const RequireAuth = ( {children} )=>  {
  const user =  useSelector((state)=>state.users)
  // let location = useLocation();
  
  // if (user.userInfo ) {
    return children;
  // }

  // const urlTo = "/login"
  // return (<Navigate replace to={urlTo} state={{ ...location.state, from: location }} />);
}



export default RequireAuth