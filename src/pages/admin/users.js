import fetch from 'isomorphic-unfetch'
import { makeStyles } from '@material-ui/core/styles'
import { Container, Box, Paper, Typography, TextField, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core'
import Layout from '../../components/Layout'
import { apiBaseUrl } from '../../config'

//FIXME duplicated elsewhere
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '4em'
  }
}))

const Users = props => (
  <Layout {...props}>
    <Container maxWidth='lg'>
      <Paper elevation={3} className={useStyles().paper}>
        <Box display="flex">
          <Typography component="h1" variant="h4" gutterBottom>Users</Typography>
          <TextField placeholder="Search ..." />
        </Box>
        <UserTable {...props} />
      </Paper>
    </Container>
  </Layout>
)

const UserTable = props => (
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
        {props.users.map(user => (
          <TableRow key={user.id}>
            <TableCell component="th" scope="row">{user.first_name}</TableCell>
            <TableCell align="right">{user.last_name}</TableCell>
            <TableCell align="right">{user.username}</TableCell>
            <TableCell align="right">{user.institution}</TableCell>
            <TableCell align="right">{user.occupation.name}</TableCell>
            <TableCell align="right">{user.region.name}</TableCell>
            <TableCell align="right">{user.region.country.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)

Users.getInitialProps = async context => {
  //FIXME move user request into Express middleware
  let res = await fetch(apiBaseUrl + `/users/mine`)
  const user = await res.json()

  const req = context.req
  const token = ( req && req.kauth && req.kauth.grant && req.kauth.grant.access_token ? req.kauth.grant.access_token.token : null )
  res = await fetch(apiBaseUrl + '/users', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` } //FIXME add Express middleware to do this like Sonora
  })
  const users = await res.json()

  return {
    user,
    users,
    keyword: ""
  }
}

export default Users