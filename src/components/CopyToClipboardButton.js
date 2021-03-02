import { IconButton } from '@material-ui/core'
import CopyIcon from '@material-ui/icons/FileCopyOutlined'

export default function CopyToClipboardButton({ text }) {
  return (
    <IconButton size="small" onClick={(e) => { e.preventDefault(); navigator.clipboard.writeText(text)}}>
      <CopyIcon style={{fontSize: '0.85em'}} />
    </IconButton>
  )
}