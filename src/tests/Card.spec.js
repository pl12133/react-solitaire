/* eslint-disable no-unused-vars*/
const React = require('react');
/* eslint-enable no-unused-vars*/
const Unexpected = require('unexpected');
const UnexpectedReact = require('unexpected-react');
const TestUtils = require('react-addons-test-utils');
const expect = Unexpected.clone()
  .use(UnexpectedReact);

const Card = require('../components/Card/').default;

describe('Card', () => {
  let renderer;

  beforeEach(() => {
    renderer = TestUtils.createRenderer();
    renderer.render(
      <Card
        name={"king-of-hearts"}
        offsetLeft={25}
        offsetTop={35}
        offsetWidth={50}
        offsetHeight={80}
        handleBeginDragDrop={function () {} }
        flipped={false}
      />
    );
  });

  it('should be a function', () => {
    expect(Card, 'to be a', 'function');
  });
  it('should render a ReactElement', () => {
    let result = renderer.getRenderOutput();
    return expect(TestUtils.isElement(result), 'to be ok');
  });

  it('should be positioned with inline style', () => {
    return expect(renderer, 'to have rendered',
      <div
        style={ {
          zIndex: '10',
          position: 'absolute',
          left: '25px',
          top: '35px',
          width: '50px',
          height: '80px'
        } }
      />
    );
  });
  it('should render a king of hearts', () => {
    return expect(renderer, 'to have rendered', <div id={'king-of-hearts'} />);
  });
});
