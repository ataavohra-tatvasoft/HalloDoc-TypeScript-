import { Request, Response, NextFunction } from "express";
import RequestModel from "../../db/models/request";
import User from "../../db/models/user";
import Notes from "../../db/models/notes";
import {
  Controller,
  FormattedResponse,
  VerifiedToken,
} from "../../interfaces/common_interface";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import Documents from "../../db/models/documents";
import dotenv from "dotenv";
import message_constants from "../../public/message_constants";
import EncounterForm from "../../db/models/encounter_form";
import fs from "fs";
import pdfkit from "pdfkit";
import path from "path";
import { handle_request_state_physician } from "../../utils/helper_functions";

/** Configs */
dotenv.config({ path: `.env` });

/**                              Provider in Dashboard                                       */

export const provider_requests_by_request_state_counts: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers as { authorization: string };

    const token: string = authorization.split(" ")[1];
    const verified_token = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as VerifiedToken;
    const provider_id = verified_token.user_id;

    const request_state = ["new", "pending", "active", "conclude"];
    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: [],
    };
    for (const state of request_state) {
      const { count } = await RequestModel.findAndCountAll({
        where: {
          request_state: state,
          physician_id: provider_id,
        },
      });
      console.log(count);
      const formatted_request = {
        request_state: state,
        counts: count,
      };
      formatted_response.data.push(formatted_request);
    }

    return res.status(200).json({
      ...formatted_response,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const requests_by_request_state_provider: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers as { authorization: string };

    const token: string = authorization.split(" ")[1];
    const verified_token = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as VerifiedToken;

    const user = await User.findOne({
      where: {
        user_id: verified_token.user_id,
        type_of_user: "physician",
      },
    });
    if (!user) {
      return res.status(404).json({
        message: message_constants.PNF,
      });
    }
    const user_id = user.user_id;

    const { state, search, region, requestor, page, page_size } = req.query as {
      [key: string]: string;
    };

    switch (state) {
      case "new":
      case "pending":
      case "conclude":
        return await handle_request_state_physician(
          user_id,
          res,
          state,
          search,
          region,
          requestor,
          page,
          page_size
        );
      case "active":
        return await handle_request_state_physician(
          user_id,
          res,
          state,
          search,
          region,
          requestor,
          page,
          page_size
        );
      default:
        return res.status(500).json({ message: message_constants.IS });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: message_constants.ISE });
  }
};

export const provider_accept_request: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers as { authorization: string };
    const { confirmation_no } = req.params;

    const token: string = authorization.split(" ")[1];
    const verified_token = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as VerifiedToken;
    const provider_id = verified_token.user_id;

    const is_request = await RequestModel.findOne({
      where: {
        confirmation_no,
        request_state: "new",
        physician_id: provider_id,
      },
      attributes: ["request_id"],
    });

    if (!is_request) {
      return res.status(404).json({
        message: message_constants.RNF,
      });
    }

    const request_update = await RequestModel.update(
      {
        request_state: "pending",
        request_status: "accepted",
      },
      {
        where: {
          confirmation_no,
          request_state: "new",
        },
      }
    );
    if (!request_update) {
      return res.status(500).json({
        message: message_constants.EWU,
      });
    }
    return res.status(200).json({
      message: message_constants.Success,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: message_constants.ISE });
  }
};

