/*
 * These tests use the shallow renderer, which is faster and doesn't require an emulated DOM
 */

const Unexpected = require('unexpected');
const UnexpectedReact = require('unexpected-react');

var React = require('react');
var TestUtils = require('react-addons-test-utils');

const Card = require('../components/Card/').default;

const expect = Unexpected.clone()
    .use(UnexpectedReact);

// This test is optional, but allows you to easily check that everything has been required in the correct order
describe('React', () => {
    it('should have been injected', () => {
        expect(React, 'to have been injected');
    });
});

describe('Card', () => {
    let renderer;

    beforeEach(() => {
        renderer = TestUtils.createRenderer();
        renderer.render(<Card name="king-of-hearts" />);
    });

    it('should be a function', () => {
      expect(Card, 'to be a', 'function');
    });

    it('renders a king of hearts', () => {
        return expect(renderer, 'to have rendered', <div id={'king-of-hearts'} />);
    });
});
