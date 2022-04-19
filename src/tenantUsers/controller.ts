import {Request, Response} from "express";
import * as admin from "firebase-admin";

//Tenant specific users

//Create Tenant User
export async function create(req: Request, res: Response) {
  try {
      const {tenantID} = req.params;
    const tenantAuth = admin.auth().tenantManager().authForTenant(tenantID);
    const {displayName, password, email, role} = req.body;
    if (!displayName || !password || !email || !role) {
      return res.status(400).send({
        message: "Missing Fields",
      });
    }
    const {uid} = await tenantAuth.createUser({
      displayName,
      password,
      email,
    });
    await admin.auth().setCustomUserClaims(uid, {
      role,
    });

    return res.status(201).send({uid});
  } catch (err) {
    return handleError(res, err);
  }
}

//Get Tenant User
export async function get(req: Request, res: Response) {
  try {
    const {tenantID, id} = req.params;
    const tenantAuth = admin.auth().tenantManager().authForTenant(tenantID);
    const user = await tenantAuth.getUser(id);
    return res.status(200).send({user: mapUser(user)});
  } catch (err) {
    return handleError(res, err);
  }
}


//Modify tenant User
export async function patch(req: Request, res: Response) {
  try {
    const {tenantID, id} = req.params;
    const tenantAuth = admin.auth().tenantManager().authForTenant(tenantID);
    const {displayName, password, email, role} = req.body;

    if (!id || !displayName || !password || !email || !role) {
      return res.status(400).send({message: "Missing fields"});
    }

    await tenantAuth.updateUser(id, {displayName, password, email});
    await tenantAuth.setCustomUserClaims(id, {role});
    const user = await tenantAuth.getUser(id);

    return res.status(204).send({user: mapUser(user)});
  } catch (err) {
    return handleError(res, err);
  }
}

//Get all users
export async function all(req: Request, res: Response) {
  try {
      const {tenantID} = req.params;
    const tenantAuth = admin.auth().tenantManager().authForTenant(tenantID);
    const listUsers = await tenantAuth.listUsers();
    const users = listUsers.users.map(mapUser);
    return res.status(200).send({users});
  } catch (err) {
    return handleError(res, err);
  }
}

//Delete Tenant Users
export async function remove(req: Request, res: Response) {
  try {
    const {tenantID, id} = req.params;
    const tenantAuth = admin.auth().tenantManager().authForTenant(tenantID);
    await tenantAuth.deleteUser(id);
    return res.status(204).send({});
  } catch (err) {
    return handleError(res, err);
  }
}

//Map fn
function mapUser(user: admin.auth.UserRecord) {
  const customClaims = (user.customClaims || {role: ""}) as { role?: string };
  const role = customClaims.role ? customClaims.role : "";
  return {
    uid: user.uid,
    email: user.email || "",
    displayName: user.displayName || "",
    role,
    lastSignInTime: user.metadata.lastSignInTime,
    creationTime: user.metadata.creationTime,
  };
}


function handleError(res: Response, err: any) {
  return res.status(500).send({message: `${err.code} - ${err.message}`});
}