import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Grid } from '@material-ui/core/'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import Layout from '../layout/layout'
import Header from '../common/header'
import Paragraph from '../common/paragraph'
import ExternalLink from '../common/externalLink'
import CurrencyInput from '../common/currencyInput'
import Section from '../common/section'
import { cyan, teal } from '@material-ui/core/colors/'

const useStyles = makeStyles((theme) => ({
  paragraph: {
    margin: `0 0 ${theme.spacing(1.5)}px`,
    color: '#282c35',
  },
  inputWrapper: {
    padding: 10,
  },
  buttonWrapper: {
    textAlign: 'center',
  },
  button: {
    backgroundColor: teal[200],
    '&:hover': {
      backgroundColor: cyan[200],
    },
  },
}))

const cpfAccounts = [
  {
    label: 'Ordinary Account',
    field: 'ordinaryAccount',
  },
  {
    label: 'Special Account',
    field: 'specialAccount',
  },
]

const CPFCalculatorPage = () => {
  const classes = useStyles()

  const [values, setValues] = useState({
    ordinaryAccount: '',
    specialAccount: '',
  })
  const [selectedDate, handleDateChange] = useState(new Date())

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value })
  }
  console.log('selectedDate', selectedDate)
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Layout>
        <Header text="CPF Calculator" />

        {/* Disclaimer */}
        <Paragraph variant="subtitle2">
          * This page is not meant to be for financial advice. I am neither an
          employee of CPF, nor am I a representative of the government. The
          calculations here are based on research I have done, and I have listed
          my sources as far as possible. If there are any corrections or
          enhancements to be made, please let me know.
        </Paragraph>

        {/* User Input */}
        <Section>
          <Paragraph className={classes.paragraph}>
            First, type in an amount for the CPF Ordinary and Special Account.
          </Paragraph>
          <Grid container>
            {cpfAccounts.map((account) => (
              <Grid item sm={6} className={classes.inputWrapper}>
                <CurrencyInput
                  value={values[account.field]}
                  label={account.label}
                  field={account.field}
                  handleChange={handleChange}
                />
              </Grid>
            ))}
          </Grid>
        </Section>
        <Section>
          <Paragraph className={classes.paragraph}>
            Next, type in a future date (typically, this would be when you turn
            55)
          </Paragraph>
          <Grid container>
            <Grid item sm={6} className={classes.inputWrapper}>
              <KeyboardDatePicker
                value={selectedDate}
                onChange={(date) => handleDateChange(date)}
                format="dd/MM/yyyy"
                minDate={new Date()}
              />
            </Grid>
          </Grid>
        </Section>
        <div className={classes.buttonWrapper}>
          <Button variant="contained" className={classes.button}>
            Calculate my CPF!
          </Button>
        </div>

        <Paragraph>
          The FE will calculate for them how much is in their SA and OA at the
          age of 55.
        </Paragraph>
        <Paragraph>
          The FE will calculate for them how much is in their RA at the age of
          65.
        </Paragraph>
        <Paragraph>
          The FE will calculate for them how much they can withdraw at the age
          of 55.
        </Paragraph>
        <Paragraph>
          The FE will calculate for them how much they can withdraw at the age
          of 65.
        </Paragraph>
        <Paragraph>
          The user should be able to input their current monthly contributions
          to OA and SA.
        </Paragraph>

        <Paragraph>
          The user can press a button, whcih will show a new panel below. This
          new panel will show how much more they can get if they transfer all
          sums to SA.
        </Paragraph>
        <Paragraph>
          The user can account for usage of OA sums to a HDB flat at a certain
          future date.
        </Paragraph>
        <Paragraph>
          The user can add in the pledging of their HDB value.
        </Paragraph>
        <Paragraph>
          The user can check how much they will need to pay back to CPF when
          they sell the HDB flat.
        </Paragraph>
        <Paragraph>
          The user can download an excel sheet to store all data.
        </Paragraph>
        <Paragraph>
          The user can upload an excel sheet to read previous data.
        </Paragraph>

        <Paragraph>
          This site was created with a mixture of:{' '}
          <ExternalLink url="https://reactjs.org/" label="React.js" />
          , <ExternalLink url="https://nextjs.org/" label="Next.js" />, and{' '}
          <ExternalLink url="https://material-ui.com/" label="Material UI" />.
          Essentially, it's just Javascript, HTML, and CSS.
        </Paragraph>
      </Layout>
    </MuiPickersUtilsProvider>
  )
}

export default CPFCalculatorPage
