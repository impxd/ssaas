import { SecretSanta } from './../../../shared/interfaces'

type FormMode = 'create' | 'update'

// Actions
export type AddParticipantAction = {
  type: 'add:participant'
}

export type FormSubmitAction = {
  type: 'submit'
  form: SecretSanta
}

export type ResetAction = {
  type: 'reset'
}

export type SetFormDataAction = {
  type: 'formdata:set'
  form: SecretSanta
}

export type Action =
  | AddParticipantAction
  | FormSubmitAction
  | ResetAction
  | SetFormDataAction
