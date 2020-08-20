import Link from "next/link"
import { makeStyles } from '@material-ui/core/styles'
import { Container, Box, Paper, Typography, TextField, TableContainer, Table, TableHead, TableBody, TableFooter, TableRow, TableCell, TablePagination } from '@material-ui/core'
import Layout from '../../components/Layout'

//FIXME duplicated elsewhere
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '4em'
  }
}))

const Users = props => {
  const classes = useStyles()

  return (
    <Layout>
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
    // const res = await fetchUsers(page * rowsPerPage, rowsPerPage)
    // const { count, results } = await res.json()
    // setCount(count)
    // setRows(results)
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

export async function getServerSideProps({ req }) {
  const { count, results } = await req.api.users()

  return {
    props: {
      count,
      results
    }
  }
}

export default Users