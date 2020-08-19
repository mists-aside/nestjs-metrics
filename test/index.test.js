import { expect } from "chai";

import { hello } from "../src";

describe("hello", function () {
  it('hello("World") to return "Hello World!"', function () {
    expect(hello("World")).to.equal("Hello World!");
  });
});
