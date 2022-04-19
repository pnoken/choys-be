import {Application} from "express";
import {create, all, get, patch, remove} from "./controller";
import {isAuthenticated} from "../auth/authenticated";
import {isAuthorized} from "../auth/authorized";

export function routesConfigTenantUsers(app: Application) {
  app.post("/tenants/users/:tenantID",
      isAuthenticated,
      isAuthorized({hasRole: ["admin", "manager"]}),
      create);

  //List all tenant users
  app.get("/tenants/users/:tenantID", [
    isAuthenticated,
    isAuthorized({hasRole: ["admin", "manager"]}),
    all,
  ]);

  // get :id user
  app.get("/tenants/users/:tenantID/:id", [
    isAuthenticated,
    isAuthorized({hasRole: ["admin", "manager"], allowSameUser: true}),
    get,
  ]);
  // updates :id user
  app.patch("/tenants/users/:tenantID/:id", [
    isAuthenticated,
    isAuthorized({hasRole: ["admin", "manager"], allowSameUser: true}),
    patch,
  ]);
  // deletes :id user
  app.delete("/tenants/users/:tenantID/:id", [
    isAuthenticated,
    isAuthorized({hasRole: ["admin", "manager"]}),
    remove,
  ]);
}
