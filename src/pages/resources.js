import Layout from '../components/Layout'
import { apiBaseUrl } from '../config.json'

const Resources = props => (
  <Layout title="Resources" {...props} />
)

Resources.getInitialProps = async function(context) {
  //FIXME move user request into Express middleware
  let res = await fetch(apiBaseUrl + `/users/mine`)
  const user = await res.json()

  return { user }
}

export default Resources