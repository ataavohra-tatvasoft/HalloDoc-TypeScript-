/** Imports */
import { Request, Response, NextFunction } from "express";
import RequestModel from "../../db/models/request_2";
import User from "../../db/models/user_2";
import Requestor from "../../db/models/requestor_2";
import Notes from "../../db/models/notes_2";
import Order from "../../db/models/order_2";
import Region from "../../db/models/region_2";
import Profession from "../../db/models/profession_2";
import statusCodes from "../../public/status_codes";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import * as crypto from "crypto";
import { Op } from "sequelize";
import Documents from "../../db/models/documents_2";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

/** Configs */
dotenv.config({ path: `.env` });

/**                              Admin in Dashboard                                       */
/**Admin SignUp */
export const admin_signup = async (
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
      Role,
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
  const hashedPassword: string = await bcrypt.hash(Password, 10);
  try {
    const adminData = await User.create({
      type_of_user: "admin",
      email: Email,
      password: hashedPassword,
      status: Status,
      role: Role,
      firstname: FirstName,
      lastname: LastName,
      mobile_no: MobileNumber,
      zip: Zip,
      billing_mobile_no: Billing_MobileNumber,
      address_1: Address_1,
      address_2: Address_2,
      city: City,
      state: State,
      country_code: Country_Code,
    });

    if (!adminData) {
      return res.status(400).json({
        status: false,
        message: "Failed To SignUp!!!",
      });
    }

    if (adminData) {
      return res.status(200).json({
        status: true,
        message: "SignedUp Successfully !!!",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: false,
      errormessage: "Internal server error  " + error.message,
      message: statusCodes[500],
    });
  }
};

/**Admin Create Request */
export const admin_create_request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: {
        FirstName,
        LastName,
        PhoneNumber,
        Email,
        DOB,
        Street,
        City,
        State,
        Zip,
        Room,
        AdminNotes,
      },
    } = req;
    // const today = new Date();
    // console.log(today,today.getFullYear(),today.getFullYear().toString(),today.getFullYear().toString().slice(-2));
    const patient_data = await User.create({
      type_of_user: "patient",
      firstname: FirstName,
      lastname: LastName,
      mobile_no: PhoneNumber,
      email: Email,
      dob: new Date(DOB),
      street: Street,
      city: City,
      state: State,
      zip: Zip,
      address_1: Room,
    });
    if (!patient_data) {
      return res.status(400).json({
        status: false,
        message: "Failed To Create Patient!!!",
      });
    }

    const today = new Date();
    const year = today.getFullYear().toString().slice(-2); // Last 2 digits of year
    const month = String(today.getMonth() + 1).padStart(2, "0"); // 0-padded month
    const day = String(today.getDate()).padStart(2, "0"); // 0-padded day

    const todaysRequestsCount: any = await RequestModel.count({
      where: {
        createdAt: {
          [Op.gte]: `${today.toISOString().split("T")[0]}`, // Since midnight today
          [Op.lt]: `${today.toISOString().split("T")[0]}T23:59:59.999Z`, // Until the end of today
        },
      },
    });

    const confirmation_no = `${patient_data.state.slice(
      0,
      2
    )}${year}${month}${day}${LastName.slice(0, 2)}${FirstName.slice(
      0,
      2
    )}${String(todaysRequestsCount + 1).padStart(4, "0")}`;
    const request_data = await RequestModel.create({
      request_state: "new",
      patient_id: patient_data.user_id,
      requested_by: "admin",
      requested_date: new Date(),
      confirmation_no: confirmation_no,
    });
    const admin_note = await Notes.create({
      requestId: request_data.request_id,
      //  requested_by: "Admin",
      description: AdminNotes,
      typeOfNote: "admin_notes",
    });

    if (!patient_data && !request_data && !admin_note) {
      return res.status(400).json({
        status: false,
        message: "Failed To Create Request!!!",
      });
    }

    if (patient_data && request_data && admin_note) {
      return res.status(200).json({
        status: true,
        message: "Created Request Successfully !!!",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: false,
      errormessage: "Internal server error " + error.message,
      message: statusCodes[500],
    });
  }
};

