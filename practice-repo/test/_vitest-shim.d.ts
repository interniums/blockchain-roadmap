/**
 * TEMPORARY SCAFFOLD — delete this file once `practice-repo` has its own package.json
 * with `vitest` installed as a devDependency.
 *
 * Why it exists: the starter tests import from 'vitest' because that is what the
 * acceptance commands run (`npx vitest run test/compact-encoding.test.ts`). This repo
 * does not have a package.json yet, so `vitest` cannot be resolved and every test file
 * would fail to typecheck. This ambient declaration provides just enough of the vitest
 * surface for the starter tests to typecheck before you install anything.
 *
 * It is NOT a test runner. It declares types only. Nothing here runs your tests.
 *
 * FIRST THING TO DO IN THIS REPO:
 *   1. add a package.json with vitest as a devDependency
 *   2. npm install
 *   3. delete this file (leaving it will shadow vitest's real, much better types)
 */
declare module 'vitest' {
  interface Assertion {
    toBe(expected: unknown): void;
    toEqual(expected: unknown): void;
    toStrictEqual(expected: unknown): void;
    toBeCloseTo(expected: number, precision?: number): void;
    toBeGreaterThan(expected: number | bigint): void;
    toBeGreaterThanOrEqual(expected: number | bigint): void;
    toBeLessThan(expected: number | bigint): void;
    toBeLessThanOrEqual(expected: number | bigint): void;
    toBeTruthy(): void;
    toBeFalsy(): void;
    toBeNull(): void;
    toBeDefined(): void;
    toBeUndefined(): void;
    toBeInstanceOf(expected: unknown): void;
    toContain(expected: unknown): void;
    toHaveLength(expected: number): void;
    toHaveProperty(key: string, value?: unknown): void;
    toMatch(expected: string | RegExp): void;
    toThrow(expected?: string | RegExp | Function): void;
    readonly not: Assertion;
  }

  export function describe(name: string, fn: () => void): void;
  export function it(name: string, fn: () => void | Promise<void>): void;
  export function test(name: string, fn: () => void | Promise<void>): void;
  export function expect(actual: unknown): Assertion;
  export function beforeAll(fn: () => void | Promise<void>): void;
  export function afterAll(fn: () => void | Promise<void>): void;
  export function beforeEach(fn: () => void | Promise<void>): void;
  export function afterEach(fn: () => void | Promise<void>): void;
}
