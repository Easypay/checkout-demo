(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.easypayCheckout = {}));
})(this, (function (exports) { 'use strict';

    var __assign = (window && window.__assign) || function () {
        __assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    /**
     * The default values for all the options.
     */
    var defaultOptions = {
        id: 'easypay-checkout',
        onSuccess: function () { },
        onError: function () { },
        testing: false,
    };
    /**
     * Encapsulates a Checkout instance created by startCheckout.
     * Stores useful parameters and allows cleanup when unmount() is called.
     */
    var CheckoutInstance = /** @class */ (function () {
        /**
         * The class constructor. Sets up the iframe contents and event listener.
         */
        function CheckoutInstance(manifest, givenOptions) {
            var _a;
            this.manifest = manifest;
            this.givenOptions = givenOptions;
            this.originUrl = CheckoutInstance.PROD_URL;
            this.messageHandler = null;
            this.options = __assign(__assign({}, defaultOptions), givenOptions);
            if (!this.validateParameters(manifest, this.options)) {
                return;
            }
            if (this.options.testing) {
                this.originUrl = CheckoutInstance.TEST_URL;
            }
            this.messageHandler = this.handleMessage.bind(this);
            window.addEventListener('message', this.messageHandler);
            var iframe = document.createElement('iframe');
            iframe.setAttribute('src', "".concat(this.originUrl, "?manifest=").concat(this.encodeManifest(manifest)));
            // Using the attributes below in order to provide defaults without overriding CSS styles.
            iframe.setAttribute('width', '400');
            iframe.setAttribute('height', '700');
            iframe.setAttribute('frameborder', '0');
            (_a = document.getElementById(this.options.id)) === null || _a === void 0 ? void 0 : _a.appendChild(iframe);
        }
        /**
         * Validates the necessary parameters for Checkout initialization and gives helpful messages for integrators.
         */
        CheckoutInstance.prototype.validateParameters = function (manifest, options) {
            if (!manifest || typeof manifest.id !== 'string' || manifest.id === '' || typeof manifest.session !== 'string' || manifest.session === '') {
                console.error("".concat(CheckoutInstance.LOGTAG, " Please provide a valid Checkout Manifest when calling startCheckout."));
                return false;
            }
            if (typeof options.id !== 'string' || options.id === '') {
                console.error("".concat(CheckoutInstance.LOGTAG, " The HTML element id must be a non-empty string."));
                return false;
            }
            var el = document.getElementById(options.id);
            if (!el) {
                console.error("".concat(CheckoutInstance.LOGTAG, " Could not find element ").concat(options.id, "."));
                return false;
            }
            if (typeof options.onSuccess !== 'function') {
                console.error("".concat(CheckoutInstance.LOGTAG, " The onSuccess callback must be a function."));
                return false;
            }
            if (typeof options.onError !== 'function') {
                console.error("".concat(CheckoutInstance.LOGTAG, " The onError callback must be a function."));
                return false;
            }
            if (typeof options.testing !== 'boolean') {
                console.error("".concat(CheckoutInstance.LOGTAG, " The testing option must be true or false."));
                return false;
            }
            return true;
        };
        /**
         * Encodes a Manifest for iframe consumption. Supports both Node and browser environments.
         */
        CheckoutInstance.prototype.encodeManifest = function (manifest) {
            if (typeof Buffer !== 'undefined') {
                return Buffer.from(JSON.stringify(manifest), 'binary').toString('base64');
            }
            else {
                return window.btoa(JSON.stringify(manifest));
            }
        };
        /**
         * Handles messages sent from the Checkout iframe. If the origin and contents are as expected,
         * pass them on to the event handlers that were configured in startCheckout.
         *
         * If the Checkout becomes completed, automatically removes the event listener.
         */
        CheckoutInstance.prototype.handleMessage = function (e) {
            if (e.origin === this.originUrl && e.data.type === 'ep-checkout') {
                if (e.data.status === 'success') {
                    this.options.onSuccess(e.data.payment);
                    if (this.messageHandler) {
                        window.removeEventListener('message', this.messageHandler);
                    }
                }
                else if (e.data.status === 'error') {
                    this.options.onError(e.data.error);
                }
            }
        };
        /**
         * Used to cleanup Checkout by removing the DOM contents and event listener.
         */
        CheckoutInstance.prototype.unmount = function () {
            var _a;
            if (this.messageHandler) {
                window.removeEventListener('message', this.messageHandler);
            }
            var children = Array.from(((_a = document.getElementById(this.options.id)) === null || _a === void 0 ? void 0 : _a.children) || []);
            children.map(function (child) {
                child.remove();
            });
        };
        CheckoutInstance.PROD_URL = 'https://pay.easypay.pt';
        CheckoutInstance.TEST_URL = 'https://pay.sandbox.easypay.pt';
        CheckoutInstance.LOGTAG = '[easypay Checkout SDK]';
        return CheckoutInstance;
    }());
    /**
     * Used to configure and populate the Checkout form.
     *
     * Returns an instance of the CheckoutInstance class, which can be used to manage
     * the running Checkout (in particular, to unmount it).
     */
    function startCheckout(manifest, options) {
        if (options === void 0) { options = {}; }
        return new CheckoutInstance(manifest, options);
    }

    exports.CheckoutInstance = CheckoutInstance;
    exports.startCheckout = startCheckout;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
