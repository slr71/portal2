import { Card, CardHeader, CardContent, CardActions, Typography, Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles((theme) => ({

  //DESKTOP
  content: {
    minHeight: '6em'
  },
  title: {
    lineHeight: '1.1',
    fontSize: '1.4em',
      [theme.breakpoints.down('md')]:
      {fontSize:'1.4em',
       },
      [theme.breakpoints.down('xs')]: {
        fontSize:'1.2em',
       fontWeight: '400' },
    },
}))

const SummaryCard = ({ title, subtitle, description, iconUrl, icon, action, largeHeader }) => { // use icon or iconUrl but not both
  const classes = useStyles()

  return (
    <Card>
      <CardHeader
        style={{height: largeHeader ? '7em' : '5em'}}
        avatar={
          (icon || iconUrl) &&
          <Avatar alt={title} src={iconUrl}>
            {icon}
          </Avatar>
        }
        title={title}
        subheader={subtitle}
        titleTypographyProps={{className: classes.title}}
      />
      <CardContent className={classes.content}>
        <Typography variant="body2" color="textPrimary" component="p" className={classes.descriptionText}>
          {description.length > 130 ? description.substring(0, 130) + ' ...' : description}
        </Typography>
      </CardContent>
      <CardActions>
        {action}
      </CardActions>
    </Card>
  )
}

export default SummaryCard