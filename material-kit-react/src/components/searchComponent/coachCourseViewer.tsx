import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import Axios from '../../common/axios/axios'

interface Coach {
  id: number
  name: string
  number: string
  isActive: number
}

interface CourseMember {
  memberId: number
  memberName: string
  memberNumber: string
  charge: number
  times: number
  annualTimes: number
  description: string | number
  quantities: number
}

interface CoachCourse {
  id: number
  coachId: number
  coachName: string
  courtId: number
  courtName: string
  startTime: string
  endTime: string
  duration: number
  courseType: number
  isAdult: number | null
  description: string
  membersData: CourseMember[]
}

interface CourseSummary {
  totalHours: number
  trialHours: number
  groupHours: number
  privateHours: number
}

interface CoachCourseDashboard {
  coachId: number
  coachName: string
  month: string
  summary: CourseSummary
  courses: CoachCourse[]
}

const emptySummary: CourseSummary = {
  totalHours: 0,
  trialHours: 0,
  groupHours: 0,
  privateHours: 0,
}

const emptyDashboard: CoachCourseDashboard = {
  coachId: 0,
  coachName: '',
  month: '',
  summary: emptySummary,
  courses: [],
}

const courseTypeLabels: Record<number, string> = {
  [-2]: '体验课未成单',
  [-1]: '体验课成单',
  0: '订场（不计入课时）',
  1: '班课',
  2: '私教',
}

const currentMonth = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

const isValidMonth = (value: string) => /^\d{4}-(0[1-9]|1[0-2])$/.test(value)
const errorMessage = (error: any) => error?.response?.data?.message || error?.message || '请求失败，请稍后重试'
const displayNumber = (value: number | null | undefined) => Number(value || 0)
const datePart = (value: string) => value ? value.slice(0, 10) : '—'
const timePart = (value: string) => value && value.length >= 16 ? value.slice(11, 16) : (value || '—')

const memberExportText = (member: CourseMember | undefined) => {
  if (!member) return ''
  const identity = `${member.memberName || '已失效会员'}${member.memberNumber ? `（${member.memberNumber}）` : ''}`
  const consumption = `课时费 ${displayNumber(member.charge)}；次卡 ${displayNumber(member.times)}；年卡 ${displayNumber(member.annualTimes)}；数量 ${displayNumber(member.quantities)}`
  const description = member.description !== null && member.description !== undefined && String(member.description) !== ''
    ? `；说明 ${String(member.description)}`
    : ''
  return `${identity}；${consumption}${description}`
}

const SummaryCard = ({ label, value, note }: { label: string, value: number, note: string }) => <Card variant="outlined" sx={{ height: '100%' }}>
  <CardContent>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
    <Typography variant="h4" sx={{ my: 0.5 }}>{displayNumber(value)} <Typography component="span" variant="body1" color="text.secondary">小时</Typography></Typography>
    <Typography variant="caption" color="text.secondary">{note}</Typography>
  </CardContent>
</Card>

