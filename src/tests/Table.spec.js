/* eslint-disable no-unused-vars*/
const React = require('react');
/* eslint-enable no-unused-vars*/
const Unexpected = require('unexpected');
const UnexpectedReact = require('unexpected-react');
const TestUtils = require('react-addons-test-utils');
const expect = Unexpected.clone()
  .use(UnexpectedReact);

const Table = require('../components/Table/').default;
const LoadSpinner = require('../components/LoadSpinner/').default;

const deck = (function () {
  let memo = [];
  let initDeck = () => {
    if (memo.length) {
      return memo;
    }

    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['two', 'three', 'four', 'five', 'six', 'seven',
                  'eight', 'nine', 'ten', 'jack', 'queen', 'king', 'ace'];
    suits.forEach((suit) => {
      values.forEach((value) => {
        let str = value + '-of-' + suit;
        memo.push({name: str, location: 'TABLE', flipped: true});
      });
    });
    return memo;
  };
  return initDeck();
})();
describe('Table', () => {
  let renderer;

  beforeEach(() => {
    renderer = TestUtils.createRenderer();
    renderer.render(
      <Table
        dragdrop={ {isDragging: false} }
        cards={ deck }
        undoMove={function () {}}
        redoMove={function () {}}
        beginDrag={function () {}}
        endDrag={function () {}}
        flipCard={function () {}}
        shuffleCards={function () {}}
        moveCards={function () {}}
      />
    );
  });

  it('should be a function', () => {
    return expect(Table, 'to be a', 'function');
  });
  it('should render a ReactElement', () => {
    let result = renderer.getRenderOutput();
    return expect(TestUtils.isElement(result), 'to be ok');
  });
  it('should render with id "table"', () => {
    return expect(renderer, 'to have rendered',
      <div id="table" />
    );
  });
  it('should render a loading spinner', () => {
    return expect(renderer, 'to have rendered',
      <div>
        <LoadSpinner />
      </div>
    );
  });
});
