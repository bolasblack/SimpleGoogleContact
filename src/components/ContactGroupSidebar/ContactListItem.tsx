import { Tooltip, IconButton, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from '@material-ui/core'
import { withStyles, StyleRulesCallback, StyledComponentProps } from "@material-ui/core/styles"
import { ListItemProps } from '@material-ui/core/ListItem'
import * as Icons from '@material-ui/icons'
import { ContactGroup, GroupType } from '../../services/ContactGroupService'

type ClassKeys = 'activedListItem' | 'activedListItemIcon' | 'activedListItemText'

const contactListItemStyle: StyleRulesCallback<ClassKeys> = theme => ({
  activedListItem: {
    '&&': {
      opacity: 1,
      backgroundColor: '#f5f5f5',
      pointerEvents: 'auto',
    },
  },
  activedListItemIcon: {
    fill: theme.palette.primary.main,
  },
  activedListItemText: {
    color: theme.palette.primary.main,
  },
})

export interface ContactListItemProps extends ListItemProps {
  classes: ListItemProps['classes'] & StyledComponentProps<ClassKeys>['classes']
  contactGroup: ContactGroup
  actived?: boolean
  onUpdate?: () => void
  onDelete?: () => void
}

export const UnwrappedContactListItem = ({
  classes,
  contactGroup,
  actived,
  onUpdate,
  onDelete,
  ...listItemProps
}: ContactListItemProps) => {
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

  const {
    activedListItem,
    activedListItemIcon,
    activedListItemText,
    ...listItemClasses
  } = classes!

  return (
    <ListItem
      {...listItemProps}
      classes={listItemClasses}
      className={actived ? activedListItem : ''}
    >
      <ListItemIcon className={actived ? activedListItemIcon : ''}>
        {getContactIcon(contactGroup)}
      </ListItemIcon>
      <ListItemText
        primary={contactGroup.formattedName}
        primaryTypographyProps={{
          className: actived ? activedListItemText : '',
        }}
      />
      {contactGroup.groupType !== GroupType.SystemDefined ? secondaryAction : null}
    </ListItem>
  )
}

export const ContactListItem = withStyles(contactListItemStyle)(UnwrappedContactListItem)

export const getContactIcon = (contactGroup: ContactGroup) => {
  if (contactGroup.groupType !== GroupType.SystemDefined) {
    return (<Icons.Label />)
  }

  switch(contactGroup.name) {
    case 'chatBuddies': // 聊天联系人
      return (
        <Icons.Chat />
      )
    case 'all': // 所有联系人
      return (
        <Icons.Contacts />
      )
    case 'starred': // 已加星标
      return (
        <Icons.Star />
      )
    case 'friends': // 朋友
    case 'family': // 家人
    case 'coworkers': // 同事
    case 'blocked': // 已屏蔽
    case 'myContacts': // 通讯录
    default:
      return (
        <Icons.FilterNone />
      )
  }
}
