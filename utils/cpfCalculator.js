import moment from 'moment'
import { CPFAccount } from './cpfAccount'

export const roundTo2Dec = (value) => {
  let decimalPlace = value.indexOf('.')
  let isTooLong = value.length > decimalPlace + 3
  let invalidNum = isNaN(parseFloat(value))

  if ((decimalPlace >= 0 && isTooLong) || invalidNum) {
    value = value.slice(0, -1)
  }

  return value
}

export const getAge = (selectedDate, timePeriod) => {
  const current = moment()
  const birthday = moment(selectedDate)
  const duration = current.diff(birthday, timePeriod)
  return duration
}

const getMonthsTillEOY = () => {
  const currentYear = moment().year()
  const startOfNextYear = moment(`01/01/${currentYear + 1}`, 'DD/MM/YYYY')
  const monthsTillInterest = startOfNextYear.diff(moment(), 'months')
  return monthsTillInterest
}

export const calculateFutureValues = (values, selectedDate) => {
  const newAccount = new CPFAccount(values, selectedDate)

  // CPF interest is computed monthly. It is then credited to your respective accounts and compounded annually. CPF interest earned in 2019 will be credited to members’ CPF accounts by the end of 1 January 2020(https://www.cpf.gov.sg/members/FAQ/schemes/other-matters/others/FAQDetails?category=other+matters&group=Others&ajfaqid=2192131&folderid=13726).

  // Add simple interest based on months, and add interest to sum annually every 1st Jan

  // Calculate interest until the end of the year
  const monthsTillEOY = getMonthsTillEOY()
  newAccount.addSalaryAndInterestOverTime(monthsTillEOY)

  // Calculate number of years left in which interest is added to account at end of the year
  const monthsOfInterestAfterThisYear =
    newAccount.monthsTillWithdrawal - monthsTillEOY
  const remainingMonths = monthsOfInterestAfterThisYear % 12
  const monthsOfFullYears = monthsOfInterestAfterThisYear - remainingMonths
  // Calculate interests for the remaining full years
  newAccount.addSalaryAndInterestOverTime(monthsOfFullYears)

  // Calculate interest for the remaining months until 55
  newAccount.addSalaryAndInterestOverTime(remainingMonths)

  return newAccount.accountValues
}
