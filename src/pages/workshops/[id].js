import fetch from 'isomorphic-unfetch'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Layout from '../../components/Layout.js'
import { apiBaseUrl } from '../../config.json'

const Workshop = props => {
  const workshop = props.workshop

  return (
    <Layout>
      <Container maxWidth='md'>
        <Box display="flex">
          <h1>{workshop.title}</h1>
        </Box>
        <Box>
          {workshop.description}
        </Box>
      </Container>
    </Layout>
  )
}

Workshop.getInitialProps = async function(context) {
  const { id } = context.query
  const res = await fetch(apiBaseUrl + `/workshops/${id}`)
  const workshop = await res.json()

  return { workshop }
}

export default Workshop