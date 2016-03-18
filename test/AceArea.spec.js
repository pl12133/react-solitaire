/* eslint-disable no-unused-vars*/
const React = require('react');
/* eslint-enable no-unused-vars*/
const Unexpected = require('unexpected');
const UnexpectedReact = require('unexpected-react');
const TestUtils = require('react-addons-test-utils');
const expect = Unexpected.clone()
  .use(UnexpectedReact);

const AceArea = require('../src/components/AceArea/').default;

describe('AceArea', () => {
  let renderer;

  beforeEach(() => {
    renderer = TestUtils.createRenderer();
    renderer.render(
      <AceArea>
        <div />
        <div />
        <div />
        <div />
      </AceArea>
    );
  });

  it('should be a function', () => {
    return expect(AceArea, 'to be a', 'function');
  });
  it('should render a ReactElement', () => {
    let result = renderer.getRenderOutput();
    return expect(TestUtils.isElement(result), 'to be ok');
  });

  it('should render a container with id aceArea', () => {
    return expect(renderer, 'to have rendered', <div id={'aceArea'} />);
  });

  it('should render its children', () => {
    let result = renderer.getRenderOutput();
    return expect(result.props.children, 'to have length', 4);
  });
});
