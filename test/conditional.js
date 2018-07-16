import assert from "assert";
import * as samplePlugins from "./fixtures/samplePlugins";
import sinon from "sinon";
import { createRollup } from "./utilities/createRollupConfig";
import conditional from "../src/conditional";

let plugins;
let spies;

const getSpyCallCount = spies => spies.reduce((total, spy) => total + spy.callCount, 0);

describe("conditional", () => {
  beforeEach(() => {
    plugins = [
      samplePlugins.simple(),
      samplePlugins.transform()
    ];

    spies = plugins.map(plugin => sinon.spy(plugin, "load"));
  });

  it("should run all the plugins if condition evaluates to true", async () => {
    await createRollup(true, plugins);
    const spyCount = getSpyCallCount(spies);
    assert(spyCount === plugins.length, `Only ${spyCount} plugins were called, expected ${plugins.length}`);
  });

  it("should not run plugins if condition evaluates to false", async () => {
    await createRollup(false);
    assert(getSpyCallCount(spies) === 0);
  });

  it("should not run any plugins if no plugins are supplied", async () => {
    await createRollup(true);
    assert(getSpyCallCount(spies) === 0);
  });

  it("should be able to nest conditionals", async () => {
    const spy = sinon.spy();
    const plugins = [
      {
        load: spy
      },
      conditional(true, [
        {
          load: spy
        }
      ])
    ];

    await createRollup(true, plugins);
    assert(spy.calledTwice);
  });
});
