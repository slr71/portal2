import Link from "next/link"
import { makeStyles } from '@material-ui/core/styles'
import { Container, Paper, Typography, TextField, TableContainer, Table, TableHead, TableBody, TableFooter, TableRow, TableCell, TablePagination } from '@material-ui/core'
import { Layout, DateSpan } from '../../components'

//FIXME duplicated elsewhere
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '4em'
  }
}))

const FormSubmissions = props => {
  const classes = useStyles()

  return (
    <Layout>
      <Container maxWidth='lg'>
        <Paper elevation={3} className={classes.paper}>
          <Typography component="h1" variant="h4">Form Submissions</Typography>
          <Typography color="textSecondary" gutterBottom>Search across username, first name, last name, institution, department, country, region and research area</Typography>
          <TextField placeholder="Search ..." />
          <FormSubmissionTable {...props} />
        </Paper>
      </Container>
    </Layout>
  )
}

const FormSubmissionTable = props => {
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
    // const res = await fetchFormRequests(page * rowsPerPage, rowsPerPage)
    // const { count, results } = await res.json()
    // setCount(count)
    // setRows(results)
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

export async function getServerSideProps({ req }) {
  const { count, results } = await req.api.formSubmissions()

  return {
    props: {
      count,
      results
    }
  }
}

export default FormSubmissions