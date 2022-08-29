import React, { useState } from 'react'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { makeStyles } from '@mui/styles'

import Layout from '../layout/Layout'
import { Paragraph } from '../common'
import UserInput from './cpfForecast/UserInput'
import Intro from './cpfForecast/Intro'
import Results from './cpfForecast/Results'

import { FutureValues } from '../../utils/cpf/types'

const useStyles = makeStyles((theme) => ({
  introduction: {
    margin: theme.spacing(2, 0),
  },
  bottomPlaceholder: {
    height: theme.spacing(5),
  },
}))

const CPFForecastPage = () => {
  const classes = useStyles()

  const [isCalculating, setCalculating] = useState<boolean>(false)

  const [futureValues, setFutureValues] = useState<FutureValues>({
    monthsTillWithdrawal: 0,
    ordinaryAccount: 0,
    specialAccount: 0,
    retirementAccount: 0,
    ordinaryAccountAtWithdrawalAge: 0,
    specialAccountAtWithdrawalAge: 0,
    history: [],
    historyAfterWithdrawalAge: [],
    monthlySalary: 0,
    salaryHistory: [],
    salaryHistoryAfterWithdrawalAge: [],
  })

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Layout
        title="CPF Forecast"
        description="CPF Forecast helps users to calculate CPF OA and SA years down the road, based on their projected contributions"
      >
        <Intro />

        <Paragraph variant="subtitle2" className={classes.introduction}>
          Interest Rates, etc, were last checked in April 2020. This page does
          not save any data, and calculates values based on your input. Medisave
          values are not included as this page mainly deals with usage of CPF
          for retirement and potentially housing.
        </Paragraph>

        <UserInput
          setCalculating={setCalculating}
          setFutureValues={setFutureValues}
        />

        {isCalculating && <Results futureValues={futureValues} />}

        <div className={classes.bottomPlaceholder} />
      </Layout>
    </LocalizationProvider>
  )
}

export default CPFForecastPage
