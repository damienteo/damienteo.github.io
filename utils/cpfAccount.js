import moment from 'moment'
import {
  cpfAllocation,
  cpfValues,
  fullRetirementSum,
  retirementSumIncrease,
  ordinaryWageCeiling,
  withdrawalAge,
} from '../constants'
import { getAge } from './cpfForecast'

const {
  ordinaryIR,
  specialIR,
  retirementIR,
  bonusIR,
  bonusAmtCap,
  ordinaryAmtCap,
} = cpfValues

const ordinaryInterestRate = ordinaryIR / 12
const specialInterestRate = specialIR / 12
const retirementInterestRate = retirementIR / 12

const bonusOrdinaryInterestRate = (ordinaryIR + bonusIR) / 12
const bonusSpecialInterestRate = (specialIR + bonusIR) / 12
const bonusRetirementInterestRate = (retirementIR + bonusIR) / 12

const normalRound = (value) => {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

const getCPFAllocation = (age) => {
  if (age <= 35) return cpfAllocation['35AndBelow']

  if (age >= 36 && age <= 45) return cpfAllocation['36to45']

  if (age >= 46 && age <= 50) return cpfAllocation['46to50']

  if (age >= 51 && age <= 55) return cpfAllocation['51to55']

  if (age >= 56 && age <= 60) return cpfAllocation['56to60']

  if (age >= 61 && age <= 65) return cpfAllocation['61to65']

  if (age >= 66) return cpfAllocation['66andAbove']
}

export class CPFAccount {
  #ordinaryAccount
  #specialAccount
  #retirementAccount = 0
  #ordinaryAccountAtWithdrawalAge = 0
  #specialAccountAtWithdrawalAge = 0
  #monthlySalary

  #currentAge
  #currentDate = moment()
  #monthProgression = 0
  #reachedWithdrawalAge = false
  #history = []
  #historyAfterWithdrawalAge = []
  #monthsTillWithdrawal

  #accruedOrdinaryInterest = 0
  #accruedSpecialInterest = 0
  #accruedRetirementInterest = 0

  constructor(values, selectedDate) {
    const { ordinaryAccount, specialAccount, monthlySalary } = values
    // roundTo2Dec function converts values into string
    this.#ordinaryAccount = parseFloat(ordinaryAccount)
    this.#specialAccount = parseFloat(specialAccount)
    this.#monthlySalary = parseFloat(monthlySalary)

    const currentAgeInMonths = getAge(selectedDate, 'months')
    const monthsTillWithdrawal = withdrawalAge * 12 - currentAgeInMonths
    this.#monthsTillWithdrawal = monthsTillWithdrawal

    this.#currentAge = getAge(selectedDate, 'years')
  }

  updateTimePeriod() {
    // Track progression of time
    this.#monthProgression++
    this.#currentDate.add(1, 'M')

    // Update Age as years pass
    if (this.#monthProgression % 12 === 0) {
      this.#currentAge++
    }
  }

  updateHistory(category, rest) {
    this.#history.push({
      date: this.#currentDate.format('MMM YYYY'),
      category,
      ordinaryAccount: normalRound(this.#ordinaryAccount),
      specialAccount: normalRound(this.#specialAccount),
      ...rest,
    })
  }

  updateHistoryAfterWithdrawalAge(category, rest) {
    this.#historyAfterWithdrawalAge.push({
      date: this.#currentDate.format('MMM YYYY'),
      category,
      ordinaryAccount: normalRound(this.#ordinaryAccount),
      specialAccount: normalRound(this.#specialAccount),
      retirementAccount: normalRound(this.#retirementAccount),
      ...rest,
    })
  }

  updateAccountsAtWithdrawalAge() {
    this.#ordinaryAccountAtWithdrawalAge = this.#ordinaryAccount
    this.#specialAccountAtWithdrawalAge = this.#specialAccount
    this.#reachedWithdrawalAge = true

    const dateOfWithdrawalAge = this.#history[this.#history.length - 1].date
    const yearOfWithdrawalAge = dateOfWithdrawalAge.split(' ')[1]
    const currentYear = moment().year()
    const yearsFromPresent = yearOfWithdrawalAge - currentYear

    const nextCPFFullRetirementSum =
      fullRetirementSum + retirementSumIncrease * yearsFromPresent

    // Transfer from Special Account to Retirement Account first
    const isSpecialEnoughForRetirement =
      this.#specialAccount > fullRetirementSum

    // Calculate amounts to be transferred from SA / OA to RA
    const specialToRetirementAmount = isSpecialEnoughForRetirement
      ? fullRetirementSum
      : this.#specialAccount

    const retirementSumShortfall = fullRetirementSum - specialToRetirementAmount
    const ordinaryToRetirementAmount =
      this.#ordinaryAccount > retirementSumShortfall
        ? retirementSumShortfall
        : this.#ordinaryAccount

    //  Remove SA and OA Amounts to be transferred
    this.#specialAccount = this.#specialAccount - specialToRetirementAmount
    this.#ordinaryAccount = this.#ordinaryAccount - ordinaryToRetirementAmount

    this.#retirementAccount =
      specialToRetirementAmount + ordinaryToRetirementAmount

    this.updateHistoryAfterWithdrawalAge('Transfer')
  }

  addMonthlySalary() {
    // If monthly salary exceeds wage ceiling, take only wage ceiling as eligible for CPF contribution
    const eligibleSalary =
      this.#monthlySalary > ordinaryWageCeiling
        ? ordinaryWageCeiling
        : this.#monthlySalary

    // Get CPF Allocation rates based on current age
    const currentCPFAllocation = getCPFAllocation(this.#currentAge)

    // Calculate CPF Allocation amounts and add accordingly
    const OAContribution = normalRound(eligibleSalary * currentCPFAllocation.OA)
    this.#ordinaryAccount = this.#ordinaryAccount + OAContribution

    const SAContribution = normalRound(eligibleSalary * currentCPFAllocation.SA)
    this.#specialAccount = this.#specialAccount + SAContribution

    // Update history  and accrued amounts only if there is an addition of interest to the balance
    if (OAContribution > 0 || SAContribution > 0) {
      if (!this.#reachedWithdrawalAge) {
        this.updateHistory('Contribution', {
          ordinaryAccount: OAContribution,
          specialAccount: SAContribution,
        })
      } else {
        this.updateHistoryAfterWithdrawalAge('Contribution', {
          ordinaryAccount: OAContribution,
          specialAccount: SAContribution,
          retirementAccount: 0,
        })
      }
    }
  }

  addMonthlyInterest() {
    // Take note of Bonus Ordinary Account Cap
    const eligibleOrdinaryAmount =
      this.#ordinaryAccount > ordinaryAmtCap
        ? ordinaryAmtCap
        : this.#ordinaryAccount

    // Settle Additional Interest for Ordinary Account
    if (eligibleOrdinaryAmount === ordinaryAmtCap) {
      // Take out amount in OA that is not eligible for bonus interest rate
      const nonBonusOrdinaryAmount = this.#ordinaryAccount - ordinaryAmtCap

      const bonusInterest = normalRound(
        ordinaryAmtCap * bonusOrdinaryInterestRate
      )
      const nonBonusInterest = normalRound(
        nonBonusOrdinaryAmount * ordinaryInterestRate
      )

      // Accrue OA interest
      this.#accruedOrdinaryInterest =
        this.#accruedOrdinaryInterest + bonusInterest + nonBonusInterest
    } else {
      // If Ordinary Account is below the cap, entire Ordinary Account is eligible for bonus interest
      this.#accruedOrdinaryInterest =
        this.#accruedOrdinaryInterest +
        normalRound(this.#ordinaryAccount * bonusOrdinaryInterestRate)
    }

    // Take note of Special Account eligible for Bonus Rate, by taking out Ordinary Account from Bonus Account Cap
    const eligibleSpecialAmountCap = bonusAmtCap - eligibleOrdinaryAmount

    // Take note of Amount in Special Account eligible for Bonus Interest
    const eligibleSpecialAmount =
      this.#specialAccount > eligibleSpecialAmountCap
        ? eligibleSpecialAmountCap
        : this.#specialAccount

    // Take note of Amount in Special Account NOT eligible for Bonus Interest
    const nonBonusSpecialAmount = this.#specialAccount - eligibleSpecialAmount

    // Settle Additional Interest for Special Account
    const bonusSpecialInterest = normalRound(
      eligibleSpecialAmount * bonusSpecialInterestRate
    )
    const nonBonusSpecialInterest = normalRound(
      nonBonusSpecialAmount * specialInterestRate
    )

    // Accrue SA interest
    this.#accruedSpecialInterest = normalRound(
      this.#accruedSpecialInterest +
        bonusSpecialInterest +
        nonBonusSpecialInterest
    )

    // If Withdrawal Age reached, calculate Retirement Account interest adn Accrue:
    if (this.#reachedWithdrawalAge) {
      // Take note of Retirement Account eligible for Bonus Rate, by taking out eligibleSpecialAmount from eligibleSpecialAmountCap
      const eligibleRetirementAmountCap =
        eligibleSpecialAmountCap - eligibleSpecialAmount

      // Take note of Amount in Special Account eligible for Bonus Interest
      const eligibleRetirementAmount =
        this.#retirementAccount > eligibleRetirementAmountCap
          ? eligibleRetirementAmountCap
          : this.#retirementAccount

      // Take note of Amount in Special Account NOT eligible for Bonus Interest
      const nonBonusRetirementAmount =
        this.#retirementAccount - eligibleRetirementAmount

      // Settle Additional Interest for Retirement Account
      const bonusRetirementInterest = normalRound(
        eligibleRetirementAmount * bonusRetirementInterestRate
      )
      const nonBonusRetirementInterest = normalRound(
        nonBonusRetirementAmount * retirementInterestRate
      )

      // Accrue RA interest
      this.#accruedRetirementInterest = normalRound(
        this.#accruedRetirementInterest +
          bonusRetirementInterest +
          nonBonusRetirementInterest
      )
    }
  }

  addInterestToAccounts() {
    this.#ordinaryAccount = normalRound(
      this.#ordinaryAccount + this.#accruedOrdinaryInterest
    )
    this.#specialAccount = normalRound(
      this.#specialAccount + this.#accruedSpecialInterest
    )
    if (this.#reachedWithdrawalAge) {
      this.#retirementAccount = normalRound(
        this.#retirementAccount + this.#accruedRetirementInterest
      )
    }

    // Update history  and accrued amounts only if there is an addition of interest to the balance
    if (
      this.#accruedOrdinaryInterest > 0 ||
      this.#accruedSpecialInterest > 0 ||
      this.#accruedRetirementInterest > 0
    ) {
      if (!this.#reachedWithdrawalAge) {
        this.updateHistory('Interest', {
          ordinaryAccount: this.#accruedOrdinaryInterest,
          specialAccount: this.#accruedSpecialInterest,
        })
      } else {
        this.updateHistoryAfterWithdrawalAge('Interest', {
          ordinaryAccount: this.#accruedOrdinaryInterest,
          specialAccount: this.#accruedSpecialInterest,
          retirementAccount: this.#accruedRetirementInterest,
        })

        this.#accruedRetirementInterest = 0
      }

      this.#accruedOrdinaryInterest = 0
      this.#accruedSpecialInterest = 0
    }
  }

  addSalaryAndInterestOverTime(months) {
    let period = months

    while (period > 0) {
      // Calculate and add Accrued Interest for the end of the previous year. Ignore for the previous full year as that has been accounted for.
      if (period % 12 === 0 && period !== months) {
        this.addInterestToAccounts()

        if (!this.#reachedWithdrawalAge) {
          this.updateHistory('Balance')
        } else {
          this.updateHistoryAfterWithdrawalAge('Balance')
        }
      }

      // Update period for the start of the month
      period -= 1
      this.updateTimePeriod()

      // Update Accrued Interest amount
      this.addMonthlyInterest()

      // Add salary at the end of the month, as interest is based on the lowest amount in the account at any time in the month
      this.addMonthlySalary()

      // Add interest at the end of the period
      if (period === 0) {
        this.addInterestToAccounts()

        if (!this.#reachedWithdrawalAge) {
          this.updateHistory('Balance')
        } else {
          this.updateHistoryAfterWithdrawalAge('Balance')
        }
      }
    }
  }

  get accountValues() {
    return {
      ordinaryAccount: this.#ordinaryAccount,
      specialAccount: this.#specialAccount,
      retirementAccount: this.#retirementAccount,
      ordinaryAccountAtWithdrawalAge: this.#ordinaryAccountAtWithdrawalAge,
      specialAccountAtWithdrawalAge: this.#specialAccountAtWithdrawalAge,
      monthsTillWithdrawal: this.#monthsTillWithdrawal,
      history: this.#history,
      historyAfterWithdrawalAge: this.#historyAfterWithdrawalAge,
      monthlySalary: this.#monthlySalary,
    }
  }

  get monthsTillWithdrawal() {
    return this.#monthsTillWithdrawal
  }
}
