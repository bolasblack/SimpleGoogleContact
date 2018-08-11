import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import ListItem, { ListItemProps } from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import LabelIcon from '@material-ui/icons/Label'
import ChatIcon from '@material-ui/icons/Chat'
import ContactsIcon from '@material-ui/icons/Contacts'
import StarIcon from '@material-ui/icons/Star'
import FilterNoneIcon from '@material-ui/icons/FilterNone'
import { ContactGroup, GroupType } from '../../services/ContactGroupService'
import { theme } from '../../styles/theme'

export interface ContactGroupListItemProps extends ListItemProps {
  contactGroup: ContactGroup
  actived?: boolean
  onUpdate?: () => void
  onDelete?: () => void
}

export const ContactGroupListItem = ({
  classes,
  contactGroup,
  actived,
  onUpdate,
  onDelete,
  ...listItemProps
}: ContactGroupListItemProps) => {
  const secondaryAction = (
    <ListItemSecondaryAction>
      <Tooltip title="重命名标签">
        <IconButton onClick={onUpdate}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="删除标签">
        <IconButton onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </ListItemSecondaryAction>
  )

  return (
    <ListItem
      {...listItemProps}
      style={actived ? { backgroundColor: '#f5f5f5' } : {}}
    >
      <ListItemIcon style={actived ? { fill: theme.palette.primary.main } : {}}>
        {getContactGroupIcon(contactGroup)}
      </ListItemIcon>
      <ListItemText
        primary={contactGroup.formattedName}
        primaryTypographyProps={{
          style: actived ? { color: theme.palette.primary.main } : {},
        }}
      />
      {contactGroup.groupType !== GroupType.SystemDefined
        ? secondaryAction
        : null}
    </ListItem>
  )
}

export const getContactGroupIcon = (contactGroup: ContactGroup) => {
  if (contactGroup.groupType !== GroupType.SystemDefined) {
    return <LabelIcon />
  }

  switch (contactGroup.name) {
    case 'chatBuddies': // 聊天联系人
      return <ChatIcon />
    case 'all': // 所有联系人
      return <ContactsIcon />
    case 'starred': // 已加星标
      return <StarIcon />
    case 'friends': // 朋友
    case 'family': // 家人
    case 'coworkers': // 同事
    case 'blocked': // 已屏蔽
    case 'myContacts': // 通讯录
    default:
      return <FilterNoneIcon />
  }
}
