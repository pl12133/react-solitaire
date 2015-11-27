/*
 * These tests use the shallow renderer, which is faster and doesn't require an emulated DOM
 */

const Unexpected = require('unexpected');
const UnexpectedReact = require('unexpected-react');

var React = require('react');
var TestUtils = require('react-addons-test-utils');

const AceArea = require('../components/AceArea/').default;

const expect = Unexpected.clone()
  .use(UnexpectedReact);

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

  it('render a container with id aceArea', () => {
    return expect(renderer, 'to have rendered', <div id={'aceArea'} />);
  });

  it('should render its children', () => {
    let result = renderer.getRenderOutput();
    return expect(result.props.children, 'to have length', 4);
  });
});
