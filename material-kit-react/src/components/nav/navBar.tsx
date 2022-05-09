/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-02 15:55:55
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-03-23 14:16:30
 * @content: edit your page content
 */

import { Button } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from "../../redux/hooks";
import { logOut } from '../../store/actions/usersActions';
// background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
const useStyles = makeStyles({
    container: {
        marginTop: '10px',
    },
    navBar: {
        display: 'absolute',
    },
});


function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name: string) {
    // children: `${name.split(' ')[0][0]}${name.split(' ')[0][1]}`,
    return {
        sx: {
            bgcolor: stringToColor(name),
            // width: 64, height: 64,
            fontSize: 24,
        },
        children: `${name.split(' ')[0][0]}`,
    };
}


function NavBar() {
    const classes = useStyles();
    let navigate = useNavigate();
    const dispatch = useDispatch()
    const user = useSelector((state) => state.users)
    const location = useLocation()
    const { pathname } = location
    return (<div className={classes.container}>

        {pathname && pathname === '/' || pathname === '/login' ||pathname === '/guide' ||pathname === '/permission'||pathname === '/audit'|| pathname.indexOf('explore') > -1 || pathname.indexOf('edit') > -1 ||
         pathname.indexOf('create') > -1 || pathname.indexOf('dataset') > -1? null : (<Stack direction="row" spacing={2} >
            <Button variant="outlined" onClick={() => {
                navigate("/")

            }}>   Main Page
            </Button>

            <Button variant="outlined" onClick={() => {
                navigate("/explore")
            }}>
                Search
            </Button>
            {user.userInfo && Object.keys(user.userInfo).length > 0 ? (<Button variant="contained" color="info" onClick={() => {
                navigate("/")
                dispatch(logOut())
            }}>logout</Button>) : (<Button variant="contained" onClick={() => {
                navigate("/login")
            }}>
                login
            </Button>)
            }
            {user.userInfo && Object.keys(user.userInfo).length > 0 ? <Avatar   {...stringAvatar(user.userInfo.nickName)} /> : null}
        </Stack>)}

        <Outlet />
    </div>)
}
const mapStateToProps = (state) => {
    return {}
}

export default connect(mapStateToProps, {})(NavBar)