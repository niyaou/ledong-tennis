import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
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
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
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
  isAdult: number
  description: string
  membersData: CourseMember[]
}

interface CoursePage {
  content: CoachCourse[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  numberOfElements: number
  first: boolean
  last: boolean
}

const courseTypeLabels: Record<number, string> = {
  [-2]: '体验课未成单',
  [-1]: '体验课成单',
  0: '订场',
  1: '班课',
  2: '私教',
}

const toDateInput = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const defaultDateRange = () => {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - 2, 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return { startDate: toDateInput(start), endDate: toDateInput(end) }
}

const initialRange = defaultDateRange()
const emptyPage: CoursePage = {
  content: [], totalElements: 0, totalPages: 0, size: 50, number: 0,
  numberOfElements: 0, first: true, last: true,
}

const validDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}
const errorMessage = (error: any) => error?.response?.data?.message || error?.message || '请求失败，请稍后重试'
const displayNumber = (value: number | null | undefined) => Number(value || 0)

const CoachCourseViewer = () => {
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [coachId, setCoachId] = useState('')
  const [startDate, setStartDate] = useState(initialRange.startDate)
  const [endDate, setEndDate] = useState(initialRange.endDate)
  const [page, setPage] = useState<CoursePage>(emptyPage)
  const [pageInput, setPageInput] = useState('1')
  const [loadingCoaches, setLoadingCoaches] = useState(true)
  const [loadingCourses, setLoadingCourses] = useState(false)
  const [hasQueried, setHasQueried] = useState(false)
  const [coachError, setCoachError] = useState('')
  const [courseError, setCourseError] = useState('')
  const [dateError, setDateError] = useState('')
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const requestSeqRef = useRef(0)
  const mountedRef = useRef(true)

  const validateDates = useCallback(() => {
    if (!validDate(startDate) || !validDate(endDate)) {
      setDateError('请选择有效的开始日期和结束日期。')
      return false
    }
    if (startDate > endDate) {
      setDateError('开始日期不能晚于结束日期。')
      return false
    }
    setDateError('')
    return true
  }, [endDate, startDate])

  const loadCourses = useCallback(async (requestedPage: number, selectedCoachId = coachId) => {
    if (!selectedCoachId || !validateDates()) return
    const requestSeq = ++requestSeqRef.current
    setHasQueried(true)
    setLoadingCourses(true)
    setCourseError('')
    try {
      const response = await Axios.get(`/api/prepaidCard/course/coach/${selectedCoachId}`, {
        params: { startDate, endDate, pageNum: requestedPage },
      })
      if (!mountedRef.current || requestSeq !== requestSeqRef.current) return
      const nextPage: CoursePage = response.data || emptyPage
      const currentPage = Math.max(1, Number(nextPage.number || 0) + 1)
      setPage({ ...emptyPage, ...nextPage, content: Array.isArray(nextPage.content) ? nextPage.content : [] })
      setPageInput(String(currentPage))
      setExpanded({})
    } catch (error) {
      if (!mountedRef.current || requestSeq !== requestSeqRef.current) return
      setCourseError(errorMessage(error))
    } finally {
      if (mountedRef.current && requestSeq === requestSeqRef.current) setLoadingCourses(false)
    }
  }, [coachId, endDate, startDate, validateDates])

  const loadCoaches = useCallback(async () => {
    setLoadingCoaches(true)
    setCoachError('')
    try {
      const response = await Axios.get('/api/user/coach')
      if (!mountedRef.current) return
      const activeCoaches: Coach[] = (Array.isArray(response.data) ? response.data : [])
        .filter((coach) => Number(coach.isActive) === 1)
      setCoaches(activeCoaches)
      if (activeCoaches.length > 0) {
        const firstCoachId = String(activeCoaches[0].id)
        setCoachId(firstCoachId)
        loadCourses(1, firstCoachId)
      } else {
        setCoachId('')
        setPage(emptyPage)
        setHasQueried(false)
      }
    } catch (error) {
      if (mountedRef.current) setCoachError(errorMessage(error))
    } finally {
      if (mountedRef.current) setLoadingCoaches(false)
    }
  }, [loadCourses])

  useEffect(() => {
    mountedRef.current = true
    loadCoaches()
    return () => {
      mountedRef.current = false
      requestSeqRef.current += 1
    }
  }, [])

  const currentPage = Math.max(1, Number(page.number || 0) + 1)

  const selectCoach = (value: string) => {
    setCoachId(value)
    setPage(emptyPage)
    setHasQueried(false)
    setPageInput('1')
    loadCourses(1, value)
  }

  const query = () => {
    setPageInput('1')
    loadCourses(1)
  }

  const changeDate = (field: 'start' | 'end', value: string) => {
    if (field === 'start') setStartDate(value)
    else setEndDate(value)
    requestSeqRef.current += 1
    setLoadingCourses(false)
    setPage(emptyPage)
    setHasQueried(false)
    setPageInput('1')
    setCourseError('')
    setDateError('')
  }

  const jumpPage = () => {
    const target = Number(pageInput)
    if (!Number.isInteger(target) || target < 1 || target > page.totalPages) {
      setCourseError(`请输入 1 到 ${page.totalPages} 之间的页码。`)
      return
    }
    loadCourses(target)
  }

  return <Box sx={{ width: '100%', height: '100%', overflow: 'auto', pr: 2, pb: 3 }}>
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
      <Box>
        <Typography variant="h5">教练课程</Typography>
        <Typography variant="body2" color="text.secondary">按教练查看正式课程，仅供查询。</Typography>
      </Box>
      <Button variant="outlined" startIcon={<RefreshIcon />} disabled={!coachId || loadingCourses}
        onClick={() => loadCourses(1)}>刷新</Button>
    </Stack>

    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4} md={3}>
          <FormControl fullWidth size="small" disabled={loadingCoaches || coaches.length === 0}>
            <InputLabel id="coach-course-coach-label">教练</InputLabel>
            <Select labelId="coach-course-coach-label" value={coachId} label="教练"
              onChange={(event) => selectCoach(String(event.target.value))}>
              {coaches.map((coach) => <MenuItem key={coach.id} value={String(coach.id)}>{coach.name}（{coach.number}）</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <TextField fullWidth size="small" type="date" label="开始日期" value={startDate} disabled={loadingCoaches}
            InputLabelProps={{ shrink: true }} onChange={(event) => changeDate('start', event.target.value)} />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <TextField fullWidth size="small" type="date" label="结束日期" value={endDate} disabled={loadingCoaches}
            InputLabelProps={{ shrink: true }} onChange={(event) => changeDate('end', event.target.value)} />
        </Grid>
        <Grid item xs={12} md={3}>
          <Button fullWidth variant="contained" startIcon={<SearchIcon />} disabled={!coachId || loadingCourses} onClick={query}>查询</Button>
        </Grid>
      </Grid>
      {dateError && <Alert severity="warning" sx={{ mt: 2 }}>{dateError}</Alert>}
    </Paper>

    {coachError && <Alert severity="error" action={<Button color="inherit" size="small" onClick={loadCoaches}>重新加载</Button>} sx={{ mb: 2 }}>
      教练列表加载失败：{coachError}
    </Alert>}
    {!loadingCoaches && !coachError && coaches.length === 0 && <Alert severity="info" sx={{ mb: 2 }}>暂无有效教练。</Alert>}
    {courseError && <Alert severity="error" action={coachId ? <Button color="inherit" size="small" onClick={() => loadCourses(currentPage)}>重试</Button> : undefined} sx={{ mb: 2 }}>
      {courseError}
    </Alert>}

    {loadingCourses && page.content.length === 0 && <Stack alignItems="center" sx={{ py: 6 }}><CircularProgress size={32} /></Stack>}
    {!loadingCourses && hasQueried && !courseError && coachId && page.content.length === 0 && <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
      <Typography color="text.secondary">所选教练在该日期范围内暂无正式课程。</Typography>
    </Paper>}

    <Stack spacing={2} sx={{ opacity: loadingCourses && page.content.length > 0 ? 0.55 : 1 }}>
      {page.content.map((course) => {
        const members = Array.isArray(course.membersData) ? course.membersData : []
        const isExpanded = Boolean(expanded[course.id])
        const typeLabel = courseTypeLabels[Number(course.courseType)] || '未知课程'
        const adultLabel = Number(course.courseType) === 0 ? '' : (Number(course.isAdult) === 1 ? '成人' : '儿童')
        return <Card key={course.id} variant="outlined">
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1} sx={{ mb: 1.5 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h6">{typeLabel}</Typography>
                <Chip size="small" color="success" variant="outlined" label="正式课" />
                {adultLabel && <Chip size="small" label={adultLabel} />}
              </Stack>
              <Typography variant="body2" color="text.secondary">课程 #{course.id}</Typography>
            </Stack>
            <Grid container spacing={1.5}>
              <Grid item xs={12} md={6}><Typography variant="body2" color="text.secondary">时间</Typography><Typography>{course.startTime} - {course.endTime}</Typography></Grid>
              <Grid item xs={6} md={3}><Typography variant="body2" color="text.secondary">时长</Typography><Typography>{course.duration} 小时</Typography></Grid>
              <Grid item xs={6} md={3}><Typography variant="body2" color="text.secondary">校区</Typography><Typography>{course.courtName || `已失效校区（${course.courtId}）`}</Typography></Grid>
              {course.description && <Grid item xs={12}><Typography variant="body2" color="text.secondary">备注</Typography><Typography sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{course.description}</Typography></Grid>}
            </Grid>
            <Divider sx={{ my: 1.5 }} />
            <Button size="small" endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={() => setExpanded((previous) => ({ ...previous, [course.id]: !previous[course.id] }))}>
              会员消费明细（{members.length}）
            </Button>
            <Collapse in={isExpanded}>
              <Stack spacing={1} sx={{ mt: 1 }}>
                {members.length === 0 && <Typography variant="body2" color="text.secondary">本课程无需填写会员</Typography>}
                {members.map((member) => <Paper key={`${course.id}-${member.memberId}`} variant="outlined" sx={{ p: 1.5 }}>
                  <Typography variant="subtitle2">{member.memberName || '已失效会员'}{member.memberNumber ? `（${member.memberNumber}）` : ''}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    课时费 {displayNumber(member.charge)} / 次卡 {displayNumber(member.times)} / 年卡 {displayNumber(member.annualTimes)} / 数量 {displayNumber(member.quantities)}
                  </Typography>
                  {member.description !== null && member.description !== undefined && String(member.description) !== '' && <Typography variant="body2" color="text.secondary">说明：{String(member.description)}</Typography>}
                </Paper>)}
              </Stack>
            </Collapse>
          </CardContent>
        </Card>
      })}
    </Stack>

    {page.totalPages > 0 && <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" spacing={2}>
        <Typography variant="body2">第 {currentPage} / {page.totalPages} 页，共 {page.totalElements} 条（每页 50 条）</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button size="small" variant="outlined" disabled={loadingCourses || page.first} onClick={() => loadCourses(currentPage - 1)}>上一页</Button>
          <TextField size="small" type="number" value={pageInput} inputProps={{ min: 1, max: page.totalPages, 'aria-label': '页码' }}
            onChange={(event) => setPageInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') jumpPage() }} sx={{ width: 90 }} />
          <Button size="small" variant="outlined" disabled={loadingCourses} onClick={jumpPage}>跳转</Button>
          <Button size="small" variant="outlined" disabled={loadingCourses || page.last} onClick={() => loadCourses(currentPage + 1)}>下一页</Button>
        </Stack>
      </Stack>
    </Paper>}
  </Box>
}

export default CoachCourseViewer
