import React, { SyntheticEvent } from 'react'
import {
  FormControl,
  FormHelperText,
  Input,
  InputAdornment,
  InputLabel,
} from '@material-ui/core/'

type CurrencyInputProps = {
  label: string
  value: number
  field: string
  handleChange: (field: string) => (event: SyntheticEvent) => void
  error: boolean
  helperText: string
}

const CurrencyInput: React.FunctionComponent<CurrencyInputProps> = (props) => {
  const { label, value, field, handleChange, error, helperText } = props

  return (
    <FormControl fullWidth>
      <InputLabel htmlFor="standard-adornment-amount">{label}</InputLabel>
      <Input
        id="standard-adornment-amount"
        value={value}
        onChange={handleChange(field)}
        type="number"
        error={error}
        startAdornment={<InputAdornment position="start">$</InputAdornment>}
      />
      <FormHelperText id="component-error-text">{helperText}</FormHelperText>
    </FormControl>
  )
}

export default CurrencyInput
