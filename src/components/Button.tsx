import { withStyles, StyleRulesCallback } from '@material-ui/core/styles'
import {
  default as MuiButton,
  ButtonProps as MuiButtonProps,
} from '@material-ui/core/Button'
import {
  default as MuiCircularProgress,
  CircularProgressProps as MuiCircularProgressProps,
} from '@material-ui/core/CircularProgress'

const styles: StyleRulesCallback = theme => ({
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
})

export interface ButtonProps extends MuiButtonProps {
  loading?: boolean
  progressProps?: MuiCircularProgressProps
}

export const UnwrappedButton = ({
  loading,
  classes,
  progressProps,
  ...buttonProps
}: ButtonProps) => (
  <div
    className={
      /* tslint:disable:no-string-literal */
      classes!['wrapper']
      /* tslint:enable:no-string-literal */
    }
  >
    <MuiButton disabled={loading} {...buttonProps} />
    {loading && (
      <MuiCircularProgress
        size={24}
        className={
          /* tslint:disable:no-string-literal */
          classes!['buttonProgress']
          /* tslint:enable:no-string-literal */
        }
        {...progressProps}
      />
    )}
  </div>
)

export const Button = withStyles(styles)(UnwrappedButton)
