import { Grid, Link, Box } from '@material-ui/core'
import { Layout, SummaryCard, intercomShow, getMenuItem } from '../components'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    helpLink: {
        [theme.breakpoints.down('xs')]: { display: 'none' },
    },
}))

const Support = () => {
    const menuItem = getMenuItem('Help')
    const classes = useStyles()
    const chatLink = (
        <Link onClick={intercomShow} className={classes.helpLink}>
            Need help? Click here to chat live with CyVerse Support!
        </Link>
    )

    return (
        <Layout title="Help" actions={chatLink}>
            <Box mt={4}>
                <Grid container spacing={4}>
                    {menuItem.items.map((item, index) => (
                        <Grid
                            item
                            key={index}
                            xs={12}
                            sm={12}
                            md={6}
                            lg={4}
                            xl={2}
                        >
                            <Link underline="none" href={item.path}>
                                <SummaryCard
                                    title={item.label}
                                    description={item.description}
                                />
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Layout>
    )
}

export default Support
