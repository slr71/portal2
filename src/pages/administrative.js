import { Grid, Link, Box } from '@material-ui/core'
import { Layout, SummaryCard } from '../components'
import { getMenuItem } from '../menuItems.js'

const Administrative = () => {
  const menuItem = getMenuItem('Administrative')

  return (
    <Layout title='Administrative'>
      <Box mt={4}>
        <Grid container spacing={4}>
          {menuItem.items.map(item =>
            <Grid item xs={4} key={item.path}>
              <Link underline='none' href={item.path}>
                <SummaryCard 
                  title={item.label} 
                  description={item.description} 
                />
              </Link>
            </Grid>
          )}
        </Grid>
      </Box>
    </Layout>
  )
}

export default Administrative