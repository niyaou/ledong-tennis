import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Paper, Stack, Typography } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useSnackbar } from 'notistack'
import Axios from '../../common/axios/axios'
import PendingCourseCard from './pendingCourseCard'
import { PendingCourse } from './pendingCourseTypes'
import { BalanceWarnings, calculateBalanceWarnings } from './pendingCourseBalance'
import { toAdmitRequest } from './pendingCourseTypes'

type LoadReason = 'initial' | 'manual' | 'auto' | 'afterAdmit'

const errorMessage = (error: any) => error?.response?.data?.message || error?.message || '请求失败，请稍后重试'

const PendingCoursePage = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [courses, setCourses] = useState<PendingCourse[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoaded, setInitialLoaded] = useState(false)
  const [initialLoadFailed, setInitialLoadFailed] = useState(false)
  const [collapsedById, setCollapsedById] = useState<Record<number, boolean>>({})
  const [admittingById, setAdmittingById] = useState<Record<number, boolean>>({})
  const [dialogCourse, setDialogCourse] = useState<PendingCourse | null>(null)
  const [dialogWarnings, setDialogWarnings] = useState<BalanceWarnings>({ currentDebt: [], afterDebt: [] })
  const requestSeqRef = useRef(0)
  const refreshInFlightRef = useRef(false)
  const coursesRef = useRef<PendingCourse[]>([])
  const interactionRef = useRef(false)

  useEffect(() => {
    coursesRef.current = courses
  }, [courses])

  useEffect(() => {
    interactionRef.current = Boolean(dialogCourse) || Object.keys(admittingById).length > 0
  }, [dialogCourse, admittingById])

  const loadCourses = useCallback(async (reason: LoadReason) => {
    if (refreshInFlightRef.current) return
    refreshInFlightRef.current = true
    const requestSeq = ++requestSeqRef.current
    if (reason !== 'auto') setLoading(true)
    try {
      const response = await Axios.get('/api/pending-course')
      const nextCourses: PendingCourse[] = Array.isArray(response.data) ? response.data : (response.data?.data || [])
      if (requestSeq !== requestSeqRef.current) return
      setCourses(nextCourses)
      setCollapsedById((previous) => nextCourses.reduce((next, course) => {
        next[course.id] = Boolean(previous[course.id])
        return next
      }, {} as Record<number, boolean>))
      setInitialLoaded(true)
      setInitialLoadFailed(false)
    } catch (error) {
      if (requestSeq === requestSeqRef.current) {
        setInitialLoaded(true)
        if (coursesRef.current.length === 0) setInitialLoadFailed(true)
        enqueueSnackbar(errorMessage(error), { variant: 'error' })
      }
    } finally {
      refreshInFlightRef.current = false
      if (reason !== 'auto' && requestSeq === requestSeqRef.current) setLoading(false)
    }
  }, [enqueueSnackbar])

  useEffect(() => {
    loadCourses('initial')
    const interval = window.setInterval(() => {
      if (!interactionRef.current && !refreshInFlightRef.current) loadCourses('auto')
    }, 60 * 1000)
    return () => {
      window.clearInterval(interval)
      requestSeqRef.current += 1
    }
  }, [loadCourses])

  const groups = useMemo(() => {
    const byCourt = courses.reduce((result, course) => {
      const key = String(course.courtId)
      if (!result[key]) result[key] = []
      result[key].push(course)
      return result
    }, {} as Record<string, PendingCourse[]>)
    return Object.values(byCourt).sort((left, right) => {
      const leftName = left[0]?.courtName || '\uffff'
      const rightName = right[0]?.courtName || '\uffff'
      return leftName.localeCompare(rightName, 'zh-CN')
    }).map((group) => group.sort((left, right) => right.startTime.localeCompare(left.startTime) || right.id - left.id))
  }, [courses])

  const admit = useCallback(async (course: PendingCourse) => {
    if (admittingById[course.id]) return
    setAdmittingById((previous) => ({ ...previous, [course.id]: true }))
    try {
      await Axios.post(`/api/pending-course/${course.id}/admit`, toAdmitRequest(course))
      enqueueSnackbar('课程已录取', { variant: 'success' })
      setCourses((previous) => previous.filter((item) => item.id !== course.id))
      await loadCourses('afterAdmit')
    } catch (error: any) {
      enqueueSnackbar(errorMessage(error), { variant: 'error' })
      const errorCode = error?.response?.data?.errorCode
      if (errorCode === 'PENDING_UPDATED' || errorCode === 'PENDING_NOT_FOUND') loadCourses('afterAdmit')
    } finally {
      setAdmittingById((previous) => {
        const next = { ...previous }
        delete next[course.id]
        return next
      })
    }
  }, [admittingById, enqueueSnackbar, loadCourses])

  const requestAdmit = (course: PendingCourse) => {
    const warnings = calculateBalanceWarnings(course.membersData)
    if (warnings.currentDebt.length || warnings.afterDebt.length) {
      setDialogWarnings(warnings)
      setDialogCourse(course)
      return
    }
    admit(course)
  }

  const warningLines = [...dialogWarnings.currentDebt.map((warning) => `${warning.member.memberName || warning.member.memberId} 当前已欠费（等效余额 ${warning.currentBalance}）`),
    ...dialogWarnings.afterDebt.map((warning) => `${warning.member.memberName || warning.member.memberId} 扣费后将欠费（等效余额 ${warning.afterBalance}）`)]

  return <Box sx={{ width: '100%', height: '100%', overflow: 'auto', pr: 2 }}>
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
      <Typography variant="h5">教练填报课程</Typography>
      <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => loadCourses('manual')} disabled={loading || Object.keys(admittingById).length > 0}>刷新</Button>
    </Stack>
    {initialLoadFailed && courses.length === 0 && <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => loadCourses('manual')}>重新加载</Button>} sx={{ mb: 2 }}>待审课程加载失败，请重试。</Alert>}
    {initialLoaded && !initialLoadFailed && groups.length === 0 && <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}><Typography color="text.secondary">暂无待审课程</Typography></Paper>}
    {groups.map((group) => <Paper key={group[0].courtId} variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6">{group[0].courtName || `校区已失效（${group[0].courtId}）`}</Typography>
      <Divider sx={{ my: 1.5 }} />
      {group.map((course) => <PendingCourseCard key={course.id} course={course} collapsed={Boolean(collapsedById[course.id])} admitting={Boolean(admittingById[course.id])}
        onToggle={() => setCollapsedById((previous) => ({ ...previous, [course.id]: !previous[course.id] }))} onAdmit={() => requestAdmit(course)} />)}
    </Paper>)}
    <Dialog open={Boolean(dialogCourse)} onClose={() => setDialogCourse(null)}>
      <DialogTitle>欠费提醒</DialogTitle>
      <DialogContent>
        <Typography>以下会员已欠费或本次扣费后将欠费。确认后仍将继续录取课程：</Typography>
        <Stack sx={{ mt: 1 }} spacing={0.5}>{warningLines.map((line, index) => <Typography key={index} variant="body2">• {line}</Typography>)}</Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDialogCourse(null)}>取消</Button>
        <Button variant="contained" onClick={() => { const course = dialogCourse; setDialogCourse(null); if (course) admit(course) }}>继续录取</Button>
      </DialogActions>
    </Dialog>
  </Box>
}

export default PendingCoursePage
