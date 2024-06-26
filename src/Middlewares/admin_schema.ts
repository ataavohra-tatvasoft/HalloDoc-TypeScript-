import Joi, { Schema } from "joi";
import { Request, Response, NextFunction } from "express";
import message_constants from "../public/message_constants";
import { MyError } from "../interfaces/common_interface";
// import countryStateCity, { State } from "country-state-city";

export const admin_schema_signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    body: {
      Email,
      Confirm_Email,
      Password,
      Confirm_Password,
      Status,
      Role_Id,
      FirstName,
      LastName,
      MobileNumber,
      Zip,
      Billing_MobileNumber,
      Address_1,
      Address_2,
      City,
      State,
      Country_Code,
    },
  } = req;

  const adminSchema: Schema = Joi.object({
    Email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com"] },
    }),
    Confirm_Email: Joi.ref("Email"),
    Password: Joi.string()
      .min(5)
      .required()
      .pattern(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=?{|}\[\]:\'\";,.<>\/\\|\s]).+$/
      ),
    Confirm_Password: Joi.ref("Password"),
    Status: Joi.string().valid("active", "in-active"),
    Role_Id: Joi.number().optional(),
    FirstName: Joi.string().max(8).min(3),
    LastName: Joi.string().max(8).min(3),
    MobileNumber: Joi.string()
      .pattern(/^\d{10}$/)
      .required(),
    Zip: Joi.string()
      .pattern(/^\d{6}$/)
      .required(),
    Billing_MobileNumber: Joi.string()
      .pattern(/^\d{10}$/)
      .required(),
    Address_1: Joi.string().max(15).min(10),
    Address_2: Joi.string().max(15).min(10),
    City: Joi.string().valid(
     "City 1",
     "City 2"
    ),
    State: Joi.string().valid(
     "District Of Columbia",
     "Virginia",
     "Maryland",
     "New York"
    ),
    Country_Code: Joi.string()
      .pattern(/^[a-zA-Z]{2}$/)
      .required(),
  });

  try {
    await adminSchema.validateAsync(
      {
        Email: Email,
        Confirm_Email: Confirm_Email,
        Password: Password,
        Confirm_Password: Confirm_Password,
        Status: Status,
        Role_Id: Role_Id,
        FirstName: FirstName,
        LastName: LastName,
        MobileNumber: MobileNumber,
        Zip: Zip,
        Billing_MobileNumber: Billing_MobileNumber,
        Address_1: Address_1,
        Address_2: Address_2,
        City: City,
        State: State,
        Country_Code: Country_Code,
      },
      { abortEarly: false, presence: "required" }
    );

    next();
  } catch (error: any) {   
    return res.status(500).json({
      status: false,
      errormessage: error.message,
      message: message_constants.ISE,
    });
  }
};
