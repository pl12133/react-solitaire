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

describe('Card', () => {
  let renderer;

  beforeEach(() => {
    renderer = TestUtils.createRenderer();
    renderer.render(<Card name={"king-of-hearts"}
                          offsetWidth={50}
                          offsetHeight={80}
                          handleBeginDragDrop={function () {} }
                          isDragging={false}
                          flipped={false} />);
  });

  it('should be a function', () => {
    expect(Card, 'to be a', 'function');
  });
  it('should render a ReactElement', () => {
    let result = renderer.getRenderOutput();
    return expect(TestUtils.isElement(result), 'to be ok');
  });

  it('renders a king of hearts', () => {
    return expect(renderer, 'to have rendered', <div id={'king-of-hearts'} />);
  });
});
