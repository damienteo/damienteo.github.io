import moment from 'moment'

export interface Entry {
  date: string
  category: string
  ordinaryAccount: number
  specialAccount: number
  retirementAccount?: number
}

export interface GroupsType {
  // Each key (going by year) has an array of entries
  [key: string]: Entry[]
}

export interface SalaryRecord {
  amount: number
  age: number
  year: number
}

export interface Accounts {
  ordinaryAccount?: number
  specialAccount?: number
  retirementAccount?: number
}

export interface Values {
  ordinaryAccount: string
  specialAccount: string
  monthlySalary: string
  salaryIncreaseRate: string
  housingLoan: string
  [key: string]: string
}

export interface AccountValues {
  ordinaryAccount: string
  specialAccount: string
  monthlySalary: string
  salaryIncreaseRate: string
  selectedDate: moment.Moment
  housingLoan: string
  housingLoanDate: moment.Moment
}

export interface FutureValues {
  monthsTillWithdrawal: number
  ordinaryAccount: number
  specialAccount: number
  retirementAccount: number
  ordinaryAccountAtWithdrawalAge: number
  specialAccountAtWithdrawalAge: number
  history: Entry[]
  historyAfterWithdrawalAge: Entry[]
  monthlySalary: number
  salaryHistory: SalaryRecord[]
  salaryHistoryAfterWithdrawalAge: SalaryRecord[]
}

export interface ErrorValues {
  // Each key (going by field) has a string
  [key: string]: string | undefined
}
