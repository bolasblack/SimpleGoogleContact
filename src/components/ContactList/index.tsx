import { StateUpProps } from '../../lib/ComponentHelper'
import { Person, PersonResourceName } from "../../services/PeopleService"
import './style.scss'

export function ContactList({
  persons,
}: ContactList.Props) {
  if (!persons.length) {
    return (
      <div className={`${ContactList.name}__empty-state`}>暂无数据</div>
    )
  }

  return null
}

export namespace ContactList {
  export interface Props extends StateUpProps<State> {
    fetchingData?: boolean
    fetchData: () => Promise<void>
    persons: Person[],

    selectedResourceName?: PersonResourceName

    onCreate?: (person: Person) => void | Promise<void>
    onUpdate?: (person: Person, updated: Partial<Person>) => void | Promise<void>
    onDelete?: (person: Person) => void | Promise<void>
  }

  export interface State {

  }

  export const getInitialState = (): State => {
    return {
      
    }
  }
}