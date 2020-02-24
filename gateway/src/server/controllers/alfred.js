/**
 * @file alfred.js
 * @description Contains gateway API alfred proxy routes
 */

import { Router } from "express";
import proxy from "http-proxy-middleware";

const app = new Router();

const alfredProxy = proxy( {
  target: 'http://sfe-chatbot-core:5005',
  ws: true,
  changeOrigin: true,
  pathRewrite: {
    '^/api/alfred': ''
  }
} );

app.use( [ '/api/alfred/*', '/api/alfred' ], alfredProxy );

export default app;
