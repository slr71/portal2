import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Container, Paper, Grid, Typography, TextField, IconButton, TableContainer, Table, TableBody, TableRow, TableCell } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import Layout from '../../components/Layout'

//FIXME duplicated elsewhere
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '3em'
  }
}))

const RestrictedUsernames = ({ usernames }) => {
  const classes = useStyles()
  const [keyword, setKeyword] = useState()

  const handleChangeKeyword = async (event) => {
    setKeyword(event.target.value)
  }

  return (
    <Layout>
      <Container maxWidth='lg'>
        <br />
        <Paper elevation={3} className={classes.paper}>
          <Grid container justify="space-between">
            <Grid item>
              <Typography component="h1" variant="h4">Restricted Usernames</Typography>
            </Grid>
            <Grid item>
              <TextField style={{width: '20em'}} placeholder="Search ..." onChange={handleChangeKeyword} />
            </Grid>
          </Grid>
          <Typography color="textSecondary" gutterBottom>Users will not be allowed to create an account using any of the usernames below</Typography>
          <br />
          <UsernameTable usernames={keyword ? usernames.filter(u => u.username.indexOf(keyword) >= 0) : usernames} />
        </Paper>
      </Container>
    </Layout>
  )
}

const UsernameTable = ({ usernames }) => (
  <TableContainer component={Paper}>
    <Table size="small">
      <TableBody>
        {usernames.map(username => (
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
  return { props: { usernames } }
}

export default RestrictedUsernames