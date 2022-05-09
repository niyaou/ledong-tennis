import { jsxs, jsx } from 'react/jsx-runtime';
import React from 'react';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".Cascade-module_dropdown__3z27U {\n  display: inline-block;\n  position: relative;\n}\n\n.Cascade-module_dropdownOnHover__1UcqS:hover > .Cascade-module_dropdownMenu__19WmY {\n  animation: Cascade-module_fadeInShow__1OBww .3s;\n  display: block;\n}\n\n.Cascade-module_dropdownMenu__19WmY {\n  background-color: #fff;\n  box-shadow:\n    0 5px 5px -3px rgba(0, 0, 0, .2),\n    0 8px 10px 1px rgba(0, 0, 0, .14),\n    0 3px 14px 2px rgba(0, 0, 0, .12);\n  color: #000;\n  display: none;\n  font-family: Roboto, sans-serif;\n    -moz-osx-font-smoothing: grayscale;\n    -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  letter-spacing: .00937em;\n  line-height: 1.5rem;\n  list-style-type: none;\n  margin: 0;\n  min-width: 10rem;\n  padding: .25rem 0;\n  position: absolute;\n  text-decoration: inherit;\n  text-transform: inherit;\n  z-index: 30;\n}\n\n.Cascade-module_dropdownMenuItem__2z87N {\n  align-items: center;\n  cursor: pointer;\n  display: flex;\n  min-height: 2.5rem;\n  padding: .5rem 1.5rem;\n}\n\n.Cascade-module_dropdownMenuItem__2z87N > .Cascade-module_dropdownMenu__19WmY {\n  left: 100%;\n  min-height: 100%;\n  position: absolute;\n  top: 0;\n}\n\n.Cascade-module_dropdownMenuItem__2z87N:hover > .Cascade-module_dropdownMenu__19WmY {\n  animation: Cascade-module_fadeInShow__1OBww .3s;\n  display: block;\n}\n\n.Cascade-module_dropdownMenuItem__2z87N:hover:not(.Cascade-module_disabled__13a3K) {\n  background: rgba(0, 0, 0, .08);\n}\n\n.Cascade-module_disabled__13a3K {\n  color: #9e9e9e;\n  cursor: not-allowed;\n}\n\n.Cascade-module_show__38geh {\n  animation: Cascade-module_fadeInShow__1OBww .3s;\n  display: block;\n}\n\n.Cascade-module_withSubitem__3m2pc {\n  cursor: default;\n  display: flex;\n  justify-content: space-between;\n}\n\n.Cascade-module_withSubitem__3m2pc:after {\n  border: solid #000;\n  border-width: 0 1.5px 1.5px 0;\n  content: \"\";\n  display: inline-block;\n  margin-left: 1rem;\n  padding: 3px;\n  transform: rotate(-45deg);\n    -webkit-transform: rotate(-45deg);\n}\n\n@keyframes Cascade-module_fadeInShow__1OBww {\n  0% {\n    opacity: 0;\n    transform: scale(0)\n  }\n\n  100% {\n    opacity: 1;\n    transform: scale(1)\n  }\n}\n";
var styles = {"dropdown":"Cascade-module_dropdown__3z27U","dropdownOnHover":"Cascade-module_dropdownOnHover__1UcqS","dropdownMenu":"Cascade-module_dropdownMenu__19WmY","fadeInShow":"Cascade-module_fadeInShow__1OBww","dropdownMenuItem":"Cascade-module_dropdownMenuItem__2z87N","disabled":"Cascade-module_disabled__13a3K","show":"Cascade-module_show__38geh","withSubitem":"Cascade-module_withSubitem__3m2pc"};
styleInject(css_248z);

function classNames(classes) {
    return Object.entries(classes)
        .filter(function (_a) {
        var value = _a[1];
        return value;
    })
        .map(function (_a) {
        var key = _a[0];
        return key;
    })
        .join(' ');
}

