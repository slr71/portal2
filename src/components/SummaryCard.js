import { Card, CardHeader, CardContent, CardActions, Typography, Avatar } from '@material-ui/core'

const SummaryCard = ({ title, subtitle, description, iconUrl, actionLabel }) => (
  <Card>
    <CardHeader
      avatar={iconUrl ? <Avatar alt={title} src={iconUrl} /> : null}
      title={title}
      subheader={subtitle}
    />
    <CardContent>
      <Typography variant="body2" color="textSecondary" component="p">
        {description}
      </Typography>
    </CardContent>
    <CardActions disableSpacing>
    {actionLabel}
    </CardActions>
  </Card>
)

export default SummaryCard