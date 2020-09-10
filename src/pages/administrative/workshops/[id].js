import { Container, Box, Paper, makeStyles } from '@material-ui/core'
import { Layout } from '../../../components'

//FIXME duplicated elsewhere
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '3em'
  },
}))

const WorkshopEditor = (props) => {
  const classes = useStyles()

  return (
    <Layout>
      <Container maxWidth='lg'>
        <br />
        <Paper elevation={3} className={classes.paper}>
          <Box m={3}>
            WORKSHOP CREATOR/EDITOR IS UNDER CONSTRUCTION!
          </Box>
        </Paper>
      </Container>
    </Layout>
  )
}

export async function getServerSideProps({ req, query }) {
  const workshop = await req.api.workshop(query.id)
  return { props: { workshop } }
}

export default WorkshopEditor