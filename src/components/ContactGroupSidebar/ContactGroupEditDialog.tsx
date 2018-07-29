import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core'
import { ContactGroup } from '../../services/ContactGroupService'
import { StateUpProps } from '../../lib/ComponentHelper'
import { Button } from '../Button'
import { produce } from 'immer'

export function ContactGroupEditDialog({
  state,
  setState,
  onSubmit,
}: ContactGroupEditDialog.Props) {
  return (
    <Dialog
      open={state.open}
      onClose={e => setState({ open: false })}
    >
      <DialogTitle>
        {state.mode === 'create' ? '创建标签' : '修改标签'}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus={true}
          margin="dense"
          label="标签名称"
          type="text"
          fullWidth={true}
          value={state.name}
          onChange={e => setState({ name: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={e => setState({ open: false })}>
          取消
        </Button>
        <Button
          color="primary"
          loading={state.submitting}
          onClick={async e => {
            setState({ submitting: true })
            try {
              await onSubmit(state.contactGroup, { name: state.name })
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

export namespace ContactGroupEditDialog {
  export interface Props extends StateUpProps<State> {
    onSubmit(contactGroup: ContactGroup, patch: Partial<ContactGroup>): void | Promise<void>
  }

  export interface State {
    open: boolean
    mode: 'create' | 'update'
    contactGroup: Partial<ContactGroup>
    name: string
    submitting?: boolean
  }

  export const getInitialState = (contactGroup?: Partial<ContactGroup>): State => {
    return {
      open: false,
      mode: (!contactGroup || !contactGroup.resourceName) ? 'create' : 'update',
      contactGroup: contactGroup || {},
      name: (contactGroup && contactGroup.name) || '',
    }
  }

  export const setVisible = (visible: boolean, state: State) => {
    return produce(state, state => {
      state.open = visible
    })
  }
}
