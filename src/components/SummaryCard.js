import { Card, CardHeader, CardContent, CardActions, Typography, Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  card: {
    minHeight: '13em',
  },
}))

const SummaryCard = (props) => (
  <Card className={useStyles().card}>
    <CardHeader
    avatar={
      props.iconUrl ? <Avatar alt={props.title} src={props.iconUrl} /> : null
    }
    title={props.title}
    subheader={props.subtitle}
    />
    <CardContent>
    <Typography variant="body2" color="textPrimary" component="p" gutterBottom>
      {props.description}
    </Typography>
    </CardContent>
    <CardActions disableSpacing>
    {/*<a href={props.actionUrl} target='_blank'>{props.actionLabel}</a> */}
    {props.actionLabel}
    </CardActions>
  </Card>
)

export default SummaryCard