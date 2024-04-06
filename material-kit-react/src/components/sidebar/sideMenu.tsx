/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-04-11 11:16:23
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-05-09 11:03:52
 * @content: edit your page content
 */
/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-23 15:42:53
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-11 11:10:25
 * @content: edit your page content
 */
import { Avatar, Box, Stack, Typography, Paper, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import imgURL from '../../assert/logo2.png';
import bottomURL from '../../assert/logo_white.png';
import useStyles from '../../common/styles';
import { useSelector } from "../../redux/hooks";
import { logOut } from '../../store/actions/usersActions';
import FolderIcon from '@mui/icons-material/Folder';
import AnalyticsSharp from '@mui/icons-material/AnalyticsSharp';
import AccessAlarmsOutlined from '@mui/icons-material/AccessAlarmsOutlined';
import { clearDatasetFilesCache } from "../../store/actions/filesAndFoldersActions"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import GridViewIcon from '@mui/icons-material/GridView';
import { fileLengthFormat, numberFormat } from '../../common/utils/dateUtils'
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



function SideMenu(props) {
    const { styleTyle } = props
    const classes = useStyles();
    let navigate = useNavigate();
    const dispatch = useDispatch()
    const user = useSelector((state) => state.users)
    const { fileStatistic } = useSelector((state) => state.filesAndFolders)
    const [statisticArr, setStatisticArr] = React.useState([]);

    useEffect(() => {

        if (fileStatistic && fileStatistic.length > 7) {
            let arrs = fileStatistic.slice(0, 6)
            setStatisticArr(arrs)
        } else {
            setStatisticArr(fileStatistic)
        }

    }, [fileStatistic])


    const indexChange = props.indexChange
    // const {userInfo} = useSelector((state) => state.users)
    return (
        <Box
            sx={{
                width: '4vw', height: '100%',
                boxShadow: '0 3px 10px 0 rgb(0 0 0 / 6%) !important'
            }}>
            <Stack
                direction="column"
                justifyContent="space-around"
                alignItems="center"
                spacing={2}
                sx={{ width: '100%', height: '100%' }}
            >
                <Stack
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={5}
                    sx={{ width: '100%', height: '100%' }}
                >
                    <>&nbsp;</>
                    <Stack
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={0}
                        onClick={async () => {
                            indexChange(0)
                        }}
                        sx={{ mT: 5, width: '100%', color: '#8b8b8b', height: 80, cursor: 'pointer', '&:hover': { background: 'rgba(0, 0, 0, 0.04)', color: '#a1a1a1' } }}
                    >
                        <IconButton
                            aria-label="expand row"
                            size="large"
                            disabled={true}

                        >
                            <CloudUploadIcon />
                        </IconButton>
                        <Typography variant="button" display="block" gutterBottom sx={{ cursor: 'pointer' }} onClick={() => {
                            // dispatch(clearDatasetFilesCache())
                            // navigate(`/explore`)
                        }}>
                            首页
                        </Typography>
                    </Stack>
                    <Stack
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={1}
                        onClick={async () => {
                            indexChange(1)
                        }}
                        sx={{ width: '100%', height: 80, color: '#8b8b8b', cursor: 'pointer', '&:hover': { background: 'rgba(0, 0, 0, 0.04)', color: '#a1a1a1' } }}
                    >
                        <IconButton
                            aria-label="expand row"
                            size="large"
                            disabled={true}

                        >
                            <FolderIcon />
                        </IconButton>
                        <Typography variant="button" display="block" gutterBottom sx={{}} onClick={() => {
                            // dispatch(clearDatasetFilesCache())
                            // navigate(`/explore`)
                        }}>
                         会员
                        </Typography>
                    </Stack>
                    <Stack
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={1}
                        onClick={async () => {
                            indexChange(2)
                        }}
                        sx={{ width: '100%', height: 80, color: '#8b8b8b', cursor: 'pointer', '&:hover': { background: 'rgba(0, 0, 0, 0.04)', color: '#a1a1a1' } }}
                    >
                        <IconButton
                            aria-label="expand row"
                            size="large"
                            disabled={true}

                        >
                            <AnalyticsSharp />
                        </IconButton>
                        <Typography variant="button" display="block" gutterBottom sx={{}} onClick={() => {
                            // dispatch(clearDatasetFilesCache())
                            // navigate(`/explore`)
                        }}>
                         统计
                        </Typography>
                    </Stack>
                    <Stack
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={1}
                        onClick={async () => {
                            indexChange(3)
                        }}
                        sx={{ width: '100%', height: 80, color: '#8b8b8b', cursor: 'pointer', '&:hover': { background: 'rgba(0, 0, 0, 0.04)', color: '#a1a1a1' } }}
                    >
                        <IconButton
                            aria-label="expand row"
                            size="large"
                            disabled={true}

                        >
                            <AccessAlarmsOutlined />
                        </IconButton>
                        <Typography variant="button" display="block" gutterBottom sx={{}} onClick={() => {
                            // dispatch(clearDatasetFilesCache())
                            // navigate(`/explore`)
                        }}>
                         自动录课
                        </Typography>
                    </Stack>
                </Stack>
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                    sx={{ width: '100%', height: '100%' }}
                >
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        spacing={1}
                        sx={{ width: '100%', height: 80, color: '#8b8b8b', cursor: 'pointer', '&:hover': { background: 'rgba(0, 0, 0, 0.04)', color: '#a1a1a1' } }}
                    >
                        <IconButton
                            aria-label="expand row"
                            size="large"
                            disabled={true}
                            onClick={async () => {
                            }}
                        >
                            <GridViewIcon />
                        </IconButton>
                        {/* <Typography variant="button" display="block" gutterBottom sx={{}} onClick={() => {
                        }}>
                            系统设置
                        </Typography> */}

                    </Stack>
                    <>&nbsp;</>
                    <Stack
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        spacing={1}
                        sx={{ marginLeft: 2 }}
                    >
                        {statisticArr.map((file, index) => (<Typography variant="body2" key={`file-${index}`} gutterBottom sx={{ color: '#8b8b8b' }} >

                            {file.fileType}:{numberFormat(file.total, file.total >= 1000000 ? 2 : 1)}

                        </Typography>))}

                        {fileStatistic.length > 6 && (<Typography variant="body2" key={`file-其他`} gutterBottom sx={{ color: '#8b8b8b' }} >

                            其他

                        </Typography>)}


                    </Stack>

                </Stack>



            </Stack>


        </Box>
    )
}
export default SideMenu