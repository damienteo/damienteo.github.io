import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

const useStyles = makeStyles({
  buttonsWrapper: {
    textAlign: 'center',
  },
})

const chunkArray = (myArray, chunk_size) => {
  let index = 0
  const arrayLength = myArray.length
  const tempArray = []

  for (index = 0; index < arrayLength; index += chunk_size) {
    const myChunk = myArray.slice(index, index + chunk_size)
    // Do something if you want with the group
    tempArray.push(myChunk)
  }

  return tempArray
}

const HistoryTable = (props) => {
  const classes = useStyles()
  const { data = [] } = props
  const [page, setPage] = useState(0)

  const history = chunkArray(data, 15)

  const seePrevHistory = () => {
    setPage(page - 1)
  }

  const seeNextHistory = () => {
    setPage(page + 1)
  }

  const renderButtons = () => {
    return (
      <div className={classes.buttonsWrapper}>
        <IconButton
          aria-label={`Prev Button`}
          onClick={seePrevHistory}
          disabled={page === 0}
        >
          <ChevronLeftIcon />
        </IconButton>
        <IconButton
          aria-label={`Forward Button`}
          onClick={seeNextHistory}
          disabled={page === history.length - 1}
        >
          <ChevronRightIcon />
        </IconButton>
      </div>
    )
  }

  return (
    <>
      {renderButtons()}
      <TableContainer component={Paper}>
        <Table aria-label="CPF Forecast History">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Ordinary Account</TableCell>
              <TableCell align="right">Special Account</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history[page] &&
              history[page].map((row, index) => (
                <TableRow key={index + row.date}>
                  <TableCell component="th" scope="row">
                    {row.date}
                  </TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell align="right">
                    ${row.ordinaryAccount.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    ${row.specialAccount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {renderButtons()}
    </>
  )
}

export default HistoryTable
