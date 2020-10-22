import { MembershipRequest } from './../interfaces';
import { UserToken } from './../authentication/interface';
import { WizardState } from './interfaces';
// tslint:disable: no-namespace
export namespace WizardAction {
  export class Next {
    static readonly type = '[WizardAction] Next';
    readonly type = Next.type;
    constructor() {}
  }

  export class Previous {
    static readonly type = '[WizardAction] Previous';
    readonly type = Previous.type;
    constructor() {}
  }

  export class Login {
    static readonly type = '[WizardAction] Login';
    readonly type = Login.type;
    constructor(public payload: UserToken) {}
  }

  export class LoadRequest {
    static readonly type = '[WizardAction] LoadRequest';
    readonly type = LoadRequest.type;
    constructor(public payload: MembershipRequest) {}
  }

  export class LoadSteps {
    static readonly type = '[WizardAction] LoadSteps';
    readonly type = LoadSteps.type;
    constructor(public payload: string[]) {}
  }

  export class LoadWizards {
    static readonly type = '[WizardAction] LoadWizards';
    readonly type = LoadWizards.type;
    constructor(public payload: WizardState) {}
  }

  export class MergeRequestData {
    static readonly type = '[WizardAction] MergeRequestData';
    readonly type = MergeRequestData.type;
    constructor(public payload: MembershipRequest) {}
  }

  export class SubmitRequest {
    static readonly type = '[WizardAction] SubmitRequest';
    readonly type = SubmitRequest.type;
    constructor() {}
  }

  export class CreateApplicationSuccess {
    static readonly type = '[WizardAction] CreatApplicationSuccess';
    readonly type = CreateApplicationSuccess.type;
    constructor(public payload: number) {}
  }

  export class Search {
    static readonly type = '[WizardAction] CreatApplicationSuccess';
    readonly type = CreateApplicationSuccess.type;
    constructor() {}
  }
}

export type WizardAction =
  | WizardAction.Next
  | WizardAction.Previous
  | WizardAction.Login
  | WizardAction.LoadRequest
  | WizardAction.LoadSteps
  | WizardAction.LoadWizards
  | WizardAction.MergeRequestData
  | WizardAction.SubmitRequest
  | WizardAction.CreateApplicationSuccess
  | WizardAction.Search;
