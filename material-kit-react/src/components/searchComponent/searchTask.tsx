/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-04-27 10:14:51
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-29 15:53:43
 * @content: edit your page content
 */
import { Avatar, Box, Button, Chip, Collapse, FormControl, MenuItem, Modal, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect } from 'react';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CachedIcon from '@mui/icons-material/Cached';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import CourseItem from '../../components/ldadmin/courseItem';
import { useSelector } from "../../redux/hooks";
import { createUserAccount } from '../../store/actions/usersActions';
import { exploreRecentCharge, exploreRecentSpend, exploreUsersAction, retreatChargeAnnotation, updateChargeAnnotation, updateExpiredTime, updateUserMember } from '../../store/slices/dominationSlice';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

var pinyin = require('../../common/utils/pinyinUtil.js')

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.primary[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
}));

const TIMES_CARD_UNIT_PRICE = 200
const ANNUAL_CARD_UNIT_PRICE = 150
const UNKNOWN_COURT = '未设置校区'

const toNumber = (value, defaultValue = 0) => {
    const numberValue = parseFloat(value)
    return Number.isFinite(numberValue) ? numberValue : defaultValue
}

const calculateTotalBalance = (user) => {
    return toNumber(user.restCharge) + toNumber(user.timesCount) * TIMES_CARD_UNIT_PRICE + toNumber(user.annualCount) * ANNUAL_CARD_UNIT_PRICE
}

const isDebtUser = (user) => {
    return calculateTotalBalance(user) < 0
}

const formatNumber = (value) => {
    const numberValue = toNumber(value)
    return Number.isInteger(numberValue) ? numberValue : numberValue.toFixed(1)
}

const getMemberInitial = (name) => {
    return name ? String(name).substring(0, 1) : '?'
}

const compareMemberPriority = (a, b) => {
    const debtCompare = Number(isDebtUser(b)) - Number(isDebtUser(a))
    if (debtCompare !== 0) {
        return debtCompare
    }
    return moment(a.timesExpireTime).isAfter(moment(b.timesExpireTime)) ? -1 : 1
}


