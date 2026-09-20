import { CoachSubmission, PendingCourse, courseTypeLabel, normalizePage, sortSubmissions, submissionKey, toAdmitRequest } from './pendingCourseTypes'

declare const test: (name: string, run: () => void) => void
declare const expect: (actual: unknown) => {
  toBe: (expected: unknown) => void
  toEqual: (expected: unknown) => void
  toMatchObject: (expected: unknown) => void
}

const courseSubmission = (id: number, businessDate: string, submittedAt: string): CoachSubmission => ({
  submissionType: 'COURSE',
  businessDate,
  submittedAt,
  course: {
    id,
    coachId: 1,
    courtId: 1,
    startTime: `${businessDate} 10:00:00`,
    endTime: `${businessDate} 11:00:00`,
    duration: 1,
    courseType: 2,
    isAdult: 1,
    description: '',
    membersData: [],
    createdAt: submittedAt,
    updatedAt: submittedAt,
  },
})

const rechargeSubmission = (id: number, businessDate: string, submittedAt: string): CoachSubmission => ({
  submissionType: 'RECHARGE_NOTICE',
  businessDate,
  submittedAt,
  rechargeNotice: {
    id,
    coachId: 1,
    coachActive: true,
    memberId: 2,
    memberActive: true,
    rechargeDate: businessDate,
    note: '已通过外部渠道充值',
    status: 'PENDING',
    version: 1,
    createdAt: submittedAt,
    updatedAt: submittedAt,
  },
})

test('uses submission type in the key when ids overlap', () => {
  expect(submissionKey(courseSubmission(7, '2026-08-07', '2026-08-07 10:00:00'))).toBe('COURSE:7')
  expect(submissionKey(rechargeSubmission(7, '2026-08-07', '2026-08-07 10:00:00'))).toBe('RECHARGE_NOTICE:7')
})

test('sorts business date first and submitted timestamp second without parsing dates', () => {
  const older = rechargeSubmission(1, '2026-08-06', '2026-08-06 20:00:00')
  const earlierToday = courseSubmission(2, '2026-08-07', '2026-08-07 09:00:00')
  const laterToday = rechargeSubmission(3, '2026-08-07', '2026-08-07 11:00:00')
  expect(sortSubmissions([older, earlierToday, laterToday])).toEqual([laterToday, earlierToday, older])
})

test('normalizes a wrapped zero-based Page response', () => {
  const content = [rechargeSubmission(3, '2026-08-07', '2026-08-07 11:00:00')]
  expect(normalizePage<CoachSubmission>({ data: { content, number: 1, totalPages: 3, totalElements: 61, size: 30 } })).toMatchObject({
    content,
    number: 1,
    totalPages: 3,
    totalElements: 61,
    size: 30,
  })
})

test('maps single class courses and admits their reported participant count without member spending', () => {
  const course: PendingCourse = {
    id: 9,
    coachId: 1,
    courtId: 2,
    startTime: '2026-09-19 10:00:00',
    endTime: '2026-09-19 11:00:00',
    duration: 1,
    courseType: 3,
    isAdult: 1,
    description: '单次班课',
    participantCount: 7,
    membersData: [{
      memberId: 88,
      charge: 100,
      times: 0,
      annualTimes: 0,
      description: 100,
      quantities: 2,
    }],
    createdAt: '2026-09-19 09:00:00',
    updatedAt: '2026-09-19 09:30:00',
  }

  expect(courseTypeLabel(course.courseType)).toBe('单次班课')
  expect(toAdmitRequest(course)).toMatchObject({
    updatedAt: course.updatedAt,
    course: {
      courseType: 3,
      participantCount: 7,
      membersData: [],
    },
  })
})

test('keeps member spending unchanged for existing course types', () => {
  const course = courseSubmission(10, '2026-09-19', '2026-09-19 09:30:00').course as PendingCourse
  course.membersData = [{
    memberId: 7,
    charge: 80,
    times: 0,
    annualTimes: 0,
    description: 80,
    quantities: 1,
  }]
  course.participantCount = 9

  const request = toAdmitRequest(course)
  expect(request.course.participantCount).toBe(undefined)
  expect(request.course.membersData).toEqual(course.membersData)
})
