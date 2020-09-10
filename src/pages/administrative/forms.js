import Link from "next/link"
import { makeStyles } from '@material-ui/core/styles'
import { Container, Paper, Typography, TableContainer, Table, TableBody, TableRow, TableCell } from '@material-ui/core'
import { Layout } from '../../components'

//FIXME duplicated elsewhere
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '3em'
  }
}))

const Forms = props => {
  const classes = useStyles()

  return (
    <Layout>
      <Container maxWidth='lg'>
        <br />
        <Paper elevation={3} className={classes.paper}>
          <Typography component="h1" variant="h4" gutterBottom>Forms</Typography>
          <br />
          <FormTable {...props} />
        </Paper>
      </Container>
    </Layout>
  )
}

const FormTable = props => (
  <TableContainer component={Paper}>
    <Table>
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
  const formsByGroup = await req.api.forms()
  const forms = formsByGroup
    .map(s => s.forms)
    .reduce((acc, forms) => acc.concat(forms))
    .sort((a, b) => (a.name > b.name) ? 1 : -1)

  return { props: { forms } }
}

export default Forms