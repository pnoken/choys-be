import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import {routesConfig} from "./users/routes-config";
import { routesConfigTenants } from "./tenants/routes-config";
import { routesConfigTenantUsers} from "./tenantUsers/routes-config"


// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp();

const app = express();
app.use(bodyParser.json());
app.use(cors({origin: true}));
routesConfig(app);
routesConfigTenants(app);
routesConfigTenantUsers(app);

export const api = functions.https.onRequest(app);