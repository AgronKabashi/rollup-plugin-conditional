import assert from "assert";
import conditional from "../src";
import {rollup} from "rollup";
import * as samplePlugins from "./fixtures/samplePlugins";
import sinon from "sinon";

describe("rollup-plugin-conditional", () => {
  let plugins;
  let spies;

  const createRollup = (condition, config) => {
    return rollup({
      entry: "./test/fixtures/sourcecode",
      plugins: [
        conditional({
          condition,
          ...config
        })
      ]
    });
  };

  const calculateSpyCallCount = (spies) => spies.reduce((total, spy) => total + spy.callCount, 0)

  describe("conditional statement", () => {
    beforeEach(() => {
      plugins = [
        samplePlugins.simple(),
        samplePlugins.transform()
      ];

      spies = plugins.map(plugin => sinon.spy(plugin, "load"))
    });

    it("should run all the plugins if condition evaluates to true", () => {
      return createRollup(true, {plugins}).then(() => {
        assert(calculateSpyCallCount(spies) === plugins.length);
      });
    });

    it("should not run plugins if condition evaluates to false", () => {
      return createRollup(false).then(() => {
        assert(calculateSpyCallCount(spies) === 0);
      });
    });

    it("should not run any plugins if no plugins are supplied", () => {
      return createRollup(true).then(() => {
        assert(calculateSpyCallCount(spies) === 0);
      });
    });
  });

  describe("execution", () => {
    beforeEach(() => {
      plugins = [
        samplePlugins.transform("transform1"),
        samplePlugins.transform("transform2")
      ];
    });

    it("should only execute the first plugin", () => {
      return createRollup(true, {plugins}).then((args) => {
        assert(args.modules[0].code === "var transform1variable = true;")
      });
    })
  })
});