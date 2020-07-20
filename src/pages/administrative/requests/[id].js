import fetch from 'isomorphic-unfetch'
import { makeStyles } from '@material-ui/core/styles'
import { Container, Grid, Typography, Button, Card, CardHeader, CardContent, CardActions, Divider } from '@material-ui/core'
import { Layout, User } from '../../../components'
import { apiBaseUrl } from '../../../config.json'

//FIXME duplicated elsewhere
const useStyles = makeStyles((theme) => ({
  box: {
    marginBottom: '2em'
  }
}))

const AccessRequest = props => {
  const classes = useStyles()

  return (
    <Layout {...props}>
      <Container maxWidth='lg'>
          <h1>Access Request</h1>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <User 
                user={props.request.user}
                institution research
              />
              <QuestionAnswer question={props.request.question} answer={props.request.answer} />
            </Grid>
            <Grid item xs={6}>
              <Actions {...props} />
              <RequestHistory {...props} />
              <Card className={classes.box}>
                <CardHeader
                  title="Conversations"
                  subheader="TODO"
                />
              </Card>
            </Grid>
          </Grid>
      </Container>
    </Layout>
  )
}

const QuestionAnswer = props => (
  const classes = useStyles()

  <Card className={classes.box}>
    <CardHeader
      title="Questions"
      // subheader={props.subtitle}
      />
    <CardContent>
      {props.question ?
        <div>
            <Typography>{props.question.question}</Typography>
            <Typography>{props.answer.value_text}</Typography>
        </div>
        : <Typography>None</Typography>
      }
    </CardContent>
  </Card>
)

const Actions = props => {
  const classes = useStyles()
  const approveButton = <Button color="primary" size="small">APPROVE</Button>
  const denyButton = <Button color="secondary" size="small">DENY</Button>

  let buttons, text
  switch (props.request.status) {
    case "pending":
      buttons = [ denyButton, approveButton ]
      break

    case "approved":
      text = 'User has been approved for access, but access has not yet been granted. This is due to one of two things; either this statement is inaccurate, and a product of missing data from the migration, or this request is currently being processed, and the state of this request should change to "granted" shortly.'
      break

    case "granted":
      text = 'No actions can be performed on requests that have been granted.'
      break

    case "denied":
      buttons = [ approveButton ]
      break
  }

  return (
    <Card className={classes.box}>
      <CardHeader
        title="Actions"
        // subheader={props.subtitle}
        />
      <CardContent>
        <Typography gutterBottom>
          User has requested access to <b>{props.request.service.name}</b> and the request is currently <b>{props.request.status}</b>.
        </Typography>
        <Typography>
          {text}
        </Typography>
      </CardContent>
      <CardActions>
        {buttons}
      </CardActions>
    </Card>
  )
}

const RequestHistory = props => {
  const classes = useStyles()

  return (
    <Card className={classes.box}>
      <CardHeader
        title="History"
        // subheader={props.subtitle}
      />
      <CardContent>
        {props.request.logs.map(log => (
          <React.Fragment key={log.id}>
            <Typography>{log.message}</Typography>
            <Typography>{log.created_at}</Typography>
            <Divider />
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  )
}

export async function getServerSideProps(context) {
  const { id } = context.query

  //FIXME move user request into Express middleware
  let res = await fetch(apiBaseUrl + `/users/mine`)
  const user = await res.json()

  res = await fetch(apiBaseUrl + `/services/requests/${id}`)
  const request = await res.json()

  return { props: { user, request } }
}

export default AccessRequest