function SearchTask(props) {
    const dispatch = useDispatch()
    const index = props.index
    const CircleButton = styled(Button)({ borderRadius: '20px', })
    const [checked, setChecked] = React.useState<readonly number[]>([]);
    const [left, setLeft] = React.useState<readonly number[]>([0, 1, 2, 3]);
    const [right, setRight] = React.useState<readonly number[]>([4, 5, 6, 7]);
    // const { taskQueue, deleteTaskSuccess, cacheTree, createFolderSuccess, errorMsg, folderAsyncStatus, currentSelectFolderTree } = useSelector((state) => state.inSensitive)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { court, users, sortValue, charedLog, spendLog, createSuccess, course, coach } = useSelector((state) => state.domination)

    const { success } = useSelector((state) => state.users)


    const [charedLogRec, setCharedLogRec] = React.useState(charedLog);


    const [prepaidCard, setPrepaidCard] = React.useState({});
    const [currentYonth, setCurrentYonth] = React.useState(0);
    const [currentAdult, setCurrentAdult] = React.useState(0);
    const [courseList, setCourseList] = React.useState([]);
    const [detailMode, setDetailMode] = React.useState(false);
    const [userSort, setUserSort] = React.useState<any[]>([]);
    const [customerName, setCustomerName] = React.useState('');
    const [customerOpenId, setCustomerOpenId] = React.useState('');
    const [annualTimes, setAnnualTimes] = React.useState(prepaidCard.annualCount || 0);
    const [worth, setWorth] = React.useState(prepaidCard.worth || 0);
    const [courtSelect, setCourtSelect] = React.useState('');
    const [coachSelect, setCoachSelect] = React.useState('');
    const [expiredTime, setExpiredTime] = React.useState(prepaidCard.annualExpireTime || '');
    const [open, setOpen] = React.useState(0);//0 关；  1 金额  ；  2   次数

    const [create, setCreate] = React.useState(0);//0 关；  1 显示

    const [changeFee, setChangeFee] = React.useState(0);//0 关；  1 金额  ；  2   次数
    const [changeCount, setChangeCount] = React.useState(0);//0 关；  1 金额  ；  2   次数
    const [changeDesc, setChangeDesc] = React.useState('');
    const [chargeDate, setChargeDate] = React.useState(moment().format('YYYY-MM-DD HH:mm:ss'));
    const [yonth, setYonth] = React.useState(0);
    const [adult, setAdult] = React.useState(0);
    const [groupExpanded, setGroupExpanded] = React.useState({ 'debt-users': true });
    const [createUser, setCreateUser] = React.useState({ number: '', name: '', court: '' });//创建用户数据
    useEffect(() => {

        if (users) {
            // setDetailMode(false)
            let sorts = users.concat()
            var _yonth = 0
            var _adult = 0
            sorts.forEach(u => {
                _yonth += u.younths
                _adult += u.adults
            })
            setYonth(_yonth)
            setAdult(_adult)
            sorts.sort((a, b) => {
                // return pinyin.pinyinUtil.getFirstLetter((a.name).substring(0, 1)).toUpperCase() > pinyin.pinyinUtil.getFirstLetter((b.name).substring(0, 1)).toUpperCase() ? 1 : -1
                // return (a.restCharge + a.equivalentBalance) > (b.equivalentBalance + b.restCharge) ? 1 : -1
              
                return  moment(a.timesExpireTime).isAfter( moment(b.timesExpireTime)) ? -1 : 1
            })
            setUserSort(sorts)
        }
        else {
            setUserSort([])
        }
    }, [users])

    const debtUsers = React.useMemo(() => {
        if (!userSort) {
            return []
        }
        return userSort.filter((user) => isDebtUser(user)).sort(compareMemberPriority)
    }, [userSort])

    const userGroupsByCourt = React.useMemo(() => {
        if (!userSort) {
            return []
        }

        const courtSortValues = (court || []).map((courtItem) => courtItem.name)
        const grouped = userSort.reduce((result, user) => {
            const courtName = user.court || UNKNOWN_COURT
            if (!result[courtName]) {
                result[courtName] = []
            }
            result[courtName].push(user)
            return result
        }, {})

        const orderedCourtNames = courtSortValues.filter((courtName) => grouped[courtName])
        Object.keys(grouped).forEach((courtName) => {
            if (!orderedCourtNames.includes(courtName)) {
                orderedCourtNames.push(courtName)
            }
        })

        return orderedCourtNames.map((courtName) => ({
            name: courtName,
            users: grouped[courtName].sort(compareMemberPriority),
        }))
    }, [court, userSort])


    useEffect(() => {
        if (customerName) {
            setDetailMode(true)
            console.log("🚀 ~ file: searchTask.tsx ~ line 71 ~ SearchTask ~ prepaidCard", prepaidCard)
        }
    }, [customerName])

    useEffect(() => {

        setCharedLogRec(charedLog)
        console.log('-------charedLog-----', charedLog)
    }, [charedLog])


    useEffect(() => {
        if (createSuccess) {

            dispatch(exploreUsersAction())
            dispatch(exploreRecentCharge(customerOpenId))
            enqueueSnackbar(`充值成功`, {
                variant: 'success',
                autoHideDuration: 3000,
            })


            setOpen(0)
        }
    }, [createSuccess])


    useEffect(() => {
        if (success) {
            enqueueSnackbar(`添加会员成功`, {
                variant: 'success',
                autoHideDuration: 3000,
            })
            dispatch(exploreUsersAction())
        }
    }, [success])


    useEffect(() => {
        if (users && customerOpenId) {
            var _card = users.filter(u => u.number === customerOpenId)[0]
            setPrepaidCard(_card)
            setCurrentYonth(_card.younths)
            setCurrentAdult(_card.adults)
        }
    }, [users])









    const memberItem = (<Stack
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
        direction="row"
    >
        <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
        >
            小朋友：
            <InputBase
                // sx={{ ml: 1, flex: 1 }}
                onChange={(e) => {
                    console.log('---------小朋友', e.target.value)
                    setCurrentYonth(e.target.value)
                }}
                inputProps={{ 'aria-label': 'search google maps' }}
                value={currentYonth}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search"
                onClick={() => {
                    dispatch(updateUserMember({ number: prepaidCard.number, yonth: currentYonth, adult: prepaidCard.adults }))
                }}>
                <CheckCircleIcon />
            </IconButton>

        </Paper>
        <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
        >
            成年人：
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                onChange={(e) => {
                    console.log('---------成年人', e.target.value)
                    setCurrentAdult(e.target.value)
                }}
                inputProps={{ 'aria-label': 'search google maps' }}
                value={currentAdult}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search"
                onClick={() => {
                    dispatch(updateUserMember({ number: prepaidCard.number, yonth: prepaidCard.younths, adult: currentAdult }))
                }}>
                <CheckCircleIcon />
            </IconButton>

        </Paper>


    </Stack>)
    const finacialItem =
        (<Stack
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
            direction="row"
        >
            <Typography gutterBottom variant="body2"
                sx={{
                    color: 'rgba(0, 0, 0, 0.6)',

                }} >
                会员名称：{customerName}
            </Typography>
            <Typography gutterBottom variant="body2"
                sx={{
                    color: 'rgba(0, 0, 0, 0.6)', cursor: 'pointer',
                }}
                onClick={() => {
                    setOpen(1)
                    console.log('-------1------11--------11----1----')
                    // dispatch(updateEx1piredTime({cardId:customerName,time: moment(expiredTime).format( 'YYYY-MM-DD'),rest:parseInt(annualTimes)}))
                }}
            >
                充值卡余额：{prepaidCard.restCharge}
            </Typography>
            <Typography gutterBottom variant="body2"
                sx={{
                    color: 'rgba(0, 0, 0, 0.6)', cursor: 'pointer',
                }}
                onClick={() => {
                    console.log('---------------------2222--------')
                    setOpen(2)
                    // dispatch(updateExpiredTime({cardId:customerName,time: moment(expiredTime).format( 'YYYY-MM-DD'),rest:parseInt(annualTimes)}))
                }}
            >
                次卡余额：  {prepaidCard.timesCount}
            </Typography>
            {/* <Typography gutterBottom variant="body2"
                sx={{
                    color: 'rgba(0, 0, 0, 0.6)',
                }} >
                次卡到期时间  {prepaidCard.timesExpireTime}
            </Typography> */}
            <Typography gutterBottom variant="body2"
                sx={{
                    color: 'rgba(0, 0, 0, 0.6)', cursor: 'pointer',
                }}
                onClick={() => {
                    console.log('---------------------2222--------')
                    setOpen(2)
                    // dispatch(updateExpiredTime({cardId:customerName,time: moment(expiredTime).format( 'YYYY-MM-DD'),rest:parseInt(annualTimes)}))
                }}>
                剩余年卡次数  {prepaidCard.annualCount}
            </Typography>
            <Typography gutterBottom variant="body2"
                sx={{
                    color: 'rgba(0, 0, 0, 0.6)',
                }} >
                年卡到期时间  {prepaidCard.annualExpireTime}
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <FormControl sx={{ m: 1, minWidth: 120, }} size="small">
                    <TextField
                        id="date"
                        label="Birthday"
                        type="date"
                        value={expiredTime}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(newValue) => {
                            console.log("🚀 ~ file: additions.tsx ~ line 665 ~ Additions ~ newValue", newValue)
                            setExpiredTime(newValue.currentTarget.value)
                        }}
                    />
                    {/* <DatePicker
                        label="年卡到期时间"
                        value={expiredTime}
                        onChange={(newValue) => {
                            console.log("🚀 ~ file: additions.tsx ~ line 665 ~ Additions ~ newValue", newValue)
                            setExpiredTime(newValue)
                        }}
                        renderInput={(params) => {
                            return (<TextField {...params} />)
                        }}
                    /> */}
                </FormControl>
            </LocalizationProvider>


            <Button variant="contained" size="small"
                disabled={expiredTime === ''}

                onClick={() => {
                    console.log('---expiredTime-', expiredTime)
                    dispatch(updateExpiredTime({ number: customerOpenId, annualExpireTime: moment(expiredTime).format('YYYY-MM-DD') }))

                }}>修改年卡时间次数</Button>

        </Stack>)


    const fileItem = (user, index, keyPrefix = 'user') => {
        const debt = isDebtUser(user)
        const expired = user.timesExpireTime && moment().isAfter(user.timesExpireTime)
        const totalBalance = calculateTotalBalance(user)

        return (
            <Paper
                key={`${keyPrefix}-${user.number || index}`}
                elevation={0}
                onClick={() => {
                    setPrepaidCard(user)
                    setCustomerName(user.name)
                    setCustomerOpenId(user.number)
                    dispatch(exploreRecentCharge(user.number))
                    dispatch(exploreRecentSpend(user.number))
                    setCurrentYonth(user.younths)
                    setCurrentAdult(user.adults)
                }}
                sx={{
                    width: '100%',
                    minHeight: 104,
                    border: '1px solid',
                    borderColor: debt ? 'rgba(211, 47, 47, 0.35)' : expired ? 'rgba(237, 108, 2, 0.35)' : 'rgba(0, 0, 0, 0.08)',
                    background: debt ? 'rgba(211, 47, 47, 0.06)' : expired ? 'rgba(237, 108, 2, 0.06)' : '#fff',
                    cursor: 'pointer',
                    transition: 'background 120ms ease, border-color 120ms ease, box-shadow 120ms ease',
                    '&:hover': {
                        background: debt ? 'rgba(211, 47, 47, 0.1)' : expired ? 'rgba(237, 108, 2, 0.1)' : 'rgba(25, 118, 210, 0.04)',
                        borderColor: debt ? 'rgba(211, 47, 47, 0.55)' : expired ? 'rgba(237, 108, 2, 0.55)' : 'rgba(25, 118, 210, 0.24)',
                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
                    },
                }}
            >
                <Stack
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="stretch"
                    spacing={1}
                    sx={{ p: 1.5 }}
                >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
                        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36,
                                    bgcolor: debt ? 'error.main' : expired ? 'warning.main' : 'primary.main',
                                    fontSize: 17,
                                }}
                            >
                                {getMemberInitial(user.name)}
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ flexWrap: 'wrap' }}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: 700, maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                    >
                                        {user.name || '未命名'}
                                    </Typography>
                                    {debt && <Chip label="欠费" size="small" color="error" />}
                                    {!debt && expired && <Chip label="已过期" size="small" color="warning" />}
                                    {!debt && !expired && <Chip label="正常" size="small" color="success" />}
                                </Stack>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {user.number || '无手机号'}
                                </Typography>
                            </Box>
                        </Stack>

                        <Chip
                            label={`折算余额 ${formatNumber(totalBalance)}`}
                            size="small"
                            color={debt ? 'error' : 'default'}
                            variant={debt ? 'filled' : 'outlined'}
                        />
                    </Stack>

                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{
                            flexWrap: 'wrap',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <Chip label={user.court || UNKNOWN_COURT} size="small" variant="outlined" />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>余额：{formatNumber(user.restCharge)}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>次卡：{formatNumber(user.timesCount)}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>年卡：{formatNumber(user.annualCount)}</Typography>
                        <Typography variant="body2" sx={{ color: expired ? 'warning.main' : 'text.secondary' }}>
                            到期：{user.timesExpireTime || '-'}
                        </Typography>
                    </Stack>
                </Stack>
            </Paper>
        )
    }

    const userGroupItem = (title, groupUsers, keyPrefix) => {
        const expanded = groupExpanded[keyPrefix] !== false
        const debtCount = groupUsers.filter((user) => isDebtUser(user)).length

        return (
            <Stack
                key={keyPrefix}
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={1}
                sx={{ width: '100%' }}
            >
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    onClick={() => {
                        setGroupExpanded({ ...groupExpanded, [keyPrefix]: !expanded })
                    }}
                    sx={{
                        width: '100%',
                        pt: 1,
                        cursor: 'pointer',
                        userSelect: 'none',
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton
                            size="small"
                            sx={{
                                transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                                transition: 'transform 120ms ease',
                            }}
                        >
                            <ExpandMoreIcon fontSize="small" />
                        </IconButton>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {title}
                        </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        {debtCount > 0 && <Chip label={`欠费 ${debtCount}`} size="small" color="error" />}
                        <Chip label={`${groupUsers.length} 人`} size="small" variant="outlined" />
                    </Stack>
                </Stack>
                <Divider sx={{ width: '100%' }} />
                <Collapse in={expanded} timeout={120} unmountOnExit sx={{ width: '100%' }}>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                            gap: 1,
                            width: '100%',
                        }}
                    >
                        {groupUsers.map((file, index) => fileItem(file, index, keyPrefix))}
                    </Box>
                    {groupUsers.length === 0 && (
                        <Typography variant="body2" sx={{ color: 'text.secondary', py: 1 }}>
                            暂无会员
                        </Typography>
                    )}
                </Collapse>
            </Stack>
        )
    }
    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',

        boxShadow: 0,
        p: 4,
    };


    const uploadWaitingModal = (
        <Modal
            open={open !== 0}
            onClose={() => { setOpen(0) }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style} >
                <Stack
                    direction="column"
                    justifyContent="space-around"
                    alignItems="center"
                    spacing={1}>
                    <TextField
                        id="outlined-password-input"
                        label="充值余额"
                        value={changeFee}
                        onChange={(e) => {
                            setChangeFee(e.target.value);
                        }}
                    />
                    <TextField
                        id="outlined-password-input2"
                        label="充值次数"
                        value={changeCount}
                        onChange={(e) => {
                            setChangeCount(e.target.value);
                        }}
                    />
                    <TextField
                        label="年卡次数"
                        required
                        value={annualTimes}
                        onChange={(event: any) => {
                            setAnnualTimes(event.target.value)
                        }}
                    />
                    <TextField
                        label="次年卡等价金额"
                        required
                        value={worth}
                        onChange={(event: any) => {
                            setWorth(event.target.value)
                        }}
                    />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="充值日期"
                            value={moment(chargeDate).toDate()}
                            onChange={(newValue) => {
                                if (newValue) {
                                    setChargeDate(moment(newValue).format('YYYY-MM-DD HH:mm:ss'));
                                }
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    <Select label="FileTypes" labelId="demo-controlled-open-select-label12"
                        name='FileTypes'
                        size="small"
                        onChange={(e) => {
                            //   let after = { ...courseEdit, court: e.target.value }
                            //   setCourseEdit(after)
                            setCourtSelect(e.target.value);
                        }}
                        value={courtSelect}>
                        {court && court.map((dict, index) => { return (<MenuItem key={`select2-${dict.name}`} value={dict.name}>{dict.name}</MenuItem>) })}
                    </Select>
                    <Select label="教练" labelId="demo-controlled-open-select-label12"
                        name='教练'
                        size="small"
                        onChange={(e) => {
                            //   let after = { ...courseEdit, court: e.target.value }
                            //   setCourseEdit(after)
                            setCoachSelect(e.target.value);
                        }}
                        value={coachSelect}>
                        {coach && coach.map((dict, index) => { return (<MenuItem key={`select2-${dict.name}`} value={dict.name}>{dict.name}</MenuItem>) })}
                    </Select>

                    <TextField
                        id="outlined-password-input3"
                        label="备注"
                        value={changeDesc}
                        onChange={(e) => {
                            setChangeDesc(e.target.value);
                        }}
                    />
                    <Button variant="contained" size="small"

                        onClick={() => {
                            console.log('---------', {
                                number: customerOpenId, charged: parseInt(changeFee), annualTimes: parseInt(annualTimes),
                                times: parseInt(changeCount), description: changeDesc, worth: parseInt(worth), court: courtSelect, coach: coachSelect,
                                time: chargeDate
                            })
                            dispatch(updateChargeAnnotation({
                                number: customerOpenId, charged: parseInt(changeFee), annualTimes: parseInt(annualTimes),
                                times: parseInt(changeCount), description: changeDesc, worth: parseInt(worth), court: courtSelect, coach: coachSelect,
                                time: chargeDate
                            }))
                        }}>确定充值</Button>
                </Stack>
            </Box>
        </Modal>
    )




    const createModal = (
        <Modal
            open={create !== 0}
            onClose={() => { setCreate(0) }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style} >
                <Stack
                    direction="column"
                    justifyContent="space-around"
                    alignItems="center"
                    spacing={1}>
                    <TextField
                        id="outlined-password-input"
                        label="名字"
                        value={createUser.name}
                        onChange={(e) => {
                            setCreateUser({ ...createUser, name: e.target.value });
                        }}
                    />
                    <TextField
                        id="outlined-password-input2"
                        label="电话"
                        value={createUser.number}
                        onChange={(e) => {
                            setCreateUser({ ...createUser, number: e.target.value });
                        }}
                    />
                    <Select label="FileTypes" labelId="demo-controlled-open-select-label12"
                        name='FileTypes'
                        size="small"
                        onChange={(e) => {
                            //   let after = { ...courseEdit, court: e.target.value }
                            //   setCourseEdit(after)
                            setCreateUser({ ...createUser, court: e.target.value });
                        }}
                        value={createUser.court}>
                        {court && court.map((dict, index) => { return (<MenuItem key={`select2-${dict.name}`} value={dict.name}>{dict.name}</MenuItem>) })}
                    </Select>

                    <Button variant="contained" size="small"
                        onClick={() => {
                            dispatch(createUserAccount(createUser.name, createUser.number, createUser.court))
                            console.log('------确定添加---', createUser)
                        }}>确定添加</Button>

                </Stack>
            </Box>
        </Modal>
    )



    const chargeItem = (charge) => {

        return (<Paper key={`charge-item-${charge.id}`} elevation={1} sx={{
            minWidth: '850px',
            background: 'transparent',
            '& :hover': { background: 'rgb(0,0,0,0.1)' }
        }}>
            <Stack

                spacing={2}
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                sx={{ padding: 1, background: 'transparent', '& :hover': { background: 'transparent' } }}
            >

                <Typography gutterBottom variant="body2"
                    sx={{
                        color: 'rgba(0, 0, 0, 0.6)',
                        minWidth: '80px',
                    }} >
                    {charge.chargedTime}
                </Typography>
                <Typography gutterBottom variant="body2"
                    sx={{
                        color: 'rgba(0, 0, 0, 0.6)',
                        minWidth: '80px',
                    }} >
                    {charge.description}
                </Typography>
                <Typography gutterBottom variant="body2"
                    sx={{
                        color: 'rgba(0, 0, 0, 0.6)',
                        minWidth: '80px',
                    }} >
                    充值{charge.charge}元，次卡{charge.times},年卡{charge.annualTimes}
                </Typography>


                <Button
                    variant="outlined"
                    color="primary"
                    sx={{
                        color: 'rgba(0, 0, 0, 0.6)',
                        minWidth: '80px',
                    }}
                    onClick={() => {
                        console.log(charge)
                        dispatch(retreatChargeAnnotation(charge.id))
                    }}
                >

                    删除
                </Button>
            </Stack>
        </Paper>)
    }


    return (
        <Stack justifyContent="flex-start"
            alignItems="flex-start"
            sx={{ marginLeft: 2, overflowY: 'auto', height: '100%', paddingBottom: -2 }}
            spacing={2}
        >
            <Stack justifyContent="flex-start"
                alignItems="center"
                spacing={2}
                direction="row"
            >
                <CircleButton

                    size="small"
                    variant={1 === 1 ? "contained" : "outlined"}
                    sx={{ margin: '5px' }}
                    onClick={
                        (e) => {
                            setCreate(1)
                            // if (!values.includes(e.target.value)) {
                            //   values.push(e.target.value)
                            // } else {
                            //   values = values.filter(value => e.target.value !== value)
                            // }
                            // params[props.searchType] = values
                            // delete params["topic"];
                            // navigate(`/explore?${qs.stringify(params, { arrayFormat: 'brackets' })}`)
                        }
                    }
                >
                    添加会员
                </CircleButton>


                {!detailMode && sortValue.map((a, ids) => {
                    return (
                        <CircleButton
                            key={ids}
                            value={a}
                            size="small"
                            variant={1 === 1 ? "contained" : "outlined"}
                            sx={{ margin: '5px' }}
                            onClick={
                                (e) => {
                                    // if (!values.includes(e.target.value)) {
                                    //   values.push(e.target.value)
                                    // } else {
                                    //   values = values.filter(value => e.target.value !== value)
                                    // }
                                    // params[props.searchType] = values
                                    // delete params["topic"];
                                    // navigate(`/explore?${qs.stringify(params, { arrayFormat: 'brackets' })}`)
                                }
                            }
                        >
                            {a}
                        </CircleButton>
                    )
                })}
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={async () => {
                        if (detailMode) {
                            setDetailMode(!detailMode)
                            setCustomerName('')
                        }


                    }}
                >
                    {detailMode ? <ArrowBackIcon /> : <CachedIcon onClick={async () => {
                        dispatch(exploreUsersAction())

                    }} />}
                </IconButton>
                {!detailMode && (<Stack justifyContent="flex-start"
                    alignItems="center"
                    spacing={2}
                    direction="row"
                >小朋友：{yonth} || 成年人：{adult}</Stack>)}
            </Stack>
            {!detailMode && (<Stack
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={3}
                sx={{ width: '100%' }}>
                {userGroupItem('欠费会员', debtUsers, 'debt-users')}
                {userGroupsByCourt.map((group) => userGroupItem(group.name, group.users, `court-${group.name}`))}
            </Stack>)}

            {detailMode && finacialItem}
            {detailMode && memberItem}

            <Stack justifyContent="flex-start"

                spacing={2}
                direction="row"
            >
                {detailMode && <Stack justifyContent="flex-start"

                    spacing={2}
                    direction="column"
                >
                    {spendLog.map((c, i) => CourseItem({ item: c, }))}
                </Stack>}
                {detailMode && <Stack justifyContent="flex-start"

                    spacing={2}
                    direction="column"
                >
                    {charedLogRec.map((c, i) => chargeItem(c))}
                </Stack>}
            </Stack>


            <Typography gutterBottom variant="body2">&nbsp;</Typography>
            {uploadWaitingModal}
            {createModal}

        </Stack>
    );
}
export default SearchTask
