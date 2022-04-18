import {Application} from "express";
import {create, all, get, patch, remove} from "./controller";
import {isAuthenticated} from "../auth/authenticated";
import {isAuthorized} from "../auth/authorized";

export function routesConfig(app: Application) {
  app.post("/tenants",
      isAuthenticated,
      isAuthorized({hasRole: ["admin", "manager"]}),
      create);

  // List all tenants
//   app.get("/tenants", [
//     isAuthenticated,
//     isAuthorized({hasRole: ["admin", "manager"]}),
//     all,
//   ]);

  // get :id user
  app.get("/tenants/:id", [
    isAuthenticated,
    isAuthorized({hasRole: ["admin", "manager"], allowSameUser: true}),
    get,
  ]);
  // updates :id user
  app.patch("/tenants/:id", [
    isAuthenticated,
    isAuthorized({hasRole: ["admin", "manager"], allowSameUser: true}),
    patch,
  ]);
  // deletes :id user
  app.delete("/tenants/:id", [
    isAuthenticated,
    isAuthorized({hasRole: ["admin", "manager"]}),
    remove,
  ]);
}
