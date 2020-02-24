/**
 * @file mattermost.js
 * @description Mattermost route, proxies path to mattermost frontend
 */

import { Router } from "express";
import proxy from "http-proxy-middleware";

const app = new Router();

const mmProxy = proxy( {
  target: 'http://sfe-chatbot-mattermost:8065',
  changeOrigin: true,
} );

app.use( [ '/chat/*', '/chat' ], mmProxy );

export default app;
