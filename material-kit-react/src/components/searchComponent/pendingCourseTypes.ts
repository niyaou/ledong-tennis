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
