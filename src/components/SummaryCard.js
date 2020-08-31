import { Card, CardHeader, CardContent, CardActions, Typography, Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  header: {
    height: '5em'
  },
  content: {
    height: '6em'
  },
}))

const SummaryCard = ({ title, subtitle, description, iconUrl, action }) => {
  const classes = useStyles()

  return (
    <Card>
      <CardHeader
        className={classes.header}
        avatar={iconUrl ? <Avatar alt={title} src={iconUrl} /> : null}
        title={title}
        subheader={subtitle}
        titleTypographyProps={{variant: 'h6'}}
      />
      <CardContent className={classes.content}>
        <Typography variant="body2" color="textSecondary" component="p">
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