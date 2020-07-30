import { Card, CardHeader, CardContent, CardActions, Typography, Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  card: {
    minHeight: '13em',
  },
}))

const SummaryCard = ({ title, subtitle, description, iconUrl, actionLabel }) => (
  <Card className={useStyles().card}>
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