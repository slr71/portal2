import Markdown from 'markdown-to-jsx'
import { makeStyles, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@material-ui/core'
import { DateSpan } from './DateRange'
import { Person as PersonIcon } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  box: {
    marginBottom: '2em'
  },
}))

const Conversations = ({ conversations }) => {
  const classes = useStyles()

  return (
    <div>
      {conversations && conversations.map((conversation, index) => 
        <Conversation key={index} {...conversation} />
      )}
    </div>
  )
}

const Conversation = ({ source, parts }) => {
  return (
    <List>
      {parts && parts.filter(p => p.part_type != 'assignment').map((part, index) => (
        <ConversationPart key={index} {...part} />
      ))}
    </List>
  )
}

const ConversationPart = ({ author, part_type, assigned_to, created_at, body }) => {
  let content
  // if (part_type && part_type == 'assignment')
  //   content = `Assigned to ${assigned_to.id} (${assigned_to.type})`
  if (body) // assume part_type is "note" or "comment"
    content = <Markdown>{body}</Markdown>

  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar>
          <PersonIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={author ? `${author.name} (${author.type})` : ''}
        secondary={(<>
          <DateSpan date={created_at*1000} showTime />
          <br />
          {content}
        </>)}
      />
    </ListItem>
  )
}

export default Conversations