export const region_without_thirdparty_API = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const regions = await Region.findAll({
      attributes: ["region_name"],
    });
    if (!regions) {
      res.status(500).json({ error: "Error fetching region data" });
    }
    return res.status(200).json({ status: "Successfull", regions: regions });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const region_with_thirdparty_API = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    var headers = new Headers();
    headers.append("X-CSCAPI-KEY", "API_KEY");

    // var requestOptions = {
    //   method: "GET",
    //   headers: headers,
    //   redirect: "follow",
    // };

    fetch("https://api.countrystatecity.in/v1/states", {
      method: "GET",
      headers: headers,
      redirect: "follow",
    })
      .then((response) => response.text())
      .then((result) => {
        const states = result;
        res.status(200).json({
          status: "Successful",
          data: states,
        });
      })
      .catch((error) => console.log("error", error));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const requests_by_request_state = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { state, firstname, lastname, region, requestor, page, pageSize } =
      req.query as {
        state: string;
        firstname: string;
        lastname: string;
        region: string;
        requestor: string;
        page: string;
        pageSize: string;
      };
    const pageNumber = parseInt(page) || 1;
    const limit = parseInt(pageSize) || 10;
    const offset = (pageNumber - 1) * limit;

    const whereClause_patient = {
      type_of_user: "patient",
      ...(firstname && { firstname: { [Op.like]: `%${firstname}%` } }),
      ...(lastname && { lastname: { [Op.like]: `%${lastname}%` } }),
      ...(region && { state: region }),
    };

    switch (state) {
      case "new": {
        const formattedResponse: any = {
          status: true,
          data: [],
        };
        const { count, rows: requests } = await RequestModel.findAndCountAll({
          where: {
            cancellation_status: "no",
            block_status: "no",
            request_state: state,
            ...(requestor ? { requested_by: requestor } : {}),
          },
          attributes: [
            "request_id",
            "request_state",
            "confirmation_no",
            "requested_by",
            "requested_date",
            "patient_id",
          ],
          include: [
            {
              as: "Patient",
              model: User,
              attributes: [
                "type_of_user",
                "user_id",
                "firstname",
                "lastname",
                "dob",
                "mobile_no",
                "address_1",
                "address_2",
              ],
              where: whereClause_patient,
            },
            {
              model: Requestor,
              attributes: ["user_id", "first_name", "last_name"],
            },
            {
              model: Notes,
              attributes: ["noteId", "typeOfNote", "description"],
            },
          ],
          limit,
          offset,
        });

        var i = offset + 1;
        for (const request of requests) {
          const formattedRequest: any = {
            sr_no: i,
            request_id: request.request_id,
            request_state: request.request_state,
            confirmationNo: request.confirmation_no,
            requestor: request.requested_by,
            requested_date: request.requested_date.toISOString().split("T")[0],
            patient_data: {
              user_id: request.Patient.user_id,
              name: request.Patient.firstname + " " + request.Patient.lastname,
              DOB: request.Patient.dob.toISOString().split("T")[0],
              mobile_no: request.Patient.mobile_no,
              address:
                request.Patient.address_1 + " " + request.Patient.address_2,
            },
            requestor_data: {
              user_id: request.Requestor?.user_id || null,
              first_name:
                request.Requestor?.first_name ||
                null + " " + request.Requestor?.last_name ||
                null,
              last_name: request.Requestor?.last_name || null,
            },
            notes: request.Notes?.map((note) => ({
              note_id: note.noteId,
              type_of_note: note.typeOfNote,
              description: note.description,
            })),
          };
          i++;
          formattedResponse.data.push(formattedRequest);
        }

        return res.status(200).json({
          ...formattedResponse,
          totalPages: Math.ceil(count / limit),
          currentPage: pageNumber,
        });
      }
      case "pending":
      case "active": {
        const formattedResponse: any = {
          status: true,
          data: [],
        };
        const requests = await RequestModel.findAndCountAll({
          where: {
            cancellation_status: "no",
            block_status: "no",
            request_state: state,
            ...(requestor ? { requested_by: requestor } : {}),
          },
          attributes: [
            "request_id",
            "request_state",
            "confirmation_no",
            "requested_by",
            "requested_date",
            "date_of_service",
            "physician_id",
            "patient_id",
          ],
          include: [
            {
              as: "Patient",
              model: User,
              attributes: [
                "user_id",
                "type_of_user",
                "firstname",
                "lastname",
                "dob",
                "mobile_no",
                "address_1",
                "state",
              ],
              where: whereClause_patient,
            },
            {
              as: "Physician",
              model: User,
              attributes: [
                "user_id",
                "type_of_user",
                "firstname",
                "lastname",
                "dob",
                "mobile_no",
                "address_1",
                "address_2",
              ],
              where: {
                type_of_user: "provider",
                role: "physician",
              },
            },
            {
              model: Requestor,
              attributes: ["user_id", "first_name", "last_name"],
            },
            {
              model: Notes,
              attributes: ["noteId", "typeOfNote", "description"],
            },
          ],
          limit,
          offset,
        });

        var i = offset + 1;
        for (const request of requests.rows) {
          const formattedRequest: any = {
            sr_no: i,
            request_id: request.request_id,
            request_state: request.request_state,
            confirmationNo: request.confirmation_no,
            requestor: request.requested_by,
            requested_date: request.requested_date.toISOString().split("T")[0],
            date_of_service: request.date_of_service
              .toISOString()
              .split("T")[0],
            patient_data: {
              user_id: request.Patient.user_id,
              name: request.Patient.firstname + " " + request.Patient.lastname,
              DOB: request.Patient.dob.toISOString().split("T")[0],
              mobile_no: request.Patient.mobile_no,
              address:
                request.Patient.address_1 + " " + request.Patient.address_2,
            },
            physician_data: {
              user_id: request.Physician.user_id,
              name:
                request.Physician.firstname + " " + request.Physician.lastname,
              DOB: request.Physician.dob.toISOString().split("T")[0],
              mobile_no: request.Physician.mobile_no,
              address:
                request.Physician.address_1 + " " + request.Physician.address_2,
            },
            requestor_data: {
              user_id: request.Requestor?.user_id || null,
              first_name:
                request.Requestor?.first_name ||
                null + " " + request.Requestor?.last_name ||
                null,
              last_name: request.Requestor?.last_name || null,
            },
            notes: request.Notes?.map((note) => ({
              note_id: note.noteId,
              type_of_note: note.typeOfNote,
              description: note.description,
            })),
          };
          i++;
          formattedResponse.data.push(formattedRequest);
        }

        return res.status(200).json({
          ...formattedResponse,
          totalPages: Math.ceil(requests.count / limit),
          currentPage: pageNumber,
        });
      }
      case "conclude": {
        const formattedResponse: any = {
          status: true,
          data: [],
        };
        const requests = await RequestModel.findAndCountAll({
          where: {
            cancellation_status: "no",
            block_status: "no",
            request_state: state,
            ...(requestor ? { requested_by: requestor } : {}),
          },
          attributes: [
            "request_id",
            "request_state",
            "confirmation_no",
            "requested_by",
            "requested_date",
            "date_of_service",
            "physician_id",
            "patient_id",
          ],
          include: [
            {
              as: "Patient",
              model: User,
              attributes: [
                "user_id",
                "type_of_user",
                "firstname",
                "lastname",
                "dob",
                "mobile_no",
                "address_1",
                "state",
              ],
              where: whereClause_patient,
            },
            {
              as: "Physician",
              model: User,
              attributes: [
                "user_id",
                "type_of_user",
                "firstname",
                "lastname",
                "dob",
                "mobile_no",
                "address_1",
                "address_2",
              ],
              where: {
                type_of_user: "provider",
                role: "physician",
              },
            },
          ],
          limit,
          offset,
        });

        var i = offset + 1;
        for (const request of requests.rows) {
          const formattedRequest: any = {
            sr_no: i,
            request_id: request.request_id,
            request_state: request.request_state,
            confirmationNo: request.confirmation_no,
            requestor: request.requested_by,
            requested_date: request.requested_date.toISOString().split("T")[0],
            date_of_service: request.date_of_service
              .toISOString()
              .split("T")[0],
            patient_data: {
              user_id: request.Patient.user_id,
              name: request.Patient.firstname + " " + request.Patient.lastname,
              DOB: request.Patient.dob.toISOString().split("T")[0],
              mobile_no: request.Patient.mobile_no,
              address:
                request.Patient.address_1 + " " + request.Patient.address_2,
            },
            physician_data: {
              user_id: request.Physician.user_id,
              name:
                request.Physician.firstname + " " + request.Physician.lastname,
              DOB: request.Physician.dob.toISOString().split("T")[0],
              mobile_no: request.Physician.mobile_no,
              address:
                request.Physician.address_1 + " " + request.Physician.address_2,
            },
          };
          i++;
          formattedResponse.data.push(formattedRequest);
        }

        return res.status(200).json({
          ...formattedResponse,
          totalPages: Math.ceil(requests.count / limit),
          currentPage: pageNumber,
        });
      }
      case "toclose": {
        const formattedResponse: any = {
          status: true,
          data: [],
        };
        const requests = await RequestModel.findAndCountAll({
          where: {
            cancellation_status: "no",
            block_status: "no",
            request_state: state,
            ...(requestor ? { requested_by: requestor } : {}),
          },
          attributes: [
            "request_id",
            "request_state",
            "confirmation_no",
            "requested_by",
            "requested_date",
            "date_of_service",
            "physician_id",
            "patient_id",
          ],
          include: [
            {
              as: "Patient",
              model: User,
              attributes: [
                "user_id",
                "type_of_user",
                "firstname",
                "lastname",
                "dob",
                "address_1",
                "state",
              ],
              where: whereClause_patient,
            },
            {
              as: "Physician",
              model: User,
              attributes: [
                "user_id",
                "type_of_user",
                "firstname",
                "lastname",
                "dob",
                "mobile_no",
                "address_1",
                "address_2",
              ],
              where: {
                type_of_user: "provider",
                role: "physician",
              },
            },
            {
              model: Notes,
              attributes: ["noteId", "typeOfNote", "description"],
            },
          ],
          limit,
          offset,
        });

        var i = offset + 1;
        for (const request of requests.rows) {
          const formattedRequest: any = {
            sr_no: i,
            request_id: request.request_id,
            request_state: request.request_state,
            confirmationNo: request.confirmation_no,
            requestor: request.requested_by,
            requested_date: request.requested_date.toISOString().split("T")[0],
            date_of_service: request.date_of_service
              .toISOString()
              .split("T")[0],
            patient_data: {
              user_id: request.Patient.user_id,
              name: request.Patient.firstname + " " + request.Patient.lastname,
              DOB: request.Patient.dob.toISOString().split("T")[0],
              address:
                request.Patient.address_1 + " " + request.Patient.address_2,
              region: request.Patient.state,
            },
            physician_data: {
              user_id: request.Physician.user_id,
              name:
                request.Physician.firstname + " " + request.Physician.lastname,
              DOB: request.Physician.dob.toISOString().split("T")[0],
              mobile_no: request.Physician.mobile_no,
              address:
                request.Physician.address_1 + " " + request.Physician.address_2,
            },
            notes: request.Notes?.map((note) => ({
              note_id: note.noteId,
              type_of_note: note.typeOfNote,
              description: note.description,
            })),
          };
          i++;
          formattedResponse.data.push(formattedRequest);
        }

        return res.status(200).json({
          ...formattedResponse,
          totalPages: Math.ceil(requests.count / limit),
          currentPage: pageNumber,
        });
      }
      case "unpaid": {
        const formattedResponse: any = {
          status: true,
          data: [],
        };
        const requests = await RequestModel.findAndCountAll({
          where: {
            cancellation_status: "no",
            block_status: "no",
            request_state: state,
            ...(requestor ? { requested_by: requestor } : {}),
          },
          attributes: [
            "request_id",
            "request_state",
            "confirmation_no",
            "requested_date",
            "requested_by",
            "date_of_service",
            "physician_id",
            "patient_id",
          ],
          include: [
            {
              as: "Patient",
              model: User,
              attributes: [
                "user_id",
                "type_of_user",
                "firstname",
                "lastname",
                "mobile_no",
                "address_1",
                "address_2",
              ],
              where: whereClause_patient,
            },
            {
              as: "Physician",
              model: User,
              attributes: [
                "user_id",
                "type_of_user",
                "dob",
                "firstname",
                "lastname",
              ],
              where: {
                type_of_user: "provider",
                role: "physician",
              },
            },
          ],
          limit,
          offset,
        });

        var i = offset + 1;
        for (const request of requests.rows) {
          const formattedRequest: any = {
            sr_no: i,
            request_id: request.request_id,
            request_state: request.request_state,
            requestor: request.requested_by,
            confirmationNo: request.confirmation_no,
            requested_date: request.requested_date.toISOString().split("T")[0],
            date_of_service: request.date_of_service
              .toISOString()
              .split("T")[0],
            patient_data: {
              user_id: request.Patient.user_id,
              name: request.Patient.firstname + " " + request.Patient.lastname,
              mobile_no: request.Patient.mobile_no,
              address:
                request.Patient.address_1 + " " + request.Patient.address_2,
            },
            physician_data: {
              user_id: request.Physician.user_id,
              name:
                request.Physician.firstname + " " + request.Physician.lastname,
              DOB: request.Physician.dob.toISOString().split("T")[0],
            },
          };
          i++;
          formattedResponse.data.push(formattedRequest);
        }

        return res.status(200).json({
          status: true,
          ...formattedResponse,
          totalPages: Math.ceil(requests.count / limit),
          currentPage: pageNumber,
        });
        // return res.status(200).json({
        //   formattedResponse,
        // });
      }
      default: {
        res.status(500).json({ message: "Invalid State !!!" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**Admin Request Actions */
export const view_case_for_request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const formattedResponse: any = {
      status: true,
      data: [],
    };
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        block_status: "no",
        cancellation_status: "no",
      },
      attributes: ["request_id", "request_state", "confirmation_no"],
      include: [
        {
          as: "Patient",
          model: User,
          attributes: [
            "firstname",
            "lastname",
            "dob",
            "mobile_no",
            "email",
            "state",
            "business_name",
            "address_1",
          ],
          where: {
            type_of_user: "patient",
          },
        },
        {
          model: Notes,
          attributes: ["requestId", "noteId", "description", "typeOfNote"],
          where: {
            typeOfNote: "patient_notes",
          },
        },
      ],
    });
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    const formattedRequest: any = {
      request_id: request.request_id,
      request_state: request.request_state,
      confirmation_no: request.confirmation_no,
      // requested_date: request.requested_date.toISOString().split("T")[0],
      patient_data: {
        user_id: request.Patient.user_id,
        patient_notes: request.Notes?.map((note) => ({
          note_id: note.noteId,
          type_of_note: note.typeOfNote,
          description: note.description,
        })),
        first_name: request.Patient.firstname,
        last_name: request.Patient.lastname,
        DOB: request.Patient.dob.toISOString().split("T")[0],
        mobile_no: request.Patient.mobile_no,
        email: request.Patient.email,
        location_information: {
          region: request.Patient.state,
          business_name: request.Patient.business_name,
          room: request.Patient.address_1 + " " + request.Patient.address_2,
        },
      },
    };
    formattedResponse.data.push(formattedRequest);

    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const view_notes_for_request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const formattedResponse: any = {
      status: true,
      data: [],
    };
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        block_status: "no",
        cancellation_status: "no",
      },
    });
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    const transfer_notes_list = await Notes.findAll({
      where: {
        requestId: request.request_id,
        typeOfNote: "transfer_notes",
      },
      attributes: ["requestId", "noteId", "description", "typeOfNote"],
    });
    const physician_notes_list = await Notes.findAll({
      where: {
        requestId: request.request_id,
        typeOfNote: "physician_notes",
      },
      attributes: ["requestId", "noteId", "description", "typeOfNote"],
    });
    const admin_notes_list = await Notes.findAll({
      where: {
        requestId: request.request_id,
        typeOfNote: "admin_notes",
      },
      attributes: ["requestId", "noteId", "description", "typeOfNote"],
    });
    const formattedRequest: any = {
      transfer_notes: {
        notes: transfer_notes_list?.map((note) => ({
          note_id: note.noteId,
          type_of_note: note.typeOfNote,
          description: note.description,
        })),
      },
      physician_notes: {
        notes: physician_notes_list?.map((note) => ({
          note_id: note.noteId,
          type_of_note: note.typeOfNote,
          description: note.description,
        })),
      },
      admin_notes: {
        notes: admin_notes_list?.map((note) => ({
          note_id: note.noteId,
          type_of_note: note.typeOfNote,
          description: note.description,
        })),
      },
    };

    formattedResponse.data.push(formattedRequest);
    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const save_view_notes_for_request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { new_note } = req.body;
    var status;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        block_status: "no",
        cancellation_status: "no",
      },
    });
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    const notes_status = await Notes.findOne({
      where: {
        requestId: request.request_id,
        typeOfNote: "admin_notes",
      },
    });
    if (notes_status) {
      status = await Notes.update(
        {
          description: new_note,
        },
        {
          where: {
            requestId: request.request_id,
            typeOfNote: "admin_notes",
          },
        }
      );
    } else {
      status = await Notes.create({
        requestId: request.request_id,
        typeOfNote: "admin_notes",
        description: new_note,
      });
    }
    return res.status(200).json({
      status: true,
      message: "Successfull !!!",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const cancel_case_for_request_view_data = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const formattedResponse: any = {
      status: true,
      data: [],
    };
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        request_state: "new",
        block_status: "no",
        cancellation_status: "no",
      },

      include: [
        {
          as: "Patient",
          model: User,
          attributes: ["firstname", "lastname"],
          where: {
            type_of_user: "patient",
          },
        },
      ],
    });
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    const formattedRequest: any = {
      patient_data: {
        first_name: request.Patient.firstname,
        last_name: request.Patient.lastname,
      },
    };

    formattedResponse.data.push(formattedRequest);
    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const cancel_case_for_request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { reason, additional_notes } = req.body;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        request_state: "new",
        block_status: "no",
        cancellation_status: "no",
      },
    });
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    await RequestModel.update(
      {
        cancellation_status: "yes",
      },
      {
        where: {
          request_id: request.request_id,
          confirmation_no: confirmation_no,
        },
      }
    );
    const notes_status = await Notes.findOne({
      where: {
        requestId: request.request_id,
        typeOfNote: "admin_cancellation_notes",
      },
    });
    if (notes_status) {
      Notes.update(
        {
          description: additional_notes,
          reason: reason,
        },
        {
          where: {
            requestId: request.request_id,
            typeOfNote: "admin_cancellation_notes",
          },
        }
      );
    } else {
      Notes.create({
        requestId: request.request_id,
        typeOfNote: "admin_cancellation_notes",
        description: additional_notes,
        reason: reason,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Successfull !!!",
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// export const assign_request_regions = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { state } = req.params;

//     if (state === "new") {
//       // Use distinct query to get unique regions
//       const physicians = await User.findAll({
//         where: {
//           type_of_user: "provider",
//           role: "physician",
//         },
//         attributes: ["state", "firstname", "lastname"],
//       });

//       if (!physicians) {
//         return res.status(200).json({
//           status: true,
//           message: "No physicians found.", // Include an empty regions array
//         });
//       }

//       // Extract unique regions from physicians
//       const uniqueRegions = Array.from(
//         new Set(physicians.map((p) => p.state))
//       );

//       return res.status(200).json({
//         status: true,
//         message: "Successfull !!!",
//         regions: uniqueRegions, // Include the unique regions array
//       });
//     }
//   } catch (error) {
//     console.error("Error in fetching Physicians:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
export const assign_request_region_physician = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { region } = req.query as { region: string };
    var i = 1;
    const formattedResponse: any = {
      status: true,
      data: [],
    };
    const physicians = await User.findAll({
      attributes: ["state", "role", "firstname", "lastname"],
      where: {
        type_of_user: "provider",
        role: "physician",
        ...(region ? { state: region } : {}),
        scheduled_status: "no",
      },
    });
    if (!physicians) {
      return res.status(200).json({
        status: false,
        message: "Physician not found !!!",
      });
    }
    for (const physician of physicians) {
      const formattedRequest: any = {
        sr_no: i,
        firstname: physician.firstname,
        lastname: physician.lastname,
      };
      i++;
      formattedResponse.data.push(formattedRequest);
    }
    return res.status(200).json({
      status: true,
      message: "Successfull !!!",
      ...formattedResponse,
    });
  } catch (error) {
    console.error("Error in fetching Physicians:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const assign_request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { firstname, lastname, assign_req_description } = req.body;
    const provider = await User.findOne({
      where: {
        firstname,
        lastname,
        type_of_user: "provider",
        role: "physician",
        scheduled_status: "no",
      },
    });
    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }
    const physician_id = provider.user_id;
    await RequestModel.update(
      {
        physician_id: physician_id,
        assign_req_description,
      },
      {
        where: {
          confirmation_no: confirmation_no,
        },
      }
    );
    await User.update(
      {
        scheduled_status: "yes",
      },
      {
        where: {
          user_id: physician_id,
        },
      }
    );
    return res.status(200).json({
      status: true,
      message: "Successfull !!!",
    });
  } catch (error) {
    console.error("Error in Assigning Request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const block_case_for_request_view = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const formattedResponse: any = {
      status: true,
      data: [],
    };
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        request_state: "new",
        block_status: "no",
        cancellation_status: "no",
      },
      include: [
        {
          as: "Patient",
          model: User,
          attributes: ["firstname", "lastname"],
          where: {
            type_of_user: "patient",
          },
        },
      ],
    });
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    const formattedRequest: any = {
      patient_data: {
        user_id: request.Patient.user_id,
        firstname: request.Patient.firstname,
        lastname: request.Patient.lastname,
      },
    };
    formattedResponse.data.push(formattedRequest);

    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const block_case_for_request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { reason_for_block } = req.body;

    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        request_state: "new",
        block_status: "no",
        cancellation_status: "no",
      },
    });
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    await RequestModel.update(
      {
        block_status: "yes",
        block_status_reason: reason_for_block,
      },
      {
        where: {
          confirmation_no: confirmation_no,
          request_state: "new",
        },
      }
    );
    return res.status(200).json({
      status: true,
      message: "Successfull !!!",
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Send Mail and Download All remaining in View Uploads
export const view_uploads_view_data = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const formattedResponse: any = {
      status: true,
      data: [],
    };
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        block_status: "no",
        cancellation_status: "no",
      },

      include: [
        {
          as: "Patient",
          model: User,
          attributes: ["firstname", "lastname"],
          where: {
            type_of_user: "patient",
          },
        },
        {
          model: Documents,
          attributes: [
            "request_id",
            "document_id",
            "document_path",
            "createdAt",
          ],
        },
      ],
    });
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    const formattedRequest: any = {
      request_id: request.request_id,
      request_state: request.request_state,
      confirmationNo: request.confirmation_no,
      patient_data: {
        user_id: request.Patient.user_id,
        name: request.Patient.firstname + " " + request.Patient.lastname,
      },
      notes: request.Documents?.map((document) => ({
        document_id: document.document_id,
        document_path: document.document_path,
        createdAt: document.createdAt.toISOString().split("T")[0],
      })),
    };
    formattedResponse.data.push(formattedRequest);
    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const view_uploads_upload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { confirmation_no } = req.params;
    const file = req.file;

    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        block_status: "no",
        cancellation_status: "no",
      },
    });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    const newDocument = await Documents.create({
      request_id: request.request_id,
      document_path: file.path,
    });
    if (!newDocument) {
      return res.status(404).json({ error: "Failed to upload!!!" });
    }
    return res.status(200).json({
      status: true,
      message: "Upload successful",
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const view_uploads_actions_delete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { state, confirmation_no, document_id } = req.params;
    // const fileURL = file.path;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        request_state: state,
        block_status: "no",
        cancellation_status: "no",
      },
      include: [
        {
          model: Documents,
          attributes: [
            "request_id",
            "document_id",
            "document_path",
            "createdAt",
          ],
        },
      ],
    });
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    const delete_status = await Documents.destroy({
      where: {
        request_id: request.request_id,
        document_id,
      },
    });
    if (!delete_status) {
      return res.status(404).json({ error: "Error while deleting" });
    }
    return res.status(200).json({
      status: true,
      message: "Successfull !!!",
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const view_uploads_actions_download = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no, document_id } = req.params;

    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        block_status: "no",
        cancellation_status: "no",
      },
      include: [
        {
          model: Documents,
          attributes: ["request_id", "document_id", "document_path"],
        },
      ],
    });

    const document = await Documents.findOne({
      where: {
        document_id: document_id,
      },
      attributes: ["document_id", "document_path"],
    });
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    let filePath = document.document_path;

    // Handle potential file path issues:
    if (!path.isAbsolute(filePath)) {
      // Prepend a base path (replace with appropriate logic for your file storage)
      filePath = path.join(__dirname, "uploads", filePath);
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${document.document_path || "document.ext"}`
    );

    res.sendFile(filePath, (error) => {
      if (error) {
        console.error("Error sending file:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        console.log("File downloaded successfully");
      }
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const view_uploads_delete_all = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        block_status: "no",
        cancellation_status: "no",
      },
    });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    const deletedCount = await Documents.destroy({
      where: {
        request_id: request.request_id,
      },
    });

    if (deletedCount === 0) {
      return res.status(200).json({ message: "No documents to delete" });
    }

    return res.status(200).json({
      status: true,
      message: `Successfully deleted ${deletedCount} document(s)`,
    });
  } catch (error) {
    console.error("Error deleting documents:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const view_uploads_download_all = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        block_status: "no",
        cancellation_status: "no",
      },
      include: [
        {
          as: "Documents",
          model: Documents,
          attributes: ["document_id", "document_path"],
        },
      ],
    });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    const documents = await Documents.findAll({
      where: {
        document_id: request.Documents[0].document_id,
      },
    });
    if (!documents) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (documents.length === 0) {
      return res
        .status(200)
        .json({ message: "No documents available for download" });
    }

    const documentPaths = documents.map((document) => {
      let filePath = document.document_path;

      if (!path.isAbsolute(filePath)) {
        filePath = path.join(__dirname, "uploads", filePath); // Example base path
      }

      return filePath;
    });

    const validPaths = documentPaths.filter((filePath) =>
      fs.existsSync(filePath)
    );

    if (validPaths.length === 0) {
      return res
        .status(404)
        .json({ error: "No valid files found for download" });
    }

    for (const filePath of validPaths) {
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${path.basename(filePath)}`
      );
      res.sendFile(filePath, (error) => {
        if (error) {
          console.error("Error sending file:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      });
    }
    
    return res.status(200).json({
      message: `Successfully initiated download(s) for ${validPaths.length} document(s)`,
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const professions_for_send_orders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const professions = await Profession.findAll({
      attributes: ["profession_name"],
    });
    if (!professions) {
      res.status(500).json({ error: "Error fetching region data" });
    }
    return res
      .status(200)
      .json({ status: "Successfull", professions: professions });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const send_orders_for_request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no, state } = req.params;
    const {
      profession,
      businessName,
      businessContact,
      email,
      faxNumber,
      orderDetails,
      numberOfRefill,
    } = req.body;
    if (state == "active" || "conclude" || "toclose") {
      const request = await RequestModel.findOne({
        where: {
          confirmation_no: confirmation_no,
          request_state: state,
          block_status: "no",
          cancellation_status: "no",
        },
      });
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
      await Order.create({
        requestId: request.request_id,
        request_state: state,
        profession,
        businessName,
        businessContact,
        email,
        faxNumber,
        orderDetails,
        numberOfRefill,
      });
      return res.status(200).json({
        status: true,
        message: "Successfull !!!",
      });
    }
  } catch (error) {
    console.error("Error in Sending Order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// export const transfer_request_regions = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { state } = req.params;

//     if (state === "pending") {
//       // Use distinct query to get unique regions
//       const physicians = await User.findAll({
//         where: {
//           type_of_user: "provider",
//           role: "physician",
//         },
//         attributes: ["region", "firstname", "lastname"],
//       });

//       if (!physicians) {
//         return res.status(200).json({
//           status: true,
//           message: "No physicians found.", // Include an empty regions array
//         });
//       }

//       // Extract unique regions from physicians
//       const uniqueRegions = Array.from(
//         new Set(physicians.map((p) => p.state))
//       );

//       return res.status(200).json({
//         status: true,
//         message: "Successfull !!!",
//         regions: uniqueRegions, // Include the unique regions array
//       });
//     }
//   } catch (error) {
//     console.error("Error in fetching Physicians:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
export const transfer_request_region_physicians = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { region } = req.query as { region: string };
    var i = 1;
    const formattedResponse: any = {
      status: true,
      data: [],
    };
    const physicians = await User.findAll({
      attributes: ["state", "role", "firstname", "lastname"],
      where: {
        type_of_user: "provider",
        role: "physician",
        ...(region ? { state: region } : {}),
        scheduled_status: "no",
      },
    });
    if (!physicians) {
      return res.status(200).json({
        status: false,
        message: "Physician not found !!!",
      });
    }
    for (const physician of physicians) {
      const formattedRequest: any = {
        sr_no: i,
        firstname: physician.firstname,
        lastname: physician.lastname,
      };
      i++;
      formattedResponse.data.push(formattedRequest);
    }
    return res.status(200).json({
      status: true,
      message: "Successfull !!!",
      ...formattedResponse,
    });
  } catch (error) {
    console.error("Error in fetching Physicians:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const transfer_request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { firstname, lastname, description } = req.body;
    const provider = await User.findOne({
      where: {
        firstname,
        lastname,
        type_of_user: "provider",
        role: "physician",
      },
    });
    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        block_status: "no",
        cancellation_status: "no",
        close_case_status: "no",
      },
    });
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    // const physician_id = provider.user_id;
    await RequestModel.update(
      {
        // physician_id: physician_id,
        transfer_request_status: "pending",
      },
      {
        where: {
          confirmation_no: confirmation_no,
        },
      }
    );
    await Notes.create({
      requestId: request.request_id,
      physician_name: firstname + " " + lastname,
      description,
      typeOfNote: "transfer_notes",
    });
    return res.status(200).json({
      status: true,
      message: "Successfull !!!",
    });
  } catch (error) {
    console.error("Error in transfering request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const clear_case_for_request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    try {
      const request = await RequestModel.findOne({
        where: { confirmation_no },
        attributes: ["confirmation_no", "request_id"],
      });
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
      await Notes.destroy({
        where: {
          requestId: request.request_id,
        },
      });
      await Order.destroy({
        where: {
          requestId: request.request_id,
        },
      });
      await RequestModel.destroy({
        where: {
          confirmation_no: confirmation_no,
        },
      });
      await Documents.destroy({
        where: {
          request_id: request.request_id,
        },
      });
      return res.status(200).json({
        status: true,
        message: "Successfull !!!",
      });
    } catch {
      res.status(404).json({ error: "Invalid State !!!" });
    }
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const send_agreement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { mobile_no, email } = req.body;
    const user = await User.findOne({
      where: {
        email: email,
        mobile_no: mobile_no,
        type_of_user: "patient",
      },
      attributes: ["user_id", "email", "mobile_no"],
    });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email address and mobile number",
        errormessage: statusCodes[400],
      });
    }
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        patient_id: user.user_id,
        block_status: "no",
        cancellation_status: "no",
        close_case_status: "no",
      },
      include: {
        as: "Patient",
        model: User,
        attributes: ["email", "mobile_no"],
        where: {
          type_of_user: "patient",
        },
      },
    });
    if (!request) {
      return res.status(400).json({
        message: "Invalid request case",
        errormessage: statusCodes[400],
      });
    }
    // const resetToken = uuid();
    const resetToken = crypto.createHash("sha256").update(email).digest("hex");

    const resetUrl = `http://localhost:7000/admin/dashboard/requests/${confirmation_no}/actions/updateagreement`;
    const mailContent = `
        <html>
        <form action = "${resetUrl}" method="POST"> 
        <p>Tell us that you accept the agreement or not:</p>
        <br>
        <br>
        <p>Your token is: </p>
        <p>${resetToken} </p>
        <br>
        <br>
        <label for="agreement_status">Agreement_Status:</label>
        <br>
        <select id="agreement_status" name= "agreement_status">
        <option value="accepted">Accepted</option>
        <option value="rejected">Rejected</option>
        </select>
        <br>
        <br>
        <button type = "submit">Submit Response</button>
        </form>
        </html>
      `;

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      debug: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const info = await transporter.sendMail({
      from: "vohraatta@gmail.com",
      to: email,
      subject: "Agreement",
      html: mailContent,
    });
    if (!info) {
      res.status(500).json({
        message: "Error while sending agreement to your mail",
        errormessage: statusCodes[200],
      });
    }
    res.status(200).json({
      message: "Agreement sent to your email",
      errormessage: statusCodes[200],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error sending Agreement",
      errormessage: statusCodes[500],
    });
  }
};
export const update_agreement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { agreement_status } = req.body;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
      },
    });
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    const update_status = await RequestModel.update(
      { agreement_status },
      {
        where: {
          confirmation_no,
        },
      }
    );
    if (!update_status) {
      res.status(200).json({
        status: true,
        message: "Error while updating !!!",
      });
    }
    res.status(200).json({
      status: true,
      message: "Successfull !!!",
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const close_case_for_request_view_details = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const formattedResponse: any = {
      status: true,
      data: [],
    };
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        request_state: "toclose",
        close_case_status: "no",
        block_status: "no",
        cancellation_status: "no",
      },
      include: [
        {
          as: "Patient",
          model: User,
          attributes: [
            "user_id",
            "firstname",
            "lastname",
            "dob",
            "mobile_no",
            "email",
          ],
        },
        {
          model: Documents,
          attributes: [
            "request_id",
            "document_id",
            "document_path",
            "createdAt",
          ],
        },
      ],
      attributes: ["request_id", "confirmation_no"],
    });
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    const formattedRequest: any = {
      request_id: request.request_id,
      confirmation_no: request.confirmation_no,
      patient_data: {
        user_id: request.Patient.user_id,
        first_name: request.Patient.firstname,
        last_name: request.Patient.lastname,
        DOB: request.Patient.dob.toISOString().split("T")[0],
        mobile_no: request.Patient.mobile_no,
        email: request.Patient.email,
        documents: request.Documents?.map((document) => ({
          document_id: document.document_id,
          document_path: document.document_path,
          upload_date: document.createdAt.toISOString().split("T")[0],
        })),
      },
    };
    formattedResponse.data.push(formattedRequest);

    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const close_case_for_request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        request_state: "toclose",
        close_case_status: "no",
        block_status: "no",
        cancellation_status: "no",
      },
      include: [
        {
          as: "Patient",
          model: User,
          attributes: ["firstname", "lastname", "dob", "mobile_no", "email"],
        },
      ],
    });
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    await RequestModel.update(
      {
        close_case_status: "yes",
      },
      {
        where: {
          confirmation_no: confirmation_no,
          request_state: "toclose",
        },
      }
    );
    return res.status(200).json({
      status: true,
      message: "Successfull !!!",
    });
  } catch (error) {
    console.error("Error closing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const close_case_for_request_edit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { firstname, lastname, dob, mobile_no, email } = req.body;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        request_state: "toclose",
        close_case_status: "no",
      },
    });
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    const patient_data = await User.findOne({
      where: { user_id: request.patient_id },
    });
    if (!patient_data) {
      return res.status(404).json({ error: "Patient not found" });
    }
    await User.update(
      {
        firstname,
        lastname,
        dob,
        mobile_no,
        email,
      },
      {
        where: {
          user_id: request.patient_id,
          type_of_user: "patient",
        },
      }
    );
    return res.status(200).json({
      status: true,
      message: "Successfull !!!",
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const close_case_for_request_actions_download = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no, document_id } = req.params;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        request_state: "toclose",
        block_status: "no",
        cancellation_status: "no",
      },
      include: [
        {
          model: Documents,
          attributes: ["request_id", "document_id", "document_path"],
        },
      ],
    });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    const document = await Documents.findOne({
      where: {
        request_id: request.request_id,
        document_id: document_id,
      },
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Handle potential file path issues:
    var filePath = document.document_path; // Assuming the path is stored correctly
    if (!path.isAbsolute(filePath)) {
      // If path is relative, prepend a base path (replace with appropriate logic)
      filePath = path.join(__dirname, "uploads", filePath); // Example base path
    }

    if (!filePath) {
      return res.status(404).json({ error: "File not found" });
    }

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${document.document_id || "document.ext"}`
    );
    res.sendFile(filePath, (error) => {
      if (error) {
        console.error("Error sending file:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        console.log("File downloaded successfully");
      }
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**Admin Request Support */
export const request_support = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { support_message } = req.body;
    await User.update(
      {
        support_message,
      },
      {
        where: {
          scheduled_status: "no",
          type_of_user: "provider",
          role: "physician",
        },
      }
    );
    return res.status(200).json({
      status: true,
      message: "Successfull !!!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**Admin Profile */
export const admin_profile_view = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers as { authorization: string };
    const token: string = authorization.split(" ")[1];
    const verifiedToken: any = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    );
    const formattedResponse: any = {
      status: true,
      data: [],
    };
    const admin_id = verifiedToken.user_id;
    const profile = await User.findOne({
      where: {
        user_id: admin_id,
      },
      attributes: [
        "user_id",
        // "username",
        "role",
        "status",
        "firstname",
        "lastname",
        "email",
        "mobile_no",
        "address_1",
        "address_2",
        "city",
        "state",
        "zip",
        "billing_mobile_no",
      ],
    });
    if (!profile) {
      return res.status(404).json({ error: "Request not found" });
    }
    const regions = await Region.findAll({
      attributes: ["region_name"],
    });
    if (!regions) {
      res.status(500).json({ error: "Error fetching region data" });
    }
    const formattedRequest: any = {
      user_id: profile.user_id,
      account_information: {
        username: "dummy",
        status: profile.status,
        role: profile.role,
      },
      administrator_information: {
        firstname: profile.firstname,
        lastname: profile.lastname,
        email: profile.email,
        mobile_no: profile.mobile_no,
        regions: regions?.map((region) => ({
          region_name: region.region_name,
        })),
      },
      mailing_billing_information: {
        address_1: profile.address_1,
        address_2: profile.address_2,
        city: profile.city,
        state: profile.state,
        zip: profile.zip,
        billing_mobile_no: profile.billing_mobile_no,
      },
    };
    formattedResponse.data.push(formattedRequest);

    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    console.error("Error fetching Admin Profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const admin_profile_reset_password = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: { password, admin_id },
    } = req;

    const hashedPassword: string = await bcrypt.hash(password, 10);
    const user_data = await User.findOne({
      where: {
        user_id: admin_id,
      },
    });
    if (user_data) {
      const updatePassword = await User.update(
        { password: hashedPassword },
        {
          where: {
            user_id: admin_id,
          },
        }
      );
      if (updatePassword) {
        res.status(200).json({ status: "Successfull" });
      }
    }
  } catch (error) {
    console.error("Error setting password", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const admin_profile_admin_info_edit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstname, lastname, email, mobile_no, admin_id } = req.body;
    // const { admin_id } = req.params;
    const adminprofile = await User.findOne({
      where: {
        user_id: admin_id,
      },
    });
    if (!adminprofile) {
      return res.status(404).json({ error: "Admin not found" });
    }
    const updatestatus = await User.update(
      {
        firstname,
        lastname,
        email,
        mobile_no,
      },
      {
        where: {
          user_id: admin_id,
        },
      }
    );
    if (updatestatus) {
      res.status(200).json({ status: "Updated Successfully" });
    }
  } catch (error) {
    console.error("Error fetching Admin Profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const admin_profile_mailing_billling_info_edit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  {
    try {
      const {
        admin_id,
        address_1,
        address_2,
        city,
        state,
        zip,
        billing_mobile_no,
      } = req.body;
      // const { admin_id } = req.params;
      const adminprofile = await User.findOne({
        where: {
          user_id: admin_id,
        },
      });
      if (!adminprofile) {
        return res.status(404).json({ error: "Admin not found" });
      }
      const updatestatus = await User.update(
        {
          address_1,
          address_2,
          city,
          state,
          zip,
          billing_mobile_no,
        },
        {
          where: {
            user_id: admin_id,
          },
        }
      );
      if (updatestatus) {
        res.status(200).json({ status: "Updated Successfully" });
      }
    } catch (error) {
      console.error("Error fetching Admin Profile:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

/**                             Admin in Access Roles                                     */
/** Admin Account Access */
export const access_accountaccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const account = await User.findAll({
      where: {
        status: "active",
      },
      attributes: ["firstname", "lastname", "type_of_user"],
    });
    if (!account) {
      return res.status(404).json({ error: "Accounts not found" });
    }
    res.status(200).json({ account });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const access_accountaccess_edit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { admin_id } = req.params;
    const account = await User.findOne({
      where: {
        user_id: admin_id,
        status: "active",
      },
      attributes: [
        "firstname",
        "lastname",
        "mobile_no",
        "address_1",
        "address_2",
        "city",
        "state",
        "zip",
        "dob",
        "region",
        "type_of_user",
      ],
    });
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.status(200).json({ account });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const access_accountaccess_edit_save = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { admin_id } = req.params;
    const {
      firstname,
      lastname,
      mobile_no,
      address_1,
      address_2,
      city,
      region,
      zip,
      dob,
    } = req.body;
    const account = await User.findOne({
      where: {
        user_id: admin_id,
        status: "active",
      },
    });
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }
    const account_data = await User.update(
      {
        firstname,
        lastname,
        mobile_no,
        address_1,
        address_2,
        city,
        state: region,
        zip,
        dob,
      },
      {
        where: {
          user_id: admin_id,
        },
      }
    );
    if (!account_data) {
      return res.status(404).json({ error: "Error while editing information" });
    }
    return res.status(200).json({
      status: true,
      message: "Edited Successfully !!!",
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const access_accountaccess_delete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { admin_id } = req.params;
    const account = await User.findOne({
      where: {
        user_id: admin_id,
        status: "active",
      },
    });
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }
    const delete_account = await User.destroy({
      where: {
        user_id: admin_id,
      },
    });
    if (!delete_account) {
      return res.status(404).json({ error: "Error while deleting account" });
    }
    return res.status(200).json({
      status: true,
      message: "Deleted Successfully !!!",
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** Admin User Access */
export const access_useraccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstname, lastname } = req.query; // Get search parameters from query string
    const whereClause: { [key: string]: any } = {};

    if (firstname) {
      whereClause.firstname = {
        [Op.like]: `%${firstname}%`, // Use LIKE operator for partial matching
      };
    }
    if (lastname) {
      whereClause.lastname = {
        [Op.like]: `%${lastname}%`,
      };
    }

    const accounts = await User.findAll({
      attributes: [
        "firstname",
        "lastname",
        "type_of_user",
        "mobile_no",
        "status",
      ],
      where: whereClause, // Apply constructed search criteria
    });

    if (!accounts) {
      return res.status(404).json({ error: "No matching users found" });
    }

    res.status(200).json({ accounts });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const access_useraccess_edit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { admin_id } = req.params;
    const account = await User.findOne({
      where: {
        user_id: admin_id,
      },
      attributes: [
        "firstname",
        "lastname",
        "mobile_no",
        "address_1",
        "address_2",
        "city",
        "state",
        "zip",
        "dob",
        "region",
        "type_of_user",
        "status",
      ],
    });
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.status(200).json({ account });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const access_useraccess_edit_save = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { admin_id } = req.params;
    const {
      firstname,
      lastname,
      mobile_no,
      address_1,
      address_2,
      city,
      region,
      zip,
      dob,
      type_of_user,
    } = req.body;
    const account = await User.findOne({
      where: {
        user_id: admin_id,
      },
    });
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }
    const account_data = await User.update(
      {
        firstname,
        lastname,
        mobile_no,
        address_1,
        address_2,
        city,
        state: region,
        zip,
        dob,
        type_of_user,
      },
      {
        where: {
          user_id: admin_id,
        },
      }
    );
    if (!account_data) {
      return res.status(404).json({ error: "Error while editing information" });
    }
    return res.status(200).json({
      status: true,
      message: "Edited Successfully !!!",
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**                             Admin in Provider Menu                                    */
