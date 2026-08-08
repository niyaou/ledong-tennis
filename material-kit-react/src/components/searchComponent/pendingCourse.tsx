import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Pagination, Paper, Stack, TextField, Typography } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useSnackbar } from 'notistack'
import Axios from '../../common/axios/axios'
import PendingCourseCard from './pendingCourseCard'
import RechargeNoticeCard from './rechargeNoticeCard'
import { BalanceWarnings, calculateBalanceWarnings } from './pendingCourseBalance'
import {
  CoachSubmission,
  Page,
  PendingCourse,
  RechargeNotice,
  emptyPage,
  normalizePage,
  sortSubmissions,
  submissionKey,
  toAdmitRequest,
} from './pendingCourseTypes'

type LoadReason = 'initial' | 'manual' | 'auto' | 'afterMutation'
type View = 'pending' | 'history'

const PAGE_SIZE = 30
const errorMessage = (error: any) => error?.response?.data?.message || error?.response?.data?.error || error?.message || '请求失败，请稍后重试'

const PendingCoursePage = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [view, setView] = useState<View>('pending')
  const [pendingPage, setPendingPage] = useState<Page<CoachSubmission>>(emptyPage())
  const [historyPage, setHistoryPage] = useState<Page<RechargeNotice>>(emptyPage())
  const [pendingPageNumber, setPendingPageNumber] = useState(1)
  const [historyPageNumber, setHistoryPageNumber] = useState(1)
  const [startDateDraft, setStartDateDraft] = useState('')
  const [endDateDraft, setEndDateDraft] = useState('')
  const [historyDates, setHistoryDates] = useState({ startDate: '', endDate: '' })
  const [loading, setLoading] = useState<Record<View, boolean>>({ pending: false, history: false })
  const [loaded, setLoaded] = useState<Record<View, boolean>>({ pending: false, history: false })
  const [loadFailed, setLoadFailed] = useState<Record<View, boolean>>({ pending: false, history: false })
  const [collapsedByKey, setCollapsedByKey] = useState<Record<string, boolean>>({})
  const [admittingByKey, setAdmittingByKey] = useState<Record<string, boolean>>({})
  const [acknowledgingByKey, setAcknowledgingByKey] = useState<Record<string, boolean>>({})
  const [dialogCourse, setDialogCourse] = useState<PendingCourse | null>(null)
  const [dialogNotice, setDialogNotice] = useState<RechargeNotice | null>(null)
  const [dialogWarnings, setDialogWarnings] = useState<BalanceWarnings>({ currentDebt: [], afterDebt: [] })
  const requestSeqRef = useRef<Record<View, number>>({ pending: 0, history: 0 })
  const requestInFlightRef = useRef<Record<View, boolean>>({ pending: false, history: false })
  const interactionRef = useRef(false)
  const interactionActive = Boolean(dialogCourse || dialogNotice)
    || Object.keys(admittingByKey).length > 0
    || Object.keys(acknowledgingByKey).length > 0

  useEffect(() => {
    interactionRef.current = interactionActive
  }, [interactionActive])

  const loadPending = useCallback(async (reason: LoadReason, requestedPage = pendingPageNumber) => {
    if (reason === 'auto' && requestInFlightRef.current.pending) return
    const requestSeq = ++requestSeqRef.current.pending
    requestInFlightRef.current.pending = true
    if (reason !== 'auto') setLoading((previous) => ({ ...previous, pending: true }))
    try {
      const response = await Axios.get('/api/coach-submissions', { params: { pageNum: requestedPage, pageSize: PAGE_SIZE } })
      const nextPage = normalizePage<CoachSubmission>(response.data)
      if (requestSeq !== requestSeqRef.current.pending) return
      if (requestedPage > 1 && nextPage.content.length === 0 && nextPage.totalPages < requestedPage) {
        setPendingPageNumber(Math.max(1, nextPage.totalPages))
        return
      }
      const content = sortSubmissions(nextPage.content.filter((submission) =>
        (submission.submissionType === 'COURSE' && Boolean(submission.course))
        || (submission.submissionType === 'RECHARGE_NOTICE' && Boolean(submission.rechargeNotice))))
      setPendingPage({ ...nextPage, content, numberOfElements: content.length, empty: content.length === 0 })
      setCollapsedByKey((previous) => content.reduce((next, submission) => {
        const key = submissionKey(submission)
        next[key] = Boolean(previous[key])
        return next
      }, {} as Record<string, boolean>))
      setLoaded((previous) => ({ ...previous, pending: true }))
      setLoadFailed((previous) => ({ ...previous, pending: false }))
    } catch (error) {
      if (requestSeq === requestSeqRef.current.pending) {
        setLoaded((previous) => ({ ...previous, pending: true }))
        setLoadFailed((previous) => ({ ...previous, pending: true }))
        enqueueSnackbar(errorMessage(error), { variant: 'error' })
      }
    } finally {
      if (requestSeq === requestSeqRef.current.pending && reason !== 'auto') {
        setLoading((previous) => ({ ...previous, pending: false }))
      }
      if (requestSeq === requestSeqRef.current.pending) requestInFlightRef.current.pending = false
    }
  }, [enqueueSnackbar, pendingPageNumber])

  const loadHistory = useCallback(async (reason: LoadReason, requestedPage = historyPageNumber) => {
    if (reason === 'auto' && requestInFlightRef.current.history) return
    const requestSeq = ++requestSeqRef.current.history
    requestInFlightRef.current.history = true
    if (reason !== 'auto') setLoading((previous) => ({ ...previous, history: true }))
    try {
      const params: Record<string, string | number> = { status: 'ACKNOWLEDGED', pageNum: requestedPage, pageSize: PAGE_SIZE }
      if (historyDates.startDate) params.startDate = historyDates.startDate
      if (historyDates.endDate) params.endDate = historyDates.endDate
      const response = await Axios.get('/api/recharge-notices', { params })
      const nextPage = normalizePage<RechargeNotice>(response.data)
      if (requestSeq !== requestSeqRef.current.history) return
      if (requestedPage > 1 && nextPage.content.length === 0 && nextPage.totalPages < requestedPage) {
        setHistoryPageNumber(Math.max(1, nextPage.totalPages))
        return
      }
      setHistoryPage(nextPage)
      setLoaded((previous) => ({ ...previous, history: true }))
      setLoadFailed((previous) => ({ ...previous, history: false }))
    } catch (error) {
      if (requestSeq === requestSeqRef.current.history) {
        setLoaded((previous) => ({ ...previous, history: true }))
        setLoadFailed((previous) => ({ ...previous, history: true }))
        enqueueSnackbar(errorMessage(error), { variant: 'error' })
      }
    } finally {
      if (requestSeq === requestSeqRef.current.history && reason !== 'auto') {
        setLoading((previous) => ({ ...previous, history: false }))
      }
      if (requestSeq === requestSeqRef.current.history) requestInFlightRef.current.history = false
    }
  }, [enqueueSnackbar, historyDates, historyPageNumber])

  useEffect(() => {
    if (view === 'pending') loadPending('initial')
    else loadHistory('initial')
  }, [view, pendingPageNumber, historyPageNumber, historyDates, loadPending, loadHistory])

  const activeLoadRef = useRef<() => void>(() => undefined)
  useEffect(() => {
    activeLoadRef.current = () => {
      if (view === 'pending') loadPending('auto')
      else loadHistory('auto')
    }
  }, [view, loadPending, loadHistory])

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (!interactionRef.current) activeLoadRef.current()
    }, 60 * 1000)
    return () => {
      window.clearInterval(interval)
      requestSeqRef.current.pending += 1
      requestSeqRef.current.history += 1
    }
  }, [])

  const pendingGroups = useMemo(() => {
    const byDate = pendingPage.content.reduce((result, submission) => {
      const key = submission.businessDate || '日期未知'
      if (!result[key]) result[key] = []
      result[key].push(submission)
      return result
    }, {} as Record<string, CoachSubmission[]>)
    return Object.entries(byDate).sort(([left], [right]) => right.localeCompare(left))
  }, [pendingPage.content])

  const admit = useCallback(async (course: PendingCourse) => {
    const key = `COURSE:${course.id}`
    if (admittingByKey[key]) return
    setAdmittingByKey((previous) => ({ ...previous, [key]: true }))
    try {
      await Axios.post(`/api/pending-course/${course.id}/admit`, toAdmitRequest(course))
      enqueueSnackbar('课程已录取', { variant: 'success' })
      setPendingPage((previous) => ({
        ...previous,
        content: previous.content.filter((item) => submissionKey(item) !== key),
        totalElements: Math.max(0, previous.totalElements - 1),
      }))
      await loadPending('afterMutation')
    } catch (error: any) {
      enqueueSnackbar(errorMessage(error), { variant: 'error' })
      const errorCode = error?.response?.data?.errorCode
      if (errorCode === 'PENDING_UPDATED' || errorCode === 'PENDING_NOT_FOUND') loadPending('afterMutation')
    } finally {
      setAdmittingByKey((previous) => {
        const next = { ...previous }
        delete next[key]
        return next
      })
    }
  }, [admittingByKey, enqueueSnackbar, loadPending])

  const acknowledge = useCallback(async (notice: RechargeNotice) => {
    const key = `RECHARGE_NOTICE:${notice.id}`
    if (acknowledgingByKey[key]) return
    setAcknowledgingByKey((previous) => ({ ...previous, [key]: true }))
    try {
      await Axios.post(`/api/recharge-notices/${notice.id}/acknowledge`, { version: notice.version })
      enqueueSnackbar('充值待办已知悉', { variant: 'success' })
      setPendingPage((previous) => ({
        ...previous,
        content: previous.content.filter((item) => submissionKey(item) !== key),
        totalElements: Math.max(0, previous.totalElements - 1),
      }))
      await loadPending('afterMutation')
    } catch (error: any) {
      enqueueSnackbar(errorMessage(error), { variant: 'error' })
      const status = error?.response?.status
      const errorCode = error?.response?.data?.errorCode
      if (status === 409 || status === 404 || ['RECHARGE_NOTICE_UPDATED', 'RECHARGE_NOTICE_NOT_FOUND', 'NOTICE_UPDATED', 'NOTICE_NOT_FOUND'].includes(errorCode)) {
        loadPending('afterMutation')
      }
    } finally {
      setAcknowledgingByKey((previous) => {
        const next = { ...previous }
        delete next[key]
        return next
      })
    }
  }, [acknowledgingByKey, enqueueSnackbar, loadPending])

  const requestAdmit = (course: PendingCourse) => {
    const warnings = calculateBalanceWarnings(course.membersData)
    if (warnings.currentDebt.length || warnings.afterDebt.length) {
      setDialogWarnings(warnings)
      setDialogCourse(course)
      return
    }
    admit(course)
  }

  const warningLines = [
    ...dialogWarnings.currentDebt.map((warning) => `${warning.member.memberName || warning.member.memberId} 当前已欠费（等效余额 ${warning.currentBalance}）`),
    ...dialogWarnings.afterDebt.map((warning) => `${warning.member.memberName || warning.member.memberId} 扣费后将欠费（等效余额 ${warning.afterBalance}）`),
  ]
  const activePage = view === 'pending' ? pendingPage : historyPage
  const activePageNumber = view === 'pending' ? pendingPageNumber : historyPageNumber
  const activeLoading = loading[view]
  const activeHasData = activePage.content.length > 0
  const applyDateFilter = () => {
    if (startDateDraft && endDateDraft && startDateDraft > endDateDraft) {
      enqueueSnackbar('开始日期不能晚于结束日期', { variant: 'warning' })
      return
    }
    setHistoryPageNumber(1)
    setHistoryDates({ startDate: startDateDraft, endDate: endDateDraft })
  }

  return <Box sx={{ width: '100%', height: '100%', overflow: 'auto', pr: 2 }}>
    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={1.5} sx={{ mb: 2 }}>
      <Box>
        <Typography variant="h5">教练填报</Typography>
        <Typography variant="body2" color="text.secondary">课程需要录取；充值待办仅需管理员确认知悉。</Typography>
      </Box>
      <Stack direction="row" spacing={1}>
        <ButtonGroup size="small" aria-label="教练填报视图">
          <Button variant={view === 'pending' ? 'contained' : 'outlined'} onClick={() => setView('pending')}>待处理</Button>
          <Button variant={view === 'history' ? 'contained' : 'outlined'} onClick={() => setView('history')}>已知悉充值</Button>
        </ButtonGroup>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => view === 'pending' ? loadPending('manual') : loadHistory('manual')}
          disabled={activeLoading || interactionActive}>刷新</Button>
      </Stack>
    </Stack>

    {view === 'history' && <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
        <TextField size="small" type="date" label="开始日期" value={startDateDraft} InputLabelProps={{ shrink: true }} onChange={(event) => setStartDateDraft(event.target.value)} />
        <TextField size="small" type="date" label="结束日期" value={endDateDraft} InputLabelProps={{ shrink: true }} onChange={(event) => setEndDateDraft(event.target.value)} />
        <Button variant="contained" onClick={applyDateFilter} disabled={activeLoading}>查询</Button>
        <Button onClick={() => { setStartDateDraft(''); setEndDateDraft(''); setHistoryPageNumber(1); setHistoryDates({ startDate: '', endDate: '' }) }} disabled={activeLoading}>清除</Button>
      </Stack>
    </Paper>}

    {loadFailed[view] && !activeHasData && <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => view === 'pending' ? loadPending('manual') : loadHistory('manual')}>重新加载</Button>} sx={{ mb: 2 }}>
      {view === 'pending' ? '待处理填报加载失败，请重试。' : '已知悉充值加载失败，请重试。'}
    </Alert>}
    {loadFailed[view] && activeHasData && <Alert severity="warning" sx={{ mb: 2 }}>刷新失败，当前仍显示上次成功加载的数据。</Alert>}
    {loaded[view] && !loadFailed[view] && !activeHasData && <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
      <Typography color="text.secondary">{view === 'pending' ? '暂无待处理填报' : '暂无已知悉充值'}</Typography>
    </Paper>}

    {view === 'pending' && pendingGroups.map(([businessDate, submissions]) => <Paper key={businessDate} variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6">{businessDate}</Typography>
      <Divider sx={{ my: 1.5 }} />
      {submissions.map((submission) => {
        const key = submissionKey(submission)
        if (submission.submissionType === 'COURSE') {
          return <PendingCourseCard key={key} course={submission.course} collapsed={Boolean(collapsedByKey[key])} admitting={Boolean(admittingByKey[key])}
            onToggle={() => setCollapsedByKey((previous) => ({ ...previous, [key]: !previous[key] }))} onAdmit={() => requestAdmit(submission.course)} />
        }
        return <RechargeNoticeCard key={key} notice={submission.rechargeNotice} acknowledging={Boolean(acknowledgingByKey[key])} onAcknowledge={() => setDialogNotice(submission.rechargeNotice)} />
      })}
    </Paper>)}

    {view === 'history' && historyPage.content.map((notice) => <RechargeNoticeCard key={`RECHARGE_NOTICE:${notice.id}`} notice={notice} />)}

    {activePage.totalPages > 1 && <Stack alignItems="center" sx={{ py: 2 }}>
      <Pagination page={activePageNumber} count={activePage.totalPages} disabled={activeLoading} onChange={(_event, page) => {
        if (view === 'pending') setPendingPageNumber(page)
        else setHistoryPageNumber(page)
      }} />
      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>共 {activePage.totalElements} 条</Typography>
    </Stack>}

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

    <Dialog open={Boolean(dialogNotice)} onClose={() => setDialogNotice(null)}>
      <DialogTitle>确认已知悉</DialogTitle>
      <DialogContent>
        <Typography>确认已看到这条用户充值填报？此操作不会执行充值，也不会创建正式课程。</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDialogNotice(null)}>取消</Button>
        <Button color="info" variant="contained" onClick={() => { const notice = dialogNotice; setDialogNotice(null); if (notice) acknowledge(notice) }}>确认已知悉</Button>
      </DialogActions>
    </Dialog>
  </Box>
}

export default PendingCoursePage
