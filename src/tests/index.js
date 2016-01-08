/*
 * These tests use the shallow renderer, which is faster and doesn't require an emulated DOM
 */
const Unexpected = require('unexpected');
const UnexpectedReact = require('unexpected-react');

const React = require('react');

const expect = Unexpected.clone()
  .use(UnexpectedReact);

// This test is optional, but allows you to easily check that everything has been required in the correct order
describe('React', () => {
  it('should have been injected', () => {
    expect(React, 'to have been injected');
  });
});
