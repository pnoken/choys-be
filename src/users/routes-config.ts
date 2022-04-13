import { Application } from "express";
import { create } from './controller';

export function routesConfig(app: Application) {
    app.post('/users', create);
}