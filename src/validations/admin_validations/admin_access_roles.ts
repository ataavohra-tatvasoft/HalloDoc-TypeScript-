import { Joi } from "celebrate";

export const access_accountaccess_validation = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    page_size: Joi.number().integer().min(1).optional(),
  }),
};

export const access_accountaccess_edit_validation = {
  params: Joi.object({
    role_id: Joi.string()
      .required()
      .pattern(/^[0-9]+$/),
  }),
};

export const access_account_access_create_access_validation = {
  body: Joi.object({
    role_name: Joi.string().trim().required(),
    account_type: Joi.string().trim().required(),
    regions: Joi.boolean().optional(),
    scheduling: Joi.boolean().optional(),
    history: Joi.boolean().optional(),
    accounts: Joi.boolean().optional(),
    role: Joi.boolean().optional(),
    provider: Joi.boolean().optional(),
    request_data: Joi.boolean().optional(),
    vendorship: Joi.boolean().optional(),
    profession: Joi.boolean().optional(),
    email_logs: Joi.boolean().optional(),
    halo_administrators: Joi.boolean().optional(),
    halo_users: Joi.boolean().optional(),
    cancelled_history: Joi.boolean().optional(),
    provider_location: Joi.boolean().optional(),
    halo_employee: Joi.boolean().optional(),
    halo_work_place: Joi.boolean().optional(),
    patient_records: Joi.boolean().optional(),
    blocked_history: Joi.boolean().optional(),
    sms_logs: Joi.boolean().optional(),
    my_schedule: Joi.boolean().optional(),
    dashboard: Joi.boolean().optional(),
    my_profile: Joi.boolean().optional(),
    send_order: Joi.boolean().optional(),
    chat: Joi.boolean().optional(),
    invoicing: Joi.boolean().optional(),
  }).required(),
};

export const access_account_access_edit_save_validation = {
  params: {
    role_id: Joi.number().required().error(new Error('role_id is required and must be a number')),
  },
  body: {
    role_name: Joi.string().trim().min(3).max(255)
      .required()
      .error(new Error('role_name is required, must be a string, and have a length between 3 and 255 characters')),
    account_type: Joi.string().trim()
      .required()
      .error(new Error('account_type is required, must be a string, and be a valid account type')),
  },
};

export const access_account_access_delete_validation = {
  params: Joi.object({
    role_id: Joi.string()
      .required()
      .pattern(/^[0-9]+$/),
  }),
};

export const access_useraccess_validation = {
  query: Joi.object({
    role: Joi.string().trim().optional().allow(""), // Allow empty string for optional search
  }),
};

export const access_useraccess_edit_validation = {
  params: Joi.object({
    user_id: Joi.string()
      .required()
      .pattern(/^[0-9]+$/),
  }),
};

export const access_useraccess_edit_save_validation = {
  params: Joi.object({
    user_id: Joi.string()
      .required()
      .pattern(/^[0-9]+$/),
  }),
  body: Joi.object({
    firstname: Joi.string().trim().required(),
    lastname: Joi.string().trim().required(),
    mobile_no: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    address_1: Joi.string().trim().required(),
    address_2: Joi.string().trim().optional().allow(""),
    city: Joi.string().trim().required(),
    region: Joi.string().trim().optional().allow(""), // Optional region
    zip: Joi.string()
      .length(6)
      .pattern(/^[0-9]+$/)
      .required(),
    dob: Joi.date().iso().required(),
  }).required(),
};
