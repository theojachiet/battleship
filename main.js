/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 56:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ 72:
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ 113:
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ 314:
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ 354:
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ 430:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(354);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* 1. Use a more-intuitive box-sizing model */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* 2. Remove default margin */
* {
  margin: 0;
}

/* 3. Enable keyword animations */
@media (prefers-reduced-motion: no-preference) {
  html {
    interpolate-size: allow-keywords;
  }
}

body {
  /* 4. Add accessible line-height */
  line-height: 1.5;
  /* 5. Improve text rendering */
  -webkit-font-smoothing: antialiased;
}

/* 6. Improve media defaults */
img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

/* 7. Inherit fonts for form controls */
input,
button,
textarea,
select {
  font: inherit;
}

/* 8. Avoid text overflows */
p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}

/* 9. Improve line wrapping */
p {
  text-wrap: pretty;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  text-wrap: balance;
}

/*
  10. Create a root stacking context
*/
#root,
#__next {
  isolation: isolate;
}`, "",{"version":3,"sources":["webpack://./src/reset.css"],"names":[],"mappings":"AAAA,6CAA6C;AAC7C;;;EAGE,sBAAsB;AACxB;;AAEA,6BAA6B;AAC7B;EACE,SAAS;AACX;;AAEA,iCAAiC;AACjC;EACE;IACE,gCAAgC;EAClC;AACF;;AAEA;EACE,kCAAkC;EAClC,gBAAgB;EAChB,8BAA8B;EAC9B,mCAAmC;AACrC;;AAEA,8BAA8B;AAC9B;;;;;EAKE,cAAc;EACd,eAAe;AACjB;;AAEA,uCAAuC;AACvC;;;;EAIE,aAAa;AACf;;AAEA,4BAA4B;AAC5B;;;;;;;EAOE,yBAAyB;AAC3B;;AAEA,6BAA6B;AAC7B;EACE,iBAAiB;AACnB;;AAEA;;;;;;EAME,kBAAkB;AACpB;;AAEA;;CAEC;AACD;;EAEE,kBAAkB;AACpB","sourcesContent":["/* 1. Use a more-intuitive box-sizing model */\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\n/* 2. Remove default margin */\n* {\n  margin: 0;\n}\n\n/* 3. Enable keyword animations */\n@media (prefers-reduced-motion: no-preference) {\n  html {\n    interpolate-size: allow-keywords;\n  }\n}\n\nbody {\n  /* 4. Add accessible line-height */\n  line-height: 1.5;\n  /* 5. Improve text rendering */\n  -webkit-font-smoothing: antialiased;\n}\n\n/* 6. Improve media defaults */\nimg,\npicture,\nvideo,\ncanvas,\nsvg {\n  display: block;\n  max-width: 100%;\n}\n\n/* 7. Inherit fonts for form controls */\ninput,\nbutton,\ntextarea,\nselect {\n  font: inherit;\n}\n\n/* 8. Avoid text overflows */\np,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  overflow-wrap: break-word;\n}\n\n/* 9. Improve line wrapping */\np {\n  text-wrap: pretty;\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  text-wrap: balance;\n}\n\n/*\n  10. Create a root stacking context\n*/\n#root,\n#__next {\n  isolation: isolate;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 540:
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ 659:
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ 825:
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ 911:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(354);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `body {
  background-color: rgb(25, 25, 35);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  color: whitesmoke;
  text-align: center;
  margin: 10px;
  font-size: 3em;
}

p {
  color: white;
  font-size: 1.2rem;
  margin: 0;
  padding: 0;
}

/* BOARDS  */

.container {
  margin: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
}

.board-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.label {
  color: whitesmoke;
  text-transform: capitalize;
  font-size: 2rem;
  margin: 0;
}

.board {
  display: grid;
  grid-template-columns: repeat(11, 50px);
  grid-template-rows: repeat(11, 50px);
}

button {
  appearance: none;
  border: none;
  padding: 0;
  background-color: black;
  outline: 1px solid whitesmoke;
}

button.last {
  border: 6px solid limegreen;
}

.rowNumber {
  color: white;
  padding-top: 15px;
  text-align: center;
}

