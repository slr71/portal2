import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'

const SummaryCard = (props) => (
  <Card>
    <CardHeader
    avatar={
      props.iconUrl ? <Avatar alt={props.title} src={props.iconUrl} /> : null
    }
    title={props.title}
    subheader={props.subtitle}
    />
    <CardContent>
    <Typography variant="body2" color="textSecondary" component="p">
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