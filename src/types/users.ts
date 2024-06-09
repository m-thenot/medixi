import {
  KindeIdToken,
  KindeAccessToken
} from "@kinde-oss/kinde-auth-nextjs/dist/types";

export interface IIdToken extends KindeIdToken {
  "x-hasura-organizations": { id: string; name: string }[];
  "x-hasura-org-codes": string[];
}

export interface IAccessToken extends KindeAccessToken {
  "x-hasura-org-code": string;
  "x-hasura-org-name": string;
  "x-hasura-email": string;
  "x-hasura-permissions": string[];
}
