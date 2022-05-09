/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-23 15:42:53
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-05-09 11:34:35
 * @content: edit your page content
 */
import { Avatar, Box, Stack, Typography,Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import imgURL from '../../assert/logo2.png';
import bottomURL from '../../assert/logo_white.png';
import useStyles from '../../common/styles';
import { useSelector } from "../../redux/hooks";
import { logOut } from '../../store/actions/usersActions';

import { clearDatasetFilesCache } from "../../store/actions/filesAndFoldersActions"


const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}));

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
    return {
        sx: {
            bgcolor: stringToColor(name),
            // width: 64, height: 64,
            fontSize: 24,
        },
        children: `${name.split(' ')[0][0]}`,
    };
}

function Header(props) {
    const { styleTyle } = props
    const classes = useStyles();
    let navigate = useNavigate();
    const dispatch = useDispatch()
    const user = useSelector((state) => state.users)
    // const {userInfo} = useSelector((state) => state.users)
    return (
        <Box 
        sx={{
            width: '100vw', display: 'flex', justifyContent: 'center',
            height: '5vh',
            boxShadow:'0 3px 10px 0 rgb(0 0 0 / 6%) !important'
        }}>
            <Stack direction="row" alignItems="center" justifyContent="space-evenly" spacing={1} className={styleTyle === 2 ? classes.navBar2 : classes.navBar}>
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={12}
                    sx={{width: '100%'}}
                >
                    <Link to='/'>
                        <img src={styleTyle === 2 ? imgURL : bottomURL} className={classes.img} />
                    </Link>
                    {/* <Typography variant="button" display="block" gutterBottom sx={{ cursor: 'pointer' }} onClick={() => {
                        dispatch(clearDatasetFilesCache())
                        navigate(`/explore`)
                    }}>
                        Explore
                    </Typography>
                    <Typography variant="button" display="block" gutterBottom sx={{ cursor: 'pointer' }} onClick={() => {
                        dispatch(clearDatasetFilesCache())
                        navigate(`/create`)
                    }}>
                        Create
                    </Typography>
                    {user&& user.userInfo && user.userInfo.roles&&user.userInfo.roles.indexOf('admin')>-1&&(       
                         <Typography variant="button" display="block" gutterBottom sx={{ cursor: 'pointer' }} onClick={() => {
                        dispatch(clearDatasetFilesCache())
                        navigate(`/audit`)
                    }}>
                        Audit
                    </Typography>)}
            
                    <Typography variant="button" display="block" gutterBottom sx={{ cursor: 'pointer' }} onClick={() => {
                        dispatch(clearDatasetFilesCache())
                        navigate(`/permission`)
                    }}>
                        Permission
                    </Typography>
                    <Typography variant="button" display="block" gutterBottom 
                    sx={{ cursor: 'pointer' }}
                    onClick={() => {
                        dispatch(clearDatasetFilesCache())
                        navigate(`/guide`)
                    }}>
                        User Guide
                    </Typography> */}
                </Stack>
                {user.userInfo && Object.keys(user.userInfo).length > 0 ? <HtmlTooltip title={<React.Fragment>
                    <Box >
                        <Typography variant="button" display="block" gutterBottom sx={{ cursor: 'pointer' }} onClick={() => {
                            dispatch(clearDatasetFilesCache())
                            navigate("/")
                            dispatch(logOut())
                        }}>
                            logout
                        </Typography>


                    </Box>
                </React.Fragment>} ><Avatar   {...stringAvatar('管理员')} /></HtmlTooltip> : null}
            </Stack>
        </Box>
    )
}
export default Header