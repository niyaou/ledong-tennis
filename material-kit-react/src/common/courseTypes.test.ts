import { courseParticipationFormFields, courseTypeLabel, isSingleClassCourse, normalizedParticipantCount } from './courseTypes'

declare const test: (name: string, run: () => void) => void
declare const expect: (actual: unknown) => {
  toBe: (expected: unknown) => void
  toEqual: (expected: unknown) => void
}

test('recognizes the single class course contract', () => {
  expect(isSingleClassCourse(3)).toBe(true)
  expect(isSingleClassCourse('3')).toBe(true)
  expect(courseTypeLabel(3)).toBe('单次班课')
})

test('accepts only positive integer participant counts', () => {
  expect(normalizedParticipantCount(6)).toBe(6)
  expect(normalizedParticipantCount('4')).toBe(4)
  expect(normalizedParticipantCount(0)).toBe(0)
  expect(normalizedParticipantCount(2.5)).toBe(0)
  expect(normalizedParticipantCount('invalid')).toBe(0)
})

test('omits membersObj entirely for single class course form requests', () => {
  expect(courseParticipationFormFields(3, null, 8)).toEqual({
    participantCount: '8',
  })
})

test('keeps the existing membersObj form field for other course types', () => {
  const membersObj = { '13800000000': [80, 0, 0, 80, 1] }
  expect(courseParticipationFormFields(2, membersObj, 8)).toEqual({
    membersObj: JSON.stringify(membersObj),
  })
})
