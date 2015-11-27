/*
 * These tests use the shallow renderer, which is faster and doesn't require an emulated DOM
 */

const Unexpected = require('unexpected');
const UnexpectedReact = require('unexpected-react');

var React = require('react');
var TestUtils = require('react-addons-test-utils');

const DealArea = require('../components/DealArea/').default;

const expect = Unexpected.clone()
  .use(UnexpectedReact);

// This test is optional, but allows you to easily check that everything has been required in the correct order
describe('React', () => {
  it('should have been injected', () => {
    expect(React, 'to have been injected');
  });
});

describe('DealArea', () => {
  let renderer;

  beforeEach(() => {
    renderer = TestUtils.createRenderer();
    renderer.render(<DealArea getAvailableMoves={ function () {} }
                              moveCards={ function () {} }
                              faceUp={[]}
                              faceDown={[]} />);
  });

  it('should be a function', () => {
    return expect(DealArea, 'to be a', 'function');
  });
  it('should render a left and right container', () => {
    return expect(renderer, 'to have rendered',
      <div>
        <span id={'left'} />
        <span id={'right'} />
      </div>
    );
  });
  it('should have imported styles', () => {
    let result = renderer.getRenderOutput();
    return expect(result.props.className, 'to be', void 0);
  });
});
