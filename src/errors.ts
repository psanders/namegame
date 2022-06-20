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

/**
 * This error is thrown if the game session is not found.
 */
export default class GameNotFoundException extends Error {
  status: number;
  /**
   * Creates a new GameNotFoundException instance.
   *
   * @param {string} sessionId - The unique session identifier.
   */
  constructor(sessionId: string) {
    super(`Game session ${sessionId} not found`);
    this.status = 404;
  }
}
