!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).easypayCheckout={})}(this,(function(e){"use strict";var t=function(){return t=Object.assign||function(e){for(var t,o=1,n=arguments.length;o<n;o++)for(var i in t=arguments[o])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e},t.apply(this,arguments)},o=window.CustomEvent;function n(e,t){var o="on"+t.type.toLowerCase();return"function"==typeof e[o]&&e[o](t),e.dispatchEvent(t)}function i(e){for(;e;){if("dialog"===e.localName)return e;e=e.parentElement?e.parentElement:e.parentNode?e.parentNode.host:null}return null}function a(e){for(;e&&e.shadowRoot&&e.shadowRoot.activeElement;)e=e.shadowRoot.activeElement;e&&e.blur&&e!==document.body&&e.blur()}function r(e,t){for(var o=0;o<e.length;++o)if(e[o]===t)return!0;return!1}function s(e){return!(!e||!e.hasAttribute("method"))&&"dialog"===e.getAttribute("method").toLowerCase()}function l(e){var t=["button","input","keygen","select","textarea"].map((function(e){return e+":not([disabled])"}));t.push('[tabindex]:not([disabled]):not([tabindex=""])');var o=e.querySelector(t.join(", "));if(!o&&"attachShadow"in Element.prototype)for(var n=e.querySelectorAll("*"),i=0;i<n.length&&!(n[i].tagName&&n[i].shadowRoot&&(o=l(n[i].shadowRoot)));i++);return o}function d(e){return e.isConnected||document.body.contains(e)}function c(e){if(e.submitter)return e.submitter;var t=e.target;if(!(t instanceof HTMLFormElement))return null;var o=p.formSubmitter;if(!o){var n=e.target;o=("getRootNode"in n&&n.getRootNode()||document).activeElement}return o&&o.form===t?o:null}function u(e){if(!e.defaultPrevented){var t=e.target,o=p.imagemapUseValue,n=c(e);null===o&&n&&(o=n.value);var a=i(t);if(a)"dialog"===(n&&n.getAttribute("formmethod")||t.getAttribute("method"))&&(e.preventDefault(),null!=o?a.close(o):a.close())}}function h(e){if(this.dialog_=e,this.replacedStyleTop_=!1,this.openAsModal_=!1,e.hasAttribute("role")||e.setAttribute("role","dialog"),e.show=this.show.bind(this),e.showModal=this.showModal.bind(this),e.close=this.close.bind(this),e.addEventListener("submit",u,!1),"returnValue"in e||(e.returnValue=""),"MutationObserver"in window){new MutationObserver(this.maybeHideModal.bind(this)).observe(e,{attributes:!0,attributeFilter:["open"]})}else{var t,o=!1,n=function(){o?this.downgradeModal():this.maybeHideModal(),o=!1}.bind(this),i=function(i){if(i.target===e){var a="DOMNodeRemoved";o|=i.type.substr(0,a.length)===a,window.clearTimeout(t),t=window.setTimeout(n,0)}};["DOMAttrModified","DOMNodeRemoved","DOMNodeRemovedFromDocument"].forEach((function(t){e.addEventListener(t,i)}))}Object.defineProperty(e,"open",{set:this.setOpen.bind(this),get:e.hasAttribute.bind(e,"open")}),this.backdrop_=document.createElement("div"),this.backdrop_.className="backdrop",this.backdrop_.addEventListener("mouseup",this.backdropMouseEvent_.bind(this)),this.backdrop_.addEventListener("mousedown",this.backdropMouseEvent_.bind(this)),this.backdrop_.addEventListener("click",this.backdropMouseEvent_.bind(this))}o&&"object"!=typeof o||((o=function(e,t){t=t||{};var o=document.createEvent("CustomEvent");return o.initCustomEvent(e,!!t.bubbles,!!t.cancelable,t.detail||null),o}).prototype=window.Event.prototype),h.prototype={get dialog(){return this.dialog_},maybeHideModal:function(){this.dialog_.hasAttribute("open")&&d(this.dialog_)||this.downgradeModal()},downgradeModal:function(){this.openAsModal_&&(this.openAsModal_=!1,this.dialog_.style.zIndex="",this.replacedStyleTop_&&(this.dialog_.style.top="",this.replacedStyleTop_=!1),this.backdrop_.parentNode&&this.backdrop_.parentNode.removeChild(this.backdrop_),p.dm.removeDialog(this))},setOpen:function(e){e?this.dialog_.hasAttribute("open")||this.dialog_.setAttribute("open",""):(this.dialog_.removeAttribute("open"),this.maybeHideModal())},backdropMouseEvent_:function(e){if(this.dialog_.hasAttribute("tabindex"))this.dialog_.focus();else{var t=document.createElement("div");this.dialog_.insertBefore(t,this.dialog_.firstChild),t.tabIndex=-1,t.focus(),this.dialog_.removeChild(t)}var o=document.createEvent("MouseEvents");o.initMouseEvent(e.type,e.bubbles,e.cancelable,window,e.detail,e.screenX,e.screenY,e.clientX,e.clientY,e.ctrlKey,e.altKey,e.shiftKey,e.metaKey,e.button,e.relatedTarget),this.dialog_.dispatchEvent(o),e.stopPropagation()},focus_:function(){var e=this.dialog_.querySelector("[autofocus]:not([disabled])");!e&&this.dialog_.tabIndex>=0&&(e=this.dialog_),e||(e=l(this.dialog_)),a(document.activeElement),e&&e.focus()},updateZIndex:function(e,t){if(e<t)throw new Error("dialogZ should never be < backdropZ");this.dialog_.style.zIndex=e,this.backdrop_.style.zIndex=t},show:function(){this.dialog_.open||(this.setOpen(!0),this.focus_())},showModal:function(){if(this.dialog_.hasAttribute("open"))throw new Error("Failed to execute 'showModal' on dialog: The element is already open, and therefore cannot be opened modally.");if(!d(this.dialog_))throw new Error("Failed to execute 'showModal' on dialog: The element is not in a Document.");if(!p.dm.pushDialog(this))throw new Error("Failed to execute 'showModal' on dialog: There are too many open modal dialogs.");(function(e){for(;e&&e!==document.body;){var t=window.getComputedStyle(e),o=function(e,o){return!(void 0===t[e]||t[e]===o)};if(t.opacity<1||o("zIndex","auto")||o("transform","none")||o("mixBlendMode","normal")||o("filter","none")||o("perspective","none")||"isolate"===t.isolation||"fixed"===t.position||"touch"===t.webkitOverflowScrolling)return!0;e=e.parentElement}return!1})(this.dialog_.parentElement)&&console.warn("A dialog is being shown inside a stacking context. This may cause it to be unusable. For more information, see this link: https://github.com/GoogleChrome/dialog-polyfill/#stacking-context"),this.setOpen(!0),this.openAsModal_=!0,p.needsCentering(this.dialog_)?(p.reposition(this.dialog_),this.replacedStyleTop_=!0):this.replacedStyleTop_=!1,this.dialog_.parentNode.insertBefore(this.backdrop_,this.dialog_.nextSibling),this.focus_()},close:function(e){if(!this.dialog_.hasAttribute("open"))throw new Error("Failed to execute 'close' on dialog: The element does not have an 'open' attribute, and therefore cannot be closed.");this.setOpen(!1),void 0!==e&&(this.dialog_.returnValue=e);var t=new o("close",{bubbles:!1,cancelable:!1});n(this.dialog_,t)}};var p={reposition:function(e){var t=document.body.scrollTop||document.documentElement.scrollTop,o=t+(window.innerHeight-e.offsetHeight)/2;e.style.top=Math.max(t,o)+"px"},isInlinePositionSetByStylesheet:function(e){for(var t=0;t<document.styleSheets.length;++t){var o=document.styleSheets[t],n=null;try{n=o.cssRules}catch(e){}if(n)for(var i=0;i<n.length;++i){var a=n[i],s=null;try{s=document.querySelectorAll(a.selectorText)}catch(e){}if(s&&r(s,e)){var l=a.style.getPropertyValue("top"),d=a.style.getPropertyValue("bottom");if(l&&"auto"!==l||d&&"auto"!==d)return!0}}}return!1},needsCentering:function(e){return"absolute"===window.getComputedStyle(e).position&&(!("auto"!==e.style.top&&""!==e.style.top||"auto"!==e.style.bottom&&""!==e.style.bottom)&&!p.isInlinePositionSetByStylesheet(e))},forceRegisterDialog:function(e){if((window.HTMLDialogElement||e.showModal)&&console.warn("This browser already supports <dialog>, the polyfill may not work correctly",e),"dialog"!==e.localName)throw new Error("Failed to register dialog: The element is not a dialog.");new h(e)},registerDialog:function(e){e.showModal||p.forceRegisterDialog(e)},DialogManager:function(){this.pendingDialogStack=[];var e=this.checkDOM_.bind(this);this.overlay=document.createElement("div"),this.overlay.className="_dialog_overlay",this.overlay.addEventListener("click",function(t){this.forwardTab_=void 0,t.stopPropagation(),e([])}.bind(this)),this.handleKey_=this.handleKey_.bind(this),this.handleFocus_=this.handleFocus_.bind(this),this.zIndexLow_=1e5,this.zIndexHigh_=100150,this.forwardTab_=void 0,"MutationObserver"in window&&(this.mo_=new MutationObserver((function(t){var o=[];t.forEach((function(e){for(var t,n=0;t=e.removedNodes[n];++n)t instanceof Element&&("dialog"===t.localName&&o.push(t),o=o.concat(t.querySelectorAll("dialog")))})),o.length&&e(o)})))}};if(p.DialogManager.prototype.blockDocument=function(){document.documentElement.addEventListener("focus",this.handleFocus_,!0),document.addEventListener("keydown",this.handleKey_),this.mo_&&this.mo_.observe(document,{childList:!0,subtree:!0})},p.DialogManager.prototype.unblockDocument=function(){document.documentElement.removeEventListener("focus",this.handleFocus_,!0),document.removeEventListener("keydown",this.handleKey_),this.mo_&&this.mo_.disconnect()},p.DialogManager.prototype.updateStacking=function(){for(var e,t=this.zIndexHigh_,o=0;e=this.pendingDialogStack[o];++o)e.updateZIndex(--t,--t),0===o&&(this.overlay.style.zIndex=--t);var n=this.pendingDialogStack[0];n?(n.dialog.parentNode||document.body).appendChild(this.overlay):this.overlay.parentNode&&this.overlay.parentNode.removeChild(this.overlay)},p.DialogManager.prototype.containedByTopDialog_=function(e){for(;e=i(e);){for(var t,o=0;t=this.pendingDialogStack[o];++o)if(t.dialog===e)return 0===o;e=e.parentElement}return!1},p.DialogManager.prototype.handleFocus_=function(e){var t=e.composedPath?e.composedPath()[0]:e.target;if(!this.containedByTopDialog_(t)&&document.activeElement!==document.documentElement&&(e.preventDefault(),e.stopPropagation(),a(t),void 0!==this.forwardTab_)){var o=this.pendingDialogStack[0];return o.dialog.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_PRECEDING&&(this.forwardTab_?o.focus_():t!==document.documentElement&&document.documentElement.focus()),!1}},p.DialogManager.prototype.handleKey_=function(e){if(this.forwardTab_=void 0,27===e.keyCode){e.preventDefault(),e.stopPropagation();var t=new o("cancel",{bubbles:!1,cancelable:!0}),i=this.pendingDialogStack[0];i&&n(i.dialog,t)&&i.dialog.close()}else 9===e.keyCode&&(this.forwardTab_=!e.shiftKey)},p.DialogManager.prototype.checkDOM_=function(e){this.pendingDialogStack.slice().forEach((function(t){-1!==e.indexOf(t.dialog)?t.downgradeModal():t.maybeHideModal()}))},p.DialogManager.prototype.pushDialog=function(e){var t=(this.zIndexHigh_-this.zIndexLow_)/2-1;return!(this.pendingDialogStack.length>=t)&&(1===this.pendingDialogStack.unshift(e)&&this.blockDocument(),this.updateStacking(),!0)},p.DialogManager.prototype.removeDialog=function(e){var t=this.pendingDialogStack.indexOf(e);-1!==t&&(this.pendingDialogStack.splice(t,1),0===this.pendingDialogStack.length&&this.unblockDocument(),this.updateStacking())},p.dm=new p.DialogManager,p.formSubmitter=null,p.imagemapUseValue=null,void 0===window.HTMLDialogElement){var m=document.createElement("form");if(m.setAttribute("method","dialog"),"dialog"!==m.method){var g=Object.getOwnPropertyDescriptor(HTMLFormElement.prototype,"method");if(g){var f=g.get;g.get=function(){return s(this)?"dialog":f.call(this)};var b=g.set;g.set=function(e){return"string"==typeof e&&"dialog"===e.toLowerCase()?this.setAttribute("method",e):b.call(this,e)},Object.defineProperty(HTMLFormElement.prototype,"method",g)}}document.addEventListener("click",(function(e){if(p.formSubmitter=null,p.imagemapUseValue=null,!e.defaultPrevented){var t=e.target;if("composedPath"in e)t=e.composedPath().shift()||t;if(t&&s(t.form)){if(!("submit"===t.type&&["button","input"].indexOf(t.localName)>-1)){if("input"!==t.localName||"image"!==t.type)return;p.imagemapUseValue=e.offsetX+","+e.offsetY}i(t)&&(p.formSubmitter=t)}}}),!1),document.addEventListener("submit",(function(e){var t=e.target;if(!i(t)){var o=c(e);"dialog"===(o&&o.getAttribute("formmethod")||t.getAttribute("method"))&&e.preventDefault()}}));var y=HTMLFormElement.prototype.submit;HTMLFormElement.prototype.submit=function(){if(!s(this))return y.call(this);var e=i(this);e&&e.close()}}var v={id:"easypay-checkout",onSuccess:function(){},onError:function(){},testing:!1,display:"inline"},w=function(){function e(o,n){var i;if(this.manifest=o,this.givenOptions=n,this.dialog=null,this.style=null,this.hostElement=null,this.originUrl=e.PROD_URL,this.messageHandler=null,this.clickHandler=null,this.options=t(t({},v),n),this.validateParameters(o,this.options)){this.options.testing&&(this.originUrl=e.TEST_URL),this.messageHandler=this.handleMessage.bind(this),window.addEventListener("message",this.messageHandler);var a=document.createElement("iframe");a.setAttribute("src","".concat(this.originUrl,"?manifest=").concat(this.encodeManifest(o))),a.setAttribute("width","400"),a.setAttribute("height","700"),a.setAttribute("frameborder","0"),this.hostElement=document.getElementById(this.options.id),"popup"===this.options.display?(null!==this.hostElement&&(this.createPopupDOMTree(a),this.clickHandler=this.handleClick.bind(this)),this.hostElement.addEventListener("click",this.clickHandler)):null===(i=this.hostElement)||void 0===i||i.appendChild(a)}}return e.prototype.validateParameters=function(t,o){return t&&"string"==typeof t.id&&""!==t.id&&"string"==typeof t.session&&""!==t.session?"string"!=typeof o.id||""===o.id?(console.error("".concat(e.LOGTAG," The HTML element id must be a non-empty string.")),!1):document.getElementById(o.id)?"function"!=typeof o.onSuccess?(console.error("".concat(e.LOGTAG," The onSuccess callback must be a function.")),!1):"function"!=typeof o.onError?(console.error("".concat(e.LOGTAG," The onError callback must be a function.")),!1):o.onClose&&"function"!=typeof o.onClose?(console.error("".concat(e.LOGTAG," The onClose callback must be a function.")),!1):o.onClose&&"inline"===o.display?(console.error("".concat(e.LOGTAG," The onClose callback can only be used with display popup.")),!1):"boolean"!=typeof o.testing?(console.error("".concat(e.LOGTAG," The testing option must be true or false.")),!1):!("string"!=typeof o.display||!["inline","popup"].includes(o.display))||(console.error("".concat(e.LOGTAG," The display option must be 'inline' or 'popup'.")),!1):(console.error("".concat(e.LOGTAG," Could not find element ").concat(o.id,".")),!1):(console.error("".concat(e.LOGTAG," Please provide a valid Checkout Manifest when calling startCheckout.")),!1)},e.prototype.encodeManifest=function(e){return"undefined"!=typeof Buffer?Buffer.from(JSON.stringify(e),"binary").toString("base64"):window.btoa(JSON.stringify(e))},e.prototype.handleMessage=function(e){e.origin===this.originUrl&&"ep-checkout"===e.data.type&&("close"===e.data.status&&this.options.onClose&&(this.dialog&&this.dialog.close(),this.options.onClose()),"success"===e.data.status?(this.options.onSuccess(e.data.payment),this.messageHandler&&window.removeEventListener("message",this.messageHandler)):"error"===e.data.status&&this.options.onError(e.data.error))},e.prototype.handleClick=function(){this.dialog.showModal()},e.prototype.createPopupDOMTree=function(e){var t=document.createElement("dialog"),o=document.createElement("div"),n=document.createElement("style");n.setAttribute("type","text/css"),"function"!=typeof t.showModal&&(n.appendChild(document.createTextNode("dialog {\n  position: absolute;\n  left: 0; right: 0;\n  width: -moz-fit-content;\n  width: -webkit-fit-content;\n  width: fit-content;\n  height: -moz-fit-content;\n  height: -webkit-fit-content;\n  height: fit-content;\n  margin: auto;\n  border: solid;\n  padding: 1em;\n  background: white;\n  color: black;\n  display: block;\n}\n\ndialog:not([open]) {\n  display: none;\n}\n\ndialog + .backdrop {\n  position: fixed;\n  top: 0; right: 0; bottom: 0; left: 0;\n  background: rgba(0,0,0,0.1);\n}\n\n._dialog_overlay {\n  position: fixed;\n  top: 0; right: 0; bottom: 0; left: 0;\n}\n\ndialog.fixed {\n  position: fixed;\n  top: 50%;\n  transform: translate(0, -50%);\n}")),p.registerDialog(t)),n.appendChild(document.createTextNode("dialog.epcsdk-modal {\n  border: 0.5px solid #dadada;\n  border-radius: 10px;\n  transition: 200ms linear;\n  background-color: white;\n  width: 400px;\n  max-width: 80%;\n}\n\ndialog.epcsdk-modal::backdrop {\n  background-color: rgba(0, 0, 0, 0.5);\n  transition: 200ms ease-in-out;\n}\n\ndialog.epcsdk-modal + .backdrop {\n  /* polyfill */\n  background-color: rgba(0, 0, 0, 0.5);\n  transition: 200ms ease-in-out;\n}\n")),document.head.appendChild(n),t.setAttribute("class","epcsdk-modal"),o.appendChild(e),t.appendChild(o),document.body.appendChild(t),this.dialog=t,this.style=n},e.prototype.unmount=function(){var e,t,o;this.messageHandler&&window.removeEventListener("message",this.messageHandler),this.clickHandler&&(null===(e=this.hostElement)||void 0===e||e.removeEventListener("click",this.clickHandler)),this.dialog&&(this.dialog.remove(),null===(t=this.style)||void 0===t||t.remove()),Array.from((null===(o=document.getElementById(this.options.id))||void 0===o?void 0:o.children)||[]).map((function(e){e.remove()}))},e.PROD_URL="https://pay.easypay.pt",e.TEST_URL="https://pay.sandbox.easypay.pt",e.LOGTAG="[easypay Checkout SDK]",e}();e.CheckoutInstance=w,e.startCheckout=function(e,t){return void 0===t&&(t={}),new w(e,t)},Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=bundle.js.map
