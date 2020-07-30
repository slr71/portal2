import fetch from 'isomorphic-unfetch'
import Link from "next/link"
import { makeStyles } from '@material-ui/core/styles'
import { Container, Box, Paper, Typography, TextField, TableContainer, Table, TableHead, TableBody, TableFooter, TableRow, TableCell, TablePagination } from '@material-ui/core'
import Layout from '../../components/Layout'
import { apiBaseUrl } from '../../config'

//FIXME duplicated elsewhere
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '4em'
  }
}))

const Users = props => {
  const classes = useStyles()

  return (
    <Layout {...props}>
      <Container maxWidth='lg'>
        <Paper elevation={3} className={classes.paper}>
          <Box display="flex">
            <Typography component="h1" variant="h4" gutterBottom>Users</Typography>
            <TextField placeholder="Search ..." />
          </Box>
          <UserTable {...props} />
        </Paper>
      </Container>
    </Layout>
  )
}

const UserTable = props => {
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
    const res = await fetchUsers(page * rowsPerPage, rowsPerPage)
    const { count, results } = await res.json()
    setCount(count)
    setRows(results)
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell align="right">Last Name</TableCell>
            <TableCell align="right">Username</TableCell>
            <TableCell align="right">Institution</TableCell>
            <TableCell align="right">Occupation</TableCell>
            <TableCell align="right">Region</TableCell>
            <TableCell align="right">Country</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(user => (
            <Link key={user.id} href={`/administrative/users/${user.id}`}>
              <TableRow hover style={{cursor: 'pointer'}}>
                <TableCell>{user.first_name}</TableCell>
                <TableCell align="right">{user.last_name}</TableCell>
                <TableCell align="right">{user.username}</TableCell>
                <TableCell align="right">{user.institution}</TableCell>
                <TableCell align="right">{user.occupation.name}</TableCell>
                <TableCell align="right">{user.region.name}</TableCell>
                <TableCell align="right">{user.region.country.name}</TableCell>
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

  const req = context.req
  const token = ( req && req.kauth && req.kauth.grant && req.kauth.grant.access_token ? req.kauth.grant.access_token.token : null )
  res = await fetch(apiBaseUrl + '/users', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` } //FIXME add Express middleware to do this like Sonora
  })
  const { count, results } = await res.json()

  return {
    props: {
      user,
      count,
      results
    }
  }
}

const fetchUsers = (offset, limit) => {
  const opts = { offset, limit }
  const queryStr = Object.keys(opts)
    .filter(key => opts[key])
    .map(key => key + '=' + opts[key])
    .reduce((acc, s) => acc + '&' + s, '')

  return fetch(apiBaseUrl + `/users?${queryStr}`)
}

export default Users