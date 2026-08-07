import React from 'react'
import { Button, Card, CardActions, CardContent, Chip, Stack, Typography } from '@mui/material'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { RechargeNotice } from './pendingCourseTypes'

type Props = {
  notice: RechargeNotice
  acknowledging?: boolean
  onAcknowledge?: () => void
}

const identityLabel = (name: string | undefined, id: number, active: boolean, kind: string) => {
  const identity = name || `${kind}已失效（${id}）`
  return active ? identity : `${identity}（已停用）`
}

const RechargeNoticeCard = ({ notice, acknowledging = false, onAcknowledge }: Props) => (
  <Card variant="outlined" sx={{ mb: 1.5, borderLeft: '4px solid', borderLeftColor: notice.status === 'PENDING' ? 'info.main' : 'success.main' }}>
    <CardContent sx={{ pb: 1 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
        <Stack spacing={0.5}>
          <Typography variant="h6">{identityLabel(notice.memberName, notice.memberId, notice.memberActive, '会员')}</Typography>
          <Typography variant="body2" color="text.secondary">
            会员编号：{notice.memberNumber || '无'} · 上报教练：{identityLabel(notice.coachName, notice.coachId, notice.coachActive, '教练')}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Chip size="small" color="info" variant="outlined" label="用户充值" />
          <Chip size="small" color={notice.status === 'PENDING' ? 'warning' : 'success'} label={notice.status === 'PENDING' ? '待知悉' : '已知悉'} />
        </Stack>
      </Stack>
      <Typography variant="body2" sx={{ mt: 1.5 }}>充值日期：{notice.rechargeDate}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
        备注：{notice.note}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        上报：{notice.createdAt} · 最近修改：{notice.updatedAt}
        {notice.acknowledgedAt ? ` · 知悉：${notice.acknowledgedAt}` : ''}
      </Typography>
    </CardContent>
    {notice.status === 'PENDING' && onAcknowledge && <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 1.5 }}>
      <Button variant="contained" color="info" size="small" startIcon={<VisibilityOutlinedIcon />} disabled={acknowledging} onClick={onAcknowledge}>
        {acknowledging ? '确认中…' : '已知悉'}
      </Button>
    </CardActions>}
  </Card>
)

export default RechargeNoticeCard
