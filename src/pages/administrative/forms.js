import Link from "next/link"
import { makeStyles } from '@material-ui/core/styles'
import { Container, Paper, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TablePagination } from '@material-ui/core'
import { Layout } from '../../components'
import PortalAPI from '../../api'

//FIXME duplicated elsewhere
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '4em'
  }
}))

const Forms = props => {
  const classes = useStyles()

  return (
    <Layout {...props}>
      <Container maxWidth='lg'>
        <Paper elevation={3} className={classes.paper}>
          <Typography component="h1" variant="h4" gutterBottom>Forms</Typography>
          <FormTable {...props} />
        </Paper>
      </Container>
    </Layout>
  )
}

const FormTable = props => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
          <TableRow>
            <TableCell>Form</TableCell>
          </TableRow>
        </TableHead>
      <TableBody>
        {props.forms.map(form => (
          <Link key={form.id} href={`/administrative/forms/${form.id}`}>
            <TableRow hover style={{cursor: 'pointer'}}>
              <TableCell>{form.name}</TableCell>
            </TableRow>
          </Link>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)

export async function getServerSideProps({ req }) {
  const api = new PortalAPI({req})
  const user = await api.user() //FIXME move user request into React context
  const formsByGroup = await api.forms()
  const forms = formsByGroup
    .map(s => s.forms)
    .reduce((acc, forms) => acc.concat(forms))
    .sort((a, b) => (a.name > b.name) ? 1 : -1)

  return {
    props: {
      user,
      forms
    }
  }
}

export default Forms