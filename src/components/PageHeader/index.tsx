import { Toolbar, Avatar, IconButton, Menu, MenuItem, Typography } from '@material-ui/core'
import './style.scss'

export interface PageHeaderProps {
  userinfo?: {
    name: string,
    imageUrl: string,
  }
  isSigningOut?: boolean
  onSignOut: () => void
}

export interface PageHeaderState {
  menuOpening?: boolean
  anchorEl?: HTMLElement
}

export class PageHeader extends React.PureComponent<PageHeaderProps, PageHeaderState> {
  public state: PageHeaderState = {}

  public render() {
    const { userinfo, isSigningOut } = this.props

    return (
      <Toolbar className="PageHeader">
        <Typography variant="title" className="PageHeader__title">
          <a className="PageHeader__brand" href="/" title="通讯录">
            <img src="//www.gstatic.com/images/branding/googlelogo/svg/googlelogo_light_clr_74x24px.svg" />
            <span className="PageHeader__brand-name">通讯录</span>
          </a>
        </Typography>

        {userinfo && (
           <div>
             <IconButton
               onClick={this.openMenu}
               color="inherit"
             >
               <Avatar className="PageHeader__avatar" src={userinfo.imageUrl} />
             </IconButton>

             <Menu
               anchorEl={this.state.anchorEl}
               anchorOrigin={{
                 vertical: 'top',
                 horizontal: 'right',
               }}
               transformOrigin={{
                 vertical: 'top',
                 horizontal: 'right',
               }}
               open={!!this.state.menuOpening}
               onClose={this.closeMenu}
             >
               <MenuItem>{ userinfo.name }</MenuItem>
               <MenuItem onClick={this.onClickSignOut}>
                 {isSigningOut ? '登出中' : '登出'}
               </MenuItem>
             </Menu>
           </div>
        )}
      </Toolbar>
    )
  }

  private onClickSignOut = () => {
    this.props.onSignOut()
    this.closeMenu()
  }

  private openMenu = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({
      anchorEl: event.currentTarget,
      menuOpening: true,
    })
  }

  private closeMenu = () => {
    this.setState({
      anchorEl: undefined,
      menuOpening: false,
    })
  }
}
