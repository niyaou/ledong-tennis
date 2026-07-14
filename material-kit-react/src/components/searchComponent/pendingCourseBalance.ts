import { MemberSpend } from './pendingCourseTypes'

const TIMES_CARD_UNIT_PRICE = 200
const ANNUAL_CARD_UNIT_PRICE = 150

const numberValue = (value: unknown) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export type BalanceWarning = {
  member: MemberSpend
  currentBalance: number
  deduction?: number
  afterBalance?: number
}

export type BalanceWarnings = {
  currentDebt: BalanceWarning[]
  afterDebt: BalanceWarning[]
}

export const calculateBalanceWarnings = (members: MemberSpend[] = []): BalanceWarnings => {
  const currentDebt: BalanceWarning[] = []
  const afterDebt: BalanceWarning[] = []

  members.forEach((member) => {
    const currentBalance = numberValue(member.restCharge)
      + numberValue(member.timesCount) * TIMES_CARD_UNIT_PRICE
      + numberValue(member.annualCount) * ANNUAL_CARD_UNIT_PRICE
    const deduction = numberValue(member.charge)
      + numberValue(member.times) * TIMES_CARD_UNIT_PRICE
      + numberValue(member.annualTimes) * ANNUAL_CARD_UNIT_PRICE
    const afterBalance = currentBalance - deduction

    if (currentBalance < 0) currentDebt.push({ member, currentBalance })
    if (currentBalance >= 0 && afterBalance < 0) {
      afterDebt.push({ member, currentBalance, deduction, afterBalance })
    }
  })

  return { currentDebt, afterDebt }
}
