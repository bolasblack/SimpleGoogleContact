import {
  Tooltip,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core'
import { ListItemProps } from '@material-ui/core/ListItem'
import * as Icons from '@material-ui/icons'
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
          <Icons.Edit />
        </IconButton>
      </Tooltip>
      <Tooltip title="删除标签">
        <IconButton onClick={onDelete}>
          <Icons.Delete />
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
    return <Icons.Label />
  }

  switch (contactGroup.name) {
    case 'chatBuddies': // 聊天联系人
      return <Icons.Chat />
    case 'all': // 所有联系人
      return <Icons.Contacts />
    case 'starred': // 已加星标
      return <Icons.Star />
    case 'friends': // 朋友
    case 'family': // 家人
    case 'coworkers': // 同事
    case 'blocked': // 已屏蔽
    case 'myContacts': // 通讯录
    default:
      return <Icons.FilterNone />
  }
}
