import { makeStyles } from '@material-ui/core/styles'
import { Container, Paper, Typography, TextField, IconButton, TableContainer, Table, TableBody, TableRow, TableCell } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import Layout from '../../components/Layout'

//FIXME duplicated elsewhere
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '4em'
  }
}))

const RestrictedUsernames = props => {
  const classes = useStyles()

  return (
    <Layout>
      <Container maxWidth='lg'>
        <Paper elevation={3} className={classes.paper}>
          <Typography component="h1" variant="h4">Restricted Usernames</Typography>
          <Typography color="textSecondary" gutterBottom>Users will not be allowed to create an account using any of the usernames below</Typography>
          <TextField placeholder="Search ..." />
          <UsernameTable {...props} />
        </Paper>
      </Container>
    </Layout>
  )
}

const UsernameTable = props => (
  <TableContainer component={Paper}>
    <Table size="small">
      <TableBody>
        {props.usernames.map(username => (
          <TableRow key={username.id}>
            <TableCell component="th" scope="row">{username.username}</TableCell>
            <TableCell align="right">
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)

export async function getServerSideProps({ req }) {
  const usernames = await req.api.restrictedUsernames()

  return {
    props: {
      usernames,
      keyword: ""
    }
  }
}

export default RestrictedUsernames