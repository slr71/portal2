import fetch from 'isomorphic-unfetch'
import Layout from '../components/Layout'
import { apiBaseUrl } from '../config.json'

const Index = props => (
  <div>
    <Layout {...props} />
  </div>
)

//FIXME duplicated elsewhere
export async function getServerSideProps() {
  let res = await fetch(apiBaseUrl + `/users/mine`)
  const user = await res.json()

  return { 
    props: { 
      user
    } 
  }
}

export default Index