const CoachCourseViewer = () => {
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [coachId, setCoachId] = useState('')
  const [month, setMonth] = useState(currentMonth)
  const [dashboard, setDashboard] = useState<CoachCourseDashboard>(emptyDashboard)
  const [loadingCoaches, setLoadingCoaches] = useState(true)
  const [loadingCourses, setLoadingCourses] = useState(false)
  const [coachError, setCoachError] = useState('')
  const [courseError, setCourseError] = useState('')
  const [monthError, setMonthError] = useState('')
  const requestSeqRef = useRef(0)
  const mountedRef = useRef(true)

  const loadCoaches = useCallback(async () => {
    setLoadingCoaches(true)
    setCoachError('')
    try {
      const response = await Axios.get('/api/user/coach')
      if (!mountedRef.current) return
      const activeCoaches: Coach[] = (Array.isArray(response.data) ? response.data : [])
        .filter((coach) => Number(coach.isActive) === 1)
      setCoaches(activeCoaches)
      setCoachId((previous) => activeCoaches.some((coach) => String(coach.id) === previous)
        ? previous
        : (activeCoaches[0] ? String(activeCoaches[0].id) : ''))
    } catch (error) {
      if (mountedRef.current) setCoachError(errorMessage(error))
    } finally {
      if (mountedRef.current) setLoadingCoaches(false)
    }
  }, [])

  const loadCourses = useCallback(async (selectedCoachId: string, selectedMonth: string) => {
    if (!selectedCoachId || !isValidMonth(selectedMonth)) return
    const requestSeq = ++requestSeqRef.current
    setLoadingCourses(true)
    setCourseError('')
    try {
      const response = await Axios.get(`/api/prepaidCard/course/coach/${selectedCoachId}`, {
        params: { month: selectedMonth },
      })
      if (!mountedRef.current || requestSeq !== requestSeqRef.current) return
      const data = response.data || {}
      setDashboard({
        ...emptyDashboard,
        ...data,
        summary: { ...emptySummary, ...(data.summary || {}) },
        courses: Array.isArray(data.courses) ? data.courses : [],
      })
    } catch (error) {
      if (!mountedRef.current || requestSeq !== requestSeqRef.current) return
      setDashboard(emptyDashboard)
      setCourseError(errorMessage(error))
    } finally {
      if (mountedRef.current && requestSeq === requestSeqRef.current) setLoadingCourses(false)
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    loadCoaches()
    return () => {
      mountedRef.current = false
      requestSeqRef.current += 1
    }
  }, [loadCoaches])

  useEffect(() => {
    if (!coachId || !isValidMonth(month)) return
    setMonthError('')
    loadCourses(coachId, month)
  }, [coachId, loadCourses, month])

  const courses = Array.isArray(dashboard.courses) ? dashboard.courses : []
  const maxMemberCount = useMemo(() => courses.reduce((maximum, course) => (
    Math.max(maximum, Array.isArray(course.membersData) ? course.membersData.length : 0)
  ), 0), [courses])

  const rows = useMemo(() => courses.map((course) => {
    const members = Array.isArray(course.membersData) ? course.membersData : []
    const row: Record<string, any> = {
      ...course,
      membersData: members,
      duration: displayNumber(course.duration),
      startClock: timePart(course.startTime),
      endClock: timePart(course.endTime),
      courseTypeLabel: courseTypeLabels[Number(course.courseType)] || `未知类型（${course.courseType}）`,
      ageGroup: Number(course.courseType) === 0
        ? '—'
        : (course.isAdult === null || course.isAdult === undefined ? '—' : (Number(course.isAdult) === 1 ? '成人' : '儿童')),
      courtDisplay: course.courtName || `已失效校区（${course.courtId}）`,
      memberCount: members.length,
    }
    members.forEach((member, index) => {
      row[`member_${index}`] = memberExportText(member)
    })
    return row
  }), [courses])

  const columns = useMemo<GridColDef[]>(() => {
    const fixedColumns: GridColDef[] = [
      {
        field: 'startTime',
        headerName: '日期',
        width: 115,
        valueFormatter: (params) => datePart(String(params.value || '')),
        renderCell: (params) => datePart(String(params.value || '')),
      },
      { field: 'startClock', headerName: '上课', width: 85 },
      { field: 'endClock', headerName: '下课', width: 85 },
      {
        field: 'duration',
        headerName: '课时',
        type: 'number',
        width: 90,
        renderCell: (params) => `${displayNumber(params.value as number)} 小时`,
      },
      { field: 'courseTypeLabel', headerName: '课程类型', width: 175 },
      { field: 'ageGroup', headerName: '成人/儿童', width: 110 },
      { field: 'courtDisplay', headerName: '校区', width: 150 },
      {
        field: 'description',
        headerName: '备注',
        width: 220,
        renderCell: (params) => <Typography variant="body2" noWrap title={String(params.value || '')} sx={{ width: '100%' }}>
          {params.value || '—'}
        </Typography>,
      },
      { field: 'memberCount', headerName: '学员记录数', type: 'number', width: 120 },
    ]

    const memberColumns: GridColDef[] = Array.from({ length: maxMemberCount }, (_, index) => ({
      field: `member_${index}`,
      headerName: `学员 ${index + 1}`,
      width: 285,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const member = (params.row.membersData || [])[index] as CourseMember | undefined
        if (!member) return <Typography variant="body2" color="text.secondary">—</Typography>
        const hasDescription = member.description !== null && member.description !== undefined && String(member.description) !== ''
        return <Box title={memberExportText(member)} sx={{ py: 0.5, width: '100%', minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap sx={{ lineHeight: 1.3 }}>{member.memberName || '已失效会员'}{member.memberNumber ? `（${member.memberNumber}）` : ''}</Typography>
          <Typography variant="body2" noWrap color="text.secondary" sx={{ lineHeight: 1.3 }}>课时费 {displayNumber(member.charge)} / 次卡 {displayNumber(member.times)}</Typography>
          <Typography variant="body2" noWrap color="text.secondary" sx={{ lineHeight: 1.3 }}>年卡 {displayNumber(member.annualTimes)} / 数量 {displayNumber(member.quantities)}</Typography>
          {hasDescription && <Typography variant="body2" noWrap color="text.secondary" sx={{ lineHeight: 1.3 }}>说明：{String(member.description)}</Typography>}
        </Box>
      },
    }))
    return [...fixedColumns, ...memberColumns]
  }, [maxMemberCount])

  const updateMonth = (value: string) => {
    requestSeqRef.current += 1
    setLoadingCourses(false)
    setCourseError('')
    setDashboard(emptyDashboard)
    setMonth(value)
    setMonthError(isValidMonth(value) ? '' : '请选择有效的自然月。')
  }

  const updateCoach = (value: string) => {
    requestSeqRef.current += 1
    setLoadingCourses(false)
    setCourseError('')
    setDashboard(emptyDashboard)
    setCoachId(value)
  }

  return <Box sx={{ width: '100%', height: '100%', overflow: 'auto', pr: 2, pb: 3 }}>
    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={1} sx={{ mb: 2 }}>
      <Box>
        <Typography variant="h5">教练课程综合看板</Typography>
        <Typography variant="body2" color="text.secondary">查看有效教练整月正式课程及授课课时；订场仅展示，不计入授课课时。</Typography>
      </Box>
      <Button variant="outlined" startIcon={<RefreshIcon />} disabled={!coachId || !isValidMonth(month) || loadingCourses}
        onClick={() => loadCourses(coachId, month)}>刷新</Button>
    </Stack>

    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size="small" disabled={loadingCoaches || coaches.length === 0}>
            <InputLabel id="coach-course-coach-label">教练</InputLabel>
            <Select labelId="coach-course-coach-label" value={coachId} label="教练"
              onChange={(event) => updateCoach(String(event.target.value))}>
              {coaches.map((coach) => <MenuItem key={coach.id} value={String(coach.id)}>{coach.name}（{coach.number}）</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField fullWidth size="small" type="month" label="自然月" value={month} disabled={loadingCoaches}
            InputLabelProps={{ shrink: true }} inputProps={{ 'aria-label': '自然月' }} onChange={(event) => updateMonth(event.target.value)} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="body2" color="text.secondary">选择教练或月份后自动加载整月数据。</Typography>
        </Grid>
      </Grid>
      {monthError && <Alert severity="warning" sx={{ mt: 2 }}>{monthError}</Alert>}
    </Paper>

    {coachError && <Alert severity="error" action={<Button color="inherit" size="small" onClick={loadCoaches}>重新加载</Button>} sx={{ mb: 2 }}>
      教练列表加载失败：{coachError}
    </Alert>}
    {!loadingCoaches && !coachError && coaches.length === 0 && <Alert severity="info" sx={{ mb: 2 }}>暂无有效教练。</Alert>}
    {courseError && <Alert severity="error" action={coachId ? <Button color="inherit" size="small" onClick={() => loadCourses(coachId, month)}>重试</Button> : undefined} sx={{ mb: 2 }}>
      {courseError}
    </Alert>}

    <Grid container spacing={2} sx={{ mb: 2, opacity: loadingCourses ? 0.55 : 1 }}>
      <Grid item xs={12} sm={6} lg={3}><SummaryCard label="授课总课时" value={dashboard.summary.totalHours} note="体验课 + 班课 + 私教" /></Grid>
      <Grid item xs={12} sm={6} lg={3}><SummaryCard label="体验课课时" value={dashboard.summary.trialHours} note="包含成单与未成单体验课" /></Grid>
      <Grid item xs={12} sm={6} lg={3}><SummaryCard label="班课课时" value={dashboard.summary.groupHours} note="按课程专用课时字段统计" /></Grid>
      <Grid item xs={12} sm={6} lg={3}><SummaryCard label="私教课时" value={dashboard.summary.privateHours} note="订场不计入任何授课课时" /></Grid>
    </Grid>

    <Paper variant="outlined" sx={{ height: { xs: 900, md: 1040 }, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loadingCourses}
        pageSize={100}
        rowsPerPageOptions={[25, 50, 100]}
        getRowHeight={({ densityFactor }) => Math.max(78, Math.round(88 * densityFactor))}
        rowBuffer={12}
        disableSelectionOnClick
        components={{ Toolbar: GridToolbar }}
        componentsProps={{
          toolbar: {
            csvOptions: { utf8WithBom: true, fileName: `教练课程-${dashboard.coachName || coachId}-${month}` },
            printOptions: { hideFooter: true, hideToolbar: true },
          },
        }}
        initialState={{ sorting: { sortModel: [{ field: 'startTime', sort: 'asc' }] } }}
        localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
        sx={{
          border: 0,
          '& .MuiDataGrid-cell': { alignItems: 'flex-start', py: 0.5 },
          '& .MuiDataGrid-columnHeaders': { backgroundColor: 'action.hover' },
        }}
      />
    </Paper>
  </Box>
}

export default CoachCourseViewer
