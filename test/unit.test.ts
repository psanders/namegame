/*
 * Copyright (C) 2022 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster
 *
 * This file is part of nodejs-service
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
import chai from "chai"
import sinon from "sinon"
import sinonChai from "sinon-chai"
import chaiAsPromised from "chai-as-promised"
import { GameMode, Profile } from "../src/types"
import getRandomProfiles from "../src/utils"
import {
  createNewHand,
  createGameSession,
  getGameSession,
  playHand
} from "../src/api"

const expect = chai.expect
chai.use(sinonChai)
chai.use(chaiAsPromised)
const sandbox = sinon.createSandbox()

// eslint-disable-next-line @typescript-eslint/no-var-requires
const profiles = require(process.cwd() +
  "/test/mock_profiles.json") as Profile[]

describe("name game test plan", () => {
  afterEach(() => sandbox.restore())

  it("gets random list of profiles", async () => {
    const result1 = getRandomProfiles(profiles, 6)
    const result2 = getRandomProfiles(profiles, 6)
    expect(result1).to.have.lengthOf(6)
    expect(result2).to.have.lengthOf(6)
    expect(result1[0])
      .to.have.property("firstName")
      .not.be.equal(result2[0].firstName)
  })

  it("it creates a new session for the given game mode", async () => {
    const redis = {
      get: () => Promise.resolve(""),
      set: () => Promise.resolve(),
      expire: () => Promise.resolve()
    }
    const spyOnSet = sandbox.spy(redis, "set")
    const spyOnExpire = sandbox.spy(redis, "expire")
    const session = await createGameSession(redis)(GameMode.PRACTICE, 3600)
    expect(session.mode).to.equal(GameMode.PRACTICE)
    expect(session.expire).to.equal(3600)
    expect(session.sessionId).to.be.a("string")
    expect(session.currentProfileId).to.be.undefined
    expect(session.turn).to.equal(0)
    expect(spyOnSet).to.have.been.calledWith(
      session.sessionId,
      JSON.stringify(session)
    )
    expect(spyOnExpire).to.have.been.calledWith(session.sessionId, 3600)
  })

  describe("getGameSession", () => {
    it("it throws GameNotFoundException", async () => {
      const redis = {
        get: () => Promise.resolve(""),
        set: () => Promise.resolve(),
        expire: () => Promise.resolve()
      }
      const spyOnGet = sandbox.spy(redis, "get")
      await expect(
        getGameSession(redis)("8cfmu1ol4nfw31r")
      ).to.eventually.be.rejectedWith("Game session 8cfmu1ol4nfw31r not found")
      expect(spyOnGet).to.have.been.calledOnce
    })

    it("gets the session by sessionId", async () => {
      const redis = {
        get: () =>
          Promise.resolve(
            JSON.stringify({
              sessionId: "8cfmu1ol4nfw31r",
              mode: GameMode.PRACTICE,
              currentEmployeeId: undefined,
              turn: 1,
              expire: 3600
            })
          ),
        set: () => Promise.resolve(),
        expire: () => Promise.resolve()
      }
      const spyOnGet = sandbox.spy(redis, "get")
      const session = await getGameSession(redis)("8cfmu1ol4nfw31r")

      expect(spyOnGet).to.have.been.calledOnce
      expect(session).to.have.property("sessionId").to.equal("8cfmu1ol4nfw31r")
      expect(session).to.have.property("mode").to.equal(GameMode.PRACTICE)
      expect(session).not.to.have.property("currentEmployeeId")
      expect(session).to.have.property("turn").to.equal(1)
      expect(session).to.have.property("expire").to.equal(3600)
    })
  })

  describe("createNewHand", () => {
    it("it throws GameNotFoundException", async () => {
      const redis = {
        get: () => Promise.resolve(""),
        set: () => Promise.resolve(),
        expire: () => Promise.resolve()
      }
      const spyOnGet = sandbox.spy(redis, "get")
      const func = () => Promise.resolve(null)
      await expect(
        createNewHand(redis, func)("8cfmu1ol4nfw31r")
      ).to.eventually.be.rejectedWith("Game session 8cfmu1ol4nfw31r not found")
      expect(spyOnGet).to.have.been.calledOnce
    })

    it("creates a new hand", async () => {
      const redis = {
        get: () =>
          Promise.resolve(
            JSON.stringify({
              sessionId: "8cfmu1ol4nfw31r",
              mode: GameMode.PRACTICE,
              currentEmployeeId: undefined,
              turn: 1,
              expire: 3600
            })
          ),
        set: () => Promise.resolve(),
        expire: () => Promise.resolve()
      }
      const spyOnSet = sandbox.spy(redis, "set")
      const spyOnExpire = sandbox.spy(redis, "expire")
      const randomProfiles = sandbox
        .stub()
        .returns([
          profiles[0],
          profiles[1],
          profiles[2],
          profiles[3],
          profiles[4],
          profiles[5]
        ])

      const hand = await createNewHand(redis, randomProfiles)("8cfmu1ol4nfw31r")

      expect(hand)
        .to.have.property("name")
        .to.equal(`${profiles[0].firstName} ${profiles[0].lastName}`)
      expect(hand).to.have.property("profiles").to.have.lengthOf(6)
      expect(spyOnSet).to.have.been.calledOnce
      expect(spyOnExpire).to.have.been.calledOnce
    })
  })

  describe("playHand", () => {
    it("it throws GameNotFoundException", async () => {
      const redis = {
        get: () => Promise.resolve(""),
        set: () => Promise.resolve(),
        expire: () => Promise.resolve()
      }
      const spyOnGet = sandbox.spy(redis, "get")
      await expect(
        playHand(redis)("8cfmu1ol4nfw31r", "4NCJTL13UkK0qEIAAcg4IQ")
      ).to.eventually.be.rejectedWith("Game session 8cfmu1ol4nfw31r not found")
      expect(spyOnGet).to.have.been.calledOnce
    })

    it("plays the hand and return the result", async () => {
      const redis = {
        get: () =>
          Promise.resolve(
            JSON.stringify({
              sessionId: "8cfmu1ol4nfw31r",
              mode: GameMode.PRACTICE,
              currentProfileId: "4NCJTL13UkK0qEIAAcg4IQ",
              turn: 1,
              expire: 3600
            })
          ),
        set: () => Promise.resolve(),
        expire: () => Promise.resolve()
      }
      const spyOnSet = sandbox.spy(redis, "set")
      const spyOnExpire = sandbox.spy(redis, "expire")

      const handResult = await playHand(redis)(
        "8cfmu1ol4nfw31r",
        "4NCJTL13UkK0qEIAAcg4IQ"
      )

      expect(handResult).to.have.property("won").to.be.equal(true)
      expect(handResult).to.have.property("turn").to.be.equal(2)
      expect(spyOnSet).to.have.been.calledOnce
      expect(spyOnExpire).to.have.been.calledOnce
    })
  })
})
