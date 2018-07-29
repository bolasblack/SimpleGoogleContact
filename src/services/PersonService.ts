import { Injectable, Inject } from 'react.di'
import { people_v1 } from 'googleapis'
import * as R from 'ramda'
import { GapiService } from './GapiService'
import {
  ContactGroupService,
  ContactGroupResourceName,
} from './ContactGroupService'

export type Person = people_v1.Schema$Person

export type PersonResourceName = NonNullable<Person['resourceName']>

export interface BatchGetParams {
  resourceNames: PersonResourceName[]
  personFields?: PersonField[]
}

export interface CreateParams {
  parent?: PersonResourceName
}

export interface UpdateParams {
  updatePersonFields: PersonField[]
}

export enum PersonField {
  Addresses = 'addresses',
  AgeRanges = 'ageRanges',
  Biographies = 'biographies',
  Birthdays = 'birthdays',
  BraggingRights = 'braggingRights',
  CoverPhotos = 'coverPhotos',
  EmailAddresses = 'emailAddresses',
  Events = 'events',
  Genders = 'genders',
  ImClients = 'imClients',
  Interests = 'interests',
  Locales = 'locales',
  Memberships = 'memberships',
  Metadata = 'metadata',
  Names = 'names',
  Nicknames = 'nicknames',
  Occupations = 'occupations',
  Organizations = 'organizations',
  PhoneNumbers = 'phoneNumbers',
  Photos = 'photos',
  Relations = 'relations',
  RelationshipInterests = 'relationshipInterests',
  RelationshipStatuses = 'relationshipStatuses',
  Residences = 'residences',
  SipAddresses = 'sipAddresses',
  Skills = 'skills',
  Taglines = 'taglines',
  Urls = 'urls',
  UserDefined = 'userDefined',
}

export const defaultPersonFields = [
  PersonField.Names,
  PersonField.EmailAddresses,
  PersonField.PhoneNumbers,
  PersonField.Photos,
]

@Injectable
export class PersonService {
  constructor(
    @Inject private gapiService: GapiService,
    @Inject private groupService: ContactGroupService,
  ) {}

  async list(contactGroupResourceName: ContactGroupResourceName) {
    const group = await this.groupService.get(contactGroupResourceName, {
      maxMembers: 2147483647,
    })

    if (!group.memberResourceNames || !group.memberResourceNames.length) {
      return []
    }

    return this.smartBatchGet({
      resourceNames: group.memberResourceNames!,
    })
  }

  async smartBatchGet(params: BatchGetParams) {
    if (params.resourceNames.length > 50) {
      const personBunchs = await Promise.all(
        R.splitEvery(50, params.resourceNames).map(resourceNames =>
          this.batchGet({ resourceNames, personFields: params.personFields }),
        ),
      )

      return R.chain<Person[], Person>(R.identity as any, personBunchs)
    } else {
      return this.batchGet(params)
    }
  }

  async batchGet(params: BatchGetParams) {
    if (params.resourceNames.length > 50) {
      throw new Error(
        '[PersonService#batchGet] Request must not contain more than 50 resource names.',
      )
    }

    return (await this.gapiService.request<{
      responses: people_v1.Schema$PersonResponse[]
    }>({
      path: 'https://people.googleapis.com/v1/people:batchGet',
      params: {
        ...params,
        personFields: params.personFields
          ? params.personFields.join(',')
          : defaultPersonFields.join(','),
      },
    })).result.responses.map(resp => {
      if (resp.status && resp.status.code != null) {
        // TODO: 更好的错误信息
        throw new Error(resp.status.message)
      }

      return resp.person!
    })
  }

  async create(params: CreateParams, body: people_v1.Schema$Person) {
    return (await this.gapiService.request<people_v1.Schema$Person>({
      path: 'https://people.googleapis.com/v1/people:createContact',
      method: 'post',
      params,
      body,
    })).result
  }

  async update(
    resourceName: PersonResourceName,
    params: UpdateParams,
    body: people_v1.Schema$Person,
  ) {
    return (await this.gapiService.request<people_v1.Schema$ContactGroup>({
      path: `https://people.googleapis.com/v1/${resourceName}:updateContact`,
      method: 'patch',
      params: {
        ...params,
        updatePersonFields: params.updatePersonFields.join(','),
      },
      body,
    })).result
  }

  async delete(resourceName: PersonResourceName) {
    await this.gapiService.request({
      path: `https://people.googleapis.com/v1/${resourceName}:deleteContact`,
      method: 'delete',
    })
  }

  static getName(person?: Person) {
    if (person && person.names && person.names.length) {
      return person.names[0] || {}
    }
    return {}
  }

  static getPhoto(person?: Person) {
    if (person && person.photos && person.photos.length) {
      return person.photos[0] || {}
    }

    return {}
  }

  static getPhoneNumber(person?: Person) {
    if (person && person.phoneNumbers && person.phoneNumbers.length) {
      return person.phoneNumbers[0] || {}
    }

    return {}
  }

  static getEmailAddress(person?: Person) {
    if (person && person.emailAddresses && person.emailAddresses.length) {
      return person.emailAddresses[0] || {}
    }

    return {}
  }

  static getDescribe(person: Person) {
    const name = PersonService.getName(person)
    const phoneNumber = PersonService.getPhoneNumber(person)
    const emailAddress = PersonService.getEmailAddress(person)

    let describe
    if (name.displayName) {
      describe = `名为 ${name.displayName} 的联系人`
    } else if (phoneNumber.value) {
      describe = `手机号码为 ${phoneNumber.value} 的联系人`
    } else if (emailAddress.value) {
      describe = `电子邮件为 ${emailAddress.value} 的联系人`
    } else {
      describe = '未知联系人'
    }
    return describe
  }
}
