export const SINGLE_CLASS_COURSE_TYPE = 3

export const COURSE_TYPE_LABELS: Record<number, string> = {
  [-2]: '体验课未成单',
  [-1]: '体验课成单',
  0: '订场',
  1: '班课',
  2: '私教',
  [SINGLE_CLASS_COURSE_TYPE]: '单次班课',
}

export const COURSE_TYPE_OPTIONS = Object.keys(COURSE_TYPE_LABELS)
  .map(Number)
  .sort((left, right) => left - right)
  .map((value) => ({ value, label: COURSE_TYPE_LABELS[value] }))

export const courseTypeLabel = (courseType: number) => (
  COURSE_TYPE_LABELS[courseType] || `未知类型（${courseType}）`
)

export const isSingleClassCourse = (courseType: unknown) => (
  Number(courseType) === SINGLE_CLASS_COURSE_TYPE
)

export const normalizedParticipantCount = (value: unknown) => {
  const count = Number(value)
  return Number.isInteger(count) && count > 0 ? count : 0
}

export const courseParticipationFormFields = (
  courseType: unknown,
  membersObj: unknown,
  participantCount: unknown,
): Record<string, string> => (
  isSingleClassCourse(courseType)
    ? { participantCount: String(normalizedParticipantCount(participantCount)) }
    : { membersObj: JSON.stringify(membersObj) }
)
