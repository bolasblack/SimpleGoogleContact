import { Injectable, Inject } from 'react.di'
import { people_v1 } from 'googleapis'
import { GapiService } from './GapiService'

@Injectable
export class PeopleService {
  constructor(
    @Inject private gapiService: GapiService
  ) {
  }

  async list(params: { pageToken: string, pageSize?: number }) {
    return (await this.gapiService.request<people_v1.Schema$ListConnectionsResponse>({
      path: '/people/v1/people/me/connections',
      params: {
        ...params,
        personFields: [
          PersonField.Names,
          PersonField.Photos,
          PersonField.PhoneNumbers,
        ].join(','),
      },
    })).result
  }

  async create(params: CreateParams, body: people_v1.Schema$Person) {
    return (await this.gapiService.request<people_v1.Schema$Person>({
      path: '/people/v1/people:createContact',
      method: 'post',
      body,
    })).result
  }

  async update(resourceName: string, params: UpdateParams, body: people_v1.Schema$Person) {
    return (await this.gapiService.request<people_v1.Schema$ContactGroup>({
      path: `/people/v1/${resourceName}:updateContact`,
      method: 'patch',
      params,
      body,
    })).result
  }

  async delete(resourceName: string) {
    await this.gapiService.request({
      path: `/people/v1/${resourceName}:deleteContact`,
      method: 'delete',
    })
  }
}

export interface CreateParams {
  parent: NonNullable<people_v1.Schema$Person['resourceName']>
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
