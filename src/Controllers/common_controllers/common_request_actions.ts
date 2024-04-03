import { Request, Response, NextFunction } from "express";
import RequestModel from "../../db/models/request";
import User from "../../db/models/user";
import Requestor from "../../db/models/requestor";
import Notes from "../../db/models/notes";
import Order from "../../db/models/order";
import Business from "../../db/models/business-vendor";
import { Controller } from "../../interfaces/common_interface";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import twilio from "twilio";
import * as crypto from "crypto";
import { Op } from "sequelize";
import Documents from "../../db/models/documents";
import dotenv from "dotenv";
import path, { dirname } from "path";
import fs from "fs";
import message_constants from "../../public/message_constants";
import Logs from "../../db/models/log";

/** Configs */
dotenv.config({ path: `.env` });

/**Common Request Actions */

/**
 * @description Given below functions are Express controllers that allows viewing request by confirmation number.
 */
export const view_case_for_request: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const formatted_response: any = {
      status: true,
      data: [],
    };
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        request_status: {
          [Op.notIn]: [
            "cancelled by admin",
            "cancelled by provider",
            "blocked",
            "clear",
          ],
        },
      },
      attributes: ["request_id", "request_state", "confirmation_no"],
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
          attributes: ["request_id", "note_id", "description", "type_of_note"],
          where: {
            type_of_note: "patient_notes",
          },
        },
      ],
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }
    const formatted_request: any = {
      request_id: request.request_id,
      request_state: request.request_state,
      confirmation_no: request.confirmation_no,
      // requested_date: request.requested_date.toISOString().split("T")[0],
      patient_data: {
        user_id: request.Patient.user_id,
        patient_notes: request.Notes?.map((note) => ({
          note_id: note.note_id,
          type_of_note: note.type_of_note,
          description: note.description,
        })),
        first_name: request.Patient.firstname,
        last_name: request.Patient.lastname,
        // DOB: request.Patient.dob
        //   .toISOString()
        //   .split("T")[0]
        //   .split("-")
        //   .map(Number)
        //   .reverse()
        //   .join("-"),
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
    formatted_response.data.push(formatted_request);

    return res.status(200).json({
      ...formatted_response,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};

/**
 * @description These functions handles various actions related to uploads for a request.
 */
export const view_uploads_view_data: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const formatted_response: any = {
      status: true,
      data: [],
    };
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        request_status: {
          [Op.notIn]: [
            "cancelled by admin",
            "cancelled by provider",
            "blocked",
            "clear",
          ],
        },
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
      return res.status(404).json({ error: message_constants.RNF });
    }

    const formatted_request: any = {
      request_id: request.request_id,
      request_state: request.request_state,
      confirmationNo: request.confirmation_no,
      patientData: {
        user_id: request.Patient.user_id,
        name: request.Patient.firstname + " " + request.Patient.lastname,
      },
      documents: request.Documents?.map((document) => ({
        document_id: document.document_id,
        document_path: document.document_path,
        createdAt: document.createdAt.toISOString().split("T")[0],
      })),
    };
    formatted_response.data.push(formatted_request);
    return res.status(200).json({
      ...formatted_response,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};
export const view_uploads_upload: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    console.log("Uploaded file details:", req.file);
    const file = req.file;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        request_status: {
          [Op.notIn]: [
            "cancelled by admin",
            "cancelled by provider",
            "blocked",
            "clear",
          ],
        },
      },
    });

    if (!request) {
      return res.status(404).json({ error: message_constants.ISE });
    }

    const new_document = await Documents.create({
      request_id: request.request_id,
      document_path: file.path,
    });
    if (!new_document) {
      return res.status(404).json({ error: message_constants.FTU });
    }
    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: message_constants.UpS,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};
