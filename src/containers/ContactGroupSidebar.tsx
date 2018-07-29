import { Inject } from 'react.di'
import { ContactGroupSidebar as Component } from '../components/ContactGroupSidebar'
import { ContactGroupService, ContactGroup, ContactGroupResourceName } from '../services/ContactGroupService'
import { stateBinding } from '../lib/ComponentHelper'

export interface ContactGroupSidebarProps {
  selectedResourceName?: ContactGroupResourceName
  onSelect?: (contactGroup: ContactGroup) => void
}

export interface ContactGroupSidebarState {
  fetchingData: boolean
  contactGroups: ContactGroup[]
  componentState: Component.State
}

export class ContactGroupSidebar extends React.PureComponent<ContactGroupSidebarProps, ContactGroupSidebarState> {
  @Inject groupService: ContactGroupService

  state: ContactGroupSidebarState = {
    fetchingData: false,
    contactGroups: [],
    componentState: Component.getInitialState(),
  }

  componentDidMount() {
    void this.fetchData()
  }

  render() {
    return (
      <Component
        fetchData={this.fetchData}
        fetchingData={this.state.fetchingData}
        contactGroups={this.state.contactGroups}

        {...stateBinding(
          this.state,
          this.setState.bind(this),
          'componentState',
        )}

        selectedResourceName={this.props.selectedResourceName}
        onSelect={this.props.onSelect}
        onCreate={this.onCreate}
        onUpdate={this.onUpdate}
        onDelete={this.onDelete}
      />
    )
  }

  private onCreate = async (contactGroup: ContactGroup) => {
    await this.groupService.create(contactGroup)

    void this.fetchData()
  }

  private onUpdate = async (contactGroup: ContactGroup, updated: ContactGroup) => {
    if (!contactGroup.resourceName) {
      // TOOD: 集成 Error 定义一个 DisplayableError 用来抛出异常在顶部抓住后展示
      throw new Error('找不到正在编辑的标签，请刷新页面后重试')
    }

    await this.groupService.update(contactGroup.resourceName, {
      ...contactGroup,
      ...updated,
    })

    void this.fetchData()
  }

  private onDelete = async (contactGroup: ContactGroup) => {
    if (!contactGroup.resourceName) return

    await this.groupService.delete(contactGroup.resourceName!)

    void this.fetchData()
  }

  private fetchData = async () => {
    this.setState({ fetchingData: true })

    const contactGroups = (await this.groupService.list({ pageSize: 500 })).contactGroups!

    this.setState({
      fetchingData: false,
      contactGroups,
    })
  }
}
