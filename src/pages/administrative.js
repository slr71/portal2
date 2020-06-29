import fetch from 'isomorphic-unfetch'
import { Box, Link, Typography } from '@material-ui/core'
import Layout from '../components/Layout'
import menuItems from '../menuItems.js'
import { apiBaseUrl } from '../config.json'

const Administrative = props => {
  const title = "Administrative"
  const menuItem = menuItems.filter(item => item.label === title)[0]

  return (
    <Layout title={title} {...props}>
      {menuItem.items.map((item, index) => (
        <Box key={index}>
          <Link href={item.path}>
            <Typography component="h1" variant="h5">{item.label}</Typography>
          </Link>
        </Box>
      ))}
    </Layout>
  )
}

export async function getServerSideProps() {
  //FIXME move user request into Express middleware
  let res = await fetch(apiBaseUrl + `/users/mine`)
  const user = await res.json()

  return { 
    props: { 
      user
    } 
  }
}

export default Administrative