import { Inject } from 'react.di'
import { ContactList as Component } from '../components/ContactList'
import { ContactGroupResourceName } from "../services/ContactGroupService"
import { PeopleService, Person } from '../services/PeopleService'
import { stateBinding } from '../lib/ComponentHelper'

export interface ContactListProps {
  selectedContactGroupResourceName?: ContactGroupResourceName
}

export interface ContactListState {
  fetchingData: boolean
  persons: Person[]
  componentState: Component.State
}

export class ContactList extends React.PureComponent<ContactListProps, ContactListState> {
  @Inject personService: PeopleService

  state: ContactListState = {
    fetchingData: false,
    persons: [],
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
        persons={this.state.persons}

        {...stateBinding(
          this.state,
          this.setState.bind(this),
          'componentState',
        )}

        onCreate={this.onCreate}
        onUpdate={this.onUpdate}
        onDelete={this.onDelete}
      />
    )
  }

  private onCreate = async (person: Person) => {
    await this.personService.create({}, person)

    void this.fetchData()
  }

  private onUpdate = async (person: Person, updated: Partial<Person>) => {
    if (!person.resourceName) {
      // TOOD: 集成 Error 定义一个 DisplayableError 用来抛出异常在顶部抓住后展示
      throw new Error('找不到正在编辑的联系人，请刷新页面后重试')
    }

    await this.personService.update(person.resourceName, Object.keys(updated) as any, {
      ...person,
      ...updated,
    })

    void this.fetchData()
  }

  private onDelete = async (person: Person) => {
    if (!person.resourceName) return

    await this.personService.delete(person.resourceName!)

    void this.fetchData()
  }

  private fetchData = async () => {
    if (!this.props.selectedContactGroupResourceName) {
      this.setState({ persons: [] })
      return
    }

    this.setState({ fetchingData: true })
    this.setState({
      fetchingData: false,
      persons: await this.personService.list(this.props.selectedContactGroupResourceName),
    })
  }
}
