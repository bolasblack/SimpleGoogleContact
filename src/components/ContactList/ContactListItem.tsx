import Avatar from '@material-ui/core/Avatar'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import ListItem, { ListItemProps } from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import DeleteIcon from '@material-ui/icons/Delete'
import { Person, PersonService } from '../../services/PersonService'

const DEFAULT_AVATAR =
  'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5Myp0nDj7fDykd0omFX4Aw9AIhgKABD___________8BGIzs_P3______wE/s160-p-k-rw-no/photo.jpg'

const listItemFieldsStyle: React.CSSProperties = {
  width: '30%',
  flex: 'none',
}

export interface ContactListItemProps extends ListItemProps {
  style: React.CSSProperties
  person: Person
  onDelete: () => void
}

export const ContactListItem = ({
  style,
  person,
  onDelete,
  ...listItemProps
}: ContactListItemProps) => {
  return (
    <div className="ContactList__list-item" style={style}>
      <ListItem className="ContactList__list-item__inner" {...listItemProps}>
        <Avatar
          alt={PersonService.getName(person).displayName}
          src={PersonService.getPhoto(person).url || DEFAULT_AVATAR}
        />
        <ListItemText primary={PersonService.getName(person).displayName} />
        <ListItemText
          style={listItemFieldsStyle}
          primary={PersonService.getPhoneNumber(person).value}
        />
        <ListItemText
          style={listItemFieldsStyle}
          primary={PersonService.getEmailAddress(person).value}
        />
        <ListItemSecondaryAction className="ContactList__list-item__actions">
          <Tooltip title="删除联系人">
            <IconButton onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </ListItemSecondaryAction>
      </ListItem>
    </div>
  )
}
