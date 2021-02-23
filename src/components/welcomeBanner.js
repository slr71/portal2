import React from 'react'
//import useStyles from '@material-ui/core/styles'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Paper, Grid, Box, Button, Typography } from '@material-ui/core'
import BannerImage from '../components/svg/bannerImage'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => {
    return {
        button: {
            margin: theme.spacing(1),
        },
        bannerImage: {
            //margin: '1px',
            [theme.breakpoints.down('sm')]: {
                display: 'none',
            },
        },
        padding: {
            padding: '4%',
            [theme.breakpoints.down('md')]: {
                padding: '3%',
            },
            [theme.breakpoints.down('sm')]: {
                padding: '2%',
            },
        },

        paper: {
            padding: theme.spacing(3),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
        root: {
            flexGrow: 1,
        },
    }
})

export default function WelcomeBanner() {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <Box mt={4}>
                <Paper elevation={3} className={classes.paper}>
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                        spacing={4}
                    >
                        <Grid
                            item
                            xs={0}
                            sm={12}
                            md={5}
                            lg={5}
                            alignItems="center"
                            className={classes.bannerImage}
                        >
                            <BannerImage />
                        </Grid>
                        <Grid item xs={12} sm={12} md={7} lg={6}>
                            <div className={classes.padding}>
                                <Typography
                                    component="h1"
                                    variant="h4"
                                    color="primary"
                                >
                                    Welcome to the <br /> CyVerse User Portal
                                </Typography>
                                <br />
                                <Typography
                                    variant="body1"
                                    color="textPrimary"
                                    component="p"
                                >
                                    The User Portal is how you customize your
                                    CyVerse experience. Request access to the
                                    platforms you want to use and explore learning materials and
                                    workshops.
                                </Typography>
                                <br />
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    alignItems="right"
                                    href="https://learning.cyverse.org/en/latest/#"
                                    target="_blank"
                                >
                                    Learning Center
                                </Button>
                                <Button
                                    className={classes.button}
                                    size="large"
                                    variant="contained"
                                    color="primary"
                                    href="https://www.youtube.com/watch?v=-1lQuIMLXvs&list=PL38WPXpo-ZW2Qay_04FuP8IeVbbUopoiw&index=3"
                                    target="_blank"
                                >
                                    Getting Started Webinar
                                </Button>
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </div>
    )
}
