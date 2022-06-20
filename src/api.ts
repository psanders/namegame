/*
 * Copyright (C) 2022 by Pedro Sanders
 *
 * This file is part of Name Game Application.
 *
 * Licensed under the MIT License (the "License")
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
import GameNotFoundException from "./errors"
import {
  Profile,
  GameMode,
  GameSession,
  Hand,
  HandResult,
  RedisClient
} from "./types"

/**
 * A closure for the createGameSession function.
 *
 * @param {RediscLient} redis - The instance of Redis client.
 * @return {Function} - The enclosed createGameSession function.
 */
export function createGameSession(redis: RedisClient) {
  /**
   * Creates a state for the game session in Redis store.
   *
   * @param {GameMode} mode - The mode of the game. Defaults to `PRACTICE`.
   * @param {number} expire - Time in seconds until the session expires. Defaults to 3600.
   * @return {GameSession} - getGameSession
   */
  return async (
    mode: GameMode = GameMode.PRACTICE,
    expire = 3600
  ): Promise<GameSession> => {
    const session = {
      // TODO: Generate a more developer friendly session id
      sessionId: Math.random().toString(),
      mode,
      turn: 0,
      expire
    }

    await redis.set(session.sessionId, JSON.stringify(session))
    await redis.expire(session.sessionId, expire)

    return session
  }
}

/**
 * A closure for the getGameSession function.
 *
 * @param {RediscLient} redis - The instance of Redis client.
 * @return {Function} - The enclosed getGameSession function.
 */
export function getGameSession(redis: RedisClient) {
  /**
   * Gets a session from the Redis store.
   *
   * @param {string} sessionId - The session id.
   */
  return async (sessionId: string): Promise<GameSession> => {
    const session = await redis.get(sessionId)
    if (!session) {
      throw new GameNotFoundException(sessionId)
    }
    return JSON.parse(session)
  }
}

/**
 * A closure for the createNewHand function.
 *
 * @param {RediscLient} redis - The instance of Redis client.
 * @param {Function} getProfiles - A function that returns a list of profiles.
 * @return {Function} - The enclosed createNewHand function.
 */
export function createNewHand(
  redis: RedisClient,
  getProfiles: () => Promise<Profile[]>
) {
  /**
   * Creates a new hand within the game session.
   *
   * @param {string} sessionId - The game session.
   * @return {Hand} - The new hand.
   * @throws {GameNotFoundException} - If the session is not found.
   */
  return async (sessionId: string): Promise<Hand> => {
    const session = await getGameSession(redis)(sessionId)
    const profiles = await getProfiles()

    const currentProfile = profiles[0]

    const hand = {
      name: `${currentProfile.firstName} ${currentProfile.lastName}`,
      // Only return a the summary employee profile
      profiles: profiles.map((e) => {
        return {
          id: e.id,
          headshot: e.headshot
        }
      })
    }

    const updatedSession = { ...session }
    updatedSession.currentProfileId = currentProfile.id

    // Updates the session + extends the session expiration time
    await redis.set(sessionId, JSON.stringify(updatedSession))
    await redis.expire(sessionId, session.expire)

    return hand
  }
}

/**
 * A closure for the playHand function.
 *
 * @param {RediscLient} redis - The instance of Redis client.
 * @return {Function} - The enclosed playHand function.
 */
export function playHand(redis: RedisClient) {
  /**
   * Plays a hand within the game session.
   *
   * @param {string} sessionId - The game session.
   * @param {string} profileId - The profile id.
   */
  return async (sessionId: string, profileId: string): Promise<HandResult> => {
    const session = await getGameSession(redis)(sessionId)

    const updatedSession = { ...session }
    updatedSession.turn++
    updatedSession.currentProfileId = undefined

    // Updates the session + extends the session expiration time
    redis.set(sessionId, JSON.stringify(updatedSession))
    redis.expire(sessionId, session.expire)

    return {
      won: session.currentProfileId === profileId,
      turn: session.turn + 1
    }
  }
}
