import { NextFunction, Request, Response } from "express";
import RequestModel from "../../Models/request";
import Provider from "../../Models/provider";

export const postRequestSupport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { support_message } = req.body;
    const requests = await Provider.findAll({
      where: { scheduled_status: "no" },
    });
    await Provider.update({
        support_message
    },
    {
        where:{
            scheduled_status:"no",
        }
    })
    return res.status(200).json({
        status: true,
        message: "Successfull !!!",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
