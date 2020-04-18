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

export interface Accounts {
  ordinaryAccount?: number
  specialAccount?: number
  retirementAccount?: number
}

export interface Values {
  ordinaryAccount: string
  specialAccount: string
  monthlySalary: string
  [key: string]: string
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
}

export interface ErrorValues {
  // Each key (going by field) has a string
  [key: string]: string | undefined
}
