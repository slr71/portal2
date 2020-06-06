import Layout from '../components/Layout'
import { apiBaseUrl } from '../config.json'

const Learning = props => (
  <Layout title="Learning" {...props} />
)

Learning.getInitialProps = async function(context) {
  //FIXME move user request into Express middleware
  let res = await fetch(apiBaseUrl + `/users/mine`)
  const user = await res.json()

  return { user }
}

export default Learning