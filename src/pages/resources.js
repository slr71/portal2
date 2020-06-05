import Layout from '../components/Layout'
import { apiBaseUrl } from '../config.json'

const Resources = props => (
  <Layout {...props}>
    <h1>Resources</h1>
  </Layout>
)

Resources.getInitialProps = async function(context) {
  //FIXME move user request into Express middleware
  let res = await fetch(apiBaseUrl + `/users/mine`)
  const user = await res.json()

  return { user }
}

export default Resources