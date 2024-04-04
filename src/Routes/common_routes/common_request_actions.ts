import express, { Router } from "express";
import { celebrate, Joi } from "celebrate";
import {
  view_case_for_request,
  view_uploads_view_data,
  view_uploads_upload,
  view_uploads_actions_delete,
  view_uploads_actions_download,
  view_uploads_delete_all,
  business_name_for_send_orders,
  view_send_orders_for_request,
  send_orders_for_request,
  send_agreement,
  update_agreement,
  view_uploads_download_all,
} from "../../controllers";
import {
  professions_for_send_orders,
} from "../../controllers";
import { authmiddleware } from "../../middlewares";
import {
  view_case_validation,
  view_uploads_view_data_validation,
  view_uploads_upload_validation,
  view_uploads_actions_delete_validation,
  view_uploads_actions_download_validation,
  view_uploads_delete_all_validation,
  view_uploads_download_all_validation,
  business_name_for_send_orders_validation,
  view_send_orders_for_request_validation,
  send_orders_for_request_validation,
  update_agreement_validation,
  send_agreement_validation,
} from "../../validations";
import { upload } from "../../utils";
const router: Router = express.Router();


/**Common Request Actions */


/**
 * @description Given below are Express routes that allows viewing request by confirmation number.
 */
router.get(
    "/dashboard/requests/:confirmation_no/actions/viewcase",
    authmiddleware,
    celebrate(view_case_validation),
    view_case_for_request
  );



/**
 * @description These handles various actions related to uploads for a request.
 */
router.get(
    "/dashboard/requests/:confirmation_no/actions/viewuploads/viewdata",
    authmiddleware,
    celebrate(view_uploads_view_data_validation),
  
    view_uploads_view_data
  );
  router.post(
    "/dashboard/requests/:confirmation_no/actions/viewuploads/upload",
    authmiddleware,
    celebrate(view_uploads_upload_validation),
    upload.single("file"),
    view_uploads_upload
  );
  router.delete(
    "/dashboard/requests/:confirmation_no/actions/viewuploads/delete/:document_id",
    authmiddleware,
    celebrate(view_uploads_actions_delete_validation),
    view_uploads_actions_delete
  );
  router.get(
    "/dashboard/requests/:confirmation_no/actions/viewuploads/download/:document_id",
    authmiddleware,
    celebrate(view_uploads_actions_download_validation),
    view_uploads_actions_download
  );
  router.delete(
    "/dashboard/requests/:confirmation_no/actions/viewuploads/deleteall",
    authmiddleware,
    celebrate(view_uploads_delete_all_validation),
    view_uploads_delete_all
  );
  router.get(
    "/dashboard/requests/:confirmation_no/actions/viewuploads/downloadall",
    authmiddleware,
    celebrate(view_uploads_download_all_validation),
    view_uploads_download_all
  );



/**
 * @description These handles viewing and sending orders for a request.
 */
router.get(
    "/dashboard/requests/actions/sendorders/professions",
    authmiddleware,
    professions_for_send_orders
  );
  router.get(
    "/dashboard/requests/actions/sendorders/businesses",
    authmiddleware,
    celebrate(business_name_for_send_orders_validation),
    business_name_for_send_orders
  );
  router.get(
    "/dashboard/requests/actions/viewsendorders",
    authmiddleware,
    celebrate(view_send_orders_for_request_validation),
    view_send_orders_for_request
  );
  router.post(
    "/dashboard/requests/:state/:confirmation_no/actions/sendorders",
    authmiddleware,
    celebrate(send_orders_for_request_validation),
    send_orders_for_request
  );



  /**
 * @description This function handles sending and updating agreements for a request.
 */
router.post(
    "/dashboard/requests/:confirmation_no/actions/sendagreement",
    authmiddleware,
    celebrate(send_agreement_validation),
    send_agreement
  );
  router.put(
    "/dashboard/requests/:confirmation_no/actions/updateagreement",
    authmiddleware,
    celebrate(update_agreement_validation),
    update_agreement
  );
  

export default router;