import { Inject } from 'react.di'
import * as R from "ramda"
import { ContactList as Component } from '../components/ContactList'
import { ContactGroupResourceName } from "../services/ContactGroupService"
import { PersonService, Person, PersonField } from '../services/PersonService'
import { stateBinding } from '../lib/ComponentHelper'

const personFields = R.values(PersonField)

export interface ContactListProps {
  selectedContactGroupResourceName?: ContactGroupResourceName
}

export interface ContactListState {
  prevSelectedContactGroupResourceName?: ContactGroupResourceName
  fetchingData: boolean
  persons: Person[] | null
  componentState: Component.State
  listContainerRef: HTMLDivElement | null
  virtualListHeight: number
}

export class ContactList extends React.PureComponent<ContactListProps, ContactListState> {
  @Inject personService: PersonService

  static getDerivedStateFromProps(nextProps: ContactListProps, prevState: ContactListState) {
    if (
      nextProps.selectedContactGroupResourceName !== prevState.prevSelectedContactGroupResourceName
    ) {
      return {
        persons: null,
        prevSelectedContactGroupResourceName: nextProps.selectedContactGroupResourceName,
      };
    }

    return null
  }

  state: ContactListState = {
    fetchingData: false,
    persons: [],
    componentState: Component.getInitialState(),
    listContainerRef: null,
    virtualListHeight: 0,
  }

  componentDidMount() {
    void this.fetchData()
    window.addEventListener('resize', this.updateVirtualListHeight)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateVirtualListHeight)
  }

  componentDidUpdate(prevProps: ContactListProps, prevState: ContactListState) {
    if (this.state.persons === null) {
      void this.fetchData()
    }
  }

  render() {
    return (
      <Component
        listContainerRef={this.updateListContainerRef}
        listContainerHeight={this.state.virtualListHeight}

        fetchData={this.fetchData}
        fetchingData={this.state.fetchingData}
        persons={this.state.persons}

        {...stateBinding(
          () => this.state,
          this.setState.bind(this),
          'componentState',
        )}

        onCreate={this.onCreate}
        onUpdate={this.onUpdate}
        onDelete={this.onDelete}
      />
    )
  }

  private updateListContainerRef = (el: HTMLDivElement | null) => {
    this.setState({ listContainerRef: el })
    this.updateVirtualListHeight(null, el)
  }

  private updateVirtualListHeight = (event?: any, el?: HTMLDivElement | null) => {
    if (el) {
      this.setState({ virtualListHeight: el.clientHeight })
    } else if (this.state.listContainerRef) {
      this.setState({ virtualListHeight: this.state.listContainerRef.clientHeight })
    }
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

    const updatePersonFields = Object.keys(updated).filter((key: string): key is PersonField => 
      personFields.indexOf(key as any) !== -1
    )

    await this.personService.update(
      person.resourceName,
      { updatePersonFields },
      { ...person, ...updated },
    )

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
