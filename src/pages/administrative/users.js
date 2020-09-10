import { useState, useEffect } from 'react'
import debounce from 'just-debounce-it'
import Link from "next/link"
import { makeStyles } from '@material-ui/core/styles'
import { Container, Grid, Paper, Typography, TextField, TableContainer, Table, TableHead, TableBody, TableFooter, TableRow, TableCell, TablePagination } from '@material-ui/core'
import Layout from '../../components/Layout'
import { useAPI } from '../../contexts/api'

//FIXME duplicated elsewhere
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '4em'
  }
}))

//TODO move pagination code into shared component
const Users = props => {
  const api = useAPI()
  const classes = useStyles()

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [keyword, setKeyword] = useState()
  const [count, setCount] = useState(props.count)
  const [rows, setRows] = useState(props.results)
  
  const handleChangePage = async (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = async (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleChangeKeyword = async (event) => {
    setKeyword(event.target.value)
    setPage(0)
  }

  //TODO add debounce
  useEffect(() => {
      api.users({ 
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
    <Layout>
      <Container maxWidth='lg'>
        <br />
        <Paper elevation={3} className={classes.paper}>
          <Grid container justify="space-between">
            <Grid item>
              <Typography component="h1" variant="h4" gutterBottom>Users</Typography>
            </Grid>
            <Grid item>
              <TextField style={{width: '20em'}} placeholder="Search ..." onChange={handleChangeKeyword} />
            </Grid>
          </Grid>
          <Typography color="textSecondary" gutterBottom>Search across username, first name, last name, email, occupation, institution, region, and country</Typography>
          <br />
          <UserTable rows={rows} rowsPerPage={rowsPerPage} count={count} page={page} handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage} />
        </Paper>
      </Container>
    </Layout>
  )
}

const UserTable = ({ rows, rowsPerPage, count, page, handleChangePage, handleChangeRowsPerPage }) => (
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