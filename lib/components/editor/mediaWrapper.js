'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftJs = require('draft-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MediaWrapper = function (_Component) {
	_inherits(MediaWrapper, _Component);

	function MediaWrapper() {
		_classCallCheck(this, MediaWrapper);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(MediaWrapper).apply(this, arguments));
	}

	_createClass(MediaWrapper, [{
		key: 'render',
		value: function render() {
			var _props = this.props;
			var block = _props.block;
			var foo = _props.foo;

			var data = _draftJs.Entity.get(block.getEntityAt(0)).getData();
			// Pass data down to the child component
			console.log(data);
			var child = _react2.default.cloneElement(this.props.blockProps.child, Object.assign({}, data));

			return child;
		}
	}]);

	return MediaWrapper;
}(_react.Component);

exports.default = MediaWrapper;