.colLetter {
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* BOTTOM BUTTONS */

.bottom-container {
  display: flex;
  gap: 50px;
}

.randomize,
.switch,
.submit,
.ready {
  padding: 0.7em 1.5em;
  font-size: 1.5em;
  border-radius: 8px;
  outline: none;
}

.randomize:hover,
.switch:hover,
.submit:hover,
.ready:hover {
  cursor: pointer;
}

.randomize {
  background-color: gray;
  color: whitesmoke;
}

.switch {
  background-color: red;
  color: whitesmoke;
}

.submit {
  background-color: blue;
  color: whitesmoke;
}

.ready {
  background-color: gray;
  color: whitesmoke;
}

.green {
  background-color: green;
}

/* CELLS STATES */

button.water {
  background-color: aqua;
}

button.ship {
  background-color: blue;
}

button.attacked {
  background-color: black;
}

button.damaged {
  background-color: orange;
}

button.sunk {
  background-color: red;
}

/* DIALOG */

dialog {
  color: #999;
  margin: auto;
  border: none;
  padding: 50px;
  border-radius: 20px;
  font-size: 1.1rem;
  background-color: rgb(0 0 0 / 90%);

  width: clamp(500px, 500px, 50%);
}

::backdrop {
  backdrop-filter: blur(10rem);
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  color: whitesmoke;
}`, "",{"version":3,"sources":["webpack://./src/general.css"],"names":[],"mappings":"AAAA;EACE,iCAAiC;EACjC,4DAA4D;EAC5D,aAAa;EACb,sBAAsB;EACtB,mBAAmB;AACrB;;AAEA;EACE,iBAAiB;EACjB,kBAAkB;EAClB,YAAY;EACZ,cAAc;AAChB;;AAEA;EACE,YAAY;EACZ,iBAAiB;EACjB,SAAS;EACT,UAAU;AACZ;;AAEA,YAAY;;AAEZ;EACE,YAAY;EACZ,aAAa;EACb,uBAAuB;EACvB,mBAAmB;EACnB,SAAS;AACX;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,mBAAmB;EACnB,SAAS;AACX;;AAEA;EACE,iBAAiB;EACjB,0BAA0B;EAC1B,eAAe;EACf,SAAS;AACX;;AAEA;EACE,aAAa;EACb,uCAAuC;EACvC,oCAAoC;AACtC;;AAEA;EACE,gBAAgB;EAChB,YAAY;EACZ,UAAU;EACV,uBAAuB;EACvB,6BAA6B;AAC/B;;AAEA;EACE,2BAA2B;AAC7B;;AAEA;EACE,YAAY;EACZ,iBAAiB;EACjB,kBAAkB;AACpB;;AAEA;EACE,YAAY;EACZ,aAAa;EACb,uBAAuB;EACvB,mBAAmB;AACrB;;AAEA,mBAAmB;;AAEnB;EACE,aAAa;EACb,SAAS;AACX;;AAEA;;;;EAIE,oBAAoB;EACpB,gBAAgB;EAChB,kBAAkB;EAClB,aAAa;AACf;;AAEA;;;;EAIE,eAAe;AACjB;;AAEA;EACE,sBAAsB;EACtB,iBAAiB;AACnB;;AAEA;EACE,qBAAqB;EACrB,iBAAiB;AACnB;;AAEA;EACE,sBAAsB;EACtB,iBAAiB;AACnB;;AAEA;EACE,sBAAsB;EACtB,iBAAiB;AACnB;;AAEA;EACE,uBAAuB;AACzB;;AAEA,iBAAiB;;AAEjB;EACE,sBAAsB;AACxB;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,uBAAuB;AACzB;;AAEA;EACE,wBAAwB;AAC1B;;AAEA;EACE,qBAAqB;AACvB;;AAEA,WAAW;;AAEX;EACE,WAAW;EACX,YAAY;EACZ,YAAY;EACZ,aAAa;EACb,mBAAmB;EACnB,iBAAiB;EACjB,kCAAkC;;EAElC,+BAA+B;AACjC;;AAEA;EACE,4BAA4B;AAC9B;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,mBAAmB;EACnB,SAAS;EACT,iBAAiB;AACnB","sourcesContent":["body {\n  background-color: rgb(25, 25, 35);\n  font-family: \"Segoe UI\", Tahoma, Geneva, Verdana, sans-serif;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\nh1 {\n  color: whitesmoke;\n  text-align: center;\n  margin: 10px;\n  font-size: 3em;\n}\n\np {\n  color: white;\n  font-size: 1.2rem;\n  margin: 0;\n  padding: 0;\n}\n\n/* BOARDS  */\n\n.container {\n  margin: 40px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 50px;\n}\n\n.board-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 20px;\n}\n\n.label {\n  color: whitesmoke;\n  text-transform: capitalize;\n  font-size: 2rem;\n  margin: 0;\n}\n\n.board {\n  display: grid;\n  grid-template-columns: repeat(11, 50px);\n  grid-template-rows: repeat(11, 50px);\n}\n\nbutton {\n  appearance: none;\n  border: none;\n  padding: 0;\n  background-color: black;\n  outline: 1px solid whitesmoke;\n}\n\nbutton.last {\n  border: 6px solid limegreen;\n}\n\n.rowNumber {\n  color: white;\n  padding-top: 15px;\n  text-align: center;\n}\n\n.colLetter {\n  color: white;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n/* BOTTOM BUTTONS */\n\n.bottom-container {\n  display: flex;\n  gap: 50px;\n}\n\n.randomize,\n.switch,\n.submit,\n.ready {\n  padding: 0.7em 1.5em;\n  font-size: 1.5em;\n  border-radius: 8px;\n  outline: none;\n}\n\n.randomize:hover,\n.switch:hover,\n.submit:hover,\n.ready:hover {\n  cursor: pointer;\n}\n\n.randomize {\n  background-color: gray;\n  color: whitesmoke;\n}\n\n.switch {\n  background-color: red;\n  color: whitesmoke;\n}\n\n.submit {\n  background-color: blue;\n  color: whitesmoke;\n}\n\n.ready {\n  background-color: gray;\n  color: whitesmoke;\n}\n\n.green {\n  background-color: green;\n}\n\n/* CELLS STATES */\n\nbutton.water {\n  background-color: aqua;\n}\n\nbutton.ship {\n  background-color: blue;\n}\n\nbutton.attacked {\n  background-color: black;\n}\n\nbutton.damaged {\n  background-color: orange;\n}\n\nbutton.sunk {\n  background-color: red;\n}\n\n/* DIALOG */\n\ndialog {\n  color: #999;\n  margin: auto;\n  border: none;\n  padding: 50px;\n  border-radius: 20px;\n  font-size: 1.1rem;\n  background-color: rgb(0 0 0 / 90%);\n\n  width: clamp(500px, 500px, 50%);\n}\n\n::backdrop {\n  backdrop-filter: blur(10rem);\n}\n\nform {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 20px;\n  color: whitesmoke;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(72);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(825);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(659);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(56);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(540);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(113);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/reset.css
var cjs_js_src_reset = __webpack_require__(430);
;// ./src/reset.css

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());
options.insert = insertBySelector_default().bind(null, "head");
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(cjs_js_src_reset/* default */.A, options);




       /* harmony default export */ const src_reset = (cjs_js_src_reset/* default */.A && cjs_js_src_reset/* default */.A.locals ? cjs_js_src_reset/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/general.css
var general = __webpack_require__(911);
;// ./src/general.css

      
      
      
      
      
      
      
      
      

var general_options = {};

general_options.styleTagTransform = (styleTagTransform_default());
general_options.setAttributes = (setAttributesWithoutAttributes_default());
general_options.insert = insertBySelector_default().bind(null, "head");
general_options.domAPI = (styleDomAPI_default());
general_options.insertStyleElement = (insertStyleElement_default());

var general_update = injectStylesIntoStyleTag_default()(general/* default */.A, general_options);




       /* harmony default export */ const src_general = (general/* default */.A && general/* default */.A.locals ? general/* default */.A.locals : undefined);

;// ./src/models/gameboard.js
class GameBoard {

    constructor() {
        this.rows = 10;
        this.columns = 10;
        this.ships = [];
        this.attacks = [];
        this.board = this.makeBoard();
        this.gameOver = false;
    }

    makeBoard() {
        const board = [];
        for (let i = 0; i < this.rows; i++) {
            board[i] = [];
            for (let j = 0; j < this.columns; j++) {
                board[i].push(new Cell(new Water()));
            }
        }
        return board;
    }

    getBoard() {
        return this.board;
    }

    clearBoard() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this.board[i][j].type = new Water();
                this.board[i][j].content = 'water';
            }
        }
    }

    clearSpot(row, col) {
        this.board[row][col].type = new Water();
        this.board[row][col].content = 'water';
    }

    replaceShip(ship, row, col) {
        ship.content = 'ship';
        this.board[row][col].type = ship;
        // ship.recordCoordinates(row, col);
    }

    placeShip(ship, row, col) {

        if (row >= this.rows || row < 0 || col >= this.columns || col < 0) throw new Error('Ship out of the board');

        if (!this.spotIsAvailable(ship, row, col)) return false;
        if (!this.spotIsSeparatedFromOthers(ship, row, col)) return false;

        if (ship.orientation === 'horizontal') {
            for (let i = 0; i < ship.length; i++) {
                // if (this.board[row][col + i].type.content === 'ship') return false;
                this.board[row][col + i].type = ship;
            }
        } else {
            for (let i = 0; i < ship.length; i++) {
                // if (this.board[row + i][col].type.content === 'ship') return false;
                this.board[row + i][col].type = ship;
            }
        }

        ship.recordCoordinates(row, col);
        this.ships.push(ship);
        ship.index = this.ships.length - 1;
        return true;
    }

    spotIsAvailable(ship, row, col) {
        if (ship.orientation === 'horizontal') {
            if (col + ship.length >= this.columns) return false;
            for (let i = 0; i < ship.length; i++) {
                if (this.board[row][col + i].type.content !== 'water') return false;
            }
        } else {
            if (row + ship.length >= this.rows) return false;
            for (let i = 0; i < ship.length; i++) {
                if (this.board[row + i][col].type.content !== 'water') return false;
            }
        }
        return true;
    }

    spotIsSeparatedFromOthers(ship, row, col) {
        let length = ship.length;
        let orientation = ship.orientation;

        // Calculate ship's bounding box
        let rowStart = row;
        let rowEnd = row;
        let colStart = col;
        let colEnd = col;

        if (orientation === 'horizontal') {
            colEnd = col + length - 1;
        } else {
            rowEnd = row + length - 1;
        }

        // Expand the bounding box by 1 in all directions
        let minRow = Math.max(0, rowStart - 1);
        let maxRow = Math.min(this.rows - 1, rowEnd + 1);
        let minCol = Math.max(0, colStart - 1);
        let maxCol = Math.min(this.columns - 1, colEnd + 1);

        // Check the bounding box for non-water
        for (let r = minRow; r <= maxRow; r++) {
            for (let c = minCol; c <= maxCol; c++) {
                // Skip the ship's own cells (optional if they're not placed yet)
                if (orientation === 'horizontal' && r === row && c >= col && c <= colEnd) continue;
                if (orientation === 'vertical' && c === col && r >= row && r <= rowEnd) continue;

                if (this.board[r][c].type.content !== 'water') {
                    return false;
                }
            }
        }

        return true;
    }

    shipIsAlreadyHere(ship, row, col) {
        const length = ship.length;
        const orientation = ship.orientation;

        for (let i = 0; i < length; i++) {
            if (orientation === 'horizontal') {
                if (this.board[row][col + i].type.content === 'ship') return true;
            } else {
                if (this.board[row + i][col].type.content === 'ship') return true;
            }
        }
        return false;
    }

    receiveAttack(row, col) {

        if (this.board[row][col].type.content === 'attacked') {
            return false;
        }
        if (this.board[row][col].content === 'damagedShip') {
            return false;
        }

        if (this.board[row][col].type.content === 'water') {
            this.board[row][col].type.hit();
            this.attacks.push([row, col]);
        } else if (this.board[row][col].type.content === 'ship') {

            //changing just the content of the cell but not the type of the entire object
            this.board[row][col].content = 'damagedShip';
            const indexOfShip = this.board[row][col].type.index;
            this.ships[indexOfShip].hit();

            this.attacks.push([row, col]);
        }

        this.checkGameOver();
        return { valid: true, type: this.board[row][col].type.content };
    }

    getShip(row, col) {
        if (this.board[row][col].type.content !== 'ship') return false;
        const indexOfShip = this.board[row][col].type.index;
        const ship = this.ships[indexOfShip];
        return ship;
    }

    displayBoard() {
        let boardString = '';
        for (let i = 0; i < this.rows; i++) {
            boardString += '\n';
            for (let j = 0; j < this.columns; j++) {
                boardString += ` [${this.board[i][j].content}] `;
            }
        }
        return boardString;
    }

    checkGameOver() {
        for (let ship of this.ships) {
            if (!ship.isSunk()) return;
        }
        this.gameOver = true;
    }
}

class Cell {
    constructor(type) {
        this.type = type;
        this.content = type.content;
    }
}

class Water {
    constructor() {
        this.content = 'water';
    }

    hit() {
        this.content = 'attacked';
    }
}
;// ./src/models/player.js


class Player {
    constructor(type, ismyTurn, name) {
        this.type = type;
        this.gameboard = new GameBoard();
        this.ismyTurn = ismyTurn;
        this.name = name;
        this.hasMadeMove = false;
    }

    changeTurn() {
        this.ismyTurn = !this.ismyTurn;
    }
}
;// ./src/controllers/gameflow.js
class GameFlow {
    constructor(players) {
        this.human = players[0];
        this.computer = players[1];
        this.opponent = players[2];
        this.players = players;

        this.currentPlayer = this.human;
        this.otherPlayer = this.computer;

        this.playingAgainstHuman = false;
    }

    addOpponent(player) {
        this.opponent = player;
        this.players.push(player);
    }

    switchOpponent() {
        this.otherPlayer = this.playingAgainstHuman ? this.computer : this.opponent;
        this.playingAgainstHuman = !this.playingAgainstHuman;
        this.resetTurns();
    }

    resetTurns() {
        this.currentPlayer = this.human;
        this.otherPlayer = this.playingAgainstHuman ? this.opponent : this.computer;
    }

    playRound(row, col) {
        const hit = this.otherPlayer.gameboard.receiveAttack(row, col);
        if (!hit) return { valid: false };

        let ship = null;
        if (hit.type === 'ship') ship = this.otherPlayer.gameboard.getShip(row, col);

        if (this.otherPlayer.gameboard.gameOver) {
            this.addTurn();
            return {
                valid: true,
                hit: hit.type,
                ship: ship || null,
                gameOver: true,
                winner: this.otherPlayer
            };
        }

        this.addTurn();
        return {
            valid: true,
            hit: hit.type,
            ship: ship || null,
            gameOver: false,
            winner: null
        };
    }

    addTurn() {
        const secondPlayer = this.playingAgainstHuman ? this.opponent : this.computer;
        const prevPlayer = this.currentPlayer;

        this.currentPlayer = (this.currentPlayer === this.human) ? secondPlayer : this.human;
        this.otherPlayer = prevPlayer;

        this.currentPlayer.changeTurn();
        this.otherPlayer.changeTurn();
    }
}
;// ./src/views/DOM.js
const container = document.querySelector('.container');

function displayBoard(player, opponent = 'none') {
  const boardContainer = document.createElement('div');
  boardContainer.classList.add('board-container');

  const board = document.createElement('div');
  board.classList.add('board');

  const boardData = player.gameboard.getBoard();

  for (let row = -1; row < boardData.length; row++) {
    if (row === -1) {

      //Displaying columns Letters
      const letters = [' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
      for (let letter of letters) {
        const colLetter = document.createElement('span');
        colLetter.classList.add('colLetter');
        colLetter.textContent = letter;
        board.appendChild(colLetter);
      }
      row++;
    }
    //Displaying row Numbers
    const rowNumber = document.createElement('span');
    rowNumber.textContent = row + 1;
    rowNumber.classList.add('rowNumber');
    board.appendChild(rowNumber);

    for (let col = 0; col < boardData[row].length; col++) {
      const cellData = boardData[row][col];
      const cellButton = createCellButton(player, cellData, row, col, opponent);
      board.appendChild(cellButton);
    }

  }

  const label = document.createElement('p');
  label.classList.add('label');
  label.textContent = player.name;

  boardContainer.append(board, label);
  container.appendChild(boardContainer);
}

function createCellButton(player, cellData, row, col) {
  const btn = document.createElement('button');
  btn.classList.add('cell');

  if (player.gameboard.attacks.length > 0 && player.ismyTurn) {
    if (player.gameboard.attacks.at(-1)[0] == row && player.gameboard.attacks.at(-1)[1] == col) {
      btn.classList.add('last');
    }
  }

  btn.dataset.column = col;
  btn.dataset.row = row;
  btn.dataset.owner = player.type;
  btn.dataset.name = player.name;
  btn.setAttribute('draggable', 'true');

  const { content: cellContent, type: cellType } = cellData;
  const { content: typeContent } = cellType;

  // Determine the visual type of the cell
  if (player.type === 'computer') {
    btn.classList.add('water');
    btn.dataset.type = 'water';
    btn.setAttribute('draggable', 'false');
  }
  else if (!player.ismyTurn) {
    setNonTurnCellState(btn, typeContent, cellData);
  }
  else {
    setPlayerTurnCellState(btn, typeContent, cellData);
  }

  return btn;
}

function setNonTurnCellState(btn, typeContent, cellData) {
  if (typeContent === 'attacked') {
    btn.classList.add('attacked');
  } else {
    btn.classList.add('water');
    btn.dataset.type = 'water';
    btn.setAttribute('draggable', 'false');
  }
  applyDamageState(btn, cellData);
}

function setPlayerTurnCellState(btn, typeContent, cellData) {
  if (typeContent === 'water') {
    btn.classList.add('water');
    btn.dataset.type = 'water';
    btn.setAttribute('draggable', 'false');
  } else if (typeContent === 'ship') {
    btn.classList.add('ship');
    btn.dataset.type = 'ship';
  } else if (typeContent === 'attacked') {
    btn.classList.add('attacked');
  }
  applyDamageState(btn, cellData);
}

function applyDamageState(btn, cellData) {
  if (cellData.content !== 'damagedShip') return;

  btn.classList.add('damaged');

  const ship = cellData.type;
  if (ship.isSunk()) {
    btn.classList.add('sunk');
  }
}

function createReadyButton() {
  const readyButton = document.createElement('button');
  readyButton.classList.add('ready');
  readyButton.textContent = 'Ready ?';

  container.appendChild(readyButton);
}

function updateBoard(player, row, col, state) {
  const selectedCell = document.querySelector(`[data-column="${col}"][data-row="${row}"][data-name="${player.name}"]`);

  if (state === 'attacked') selectedCell.className = 'cell attacked';
  else if (state === 'ship') {
    selectedCell.className = 'cell damaged';
  }
}

function markShipSunk(player, ship) {
  for (let part of ship.coordinates) {
    const shipCell = document.querySelector(`[data-column="${part[1]}"][data-row="${part[0]}"][data-name="${player.name}"]`);
    shipCell.classList.add('sunk');
  }
}

function removeShip(player, ship) {
  for (let cell of ship.coordinates) {
    const cells = document.querySelector(`[data-column="${cell[1]}"][data-row="${cell[0]}"]`);
    const oldShipCell = document.querySelector(`[data-column="${cell[1]}"][data-row="${cell[0]}"][data-name="${player.name}"]`);
    player.gameboard.board[cell[0]][cell[1]].type.content = 'water';
    oldShipCell.className = 'cell water';
    oldShipCell.dataset.type = 'water';
    oldShipCell.setAttribute('draggable', 'false');
    player.gameboard.clearSpot(cell[0], cell[1]);
  }
}

function renderNewShip(player, ship) {
  for (let cell of ship.coordinates) {
    const newShipCell = document.querySelector(`[data-column="${cell[1]}"][data-row="${cell[0]}"][data-name="${player.name}"]`);
    player.gameboard.board[cell[0]][cell[1]].type.content = 'ship';
    newShipCell.className = 'cell ship';
    newShipCell.dataset.type = 'ship';
    newShipCell.setAttribute('draggable', 'true');
    player.gameboard.replaceShip(ship, cell[0], cell[1]);
  }
}

function updateDescription(player, row, col, result) {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  let elementAttacked;
  if (result.hit === 'attacked') elementAttacked = 'miss';
  if (result.hit === 'ship') {
    if (result.ship.sunk) {
      elementAttacked = 'coulé';
    } else {
      elementAttacked = 'touché';
    }
  }
  const description = document.querySelector('.description');
  description.textContent = `${player.name} attacks ${letters[col]} ${parseInt(row) + 1} : ${elementAttacked}`;
}

function clearContainer() {
  container.textContent = '';
}

function switchButtonOpponent(switchButton) {
  if (switchButton.textContent === 'Switch to Human Opponent') switchButton.textContent = 'Switch to Computer Opponent';
  else switchButton.textContent = 'Switch to Human Opponent';
}

function showGameOver(winner) {
  const description = document.querySelector('.description');

  description.textContent = 'Game Over : ' + winner.name + ' won !';
  alert('Game Over : ' + winner.name + ' won !');
}


;// ./src/models/ship.js
class Ship {

    constructor(length, orientation = 'horizontal') {
        this.length = length;
        this.numberOfHits = 0;
        this.sunk = false;
        this.orientation = orientation;
        this.content = 'ship';
        this.index = 0;
        this.coordinates = [];
    }

    hit() {
        this.numberOfHits++;
        if (this.isSunk()) this.sunk = true;
    }

    isSunk() {
        if (this.numberOfHits >= this.length) return true;
        return false;
    }

    recordCoordinates(row, col) {
        if (this.orientation === 'vertical') {
            for (let i = 0; i < this.length; i++) {
                this.coordinates.push([row + i, col]);
            }
        } else {
            for (let i = 0; i < this.length; i++) {
                this.coordinates.push([row, col + i]);
            }
        }
    }
}
;// ./src/utils/placement.js


function placeRandomShips(player) {
    const ship1 = new Ship(1);
    const ship2 = new Ship(1);
    const ship3 = new Ship(1);
    const ship4 = new Ship(1);

    let ship5
    randomOrientation() ? ship5 = new Ship(2) : ship5 = new Ship(2, 'vertical');
    let ship6
    randomOrientation() ? ship6 = new Ship(2) : ship6 = new Ship(2, 'vertical');
    let ship7
    randomOrientation() ? ship7 = new Ship(2) : ship7 = new Ship(2, 'vertical');

    let ship8
    randomOrientation() ? ship8 = new Ship(3) : ship8 = new Ship(3, 'vertical');
    let ship9
    randomOrientation() ? ship9 = new Ship(3) : ship9 = new Ship(3, 'vertical');

    let ship10
    randomOrientation() ? ship10 = new Ship(4) : ship10 = new Ship(4, 'vertical');

    function randomOrientation() {
        return Math.random() > 0.5;
    }

    let ships = [ship10, ship9, ship8, ship7, ship6, ship5, ship4, ship3, ship2, ship1];

    for (let ship of ships) {
        let row = Math.floor(Math.random() * 10);
        let col = Math.floor(Math.random() * 10);

        let shipIsPlaced = player.gameboard.placeShip(ship, row, col);

        while (!shipIsPlaced) {
            row = Math.floor(Math.random() * 10);
            col = Math.floor(Math.random() * 10);
            shipIsPlaced = player.gameboard.placeShip(ship, row, col);
        }
    }
}
;// ./src/views/dragDrop.js


function enableDragAndDrop(boardEl, game) {
  boardEl.addEventListener('dragstart', e => handleDragStart(e, game));
  boardEl.addEventListener('dragover', handleDragOver);
  boardEl.addEventListener('drop', e => handleDrop(e, game));
}

function disableDragAndDrop(boardEl) {
  boardEl.removeEventListener('dragstart', handleDragStart);
  boardEl.removeEventListener('dragover', handleDragOver);
  boardEl.removeEventListener('drop', handleDrop);

  boardEl.querySelectorAll('.cell').forEach(c => c.setAttribute('draggable', 'false'));
}

function handleDragStart(e, game) {
  const { currentPlayer } = game;
  const row = e.target.dataset.row;
  const col = e.target.dataset.column;
  const type = e.target.dataset.type;

  if (!row || !col || type !== 'ship') return;

  const ship = currentPlayer.gameboard.getShip(row, col);
  const cells = ship.coordinates.map(([r, c]) => ({
    row: parseInt(r, 10),
    col: parseInt(c, 10)
  }));

  const payload = {
    shipIndex: ship.index,
    orientation: ship.orientation,
    cells,
    indexOfSelectedCell: cells.findIndex(c => c.row == row && c.col == col)
  };

  e.dataTransfer.setData('application/json', JSON.stringify(payload));
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e, game) {
  e.preventDefault();
  const { currentPlayer } = game;

  const dropCell = e.target.closest('.cell');
  if (!dropCell) return;

  //Retrieve INFO from the dragstart event
  const payload = JSON.parse(e.dataTransfer.getData('application/json'));
  const { shipIndex, orientation, cells, indexOfSelectedCell } = payload;

  const targetRow = parseInt(dropCell.dataset.row, 10);
  const targetCol = parseInt(dropCell.dataset.column, 10);

  // compute offset to get the new coordinates
  const dRow = orientation === 'vertical'
    ? targetRow - cells[0].row - indexOfSelectedCell
    : targetRow - cells[0].row;
  const dCol = orientation === 'horizontal'
    ? targetCol - cells[0].col - indexOfSelectedCell
    : targetCol - cells[0].col;

  const newCells = cells.map(c => ({
    row: c.row + dRow,
    col: c.col + dCol
  }));

  if (!checkIfShipIsInsideBoard(newCells)) {
    return;
  }

  const ship = currentPlayer.gameboard.ships[shipIndex];
  removeShip(currentPlayer, ship);

  //Checking if the spot is valid
  if (!currentPlayer.gameboard.spotIsSeparatedFromOthers(ship, newCells[0].row, newCells[0].col) ||
    currentPlayer.gameboard.shipIsAlreadyHere(ship, newCells[0].row, newCells[0].col)) {
    return renderNewShip(currentPlayer, ship); //If not, re-draw the ship to its original location
  }

  ship.coordinates = newCells.map(c => [c.row, c.col]);
  renderNewShip(currentPlayer, ship);
}

function checkIfShipIsInsideBoard(coordinates) {
  return coordinates.every(c => c.row >= 0 && c.row < 10 && c.col >= 0 && c.col < 10);
}
;// ./src/controllers/computerAI.js
class ComputerAI {
    constructor(gameboard) {
        this.gameboard = gameboard;
        this.memory = [];
        this.mode = 'random';
        this.storedShip = null;
        this.shipOrientation = null;
        this.direction = null;
        //Add a mode : if a ship is hit but not sunk, go into targetShip mode, if there is no ship or all the ships are sunk, go into search mode.
    }

    getNextMove() {
        let move;
        try {
            //First move case
            if (this.memory.length === 0) move = this.makeRandomMove();

            //Return to random mode if all the ships on the board are sunk
            else if (this.checkAllShipsSunk()) {
                this.mode = 'random';
                this.shipOrientation = null;
                this.direction = null;
                move = this.makeRandomMove();
            } else {
                this.mode = 'target';
                move = this.targetModeMove();
            }
        } catch (e) {
            console.error('AI failed to find a move:', e);
            move = this.makeRandomMove();
        }

        //Safety fallback in case the AI Algorithm encounters a problem
        if (!move || move.row == null || move.col == null) move = this.makeRandomMove();
        return move;
    }

    targetModeMove() {
        const previousMove = this.memory[this.memory.length - 1];
        const previousResult = previousMove[2];

        if (!this.storedShip) {
            // No base ship to target from
            return this.makeRandomMove();
        }

        if (previousMove[0] === this.storedShip[0] && previousMove[1] === this.storedShip[1]) {
            //If previous move was hitting the ship => try around
            this.storedShip = previousMove;
            return this.targetShip(previousMove);

        } else if (previousResult.hit !== 'ship' && this.shipOrientation === null && this.direction === null) {
            //If previous move was a failed attempt to find another part of the ship => try again
            return this.targetShip(this.storedShip);

        } else if (previousResult.hit === 'ship') {
            //If previous move succeded to find another ship, determine its orientation and direction

            this.shipOrientation = this.getShipOrientation(this.storedShip, previousMove);
            this.direction = this.getShipDirection(this.storedShip, previousMove, this.shipOrientation);

            return this.selectCellFromDirection();

        } else if (previousResult.hit !== 'ship' && this.shipOrientation !== null) {
            // If it was a failed attempt at finding a direction, just try to find the direction again with the move made before
            const secondLastMove = this.memory[this.memory.length - 2];

            this.direction = this.getShipDirection(this.storedShip, secondLastMove, this.shipOrientation);
            return this.selectCellFromDirection();
        }

        return this.makeRandomMove();
    }

    targetShip(shipCell) {
        const directions = [
            [1, 0],   // down
            [0, 1],   // right
            [-1, 0],  // up
            [0, -1],  // left
        ];

        for (const [dr, dc] of directions) {
            const row = shipCell[0] + dr;
            const col = shipCell[1] + dc;

            const inBounds = row >= 0 && row < 10 && col >= 0 && col < 10;

            if (inBounds && !this.checkMoveAlreadyMade(row, col)) {
                return { row, col };
            } else continue;
        }

        return this.makeRandomMove();
    }

    makeRandomMove() {
        const maxAttempts = 50;
        let attempts = 0;
        let row, col;

        do {
            row = Math.floor(Math.random() * 10);
            col = Math.floor(Math.random() * 10);
            attempts++;
            if (attempts > maxAttempts) {
                // Fallback: allow any unplayed cell
                do {
                    row = Math.floor(Math.random() * 10);
                    col = Math.floor(Math.random() * 10);
                } while (this.checkMoveAlreadyMade(row, col));
                break;
            }
        } while ((row + col) % 2 !== 0 || this.checkMoveAlreadyMade(row, col));

        return { row, col };
    }

    getShipOrientation(storedShip, previousMove) {
        //checking if both rows are the same
        if (storedShip[0] === previousMove[0]) return 'horizontal';
        else return 'vertical';
    }

    getShipDirection(storedShip, previousMove, orientation) {
        if (orientation === 'horizontal') {

            const rightCell = (storedShip[1] > previousMove[1]) ? storedShip : previousMove;
            const leftCell = (storedShip[1] < previousMove[1]) ? storedShip : previousMove;

            //Check on both sides of the cells if the ship stops somewhere
            if (this.checkMoveAlreadyMade(rightCell[0], rightCell[1] + 1) || rightCell[1] === 9) return { direction: 'left', borderCell: leftCell };
            else if (this.checkMoveAlreadyMade(leftCell[0], leftCell[1] - 1) || leftCell[1] === 0) return { direction: 'right', borderCell: rightCell };

            else {
                //Check for boundaries and return an object to test a direction in getNexMove TODO : implement the extra boundaries logic here if necessary
                if (rightCell[1] === 9) return { direction: 'none', row: leftCell[0], col: leftCell[1] - 1 };
                else return { direction: 'none', row: rightCell[0], col: rightCell[1] + 1 };
            }

        } else {
            const topCell = (storedShip[0] < previousMove[0]) ? storedShip : previousMove;
            const bottomCell = (storedShip[0] > previousMove[0]) ? storedShip : previousMove;

            //Check on both sides of the cells if the ship stops somewhere
            if (this.checkMoveAlreadyMade(topCell[0] - 1, topCell[1]) || topCell[0] === 0) return { direction: 'down', borderCell: bottomCell };
            else if (this.checkMoveAlreadyMade(bottomCell[0] + 1, bottomCell[1]) || bottomCell[0] === 9) return { direction: 'up', borderCell: topCell };

            else {
                //Check for boundaries and return an object to test a direction in getNexMove
                if (bottomCell[0] === 9) return { direction: 'none', row: topCell[0] - 1, col: topCell[1] };
                else return { direction: 'none', row: bottomCell[0] + 1, col: bottomCell[1] };
            }
        }
    }

    selectCellFromDirection() {
        let row = 0;
        let col = 0;
        switch (this.direction.direction) {
            case 'up':
                row = this.direction.borderCell[0] - 1;
                col = this.direction.borderCell[1];
                break;
            case 'down':
                row = this.direction.borderCell[0] + 1;
                col = this.direction.borderCell[1];
                break;
            case 'left':
                row = this.direction.borderCell[0];
                col = this.direction.borderCell[1] - 1;
                break;
            case 'right':
                row = this.direction.borderCell[0];
                col = this.direction.borderCell[1] + 1;
                break;
            case 'none':
                row = this.direction.row;
                col = this.direction.col;
                break;
        }

        if (!this.checkMoveAlreadyMade(row, col) && row >= 0 && row < 10 && col >= 0 && col < 10) {
            return { row, col };
        }
        return this.makeRandomMove();
    }

    checkAllShipsSunk() {
        for (let target of this.memory) {
            if (target[2].hit === 'ship') {
                if (target[2].ship.sunk === false) {
                    this.storedShip = target;
                    return false;
                }
            }
        }

        return true;
    }

    checkMoveAlreadyMade(row, col) {

        for (let i = 0; i < this.memory.length; i++) {
            if (this.memory[i][0] === row && this.memory[i][1] === col) {
                return true;
            }
        }

        return false;
    }

    registerHit(row, col, result) {
        //If the ship is sunk : reset search variables to not trigger the wrong algorithm
        if (result.ship && result.ship.sunk) {
            this.shipOrientation = null;
            this.direction = null;
            this.storedShip = null;
            this.eliminateSurroundingShipCells(result.ship);
        }

        this.memory.push([row, col, result]);
    }

    eliminateSurroundingShipCells(ship) {
        const surroundings = [
            [0, 1],
            [1, 0],
            [1, 1],
            [0, -1],
            [-1, 0],
            [-1, -1],
            [1, -1],
            [-1, 1]
        ]
        for (let cell of ship.coordinates) {
            for (let direction of surroundings) {
                if (!this.checkMoveAlreadyMade(cell[0] + direction[0], cell[1] + direction[1])) {
                    this.memory.push([cell[0] + direction[0], cell[1] + direction[1], { hit: 'none' }]);
                }
            }
        }
    }

    resetIntelligence() {
        this.memory = [];
    }
}
;// ./src/controllers/screenController.js






const screenController = (() => {
    let game; //Gameflow Instance
    const dialog = document.querySelector('dialog');
    const secondNameDialog = document.querySelector('dialog.second-player-name');

    const container = document.querySelector('.container');
    let ai;

    container.addEventListener('click', containerClickHandler);

    function containerClickHandler(e) {
        const cell = e.target.closest('.cell');
        if (!cell) return;

        // only attack computer's board
        if (cell.dataset.owner === 'computer') {
            handleAttackClick(e);
        }
    }

    function start(newGame) {
        game = newGame;
        ai = new ComputerAI(game.computer.gameboard);

        randomizeAndRender(game.currentPlayer, game.otherPlayer);

        const randomizeButton = document.querySelector('button.randomize');
        randomizeButton.addEventListener('click', () => randomizeAndRender());

        const switchButton = document.querySelector('button.switch');
        switchButton.addEventListener('click', () => {
            //Ensure the game object doesn't already have 3 players
            if (game.players.length !== 3) {
                secondNameDialog.showModal();
                secondNameDialog.addEventListener('submit', secondPlayerNameSubmit);
            } else {
                game.switchOpponent();
                switchButtonOpponent(switchButton);
                randomizeAndRender(game.currentPlayer, game.otherPlayer);
            }
        });
    }

    function secondPlayerNameSubmit(e) {
        const switchButton = document.querySelector('button.switch');

        e.preventDefault();

        const input = document.querySelector('input.second-player-name');
        const opponent = new Player("human", false, input.value);

        game.addOpponent(opponent);
        game.switchOpponent();

        switchButtonOpponent(switchButton);
        randomizeAndRender(game.currentPlayer, game.otherPlayer);

        secondNameDialog.close();
    }

    function randomizeAndRender(player1 = game.currentPlayer, player2 = game.otherPlayer) {
        playerReset(player1);
        playerReset(player2);

        if (player2.type === 'computer') {
            const { playerBoard, opponentBoard } = renderBoards(player1, player2, { showSubmit: false });

            enableDragAndDrop(playerBoard, game);
            container.addEventListener('click', containerClickHandler);
            ai.resetIntelligence();

        } else {
            const { playerBoard, opponentBoard } = renderBoards(player1, player2, { showSubmit: false, showReady: true });

            enableDragAndDrop(playerBoard, game);

            //ready button add event listener click to ready only for player1
            const readyPlayerButton = document.querySelector('button.ready');
            readyPlayerButton.addEventListener('click', board1ReadyHandler);
        }
    }

    function playerReset(player) {
        console.log(player);
        player.ready = false;
        player.gameboard.gameOver = false;
        player.gameboard.attacks = [];
        player.hasMadeMove = false;

        player.ismyTurn = (player === game.currentPlayer);

        player.gameboard.clearBoard();
        placeRandomShips(player);
    }

    function renderNextRound() {
        if (!game.opponent.ready) {
            const { playerBoard, opponentBoard } = renderBoards(game.human, game.opponent, { showSubmit: false, showReady: true });

            const readyPlayerButton = document.querySelector('button.ready');
            readyPlayerButton.removeEventListener('click', board1ReadyHandler);
            readyPlayerButton.addEventListener('click', board2ReadyHandler);

            enableDragAndDrop(opponentBoard, game);
            return;
        }

        const { playerBoard, opponentBoard, submitButton } = renderBoards(game.human, game.opponent, { showSubmit: true });

        submitButton.addEventListener('click', submitMove);

        if (!game.human.ready || !game.opponent.ready) return; //Both players should be ready

        if (game.human.ismyTurn) {
            opponentBoard.addEventListener('click', handleAttackClick);
        } else {
            playerBoard.addEventListener('click', handleAttackClick);
        }

    }

    function renderBoards(player1, player2, { showSubmit = false, showReady = false } = {}) {
        clearContainer();
        displayBoard(player1, player2);

        let submitButton = null;
        if (showSubmit) {
            submitButton = document.createElement('button');
            submitButton.textContent = 'Submit Move';
            submitButton.classList.add('submit');
            container.appendChild(submitButton);
        }

        if (showReady) {
            createReadyButton();
        }

        displayBoard(player2, player1);

        const boards = container.querySelectorAll('.board');
        return {
            playerBoard: boards[0],
            opponentBoard: boards[1],
            submitButton: container.querySelector('button.submit') || null
        };
    }

    function handleAttackClick(e) {
        const selectedRow = e.target.dataset.row
        const selectedCol = e.target.dataset.column;

        if (!selectedCol || !selectedRow) return;

        //Play the round and update the board (to the current player because it was changed in the playround function)
        const result = game.playRound(selectedRow, selectedCol);

        if (!result.valid) return;

        const boards = document.querySelectorAll('.board');
        const playerBoard = boards[0];
        const opponentBoard = boards[1];

        disableDragAndDrop(playerBoard);

        updateBoard(game.currentPlayer, selectedRow, selectedCol, result.hit);

        if (result.ship) if (result.ship.sunk) markShipSunk(game.currentPlayer, result.ship);

        if (result.gameOver) {
            showGameOver(result.winner);
            container.removeEventListener('click', containerClickHandler);
            game.addTurn();
            return;
        }

        if (game.currentPlayer.type === 'computer') {
            playComputerTurn();
        } else {
            updateTurnDisplay();
            updateDescription(game.otherPlayer, selectedRow, selectedCol, result);
            game.otherPlayer.hasMadeMove = true;
        }
    }

    function playComputerTurn() {
        const { row, col } = ai.getNextMove();
        const result = game.playRound(row, col);
        ai.registerHit(row, col, result);

        updateBoard(game.currentPlayer, row, col, result.hit);
        updateDescription(game.otherPlayer, row, col, result);

        if (result.ship) if (result.ship.sunk) markShipSunk(game.currentPlayer, result.ship);
        if (result.gameOver) {
            showGameOver(result.winner);
            container.removeEventListener('click', containerClickHandler);
            return;
        }
    }

    function updateTurnDisplay() {
        const boards = document.querySelectorAll('.board');
        const playerBoard = boards[0];
        const opponentBoard = boards[1];
        if (!game.human.ismyTurn) {
            opponentBoard.removeEventListener('click', handleAttackClick);
        }
        else {
            playerBoard.removeEventListener('click', handleAttackClick);
        }
    }

    function board1ReadyHandler() {
        game.human.ready = true;
        game.addTurn();

        const dialogText = document.querySelector('.text');
        dialogText.textContent = `${game.otherPlayer.name} is ready, pass the device to ${game.currentPlayer.name}`;

        dialog.showModal();
        dialog.addEventListener('submit', readyDialogHandler);
    }

    function board2ReadyHandler(e) {
        game.opponent.ready = true;
        game.addTurn();

        const dialogText = document.querySelector('.text');
        dialogText.textContent = `${game.otherPlayer.name} is ready, pass the device to ${game.currentPlayer.name}`;

        dialog.showModal();
    }

    function readyDialogHandler(e) {
        e.preventDefault();
        renderNextRound();
        dialog.close();
    }

    function submitMove() {

        //TODO : detect if the player has already made a move, if not, show an alert
        if (!game.otherPlayer.hasMadeMove) {
            alert('Make a move before submitting !');
            return;
        }

        game.otherPlayer.hasMadeMove = false;

        const dialogText = document.querySelector('.text');
        dialogText.textContent = `${game.otherPlayer.name} has played, pass the device to ${game.currentPlayer.name}`;

        dialog.showModal();
        dialog.addEventListener('submit', (e) => {
            e.preventDefault();
            renderNextRound();
            dialog.close();
        });
    }


    return { start };
})();
;// ./src/index.js







const firstNameDialog = document.querySelector('dialog.first-player-name');
firstNameDialog.showModal();
firstNameDialog.addEventListener('submit', firstPlayerNameSubmit);

function firstPlayerNameSubmit(e) {
    e.preventDefault();
    const input = document.querySelector('input.first-player-name');

    const player1 = new Player("human", true, input.value);
    const computer = new Player("computer", false, "Computer");
    // const opponent = new Player("human", false, "Cyrielle");

    const game = new GameFlow([player1, computer]);

    screenController.start(game);

    firstNameDialog.close();
}


/******/ })()
;
//# sourceMappingURL=main.js.map