import fetch from 'isomorphic-unfetch'
import { Box, Link } from '@material-ui/core'
import Layout from '../components/Layout'
import menuItems from '../menuItems.js'
import { apiBaseUrl } from '../config.json'

const Learning = props => {
  const title = "Learning"
  const menuItem = menuItems.filter(item => item.label === title)[0]

  return (
    <Layout title={title} {...props}>
      {menuItem.items.map((item, index) => (
        <Box key={index}>
          <Link href={item.path}>
            {item.label}
          </Link>
        </Box>
      ))}
    </Layout>
  )
}

Learning.getInitialProps = async function(context) {
  //FIXME move user request into Express middleware
  let res = await fetch(apiBaseUrl + `/users/mine`)
  const user = await res.json()

  return { user }
}

export default Learning