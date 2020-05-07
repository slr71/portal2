import { Card, CardHeader, CardContent, CardActions, Typography, Avatar } from '@material-ui/core'

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