export const view_uploads_actions_delete: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no, document_id } = req.params;
    // const fileURL = file.path;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        request_status: {
          [Op.notIn]: [
            "cancelled by admin",
            "cancelled by provider",
            "blocked",
            "clear",
          ],
        },
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
      return res.status(404).json({ error: message_constants.RNF });
    }
    const delete_status = await Documents.destroy({
      where: {
        request_id: request.request_id,
        document_id,
      },
    });
    if (!delete_status) {
      return res.status(404).json({ error: message_constants.EWD });
    }
    return res.status(200).json({
      status: true,
      confirmation_no,
      message: message_constants.Success,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};
export const view_uploads_actions_download: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no, document_id } = req.params;

    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        request_status: {
          [Op.notIn]: [
            "cancelled by admin",
            "cancelled by provider",
            "blocked",
            "clear",
          ],
        },
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

    // Check for missing request or document and send appropriate error responses
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }

    if (!document) {
      return res.status(404).json({ error: message_constants.DNF });
    }

    let file_path = document.document_path;

    // Handle relative paths by joining with `__dirname` and "uploads"
    if (!path.isAbsolute(file_path)) {
      file_path = path.join(__dirname, "uploads", file_path);
    }

    // Check for file existence and send error if not found
    if (!fs.existsSync(file_path)) {
      return res.status(404).json({ error: message_constants.FNF });
    }

    // **Set headers before sending download response**
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${document.document_path}`
    );

    // Initiate file download with `res.download`
    res.download(file_path, (error) => {
      if (error) {
        return res.status(500).json({ error: message_constants.ISE });
      } else {
        console.log("Downloaded!!!");
      }
    });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};
export const view_uploads_delete_all: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        request_status: {
          [Op.notIn]: [
            "cancelled by admin",
            "cancelled by provider",
            "blocked",
            "clear",
          ],
        },
      },
    });

    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }

    const deleted_count = await Documents.destroy({
      where: {
        request_id: request.request_id,
      },
    });

    if (deleted_count === 0) {
      return res.status(200).json({ message: message_constants.NDF });
    }

    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: `Successfully deleted ${deleted_count} document(s)`,
    });
  } catch (error) {
    console.error("Error deleting documents:", error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};
export const view_uploads_download_all: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;

    // Fetch request with associated documents
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        request_status: {
          [Op.notIn]: [
            "cancelled by admin",
            "cancelled by provider",
            "blocked",
            "clear",
          ],
        },
      },
      include: [
        {
          as: "Documents",
          model: Documents,
          attributes: ["document_id", "document_path"],
        },
      ],
    });

    // Handle missing request
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }

    const documents = request.Documents;

    // Handle no documents found
    if (documents.length === 0) {
      return res.status(200).json({ message: message_constants.NDF });
    }

    // Function to handle individual file download (reusable)
    const download_file = async (file_path: string, filename: string) => {
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

      try {
        await res.download(file_path); // Download the file
        console.log(`Successfully downloaded: ${filename}`); // Optional logging
      } catch (error) {
        console.error(`Error downloading ${filename}:`, error);
        // Handle individual download errors appropriately (e.g., log or send error response)
      }
    };

    // Initiate downloads for all valid documents using a loop
    for (const file of documents) {
      const file_path = file.document_path;
      const filename = path.basename(file_path);

      // Check for file existence before download attempt
      if (fs.existsSync(file_path)) {
        await download_file(file_path, filename);
      } else {
        console.error(`File not found: ${file_path}`); // Handle missing files here (e.g., log or send response)
      }
    }

    // Send final success response (no need for Promise.all)
    return res.status(200).json({
      confirmation_no,
      message: `Successfully initiated download(s) for ${documents.length} document(s)`,
    });
  } catch (error) {
    console.error("Error downloading documents:", error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};
// Send Mail and Download All remaining in View Uploads

/**
 * @description These functions handles viewing and sending orders for a request.
 */
export const business_name_for_send_orders: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const profession = req.query as { profession: string };
    const where_clause = {
      // profession: profession  // Commented out for dynamic filtering
      ...(profession && { profession: profession }),
    };
    const businesses = await Business.findAll({
      attributes: ["business_name"],
      // where: where_clause,
    });
    if (!businesses) {
      res.status(500).json({ error: message_constants.EFBD });
    }
    return res
      .status(200)
      .json({ status: message_constants.Success, businesses: businesses });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};
export const view_send_orders_for_request: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { profession, business } = req.query as {
      profession: string;
      business: string;
    };
    const formatted_response: any = {
      status: true,
      data: [],
    };
    const business_data = await Business.findOne({
      where: {
        business_name: business,
        profession: profession,
      },
    });
    if (!business_data) {
      return res.status(404).json({ error: message_constants.BNF });
    }
    const formatted_request: any = {
      business_contact: business_data?.business_contact,
      email: business_data?.email,
      fax_number: business_data?.fax_number,
    };
    formatted_response.data.push(formatted_request);
    return res.status(200).json({
      ...formatted_response,
    });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};
export const send_orders_for_request: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no, state } = req.params;
    const { business_contact, email } = req.query as {
      business_contact: any;
      email: string;
    };
    const { order_details, number_of_refill } = req.body;
    if (state == "active" || "conclude" || "toclose") {
      const request = await RequestModel.findOne({
        where: {
          confirmation_no: confirmation_no,
          request_state: state,
          request_status: {
            [Op.notIn]: [
              "cancelled by admin",
              "cancelled by provider",
              "blocked",
              "clear",
            ],
          },
        },
      });
      if (!request) {
        return res.status(404).json({ error: message_constants.RNF });
      }
      const business = await Business.findOne({
        where: {
          business_contact,
          email,
        },
      });
      if (!business) {
        return res.status(404).json({ error: message_constants.BNF });
      }
      await Order.create({
        request_id: request.request_id,
        business_id: business.business_id,
        request_state: state,
        order_details,
        number_of_refill,
      });
      return res.status(200).json({
        status: true,
        confirmation_no: confirmation_no,
        message: message_constants.Success,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

/**
 * @description This function handles sending and updating agreements for a request.
 */
export const send_agreement: Controller = async (
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
        message: message_constants.IEM,
        errormessage: message_constants.UA,
      });
    }
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        patient_id: user.user_id,
        request_status: {
          [Op.notIn]: [
            "cancelled by admin",
            "cancelled by provider",
            "blocked",
            "clear",
          ],
        },
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
        message: message_constants.IS,
        errormessage: message_constants.UA,
      });
    }
    // const resetToken = uuid();
    const resetToken = crypto.createHash("sha256").update(email).digest("hex");

    const resetUrl = `http://localhost:7000/admin/dashboard/requests/${confirmation_no}/actions/updateagreement`;
    const mail_content = `
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
      html: mail_content,
    });
    if (!info) {
      return res.status(500).json({
        message: message_constants.EWSA,
      });
    }

    const email_log = await Logs.create({
      type_of_log: "Email",
      recipient: user.firstname + " " + user.lastname,
      action: "For Agreement",
      role_name: "Admin",
      email: user.email,
      sent: "Yes",
    });

    if (!email_log) {
      return res.status(500).json({
        message: message_constants.EWCL,
      });
    }

    return res.status(200).json({
      confirmation_no: confirmation_no,
      message: message_constants.ASE,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: message_constants.ESA,
      errormessage: message_constants.ISE,
    });
  }
};
export const update_agreement: Controller = async (
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
      return res.status(404).json({ error: message_constants.RNF });
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
        message: message_constants.EWU,
      });
    }
    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: message_constants.Success,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};
