import assert from "assert";
import sinon from "sinon";
import conditional from "index";
import { createRollupWithConditional } from "./utilities";
import * as samplePlugins from "./fixtures/samplePlugins";

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
    await createRollupWithConditional(true, plugins);
    const spyCount = getSpyCallCount(spies);
    assert.equal(spyCount, plugins.length, `Only ${spyCount} plugins were called, expected ${plugins.length}`);
  });

  it("should not run plugins if condition evaluates to false", async () => {
    await createRollupWithConditional(false);
    assert.equal(getSpyCallCount(spies), 0);
  });

  it("should not run any plugins if no plugins are supplied", async () => {
    await createRollupWithConditional(true);
    assert.equal(getSpyCallCount(spies), 0);
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
        },
        conditional(true, [
          {
            load: spy
          }
        ])
      ])
    ];

    await createRollupWithConditional(true, plugins);
    assert(spy.calledThrice);
  });

  it("accepts a function that returns an array of plugins for deferred execution", async () => {
    await createRollupWithConditional(true, () => plugins);
    assert.equal(getSpyCallCount(spies), plugins.length);
  });

  it("should be able to accept a function that returns a list of plugins to avoid side effects", async () => {
    const sideEffectSpy = sinon.spy();
    const pluginLoadSpy = sinon.spy();
    const pluginSpy = sinon.spy(() => {
      sideEffectSpy();

      return {
        load: pluginLoadSpy
      };
    });

    const pluginsWithSideEffects = [
      pluginSpy()
    ];

    await createRollupWithConditional(false, pluginsWithSideEffects);
    assert.equal(sideEffectSpy.callCount, 1);
    assert.equal(pluginLoadSpy.callCount, 0);
    assert.equal(pluginSpy.callCount, 1);

    sideEffectSpy.resetHistory();
    pluginLoadSpy.resetHistory();
    pluginSpy.resetHistory();

    const pluginsWithSideEffectsProtected = () => [
      pluginSpy()
    ];

    await createRollupWithConditional(false, pluginsWithSideEffectsProtected);

    assert.equal(sideEffectSpy.callCount, 0);
    assert.equal(pluginLoadSpy.callCount, 0);
    assert.equal(pluginSpy.callCount, 0);
  });
});
