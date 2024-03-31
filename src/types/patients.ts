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

export interface IFile {
  key: string;
  bucket: string;
  contentType: string;
}

export interface IExamination {
  id: string;
  created_at: number;
  updated_at: number;
  state: string;
  examination_date: number;
  examination_type: string;
  description: string;
  files: IFile[];
  report: string | null;
}

export type IViewPatient = Pick<
  IPatient,
  "birth_date" | "firstname" | "lastname" | "id"
> & {
  examinations: Pick<
    IExamination,
    | "id"
    | "examination_date"
    | "examination_type"
    | "description"
    | "files"
    | "report"
  >[];
};
