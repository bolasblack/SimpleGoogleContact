import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import TextField from '@material-ui/core/TextField'
import { StateUpProps } from '../../lib/StateUp'
import { Button } from '../Button'
import { Person, PersonService } from '../../services/PersonService'
import { produce } from 'immer'

export function PersonEditDialog({
  open,
  state,
  setState,
  onSubmit,
  onClose,
}: PersonEditDialog.Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {state.mode === 'create' ? '创建联系人' : '修改联系人'}
      </DialogTitle>
      <DialogContent>
        <div>
          <TextField
            autoFocus={true}
            margin="dense"
            label="姓"
            type="text"
            value={PersonService.getName(state.person).familyName}
            onChange={e =>
              setState(
                produce(s => {
                  s.person.names = s.person.names || []
                  s.person.names[0] = s.person.names[0] || {}
                  s.person.names[0].familyName = e.target.value
                }),
              )
            }
          />

          <TextField
            autoFocus={true}
            margin="dense"
            label="名"
            type="text"
            value={PersonService.getName(state.person).givenName}
            onChange={e =>
              setState(
                produce(s => {
                  s.person.names = s.person.names || []
                  s.person.names[0] = s.person.names[0] || {}
                  s.person.names[0].givenName = e.target.value
                }),
              )
            }
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button
          color="primary"
          loading={state.submitting}
          onClick={async e => {
            setState({ submitting: true })
            try {
              await onSubmit(state.originPerson, state.person)
            } finally {
              setState({ submitting: false })
            }
          }}
        >
          提交
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export namespace PersonEditDialog {
  export interface Props extends StateUpProps<State> {
    open: boolean
    onClose(): void
    onSubmit(
      person: Person | undefined,
      patch: Partial<Person>,
    ): void | Promise<void>
  }

  export interface State {
    mode: 'create' | 'update'
    originPerson?: Person
    person: Partial<Person>
    submitting?: boolean
  }

  export const getInitialState = (person?: Person): State => ({
    mode: !person || !person.resourceName ? 'create' : 'update',
    originPerson: person,
    person: person || {},
  })
}
