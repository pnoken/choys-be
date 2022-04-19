import {Request, Response} from "express";
import * as admin from "firebase-admin";

export async function all(req: Request, res: Response) {
  try {
    const listTenants = await admin.auth().tenantManager().listTenants();
    listTenants.tenants.forEach((tenant) => {
        return res.status(200).send(tenant.toJSON())
    })
    // if(listTenants.pageToken){
    //     return all(listTenants.pageToken);
    // }
    
  } catch (err){
      handleError(res, err)
  }
}

export async function get(req: Request, res: Response) {
  try {
    const {id} = req.params;
    const tenant = await admin.auth().tenantManager().getTenant(id);
    return res.status(200).send(tenant.toJSON());
  } catch (err) {
    return handleError(res, err);
  }
}

export async function create(req: Request, res: Response) {
  try {
    const {displayName} = req.body;
    if (!displayName) {
      return res.status(400).send({
        message: "Missing Fields",
      });
    }
    const createdTenant = await admin.auth().tenantManager().createTenant({
      displayName,
    emailSignInConfig: {
        enabled: true,
        passwordRequired: false,
    }
    })
    return res.status(201).send(createdTenant.toJSON());
    
  } catch (err) {
    return handleError(res, err);
  }
}

export async function patch(req: Request, res: Response) {
  try {
    const {id} = req.params;
    const {displayName} = req.body;
    if (!id || !displayName) {
      return res.status(400).send({message: "Missing fields"});
    }
    const updatedTenant = await admin.auth().tenantManager().updateTenant(id, {displayName, emailSignInConfig: { enabled: false}})
    return res.status(204).send(updatedTenant);
  } catch (err) {
    return handleError(res, err);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const {id} = req.params;
    await admin.auth().tenantManager().deleteTenant(id);
    return res.status(204).send({});
  } catch (err) {
    return handleError(res, err);
  }
}


function handleError(res: Response, err: any) {
  return res.status(500).send({message: `${err.code} - ${err.message}`});
}