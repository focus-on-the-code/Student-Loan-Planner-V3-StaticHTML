// @ts-check

import { appConfig } from './config.js';
import { renderPreview, wirePreviewForm } from './ui/render-application.js';

wirePreviewForm();
renderPreview();
console.info(`${appConfig.appName}: ${appConfig.pass} loaded`);
