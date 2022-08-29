import React, { useState } from 'react'
import { makeStyles } from '@mui/styles'
import { Button } from '@mui/material/'
import { cyan, teal } from '@mui/material/colors/'

import { Section } from '../../common'
// import { HistoryTable, WithdrawalAgeInfo, PayoutAgeInfo } from './results'
import HistoryTable from './results/HistoryTable'
import WithdrawalAgeInfo from './results/WithdrawalAgeInfo'
import PayoutAgeInfo from './results/PayoutAgeInfo'

import { FutureValues } from '../../../utils/cpf/types'

interface ResultsProps {
  futureValues: FutureValues
}

const useStyles = makeStyles((theme) => ({
  buttonWrapper: {
    textAlign: 'center',
    margin: theme.spacing(1.5, 0),
  },
  button: {
    backgroundColor: teal[200],
    '&:hover': {
      backgroundColor: cyan[200],
    },
  },
}))

const Results: React.FunctionComponent<ResultsProps> = (props) => {
  const { futureValues } = props
  const {
    history,
    monthlySalary,
    historyAfterWithdrawalAge,
    salaryHistory,
    salaryHistoryAfterWithdrawalAge,
  } = futureValues
  const classes = useStyles()

  const [historyOpen, setHistoryOpen] = useState<boolean>(false)
  const [historyAfterWithdrawalAgeOpen, setHistoryAfterWithdrawalAgeOpen] =
    useState<boolean>(false)

  return (
    <>
      {/* OA and SA during Withdrawal Age (55)*/}
      <Section>
        <WithdrawalAgeInfo futureValues={futureValues} />

        {/* History Table for Transactions up to 55 years old */}
        {history.length > 0 && (
          <div className={classes.buttonWrapper}>
            <Button
              variant="contained"
              className={classes.button}
              onClick={() => setHistoryOpen(!historyOpen)}
            >
              {historyOpen ? 'Hide' : 'Show'} Calculations Till 55!
            </Button>
          </div>
        )}
        {historyOpen && (
          <>
            <HistoryTable
              data={history}
              groupByYear={monthlySalary > 0}
              salaryData={salaryHistory}
            />
            <div className={classes.buttonWrapper}>
              <Button
                variant="contained"
                className={classes.button}
                onClick={() => setHistoryOpen(!historyOpen)}
              >
                {historyOpen ? 'Hide' : 'Show'} Calculations Till 55!
              </Button>
            </div>
          </>
        )}
      </Section>

      {/* OA and SA during Retirement Age (65)*/}
      <Section>
        <PayoutAgeInfo futureValues={futureValues} />

        {/* History Table for Transactions from 55 to 65 years old */}
        {historyAfterWithdrawalAge.length > 0 && (
          <div className={classes.buttonWrapper}>
            <Button
              variant="contained"
              className={classes.button}
              onClick={() =>
                setHistoryAfterWithdrawalAgeOpen(!historyAfterWithdrawalAgeOpen)
              }
            >
              {historyAfterWithdrawalAgeOpen ? 'Hide' : 'Show'} Calculations
              After 55!
            </Button>
          </div>
        )}
        {historyAfterWithdrawalAgeOpen && (
          <>
            <HistoryTable
              data={historyAfterWithdrawalAge}
              groupByYear={monthlySalary > 0}
              salaryData={salaryHistoryAfterWithdrawalAge}
            />
            <div className={classes.buttonWrapper}>
              <Button
                variant="contained"
                className={classes.button}
                onClick={() =>
                  setHistoryAfterWithdrawalAgeOpen(
                    !historyAfterWithdrawalAgeOpen
                  )
                }
              >
                {historyAfterWithdrawalAgeOpen ? 'Hide' : 'Show'} Calculations
                After 55!
              </Button>
            </div>
          </>
        )}
      </Section>
    </>
  )
}

export default Results
