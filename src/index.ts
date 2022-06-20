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
import "express-async-errors";
import express, {Express, Request, Response} from "express";
import Redis from "ioredis";
import logger from "@fonoster/logger";
import {
  createNewHand,
  createGameSession,
  getGameSession,
  playHand
} from "./api";
import {RedisClient, ServiceConfig} from "./types";
import {createGetProfiles} from "./utils";
import errorMiddleware from "./middleware";

const app: Express = express();
app.use(express.json());

/**
 * This is the entry point for the service. It will be called by
 * the service runner.
 *
 * @param {ServerConfig} config - The configuration for the server.
 */
export default function start(config: ServiceConfig): void {
  // Creates new getProfiles function for the given url
  const getProfiles = createGetProfiles(config.profilesAPIUrl);

  const redis = new Redis(
    `redis://${config.redis.host}:${config.redis.port}`
  ) as unknown as RedisClient;

  app.post(
    `${config.basePath}/${config.apiVersion}/session`,
    async (req: Request, res: Response) => {
      const session = await createGameSession(redis)(
        req.body.mode,
        req.body.expire
      );
      res.send(session);
    }
  );

  app.get(
    `${config.basePath}/${config.apiVersion}/session/:sessionId`,
    async (req: Request, res: Response) => {
      res.send(await getGameSession(redis)(req.params.sessionId));
    }
  );

  app.post(
    `${config.basePath}/${config.apiVersion}/session/:sessionId/hand`,
    async (req: Request, res: Response) => {
      res.send(await createNewHand(redis, getProfiles)(req.params.sessionId));
    }
  );

  app.post(
    `${config.basePath}/${config.apiVersion}/session/:sessionId/hand/:profileId`,
    async (req: Request, res: Response) => {
      res.send(
        await playHand(redis)(req.params.sessionId, req.params.profileId)
      );
    }
  );

  app.listen(config.port, () => {
    logger.info(
      `⚡️[server]: Server is running http://localhost:${config.port}]`
    );
  });

  app.use(errorMiddleware);
}
