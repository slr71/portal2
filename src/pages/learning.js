import Layout from '../components/Layout'
import { apiBaseUrl } from '../config.json'

const Learning = props => (
  <Layout {...props}>
    <h1>Learning</h1>
  </Layout>
)

Learning.getInitialProps = async function(context) {
  //FIXME move user request into Express middleware
  let res = await fetch(apiBaseUrl + `/users/mine`)
  const user = await res.json()

  return { user }
}

export default Learning