export const transfer_request_provider: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { description } = req.body;
    const { authorization } = req.headers as { authorization: string };

    const token: string = authorization.split(" ")[1];
    const verified_token = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as VerifiedToken;
    const provider_id = verified_token.user_id;

    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        physician_id: provider_id,
        request_status: {
          [Op.notIn]: [
            "cancelled by admin",
            "cancelled by provider",
            "blocked",
            "clear",
          ],
        },
      },
      attributes: ["request_id"],
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }
    // const physician_id = provider.user_id;
    await RequestModel.update(
      {
        physician_id: null,
        request_state: "new",
        request_status: "unassigned",
      },
      {
        where: {
          confirmation_no: confirmation_no,
        },
      }
    );
    const physician = await User.findOne({
      where: {
        user_id: provider_id,
      },
    });
    if (!physician) {
      return res.status(404).json({
        message: message_constants.PhNF,
      });
    }
    await Notes.create({
      request_id: request.request_id,
      physician_name: physician.firstname + " " + physician.lastname,
      description,
      type_of_note: "transfer_notes",
    });
    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: "Successfull !!!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const view_notes_for_request_provider: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const formatted_response: FormattedResponse<any> = {
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
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }
    const transfer_notes_list = await Notes.findAll({
      where: {
        request_id: request.request_id,
        type_of_note: "transfer_notes",
      },
      attributes: ["request_id", "note_id", "description", "type_of_note"],
    });
    const physician_notes_list = await Notes.findAll({
      where: {
        request_id: request.request_id,
        type_of_note: "physician_notes",
      },
      attributes: ["request_id", "note_id", "description", "type_of_note"],
    });
    const admin_notes_list = await Notes.findAll({
      where: {
        request_id: request.request_id,
        type_of_note: "admin_notes",
      },
      attributes: ["request_id", "note_id", "description", "type_of_note"],
    });
    const formatted_request = {
      confirmation_no: confirmation_no,
      transfer_notes: {
        notes: transfer_notes_list?.map((note) => ({
          note_id: note.note_id,
          type_of_note: note.type_of_note,
          description: note.description,
        })),
      },
      physician_notes: {
        notes: physician_notes_list?.map((note) => ({
          note_id: note.note_id,
          type_of_note: note.type_of_note,
          description: note.description,
        })),
      },
      admin_notes: {
        notes: admin_notes_list?.map((note) => ({
          note_id: note.note_id,
          type_of_note: note.type_of_note,
          description: note.description,
        })),
      },
    };

    formatted_response.data.push(formatted_request);
    return res.status(200).json({
      ...formatted_response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const save_view_notes_for_request_provider: Controller = async (
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
    const notes_status = await Notes.findOne({
      where: {
        request_id: request.request_id,
        type_of_note: "physician_notes",
      },
    });
    if (notes_status) {
      status = await Notes.update(
        {
          description: new_note,
        },
        {
          where: {
            request_id: request.request_id,
            type_of_note: "physician_notes",
          },
        }
      );
    } else {
      status = await Notes.create({
        request_id: request.request_id,
        type_of_note: "physician_notes",
        description: new_note,
      });
    }
    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: "Successfull !!!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const active_state_encounter: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { type_of_care } = req.query as {
      [key: string]: string;
    };

    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
      },
    });

    if (!request) {
      return res.status(404).json({
        message: message_constants.RNF,
      });
    }

    if (type_of_care == "consult") {
      const update = await RequestModel.update(
        {
          request_state: "conclude",
          request_status: "conclude",
        },
        {
          where: {
            confirmation_no,
          },
        }
      );
      if (!update) {
        return res.status(500).json({
          message: message_constants.EWU,
        });
      }
    }

    if (type_of_care == "housecall") {
      const update = await RequestModel.update(
        {
          request_status: "md_on_site",
        },
        {
          where: {
            confirmation_no,
          },
        }
      );
      if (!update) {
        return res.status(500).json({
          message: message_constants.EWU,
        });
      }
    }

    return res.status(200).json({
      message: message_constants.Success,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const housecall: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;

    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
      },
    });

    if (!request) {
      return res.status(404).json({
        message: message_constants.RNF,
      });
    }

    const update = await RequestModel.update(
      {
        request_state: "conclude",
        request_status: "conclude",
      },
      {
        where: {
          confirmation_no,
        },
      }
    );
    if (!update) {
      return res.status(500).json({
        message: message_constants.EWU,
      });
    }
    return res.status(200).json({
      message: message_constants.Success,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const conclude_state_conclude_care_view: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: [],
    };
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
      },
      include: [
        {
          model: User,
          as: "Patient",
        },
      ],
    });

    if (!request) {
      return res.status(404).json({
        message: message_constants.RNF,
      });
    }

    const notes = await Notes.findAll({
      where: {
        note_id: request.request_id,
        type_of_note: "physician_notes",
      },
    });

    if (!notes) {
      return res.status(404).json({
        message: message_constants.NF,
      });
    }

    const documents = await Documents.findAll({
      where: {
        request_id: request.request_id,
      },
    });

    if (!documents) {
      return res.status(404).json({
        message: message_constants.NF,
      });
    }
    const formatted_request = {
      confirmation_no: confirmation_no,
      patient_name: request.Patient.firstname + " " + request.Patient.lastname,
      documents: {
        documents: documents?.map((document) => ({
          document_id: document.document_id,
          document_name: document.document_name,
          document_path: document.document_path,
        })),
      },
      physician_notes: {
        notes: notes?.map((note) => ({
          note_id: note.note_id,
          type_of_note: note.type_of_note,
          description: note.description,
        })),
      },
    };

    formatted_response.data.push(formatted_request);

    return res.status(200).json({
      ...formatted_response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const conclude_state_conclude_care_upload: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    console.log(req.file?.fieldname);
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    console.log("Uploaded file details:", req.file);
    const file = req.file;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
      },
    });

    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }

    const new_document = await Documents.create({
      request_id: request.request_id,
      document_name: req.file?.fieldname,
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

export const conclude_state_conclude_care: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
      },
    });

    if (!request) {
      return res.status(404).json({
        message: message_constants.RNF,
      });
    }

    // console.log(request);

    const encounter_form = await EncounterForm.findOne({
      where: {
        request_id: request.request_id,
      },
    });

    if (!encounter_form) {
      return res.status(404).json({
        message: message_constants.EFoNF,
      });
    }

    if (encounter_form.is_finalize == "true") {
      const update = await RequestModel.update(
        {
          request_state: "toclose",
          request_status: "closed",
        },
        {
          where: {
            request_id: request.request_id,
            confirmation_no: request.confirmation_no,
          },
        }
      );

      if (!update) {
        return res.status(404).json({
          message: message_constants.EWU,
        });
      }

      return res.status(200).json({
        message: message_constants.Success,
      });
    } else {
      return res.status(500).json({
        message: message_constants.EFNF,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const conclude_state_get_encounter_form: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: [],
    };

    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
      },
    });

    if (!request) {
      return res.status(404).json({
        message: message_constants.RNF,
      });
    }

    const encounter_form = await EncounterForm.findOne({
      where: {
        request_id: request.request_id,
      },
    });
    if (encounter_form) {
      if (encounter_form.is_finalize == "true") {
        return res.status(200).json({
          message: message_constants.EFIF,
        });
      } else {
        const formatted_request = {
          confirmation_no: request.confirmation_no,
          request_id: request.request_id,
          form_id: encounter_form.form_id,
          first_name: encounter_form.first_name,
          last_name: encounter_form.last_name,
          location: encounter_form.location,
          date_of_birth: encounter_form?.date_of_birth
            .toISOString()
            .split("T")[0],
          date_of_service: encounter_form?.date_of_service
            ?.toISOString()
            .split("T")[0],
          phone_no: encounter_form.phone_no,
          email: encounter_form.email,
          history_of_present: encounter_form.history_of_present,
          medical_history: encounter_form.medical_history,
          medications: encounter_form.medications,
          allergies: encounter_form.allergies,
          temperature: encounter_form.temperature,
          heart_rate: encounter_form.heart_rate,
          respiratory_rate: encounter_form.respiratory_rate,
          blood_pressure_1: encounter_form.blood_pressure_1,
          blood_pressure_2: encounter_form.blood_pressure_2,
          o2: encounter_form.o2,
          pain: encounter_form.pain,
          heent: encounter_form.heent,
          cv: encounter_form.cv,
          chest: encounter_form.chest,
          abd: encounter_form.abd,
          extr: encounter_form.extr,
          skin: encounter_form.skin,
          neuro: encounter_form.neuro,
          other: encounter_form.other,
          diagnosis: encounter_form.diagnosis,
          treatment_plan: encounter_form.treatment_plan,
          medication_dispensed: encounter_form.medication_dispensed,
          procedures: encounter_form.procedures,
          follow_up: encounter_form.follow_up,
          created_at: encounter_form?.createdAt?.toISOString().split("T")[0],
          updated_at: encounter_form?.updatedAt?.toISOString().split("T")[0],
        };
        formatted_response.data.push(formatted_request);
      }
    } else {
      return res.status(404).json({
        message: message_constants.EFoNF + " ,kindly create first",
      });
    }
    return res.status(200).json({
      ...formatted_response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const conclude_state_download_encounter_form: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;

    const generate_encounter_form_PDF = async (encounter_form: any) => {
      const doc = new pdfkit();
      const form_name = `encounter_form_ ${encounter_form.Request.confirmation_no}.pdf`;
      const form_path = path.join(
        __dirname,
        "../",
        "../",
        "public",
        "uploads",
        form_name
      );

      // Create a writable stream using fs.createWriteStream
      const writable_stream = fs.createWriteStream(form_path);
      let chunks: Uint8Array[] = [];

      doc.pipe(writable_stream);
      doc.on("end", async () => {
        try {
          await fs.promises.writeFile(form_path, Buffer.concat(chunks));
          console.log("PDF file created successfully!");
        } catch (err) {
          console.error("Error writing encounter form PDF:", err);
        }
      });

      doc.fontSize(12);

      // Add document title and headers
      doc.text("Encounter Form Details", { align: "center" });
      doc.text("  ", { align: "center" });
      doc.text(
        `Confirmation Number: ${encounter_form.Request.confirmation_no}`,
        {
          align: "left",
        }
      );
      doc.text(`First Name: ${encounter_form.first_name}`, { align: "left" });
      doc.text(`Last Name: ${encounter_form.last_name}`, { align: "left" });
      doc.text(`Location: ${encounter_form.location}`, { align: "left" });
      doc.text(
        `Date of birth: ${
          encounter_form?.date_of_birth.toISOString().split("T")[0]
        }`,
        {
          align: "left",
        }
      );
      doc.text(
        `Date of Service: ${
          encounter_form?.date_of_service.toISOString().split("T")[0]
        }`,
        {
          align: "left",
        }
      );
      doc.text(`Phone No.: ${encounter_form.phone_no}`, { align: "left" });
      doc.text(`Email: ${encounter_form.email}`, { align: "left" });
      doc.text(`History of Payment: ${encounter_form.history_of_present}`, {
        align: "left",
      });
      doc.text(`Medical History: ${encounter_form.medical_history}`, {
        align: "left",
      });
      doc.text(`Medications: ${encounter_form.medications}`, { align: "left" });
      doc.text(`Allergies: ${encounter_form.allergies}`, { align: "left" });
      doc.text(`Temperature: ${encounter_form.temperature}`, { align: "left" });
      doc.text(`Heart Rate: ${encounter_form.heart_rate}`, { align: "left" });
      doc.text(`Respiratory Rate: ${encounter_form.respiratory_rate}`, {
        align: "left",
      });
      doc.text(`Blood Pressure 1: ${encounter_form.blood_pressure_1}`, {
        align: "left",
      });
      doc.text(`Blood Pressure 2: ${encounter_form.blood_pressure_2}`, {
        align: "left",
      });
      doc.text(`O2: ${encounter_form.o2}`, { align: "left" });
      doc.text(`Pain: ${encounter_form.pain}`, { align: "left" });
      doc.text(`HEENT: ${encounter_form.heent}`, { align: "left" });
      doc.text(`CV: ${encounter_form.cv}`, { align: "left" });
      doc.text(`Chest: ${encounter_form.chest}`, { align: "left" });
      doc.text(`ABD: ${encounter_form.abd}`, { align: "left" });
      doc.text(`EXTR: ${encounter_form.extr}`, { align: "left" });
      doc.text(`Skin: ${encounter_form.skin}`, { align: "left" });
      doc.text(`Neuro: ${encounter_form.neuro}`, { align: "left" });
      doc.text(`other: ${encounter_form.other}`, { align: "left" });
      doc.text(`diagnosis: ${encounter_form.diagnosis}`, { align: "left" });
      doc.text(`treatment_plan: ${encounter_form.treatment_plan}`, {
        align: "left",
      });
      doc.text(`Medication Dispensed: ${encounter_form.medication_dispensed}`, {
        align: "left",
      });
      doc.text(`Procedures: ${encounter_form.procedures}`, { align: "left" });
      doc.text(`Follow Up: ${encounter_form.follow_up}`, { align: "left" });

      doc.end();
    };

    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
      },
    });

    if (!request) {
      return res.status(404).json({
        message: message_constants.RNF,
      });
    }

    const encounter_form = await EncounterForm.findOne({
      where: {
        request_id: request.request_id,
      },
      include: [
        {
          model: RequestModel,
          as: "Request",
        },
      ],
    });
    if (encounter_form) {
      if (encounter_form.is_finalize == "true") {
        console.log(req.params);
        const form_name = `encounter_form_ ${encounter_form.Request.confirmation_no}.pdf`;

        await generate_encounter_form_PDF(encounter_form);
        return res.download(
          path.join(__dirname, "../", "../", "public", "uploads", form_name)
        );
      } else {
        return res.status(500).json({
          message: message_constants.EFNF,
        });
      }
    }
    return res.status(200).json({
      message: message_constants.Success,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const conclude_state_encounter_form: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const {
      first_name,
      last_name,
      location,
      date_of_birth,
      date_of_service,
      phone_no,
      email,
      history_of_present,
      medical_history,
      medications,
      allergies,
      temperature,
      heart_rate,
      respiratory_rate,
      blood_pressure_1,
      blood_pressure_2,
      o2,
      pain,
      heent,
      cv,
      chest,
      abd,
      extr,
      skin,
      neuro,
      other,
      diagnosis,
      treatment_plan,
      medication_dispensed,
      procedures,
      follow_up,
    } = req.body;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
      },
    });

    if (!request) {
      return res.status(404).json({
        message: message_constants.RNF,
      });
    }

    const encounter_form = await EncounterForm.findOne({
      where: {
        request_id: request.request_id,
      },
    });
    if (encounter_form) {
      const update = await EncounterForm.update(
        {
          request_id: request.request_id,
          first_name,
          last_name,
          location,
          date_of_birth,
          date_of_service,
          phone_no: BigInt(phone_no),
          email,
          history_of_present,
          medical_history,
          medications,
          allergies,
          temperature,
          heart_rate,
          respiratory_rate,
          blood_pressure_1,
          blood_pressure_2,
          o2,
          pain,
          heent,
          cv,
          chest,
          abd,
          extr,
          skin,
          neuro,
          other,
          diagnosis,
          treatment_plan,
          medication_dispensed,
          procedures,
          follow_up,
        },
        {
          where: {
            request_id: request.request_id,
          },
        }
      );
      if (!update) {
        return res.status(404).json({
          message: message_constants.EWU,
        });
      }
    } else {
      const create = await EncounterForm.create({
        request_id: request.request_id,
        first_name,
        last_name,
        location,
        date_of_birth,
        date_of_service,
        phone_no,
        email,
        history_of_present,
        medical_history,
        medications,
        allergies,
        temperature,
        heart_rate,
        respiratory_rate,
        blood_pressure_1,
        blood_pressure_2,
        o2,
        pain,
        heent,
        cv,
        chest,
        abd,
        extr,
        skin,
        neuro,
        other,
        diagnosis,
        treatment_plan,
        medication_dispensed,
        procedures,
        follow_up,
      });
      if (!create) {
        return res.status(500).json({
          message: message_constants.EWC,
        });
      }
    }
    return res.status(200).json({
      message: message_constants.Success,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const conclude_state_encounter_form_finalize: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { finalize_status } = req.body;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
      },
    });

    if (!request) {
      return res.status(404).json({
        message: message_constants.RNF,
      });
    }

    const encounter_form = await EncounterForm.findOne({
      where: {
        request_id: request.request_id,
      },
    });
    if (encounter_form) {
      const update = await EncounterForm.update(
        {
          request_id: request.request_id,
          is_finalize: finalize_status,
        },
        {
          where: {
            request_id: request.request_id,
          },
        }
      );

      if (!update) {
        return res.status(404).json({
          message: message_constants.EWU,
        });
      }
    } else {
      return res.status(404).json({
        message: message_constants.FoNF,
      });
    }

    const request_update = await RequestModel.update(
      {
        final_report: encounter_form.form_id,
      },
      {
        where: {
          confirmation_no,
        },
      }
    );

    if (!request_update) {
      return res.status(500).json({
        message: message_constants.EWU,
      });
    }

    return res.status(200).json({
      message: message_constants.Success,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};
