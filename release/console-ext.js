(function (window) {
    /**
     * original console
     * @type {Console}
     */
    var originalConsole = window.console;
    /**
     * method members of the original console
     * @type {Array}
     */
    var methods = (function(methods) {
        methods = Object.keys(originalConsole);
        if (methods.length === 0) {
            methods = ['debug', 'error', 'info', 'log', 'warn', 'dir', 'dirxml',
                'table', 'trace', 'assert', 'count', 'markTimeline', 'profile',
                'profileEnd', 'time', 'timeEnd', 'timeStamp', 'timeline',
                'timelineEnd', 'group', 'groupCollapsed', 'groupEnd', 'clear'];
        }
        return methods;
    })([]);

    /**
     * console methods wraped by console-ext
     * @type {Object}
     */
    var wrappedMethods = {};

    /**
     * extensions pool
     * @type {Array}
     */
    var extensions = [];

    /**
     * console extension object
     * @type {Object}
     */
    var __ext__ = originalConsole.__ext__ = originalConsole.__ext__ || {

        extensions: extensions,

        wrappedMethods: wrappedMethods,

        /**
         * keep a reference of original console
         * @type {Console}
         */
        originalConsole: originalConsole,

        /**
         * Add an extension
         * @param {Object} extension
         * @param {Function} extension.log, extension.error, ... extension method,
         *   just like method member of original console
         * @return {Number} extension id
         */
        add: function(extension) {
            extensions.push(extension || {});
            return extensions.length - 1;
        },

        /**
         * Remove an extension
         * @param  {Number} extensionId extension id
         */
        remove: function(extensionId) {
            if (extensions[extensionId]) throw 'Illegal extensionId';
            delete extensions[extensionId];
        }
    };

    /**
     * wrap original console
     */
    methods.forEach(function(method) {
        var originalMethod = originalConsole[method];
        originalConsole[method] = wrappedMethods[method] = function() {
            var args = arguments;
            // call original console method
            originalMethod.apply(originalConsole, args);
            // call extension method
            extensions.forEach(function(extension) {
                if (!extension || typeof extension[method] !== 'function') return;
                extension[method].apply(extension, args);
            });
        };
    });


    /**
     * detect if an object is emptyy
     * @param  {Object}  o object to detect
     * @return {Boolean}   true if empty false otherwise
     */
    function isEmptyObject(o) {
        return Object.keys(o).length === 0;
    }

    /**
     * check if console or methods of console are modified,
     * turn modifies to extension of console __ext__, keep the console wrap still.
     */
    function check() {
        if (!window.console) {
            window.console = originalConsole;
            return;
        }
        if (console.toString() !== '[object Console]') {
            !isEmptyObject(console) && __ext__.add(console);
            window.console = originalConsole;
        } else {
            var _console = {}, currentConsole = window.console;
            methods.forEach(function(method) {
                if (currentConsole[method] === wrappedMethods[method]) return;
                var currentMethod = currentConsole[method];
                _console[method] = function() {
                    currentMethod.apply(currentConsole, arguments);
                };
                originalConsole[method] = wrappedMethods[method];
            });
            !isEmptyObject(_console) && __ext__.add(_console);
        }
    }

    /**
     * check every animation frame
     */
    function checkFrame() {
        (window.requestAnimationFrame || window.webkitRequestAnimationFrame)(
            function() {
                check();
                checkFrame && checkFrame();
            }
        );
    }

    function startCheck() {
        check();
        checkFrame && checkFrame();
    }

    startCheck();

})(window);