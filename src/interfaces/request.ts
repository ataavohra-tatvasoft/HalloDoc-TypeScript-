import { any } from "joi";
import { Optional } from "sequelize";

export interface RequestAttributes {
  request_id: number;
  confirmation_no: string;
  request_state: string;
  patient_id: number;
  physician_id: number | null;
  requested_by: string;
  relation_with_patient: string;
  requestor_id: number;
  requested_date: Date;
  concluded_date: Date;
  date_of_service: Date;
  closed_date: Date;
  request_status: string;
  block_reason: string | null;
  agreement_status: string;
  notes_symptoms: string | null;
  assign_req_description: string;
  final_report: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface RequestCreationAttributes
  extends Optional<
    RequestAttributes,
    | "request_id"
    | "confirmation_no"
    | "patient_id"
    | "physician_id"
    | "relation_with_patient"
    | "requestor_id"
    | "concluded_date"
    | "date_of_service"
    | "closed_date"
    | "request_status"
    | "block_reason"
    | "agreement_status"
    | "notes_symptoms"
    | "assign_req_description"
    | "final_report"
    | "createdAt"
    | "updatedAt"
  > {}
