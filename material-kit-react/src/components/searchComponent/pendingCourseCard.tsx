import React from 'react'
import { Button, Card, CardActions, CardContent, Chip, Collapse, Divider, IconButton, Stack, Typography } from '@mui/material'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { PendingCourse, courseTypeLabel, deductionLabel } from './pendingCourseTypes'

type Props = {
  course: PendingCourse
  collapsed: boolean
  admitting: boolean
  onToggle: () => void
  onAdmit: () => void
}

const PendingCourseCard = ({ course, collapsed, admitting, onToggle, onAdmit }: Props) => {
  const isBooking = course.courseType === 0
  const courtName = course.courtName || `校区已失效（${course.courtId}）`
  const totalPeople = (course.membersData || []).reduce((total, member) => {
    const quantities = Number(member.quantities)
    return total + (Number.isFinite(quantities) ? quantities : 0)
  }, 0)

  return <Card variant="outlined" sx={{ mb: 1.5 }}>
    <CardContent sx={{ pb: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
        <Stack spacing={0.5}>
          <Typography variant="h6">{course.coachName || `教练已失效（${course.coachId}）`}</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip size="small" label={courseTypeLabel(course.courseType)} />
            <Chip size="small" color="primary" variant="outlined" label={`人数 ${totalPeople}`} />
            {!isBooking && <Chip size="small" variant="outlined" label={course.isAdult === 0 ? '儿童' : '成人'} />}
            <Chip size="small" variant="outlined" label={courtName} />
          </Stack>
        </Stack>
        <IconButton aria-label={collapsed ? '展开会员明细' : '收起会员明细'} onClick={onToggle} size="small">
          {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButton>
      </Stack>
      <Typography variant="body2" sx={{ mt: 1.5 }}>
        {course.startTime} 至 {course.endTime}（{course.duration} 小时）
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        备注：{course.description || '无'}
      </Typography>
      <Collapse in={!collapsed} timeout="auto" unmountOnExit>
        <Divider sx={{ my: 1.5 }} />
        {course.membersData && course.membersData.length > 0 ? course.membersData.map((member) => (
          <Stack key={member.memberId} direction="row" justifyContent="space-between" spacing={2} sx={{ py: 0.5 }}>
            <Typography variant="body2">{member.memberName || `会员已失效（${member.memberId}）`}{member.memberNumber ? `（${member.memberNumber}）` : ''}</Typography>
            <Typography variant="body2" color="text.secondary" align="right">
              {deductionLabel(member)}；等效价格 {member.description}；人数 {member.quantities}
            </Typography>
          </Stack>
        )) : <Typography variant="body2" color="text.secondary">本课程没有会员消费明细。</Typography>}
      </Collapse>
    </CardContent>
    <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 1.5 }}>
      <Button variant="contained" size="small" startIcon={<CheckCircleOutlineIcon />} disabled={admitting} onClick={onAdmit}>
        {admitting ? '录取中…' : '录取'}
      </Button>
    </CardActions>
  </Card>
}

export default PendingCourseCard
