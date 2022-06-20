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
import {Profile} from "./types";

// TODO: Replace with Axios or NodeJS native fetch
const fetch = require("node-fetch");

/**
 * Encloses the getProfiles function.
 *
 * @param {string} url - The url to fetch.
 * @return {Function} - The getProfile function.
 */
export function createGetProfiles(url: string) {
  // The function retrieves a list of profiles and returns a random subset of them.
  return async (): Promise<Profile[]> => {
    const response = await fetch(url);
    const profiles = JSON.parse(await response.text()) as Profile[];
    return getRandomProfiles(profiles);
  };
}

/**
 * Returns a subset of random profiles from the list.
 *
 * @param {Profile[]} profiles - The list of profiles to select from.
 * @param {number} no - The number of profiles to randomly select.
 * @return {Profile[]} - An array of profiles.
 * @throws {InvalidURLException} - If the url is not valid.
 */
export default function getRandomProfiles(
  profiles: Profile[],
  no = 6
): Profile[] {
  return profiles.sort(() => Math.random() - 0.5).slice(0, no);
}
