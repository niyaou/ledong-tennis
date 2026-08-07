import { CoachSubmission, normalizePage, sortSubmissions, submissionKey } from './pendingCourseTypes'

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
