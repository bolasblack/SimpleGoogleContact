import { Injectable, Inject } from 'react.di'
import { people_v1 } from 'googleapis'
import { GapiService } from './GapiService'
import { ContactGroupService, ContactGroupResourceName } from "./ContactGroupService"

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
export class PeopleService {
  constructor(
    @Inject private gapiService: GapiService,
    @Inject private groupService: ContactGroupService,
  ) {
  }

  async list(contactGroupResourceName: ContactGroupResourceName) {
    const group = await this.groupService.get(
      contactGroupResourceName,
      { maxMember: 10000000000 },
    )
    return this.batchGet({
      resourceNames: group.memberResourceNames!,
    })
  }

  async batchGet(params: BatchGetParams) {
    return (await this.gapiService.request<{ responses: Person[] }>({
      path: 'https://people.googleapis.com/v1/people:batchGet',
      params: {
        ...params,
        personFields: params.personFields ? params.personFields.join(',') : defaultPersonFields.join(','),
      },
    })).result.responses
  }

  async create(params: CreateParams, body: people_v1.Schema$Person) {
    return (await this.gapiService.request<people_v1.Schema$Person>({
      path: 'https://people.googleapis.com/v1/people:createContact',
      method: 'post',
      params,
      body,
    })).result
  }

  async update(resourceName: PersonResourceName, params: UpdateParams, body: people_v1.Schema$Person) {
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
}
