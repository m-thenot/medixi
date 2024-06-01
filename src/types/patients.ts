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
  studyInstanceUid?: string;
}

export enum ExaminationState {
  TO_REVIEW = "TO_REVIEW",
  REPORT_DRAFTED = "REPORT_DRAFTED",
  REPORT_FINALIZED = "REPORT_FINALIZED"
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

type InputExamination = Pick<
  IExamination,
  "examination_date" | "examination_type" | "description" | "files" | "state"
>;

export type InputPatient = Pick<
  IPatient,
  "birth_date" | "firstname" | "lastname"
> & { examinations: { data: InputExamination[] } };

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
    | "state"
  >[];
};

export enum ExaminationType {
  MRI = "MRI",
  ULTRASOUND = "ULTRASOUND",
  X_RAYS = "X-RAYS",
  CT_SCAN = "CT_SCAN",
  PET_SCAN = "PET_SCAN",
  FLUOROSCOPY = "FLUOROSCOPY",
  ANGIOGRAPHY = "ANGIOGRAPHY",
  MAMMOGRAPHY = "MAMMOGRAPHY",
  SCINTIGRAPHY = "SCINTIGRAPHY"
}
