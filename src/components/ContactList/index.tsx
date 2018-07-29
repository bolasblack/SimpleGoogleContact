import { List, CircularProgress, Button } from "@material-ui/core"
import * as Icons from "@material-ui/icons"
import VirtualList from "react-tiny-virtual-list"
import { StateUpProps, stateBinding } from '../../lib/StateUp'
import { Person, PersonResourceName, PersonService } from "../../services/PersonService"
import { ContactListItem } from "./ContactListItem"
import { PersonEditDialog } from "./PersonEditDialog"
import { ConfirmDialog } from "../ConfirmDialog"
import './style.scss'

export function ContactList(props: ContactList.Props) {
  if (props.fetchingData) {
    return (
      <div className={`${ContactList.name}__loading-state`}>
        <CircularProgress />
      </div>
    )
  }

  const { persons, state, setState } = props

  if (!persons || !persons.length) {
    return (
      <div className={`${ContactList.name}__empty-state`}>暂无数据</div>
    )
  }

  return (
    <List className="ContactList" component="div" dense={true} style={{ height: '100%' }}>
      <div ref={props.listContainerRef} style={{ height: '100%' }}>
        <VirtualList
          className="ContactList__list"
          width='100%'
          height={props.listContainerHeight}
          itemCount={persons.length}
          itemSize={56}
          renderItem={({ index, style }) => (
            <ContactListItem
              key={index}
              style={style}
              ContainerComponent="div"
              button={true}
              person={persons[index]}
              onClick={() => {
                setState({
                  updatePersonDialogVisible: true,
                  updatePersonDialogState: PersonEditDialog.getInitialState(persons[index])
                })
              }}
              onDelete={() => {
                setState({
                  deletingPerson: persons[index],
                })
              }}
            />
          )}
        />
      </div>

      <Button
        variant="fab"
        color="secondary"
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
        }}
        onClick={() => {
          setState({
            createPersonDialogVisible: true,
            createPersonDialogState: PersonEditDialog.getInitialState(),
          })
        }}
      >
        <Icons.Add />
      </Button>

      <ConfirmDialog
        open={!!state.deletingPerson}
        message={`确认要删除${!state.deletingPerson ? '' : PersonService.getDescribe(state.deletingPerson)}吗？`}
        onCancel={() => setState({ deletingPerson: undefined })}
        onConfirm={async () => {
          if (!state.deletingPerson) return
          setState({ doingDelete: true })
          try {
            await props.onDelete(state.deletingPerson)
            setState({
              deletingPerson: undefined,
              doingDelete: false,
            })
          } catch (err) {
            setState({ doingDelete: false })
            throw err
          }
        }}
        doingConfirmed={state.doingDelete}
      />

      <PersonEditDialog
        {...stateBinding(props.getState, setState, 'createPersonDialogState')}
        open={state.createPersonDialogVisible}
        onClose={() => setState({ createPersonDialogVisible: false })}
        onSubmit={async (_, person) => {
          await props.onCreate(person)
          setState({ createPersonDialogVisible: false })
        }}
      />

      <PersonEditDialog
        {...stateBinding(props.getState, setState, 'updatePersonDialogState')}
        open={state.updatePersonDialogVisible}
        onClose={() => setState({ updatePersonDialogVisible: false })}
        onSubmit={async (person, updated) => {
          await props.onUpdate(person!, updated)
          setState({ updatePersonDialogVisible: false })
        }}
      />
    </List>
  )
}

export namespace ContactList {
  export interface Props extends StateUpProps<State> {
    listContainerRef: (el: HTMLDivElement | null) => void
    listContainerHeight: number

    fetchingData?: boolean
    fetchData: () => Promise<void>
    persons: Person[] | null

    selectedResourceName?: PersonResourceName

    onCreate: (person: Person) => void | Promise<void>
    onUpdate: (person: Person, updated: Partial<Person>) => void | Promise<void>
    onDelete: (person: Person) => void | Promise<void>
  }

  export interface State {
    createPersonDialogVisible: boolean
    createPersonDialogState: PersonEditDialog.State
    updatePersonDialogVisible: boolean
    updatePersonDialogState: PersonEditDialog.State
    deletingPerson?: Person
    doingDelete?: boolean
  }

  export const getInitialState = (): State => {
    return {
      createPersonDialogVisible: false,
      createPersonDialogState: PersonEditDialog.getInitialState(),
      updatePersonDialogVisible: false,
      updatePersonDialogState: PersonEditDialog.getInitialState(),
    }
  }
}