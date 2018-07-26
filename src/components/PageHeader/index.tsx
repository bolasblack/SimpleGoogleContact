import { AppBar, Toolbar, IconButton, Menu, MenuItem } from '@material-ui/core'
import { Menu as MenuIcon } from '@material-ui/icons'
import { MouseEvent } from 'react'
import './style.css'

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
    const { userinfo } = this.props

    return (
      <AppBar className="PageHeader">
        <Toolbar className="PageHeader__toolbar">
          <IconButton className="PageHeader__menu-icon" color="inherit">
            <MenuIcon />
          </IconButton>

          <div className="PageHeader__centre">
            <a className="PageHeader__brand" href="/" title="通讯录">
              <img src="//www.gstatic.com/images/branding/googlelogo/svg/googlelogo_light_clr_74x24px.svg" />
              <span className="PageHeader__brand-name">通讯录</span>
            </a>
          </div>

          {userinfo && (
             <div>
               <IconButton
                 onClick={this.openMenu}
                 color="inherit"
               >
                 <img className="PageHeader__avatar" src={userinfo.imageUrl} />
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
                   {this.props.isSigningOut ? '登出中' : '登出'}
                 </MenuItem>
               </Menu>
             </div>
          )}
        </Toolbar>
      </AppBar>
    )
  }

  private onClickSignOut = () => {
    this.props.onSignOut()
    this.closeMenu()
  }

  private openMenu = (event: MouseEvent<HTMLElement>) => {
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
