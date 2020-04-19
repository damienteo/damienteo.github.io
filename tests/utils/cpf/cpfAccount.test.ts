import moment from 'moment'
import { cpfAllocation, withdrawalAge, payoutAge } from '../../../constants'
import { getCPFAllocation, CPFAccount } from '../../../utils/cpf/cpfAccount'

describe('getCPFAllocation should return the right interest rates', () => {
  test('Should return CPF rates for age below 36 if value is 25', () => {
    expect(getCPFAllocation(25)).toBe(cpfAllocation['35AndBelow'])
  })
  test('Should return CPF rates for age equal to 36 if value is 36', () => {
    expect(getCPFAllocation(36)).toBe(cpfAllocation['36to45'])
  })
  test('Should return CPF rates for age equal to 46 if value is 46', () => {
    expect(getCPFAllocation(46)).toBe(cpfAllocation['46to50'])
  })
  test('Should return CPF rates for age equal to 51 if value is 51', () => {
    expect(getCPFAllocation(51)).toBe(cpfAllocation['51to55'])
  })
  test('Should return CPF rates for age equal to 56 if value is 56', () => {
    expect(getCPFAllocation(56)).toBe(cpfAllocation['56to60'])
  })
  test('Should return CPF rates for age equal to 61 if value is 61', () => {
    expect(getCPFAllocation(61)).toBe(cpfAllocation['61to65'])
  })
  test('Should return CPF rates for age equal to 66 if value is 66', () => {
    expect(getCPFAllocation(66)).toBe(cpfAllocation['66andAbove'])
  })
  test('Should return CPF rates for age equal to 70 if value is 70', () => {
    expect(getCPFAllocation(70)).toBe(cpfAllocation['66andAbove'])
  })
})

let instance: CPFAccount

describe('CPFAccount should have methods to return values', () => {
  const values = {
    ordinaryAccount: '',
    specialAccount: '',
    monthlySalary: '',
  }
  const date = moment()

  beforeEach(() => {
    instance = new CPFAccount(values, date)
  })

  it('should have get methods that return values', async () => {
    expect(instance).toBeInstanceOf(CPFAccount)

    const accountValues = instance.accountValues
    expect(accountValues).toBeDefined()
    expect(typeof accountValues).toBe('object')

    expect(accountValues.history).toBeDefined()
    expect(Array.isArray(accountValues.history)).toBe(true)

    expect(accountValues.historyAfterWithdrawalAge).toBeDefined()
    expect(Array.isArray(accountValues.historyAfterWithdrawalAge)).toBe(true)

    const monthsTillWithdrawal = instance.monthsTillWithdrawal
    expect(monthsTillWithdrawal).toBeDefined()
    expect(typeof monthsTillWithdrawal).toBe('number')
  })
})

const date16YearsAgo = moment().subtract(16, 'y')
const yearsBeforeWithdrawal = withdrawalAge - 16
const monthsBeforeWithdrawal = yearsBeforeWithdrawal * 12
const yearsAfterWithdrawal = payoutAge - withdrawalAge
const monthsAfterWithdrawal = yearsAfterWithdrawal * 12

describe('CPFAccount should not have interest accruement in history if there is no money in special or ordinary accounts, nor monthly salary', () => {
  const values = {
    ordinaryAccount: '0',
    specialAccount: '0',
    monthlySalary: '0',
  }

  beforeEach(() => {
    instance = new CPFAccount(values, date16YearsAgo)
    instance.addSalaryAndInterestOverTime(monthsBeforeWithdrawal)
    instance.updateAccountsAtWithdrawalAge()
    instance.addSalaryAndInterestOverTime(monthsAfterWithdrawal)
  })

  it('Histories should not have entries with category: interest', async () => {
    const accountValues = instance.accountValues

    expect(accountValues.history).toEqual(
      expect.arrayContaining([
        expect.not.objectContaining({
          category: 'Interest',
        }),
      ])
    )

    expect(accountValues.historyAfterWithdrawalAge).toEqual(
      expect.arrayContaining([
        expect.not.objectContaining({
          category: 'Interest',
        }),
      ])
    )
  })
})

describe('CPFAccount should not have contributions in history if monthly salary is 0', () => {
  const values = {
    ordinaryAccount: '1000',
    specialAccount: '1000',
    monthlySalary: '0',
  }

  beforeAll(() => {
    instance = new CPFAccount(values, date16YearsAgo)
    instance.addSalaryAndInterestOverTime(monthsBeforeWithdrawal)
    instance.updateAccountsAtWithdrawalAge()
    instance.addSalaryAndInterestOverTime(monthsAfterWithdrawal)
  })

  it('Histories should not have entries with category: Contribution', async () => {
    const accountValues = instance.accountValues

    expect(accountValues.history).toEqual(
      expect.arrayContaining([
        expect.not.objectContaining({
          category: 'Contribution',
        }),
      ])
    )

    expect(accountValues.historyAfterWithdrawalAge).toEqual(
      expect.arrayContaining([
        expect.not.objectContaining({
          category: 'Contribution',
        }),
      ])
    )
  })
})

const normalValues = {
  ordinaryAccount: '1000',
  specialAccount: '1000',
  monthlySalary: '1000',
}

describe('CPFAccount should have contributions and interest in histories if there is at least a monthly salary', () => {
  beforeAll(() => {
    instance = new CPFAccount(normalValues, date16YearsAgo)
    instance.addSalaryAndInterestOverTime(monthsBeforeWithdrawal)
    instance.updateAccountsAtWithdrawalAge()
    instance.addSalaryAndInterestOverTime(monthsAfterWithdrawal)
  })

  it('historyAfterWithdrawalAge should not have any entries', async () => {
    const accountValues = instance.accountValues

    expect(accountValues.history).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: 'Contribution',
        }),
        expect.objectContaining({
          category: 'Interest',
        }),
      ])
    )

    expect(accountValues.historyAfterWithdrawalAge).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: 'Contribution',
        }),
        expect.objectContaining({
          category: 'Interest',
        }),
      ])
    )
  })
})

describe('CPFAccount should not have contributions in history after withdrawal age if updateAccountsAtWithdrawalAge method not called', () => {
  beforeAll(() => {
    instance = new CPFAccount(normalValues, date16YearsAgo)
    instance.addSalaryAndInterestOverTime(monthsBeforeWithdrawal)
    instance.addSalaryAndInterestOverTime(monthsAfterWithdrawal)
  })

  it('historyAfterWithdrawalAge should not have any entries', async () => {
    const accountValues = instance.accountValues
    expect(accountValues.historyAfterWithdrawalAge.length).toEqual(0)
  })
})
