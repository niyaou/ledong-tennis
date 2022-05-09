/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-23 15:42:53
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-01-14 11:08:50
 * @content: edit your page content
 */
import { Facebook, Twitter, YouTube } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import useStyles from '../../common/styles';
import { useSelector } from "../../redux/hooks";
import bottomURL from '../../assert/logo_white.png';





function Footer(props) {
    const {styleTyle} = props
    const classes = useStyles();
    let navigate = useNavigate();
    const dispatch = useDispatch()
    const user = useSelector((state) => state.users)

    return (
  
        <Stack className={classes.bottom} direction="row" alignItems="center" justifyContent="center" spacing={12}>
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          spacing={5}
          sx={{ width: 400, height: 300 }}
        >
          <Link to='/'>
            <img src={bottomURL} className={classes.img} />
          </Link>
          <Typography variant="body2" sx={{ color: '#dcdcde', paddingLeft: 5 }} >
            Professional DataSet management tool
          </Typography>
          <Typography variant="body2" sx={{ color: '#dcdcde', paddingLeft: 5 }}>
            @2022 All rights reserved desay-sv CT_AML_DS
          </Typography>
        </Stack>
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          spacing={3}
          sx={{ width: 200, height: 300 }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bolder', fontFamily: 'Trebuchet MS, sans-serif' }}>
            Learn more
          </Typography>
          <Typography variant="body2" sx={{ color: '#dcdcde' }}>
            Pangoo IDS
          </Typography>
          <Typography variant="body2" sx={{ color: '#dcdcde' }}>
            Features
          </Typography>
          <Typography variant="body2" sx={{ color: '#dcdcde' }}>
            Resources
          </Typography>
          <Typography variant="body2" sx={{ color: '#dcdcde' }}>
            Knowledge Base
          </Typography>
          <Typography variant="body2" sx={{ color: '#dcdcde' }}>
            Terms of Service
          </Typography>
        </Stack>
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          spacing={3}
          sx={{ width: 200, height: 300 }}

        >
          <Typography variant="h5" sx={{ fontWeight: 'bolder', fontFamily: 'Trebuchet MS, sans-serif' }}>
            Help Center
          </Typography>
          <Typography variant="body2" sx={{ color: '#dcdcde' }}>
            Using Guide
          </Typography>
          <Typography variant="body2" sx={{ color: '#dcdcde' }}>
            Careers
          </Typography>
          <Typography variant="body2" sx={{ color: '#dcdcde' }}>
            Status
          </Typography>
          <Typography variant="body2" sx={{ color: '#dcdcde' }}>
            Privacy Policy
          </Typography>
        </Stack>
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          spacing={3}
          sx={{ width: 300, height: 300 }}

        >
          <Typography variant="h5" sx={{ fontWeight: 'bolder', fontFamily: 'Trebuchet MS, sans-serif' }}>
            Social
          </Typography>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
            <Facebook /> <Twitter /> <YouTube />
          </Stack>
        </Stack>


      </Stack>
    )
}
export default Footer