import { Injectable, Inject } from 'react.di'
import { people_v1 } from 'googleapis'
import { GapiService } from './GapiService'

export enum GroupType {
  Unspecified = 'GROUP_TYPE_UNSPECIFIED',
  UserDefined = 'USER_CONTACT_GROUP',
  SystemDefined = 'SYSTEM_CONTACT_GROUP',
}

export type ContactGroup = people_v1.Schema$ContactGroup

export type ContactGroupResourceName = NonNullable<ContactGroup['resourceName']>

@Injectable
export class ContactGroupService {
  constructor(
    @Inject private gapiService: GapiService
  ) {
  }

  async list(params?: { pageToken?: string, pageSize?: number }) {
    return (await this.gapiService.request<people_v1.Schema$ListContactGroupsResponse>({
      path: 'https://people.googleapis.com/v1/contactGroups',
      params,
    })).result
  }

  async get(resourceName: ContactGroupResourceName, params?: { maxMember?: number }) {
    return (await this.gapiService.request<people_v1.Schema$ContactGroup>({
      path: `https://people.googleapis.com/v1/${resourceName}`,
      params,
    })).result
  }

  async create(contactGroup: people_v1.Schema$ContactGroup) {
    return (await this.gapiService.request<people_v1.Schema$ContactGroup>({
      path: 'https://people.googleapis.com/v1/contactGroups',
      method: 'post',
      body: { contactGroup },
    })).result
  }

  async update(
    resourceName: ContactGroupResourceName,
    contactGroup: people_v1.Schema$ContactGroup,
  ) {
    return (await this.gapiService.request<people_v1.Schema$ContactGroup>({
      path: `https://people.googleapis.com/v1/${resourceName}`,
      method: 'put',
      body: { contactGroup },
    })).result
  }

  async delete(resourceName: ContactGroupResourceName) {
    await this.gapiService.request({
      path: `https://people.googleapis.com/v1/${resourceName}`,
      method: 'delete',
    })
  }

  async modifyMember(
    resourceName: ContactGroupResourceName,
    body: people_v1.Schema$ModifyContactGroupMembersRequest,
  ) {
    return (await this.gapiService.request<people_v1.Schema$ModifyContactGroupMembersResponse>({
      path: `https://people.googleapis.com/v1/${resourceName}/members:modify`,
      method: 'post',
      body,
    })).result
  }
}
