import fetch from 'isomorphic-unfetch'
import Link from "next/link"
import { makeStyles } from '@material-ui/core/styles'
import { Container, Paper, Typography, TextField, IconButton, TableContainer, Table, TableHead, TableBody, TableFooter, TableRow, TableCell, TablePagination } from '@material-ui/core'
import { Layout, DateSpan } from '../../components'
import { apiBaseUrl } from '../../config'

//FIXME duplicated elsewhere
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '4em'
  }
}))

const FormRequests = props => {
  const classes = useStyles()

  return (
    <Layout {...props}>
      <Container maxWidth='lg'>
        <Paper elevation={3} className={classes.paper}>
          <Typography component="h1" variant="h4">Form Submissions</Typography>
          <Typography color="textSecondary" gutterBottom>Search across username, first name, last name, institution, department, country, region and research area</Typography>
          <TextField placeholder="Search ..." />
          <FormRequestTable {...props} />
        </Paper>
      </Container>
    </Layout>
  )
}

const FormRequestTable = props => {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [rows, setRows] = React.useState(props.results)
  const [count, setCount] = React.useState(props.count)

  const handleChangePage = async (event, newPage) => {
    setPage(newPage)
    updateTable(newPage, rowsPerPage)
  }

  const handleChangeRowsPerPage = async (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
    updateTable(0, event.target.value)
  }

  const updateTable = async (page, rowsPerPage) => {
    const res = await fetchFormRequests(page * rowsPerPage, rowsPerPage)
    const { count, results } = await res.json()
    setCount(count)
    setRows(results)
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
            <TableRow>
              <TableCell>Form</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
        <TableBody>
          {rows.map(submission => (
            <Link key={submission.id} href={`/administrative/submissions/${submission.id}`}>
              <TableRow hover style={{cursor: 'pointer'}}>
                <TableCell>{submission.form.name}</TableCell>
                <TableCell>{submission.user.username}</TableCell>
                <TableCell>{submission.user.email}</TableCell>
                <TableCell>{submission.user.region.country.name}</TableCell>
                <TableCell>
                  <DateSpan date={submission.updated_at} />
                </TableCell>
              </TableRow>
            </Link>
          ))}
        </TableBody>
        <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPage={rowsPerPage}
                count={count}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
      </Table>
    </TableContainer>
  )
}

export async function getServerSideProps(context) {
  //FIXME move user request into Express middleware
  let res = await fetch(apiBaseUrl + `/users/mine`)
  const user = await res.json()

  res = await fetchFormRequests()
  const { count, results } = await res.json()

  return {
    props: {
      user,
      count,
      results
    }
  }
}

const fetchFormRequests = (offset, limit) => {
  const opts = { offset, limit }
  const queryStr = Object.keys(opts)
    .filter(key => opts[key])
    .map(key => key + '=' + opts[key])
    .reduce((acc, s) => acc + '&' + s, '')

  return fetch(apiBaseUrl + `/forms/submissions?${queryStr}`)
}

export default FormRequests