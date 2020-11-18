import { Grid, Link, Box } from '@material-ui/core'
import { Layout, SummaryCard, getMenuItem } from '../components'

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
                  icon={item.icon}
                  title={item.label}
                  description={item.description}
                />
              </Link>
            </Grid>
          )}
        </Grid>
        <Box mt={4}>
          <p>For related information see the <Link href='https://analytics.cyverse.rocks' target="_blank">User Analytics Portal</Link>.</p>
        </Box>
      </Box>
    </Layout>
  )
}

export default Administrative