#!/usr/bin/env node
/*
 * Copyright (C) 2022 by Pedro Sanders
 *
 * This file is part of Name Game Application.
 *
 * Licensed under the MIT License (the "License");
 * you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    https://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import dotenv from "dotenv";
import {join} from "path";

if (process.env.NODE_ENV === "dev") {
  dotenv.config({path: join(__dirname, ".env")});
}

import start from "./index";
import {ServiceConfig} from "./types";

const config: ServiceConfig = {
  profilesAPIUrl: process.env.PROFILE_API_URL,
  port: (process.env.PORT && parseInt(process.env.PORT)) || 3000,
  basePath: "/api",
  apiVersion: "v1.0",
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: (process.env.REDIS_PORT && parseInt(process.env.REDIS_PORT)) || 6379
  }
};

// Stars the server
start(config);
