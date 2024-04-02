import { Request, Response, NextFunction } from "express";
import RequestModel from "../../db/models/request";
import User from "../../db/models/user";
import Notes from "../../db/models/notes";
import { Controller } from "../../interfaces/common_interface";
import { Op } from "sequelize";
import dotenv from "dotenv";
import message_constants from "../../public/message_constants";
import RoleAccessMapping from "../../db/models/role-access_mapping";
import Access from "../../db/models/access";
import Role from "../../db/models/role";

/** Configs */
dotenv.config({ path: `.env` });

/**                             Admin in Access Roles                                     */
/** Admin Account Access */

export const access_accountaccess: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, page_size } = req.query as {
      page: string;
      page_size: string;
    };
    const page_number = parseInt(page) || 1;
    const limit = parseInt(page_size) || 10;
    const offset = (page_number - 1) * limit;
    const formatted_response: any = {
      status: true,
      data: [],
    };
    const { count, rows: roles } = await Role.findAndCountAll({
      attributes: ["role_id", "role_name", "account_type"],
      limit,
      offset,
    });

    if (!roles) {
      return res.status(404).json({ error: message_constants.AcNF });
    }

    var i = offset + 1;
    for (const role of roles) {
      const formatted_request: any = {
        sr_no: i,
        role_id: role.role_id,
        name: role.role_name,
        account_type: role.account_type,
      };
      formatted_response.data.push(formatted_request);
      i++;
    }

    return res.status(200).json({
      ...formatted_response,
      totalPages: Math.ceil(count / limit),
      currentPage: page_number,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};
export const access_accountaccess_edit: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role_id } = req.params;
    const formatted_response: any = {
      status: true,
      data: [],
    };
    const role = await Role.findOne({
      where: {
        role_id,
      },
      attributes: ["role_id", "role_name", "account_type"],
    });
    if (!role) {
      return res.status(404).json({ error: message_constants.AcNF });
    }
    const formatted_request: any = {
      role_id: role.role_id,
      role_name: role.role_name,
      account_type: role.account_type,
    };
    formatted_response.data.push(formatted_request);

    return res.status(200).json({
      ...formatted_response,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};
export const access_account_access_create_access: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      role_name,
      account_type,
      regions,
      scheduling,
      history,
      accounts,
      role,
      provider,
      request_data,
      vendorship,
      profession,
      email_logs,
      halo_administrators,
      halo_users,
      cancelled_history,
      provider_location,
      halo_employee,
      halo_work_place,
      patient_records,
      blocked_history,
      sms_logs,
      my_schedule,
      dashboard,
      my_profile,
      send_order,
      chat,
      invoicing,
    } = req.body;

    const new_role = await Role.create({
      role_name,
      account_type,
    });

    if (!new_role) {
      return res.status(500).json({
        message: message_constants.EWCA,
      });
    }

    if (regions) {
      const access = await Access.findOne({
        where: {
          access_name: "regions",
        },
      });
      if (!access) {
        return res.status(500).json({
          message: message_constants.AccNF,
        });
      }
      const is_access = await RoleAccessMapping.findOne({
        where: {
          role_id: new_role.role_id,
          access_id: access.access_id,
        },
      });
      if (!is_access) {
        const create_access = await RoleAccessMapping.create({
          role_id: new_role.role_id,
          access_id: access?.access_id,
        });
        if (!create_access) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      } else {
        const delete_access = await RoleAccessMapping.destroy({
          where: {
            role_id: new_role.role_id,
            access_id: access?.access_id,
          },
        });
        if (!delete_access) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (scheduling) {
      const access = await Access.findOne({
        where: {
          access_name: "scheduling",
        },
      });
      if (!access) {
        return res.status(500).json({
          message: message_constants.AccNF,
        });
      }
      const is_access = await RoleAccessMapping.findOne({
        where: {
          role_id: new_role.role_id,
          access_id: access.access_id,
        },
      });
      if (!is_access) {
        const create_access = await RoleAccessMapping.create({
          role_id: new_role.role_id,
          access_id: access?.access_id,
        });
        if (!create_access) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      } else {
        const delete_access = await RoleAccessMapping.destroy({
          where: {
            role_id: new_role.role_id,
            access_id: access?.access_id,
          },
        });
        if (!delete_access) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (history) {
      const access = await Access.findOne({
        where: {
          access_name: "history",
        },
      });
      if (!access) {
        return res.status(500).json({
          message: message_constants.AccNF,
        });
      }
      const is_access = await RoleAccessMapping.findOne({
        where: {
          role_id: new_role.role_id,
          access_id: access.access_id,
        },
      });
      if (!is_access) {
        const create_access = await RoleAccessMapping.create({
          role_id: new_role.role_id,
          access_id: access?.access_id,
        });
        if (!create_access) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      } else {
        const delete_access = await RoleAccessMapping.destroy({
          where: {
            role_id: new_role.role_id,
            access_id: access?.access_id,
          },
        });
        if (!delete_access) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (accounts) {
      const access = await Access.findOne({
        where: {
          access_name: "accounts",
        },
      });
      if (!access) {
        return res.status(500).json({
          message: message_constants.AccNF,
        });
      }
      const is_access = await RoleAccessMapping.findOne({
        where: {
          role_id: new_role.role_id,
          access_id: access.access_id,
        },
      });
      if (!is_access) {
        const create_access = await RoleAccessMapping.create({
          role_id: new_role.role_id,
          access_id: access?.access_id,
        });
        if (!create_access) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      } else {
        const delete_access = await RoleAccessMapping.destroy({
          where: {
            role_id: new_role.role_id,
            access_id: access?.access_id,
          },
        });
        if (!delete_access) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (role) {
      const access = await Access.findOne({
        where: {
          access_name: "role",
        },
      });
      if (!access) {
        return res.status(500).json({
          message: message_constants.AccNF,
        });
      }
      const is_access = await RoleAccessMapping.findOne({
        where: {
          role_id: new_role.role_id,
          access_id: access.access_id,
        },
      });
      if (!is_access) {
        const create_access = await RoleAccessMapping.create({
          role_id: new_role.role_id,
          access_id: access?.access_id,
        });
        if (!create_access) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      } else {
        const delete_access = await RoleAccessMapping.destroy({
          where: {
            role_id: new_role.role_id,
            access_id: access?.access_id,
          },
        });
        if (!delete_access) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (provider) {
      const access = await Access.findOne({
        where: {
          access_name: "provider",
        },
      });
      if (!access) {
        return res.status(500).json({
          message: message_constants.AccNF,
        });
      }
      const is_access = await RoleAccessMapping.findOne({
        where: {
          role_id: new_role.role_id,
          access_id: access.access_id,
        },
      });
      if (!is_access) {
        const create_access = await RoleAccessMapping.create({
          role_id: new_role.role_id,
          access_id: access?.access_id,
        });
        if (!create_access) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      } else {
        const delete_access = await RoleAccessMapping.destroy({
          where: {
            role_id: new_role.role_id,
            access_id: access?.access_id,
          },
        });
        if (!delete_access) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (request_data) {
      const access = await Access.findOne({
        where: {
          access_name: "request_data",
        },
      });
      if (!access) {
        return res.status(500).json({
          message: message_constants.AccNF,
        });
      }
      const is_access = await RoleAccessMapping.findOne({
        where: {
          role_id: new_role.role_id,
          access_id: access.access_id,
        },
      });
      if (!is_access) {
        const create_access = await RoleAccessMapping.create({
          role_id: new_role.role_id,
          access_id: access?.access_id,
        });
        if (!create_access) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      } else {
        const delete_access = await RoleAccessMapping.destroy({
          where: {
            role_id: new_role.role_id,
            access_id: access?.access_id,
          },
        });
        if (!delete_access) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (vendorship) {
      const access = await Access.findOne({
        where: {
          access_name: "vendorship",
        },
      });
      if (!access) {
        return res.status(500).json({
          message: message_constants.AccNF,
        });
      }
      const is_access = await RoleAccessMapping.findOne({
        where: {
          role_id: new_role.role_id,
          access_id: access.access_id,
        },
      });
      if (!is_access) {
        const create_access = await RoleAccessMapping.create({
          role_id: new_role.role_id,
          access_id: access?.access_id,
        });
        if (!create_access) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      } else {
        const delete_access = await RoleAccessMapping.destroy({
          where: {
            role_id: new_role.role_id,
            access_id: access?.access_id,
          },
        });
        if (!delete_access) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (profession) {
      const access = await Access.findOne({
        where: {
          access_name: "profession",
        },
      });
      if (!access) {
        return res.status(500).json({
          message: message_constants.AccNF,
        });
      }
      const is_access = await RoleAccessMapping.findOne({
        where: {
          role_id: new_role.role_id,
          access_id: access.access_id,
        },
      });
      if (!is_access) {
        const create_access = await RoleAccessMapping.create({
          role_id: new_role.role_id,
          access_id: access?.access_id,
        });
        if (!create_access) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      } else {
        const delete_access = await RoleAccessMapping.destroy({
          where: {
            role_id: new_role.role_id,
            access_id: access?.access_id,
          },
        });
        if (!delete_access) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (email_logs) {
      const access = await Access.findOne({
        where: {
          access_name: "email_logs",
        },
      });
      if (!access) {
        return res.status(500).json({
          message: message_constants.AccNF,
        });
      }
      const is_access = await RoleAccessMapping.findOne({
        where: {
          role_id: new_role.role_id,
          access_id: access.access_id,
        },
      });
      if (!is_access) {
        const create_access = await RoleAccessMapping.create({
          role_id: new_role.role_id,
          access_id: access?.access_id,
        });
        if (!create_access) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      } else {
        const delete_access = await RoleAccessMapping.destroy({
          where: {
            role_id: new_role.role_id,
            access_id: access?.access_id,
          },
        });
        if (!delete_access) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (halo_administrators) {
      const access = await Access.findOne({
        where: {
          access_name: "halo_administrators",
        },
      });
      if (!access) {
        return res.status(500).json({
          message: message_constants.AccNF,
        });
      }
      const is_access = await RoleAccessMapping.findOne({
        where: {
          role_id: new_role.role_id,
          access_id: access.access_id,
        },
      });
      if (!is_access) {
        const create_access = await RoleAccessMapping.create({
          role_id: new_role.role_id,
          access_id: access?.access_id,
        });
        if (!create_access) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      } else {
        const delete_access = await RoleAccessMapping.destroy({
          where: {
            role_id: new_role.role_id,
            access_id: access?.access_id,
          },
        });
        if (!delete_access) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (halo_users) {
      const access = await Access.findOne({
        where: {
          access_name: "halo_users",
        },
      });
      if (!access) {
        return res.status(500).json({
          message: message_constants.AccNF,
        });
      }
      const is_access = await RoleAccessMapping.findOne({
        where: {
          role_id: new_role.role_id,
          access_id: access.access_id,
        },
      });
      if (!is_access) {
        const create_access = await RoleAccessMapping.create({
          role_id: new_role.role_id,
          access_id: access?.access_id,
        });
        if (!create_access) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      } else {
        const delete_access = await RoleAccessMapping.destroy({
          where: {
            role_id: new_role.role_id,
            access_id: access?.access_id,
          },
        });
        if (!delete_access) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (cancelled_history) {
      const access = await Access.findOne({
        where: {
          access_name: "cancelled_history",
        },
      });
      if (!access) {
        return res.status(500).json({
          message: message_constants.AccNF,
        });
      }
      const is_access = await RoleAccessMapping.findOne({
        where: {
          role_id: new_role.role_id,
          access_id: access.access_id,
        },
      });
      if (!is_access) {
        const create_access = await RoleAccessMapping.create({
          role_id: new_role.role_id,
          access_id: access?.access_id,
        });
        if (!create_access) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      } else {
        const delete_access = await RoleAccessMapping.destroy({
          where: {
            role_id: new_role.role_id,
            access_id: access?.access_id,
          },
        });
        if (!delete_access) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (provider_location) {
      const access = await Access.findOne({
        where: {
          access_name: "provider_location",
        },
      });
      if (!access) {
        return res.status(500).json({
          message: message_constants.AccNF,
        });
      }
      const is_access = await RoleAccessMapping.findOne({
        where: {
          role_id: new_role.role_id,
          access_id: access.access_id,
        },
      });
      if (!is_access) {
        const create_access = await RoleAccessMapping.create({
          role_id: new_role.role_id,
          access_id: access?.access_id,
        });
        if (!create_access) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      } else {
        const delete_access = await RoleAccessMapping.destroy({
          where: {
            role_id: new_role.role_id,
            access_id: access?.access_id,
          },
        });
        if (!delete_access) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (halo_employee) {
      const access = await Access.findOne({
        where: {
          access_name: "halo_employee",
        },
      });
      if (!access) {
        return res.status(500).json({
          message: message_constants.AccNF,
        });
      }
      const is_access = await RoleAccessMapping.findOne({
        where: {
          role_id: new_role.role_id,
          access_id: access.access_id,
        },
      });
      if (!is_access) {
        const create_access = await RoleAccessMapping.create({
          role_id: new_role.role_id,
          access_id: access?.access_id,
        });
        if (!create_access) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      } else {
        const delete_access = await RoleAccessMapping.destroy({
          where: {
            role_id: new_role.role_id,
            access_id: access?.access_id,
          },
        });
        if (!delete_access) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (halo_work_place) {
      const access = await Access.findOne({
        where: {
          access_name: "halo_work_place",
        },
      });
      if (!access) {
        return res.status(500).json({
          message: message_constants.AccNF,
        });
      }
      const is_access = await RoleAccessMapping.findOne({
        where: {
          role_id: new_role.role_id,
          access_id: access.access_id,
        },
      });
      if (!is_access) {
        const create_access = await RoleAccessMapping.create({
          role_id: new_role.role_id,
          access_id: access?.access_id,
        });
        if (!create_access) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      } else {
        const delete_access = await RoleAccessMapping.destroy({
          where: {
            role_id: new_role.role_id,
            access_id: access?.access_id,
          },
        });
        if (!delete_access) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (patient_records) {
      const access = await Access.findOne({
        where: {
          access_name: "patient_records",
        },
      });
      if (!access) {
        return res.status(500).json({
          message: message_constants.AccNF,
        });
      }
      const is_access = await RoleAccessMapping.findOne({
        where: {
          role_id: new_role.role_id,
          access_id: access.access_id,
        },
      });
      if (!is_access) {
        const create_access = await RoleAccessMapping.create({
          role_id: new_role.role_id,
          access_id: access?.access_id,
        });
        if (!create_access) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      } else {
        const delete_access = await RoleAccessMapping.destroy({
          where: {
            role_id: new_role.role_id,
            access_id: access?.access_id,
          },
        });
        if (!delete_access) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (blocked_history) {
      const access = await Access.findOne({
        where: {
          access_name: "blocked_history",
        },
      });
      if (!access) {
        return res.status(500).json({
          message: message_constants.AccNF,
        });
      }
      const is_access = await RoleAccessMapping.findOne({
        where: {
          role_id: new_role.role_id,
          access_id: access.access_id,
        },
      });
      if (!is_access) {
        const create_access = await RoleAccessMapping.create({
          role_id: new_role.role_id,
          access_id: access?.access_id,
        });
        if (!create_access) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      } else {
        const delete_access = await RoleAccessMapping.destroy({
          where: {
            role_id: new_role.role_id,
            access_id: access?.access_id,
          },
        });
        if (!delete_access) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (sms_logs) {
      const access = await Access.findOne({
        where: {
          access_name: "sms_logs",
        },
      });
      if (!access) {
        return res.status(500).json({
          message: message_constants.AccNF,
        });
      }
      const is_access = await RoleAccessMapping.findOne({
        where: {
          role_id: new_role.role_id,
          access_id: access.access_id,
        },
      });
      if (!is_access) {
        const create_access = await RoleAccessMapping.create({
          role_id: new_role.role_id,
          access_id: access?.access_id,
        });
        if (!create_access) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      } else {
        const delete_access = await RoleAccessMapping.destroy({
          where: {
            role_id: new_role.role_id,
            access_id: access?.access_id,
          },
        });
        if (!delete_access) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (my_schedule) {
      const access = await Access.findOne({
        where: {
          access_name: "my_schedule",
        },
      });
      if (!access) {
        return res.status(500).json({
          message: message_constants.AccNF,
        });
      }
      const is_access = await RoleAccessMapping.findOne({
        where: {
          role_id: new_role.role_id,
          access_id: access.access_id,
        },
      });
      if (!is_access) {
        const create_access = await RoleAccessMapping.create({
          role_id: new_role.role_id,
          access_id: access?.access_id,
        });
        if (!create_access) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      } else {
        const delete_access = await RoleAccessMapping.destroy({
          where: {
            role_id: new_role.role_id,
            access_id: access?.access_id,
          },
        });
        if (!delete_access) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (dashboard) {
      const access = await Access.findOne({
        where: {
          access_name: "dashboard",
        },
      });
      if (!access) {
        return res.status(500).json({
          message: message_constants.AccNF,
        });
      }
      const is_access = await RoleAccessMapping.findOne({
        where: {
          role_id: new_role.role_id,
          access_id: access.access_id,
        },
      });
      if (!is_access) {
        const create_access = await RoleAccessMapping.create({
          role_id: new_role.role_id,
          access_id: access?.access_id,
        });
        if (!create_access) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      } else {
        const delete_access = await RoleAccessMapping.destroy({
          where: {
            role_id: new_role.role_id,
            access_id: access?.access_id,
          },
        });
        if (!delete_access) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (my_profile) {
      const access = await Access.findOne({
        where: {
          access_name: "my_profile",
        },
      });
      if (!access) {
        return res.status(500).json({
          message: message_constants.AccNF,
        });
      }
      const is_access = await await RoleAccessMapping.findOne({
        where: {
          role_id: new_role.role_id,
          access_id: access.access_id,
        },
      });
      if (!is_access) {
        const create_access = await RoleAccessMapping.create({
          role_id: new_role.role_id,
          access_id: access?.access_id,
        });
        if (!create_access) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      } else {
        const delete_access = await RoleAccessMapping.destroy({
          where: {
            role_id: new_role.role_id,
            access_id: access?.access_id,
          },
        });
        if (!delete_access) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (send_order) {
      const access = await Access.findOne({
        where: {
          access_name: "send_order",
        },
      });
      if (!access) {
        return res.status(500).json({
          message: message_constants.AccNF,
        });
      }
      const is_access = await await RoleAccessMapping.findOne({
        where: {
          role_id: new_role.role_id,
          access_id: access.access_id,
        },
      });
      if (!is_access) {
        const create_access = await RoleAccessMapping.create({
          role_id: new_role.role_id,
          access_id: access?.access_id,
        });
        if (!create_access) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      } else {
        const delete_access = await RoleAccessMapping.destroy({
          where: {
            role_id: new_role.role_id,
            access_id: access?.access_id,
          },
        });
        if (!delete_access) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (my_schedule) {
      const access = await Access.findOne({
        where: {
          access_name: "my_schedule",
        },
      });
      if (!access) {
        return res.status(500).json({
          message: message_constants.AccNF,
        });
      }
      const is_access = await await RoleAccessMapping.findOne({
        where: {
          role_id: new_role.role_id,
          access_id: access.access_id,
        },
      });
      if (!is_access) {
        const create_access = await RoleAccessMapping.create({
          role_id: new_role.role_id,
          access_id: access?.access_id,
        });
        if (!create_access) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      } else {
        const delete_access = await RoleAccessMapping.destroy({
          where: {
            role_id: new_role.role_id,
            access_id: access?.access_id,
          },
        });
        if (!delete_access) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (chat) {
      const access = await Access.findOne({
        where: {
          access_name: "chat",
        },
      });
      if (!access) {
        return res.status(500).json({
          message: message_constants.AccNF,
        });
      }
      const is_access = await await RoleAccessMapping.findOne({
        where: {
          role_id: new_role.role_id,
          access_id: access.access_id,
        },
      });
      if (!is_access) {
        const create_access = await RoleAccessMapping.create({
          role_id: new_role.role_id,
          access_id: access?.access_id,
        });
        if (!create_access) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      } else {
        const delete_access = await RoleAccessMapping.destroy({
          where: {
            role_id: new_role.role_id,
            access_id: access?.access_id,
          },
        });
        if (!delete_access) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (invoicing) {
      const access = await Access.findOne({
        where: {
          access_name: "invoicing",
        },
      });
      if (!access) {
        return res.status(500).json({
          message: message_constants.AccNF,
        });
      }
      const is_access = await await RoleAccessMapping.findOne({
        where: {
          role_id: new_role.role_id,
          access_id: access.access_id,
        },
      });
      if (!is_access) {
        const create_access = await RoleAccessMapping.create({
          role_id: new_role.role_id,
          access_id: access?.access_id,
        });
        if (!create_access) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      } else {
        const delete_access = await RoleAccessMapping.destroy({
          where: {
            role_id: new_role.role_id,
            access_id: access?.access_id,
          },
        });
        if (!delete_access) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
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

export const access_account_access_create_access_refactored: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      role_name,
      account_type,
      regions,
      scheduling,
      history,
      accounts,
      role,
      provider,
      request_data,
      vendorship,
      profession,
      email_logs,
      halo_administrators,
      halo_users,
      cancelled_history,
      provider_location,
      halo_employee,
      halo_work_place,
      patient_records,
      blocked_history,
      sms_logs,
      my_schedule,
      dashboard,
      my_profile,
      send_order,
      chat,
      invoicing,
    } = req.body;

    const new_role = await Role.create({
      role_name,
      account_type,
    });

    if (!new_role) {
      return res.status(500).json({
        message: message_constants.EWCA,
      });
    }

    const accessList = [
      { name: "regions", value: regions },
      { name: "scheduling", value: scheduling },
      { name: "history", value: history },
      { name: "accounts", value: accounts },
      { name: "role", value: role },
      { name: "provider", value: provider },
      { name: "request_data", value: request_data },
      { name: "vendorship", value: vendorship },
      { name: "profession", value: profession },
      { name: "email_logs", value: email_logs },
      { name: "halo_administrators", value: halo_administrators },
      { name: "halo_users", value: halo_users },
      { name: "cancelled_history", value: cancelled_history },
      { name: "provider_location", value: provider_location },
      { name: "halo_employee", value: halo_employee },
      { name: "halo_work_place", value: halo_work_place },
      { name: "patient_records", value: patient_records },
      { name: "blocked_history", value: blocked_history },
      { name: "sms_logs", value: sms_logs },
      { name: "my_schedule", value: my_schedule },
      { name: "dashboard", value: dashboard },
      { name: "my_profile", value: my_profile },
      { name: "send_order", value: send_order },
      { name: "chat", value: chat },
      { name: "invoicing", value: invoicing },
    ];

    const handleAccess = async (roleId:any, accessName:any) => {
      try {
        const access = await Access.findOne({
          where: {
            access_name: accessName,
          },
        });
    
        if (!access) {
          return res.status(500).json({
            message: message_constants.AccNF,
          });
        }
    
        const isAccess = await RoleAccessMapping.findOne({
          where: {
            role_id: roleId,
            access_id: access.access_id,
          },
        });
    
        if (!isAccess) {
          await RoleAccessMapping.create({
            role_id: roleId,
            access_id: access.access_id,
          });
        } else {
          await RoleAccessMapping.destroy({
            where: {
              role_id: roleId,
              access_id: access.access_id,
            },
          });
        }
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: message_constants.ISE });
      }
    };
    for (const accessItem of accessList) {
      if (accessItem.value) {
        await handleAccess(new_role.role_id, accessItem.name);
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

/**
 * Manages account access based on the specified action.
 *
 * @param req Express Request object
 * @param res Express Response object
 * @param next Express NextFunction object
 */
export const access_account_access_edit_save: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role_id } = req.params;
    const { role_name, account_type } = req.body;
    const role = await Role.findOne({
      where: {
        role_id: role_id,
      },
    });
    if (!role) {
      return res.status(404).json({ error: message_constants.AcNF });
    }
    const account_data = await Role.update(
      {
        role_name,
        account_type,
      },
      {
        where: {
          role_id,
        },
      }
    );
    if (!account_data) {
      return res.status(404).json({ error: message_constants.EWDI });
    }
    return res.status(200).json({
      status: true,
      message: message_constants.US,
    });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};
export const access_account_access_delete: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role_id } = req.params;
    const role = await Role.findOne({
      where: {
        role_id,
      },
    });

    if (!role) {
      return res.status(404).json({ error: message_constants.AcNF });
    }

    const mapping = await RoleAccessMapping.destroy({
      where: { role_id },
    });

    if (!mapping) {
      return res.status(500).json({
        message: message_constants.EWD,
      });
    }

    const delete_role = await Role.destroy({
      where: {
        role_id,
      },
    });
    if (!delete_role) {
      return res.status(500).json({
        message: message_constants.EWD,
      });
    }
    return res
      .status(200)
      .json({ status: true, message: message_constants.DS });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};

/** Admin User Access */

/**
 * Manages user access based on the specified action.
 *
 * @param req Express Request object
 * @param res Express Response object
 * @param next Express NextFunction object
 */

export const access_useraccess: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role } = req.query; // Get search parameters from query string
    const where_clause: { [key: string]: any } = {};
    const formatted_response: any = {
      status: true,
      data: [],
    };
    if (role) {
      where_clause.role = {
        [Op.like]: `%${role}%`, // Use LIKE operator for partial matching
      };
    }

    const accounts = await User.findAll({
      attributes: [
        "role_id",
        "user_id",
        "type_of_user",
        "firstname",
        "lastname",
        "mobile_no",
        "status",
        "open_requests",
      ],
      where: where_clause, // Apply constructed search criteria
    });

    if (!accounts) {
      return res.status(404).json({ error: message_constants.ANF });
    }
    for (const account of accounts) {
      const formatted_request: any = {
        user_id: account.user_id,
        account_type: account.type_of_user,
        account_poc: account.firstname + " " + account.lastname,
        phone: account.mobile_no,
        status: account.status,
        open_requests: account.open_requests,
      };
      formatted_response.data.push(formatted_request);
    }
    return res.status(200).json({
      ...formatted_response,
    });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};
export const access_useraccess_edit: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.params;
    const formatted_response: any = {
      status: true,
      data: [],
    };
    const account = await User.findOne({
      where: {
        user_id: user_id,
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
        "type_of_user",
        "status",
        "role_id",
      ],
    });
    if (!account) {
      return res.status(404).json({ error: message_constants.ANF });
    }

    const formatted_request: any = {
      firstname: account.firstname,
      lastname: account.lastname,
      phone: account.mobile_no,
      address_1: account.address_1,
      address_2: account.address_2,
      city: account.city,
      region: account.state,
      zip: account.zip,
      DOB: account.dob,
      account_type: account.type_of_user,
      status: account.status,
    };
    formatted_response.data.push(formatted_request);

    return res.status(200).json({
      ...formatted_response,
    });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};
export const access_useraccess_edit_save: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.params;
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
        user_id: user_id,
      },
    });
    if (!account) {
      return res.status(404).json({ error: message_constants.ANF });
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
          user_id: user_id,
        },
      }
    );
    if (!account_data) {
      return res.status(404).json({ error: message_constants.EWEA });
    }
    return res.status(200).json({
      status: true,
      message: message_constants.US,
    });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};
