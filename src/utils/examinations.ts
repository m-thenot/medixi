import { ExaminationState } from "@types";

export const getTagColor = (state: ExaminationState) => {
  switch (state) {
    case ExaminationState.TO_REVIEW:
      return "default";
    case ExaminationState.REPORT_DRAFTED:
      return "orange";
    case ExaminationState.REPORT_FINALIZED:
      return "green";
    default:
      return "default";
  }
};