var Cascade = (function (_super) {
    __extends(Cascade, _super);
    function Cascade() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dropdownRef = React.createRef();
        _this.getSelectedItems = function (items, selectedValue) {
            var fieldNames = _this.props.fieldNames;
            var selectedItems = [];
            var search = function (itemsz, ref) {
                if (ref === void 0) { ref = []; }
                itemsz.forEach(function (item) {
                    var _a, _b;
                    var _c = _this.normalizeItem(item), children = _c.children, label = _c.label, value = _c.value, restItem = __rest(_c, ["children", "label", "value"]);
                    if (value === selectedValue) {
                        selectedItems = __spreadArrays(ref, [__assign(__assign({}, restItem), (_a = {}, _a[fieldNames.value] = value, _a[fieldNames.label] = label, _a))]);
                    }
                    else if (Array.isArray(children) && children.length >= 1) {
                        search(children, __spreadArrays(ref, [__assign(__assign({}, restItem), (_b = {}, _b[fieldNames.value] = value, _b[fieldNames.label] = label, _b))]));
                    }
                });
            };
            search(items);
            return selectedItems;
        };
        _this.getValue = function () {
            var _a = _this.props, fieldNames = _a.fieldNames, items = _a.items, separatorIcon = _a.separatorIcon, value = _a.value;
            if (value) {
                var selectedItems = _this.getSelectedItems(items, value);
                return selectedItems
                    .map(function (item) { return item[fieldNames.label]; })
                    .join(separatorIcon);
            }
            return undefined;
        };
        _this.handleClick = function () {
            document.getElementsByClassName(styles.dropdownMenu)[0].classList.add(styles.show);
            document.addEventListener('click', _this.onClickOutside);
        };
        _this.handleSelect = function (item) {
            var _a = _this.props, fieldNames = _a.fieldNames, items = _a.items, onSelect = _a.onSelect;
            if (!onSelect || item.disabled)
                return;
            var selectedItems = _this.getSelectedItems(items, item[fieldNames.value]);
            onSelect(selectedItems.slice(-1)[0][fieldNames.value], selectedItems);
            _this.hideDropdownMenu();
        };
        _this.hideDropdownMenu = function () {
            document.getElementsByClassName(styles.dropdownMenu)[0].classList.remove(styles.show);
        };
        _this.normalizeItem = function (item) {
            var _a;
            var fieldNames = _this.props.fieldNames;
            var valueKey = fieldNames.value, labelKey = fieldNames.label, childrenKey = fieldNames.children;
            return __assign({}, Object.assign({}, item, (_a = {},
                _a[valueKey] = undefined,
                _a[labelKey] = undefined,
                _a[childrenKey] = undefined,
                _a.value = item[valueKey],
                _a.label = item[labelKey],
                _a.children = item[childrenKey],
                _a)));
        };
        _this.onClickOutside = function (e) {
            if (!_this.dropdownRef.current.contains(e.target)) {
                _this.hideDropdownMenu();
            }
        };
        _this.renderItems = function (items) {
            var _a;
            var _b = _this.props.customStyles, _c = _b.dropdownMenu, _d = _c === void 0 ? { className: undefined, style: undefined } : _c, dropdownMenuClassName = _d.className, dropdownMenuStyle = _d.style, _e = _b.dropdownMenuItem, _f = _e === void 0 ? { className: undefined, style: undefined } : _e, dropdownMenuItemClassName = _f.className, dropdownMenuItemStyle = _f.style, _g = _b.dropdownSubitem, _h = _g === void 0 ? { className: undefined, style: undefined } : _g, dropdownSubitemClassName = _h.className, dropdownSubitemStyle = _h.style;
            return (jsx("ul", __assign({ className: classNames((_a = {},
                    _a[styles.dropdownMenu] = true,
                    _a[dropdownMenuClassName] = Boolean(dropdownMenuClassName),
                    _a)), style: dropdownMenuStyle }, { children: items.map(function (item, index) {
                    var _a, _b;
                    var _c = _this.normalizeItem(item), children = _c.children, disabled = _c.disabled, label = _c.label, value = _c.value;
                    if (Array.isArray(children) && children.length >= 1) {
                        return (jsxs("li", __assign({ className: classNames((_a = {},
                                _a[styles.dropdownMenuItem] = true,
                                _a[styles.withSubitem] = true,
                                _a[dropdownSubitemClassName] = Boolean(dropdownSubitemClassName),
                                _a[styles.disabled] = disabled,
                                _a)), style: dropdownSubitemStyle }, { children: [label, _this.renderItems(children)] }), index + "-" + value));
                    }
                    return (jsx("li", __assign({ "aria-hidden": true, className: classNames((_b = {},
                            _b[styles.dropdownMenuItem] = true,
                            _b[dropdownMenuItemClassName] = Boolean(dropdownMenuItemClassName),
                            _b[styles.disabled] = disabled,
                            _b)), onClick: function () {
                            _this.handleSelect(item);
                        }, style: dropdownMenuItemStyle }, { children: label }), index + "-" + value));
                }) }), void 0));
        };
        _this.renderInput = function () {
            var _a = _this.props, CustomInput = _a.customInput, customInputProps = _a.customInputProps, disabled = _a.disabled, expandTrigger = _a.expandTrigger;
            var commonProps = {
                disabled: disabled,
                onClick: expandTrigger === 'click' ? _this.handleClick : undefined,
                readOnly: true,
                value: _this.getValue()
            };
            if (CustomInput)
                return (jsx(CustomInput, __assign({}, commonProps, customInputProps), void 0));
            return (jsx("input", __assign({}, commonProps), void 0));
        };
        return _this;
    }
    Cascade.prototype.componentWillUnmount = function () {
        document.removeEventListener('click', this.onClickOutside);
    };
    Cascade.prototype.render = function () {
        var _a;
        var _b = this.props, _c = _b.customStyles.dropdown, dropdownClassName = _c.className, dropdownStyle = _c.style, expandTrigger = _b.expandTrigger, items = _b.items;
        return (jsxs("div", __assign({ "aria-hidden": true, className: classNames((_a = {},
                _a[styles.dropdown] = true,
                _a[dropdownClassName] = Boolean(dropdownClassName),
                _a[styles.dropdownOnHover] = expandTrigger === 'hover',
                _a)), ref: this.dropdownRef, style: dropdownStyle }, { children: [this.renderInput(), this.renderItems(items)] }), void 0));
    };
    Cascade.defaultProps = {
        disabled: false,
        expandTrigger: 'click',
        fieldNames: {
            value: 'value',
            label: 'label',
            children: 'children'
        },
        items: [],
        separatorIcon: ' > '
    };
    return Cascade;
}(React.Component));

export default Cascade;
