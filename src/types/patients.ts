import { PutBlobResult } from "@vercel/blob";

export interface IPatient {
  id: string;
  created_at: number;
  updated_at: number;
  organization_code: string;
  birth_date: number;
  firstname: string;
  lastname: string;
  examinations: IExamination[];
}

export interface IExamination {
  id: string;
  created_at: number;
  updated_at: number;
  state: string;
  examination_date: number;
  examination_type: string;
  description: string;
  files: PutBlobResult[];
}
