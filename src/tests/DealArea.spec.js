/* eslint-disable no-unused-vars*/
const React = require('react');
/* eslint-enable no-unused-vars*/
const Unexpected = require('unexpected');
const UnexpectedReact = require('unexpected-react');
const TestUtils = require('react-addons-test-utils');
const expect = Unexpected.clone()
  .use(UnexpectedReact);

const DealArea = require('../components/DealArea/').default;

describe('DealArea', () => {
  let renderer;

  beforeEach(() => {
    renderer = TestUtils.createRenderer();
    renderer.render(
      <DealArea getAvailableMoves={ function () {} }
        moveCards={ function () {} }
        faceUp={[]}
        faceDown={[]}
      />
    );
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
    return expect(result.props.className, 'to be', undefined);
  });
});
