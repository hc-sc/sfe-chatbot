/**
 * @file controllers/index.js
 * @description Exports all controllers
 */

import { Router } from "express";

import usersController from './users';
import alfredController from './alfred';
import gatewayController from './static';
import searchController from './search';
import outagesController from './outages';
// import authController from './auth';
import mmController from './mattermost';

const app = new Router();

app.use( [ 
  usersController,
  alfredController,
  gatewayController,
  searchController,
  outagesController,
  // TODO: authController,
  mmController,
] );

export default app;
