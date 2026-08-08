export type MemberSpend = {
  memberId: number
  memberName?: string
  memberNumber?: string
  charge: number
  times: number
  annualTimes: number
  description: number
  quantities: number
  restCharge?: number
  timesCount?: number
  annualCount?: number
}

export type PendingCourse = {
  id: number
  coachId: number
  coachName?: string
  courtId: number
  courtName?: string
  startTime: string
  endTime: string
  duration: number
  courseType: number
  isAdult: number
  description: string
  membersData: MemberSpend[]
  createdAt: string
  updatedAt: string
}

export type RechargeNoticeStatus = 'PENDING' | 'ACKNOWLEDGED'

export type RechargeNotice = {
  id: number
  coachId: number
  coachName?: string
  coachActive: boolean
  memberId: number
  memberName?: string
  memberNumber?: string
  memberActive: boolean
  rechargeDate: string
  note: string
  status: RechargeNoticeStatus
  version: number
  createdAt: string
  updatedAt: string
  acknowledgedAt?: string | null
}

export type CourseSubmission = {
  submissionType: 'COURSE'
  businessDate: string
  submittedAt: string
  course: PendingCourse
  rechargeNotice?: never
}

export type RechargeNoticeSubmission = {
  submissionType: 'RECHARGE_NOTICE'
  businessDate: string
  submittedAt: string
  course?: never
  rechargeNotice: RechargeNotice
}

export type CoachSubmission = CourseSubmission | RechargeNoticeSubmission

export type Page<T> = {
  content: T[]
  empty: boolean
  first: boolean
  last: boolean
  number: number
  numberOfElements: number
  size: number
  totalElements: number
  totalPages: number
}

export const emptyPage = <T>(): Page<T> => ({
  content: [],
  empty: true,
  first: true,
  last: true,
  number: 0,
  numberOfElements: 0,
  size: 30,
  totalElements: 0,
  totalPages: 0,
})

export const normalizePage = <T>(payload: any): Page<T> => {
  const body = payload?.data?.content ? payload.data : payload
  if (Array.isArray(body)) {
    return {
      ...emptyPage<T>(),
      content: body,
      empty: body.length === 0,
      numberOfElements: body.length,
      totalElements: body.length,
      totalPages: body.length ? 1 : 0,
    }
  }
  const content = Array.isArray(body?.content) ? body.content : []
  return {
    ...emptyPage<T>(),
    ...body,
    content,
    empty: body?.empty ?? content.length === 0,
    number: Number(body?.number) || 0,
    numberOfElements: Number(body?.numberOfElements) || content.length,
    size: Number(body?.size) || 30,
    totalElements: Number(body?.totalElements) || 0,
    totalPages: Number(body?.totalPages) || 0,
  }
}

export const submissionKey = (submission: CoachSubmission) => `${submission.submissionType}:${submission.submissionType === 'COURSE' ? submission.course.id : submission.rechargeNotice.id}`

export const sortSubmissions = (submissions: CoachSubmission[]) => [...submissions].sort((left, right) =>
  right.businessDate.localeCompare(left.businessDate)
  || right.submittedAt.localeCompare(left.submittedAt)
  || submissionKey(right).localeCompare(submissionKey(left)))

export type AdmitRequest = {
  updatedAt: string
  course: {
    coachId: number
    courtId: number
    startTime: string
    endTime: string
    duration: number
    courseType: number
    isAdult: number
    description: string
    membersData: Array<Pick<MemberSpend, 'memberId' | 'charge' | 'times' | 'annualTimes' | 'description' | 'quantities'>>
  }
}

export const COURSE_TYPE_LABELS: Record<number, string> = {
  [-2]: '体验课未成单',
  [-1]: '体验课成单',
  0: '订场',
  1: '班课',
  2: '私教',
}

export const courseTypeLabel = (courseType: number) => COURSE_TYPE_LABELS[courseType] || `未知类型（${courseType}）`

export const deductionLabel = (member: MemberSpend) => {
  if (Number(member.times) > 0) return `次卡 ${member.times}`
  if (Number(member.annualTimes) > 0) return `年卡 ${member.annualTimes}`
  return `课时费 ${member.charge}`
}

export const toAdmitRequest = (course: PendingCourse): AdmitRequest => ({
  updatedAt: course.updatedAt,
  course: {
    coachId: course.coachId,
    courtId: course.courtId,
    startTime: course.startTime,
    endTime: course.endTime,
    duration: course.duration,
    courseType: course.courseType,
    isAdult: course.isAdult,
    description: course.description || '',
    membersData: (course.membersData || []).map((member) => ({
      memberId: member.memberId,
      charge: Number(member.charge) || 0,
      times: Number(member.times) || 0,
      annualTimes: Number(member.annualTimes) || 0,
      description: Number(member.description) || 0,
      quantities: Number(member.quantities) || 0,
    })),
  },
})
