import { List, ListSubheader, ListItem, ListItemIcon, ListItemText, Divider, CircularProgress } from '@material-ui/core'
import * as Icons from '@material-ui/icons'
import { compose } from 'ramda'
import { ContactGroup, GroupType, ContactGroupResourceName } from '../../services/ContactGroupService'
import { ContactGroupListItem } from './ContactGroupListItem'
import { ContactGroupEditDialog } from './ContactGroupEditDialog'
import { ConfirmDialog } from "../ConfirmDialog"
import './style.scss'
import { StateUpProps, stateBinding } from '../../lib/ComponentHelper'
import { identity } from 'ramda'

export function ContactGroupSidebar(props: ContactGroupSidebar.Props) {
  const {
    state,
    setState,
    fetchingData,
    contactGroups,
    selectedResourceName,
    onSelect,
    onCreate,
    onUpdate,
    onDelete,
  } = props

  if (fetchingData) {
    return (
      <div className="ContactGroupSidebar__loading-container">
        <CircularProgress />
      </div>
    )
  } else {
    return (
      <div className="ContactGroupSidebar">
        {renderContactGroupSidebarList({
           contactGroups,
           selectedResourceName,
           onSelect: onSelect || identity,
           onCreate() {
            const newState = compose(
              (s: ContactGroupEditDialog.State) =>
                ContactGroupEditDialog.setVisible(true, s),
              ContactGroupEditDialog.getInitialState,
            )(undefined)

            setState({ contactGroupCreateDialogState: newState })
           },
           onUpdate(group) {
             const newState = compose(
               (s: ContactGroupEditDialog.State) =>
                 ContactGroupEditDialog.setVisible(true, s),
               ContactGroupEditDialog.getInitialState,
             )(group)

             setState({ contactGroupEditDialogState: newState })
           },
           onDelete(group) {
            setState({
              deletingContactGroup: group,
              doingDeleting: false,
            })
          },
        })}

        <ConfirmDialog
          open={!!state.deletingContactGroup}
          message={`确认要删除标签 ${state.deletingContactGroup && state.deletingContactGroup.formattedName} 吗？`}
          onCancel={() => setState({ deletingContactGroup: null })}
          onConfirm={async () => {
            if (!state.deletingContactGroup) return
            setState({ doingDeleting: true })
            try {
              onDelete && (await onDelete(state.deletingContactGroup))
              setState({
                deletingContactGroup: null,
                doingDeleting: false,
              })
            } catch (err) {
              setState({ doingDeleting: false })
              throw err
            }
          }}
          doingConfirmed={state.doingDeleting}
        />

        <ContactGroupEditDialog
          {...stateBinding(props.getState, setState, 'contactGroupCreateDialogState')}
          onSubmit={async (_, contactGroup) => {
            onCreate && (await onCreate(contactGroup))
            setState({
              contactGroupCreateDialogState: ContactGroupEditDialog.getInitialState(),
            })
          }}
        />

        <ContactGroupEditDialog
          {...stateBinding(props.getState, setState, 'contactGroupEditDialogState')}
          onSubmit={async (contactGroup, updated) => {
            onUpdate && (await onUpdate(contactGroup, updated))
            setState({
              contactGroupEditDialogState: ContactGroupEditDialog.getInitialState(),
            })
          }}
        />
      </div>
    )
  }
}

const renderContactGroupSidebarList = (props: {
  contactGroups: ContactGroup[]
  selectedResourceName?: ContactGroupResourceName,
  onCreate: () => void
  onUpdate: (contactGroup: ContactGroup) => void
  onDelete: (contactGroup: ContactGroup) => void
  onSelect: (contactGroup: ContactGroup) => void
}) => {
  const onSelect = (contactGroup: ContactGroup) => {
    if (props.selectedResourceName === contactGroup.resourceName) return
    props.onSelect(contactGroup)
  }

  return (
    <>
      <List dense={true}>
        {getSystemGroups(props.contactGroups).map(g =>
          ContactGroupListItem({
            // key: g.resourceName,
            button: true,
            actived: g.resourceName === props.selectedResourceName,
            contactGroup: g,
            onClick: () => onSelect(g),
          })
        )}
      </List>
      <Divider />
      <List dense={true} subheader={<ListSubheader>标签</ListSubheader>}>
        {getOtherGroups(props.contactGroups).map(g =>
          ContactGroupListItem({
            // key: g.resourceName,
            button: true,
            actived: g.resourceName === props.selectedResourceName,
            contactGroup: g,
            onUpdate: () => props.onUpdate(g),
            onDelete: () => props.onDelete(g),
            onClick: () => onSelect(g),
          })
        )}
        <ListItem dense={true} button={true}>
          <ListItemIcon>
            <Icons.Add />
          </ListItemIcon>
          <ListItemText primary="新建标签" onClick={() => props.onCreate()} />
        </ListItem>
      </List>
    </>
  )
}

const getSystemGroups = (contactGroups: ContactGroup[]) =>
  contactGroups.filter(g =>
    g.groupType === GroupType.SystemDefined
  )

const getOtherGroups = (contactGroups: ContactGroup[]) =>
  contactGroups.filter(g =>
    g.groupType !== GroupType.SystemDefined
  )

export namespace ContactGroupSidebar {
  export interface Props extends StateUpProps<State> {
    fetchingData?: boolean
    fetchData: () => Promise<void>
    contactGroups: ContactGroup[],

    selectedResourceName?: ContactGroup['resourceName']
    onSelect?: (contactGroup: ContactGroup) => void | Promise<void>

    onCreate?: (contactGroup: ContactGroup) => void | Promise<void>
    onUpdate?: (contactGroup: ContactGroup, updated: Partial<ContactGroup>) => void | Promise<void>
    onDelete?: (contactGroup: ContactGroup) => void | Promise<void>
  }

  export interface State {
    contactGroupCreateDialogState: ContactGroupEditDialog.State
    contactGroupEditDialogState: ContactGroupEditDialog.State
    editingContactGroup: ContactGroup | null
    deletingContactGroup: ContactGroup | null
    doingDeleting: boolean
  }

  export const getInitialState = (): State => {
    return {
      contactGroupCreateDialogState: ContactGroupEditDialog.getInitialState(),
      contactGroupEditDialogState: ContactGroupEditDialog.getInitialState(),
      editingContactGroup: null,
      deletingContactGroup: null,
      doingDeleting: false,
    }
  }
}