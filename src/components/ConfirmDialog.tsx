import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContentText from '@material-ui/core/DialogContentText'
import { Button } from './Button'

export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  doingConfirmed,
}: ConfirmDialog.Props) {
  return (
    <Dialog
      open={!!open}
      disableBackdropClick={true}
      disableEscapeKeyDown={true}
    >
      {!title ? null : <DialogTitle>{title}</DialogTitle>}
      {!message ? null : (
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={e => onCancel()}>取消</Button>
        <Button
          color="primary"
          loading={doingConfirmed}
          onClick={e => onConfirm()}
        >
          确认
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export namespace ConfirmDialog {
  export interface Props {
    open?: boolean
    title?: string
    message?: string
    onCancel(): void
    onConfirm(): void
    doingConfirmed?: boolean
  }
}
