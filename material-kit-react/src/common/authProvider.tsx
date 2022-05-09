/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-11-23 14:48:09
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-03-22 11:40:47
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
  let location = useLocation();
  const params = useParams()
  
  if (user.userInfo && Object.keys(user.userInfo).length > 0) {
    return children;
  }

  const urlTo = "/login"
  return (<Navigate replace to={urlTo} state={{ ...location.state, from: location }} />);
}



export default RequireAuth