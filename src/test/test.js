import {should, expect, assert} from 'chai';
import reactribute from '../index.js';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import TestUtils from 'react-addons-test-utils';
import {jsdom} from 'jsdom';

global.window = jsdom().defaultView;
global.document = global.window.document;

describe('reactribute', () => {
	it('should enhance React.Component class instances with string attribute matcher', () => {

		const decorator = reactribute([{
			matcher: 'testAttribute',
			fn({type, props, children}) {
				return {children: 'wat'};
			}
		}]);

		const TestComponent = decorator(class extends React.Component {
			render() {
				return <div testAttribute={true} />;
			}
		});

		const instance = TestUtils.renderIntoDocument(<TestComponent/>);

		const node = ReactDOM.findDOMNode(instance);
		expect(node.innerHTML).to.equal('wat');
		expect(node.tagName).to.equal('DIV');

	});

	it('should enhance React.Component class instances with string attribute matcher', () => {

	const decorator = reactribute([{
		matcher: 'style',
		fn({type, props, children}) {
			return {props: {style: Object.assign({}, ...props.style)}};
		}
	}]);

	const TestComponent = decorator(class extends React.Component {
		render() {
			return <div style={[{color: 'red'}, {color: 'blue'}]} />;
		}
	});

	const instance = TestUtils.renderIntoDocument(<TestComponent/>);

	const node = ReactDOM.findDOMNode(instance);

	expect(node.style.color).to.equal('blue');
	expect(node.tagName).to.equal('DIV');

	});

	it('should enhance React.Component class instances with string key matcher', () => {

	const decorator = reactribute([{
		matcher: 'test',
		fn({type, props, children}) {
			return {props: {style: Object.assign({}, ...props.style)}};
		}
	}]);

	const TestComponent = decorator(class extends React.Component {
		render() {
			return <div key="test" style={[{color: 'red'}, {color: 'blue'}]} />;
		}
	});

	const instance = TestUtils.renderIntoDocument(<TestComponent/>);

	const node = ReactDOM.findDOMNode(instance);

	expect(node.style.color).to.equal('blue');
	expect(node.tagName).to.equal('DIV');

	});

	it('should not change the element if false or undefined is returned', () => {

		const decorator = reactribute([{
			matcher: 'div',
			fn({type, props, children}) {
				return false;
			}
		}]);

		const TestComponent = decorator(class extends React.Component {
			render() {
				return <div/>;
			}
		});

		const instance = TestUtils.renderIntoDocument(<TestComponent/>);

		const node = ReactDOM.findDOMNode(instance);

		expect(node.tagName).to.equal('DIV');

	});

	it('should not render the element if null is returned', () => {

		const decorator = reactribute([{
			matcher: 'div',
			fn({type, props, children}) {
				return null;
			}
		}]);

		const TestComponent = decorator(class extends React.Component {
			render() {
				return <div/>;
			}
		});

		const instance = TestUtils.renderIntoDocument(<TestComponent/>);
		const node = ReactDOM.findDOMNode(instance);
		expect(node).to.be.null;

	});

	it('should change the type of the instance', () => {

const decorator = reactribute([{
	matcher: 'div',
	fn({type, props, children}) {
		return {type: 'span'};
	}
}]);

		const TestComponent = decorator(class extends React.Component {
			render() {
				return <div/>;
			}
		});

		const instance = TestUtils.renderIntoDocument(<TestComponent/>);
		const node = ReactDOM.findDOMNode(instance);
		expect(node.tagName).to.equal('SPAN');

	});

	it('should change the children of the instance via the children property', () => {

		const decorator = reactribute([{
			matcher: 'div',
			fn({type, props, children}) {
				return {children: 'wat'};
			}
		}]);

		const TestComponent = decorator(class extends React.Component {
			render() {
				return <div/>;
			}
		});

		const instance = TestUtils.renderIntoDocument(<TestComponent/>);
		const node = ReactDOM.findDOMNode(instance);
		expect(node.tagName).to.equal('DIV');
		expect(node.innerHTML).to.equal('wat');

	});

	it('should change the children of the instance via the props property', () => {

		const decorator = reactribute([{
			matcher: 'div',
			fn({type, props, children}) {
				return {props: {children: 'wat'}};
			}
		}]);

		const TestComponent = decorator(class extends React.Component {
			render() {
				return <div/>;
			}
		});

		const instance = TestUtils.renderIntoDocument(<TestComponent/>);
		const node = ReactDOM.findDOMNode(instance);
		expect(node.tagName).to.equal('DIV');
		expect(node.innerHTML).to.equal('wat');

	});

	it('should be composable with itself', () => {
		const decorator = reactribute([{
			matcher: 'div',
			fn({type, props, children}) {
				return {props: {children: 'wat'}};
			}
		}]);

		// note: settings {props: {children: 'wat'}} won't work because the previous decorator set the `children` prop (not inside `props`) which takes precedence
		const anotherDecorator = reactribute([{
			matcher: 'div',
			fn({type, props, children}) {
				return {children: 'lol'};
			}
		}]);

		const TestComponent = anotherDecorator(decorator(class extends React.Component {
			render() {
				return <div/>;
			}
		}));

		const instance = TestUtils.renderIntoDocument(<TestComponent/>);
		const node = ReactDOM.findDOMNode(instance);
		expect(node.tagName).to.equal('DIV');
		expect(node.innerHTML).to.equal('lol');

	});

	it('should be composable with itself and keep keys', () => {
		const decorator = reactribute([{
			matcher: 'wat',
			fn({type, props, children}) {
				return {props: {children: 'wat'}};
			}
		}]);

		// note: settings {props: {children: 'wat'}} won't work because the previous decorator set the `children` prop (not inside `props`) which takes precedence
		const anotherDecorator = reactribute([{
			matcher: 'wat',
			fn({type, props, children}) {
				return {children: 'lol'};
			}
		}]);

		const TestComponent = anotherDecorator(decorator(class extends React.Component {
			render() {
				return <div key="wat"/>;
			}
		}));

		const instance = TestUtils.renderIntoDocument(<TestComponent/>);
		const node = ReactDOM.findDOMNode(instance);
		expect(node.tagName).to.equal('DIV');
		expect(node.innerHTML).to.equal('lol');
	});


	it('should work with refs', () => {
		const decorator = reactribute([{
			matcher: 'div',
			fn({type, props, children}) {
				return {props: {children: 'wat'}};
			}
		}]);

		const TestComponent = decorator(class extends React.Component {
			render() {
				return <div ref="wat"/>;
			}
		});

		const instance = TestUtils.renderIntoDocument(<TestComponent/>);
		const node = ReactDOM.findDOMNode(instance);
		expect(node.tagName).to.equal('DIV');
		expect(instance.refs).to.have.all.keys('wat');
		expect(instance.refs.wat).to.equal(node);

	});

	it('should apply multiple attributes', () => {
		const decorator = reactribute([{
			matcher: 'div',
			fn({type, props, children}) {
				return {props: {children: 'wat'}};
			}
		}, {
			matcher: 'wat',
			fn({type, props, children}) {
				return {props: {style: {color: 'red'}}};
			}
		}]);

		const TestComponent = decorator(class extends React.Component {
			render() {
				return <div key="wat"/>;
			}
		});

		const instance = TestUtils.renderIntoDocument(<TestComponent/>);
		const node = ReactDOM.findDOMNode(instance);
		expect(node.tagName).to.equal('DIV');
		expect(node.innerHTML).to.equal('wat');
		expect(node.style.color).to.equal('red');

	});

	it('should apply multiple attributes to the same prop', () => {
		const decorator = reactribute([{
			matcher: 'div',
			fn({type, props, children}) {
				return {props: {className: 'wat'}};
			}
		}, {
			matcher: 'wat',
			fn({type, props, children}) {
				return {props: {className: props.className + ' lol'}};
			}
		}]);

		const TestComponent = decorator(class extends React.Component {
			render() {
				return <div key="wat"/>;
			}
		});

		const instance = TestUtils.renderIntoDocument(<TestComponent/>);
		const node = ReactDOM.findDOMNode(instance);
		expect(node.tagName).to.equal('DIV');
		expect(node.className).to.equal('wat lol');

	});

	it('should apply attributes deeply', () => {

		const decorator = reactribute([{
			matcher: 'div',
			fn({type, props, children}) {
				return {props: {children: 'wat'}};
			}
		}, {
			matcher: 'wat',
			fn({type, props, children}) {
				return {props: {style: {color: 'red'}}};
			}
		}], {deep: true});

		const TestComponent = decorator(class extends React.Component {
			render() {
				return <AnotherTestComponent/>;
			}
		});

		const AnotherTestComponent = class extends React.Component {
			render() {
				return <div key="wat"/>;
			}
		};

		const instance = TestUtils.renderIntoDocument(<TestComponent/>);
		const node = ReactDOM.findDOMNode(instance);
		expect(node.tagName).to.equal('DIV');
		expect(node.innerHTML).to.equal('wat');
		expect(node.style.color).to.equal('red');

	});


	// it('should apply attributes deeply to pure components', () => {

	// 	const decorator = reactribute([{
	// 		matcher: 'div',
	// 		fn({type, props, children}) {
	// 			return {props: {children: 'wat'}};
	// 		}
	// 	}, {
	// 		matcher: 'wat',
	// 		fn({type, props, children}) {
	// 			return {props: {style: {color: 'red'}}};
	// 		}
	// 	}], {deep: true});

	// 	const TestComponent = () => console.log('testcomponent')||<div key="wat"/>;
	// 	const AnotherTestComponent = decorator(() => <TestComponent/>);
	// 	const instance = ReactDOMServer.renderToString(<AnotherTestComponent/>);

	// });
});
