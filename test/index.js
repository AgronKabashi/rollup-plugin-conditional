import assert from "assert";
import conditional from "../src";
import {rollup} from "rollup";
import samplePlugin from "./fixtures/samplePlugin";
import sinon from "sinon";

describe("rollup-plugin-conditional", () => {
  let plugin;
  let spy;

  const createRollup = (condition, plugin) => {
    return rollup({
      entry: "./test/fixtures/sourcecode",
      plugins: [
        conditional({
          condition,
          plugin
        })
      ]
    });
  };

  beforeEach(() => {
    plugin = samplePlugin();
    spy = sinon.spy(plugin, "load");
  });

  it("should run a plugin if condition evaluates to true", (done) => {
    createRollup(true, plugin).then(() => {
      assert(spy.callCount === 1);
      done();
    });
  });

  it("should not run a plugin if condition evaluates to false", (done) => {
    createRollup(false).then(() => {
      assert(spy.callCount === 0);
      done();
    });
  });

  it("should not run a plugin if no plugin is supplied", (done) => {
    createRollup(true).then(() => {
      assert(spy.callCount === 0);
      done();
    });
  });
});