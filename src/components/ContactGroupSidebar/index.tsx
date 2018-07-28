import { List, ListSubheader, ListItem, ListItemIcon, ListItemText, Divider, CircularProgress } from '@material-ui/core'
import * as Icons from '@material-ui/icons'
import { compose } from 'ramda'
import { ContactGroup, GroupType } from '../../services/ContactGroupService'
import { ContactListItem } from './ContactListItem'
import { ContactGroupEditDialog } from './ContactGroupEditDialog'
import { ConfirmDialog } from "../ConfirmDialog"
import './style.scss'
import { StateUpProps, stateBinding } from '../../lib/ComponentHelper'

export function ContactGroupSidebar(props: ContactGroupSidebar.Props) {
  const {
    state,
    setState,
    fetchingData,
    contactGroups,
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
      <div>
        {renderContactGroupSidebarList({
           contactGroups,
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
              await onDelete(state.deletingContactGroup)
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
          {...stateBinding(state, setState, 'contactGroupCreateDialogState')}
          onSubmit={async (_, contactGroup) => {
            await onCreate(contactGroup)
            setTimeout(() => {
              setState({
                contactGroupCreateDialogState: ContactGroupEditDialog.getInitialState(),
              })
            }, 0)
          }}
        />

        <ContactGroupEditDialog
          {...stateBinding(state, setState, 'contactGroupEditDialogState')}
          onSubmit={async (contactGroup, updated) => {
            await onUpdate(contactGroup, updated)
            setTimeout(() => {
              setState({
                contactGroupEditDialogState: ContactGroupEditDialog.getInitialState(),
              })
            }, 0)
          }}
        />
      </div>
    )
  }
}

const renderContactGroupSidebarList = (props: {
  contactGroups: ContactGroup[]
  onCreate: () => void
  onUpdate: (contactGroup: ContactGroup) => void
  onDelete: (contactGroup: ContactGroup) => void
}) => {
  return (
    <>
      <List>
        {getSystemGroups(props.contactGroups).map(g =>
          <ContactListItem button={true} key={g.resourceName} contactGroup={g} />
        )}
      </List>
      <Divider />
      <List subheader={<ListSubheader>标签</ListSubheader>}>
        {getOtherGroups(props.contactGroups).map(g =>
          <ContactListItem
            button={true}
            key={g.resourceName}
            contactGroup={g}
            onUpdate={() => props.onUpdate(g)}
            onDelete={() => props.onDelete(g)}
          />
        )}
        <ListItem button={true}>
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

    selectedGroupResourceName?: ContactGroup['resourceName']
    onSelect: (contactGroup: ContactGroup) => void | Promise<void>

    onCreate: (contactGroup: ContactGroup) => void | Promise<void>
    onUpdate: (contactGroup: ContactGroup, updated: Partial<ContactGroup>) => void | Promise<void>
    onDelete: (contactGroup: ContactGroup) => void | Promise<void>
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