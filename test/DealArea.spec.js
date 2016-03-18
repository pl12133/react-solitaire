/* eslint-disable no-unused-vars*/
const React = require('react');
/* eslint-enable no-unused-vars*/
const Unexpected = require('unexpected');
const UnexpectedReact = require('unexpected-react');
const TestUtils = require('react-addons-test-utils');
const expect = Unexpected.clone()
  .use(UnexpectedReact);

const DealArea = require('../src/components/DealArea/').DealArea;
const Card = require('../src/components/Card/').Card;
import cardZones from '../src/constants/cardZones';

function noop () {}

describe('DealArea', () => {
  let renderer;

  before(() => {
    // Ignore PropTypes warnings
    console.error = noop;
  });

  beforeEach(() => {
    renderer = TestUtils.createRenderer();
    renderer.render(
      <DealArea
        getAvailableMoves={noop}
        moveCards={noop}
        faceUp={[
          { name: 'king-of-hearts', location: cardZones.dealArea.faceUp, flipped: false }
        ]}
        faceDown={[
          { name: 'queen-of-hearts', location: cardZones.dealArea.faceDown, flipped: true }
        ]}
        faceUpCardMap={
          (card, index) => {
            return (
              <Card
                name={card.name}
                key={card.name}
                flipped={card.flipped}
                offsetLeft={0 * index}
                offsetHeight={15 * index}
              />
            );
          }
        }
        faceDownCardMap={
          (card, index) => {
            return (
              <Card
                name={card.name}
                key={card.name}
                flipped={card.flipped}
                offsetLeft={0 * index}
                offsetHeight={15 * index}
              />
            );
          }
        }
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
