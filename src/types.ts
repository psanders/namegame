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

// Holds the state for the game session
export interface GameSession {
  // The unique identifier of the session
  sessionId: string;
  // The mode of the game
  mode: GameMode;
  // The id for the current profile
  currentProfileId?: string;
  // The number of turns already played
  turn: number;
  // The expiration time for the game (it will be deleted after this time)
  expire: number;
}

// Enum with possible modes for the game
export enum GameMode {
  // The user can play until he makes a mistake
  PRACTICE = "practice",
  // The user will play until the timeout is reached
  TIMED = "timed"
}

// Holds the state for a hand within the game session
export interface Hand {
  // The name of the profile for the current hand
  name: string;
  // A list with the profiles for the current hand
  profiles: ProfileSummary[];
}

// Weather the hand is a win or not
export interface HandResult {
  // Did ther user won the turn?
  won: boolean;
  // The current number of turns
  turn: number;
}

// The headshot for the profile
export interface Headshot {
  // The unique identifier of the image
  id: string;
  // The alt tag for the image
  alt: string;
  // The high of the image
  height: number;
  // The width of the image
  width: number;
  // The mimetype of the image. For now only supports `image/jpeg`
  mimeType: "image/jpeg";
  // The type of media. For now only supports `image`
  type: "image";
  url: string;
}

// The profile of the employee
export interface Profile {
  // The unique identifier of the profile
  id: string;
  // The first name of the profile
  firstName: string;
  // The last name of the profile
  lastName: string;
  // The job title of the profile
  jobTitle: string;
  // The slug of the profile?
  slug: string;
  // A list of the social links for the profile
  socialLinks: string[];
  // The type of profile. For now only supports `person`
  type: "person";
  // The headshot object for the profile
  headshot: Headshot;
}

// The summary of the profile. This is used to return the profile to the client
export interface ProfileSummary {
  // The id of the profile.
  id: string;
  // The URL of the employee's avatar.
  headshot: Headshot;
}

// Interface for the redis client
export interface RedisClient {
  // Gets the value using the key
  get(key: string): Promise<string>;
  // Sets a key/value pair
  set(key: string, value: string): Promise<void>;
  // Sets the expiration time for a key
  expire(key: string, seconds: number): Promise<void>;
}

// TODO: Extend to include username and password
// Basic redis configuration.
export interface RedisConfig {
  // The host of the redis server
  host: string;
  // The port of the redis server
  port: number;
}

// The configuration for the Name Game service
export interface ServiceConfig {
  // The port of the server
  port: number;
  // The base path for the API. It will be used to prefix all the API routes.
  basePath: "/api";
  // The version of the API. It will be used to prefix all the API routes.
  apiVersion: "v1.0";
  // The configuration for the redis server
  redis: RedisConfig;
  // The url for the profiles API
  profilesAPIUrl: string;
}
