/* eslint-disable no-unused-vars*/
const React = require('react');
/* eslint-enable no-unused-vars*/
const Unexpected = require('unexpected');
const UnexpectedReact = require('unexpected-react');
const TestUtils = require('react-addons-test-utils');
const expect = Unexpected.clone()
  .use(UnexpectedReact);

const DroppableStack = require('../src/components/DroppableStack/').DroppableStack;
const Card = require('../src/components/Card/').Card;

function noop () {}

describe('DroppableStack', () => {
  let renderer;

  before(() => {
    // Ignore PropTypes warnings
    console.error = noop;
  });

  beforeEach(() => {
    renderer = TestUtils.createRenderer();
    renderer.render(
      <DroppableStack
        stackName={'ACE-1'}
        index={1}
        handleBeginDragDrop={noop}
        getAvailableMoves={noop}
        moveCards={noop}
        flipCard={noop}
        offsetWidth={100}
        offsetHeight={100}
        stackCardMapper={
          (card, index) => {
            return (
              <Card
                name={card.name}
                key={card.name}
                flipped={card.flipped}
                offsetLeft={0 * index}
                offsetHeight={15 * index}
                handleBeginDragDrop={noop}
              />
            );
          }
        }
        cards={ [
          { name: 'king-of-hearts', flipped: false, location: 'ACE-1' },
          { name: 'queen-of-hearts', flipped: false, location: 'ACE-1' }
        ] }
      />
    );
  });

  it('should be a function', () => {
    expect(DroppableStack, 'to be a', 'function');
  });

  it('should render a ReactElement', () => {
    let result = renderer.getRenderOutput();
    return expect(TestUtils.isElement(result), 'to be ok');
  });
  it('should render with its offsetWidth, and offsetHeight', () => {
    return expect(renderer, 'to have rendered',
        <div
          style={ {
            width: '100px',
            height: '100px'
          } }
        >
          <Card
            name={'king-of-hearts'}
            handleBeginDragDrop={noop}
          />
          <Card
            name={'queen-of-hearts'}
            handleBeginDragDrop={noop}
          />
        </div>
    );
  });

  it('should render its children', () => {
    let result = renderer.getRenderOutput();
    return expect(result.props.children, 'to have length', 2);
  });
  it('should have class droppable', () => {
    let result = renderer.getRenderOutput();
    return expect(result.props.className, 'to contain', 'droppable');
  });
});
