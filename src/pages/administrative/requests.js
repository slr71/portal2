import { useState, useEffect } from 'react'
import Link from "next/link"
import { makeStyles } from '@material-ui/core/styles'
import { Container, Paper, Grid, Typography, TextField, TableContainer, Table, TableHead, TableBody, TableFooter, TableRow, TableCell, TablePagination } from '@material-ui/core'
import { Layout, DateSpan } from '../../components'
import { useAPI } from '../../contexts/api'

//FIXME duplicated elsewhere
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '3em'
  }
}))

//TODO move pagination code into shared component
const AccessRequests = props => {
  const api = useAPI()
  const classes = useStyles()

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [keyword, setKeyword] = useState()
  const [rows, setRows] = useState(props.results)
  const [count, setCount] = useState(props.count)

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
    const res = await fetchRequests(page * rowsPerPage, rowsPerPage)
    const { count, results } = await res.json()
    setCount(count)
    setRows(results)
  }

  const handleChangeKeyword = async (event) => {
    setKeyword(event.target.value)
    setPage(0)
  }

  //TODO add debounce
  useEffect(() => {
      api.serviceRequests({ 
        offset: page * rowsPerPage, 
        limit: rowsPerPage,
        keyword: keyword
      }).then(({ count, results }) => {
        setCount(count)
        setRows(results)
      })
    },
    [page, rowsPerPage, keyword]
  )

  return (
    <Layout breadcrumbs>
      <Container maxWidth='lg'>
        <br />
        <Paper elevation={3} className={classes.paper}>
          <Grid container justify="space-between">
            <Grid item>
              <Typography component="h1" variant="h4">Access Requests</Typography>
            </Grid>
            <Grid item>
              <TextField style={{width: '20em'}} placeholder="Search ..." onChange={handleChangeKeyword} />
            </Grid>
          </Grid>
          <Typography color="textSecondary" gutterBottom>Search across service name, username, email, country, and status</Typography>
          <br />
          <RequestTable rows={rows} rowsPerPage={rowsPerPage} count={count} page={page} handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage} />
        </Paper>
      </Container>
    </Layout>
  )
}

const RequestTable = ({ rows, rowsPerPage, count, page, handleChangePage, handleChangeRowsPerPage }) => (
  <TableContainer component={Paper}>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Service</TableCell>
          <TableCell>Username</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Country</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(request => (
          <Link key={request.id} href={`/administrative/requests/${request.id}`}>
            <TableRow hover style={{cursor: 'pointer'}}>
              <TableCell>{request.service.name}</TableCell>
              <TableCell>{request.user.username}</TableCell>
              <TableCell>{request.user.email}</TableCell>
              <TableCell>{request.user.region.country.name}</TableCell>
              <TableCell>
                <DateSpan date={request.updated_at} />
              </TableCell>
              <TableCell>{request.status}</TableCell>
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

export async function getServerSideProps({ req }) {
  const { count, results } = await req.api.serviceRequests()

  return {
    props: {
      count,
      results
    }
  }
}

export default AccessRequests