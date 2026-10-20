import { suite, test, expect, vi, afterEach } from 'vitest';
import { transpileStrandsToJS } from '../../../src/strands/strands_transpiler.js';

suite('p5.strands transpiler errors', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('a non-function source throws without dumping to the console', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => transpileStrandsToJS({}, '(1 + 2)', false, {}, undefined))
      .toThrow(/Could not parse p5\.strands function! Expected a function/);
    expect(log).not.toHaveBeenCalled();
    expect(err).not.toHaveBeenCalled();
  });
  test('a body that does not compile keeps the cause and logs nothing', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    let thrown;
    try {
      transpileStrandsToJS({}, '(() => { return 1; })', false, { 'not-an-identifier': 1 }, undefined);
    } catch (e) { thrown = e; }
    expect(thrown.message).toMatch(/^Error transpiling p5\.strands callback! /);
    expect(thrown.cause).toBeInstanceOf(SyntaxError);
    expect(log).not.toHaveBeenCalled();
    expect(err).not.toHaveBeenCalled();
  });
});
