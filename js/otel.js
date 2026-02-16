(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // node_modules/@opentelemetry/api/build/esm/platform/browser/globalThis.js
  var _globalThis = typeof globalThis === "object" ? globalThis : typeof self === "object" ? self : typeof window === "object" ? window : typeof global === "object" ? global : {};

  // node_modules/@opentelemetry/api/build/esm/version.js
  var VERSION = "1.9.0";

  // node_modules/@opentelemetry/api/build/esm/internal/semver.js
  var re = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
  function _makeCompatibilityCheck(ownVersion) {
    var acceptedVersions = /* @__PURE__ */ new Set([ownVersion]);
    var rejectedVersions = /* @__PURE__ */ new Set();
    var myVersionMatch = ownVersion.match(re);
    if (!myVersionMatch) {
      return function() {
        return false;
      };
    }
    var ownVersionParsed = {
      major: +myVersionMatch[1],
      minor: +myVersionMatch[2],
      patch: +myVersionMatch[3],
      prerelease: myVersionMatch[4]
    };
    if (ownVersionParsed.prerelease != null) {
      return function isExactmatch(globalVersion) {
        return globalVersion === ownVersion;
      };
    }
    function _reject(v2) {
      rejectedVersions.add(v2);
      return false;
    }
    function _accept(v2) {
      acceptedVersions.add(v2);
      return true;
    }
    return function isCompatible2(globalVersion) {
      if (acceptedVersions.has(globalVersion)) {
        return true;
      }
      if (rejectedVersions.has(globalVersion)) {
        return false;
      }
      var globalVersionMatch = globalVersion.match(re);
      if (!globalVersionMatch) {
        return _reject(globalVersion);
      }
      var globalVersionParsed = {
        major: +globalVersionMatch[1],
        minor: +globalVersionMatch[2],
        patch: +globalVersionMatch[3],
        prerelease: globalVersionMatch[4]
      };
      if (globalVersionParsed.prerelease != null) {
        return _reject(globalVersion);
      }
      if (ownVersionParsed.major !== globalVersionParsed.major) {
        return _reject(globalVersion);
      }
      if (ownVersionParsed.major === 0) {
        if (ownVersionParsed.minor === globalVersionParsed.minor && ownVersionParsed.patch <= globalVersionParsed.patch) {
          return _accept(globalVersion);
        }
        return _reject(globalVersion);
      }
      if (ownVersionParsed.minor <= globalVersionParsed.minor) {
        return _accept(globalVersion);
      }
      return _reject(globalVersion);
    };
  }
  var isCompatible = _makeCompatibilityCheck(VERSION);

  // node_modules/@opentelemetry/api/build/esm/internal/global-utils.js
  var major = VERSION.split(".")[0];
  var GLOBAL_OPENTELEMETRY_API_KEY = /* @__PURE__ */ Symbol.for("opentelemetry.js.api." + major);
  var _global = _globalThis;
  function registerGlobal(type, instance, diag3, allowOverride) {
    var _a;
    if (allowOverride === void 0) {
      allowOverride = false;
    }
    var api = _global[GLOBAL_OPENTELEMETRY_API_KEY] = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) !== null && _a !== void 0 ? _a : {
      version: VERSION
    };
    if (!allowOverride && api[type]) {
      var err = new Error("@opentelemetry/api: Attempted duplicate registration of API: " + type);
      diag3.error(err.stack || err.message);
      return false;
    }
    if (api.version !== VERSION) {
      var err = new Error("@opentelemetry/api: Registration of version v" + api.version + " for " + type + " does not match previously registered API v" + VERSION);
      diag3.error(err.stack || err.message);
      return false;
    }
    api[type] = instance;
    diag3.debug("@opentelemetry/api: Registered a global for " + type + " v" + VERSION + ".");
    return true;
  }
  function getGlobal(type) {
    var _a, _b;
    var globalVersion = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _a === void 0 ? void 0 : _a.version;
    if (!globalVersion || !isCompatible(globalVersion)) {
      return;
    }
    return (_b = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _b === void 0 ? void 0 : _b[type];
  }
  function unregisterGlobal(type, diag3) {
    diag3.debug("@opentelemetry/api: Unregistering a global for " + type + " v" + VERSION + ".");
    var api = _global[GLOBAL_OPENTELEMETRY_API_KEY];
    if (api) {
      delete api[type];
    }
  }

  // node_modules/@opentelemetry/api/build/esm/diag/ComponentLogger.js
  var __read = function(o2, n2) {
    var m2 = typeof Symbol === "function" && o2[Symbol.iterator];
    if (!m2) return o2;
    var i2 = m2.call(o2), r2, ar = [], e2;
    try {
      while ((n2 === void 0 || n2-- > 0) && !(r2 = i2.next()).done) ar.push(r2.value);
    } catch (error) {
      e2 = { error };
    } finally {
      try {
        if (r2 && !r2.done && (m2 = i2["return"])) m2.call(i2);
      } finally {
        if (e2) throw e2.error;
      }
    }
    return ar;
  };
  var __spreadArray = function(to, from, pack) {
    if (pack || arguments.length === 2) for (var i2 = 0, l2 = from.length, ar; i2 < l2; i2++) {
      if (ar || !(i2 in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i2);
        ar[i2] = from[i2];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var DiagComponentLogger = (
    /** @class */
    (function() {
      function DiagComponentLogger2(props) {
        this._namespace = props.namespace || "DiagComponentLogger";
      }
      DiagComponentLogger2.prototype.debug = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return logProxy("debug", this._namespace, args);
      };
      DiagComponentLogger2.prototype.error = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return logProxy("error", this._namespace, args);
      };
      DiagComponentLogger2.prototype.info = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return logProxy("info", this._namespace, args);
      };
      DiagComponentLogger2.prototype.warn = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return logProxy("warn", this._namespace, args);
      };
      DiagComponentLogger2.prototype.verbose = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return logProxy("verbose", this._namespace, args);
      };
      return DiagComponentLogger2;
    })()
  );
  function logProxy(funcName, namespace, args) {
    var logger3 = getGlobal("diag");
    if (!logger3) {
      return;
    }
    args.unshift(namespace);
    return logger3[funcName].apply(logger3, __spreadArray([], __read(args), false));
  }

  // node_modules/@opentelemetry/api/build/esm/diag/types.js
  var DiagLogLevel;
  (function(DiagLogLevel2) {
    DiagLogLevel2[DiagLogLevel2["NONE"] = 0] = "NONE";
    DiagLogLevel2[DiagLogLevel2["ERROR"] = 30] = "ERROR";
    DiagLogLevel2[DiagLogLevel2["WARN"] = 50] = "WARN";
    DiagLogLevel2[DiagLogLevel2["INFO"] = 60] = "INFO";
    DiagLogLevel2[DiagLogLevel2["DEBUG"] = 70] = "DEBUG";
    DiagLogLevel2[DiagLogLevel2["VERBOSE"] = 80] = "VERBOSE";
    DiagLogLevel2[DiagLogLevel2["ALL"] = 9999] = "ALL";
  })(DiagLogLevel || (DiagLogLevel = {}));

  // node_modules/@opentelemetry/api/build/esm/diag/internal/logLevelLogger.js
  function createLogLevelDiagLogger(maxLevel, logger3) {
    if (maxLevel < DiagLogLevel.NONE) {
      maxLevel = DiagLogLevel.NONE;
    } else if (maxLevel > DiagLogLevel.ALL) {
      maxLevel = DiagLogLevel.ALL;
    }
    logger3 = logger3 || {};
    function _filterFunc(funcName, theLevel) {
      var theFunc = logger3[funcName];
      if (typeof theFunc === "function" && maxLevel >= theLevel) {
        return theFunc.bind(logger3);
      }
      return function() {
      };
    }
    return {
      error: _filterFunc("error", DiagLogLevel.ERROR),
      warn: _filterFunc("warn", DiagLogLevel.WARN),
      info: _filterFunc("info", DiagLogLevel.INFO),
      debug: _filterFunc("debug", DiagLogLevel.DEBUG),
      verbose: _filterFunc("verbose", DiagLogLevel.VERBOSE)
    };
  }

  // node_modules/@opentelemetry/api/build/esm/api/diag.js
  var __read2 = function(o2, n2) {
    var m2 = typeof Symbol === "function" && o2[Symbol.iterator];
    if (!m2) return o2;
    var i2 = m2.call(o2), r2, ar = [], e2;
    try {
      while ((n2 === void 0 || n2-- > 0) && !(r2 = i2.next()).done) ar.push(r2.value);
    } catch (error) {
      e2 = { error };
    } finally {
      try {
        if (r2 && !r2.done && (m2 = i2["return"])) m2.call(i2);
      } finally {
        if (e2) throw e2.error;
      }
    }
    return ar;
  };
  var __spreadArray2 = function(to, from, pack) {
    if (pack || arguments.length === 2) for (var i2 = 0, l2 = from.length, ar; i2 < l2; i2++) {
      if (ar || !(i2 in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i2);
        ar[i2] = from[i2];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var API_NAME = "diag";
  var DiagAPI = (
    /** @class */
    (function() {
      function DiagAPI2() {
        function _logProxy(funcName) {
          return function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            }
            var logger3 = getGlobal("diag");
            if (!logger3)
              return;
            return logger3[funcName].apply(logger3, __spreadArray2([], __read2(args), false));
          };
        }
        var self2 = this;
        var setLogger = function(logger3, optionsOrLogLevel) {
          var _a, _b, _c;
          if (optionsOrLogLevel === void 0) {
            optionsOrLogLevel = { logLevel: DiagLogLevel.INFO };
          }
          if (logger3 === self2) {
            var err = new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
            self2.error((_a = err.stack) !== null && _a !== void 0 ? _a : err.message);
            return false;
          }
          if (typeof optionsOrLogLevel === "number") {
            optionsOrLogLevel = {
              logLevel: optionsOrLogLevel
            };
          }
          var oldLogger = getGlobal("diag");
          var newLogger = createLogLevelDiagLogger((_b = optionsOrLogLevel.logLevel) !== null && _b !== void 0 ? _b : DiagLogLevel.INFO, logger3);
          if (oldLogger && !optionsOrLogLevel.suppressOverrideMessage) {
            var stack = (_c = new Error().stack) !== null && _c !== void 0 ? _c : "<failed to generate stacktrace>";
            oldLogger.warn("Current logger will be overwritten from " + stack);
            newLogger.warn("Current logger will overwrite one already registered from " + stack);
          }
          return registerGlobal("diag", newLogger, self2, true);
        };
        self2.setLogger = setLogger;
        self2.disable = function() {
          unregisterGlobal(API_NAME, self2);
        };
        self2.createComponentLogger = function(options) {
          return new DiagComponentLogger(options);
        };
        self2.verbose = _logProxy("verbose");
        self2.debug = _logProxy("debug");
        self2.info = _logProxy("info");
        self2.warn = _logProxy("warn");
        self2.error = _logProxy("error");
      }
      DiagAPI2.instance = function() {
        if (!this._instance) {
          this._instance = new DiagAPI2();
        }
        return this._instance;
      };
      return DiagAPI2;
    })()
  );

  // node_modules/@opentelemetry/api/build/esm/baggage/internal/baggage-impl.js
  var __read3 = function(o2, n2) {
    var m2 = typeof Symbol === "function" && o2[Symbol.iterator];
    if (!m2) return o2;
    var i2 = m2.call(o2), r2, ar = [], e2;
    try {
      while ((n2 === void 0 || n2-- > 0) && !(r2 = i2.next()).done) ar.push(r2.value);
    } catch (error) {
      e2 = { error };
    } finally {
      try {
        if (r2 && !r2.done && (m2 = i2["return"])) m2.call(i2);
      } finally {
        if (e2) throw e2.error;
      }
    }
    return ar;
  };
  var __values = function(o2) {
    var s2 = typeof Symbol === "function" && Symbol.iterator, m2 = s2 && o2[s2], i2 = 0;
    if (m2) return m2.call(o2);
    if (o2 && typeof o2.length === "number") return {
      next: function() {
        if (o2 && i2 >= o2.length) o2 = void 0;
        return { value: o2 && o2[i2++], done: !o2 };
      }
    };
    throw new TypeError(s2 ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var BaggageImpl = (
    /** @class */
    (function() {
      function BaggageImpl2(entries) {
        this._entries = entries ? new Map(entries) : /* @__PURE__ */ new Map();
      }
      BaggageImpl2.prototype.getEntry = function(key) {
        var entry = this._entries.get(key);
        if (!entry) {
          return void 0;
        }
        return Object.assign({}, entry);
      };
      BaggageImpl2.prototype.getAllEntries = function() {
        return Array.from(this._entries.entries()).map(function(_a) {
          var _b = __read3(_a, 2), k2 = _b[0], v2 = _b[1];
          return [k2, v2];
        });
      };
      BaggageImpl2.prototype.setEntry = function(key, entry) {
        var newBaggage = new BaggageImpl2(this._entries);
        newBaggage._entries.set(key, entry);
        return newBaggage;
      };
      BaggageImpl2.prototype.removeEntry = function(key) {
        var newBaggage = new BaggageImpl2(this._entries);
        newBaggage._entries.delete(key);
        return newBaggage;
      };
      BaggageImpl2.prototype.removeEntries = function() {
        var e_1, _a;
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          keys[_i] = arguments[_i];
        }
        var newBaggage = new BaggageImpl2(this._entries);
        try {
          for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
            var key = keys_1_1.value;
            newBaggage._entries.delete(key);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
        return newBaggage;
      };
      BaggageImpl2.prototype.clear = function() {
        return new BaggageImpl2();
      };
      return BaggageImpl2;
    })()
  );

  // node_modules/@opentelemetry/api/build/esm/baggage/internal/symbol.js
  var baggageEntryMetadataSymbol = /* @__PURE__ */ Symbol("BaggageEntryMetadata");

  // node_modules/@opentelemetry/api/build/esm/baggage/utils.js
  var diag = DiagAPI.instance();
  function createBaggage(entries) {
    if (entries === void 0) {
      entries = {};
    }
    return new BaggageImpl(new Map(Object.entries(entries)));
  }
  function baggageEntryMetadataFromString(str) {
    if (typeof str !== "string") {
      diag.error("Cannot create baggage metadata from unknown type: " + typeof str);
      str = "";
    }
    return {
      __TYPE__: baggageEntryMetadataSymbol,
      toString: function() {
        return str;
      }
    };
  }

  // node_modules/@opentelemetry/api/build/esm/context/context.js
  function createContextKey(description) {
    return Symbol.for(description);
  }
  var BaseContext = (
    /** @class */
    /* @__PURE__ */ (function() {
      function BaseContext2(parentContext) {
        var self2 = this;
        self2._currentContext = parentContext ? new Map(parentContext) : /* @__PURE__ */ new Map();
        self2.getValue = function(key) {
          return self2._currentContext.get(key);
        };
        self2.setValue = function(key, value) {
          var context2 = new BaseContext2(self2._currentContext);
          context2._currentContext.set(key, value);
          return context2;
        };
        self2.deleteValue = function(key) {
          var context2 = new BaseContext2(self2._currentContext);
          context2._currentContext.delete(key);
          return context2;
        };
      }
      return BaseContext2;
    })()
  );
  var ROOT_CONTEXT = new BaseContext();

  // node_modules/@opentelemetry/api/build/esm/metrics/NoopMeter.js
  var __extends = /* @__PURE__ */ (function() {
    var extendStatics = function(d2, b2) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b3) {
        d3.__proto__ = b3;
      } || function(d3, b3) {
        for (var p2 in b3) if (Object.prototype.hasOwnProperty.call(b3, p2)) d3[p2] = b3[p2];
      };
      return extendStatics(d2, b2);
    };
    return function(d2, b2) {
      if (typeof b2 !== "function" && b2 !== null)
        throw new TypeError("Class extends value " + String(b2) + " is not a constructor or null");
      extendStatics(d2, b2);
      function __() {
        this.constructor = d2;
      }
      d2.prototype = b2 === null ? Object.create(b2) : (__.prototype = b2.prototype, new __());
    };
  })();
  var NoopMeter = (
    /** @class */
    (function() {
      function NoopMeter2() {
      }
      NoopMeter2.prototype.createGauge = function(_name, _options) {
        return NOOP_GAUGE_METRIC;
      };
      NoopMeter2.prototype.createHistogram = function(_name, _options) {
        return NOOP_HISTOGRAM_METRIC;
      };
      NoopMeter2.prototype.createCounter = function(_name, _options) {
        return NOOP_COUNTER_METRIC;
      };
      NoopMeter2.prototype.createUpDownCounter = function(_name, _options) {
        return NOOP_UP_DOWN_COUNTER_METRIC;
      };
      NoopMeter2.prototype.createObservableGauge = function(_name, _options) {
        return NOOP_OBSERVABLE_GAUGE_METRIC;
      };
      NoopMeter2.prototype.createObservableCounter = function(_name, _options) {
        return NOOP_OBSERVABLE_COUNTER_METRIC;
      };
      NoopMeter2.prototype.createObservableUpDownCounter = function(_name, _options) {
        return NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
      };
      NoopMeter2.prototype.addBatchObservableCallback = function(_callback, _observables) {
      };
      NoopMeter2.prototype.removeBatchObservableCallback = function(_callback) {
      };
      return NoopMeter2;
    })()
  );
  var NoopMetric = (
    /** @class */
    /* @__PURE__ */ (function() {
      function NoopMetric2() {
      }
      return NoopMetric2;
    })()
  );
  var NoopCounterMetric = (
    /** @class */
    (function(_super) {
      __extends(NoopCounterMetric2, _super);
      function NoopCounterMetric2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      NoopCounterMetric2.prototype.add = function(_value, _attributes) {
      };
      return NoopCounterMetric2;
    })(NoopMetric)
  );
  var NoopUpDownCounterMetric = (
    /** @class */
    (function(_super) {
      __extends(NoopUpDownCounterMetric2, _super);
      function NoopUpDownCounterMetric2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      NoopUpDownCounterMetric2.prototype.add = function(_value, _attributes) {
      };
      return NoopUpDownCounterMetric2;
    })(NoopMetric)
  );
  var NoopGaugeMetric = (
    /** @class */
    (function(_super) {
      __extends(NoopGaugeMetric2, _super);
      function NoopGaugeMetric2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      NoopGaugeMetric2.prototype.record = function(_value, _attributes) {
      };
      return NoopGaugeMetric2;
    })(NoopMetric)
  );
  var NoopHistogramMetric = (
    /** @class */
    (function(_super) {
      __extends(NoopHistogramMetric2, _super);
      function NoopHistogramMetric2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      NoopHistogramMetric2.prototype.record = function(_value, _attributes) {
      };
      return NoopHistogramMetric2;
    })(NoopMetric)
  );
  var NoopObservableMetric = (
    /** @class */
    (function() {
      function NoopObservableMetric2() {
      }
      NoopObservableMetric2.prototype.addCallback = function(_callback) {
      };
      NoopObservableMetric2.prototype.removeCallback = function(_callback) {
      };
      return NoopObservableMetric2;
    })()
  );
  var NoopObservableCounterMetric = (
    /** @class */
    (function(_super) {
      __extends(NoopObservableCounterMetric2, _super);
      function NoopObservableCounterMetric2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      return NoopObservableCounterMetric2;
    })(NoopObservableMetric)
  );
  var NoopObservableGaugeMetric = (
    /** @class */
    (function(_super) {
      __extends(NoopObservableGaugeMetric2, _super);
      function NoopObservableGaugeMetric2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      return NoopObservableGaugeMetric2;
    })(NoopObservableMetric)
  );
  var NoopObservableUpDownCounterMetric = (
    /** @class */
    (function(_super) {
      __extends(NoopObservableUpDownCounterMetric2, _super);
      function NoopObservableUpDownCounterMetric2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      return NoopObservableUpDownCounterMetric2;
    })(NoopObservableMetric)
  );
  var NOOP_METER = new NoopMeter();
  var NOOP_COUNTER_METRIC = new NoopCounterMetric();
  var NOOP_GAUGE_METRIC = new NoopGaugeMetric();
  var NOOP_HISTOGRAM_METRIC = new NoopHistogramMetric();
  var NOOP_UP_DOWN_COUNTER_METRIC = new NoopUpDownCounterMetric();
  var NOOP_OBSERVABLE_COUNTER_METRIC = new NoopObservableCounterMetric();
  var NOOP_OBSERVABLE_GAUGE_METRIC = new NoopObservableGaugeMetric();
  var NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new NoopObservableUpDownCounterMetric();

  // node_modules/@opentelemetry/api/build/esm/propagation/TextMapPropagator.js
  var defaultTextMapGetter = {
    get: function(carrier, key) {
      if (carrier == null) {
        return void 0;
      }
      return carrier[key];
    },
    keys: function(carrier) {
      if (carrier == null) {
        return [];
      }
      return Object.keys(carrier);
    }
  };
  var defaultTextMapSetter = {
    set: function(carrier, key, value) {
      if (carrier == null) {
        return;
      }
      carrier[key] = value;
    }
  };

  // node_modules/@opentelemetry/api/build/esm/context/NoopContextManager.js
  var __read4 = function(o2, n2) {
    var m2 = typeof Symbol === "function" && o2[Symbol.iterator];
    if (!m2) return o2;
    var i2 = m2.call(o2), r2, ar = [], e2;
    try {
      while ((n2 === void 0 || n2-- > 0) && !(r2 = i2.next()).done) ar.push(r2.value);
    } catch (error) {
      e2 = { error };
    } finally {
      try {
        if (r2 && !r2.done && (m2 = i2["return"])) m2.call(i2);
      } finally {
        if (e2) throw e2.error;
      }
    }
    return ar;
  };
  var __spreadArray3 = function(to, from, pack) {
    if (pack || arguments.length === 2) for (var i2 = 0, l2 = from.length, ar; i2 < l2; i2++) {
      if (ar || !(i2 in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i2);
        ar[i2] = from[i2];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var NoopContextManager = (
    /** @class */
    (function() {
      function NoopContextManager2() {
      }
      NoopContextManager2.prototype.active = function() {
        return ROOT_CONTEXT;
      };
      NoopContextManager2.prototype.with = function(_context, fn, thisArg) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
          args[_i - 3] = arguments[_i];
        }
        return fn.call.apply(fn, __spreadArray3([thisArg], __read4(args), false));
      };
      NoopContextManager2.prototype.bind = function(_context, target) {
        return target;
      };
      NoopContextManager2.prototype.enable = function() {
        return this;
      };
      NoopContextManager2.prototype.disable = function() {
        return this;
      };
      return NoopContextManager2;
    })()
  );

  // node_modules/@opentelemetry/api/build/esm/api/context.js
  var __read5 = function(o2, n2) {
    var m2 = typeof Symbol === "function" && o2[Symbol.iterator];
    if (!m2) return o2;
    var i2 = m2.call(o2), r2, ar = [], e2;
    try {
      while ((n2 === void 0 || n2-- > 0) && !(r2 = i2.next()).done) ar.push(r2.value);
    } catch (error) {
      e2 = { error };
    } finally {
      try {
        if (r2 && !r2.done && (m2 = i2["return"])) m2.call(i2);
      } finally {
        if (e2) throw e2.error;
      }
    }
    return ar;
  };
  var __spreadArray4 = function(to, from, pack) {
    if (pack || arguments.length === 2) for (var i2 = 0, l2 = from.length, ar; i2 < l2; i2++) {
      if (ar || !(i2 in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i2);
        ar[i2] = from[i2];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var API_NAME2 = "context";
  var NOOP_CONTEXT_MANAGER = new NoopContextManager();
  var ContextAPI = (
    /** @class */
    (function() {
      function ContextAPI2() {
      }
      ContextAPI2.getInstance = function() {
        if (!this._instance) {
          this._instance = new ContextAPI2();
        }
        return this._instance;
      };
      ContextAPI2.prototype.setGlobalContextManager = function(contextManager) {
        return registerGlobal(API_NAME2, contextManager, DiagAPI.instance());
      };
      ContextAPI2.prototype.active = function() {
        return this._getContextManager().active();
      };
      ContextAPI2.prototype.with = function(context2, fn, thisArg) {
        var _a;
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
          args[_i - 3] = arguments[_i];
        }
        return (_a = this._getContextManager()).with.apply(_a, __spreadArray4([context2, fn, thisArg], __read5(args), false));
      };
      ContextAPI2.prototype.bind = function(context2, target) {
        return this._getContextManager().bind(context2, target);
      };
      ContextAPI2.prototype._getContextManager = function() {
        return getGlobal(API_NAME2) || NOOP_CONTEXT_MANAGER;
      };
      ContextAPI2.prototype.disable = function() {
        this._getContextManager().disable();
        unregisterGlobal(API_NAME2, DiagAPI.instance());
      };
      return ContextAPI2;
    })()
  );

  // node_modules/@opentelemetry/api/build/esm/trace/trace_flags.js
  var TraceFlags;
  (function(TraceFlags2) {
    TraceFlags2[TraceFlags2["NONE"] = 0] = "NONE";
    TraceFlags2[TraceFlags2["SAMPLED"] = 1] = "SAMPLED";
  })(TraceFlags || (TraceFlags = {}));

  // node_modules/@opentelemetry/api/build/esm/trace/invalid-span-constants.js
  var INVALID_SPANID = "0000000000000000";
  var INVALID_TRACEID = "00000000000000000000000000000000";
  var INVALID_SPAN_CONTEXT = {
    traceId: INVALID_TRACEID,
    spanId: INVALID_SPANID,
    traceFlags: TraceFlags.NONE
  };

  // node_modules/@opentelemetry/api/build/esm/trace/NonRecordingSpan.js
  var NonRecordingSpan = (
    /** @class */
    (function() {
      function NonRecordingSpan2(_spanContext) {
        if (_spanContext === void 0) {
          _spanContext = INVALID_SPAN_CONTEXT;
        }
        this._spanContext = _spanContext;
      }
      NonRecordingSpan2.prototype.spanContext = function() {
        return this._spanContext;
      };
      NonRecordingSpan2.prototype.setAttribute = function(_key, _value) {
        return this;
      };
      NonRecordingSpan2.prototype.setAttributes = function(_attributes) {
        return this;
      };
      NonRecordingSpan2.prototype.addEvent = function(_name, _attributes) {
        return this;
      };
      NonRecordingSpan2.prototype.addLink = function(_link) {
        return this;
      };
      NonRecordingSpan2.prototype.addLinks = function(_links) {
        return this;
      };
      NonRecordingSpan2.prototype.setStatus = function(_status) {
        return this;
      };
      NonRecordingSpan2.prototype.updateName = function(_name) {
        return this;
      };
      NonRecordingSpan2.prototype.end = function(_endTime) {
      };
      NonRecordingSpan2.prototype.isRecording = function() {
        return false;
      };
      NonRecordingSpan2.prototype.recordException = function(_exception, _time) {
      };
      return NonRecordingSpan2;
    })()
  );

  // node_modules/@opentelemetry/api/build/esm/trace/context-utils.js
  var SPAN_KEY = createContextKey("OpenTelemetry Context Key SPAN");
  function getSpan(context2) {
    return context2.getValue(SPAN_KEY) || void 0;
  }
  function getActiveSpan() {
    return getSpan(ContextAPI.getInstance().active());
  }
  function setSpan(context2, span) {
    return context2.setValue(SPAN_KEY, span);
  }
  function deleteSpan(context2) {
    return context2.deleteValue(SPAN_KEY);
  }
  function setSpanContext(context2, spanContext) {
    return setSpan(context2, new NonRecordingSpan(spanContext));
  }
  function getSpanContext(context2) {
    var _a;
    return (_a = getSpan(context2)) === null || _a === void 0 ? void 0 : _a.spanContext();
  }

  // node_modules/@opentelemetry/api/build/esm/trace/spancontext-utils.js
  var VALID_TRACEID_REGEX = /^([0-9a-f]{32})$/i;
  var VALID_SPANID_REGEX = /^[0-9a-f]{16}$/i;
  function isValidTraceId(traceId) {
    return VALID_TRACEID_REGEX.test(traceId) && traceId !== INVALID_TRACEID;
  }
  function isValidSpanId(spanId) {
    return VALID_SPANID_REGEX.test(spanId) && spanId !== INVALID_SPANID;
  }
  function isSpanContextValid(spanContext) {
    return isValidTraceId(spanContext.traceId) && isValidSpanId(spanContext.spanId);
  }
  function wrapSpanContext(spanContext) {
    return new NonRecordingSpan(spanContext);
  }

  // node_modules/@opentelemetry/api/build/esm/trace/NoopTracer.js
  var contextApi = ContextAPI.getInstance();
  var NoopTracer = (
    /** @class */
    (function() {
      function NoopTracer2() {
      }
      NoopTracer2.prototype.startSpan = function(name, options, context2) {
        if (context2 === void 0) {
          context2 = contextApi.active();
        }
        var root = Boolean(options === null || options === void 0 ? void 0 : options.root);
        if (root) {
          return new NonRecordingSpan();
        }
        var parentFromContext = context2 && getSpanContext(context2);
        if (isSpanContext(parentFromContext) && isSpanContextValid(parentFromContext)) {
          return new NonRecordingSpan(parentFromContext);
        } else {
          return new NonRecordingSpan();
        }
      };
      NoopTracer2.prototype.startActiveSpan = function(name, arg2, arg3, arg4) {
        var opts;
        var ctx;
        var fn;
        if (arguments.length < 2) {
          return;
        } else if (arguments.length === 2) {
          fn = arg2;
        } else if (arguments.length === 3) {
          opts = arg2;
          fn = arg3;
        } else {
          opts = arg2;
          ctx = arg3;
          fn = arg4;
        }
        var parentContext = ctx !== null && ctx !== void 0 ? ctx : contextApi.active();
        var span = this.startSpan(name, opts, parentContext);
        var contextWithSpanSet = setSpan(parentContext, span);
        return contextApi.with(contextWithSpanSet, fn, void 0, span);
      };
      return NoopTracer2;
    })()
  );
  function isSpanContext(spanContext) {
    return typeof spanContext === "object" && typeof spanContext["spanId"] === "string" && typeof spanContext["traceId"] === "string" && typeof spanContext["traceFlags"] === "number";
  }

  // node_modules/@opentelemetry/api/build/esm/trace/ProxyTracer.js
  var NOOP_TRACER = new NoopTracer();
  var ProxyTracer = (
    /** @class */
    (function() {
      function ProxyTracer2(_provider, name, version, options) {
        this._provider = _provider;
        this.name = name;
        this.version = version;
        this.options = options;
      }
      ProxyTracer2.prototype.startSpan = function(name, options, context2) {
        return this._getTracer().startSpan(name, options, context2);
      };
      ProxyTracer2.prototype.startActiveSpan = function(_name, _options, _context, _fn) {
        var tracer = this._getTracer();
        return Reflect.apply(tracer.startActiveSpan, tracer, arguments);
      };
      ProxyTracer2.prototype._getTracer = function() {
        if (this._delegate) {
          return this._delegate;
        }
        var tracer = this._provider.getDelegateTracer(this.name, this.version, this.options);
        if (!tracer) {
          return NOOP_TRACER;
        }
        this._delegate = tracer;
        return this._delegate;
      };
      return ProxyTracer2;
    })()
  );

  // node_modules/@opentelemetry/api/build/esm/trace/NoopTracerProvider.js
  var NoopTracerProvider = (
    /** @class */
    (function() {
      function NoopTracerProvider2() {
      }
      NoopTracerProvider2.prototype.getTracer = function(_name, _version, _options) {
        return new NoopTracer();
      };
      return NoopTracerProvider2;
    })()
  );

  // node_modules/@opentelemetry/api/build/esm/trace/ProxyTracerProvider.js
  var NOOP_TRACER_PROVIDER = new NoopTracerProvider();
  var ProxyTracerProvider = (
    /** @class */
    (function() {
      function ProxyTracerProvider2() {
      }
      ProxyTracerProvider2.prototype.getTracer = function(name, version, options) {
        var _a;
        return (_a = this.getDelegateTracer(name, version, options)) !== null && _a !== void 0 ? _a : new ProxyTracer(this, name, version, options);
      };
      ProxyTracerProvider2.prototype.getDelegate = function() {
        var _a;
        return (_a = this._delegate) !== null && _a !== void 0 ? _a : NOOP_TRACER_PROVIDER;
      };
      ProxyTracerProvider2.prototype.setDelegate = function(delegate) {
        this._delegate = delegate;
      };
      ProxyTracerProvider2.prototype.getDelegateTracer = function(name, version, options) {
        var _a;
        return (_a = this._delegate) === null || _a === void 0 ? void 0 : _a.getTracer(name, version, options);
      };
      return ProxyTracerProvider2;
    })()
  );

  // node_modules/@opentelemetry/api/build/esm/trace/SamplingResult.js
  var SamplingDecision;
  (function(SamplingDecision3) {
    SamplingDecision3[SamplingDecision3["NOT_RECORD"] = 0] = "NOT_RECORD";
    SamplingDecision3[SamplingDecision3["RECORD"] = 1] = "RECORD";
    SamplingDecision3[SamplingDecision3["RECORD_AND_SAMPLED"] = 2] = "RECORD_AND_SAMPLED";
  })(SamplingDecision || (SamplingDecision = {}));

  // node_modules/@opentelemetry/api/build/esm/trace/span_kind.js
  var SpanKind;
  (function(SpanKind2) {
    SpanKind2[SpanKind2["INTERNAL"] = 0] = "INTERNAL";
    SpanKind2[SpanKind2["SERVER"] = 1] = "SERVER";
    SpanKind2[SpanKind2["CLIENT"] = 2] = "CLIENT";
    SpanKind2[SpanKind2["PRODUCER"] = 3] = "PRODUCER";
    SpanKind2[SpanKind2["CONSUMER"] = 4] = "CONSUMER";
  })(SpanKind || (SpanKind = {}));

  // node_modules/@opentelemetry/api/build/esm/trace/status.js
  var SpanStatusCode;
  (function(SpanStatusCode2) {
    SpanStatusCode2[SpanStatusCode2["UNSET"] = 0] = "UNSET";
    SpanStatusCode2[SpanStatusCode2["OK"] = 1] = "OK";
    SpanStatusCode2[SpanStatusCode2["ERROR"] = 2] = "ERROR";
  })(SpanStatusCode || (SpanStatusCode = {}));

  // node_modules/@opentelemetry/api/build/esm/context-api.js
  var context = ContextAPI.getInstance();

  // node_modules/@opentelemetry/api/build/esm/diag-api.js
  var diag2 = DiagAPI.instance();

  // node_modules/@opentelemetry/api/build/esm/metrics/NoopMeterProvider.js
  var NoopMeterProvider = (
    /** @class */
    (function() {
      function NoopMeterProvider2() {
      }
      NoopMeterProvider2.prototype.getMeter = function(_name, _version, _options) {
        return NOOP_METER;
      };
      return NoopMeterProvider2;
    })()
  );
  var NOOP_METER_PROVIDER = new NoopMeterProvider();

  // node_modules/@opentelemetry/api/build/esm/api/metrics.js
  var API_NAME3 = "metrics";
  var MetricsAPI = (
    /** @class */
    (function() {
      function MetricsAPI2() {
      }
      MetricsAPI2.getInstance = function() {
        if (!this._instance) {
          this._instance = new MetricsAPI2();
        }
        return this._instance;
      };
      MetricsAPI2.prototype.setGlobalMeterProvider = function(provider) {
        return registerGlobal(API_NAME3, provider, DiagAPI.instance());
      };
      MetricsAPI2.prototype.getMeterProvider = function() {
        return getGlobal(API_NAME3) || NOOP_METER_PROVIDER;
      };
      MetricsAPI2.prototype.getMeter = function(name, version, options) {
        return this.getMeterProvider().getMeter(name, version, options);
      };
      MetricsAPI2.prototype.disable = function() {
        unregisterGlobal(API_NAME3, DiagAPI.instance());
      };
      return MetricsAPI2;
    })()
  );

  // node_modules/@opentelemetry/api/build/esm/metrics-api.js
  var metrics = MetricsAPI.getInstance();

  // node_modules/@opentelemetry/api/build/esm/propagation/NoopTextMapPropagator.js
  var NoopTextMapPropagator = (
    /** @class */
    (function() {
      function NoopTextMapPropagator2() {
      }
      NoopTextMapPropagator2.prototype.inject = function(_context, _carrier) {
      };
      NoopTextMapPropagator2.prototype.extract = function(context2, _carrier) {
        return context2;
      };
      NoopTextMapPropagator2.prototype.fields = function() {
        return [];
      };
      return NoopTextMapPropagator2;
    })()
  );

  // node_modules/@opentelemetry/api/build/esm/baggage/context-helpers.js
  var BAGGAGE_KEY = createContextKey("OpenTelemetry Baggage Key");
  function getBaggage(context2) {
    return context2.getValue(BAGGAGE_KEY) || void 0;
  }
  function getActiveBaggage() {
    return getBaggage(ContextAPI.getInstance().active());
  }
  function setBaggage(context2, baggage) {
    return context2.setValue(BAGGAGE_KEY, baggage);
  }
  function deleteBaggage(context2) {
    return context2.deleteValue(BAGGAGE_KEY);
  }

  // node_modules/@opentelemetry/api/build/esm/api/propagation.js
  var API_NAME4 = "propagation";
  var NOOP_TEXT_MAP_PROPAGATOR = new NoopTextMapPropagator();
  var PropagationAPI = (
    /** @class */
    (function() {
      function PropagationAPI2() {
        this.createBaggage = createBaggage;
        this.getBaggage = getBaggage;
        this.getActiveBaggage = getActiveBaggage;
        this.setBaggage = setBaggage;
        this.deleteBaggage = deleteBaggage;
      }
      PropagationAPI2.getInstance = function() {
        if (!this._instance) {
          this._instance = new PropagationAPI2();
        }
        return this._instance;
      };
      PropagationAPI2.prototype.setGlobalPropagator = function(propagator) {
        return registerGlobal(API_NAME4, propagator, DiagAPI.instance());
      };
      PropagationAPI2.prototype.inject = function(context2, carrier, setter) {
        if (setter === void 0) {
          setter = defaultTextMapSetter;
        }
        return this._getGlobalPropagator().inject(context2, carrier, setter);
      };
      PropagationAPI2.prototype.extract = function(context2, carrier, getter) {
        if (getter === void 0) {
          getter = defaultTextMapGetter;
        }
        return this._getGlobalPropagator().extract(context2, carrier, getter);
      };
      PropagationAPI2.prototype.fields = function() {
        return this._getGlobalPropagator().fields();
      };
      PropagationAPI2.prototype.disable = function() {
        unregisterGlobal(API_NAME4, DiagAPI.instance());
      };
      PropagationAPI2.prototype._getGlobalPropagator = function() {
        return getGlobal(API_NAME4) || NOOP_TEXT_MAP_PROPAGATOR;
      };
      return PropagationAPI2;
    })()
  );

  // node_modules/@opentelemetry/api/build/esm/propagation-api.js
  var propagation = PropagationAPI.getInstance();

  // node_modules/@opentelemetry/api/build/esm/api/trace.js
  var API_NAME5 = "trace";
  var TraceAPI = (
    /** @class */
    (function() {
      function TraceAPI2() {
        this._proxyTracerProvider = new ProxyTracerProvider();
        this.wrapSpanContext = wrapSpanContext;
        this.isSpanContextValid = isSpanContextValid;
        this.deleteSpan = deleteSpan;
        this.getSpan = getSpan;
        this.getActiveSpan = getActiveSpan;
        this.getSpanContext = getSpanContext;
        this.setSpan = setSpan;
        this.setSpanContext = setSpanContext;
      }
      TraceAPI2.getInstance = function() {
        if (!this._instance) {
          this._instance = new TraceAPI2();
        }
        return this._instance;
      };
      TraceAPI2.prototype.setGlobalTracerProvider = function(provider) {
        var success = registerGlobal(API_NAME5, this._proxyTracerProvider, DiagAPI.instance());
        if (success) {
          this._proxyTracerProvider.setDelegate(provider);
        }
        return success;
      };
      TraceAPI2.prototype.getTracerProvider = function() {
        return getGlobal(API_NAME5) || this._proxyTracerProvider;
      };
      TraceAPI2.prototype.getTracer = function(name, version) {
        return this.getTracerProvider().getTracer(name, version);
      };
      TraceAPI2.prototype.disable = function() {
        unregisterGlobal(API_NAME5, DiagAPI.instance());
        this._proxyTracerProvider = new ProxyTracerProvider();
      };
      return TraceAPI2;
    })()
  );

  // node_modules/@opentelemetry/api/build/esm/trace-api.js
  var trace = TraceAPI.getInstance();

  // node_modules/@opentelemetry/core/build/esm/trace/suppress-tracing.js
  var SUPPRESS_TRACING_KEY = createContextKey("OpenTelemetry SDK Context Key SUPPRESS_TRACING");
  function suppressTracing(context2) {
    return context2.setValue(SUPPRESS_TRACING_KEY, true);
  }
  function isTracingSuppressed(context2) {
    return context2.getValue(SUPPRESS_TRACING_KEY) === true;
  }

  // node_modules/@opentelemetry/core/build/esm/baggage/constants.js
  var BAGGAGE_KEY_PAIR_SEPARATOR = "=";
  var BAGGAGE_PROPERTIES_SEPARATOR = ";";
  var BAGGAGE_ITEMS_SEPARATOR = ",";
  var BAGGAGE_HEADER = "baggage";
  var BAGGAGE_MAX_NAME_VALUE_PAIRS = 180;
  var BAGGAGE_MAX_PER_NAME_VALUE_PAIRS = 4096;
  var BAGGAGE_MAX_TOTAL_LENGTH = 8192;

  // node_modules/@opentelemetry/core/build/esm/baggage/utils.js
  function serializeKeyPairs(keyPairs) {
    return keyPairs.reduce((hValue, current) => {
      const value = `${hValue}${hValue !== "" ? BAGGAGE_ITEMS_SEPARATOR : ""}${current}`;
      return value.length > BAGGAGE_MAX_TOTAL_LENGTH ? hValue : value;
    }, "");
  }
  function getKeyPairs(baggage) {
    return baggage.getAllEntries().map(([key, value]) => {
      let entry = `${encodeURIComponent(key)}=${encodeURIComponent(value.value)}`;
      if (value.metadata !== void 0) {
        entry += BAGGAGE_PROPERTIES_SEPARATOR + value.metadata.toString();
      }
      return entry;
    });
  }
  function parsePairKeyValue(entry) {
    if (!entry)
      return;
    const metadataSeparatorIndex = entry.indexOf(BAGGAGE_PROPERTIES_SEPARATOR);
    const keyPairPart = metadataSeparatorIndex === -1 ? entry : entry.substring(0, metadataSeparatorIndex);
    const separatorIndex = keyPairPart.indexOf(BAGGAGE_KEY_PAIR_SEPARATOR);
    if (separatorIndex <= 0)
      return;
    const rawKey = keyPairPart.substring(0, separatorIndex).trim();
    const rawValue = keyPairPart.substring(separatorIndex + 1).trim();
    if (!rawKey || !rawValue)
      return;
    let key;
    let value;
    try {
      key = decodeURIComponent(rawKey);
      value = decodeURIComponent(rawValue);
    } catch (e2) {
      return;
    }
    let metadata;
    if (metadataSeparatorIndex !== -1 && metadataSeparatorIndex < entry.length - 1) {
      const metadataString = entry.substring(metadataSeparatorIndex + 1);
      metadata = baggageEntryMetadataFromString(metadataString);
    }
    return { key, value, metadata };
  }

  // node_modules/@opentelemetry/core/build/esm/baggage/propagation/W3CBaggagePropagator.js
  var W3CBaggagePropagator = class {
    inject(context2, carrier, setter) {
      const baggage = propagation.getBaggage(context2);
      if (!baggage || isTracingSuppressed(context2))
        return;
      const keyPairs = getKeyPairs(baggage).filter((pair) => {
        return pair.length <= BAGGAGE_MAX_PER_NAME_VALUE_PAIRS;
      }).slice(0, BAGGAGE_MAX_NAME_VALUE_PAIRS);
      const headerValue = serializeKeyPairs(keyPairs);
      if (headerValue.length > 0) {
        setter.set(carrier, BAGGAGE_HEADER, headerValue);
      }
    }
    extract(context2, carrier, getter) {
      const headerValue = getter.get(carrier, BAGGAGE_HEADER);
      const baggageString = Array.isArray(headerValue) ? headerValue.join(BAGGAGE_ITEMS_SEPARATOR) : headerValue;
      if (!baggageString)
        return context2;
      const baggage = {};
      if (baggageString.length === 0) {
        return context2;
      }
      const pairs = baggageString.split(BAGGAGE_ITEMS_SEPARATOR);
      pairs.forEach((entry) => {
        const keyPair = parsePairKeyValue(entry);
        if (keyPair) {
          const baggageEntry = { value: keyPair.value };
          if (keyPair.metadata) {
            baggageEntry.metadata = keyPair.metadata;
          }
          baggage[keyPair.key] = baggageEntry;
        }
      });
      if (Object.entries(baggage).length === 0) {
        return context2;
      }
      return propagation.setBaggage(context2, propagation.createBaggage(baggage));
    }
    fields() {
      return [BAGGAGE_HEADER];
    }
  };

  // node_modules/@opentelemetry/core/build/esm/common/attributes.js
  function sanitizeAttributes(attributes) {
    const out = {};
    if (typeof attributes !== "object" || attributes == null) {
      return out;
    }
    for (const key in attributes) {
      if (!Object.prototype.hasOwnProperty.call(attributes, key)) {
        continue;
      }
      if (!isAttributeKey(key)) {
        diag2.warn(`Invalid attribute key: ${key}`);
        continue;
      }
      const val = attributes[key];
      if (!isAttributeValue(val)) {
        diag2.warn(`Invalid attribute value set for key: ${key}`);
        continue;
      }
      if (Array.isArray(val)) {
        out[key] = val.slice();
      } else {
        out[key] = val;
      }
    }
    return out;
  }
  function isAttributeKey(key) {
    return typeof key === "string" && key !== "";
  }
  function isAttributeValue(val) {
    if (val == null) {
      return true;
    }
    if (Array.isArray(val)) {
      return isHomogeneousAttributeValueArray(val);
    }
    return isValidPrimitiveAttributeValueType(typeof val);
  }
  function isHomogeneousAttributeValueArray(arr) {
    let type;
    for (const element of arr) {
      if (element == null)
        continue;
      const elementType = typeof element;
      if (elementType === type) {
        continue;
      }
      if (!type) {
        if (isValidPrimitiveAttributeValueType(elementType)) {
          type = elementType;
          continue;
        }
        return false;
      }
      return false;
    }
    return true;
  }
  function isValidPrimitiveAttributeValueType(valType) {
    switch (valType) {
      case "number":
      case "boolean":
      case "string":
        return true;
    }
    return false;
  }

  // node_modules/@opentelemetry/core/build/esm/common/logging-error-handler.js
  function loggingErrorHandler() {
    return (ex) => {
      diag2.error(stringifyException(ex));
    };
  }
  function stringifyException(ex) {
    if (typeof ex === "string") {
      return ex;
    } else {
      return JSON.stringify(flattenException(ex));
    }
  }
  function flattenException(ex) {
    const result = {};
    let current = ex;
    while (current !== null) {
      Object.getOwnPropertyNames(current).forEach((propertyName) => {
        if (result[propertyName])
          return;
        const value = current[propertyName];
        if (value) {
          result[propertyName] = String(value);
        }
      });
      current = Object.getPrototypeOf(current);
    }
    return result;
  }

  // node_modules/@opentelemetry/core/build/esm/common/global-error-handler.js
  var delegateHandler = loggingErrorHandler();
  function globalErrorHandler(ex) {
    try {
      delegateHandler(ex);
    } catch (e2) {
    }
  }

  // node_modules/@opentelemetry/core/build/esm/platform/browser/environment.js
  function getStringFromEnv(_2) {
    return void 0;
  }
  function getNumberFromEnv(_2) {
    return void 0;
  }
  function getStringListFromEnv(_2) {
    return void 0;
  }

  // node_modules/@opentelemetry/core/build/esm/version.js
  var VERSION2 = "2.5.1";

  // node_modules/@opentelemetry/semantic-conventions/build/esm/stable_attributes.js
  var ATTR_ERROR_TYPE = "error.type";
  var ATTR_EXCEPTION_MESSAGE = "exception.message";
  var ATTR_EXCEPTION_STACKTRACE = "exception.stacktrace";
  var ATTR_EXCEPTION_TYPE = "exception.type";
  var ATTR_HTTP_REQUEST_METHOD = "http.request.method";
  var ATTR_HTTP_REQUEST_METHOD_ORIGINAL = "http.request.method_original";
  var ATTR_HTTP_RESPONSE_STATUS_CODE = "http.response.status_code";
  var ATTR_SERVER_ADDRESS = "server.address";
  var ATTR_SERVER_PORT = "server.port";
  var ATTR_SERVICE_NAME = "service.name";
  var ATTR_TELEMETRY_SDK_LANGUAGE = "telemetry.sdk.language";
  var TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS = "webjs";
  var ATTR_TELEMETRY_SDK_NAME = "telemetry.sdk.name";
  var ATTR_TELEMETRY_SDK_VERSION = "telemetry.sdk.version";
  var ATTR_URL_FULL = "url.full";
  var ATTR_USER_AGENT_ORIGINAL = "user_agent.original";

  // node_modules/@opentelemetry/core/build/esm/semconv.js
  var ATTR_PROCESS_RUNTIME_NAME = "process.runtime.name";

  // node_modules/@opentelemetry/core/build/esm/platform/browser/sdk-info.js
  var SDK_INFO = {
    [ATTR_TELEMETRY_SDK_NAME]: "opentelemetry",
    [ATTR_PROCESS_RUNTIME_NAME]: "browser",
    [ATTR_TELEMETRY_SDK_LANGUAGE]: TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS,
    [ATTR_TELEMETRY_SDK_VERSION]: VERSION2
  };

  // node_modules/@opentelemetry/core/build/esm/platform/browser/index.js
  var otperformance = performance;

  // node_modules/@opentelemetry/core/build/esm/common/time.js
  var NANOSECOND_DIGITS = 9;
  var NANOSECOND_DIGITS_IN_MILLIS = 6;
  var MILLISECONDS_TO_NANOSECONDS = Math.pow(10, NANOSECOND_DIGITS_IN_MILLIS);
  var SECOND_TO_NANOSECONDS = Math.pow(10, NANOSECOND_DIGITS);
  function millisToHrTime(epochMillis) {
    const epochSeconds = epochMillis / 1e3;
    const seconds = Math.trunc(epochSeconds);
    const nanos = Math.round(epochMillis % 1e3 * MILLISECONDS_TO_NANOSECONDS);
    return [seconds, nanos];
  }
  function hrTime(performanceNow) {
    const timeOrigin = millisToHrTime(otperformance.timeOrigin);
    const now = millisToHrTime(typeof performanceNow === "number" ? performanceNow : otperformance.now());
    return addHrTimes(timeOrigin, now);
  }
  function timeInputToHrTime(time) {
    if (isTimeInputHrTime(time)) {
      return time;
    } else if (typeof time === "number") {
      if (time < otperformance.timeOrigin) {
        return hrTime(time);
      } else {
        return millisToHrTime(time);
      }
    } else if (time instanceof Date) {
      return millisToHrTime(time.getTime());
    } else {
      throw TypeError("Invalid input type");
    }
  }
  function hrTimeDuration(startTime, endTime) {
    let seconds = endTime[0] - startTime[0];
    let nanos = endTime[1] - startTime[1];
    if (nanos < 0) {
      seconds -= 1;
      nanos += SECOND_TO_NANOSECONDS;
    }
    return [seconds, nanos];
  }
  function hrTimeToNanoseconds(time) {
    return time[0] * SECOND_TO_NANOSECONDS + time[1];
  }
  function isTimeInputHrTime(value) {
    return Array.isArray(value) && value.length === 2 && typeof value[0] === "number" && typeof value[1] === "number";
  }
  function isTimeInput(value) {
    return isTimeInputHrTime(value) || typeof value === "number" || value instanceof Date;
  }
  function addHrTimes(time1, time2) {
    const out = [time1[0] + time2[0], time1[1] + time2[1]];
    if (out[1] >= SECOND_TO_NANOSECONDS) {
      out[1] -= SECOND_TO_NANOSECONDS;
      out[0] += 1;
    }
    return out;
  }

  // node_modules/@opentelemetry/core/build/esm/ExportResult.js
  var ExportResultCode;
  (function(ExportResultCode3) {
    ExportResultCode3[ExportResultCode3["SUCCESS"] = 0] = "SUCCESS";
    ExportResultCode3[ExportResultCode3["FAILED"] = 1] = "FAILED";
  })(ExportResultCode || (ExportResultCode = {}));

  // node_modules/@opentelemetry/core/build/esm/propagation/composite.js
  var CompositePropagator = class {
    /**
     * Construct a composite propagator from a list of propagators.
     *
     * @param [config] Configuration object for composite propagator
     */
    constructor(config = {}) {
      __publicField(this, "_propagators");
      __publicField(this, "_fields");
      var _a;
      this._propagators = (_a = config.propagators) != null ? _a : [];
      this._fields = Array.from(new Set(this._propagators.map((p2) => typeof p2.fields === "function" ? p2.fields() : []).reduce((x2, y2) => x2.concat(y2), [])));
    }
    /**
     * Run each of the configured propagators with the given context and carrier.
     * Propagators are run in the order they are configured, so if multiple
     * propagators write the same carrier key, the propagator later in the list
     * will "win".
     *
     * @param context Context to inject
     * @param carrier Carrier into which context will be injected
     */
    inject(context2, carrier, setter) {
      for (const propagator of this._propagators) {
        try {
          propagator.inject(context2, carrier, setter);
        } catch (err) {
          diag2.warn(`Failed to inject with ${propagator.constructor.name}. Err: ${err.message}`);
        }
      }
    }
    /**
     * Run each of the configured propagators with the given context and carrier.
     * Propagators are run in the order they are configured, so if multiple
     * propagators write the same context key, the propagator later in the list
     * will "win".
     *
     * @param context Context to add values to
     * @param carrier Carrier from which to extract context
     */
    extract(context2, carrier, getter) {
      return this._propagators.reduce((ctx, propagator) => {
        try {
          return propagator.extract(ctx, carrier, getter);
        } catch (err) {
          diag2.warn(`Failed to extract with ${propagator.constructor.name}. Err: ${err.message}`);
        }
        return ctx;
      }, context2);
    }
    fields() {
      return this._fields.slice();
    }
  };

  // node_modules/@opentelemetry/core/build/esm/internal/validators.js
  var VALID_KEY_CHAR_RANGE = "[_0-9a-z-*/]";
  var VALID_KEY = `[a-z]${VALID_KEY_CHAR_RANGE}{0,255}`;
  var VALID_VENDOR_KEY = `[a-z0-9]${VALID_KEY_CHAR_RANGE}{0,240}@[a-z]${VALID_KEY_CHAR_RANGE}{0,13}`;
  var VALID_KEY_REGEX = new RegExp(`^(?:${VALID_KEY}|${VALID_VENDOR_KEY})$`);
  var VALID_VALUE_BASE_REGEX = /^[ -~]{0,255}[!-~]$/;
  var INVALID_VALUE_COMMA_EQUAL_REGEX = /,|=/;
  function validateKey(key) {
    return VALID_KEY_REGEX.test(key);
  }
  function validateValue(value) {
    return VALID_VALUE_BASE_REGEX.test(value) && !INVALID_VALUE_COMMA_EQUAL_REGEX.test(value);
  }

  // node_modules/@opentelemetry/core/build/esm/trace/TraceState.js
  var MAX_TRACE_STATE_ITEMS = 32;
  var MAX_TRACE_STATE_LEN = 512;
  var LIST_MEMBERS_SEPARATOR = ",";
  var LIST_MEMBER_KEY_VALUE_SPLITTER = "=";
  var TraceState = class _TraceState {
    constructor(rawTraceState) {
      __publicField(this, "_internalState", /* @__PURE__ */ new Map());
      if (rawTraceState)
        this._parse(rawTraceState);
    }
    set(key, value) {
      const traceState = this._clone();
      if (traceState._internalState.has(key)) {
        traceState._internalState.delete(key);
      }
      traceState._internalState.set(key, value);
      return traceState;
    }
    unset(key) {
      const traceState = this._clone();
      traceState._internalState.delete(key);
      return traceState;
    }
    get(key) {
      return this._internalState.get(key);
    }
    serialize() {
      return this._keys().reduce((agg, key) => {
        agg.push(key + LIST_MEMBER_KEY_VALUE_SPLITTER + this.get(key));
        return agg;
      }, []).join(LIST_MEMBERS_SEPARATOR);
    }
    _parse(rawTraceState) {
      if (rawTraceState.length > MAX_TRACE_STATE_LEN)
        return;
      this._internalState = rawTraceState.split(LIST_MEMBERS_SEPARATOR).reverse().reduce((agg, part) => {
        const listMember = part.trim();
        const i2 = listMember.indexOf(LIST_MEMBER_KEY_VALUE_SPLITTER);
        if (i2 !== -1) {
          const key = listMember.slice(0, i2);
          const value = listMember.slice(i2 + 1, part.length);
          if (validateKey(key) && validateValue(value)) {
            agg.set(key, value);
          } else {
          }
        }
        return agg;
      }, /* @__PURE__ */ new Map());
      if (this._internalState.size > MAX_TRACE_STATE_ITEMS) {
        this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, MAX_TRACE_STATE_ITEMS));
      }
    }
    _keys() {
      return Array.from(this._internalState.keys()).reverse();
    }
    _clone() {
      const traceState = new _TraceState();
      traceState._internalState = new Map(this._internalState);
      return traceState;
    }
  };

  // node_modules/@opentelemetry/core/build/esm/trace/W3CTraceContextPropagator.js
  var TRACE_PARENT_HEADER = "traceparent";
  var TRACE_STATE_HEADER = "tracestate";
  var VERSION3 = "00";
  var VERSION_PART = "(?!ff)[\\da-f]{2}";
  var TRACE_ID_PART = "(?![0]{32})[\\da-f]{32}";
  var PARENT_ID_PART = "(?![0]{16})[\\da-f]{16}";
  var FLAGS_PART = "[\\da-f]{2}";
  var TRACE_PARENT_REGEX = new RegExp(`^\\s?(${VERSION_PART})-(${TRACE_ID_PART})-(${PARENT_ID_PART})-(${FLAGS_PART})(-.*)?\\s?$`);
  function parseTraceParent(traceParent) {
    const match = TRACE_PARENT_REGEX.exec(traceParent);
    if (!match)
      return null;
    if (match[1] === "00" && match[5])
      return null;
    return {
      traceId: match[2],
      spanId: match[3],
      traceFlags: parseInt(match[4], 16)
    };
  }
  var W3CTraceContextPropagator = class {
    inject(context2, carrier, setter) {
      const spanContext = trace.getSpanContext(context2);
      if (!spanContext || isTracingSuppressed(context2) || !isSpanContextValid(spanContext))
        return;
      const traceParent = `${VERSION3}-${spanContext.traceId}-${spanContext.spanId}-0${Number(spanContext.traceFlags || TraceFlags.NONE).toString(16)}`;
      setter.set(carrier, TRACE_PARENT_HEADER, traceParent);
      if (spanContext.traceState) {
        setter.set(carrier, TRACE_STATE_HEADER, spanContext.traceState.serialize());
      }
    }
    extract(context2, carrier, getter) {
      const traceParentHeader = getter.get(carrier, TRACE_PARENT_HEADER);
      if (!traceParentHeader)
        return context2;
      const traceParent = Array.isArray(traceParentHeader) ? traceParentHeader[0] : traceParentHeader;
      if (typeof traceParent !== "string")
        return context2;
      const spanContext = parseTraceParent(traceParent);
      if (!spanContext)
        return context2;
      spanContext.isRemote = true;
      const traceStateHeader = getter.get(carrier, TRACE_STATE_HEADER);
      if (traceStateHeader) {
        const state = Array.isArray(traceStateHeader) ? traceStateHeader.join(",") : traceStateHeader;
        spanContext.traceState = new TraceState(typeof state === "string" ? state : void 0);
      }
      return trace.setSpanContext(context2, spanContext);
    }
    fields() {
      return [TRACE_PARENT_HEADER, TRACE_STATE_HEADER];
    }
  };

  // node_modules/@opentelemetry/core/build/esm/utils/lodash.merge.js
  var objectTag = "[object Object]";
  var nullTag = "[object Null]";
  var undefinedTag = "[object Undefined]";
  var funcProto = Function.prototype;
  var funcToString = funcProto.toString;
  var objectCtorString = funcToString.call(Object);
  var getPrototypeOf = Object.getPrototypeOf;
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var symToStringTag = Symbol ? Symbol.toStringTag : void 0;
  var nativeObjectToString = objectProto.toString;
  function isPlainObject(value) {
    if (!isObjectLike(value) || baseGetTag(value) !== objectTag) {
      return false;
    }
    const proto = getPrototypeOf(value);
    if (proto === null) {
      return true;
    }
    const Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
    return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) === objectCtorString;
  }
  function isObjectLike(value) {
    return value != null && typeof value == "object";
  }
  function baseGetTag(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
  }
  function getRawTag(value) {
    const isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
    let unmasked = false;
    try {
      value[symToStringTag] = void 0;
      unmasked = true;
    } catch (e2) {
    }
    const result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }
  function objectToString(value) {
    return nativeObjectToString.call(value);
  }

  // node_modules/@opentelemetry/core/build/esm/utils/merge.js
  var MAX_LEVEL = 20;
  function merge(...args) {
    let result = args.shift();
    const objects = /* @__PURE__ */ new WeakMap();
    while (args.length > 0) {
      result = mergeTwoObjects(result, args.shift(), 0, objects);
    }
    return result;
  }
  function takeValue(value) {
    if (isArray(value)) {
      return value.slice();
    }
    return value;
  }
  function mergeTwoObjects(one, two, level = 0, objects) {
    let result;
    if (level > MAX_LEVEL) {
      return void 0;
    }
    level++;
    if (isPrimitive(one) || isPrimitive(two) || isFunction(two)) {
      result = takeValue(two);
    } else if (isArray(one)) {
      result = one.slice();
      if (isArray(two)) {
        for (let i2 = 0, j = two.length; i2 < j; i2++) {
          result.push(takeValue(two[i2]));
        }
      } else if (isObject(two)) {
        const keys = Object.keys(two);
        for (let i2 = 0, j = keys.length; i2 < j; i2++) {
          const key = keys[i2];
          result[key] = takeValue(two[key]);
        }
      }
    } else if (isObject(one)) {
      if (isObject(two)) {
        if (!shouldMerge(one, two)) {
          return two;
        }
        result = Object.assign({}, one);
        const keys = Object.keys(two);
        for (let i2 = 0, j = keys.length; i2 < j; i2++) {
          const key = keys[i2];
          const twoValue = two[key];
          if (isPrimitive(twoValue)) {
            if (typeof twoValue === "undefined") {
              delete result[key];
            } else {
              result[key] = twoValue;
            }
          } else {
            const obj1 = result[key];
            const obj2 = twoValue;
            if (wasObjectReferenced(one, key, objects) || wasObjectReferenced(two, key, objects)) {
              delete result[key];
            } else {
              if (isObject(obj1) && isObject(obj2)) {
                const arr1 = objects.get(obj1) || [];
                const arr2 = objects.get(obj2) || [];
                arr1.push({ obj: one, key });
                arr2.push({ obj: two, key });
                objects.set(obj1, arr1);
                objects.set(obj2, arr2);
              }
              result[key] = mergeTwoObjects(result[key], twoValue, level, objects);
            }
          }
        }
      } else {
        result = two;
      }
    }
    return result;
  }
  function wasObjectReferenced(obj, key, objects) {
    const arr = objects.get(obj[key]) || [];
    for (let i2 = 0, j = arr.length; i2 < j; i2++) {
      const info = arr[i2];
      if (info.key === key && info.obj === obj) {
        return true;
      }
    }
    return false;
  }
  function isArray(value) {
    return Array.isArray(value);
  }
  function isFunction(value) {
    return typeof value === "function";
  }
  function isObject(value) {
    return !isPrimitive(value) && !isArray(value) && !isFunction(value) && typeof value === "object";
  }
  function isPrimitive(value) {
    return typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "undefined" || value instanceof Date || value instanceof RegExp || value === null;
  }
  function shouldMerge(one, two) {
    if (!isPlainObject(one) || !isPlainObject(two)) {
      return false;
    }
    return true;
  }

  // node_modules/@opentelemetry/core/build/esm/utils/url.js
  function urlMatches(url, urlToMatch) {
    if (typeof urlToMatch === "string") {
      return url === urlToMatch;
    } else {
      return !!url.match(urlToMatch);
    }
  }
  function isUrlIgnored(url, ignoredUrls) {
    if (!ignoredUrls) {
      return false;
    }
    for (const ignoreUrl of ignoredUrls) {
      if (urlMatches(url, ignoreUrl)) {
        return true;
      }
    }
    return false;
  }

  // node_modules/@opentelemetry/core/build/esm/utils/promise.js
  var Deferred = class {
    constructor() {
      __publicField(this, "_promise");
      __publicField(this, "_resolve");
      __publicField(this, "_reject");
      this._promise = new Promise((resolve, reject) => {
        this._resolve = resolve;
        this._reject = reject;
      });
    }
    get promise() {
      return this._promise;
    }
    resolve(val) {
      this._resolve(val);
    }
    reject(err) {
      this._reject(err);
    }
  };

  // node_modules/@opentelemetry/core/build/esm/utils/callback.js
  var BindOnceFuture = class {
    constructor(callback, that) {
      __publicField(this, "_isCalled", false);
      __publicField(this, "_deferred", new Deferred());
      __publicField(this, "_callback");
      __publicField(this, "_that");
      this._callback = callback;
      this._that = that;
    }
    get isCalled() {
      return this._isCalled;
    }
    get promise() {
      return this._deferred.promise;
    }
    call(...args) {
      if (!this._isCalled) {
        this._isCalled = true;
        try {
          Promise.resolve(this._callback.call(this._that, ...args)).then((val) => this._deferred.resolve(val), (err) => this._deferred.reject(err));
        } catch (err) {
          this._deferred.reject(err);
        }
      }
      return this._deferred.promise;
    }
  };

  // node_modules/@opentelemetry/resources/build/esm/default-service-name.js
  var serviceName;
  function defaultServiceName() {
    if (serviceName === void 0) {
      try {
        const argv0 = globalThis.process.argv0;
        serviceName = argv0 ? `unknown_service:${argv0}` : "unknown_service";
      } catch (e2) {
        serviceName = "unknown_service";
      }
    }
    return serviceName;
  }

  // node_modules/@opentelemetry/resources/build/esm/utils.js
  var isPromiseLike = (val) => {
    return val !== null && typeof val === "object" && typeof val.then === "function";
  };

  // node_modules/@opentelemetry/resources/build/esm/ResourceImpl.js
  var ResourceImpl = class _ResourceImpl {
    constructor(resource, options) {
      __publicField(this, "_rawAttributes");
      __publicField(this, "_asyncAttributesPending", false);
      __publicField(this, "_schemaUrl");
      __publicField(this, "_memoizedAttributes");
      var _a;
      const attributes = (_a = resource.attributes) != null ? _a : {};
      this._rawAttributes = Object.entries(attributes).map(([k2, v2]) => {
        if (isPromiseLike(v2)) {
          this._asyncAttributesPending = true;
        }
        return [k2, v2];
      });
      this._rawAttributes = guardedRawAttributes(this._rawAttributes);
      this._schemaUrl = validateSchemaUrl(options == null ? void 0 : options.schemaUrl);
    }
    static FromAttributeList(attributes, options) {
      const res = new _ResourceImpl({}, options);
      res._rawAttributes = guardedRawAttributes(attributes);
      res._asyncAttributesPending = attributes.filter(([_2, val]) => isPromiseLike(val)).length > 0;
      return res;
    }
    get asyncAttributesPending() {
      return this._asyncAttributesPending;
    }
    async waitForAsyncAttributes() {
      if (!this.asyncAttributesPending) {
        return;
      }
      for (let i2 = 0; i2 < this._rawAttributes.length; i2++) {
        const [k2, v2] = this._rawAttributes[i2];
        this._rawAttributes[i2] = [k2, isPromiseLike(v2) ? await v2 : v2];
      }
      this._asyncAttributesPending = false;
    }
    get attributes() {
      var _a;
      if (this.asyncAttributesPending) {
        diag2.error("Accessing resource attributes before async attributes settled");
      }
      if (this._memoizedAttributes) {
        return this._memoizedAttributes;
      }
      const attrs = {};
      for (const [k2, v2] of this._rawAttributes) {
        if (isPromiseLike(v2)) {
          diag2.debug(`Unsettled resource attribute ${k2} skipped`);
          continue;
        }
        if (v2 != null) {
          (_a = attrs[k2]) != null ? _a : attrs[k2] = v2;
        }
      }
      if (!this._asyncAttributesPending) {
        this._memoizedAttributes = attrs;
      }
      return attrs;
    }
    getRawAttributes() {
      return this._rawAttributes;
    }
    get schemaUrl() {
      return this._schemaUrl;
    }
    merge(resource) {
      if (resource == null)
        return this;
      const mergedSchemaUrl = mergeSchemaUrl(this, resource);
      const mergedOptions = mergedSchemaUrl ? { schemaUrl: mergedSchemaUrl } : void 0;
      return _ResourceImpl.FromAttributeList([...resource.getRawAttributes(), ...this.getRawAttributes()], mergedOptions);
    }
  };
  function resourceFromAttributes(attributes, options) {
    return ResourceImpl.FromAttributeList(Object.entries(attributes), options);
  }
  function resourceFromDetectedResource(detectedResource, options) {
    return new ResourceImpl(detectedResource, options);
  }
  function emptyResource() {
    return resourceFromAttributes({});
  }
  function defaultResource() {
    return resourceFromAttributes({
      [ATTR_SERVICE_NAME]: defaultServiceName(),
      [ATTR_TELEMETRY_SDK_LANGUAGE]: SDK_INFO[ATTR_TELEMETRY_SDK_LANGUAGE],
      [ATTR_TELEMETRY_SDK_NAME]: SDK_INFO[ATTR_TELEMETRY_SDK_NAME],
      [ATTR_TELEMETRY_SDK_VERSION]: SDK_INFO[ATTR_TELEMETRY_SDK_VERSION]
    });
  }
  function guardedRawAttributes(attributes) {
    return attributes.map(([k2, v2]) => {
      if (isPromiseLike(v2)) {
        return [
          k2,
          v2.catch((err) => {
            diag2.debug("promise rejection for resource attribute: %s - %s", k2, err);
            return void 0;
          })
        ];
      }
      return [k2, v2];
    });
  }
  function validateSchemaUrl(schemaUrl) {
    if (typeof schemaUrl === "string" || schemaUrl === void 0) {
      return schemaUrl;
    }
    diag2.warn("Schema URL must be string or undefined, got %s. Schema URL will be ignored.", schemaUrl);
    return void 0;
  }
  function mergeSchemaUrl(old, updating) {
    const oldSchemaUrl = old == null ? void 0 : old.schemaUrl;
    const updatingSchemaUrl = updating == null ? void 0 : updating.schemaUrl;
    const isOldEmpty = oldSchemaUrl === void 0 || oldSchemaUrl === "";
    const isUpdatingEmpty = updatingSchemaUrl === void 0 || updatingSchemaUrl === "";
    if (isOldEmpty) {
      return updatingSchemaUrl;
    }
    if (isUpdatingEmpty) {
      return oldSchemaUrl;
    }
    if (oldSchemaUrl === updatingSchemaUrl) {
      return oldSchemaUrl;
    }
    diag2.warn('Schema URL merge conflict: old resource has "%s", updating resource has "%s". Resulting resource will have undefined Schema URL.', oldSchemaUrl, updatingSchemaUrl);
    return void 0;
  }

  // node_modules/@opentelemetry/resources/build/esm/detect-resources.js
  var detectResources = (config = {}) => {
    const resources = (config.detectors || []).map((d2) => {
      try {
        const resource = resourceFromDetectedResource(d2.detect(config));
        diag2.debug(`${d2.constructor.name} found resource.`, resource);
        return resource;
      } catch (e2) {
        diag2.debug(`${d2.constructor.name} failed: ${e2.message}`);
        return emptyResource();
      }
    });
    return resources.reduce((acc, resource) => acc.merge(resource), emptyResource());
  };

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/enums.js
  var ExceptionEventName = "exception";

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/Span.js
  var SpanImpl = class {
    /**
     * Constructs a new SpanImpl instance.
     */
    constructor(opts) {
      // Below properties are included to implement ReadableSpan for export
      // purposes but are not intended to be written-to directly.
      __publicField(this, "_spanContext");
      __publicField(this, "kind");
      __publicField(this, "parentSpanContext");
      __publicField(this, "attributes", {});
      __publicField(this, "links", []);
      __publicField(this, "events", []);
      __publicField(this, "startTime");
      __publicField(this, "resource");
      __publicField(this, "instrumentationScope");
      __publicField(this, "_droppedAttributesCount", 0);
      __publicField(this, "_droppedEventsCount", 0);
      __publicField(this, "_droppedLinksCount", 0);
      __publicField(this, "_attributesCount", 0);
      __publicField(this, "name");
      __publicField(this, "status", {
        code: SpanStatusCode.UNSET
      });
      __publicField(this, "endTime", [0, 0]);
      __publicField(this, "_ended", false);
      __publicField(this, "_duration", [-1, -1]);
      __publicField(this, "_spanProcessor");
      __publicField(this, "_spanLimits");
      __publicField(this, "_attributeValueLengthLimit");
      __publicField(this, "_performanceStartTime");
      __publicField(this, "_performanceOffset");
      __publicField(this, "_startTimeProvided");
      var _a;
      const now = Date.now();
      this._spanContext = opts.spanContext;
      this._performanceStartTime = otperformance.now();
      this._performanceOffset = now - (this._performanceStartTime + otperformance.timeOrigin);
      this._startTimeProvided = opts.startTime != null;
      this._spanLimits = opts.spanLimits;
      this._attributeValueLengthLimit = this._spanLimits.attributeValueLengthLimit || 0;
      this._spanProcessor = opts.spanProcessor;
      this.name = opts.name;
      this.parentSpanContext = opts.parentSpanContext;
      this.kind = opts.kind;
      this.links = opts.links || [];
      this.startTime = this._getTime((_a = opts.startTime) != null ? _a : now);
      this.resource = opts.resource;
      this.instrumentationScope = opts.scope;
      if (opts.attributes != null) {
        this.setAttributes(opts.attributes);
      }
      this._spanProcessor.onStart(this, opts.context);
    }
    spanContext() {
      return this._spanContext;
    }
    setAttribute(key, value) {
      if (value == null || this._isSpanEnded())
        return this;
      if (key.length === 0) {
        diag2.warn(`Invalid attribute key: ${key}`);
        return this;
      }
      if (!isAttributeValue(value)) {
        diag2.warn(`Invalid attribute value set for key: ${key}`);
        return this;
      }
      const { attributeCountLimit } = this._spanLimits;
      const isNewKey = !Object.prototype.hasOwnProperty.call(this.attributes, key);
      if (attributeCountLimit !== void 0 && this._attributesCount >= attributeCountLimit && isNewKey) {
        this._droppedAttributesCount++;
        return this;
      }
      this.attributes[key] = this._truncateToSize(value);
      if (isNewKey) {
        this._attributesCount++;
      }
      return this;
    }
    setAttributes(attributes) {
      for (const [k2, v2] of Object.entries(attributes)) {
        this.setAttribute(k2, v2);
      }
      return this;
    }
    /**
     *
     * @param name Span Name
     * @param [attributesOrStartTime] Span attributes or start time
     *     if type is {@type TimeInput} and 3rd param is undefined
     * @param [timeStamp] Specified time stamp for the event
     */
    addEvent(name, attributesOrStartTime, timeStamp) {
      if (this._isSpanEnded())
        return this;
      const { eventCountLimit } = this._spanLimits;
      if (eventCountLimit === 0) {
        diag2.warn("No events allowed.");
        this._droppedEventsCount++;
        return this;
      }
      if (eventCountLimit !== void 0 && this.events.length >= eventCountLimit) {
        if (this._droppedEventsCount === 0) {
          diag2.debug("Dropping extra events.");
        }
        this.events.shift();
        this._droppedEventsCount++;
      }
      if (isTimeInput(attributesOrStartTime)) {
        if (!isTimeInput(timeStamp)) {
          timeStamp = attributesOrStartTime;
        }
        attributesOrStartTime = void 0;
      }
      const attributes = sanitizeAttributes(attributesOrStartTime);
      this.events.push({
        name,
        attributes,
        time: this._getTime(timeStamp),
        droppedAttributesCount: 0
      });
      return this;
    }
    addLink(link) {
      this.links.push(link);
      return this;
    }
    addLinks(links) {
      this.links.push(...links);
      return this;
    }
    setStatus(status) {
      if (this._isSpanEnded())
        return this;
      this.status = { ...status };
      if (this.status.message != null && typeof status.message !== "string") {
        diag2.warn(`Dropping invalid status.message of type '${typeof status.message}', expected 'string'`);
        delete this.status.message;
      }
      return this;
    }
    updateName(name) {
      if (this._isSpanEnded())
        return this;
      this.name = name;
      return this;
    }
    end(endTime) {
      if (this._isSpanEnded()) {
        diag2.error(`${this.name} ${this._spanContext.traceId}-${this._spanContext.spanId} - You can only call end() on a span once.`);
        return;
      }
      this.endTime = this._getTime(endTime);
      this._duration = hrTimeDuration(this.startTime, this.endTime);
      if (this._duration[0] < 0) {
        diag2.warn("Inconsistent start and end time, startTime > endTime. Setting span duration to 0ms.", this.startTime, this.endTime);
        this.endTime = this.startTime.slice();
        this._duration = [0, 0];
      }
      if (this._droppedEventsCount > 0) {
        diag2.warn(`Dropped ${this._droppedEventsCount} events because eventCountLimit reached`);
      }
      if (this._spanProcessor.onEnding) {
        this._spanProcessor.onEnding(this);
      }
      this._ended = true;
      this._spanProcessor.onEnd(this);
    }
    _getTime(inp) {
      if (typeof inp === "number" && inp <= otperformance.now()) {
        return hrTime(inp + this._performanceOffset);
      }
      if (typeof inp === "number") {
        return millisToHrTime(inp);
      }
      if (inp instanceof Date) {
        return millisToHrTime(inp.getTime());
      }
      if (isTimeInputHrTime(inp)) {
        return inp;
      }
      if (this._startTimeProvided) {
        return millisToHrTime(Date.now());
      }
      const msDuration = otperformance.now() - this._performanceStartTime;
      return addHrTimes(this.startTime, millisToHrTime(msDuration));
    }
    isRecording() {
      return this._ended === false;
    }
    recordException(exception, time) {
      const attributes = {};
      if (typeof exception === "string") {
        attributes[ATTR_EXCEPTION_MESSAGE] = exception;
      } else if (exception) {
        if (exception.code) {
          attributes[ATTR_EXCEPTION_TYPE] = exception.code.toString();
        } else if (exception.name) {
          attributes[ATTR_EXCEPTION_TYPE] = exception.name;
        }
        if (exception.message) {
          attributes[ATTR_EXCEPTION_MESSAGE] = exception.message;
        }
        if (exception.stack) {
          attributes[ATTR_EXCEPTION_STACKTRACE] = exception.stack;
        }
      }
      if (attributes[ATTR_EXCEPTION_TYPE] || attributes[ATTR_EXCEPTION_MESSAGE]) {
        this.addEvent(ExceptionEventName, attributes, time);
      } else {
        diag2.warn(`Failed to record an exception ${exception}`);
      }
    }
    get duration() {
      return this._duration;
    }
    get ended() {
      return this._ended;
    }
    get droppedAttributesCount() {
      return this._droppedAttributesCount;
    }
    get droppedEventsCount() {
      return this._droppedEventsCount;
    }
    get droppedLinksCount() {
      return this._droppedLinksCount;
    }
    _isSpanEnded() {
      if (this._ended) {
        const error = new Error(`Operation attempted on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`);
        diag2.warn(`Cannot execute the operation on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`, error);
      }
      return this._ended;
    }
    // Utility function to truncate given value within size
    // for value type of string, will truncate to given limit
    // for type of non-string, will return same value
    _truncateToLimitUtil(value, limit) {
      if (value.length <= limit) {
        return value;
      }
      return value.substring(0, limit);
    }
    /**
     * If the given attribute value is of type string and has more characters than given {@code attributeValueLengthLimit} then
     * return string with truncated to {@code attributeValueLengthLimit} characters
     *
     * If the given attribute value is array of strings then
     * return new array of strings with each element truncated to {@code attributeValueLengthLimit} characters
     *
     * Otherwise return same Attribute {@code value}
     *
     * @param value Attribute value
     * @returns truncated attribute value if required, otherwise same value
     */
    _truncateToSize(value) {
      const limit = this._attributeValueLengthLimit;
      if (limit <= 0) {
        diag2.warn(`Attribute value limit must be positive, got ${limit}`);
        return value;
      }
      if (typeof value === "string") {
        return this._truncateToLimitUtil(value, limit);
      }
      if (Array.isArray(value)) {
        return value.map((val) => typeof val === "string" ? this._truncateToLimitUtil(val, limit) : val);
      }
      return value;
    }
  };

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/Sampler.js
  var SamplingDecision2;
  (function(SamplingDecision3) {
    SamplingDecision3[SamplingDecision3["NOT_RECORD"] = 0] = "NOT_RECORD";
    SamplingDecision3[SamplingDecision3["RECORD"] = 1] = "RECORD";
    SamplingDecision3[SamplingDecision3["RECORD_AND_SAMPLED"] = 2] = "RECORD_AND_SAMPLED";
  })(SamplingDecision2 || (SamplingDecision2 = {}));

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/sampler/AlwaysOffSampler.js
  var AlwaysOffSampler = class {
    shouldSample() {
      return {
        decision: SamplingDecision2.NOT_RECORD
      };
    }
    toString() {
      return "AlwaysOffSampler";
    }
  };

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/sampler/AlwaysOnSampler.js
  var AlwaysOnSampler = class {
    shouldSample() {
      return {
        decision: SamplingDecision2.RECORD_AND_SAMPLED
      };
    }
    toString() {
      return "AlwaysOnSampler";
    }
  };

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/sampler/ParentBasedSampler.js
  var ParentBasedSampler = class {
    constructor(config) {
      __publicField(this, "_root");
      __publicField(this, "_remoteParentSampled");
      __publicField(this, "_remoteParentNotSampled");
      __publicField(this, "_localParentSampled");
      __publicField(this, "_localParentNotSampled");
      var _a, _b, _c, _d;
      this._root = config.root;
      if (!this._root) {
        globalErrorHandler(new Error("ParentBasedSampler must have a root sampler configured"));
        this._root = new AlwaysOnSampler();
      }
      this._remoteParentSampled = (_a = config.remoteParentSampled) != null ? _a : new AlwaysOnSampler();
      this._remoteParentNotSampled = (_b = config.remoteParentNotSampled) != null ? _b : new AlwaysOffSampler();
      this._localParentSampled = (_c = config.localParentSampled) != null ? _c : new AlwaysOnSampler();
      this._localParentNotSampled = (_d = config.localParentNotSampled) != null ? _d : new AlwaysOffSampler();
    }
    shouldSample(context2, traceId, spanName, spanKind, attributes, links) {
      const parentContext = trace.getSpanContext(context2);
      if (!parentContext || !isSpanContextValid(parentContext)) {
        return this._root.shouldSample(context2, traceId, spanName, spanKind, attributes, links);
      }
      if (parentContext.isRemote) {
        if (parentContext.traceFlags & TraceFlags.SAMPLED) {
          return this._remoteParentSampled.shouldSample(context2, traceId, spanName, spanKind, attributes, links);
        }
        return this._remoteParentNotSampled.shouldSample(context2, traceId, spanName, spanKind, attributes, links);
      }
      if (parentContext.traceFlags & TraceFlags.SAMPLED) {
        return this._localParentSampled.shouldSample(context2, traceId, spanName, spanKind, attributes, links);
      }
      return this._localParentNotSampled.shouldSample(context2, traceId, spanName, spanKind, attributes, links);
    }
    toString() {
      return `ParentBased{root=${this._root.toString()}, remoteParentSampled=${this._remoteParentSampled.toString()}, remoteParentNotSampled=${this._remoteParentNotSampled.toString()}, localParentSampled=${this._localParentSampled.toString()}, localParentNotSampled=${this._localParentNotSampled.toString()}}`;
    }
  };

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/sampler/TraceIdRatioBasedSampler.js
  var TraceIdRatioBasedSampler = class {
    constructor(ratio = 0) {
      __publicField(this, "_ratio");
      __publicField(this, "_upperBound");
      this._ratio = this._normalize(ratio);
      this._upperBound = Math.floor(this._ratio * 4294967295);
    }
    shouldSample(context2, traceId) {
      return {
        decision: isValidTraceId(traceId) && this._accumulate(traceId) < this._upperBound ? SamplingDecision2.RECORD_AND_SAMPLED : SamplingDecision2.NOT_RECORD
      };
    }
    toString() {
      return `TraceIdRatioBased{${this._ratio}}`;
    }
    _normalize(ratio) {
      if (typeof ratio !== "number" || isNaN(ratio))
        return 0;
      return ratio >= 1 ? 1 : ratio <= 0 ? 0 : ratio;
    }
    _accumulate(traceId) {
      let accumulation = 0;
      for (let i2 = 0; i2 < traceId.length / 8; i2++) {
        const pos = i2 * 8;
        const part = parseInt(traceId.slice(pos, pos + 8), 16);
        accumulation = (accumulation ^ part) >>> 0;
      }
      return accumulation;
    }
  };

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/config.js
  var TracesSamplerValues;
  (function(TracesSamplerValues2) {
    TracesSamplerValues2["AlwaysOff"] = "always_off";
    TracesSamplerValues2["AlwaysOn"] = "always_on";
    TracesSamplerValues2["ParentBasedAlwaysOff"] = "parentbased_always_off";
    TracesSamplerValues2["ParentBasedAlwaysOn"] = "parentbased_always_on";
    TracesSamplerValues2["ParentBasedTraceIdRatio"] = "parentbased_traceidratio";
    TracesSamplerValues2["TraceIdRatio"] = "traceidratio";
  })(TracesSamplerValues || (TracesSamplerValues = {}));
  var DEFAULT_RATIO = 1;
  function loadDefaultConfig() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return {
      sampler: buildSamplerFromEnv(),
      forceFlushTimeoutMillis: 3e4,
      generalLimits: {
        attributeValueLengthLimit: (_a = getNumberFromEnv("OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT")) != null ? _a : Infinity,
        attributeCountLimit: (_b = getNumberFromEnv("OTEL_ATTRIBUTE_COUNT_LIMIT")) != null ? _b : 128
      },
      spanLimits: {
        attributeValueLengthLimit: (_c = getNumberFromEnv("OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT")) != null ? _c : Infinity,
        attributeCountLimit: (_d = getNumberFromEnv("OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT")) != null ? _d : 128,
        linkCountLimit: (_e = getNumberFromEnv("OTEL_SPAN_LINK_COUNT_LIMIT")) != null ? _e : 128,
        eventCountLimit: (_f = getNumberFromEnv("OTEL_SPAN_EVENT_COUNT_LIMIT")) != null ? _f : 128,
        attributePerEventCountLimit: (_g = getNumberFromEnv("OTEL_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT")) != null ? _g : 128,
        attributePerLinkCountLimit: (_h = getNumberFromEnv("OTEL_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT")) != null ? _h : 128
      }
    };
  }
  function buildSamplerFromEnv() {
    var _a;
    const sampler = (_a = getStringFromEnv("OTEL_TRACES_SAMPLER")) != null ? _a : TracesSamplerValues.ParentBasedAlwaysOn;
    switch (sampler) {
      case TracesSamplerValues.AlwaysOn:
        return new AlwaysOnSampler();
      case TracesSamplerValues.AlwaysOff:
        return new AlwaysOffSampler();
      case TracesSamplerValues.ParentBasedAlwaysOn:
        return new ParentBasedSampler({
          root: new AlwaysOnSampler()
        });
      case TracesSamplerValues.ParentBasedAlwaysOff:
        return new ParentBasedSampler({
          root: new AlwaysOffSampler()
        });
      case TracesSamplerValues.TraceIdRatio:
        return new TraceIdRatioBasedSampler(getSamplerProbabilityFromEnv());
      case TracesSamplerValues.ParentBasedTraceIdRatio:
        return new ParentBasedSampler({
          root: new TraceIdRatioBasedSampler(getSamplerProbabilityFromEnv())
        });
      default:
        diag2.error(`OTEL_TRACES_SAMPLER value "${sampler}" invalid, defaulting to "${TracesSamplerValues.ParentBasedAlwaysOn}".`);
        return new ParentBasedSampler({
          root: new AlwaysOnSampler()
        });
    }
  }
  function getSamplerProbabilityFromEnv() {
    const probability = getNumberFromEnv("OTEL_TRACES_SAMPLER_ARG");
    if (probability == null) {
      diag2.error(`OTEL_TRACES_SAMPLER_ARG is blank, defaulting to ${DEFAULT_RATIO}.`);
      return DEFAULT_RATIO;
    }
    if (probability < 0 || probability > 1) {
      diag2.error(`OTEL_TRACES_SAMPLER_ARG=${probability} was given, but it is out of range ([0..1]), defaulting to ${DEFAULT_RATIO}.`);
      return DEFAULT_RATIO;
    }
    return probability;
  }

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/utility.js
  var DEFAULT_ATTRIBUTE_COUNT_LIMIT = 128;
  var DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT = Infinity;
  function mergeConfig(userConfig) {
    const perInstanceDefaults = {
      sampler: buildSamplerFromEnv()
    };
    const DEFAULT_CONFIG = loadDefaultConfig();
    const target = Object.assign({}, DEFAULT_CONFIG, perInstanceDefaults, userConfig);
    target.generalLimits = Object.assign({}, DEFAULT_CONFIG.generalLimits, userConfig.generalLimits || {});
    target.spanLimits = Object.assign({}, DEFAULT_CONFIG.spanLimits, userConfig.spanLimits || {});
    return target;
  }
  function reconfigureLimits(userConfig) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
    const spanLimits = Object.assign({}, userConfig.spanLimits);
    spanLimits.attributeCountLimit = (_f = (_e = (_d = (_c = (_a = userConfig.spanLimits) == null ? void 0 : _a.attributeCountLimit) != null ? _c : (_b = userConfig.generalLimits) == null ? void 0 : _b.attributeCountLimit) != null ? _d : getNumberFromEnv("OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT")) != null ? _e : getNumberFromEnv("OTEL_ATTRIBUTE_COUNT_LIMIT")) != null ? _f : DEFAULT_ATTRIBUTE_COUNT_LIMIT;
    spanLimits.attributeValueLengthLimit = (_l = (_k = (_j = (_i = (_g = userConfig.spanLimits) == null ? void 0 : _g.attributeValueLengthLimit) != null ? _i : (_h = userConfig.generalLimits) == null ? void 0 : _h.attributeValueLengthLimit) != null ? _j : getNumberFromEnv("OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT")) != null ? _k : getNumberFromEnv("OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT")) != null ? _l : DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT;
    return Object.assign({}, userConfig, { spanLimits });
  }

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/export/BatchSpanProcessorBase.js
  var BatchSpanProcessorBase = class {
    constructor(exporter, config) {
      __publicField(this, "_maxExportBatchSize");
      __publicField(this, "_maxQueueSize");
      __publicField(this, "_scheduledDelayMillis");
      __publicField(this, "_exportTimeoutMillis");
      __publicField(this, "_exporter");
      __publicField(this, "_isExporting", false);
      __publicField(this, "_finishedSpans", []);
      __publicField(this, "_timer");
      __publicField(this, "_shutdownOnce");
      __publicField(this, "_droppedSpansCount", 0);
      var _a, _b, _c, _d;
      this._exporter = exporter;
      this._maxExportBatchSize = typeof (config == null ? void 0 : config.maxExportBatchSize) === "number" ? config.maxExportBatchSize : (_a = getNumberFromEnv("OTEL_BSP_MAX_EXPORT_BATCH_SIZE")) != null ? _a : 512;
      this._maxQueueSize = typeof (config == null ? void 0 : config.maxQueueSize) === "number" ? config.maxQueueSize : (_b = getNumberFromEnv("OTEL_BSP_MAX_QUEUE_SIZE")) != null ? _b : 2048;
      this._scheduledDelayMillis = typeof (config == null ? void 0 : config.scheduledDelayMillis) === "number" ? config.scheduledDelayMillis : (_c = getNumberFromEnv("OTEL_BSP_SCHEDULE_DELAY")) != null ? _c : 5e3;
      this._exportTimeoutMillis = typeof (config == null ? void 0 : config.exportTimeoutMillis) === "number" ? config.exportTimeoutMillis : (_d = getNumberFromEnv("OTEL_BSP_EXPORT_TIMEOUT")) != null ? _d : 3e4;
      this._shutdownOnce = new BindOnceFuture(this._shutdown, this);
      if (this._maxExportBatchSize > this._maxQueueSize) {
        diag2.warn("BatchSpanProcessor: maxExportBatchSize must be smaller or equal to maxQueueSize, setting maxExportBatchSize to match maxQueueSize");
        this._maxExportBatchSize = this._maxQueueSize;
      }
    }
    forceFlush() {
      if (this._shutdownOnce.isCalled) {
        return this._shutdownOnce.promise;
      }
      return this._flushAll();
    }
    // does nothing.
    onStart(_span, _parentContext) {
    }
    onEnd(span) {
      if (this._shutdownOnce.isCalled) {
        return;
      }
      if ((span.spanContext().traceFlags & TraceFlags.SAMPLED) === 0) {
        return;
      }
      this._addToBuffer(span);
    }
    shutdown() {
      return this._shutdownOnce.call();
    }
    _shutdown() {
      return Promise.resolve().then(() => {
        return this.onShutdown();
      }).then(() => {
        return this._flushAll();
      }).then(() => {
        return this._exporter.shutdown();
      });
    }
    /** Add a span in the buffer. */
    _addToBuffer(span) {
      if (this._finishedSpans.length >= this._maxQueueSize) {
        if (this._droppedSpansCount === 0) {
          diag2.debug("maxQueueSize reached, dropping spans");
        }
        this._droppedSpansCount++;
        return;
      }
      if (this._droppedSpansCount > 0) {
        diag2.warn(`Dropped ${this._droppedSpansCount} spans because maxQueueSize reached`);
        this._droppedSpansCount = 0;
      }
      this._finishedSpans.push(span);
      this._maybeStartTimer();
    }
    /**
     * Send all spans to the exporter respecting the batch size limit
     * This function is used only on forceFlush or shutdown,
     * for all other cases _flush should be used
     * */
    _flushAll() {
      return new Promise((resolve, reject) => {
        const promises = [];
        const count = Math.ceil(this._finishedSpans.length / this._maxExportBatchSize);
        for (let i2 = 0, j = count; i2 < j; i2++) {
          promises.push(this._flushOneBatch());
        }
        Promise.all(promises).then(() => {
          resolve();
        }).catch(reject);
      });
    }
    _flushOneBatch() {
      this._clearTimer();
      if (this._finishedSpans.length === 0) {
        return Promise.resolve();
      }
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error("Timeout"));
        }, this._exportTimeoutMillis);
        context.with(suppressTracing(context.active()), () => {
          let spans;
          if (this._finishedSpans.length <= this._maxExportBatchSize) {
            spans = this._finishedSpans;
            this._finishedSpans = [];
          } else {
            spans = this._finishedSpans.splice(0, this._maxExportBatchSize);
          }
          const doExport = () => this._exporter.export(spans, (result) => {
            var _a;
            clearTimeout(timer);
            if (result.code === ExportResultCode.SUCCESS) {
              resolve();
            } else {
              reject((_a = result.error) != null ? _a : new Error("BatchSpanProcessor: span export failed"));
            }
          });
          let pendingResources = null;
          for (let i2 = 0, len = spans.length; i2 < len; i2++) {
            const span = spans[i2];
            if (span.resource.asyncAttributesPending && span.resource.waitForAsyncAttributes) {
              pendingResources != null ? pendingResources : pendingResources = [];
              pendingResources.push(span.resource.waitForAsyncAttributes());
            }
          }
          if (pendingResources === null) {
            doExport();
          } else {
            Promise.all(pendingResources).then(doExport, (err) => {
              globalErrorHandler(err);
              reject(err);
            });
          }
        });
      });
    }
    _maybeStartTimer() {
      if (this._isExporting)
        return;
      const flush = () => {
        this._isExporting = true;
        this._flushOneBatch().finally(() => {
          this._isExporting = false;
          if (this._finishedSpans.length > 0) {
            this._clearTimer();
            this._maybeStartTimer();
          }
        }).catch((e2) => {
          this._isExporting = false;
          globalErrorHandler(e2);
        });
      };
      if (this._finishedSpans.length >= this._maxExportBatchSize) {
        return flush();
      }
      if (this._timer !== void 0)
        return;
      this._timer = setTimeout(() => flush(), this._scheduledDelayMillis);
      if (typeof this._timer !== "number") {
        this._timer.unref();
      }
    }
    _clearTimer() {
      if (this._timer !== void 0) {
        clearTimeout(this._timer);
        this._timer = void 0;
      }
    }
  };

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/platform/browser/export/BatchSpanProcessor.js
  var BatchSpanProcessor = class extends BatchSpanProcessorBase {
    constructor(_exporter, config) {
      super(_exporter, config);
      __publicField(this, "_visibilityChangeListener");
      __publicField(this, "_pageHideListener");
      this.onInit(config);
    }
    onInit(config) {
      if ((config == null ? void 0 : config.disableAutoFlushOnDocumentHide) !== true && typeof document !== "undefined") {
        this._visibilityChangeListener = () => {
          if (document.visibilityState === "hidden") {
            this.forceFlush().catch((error) => {
              globalErrorHandler(error);
            });
          }
        };
        this._pageHideListener = () => {
          this.forceFlush().catch((error) => {
            globalErrorHandler(error);
          });
        };
        document.addEventListener("visibilitychange", this._visibilityChangeListener);
        document.addEventListener("pagehide", this._pageHideListener);
      }
    }
    onShutdown() {
      if (typeof document !== "undefined") {
        if (this._visibilityChangeListener) {
          document.removeEventListener("visibilitychange", this._visibilityChangeListener);
        }
        if (this._pageHideListener) {
          document.removeEventListener("pagehide", this._pageHideListener);
        }
      }
    }
  };

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/platform/browser/RandomIdGenerator.js
  var TRACE_ID_BYTES = 16;
  var SPAN_ID_BYTES = 8;
  var TRACE_BUFFER = new Uint8Array(TRACE_ID_BYTES);
  var SPAN_BUFFER = new Uint8Array(SPAN_ID_BYTES);
  var HEX = Array.from({ length: 256 }, (_2, i2) => i2.toString(16).padStart(2, "0"));
  function randomFill(buf) {
    for (let i2 = 0; i2 < buf.length; i2++) {
      buf[i2] = Math.random() * 256 >>> 0;
    }
    for (let i2 = 0; i2 < buf.length; i2++) {
      if (buf[i2] > 0)
        return;
    }
    buf[buf.length - 1] = 1;
  }
  function toHex(buf) {
    let hex = "";
    for (let i2 = 0; i2 < buf.length; i2++) {
      hex += HEX[buf[i2]];
    }
    return hex;
  }
  var RandomIdGenerator = class {
    /**
     * Returns a random 16-byte trace ID formatted/encoded as a 32 lowercase hex
     * characters corresponding to 128 bits.
     */
    generateTraceId() {
      randomFill(TRACE_BUFFER);
      return toHex(TRACE_BUFFER);
    }
    /**
     * Returns a random 8-byte span ID formatted/encoded as a 16 lowercase hex
     * characters corresponding to 64 bits.
     */
    generateSpanId() {
      randomFill(SPAN_BUFFER);
      return toHex(SPAN_BUFFER);
    }
  };

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/Tracer.js
  var Tracer = class {
    /**
     * Constructs a new Tracer instance.
     */
    constructor(instrumentationScope, config, resource, spanProcessor) {
      __publicField(this, "_sampler");
      __publicField(this, "_generalLimits");
      __publicField(this, "_spanLimits");
      __publicField(this, "_idGenerator");
      __publicField(this, "instrumentationScope");
      __publicField(this, "_resource");
      __publicField(this, "_spanProcessor");
      const localConfig = mergeConfig(config);
      this._sampler = localConfig.sampler;
      this._generalLimits = localConfig.generalLimits;
      this._spanLimits = localConfig.spanLimits;
      this._idGenerator = config.idGenerator || new RandomIdGenerator();
      this._resource = resource;
      this._spanProcessor = spanProcessor;
      this.instrumentationScope = instrumentationScope;
    }
    /**
     * Starts a new Span or returns the default NoopSpan based on the sampling
     * decision.
     */
    startSpan(name, options = {}, context2 = context.active()) {
      var _a, _b, _c;
      if (options.root) {
        context2 = trace.deleteSpan(context2);
      }
      const parentSpan = trace.getSpan(context2);
      if (isTracingSuppressed(context2)) {
        diag2.debug("Instrumentation suppressed, returning Noop Span");
        const nonRecordingSpan = trace.wrapSpanContext(INVALID_SPAN_CONTEXT);
        return nonRecordingSpan;
      }
      const parentSpanContext = parentSpan == null ? void 0 : parentSpan.spanContext();
      const spanId = this._idGenerator.generateSpanId();
      let validParentSpanContext;
      let traceId;
      let traceState;
      if (!parentSpanContext || !trace.isSpanContextValid(parentSpanContext)) {
        traceId = this._idGenerator.generateTraceId();
      } else {
        traceId = parentSpanContext.traceId;
        traceState = parentSpanContext.traceState;
        validParentSpanContext = parentSpanContext;
      }
      const spanKind = (_a = options.kind) != null ? _a : SpanKind.INTERNAL;
      const links = ((_b = options.links) != null ? _b : []).map((link) => {
        return {
          context: link.context,
          attributes: sanitizeAttributes(link.attributes)
        };
      });
      const attributes = sanitizeAttributes(options.attributes);
      const samplingResult = this._sampler.shouldSample(context2, traceId, name, spanKind, attributes, links);
      traceState = (_c = samplingResult.traceState) != null ? _c : traceState;
      const traceFlags = samplingResult.decision === SamplingDecision.RECORD_AND_SAMPLED ? TraceFlags.SAMPLED : TraceFlags.NONE;
      const spanContext = { traceId, spanId, traceFlags, traceState };
      if (samplingResult.decision === SamplingDecision.NOT_RECORD) {
        diag2.debug("Recording is off, propagating context in a non-recording span");
        const nonRecordingSpan = trace.wrapSpanContext(spanContext);
        return nonRecordingSpan;
      }
      const initAttributes = sanitizeAttributes(Object.assign(attributes, samplingResult.attributes));
      const span = new SpanImpl({
        resource: this._resource,
        scope: this.instrumentationScope,
        context: context2,
        spanContext,
        name,
        kind: spanKind,
        links,
        parentSpanContext: validParentSpanContext,
        attributes: initAttributes,
        startTime: options.startTime,
        spanProcessor: this._spanProcessor,
        spanLimits: this._spanLimits
      });
      return span;
    }
    startActiveSpan(name, arg2, arg3, arg4) {
      let opts;
      let ctx;
      let fn;
      if (arguments.length < 2) {
        return;
      } else if (arguments.length === 2) {
        fn = arg2;
      } else if (arguments.length === 3) {
        opts = arg2;
        fn = arg3;
      } else {
        opts = arg2;
        ctx = arg3;
        fn = arg4;
      }
      const parentContext = ctx != null ? ctx : context.active();
      const span = this.startSpan(name, opts, parentContext);
      const contextWithSpanSet = trace.setSpan(parentContext, span);
      return context.with(contextWithSpanSet, fn, void 0, span);
    }
    /** Returns the active {@link GeneralLimits}. */
    getGeneralLimits() {
      return this._generalLimits;
    }
    /** Returns the active {@link SpanLimits}. */
    getSpanLimits() {
      return this._spanLimits;
    }
  };

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/MultiSpanProcessor.js
  var MultiSpanProcessor = class {
    constructor(spanProcessors) {
      __publicField(this, "_spanProcessors");
      this._spanProcessors = spanProcessors;
    }
    forceFlush() {
      const promises = [];
      for (const spanProcessor of this._spanProcessors) {
        promises.push(spanProcessor.forceFlush());
      }
      return new Promise((resolve) => {
        Promise.all(promises).then(() => {
          resolve();
        }).catch((error) => {
          globalErrorHandler(error || new Error("MultiSpanProcessor: forceFlush failed"));
          resolve();
        });
      });
    }
    onStart(span, context2) {
      for (const spanProcessor of this._spanProcessors) {
        spanProcessor.onStart(span, context2);
      }
    }
    onEnding(span) {
      for (const spanProcessor of this._spanProcessors) {
        if (spanProcessor.onEnding) {
          spanProcessor.onEnding(span);
        }
      }
    }
    onEnd(span) {
      for (const spanProcessor of this._spanProcessors) {
        spanProcessor.onEnd(span);
      }
    }
    shutdown() {
      const promises = [];
      for (const spanProcessor of this._spanProcessors) {
        promises.push(spanProcessor.shutdown());
      }
      return new Promise((resolve, reject) => {
        Promise.all(promises).then(() => {
          resolve();
        }, reject);
      });
    }
  };

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/BasicTracerProvider.js
  var ForceFlushState;
  (function(ForceFlushState2) {
    ForceFlushState2[ForceFlushState2["resolved"] = 0] = "resolved";
    ForceFlushState2[ForceFlushState2["timeout"] = 1] = "timeout";
    ForceFlushState2[ForceFlushState2["error"] = 2] = "error";
    ForceFlushState2[ForceFlushState2["unresolved"] = 3] = "unresolved";
  })(ForceFlushState || (ForceFlushState = {}));
  var BasicTracerProvider = class {
    constructor(config = {}) {
      __publicField(this, "_config");
      __publicField(this, "_tracers", /* @__PURE__ */ new Map());
      __publicField(this, "_resource");
      __publicField(this, "_activeSpanProcessor");
      var _a, _b;
      const mergedConfig = merge({}, loadDefaultConfig(), reconfigureLimits(config));
      this._resource = (_a = mergedConfig.resource) != null ? _a : defaultResource();
      this._config = Object.assign({}, mergedConfig, {
        resource: this._resource
      });
      const spanProcessors = [];
      if ((_b = config.spanProcessors) == null ? void 0 : _b.length) {
        spanProcessors.push(...config.spanProcessors);
      }
      this._activeSpanProcessor = new MultiSpanProcessor(spanProcessors);
    }
    getTracer(name, version, options) {
      const key = `${name}@${version || ""}:${(options == null ? void 0 : options.schemaUrl) || ""}`;
      if (!this._tracers.has(key)) {
        this._tracers.set(key, new Tracer({ name, version, schemaUrl: options == null ? void 0 : options.schemaUrl }, this._config, this._resource, this._activeSpanProcessor));
      }
      return this._tracers.get(key);
    }
    forceFlush() {
      const timeout = this._config.forceFlushTimeoutMillis;
      const promises = this._activeSpanProcessor["_spanProcessors"].map((spanProcessor) => {
        return new Promise((resolve) => {
          let state;
          const timeoutInterval = setTimeout(() => {
            resolve(new Error(`Span processor did not completed within timeout period of ${timeout} ms`));
            state = ForceFlushState.timeout;
          }, timeout);
          spanProcessor.forceFlush().then(() => {
            clearTimeout(timeoutInterval);
            if (state !== ForceFlushState.timeout) {
              state = ForceFlushState.resolved;
              resolve(state);
            }
          }).catch((error) => {
            clearTimeout(timeoutInterval);
            state = ForceFlushState.error;
            resolve(error);
          });
        });
      });
      return new Promise((resolve, reject) => {
        Promise.all(promises).then((results) => {
          const errors = results.filter((result) => result !== ForceFlushState.resolved);
          if (errors.length > 0) {
            reject(errors);
          } else {
            resolve();
          }
        }).catch((error) => reject([error]));
      });
    }
    shutdown() {
      return this._activeSpanProcessor.shutdown();
    }
  };

  // node_modules/@opentelemetry/sdk-trace-web/build/esm/StackContextManager.js
  var StackContextManager = class {
    constructor() {
      /**
       * whether the context manager is enabled or not
       */
      __publicField(this, "_enabled", false);
      /**
       * Keeps the reference to current context
       */
      __publicField(this, "_currentContext", ROOT_CONTEXT);
    }
    /**
     *
     * @param context
     * @param target Function to be executed within the context
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    _bindFunction(context2 = ROOT_CONTEXT, target) {
      const manager = this;
      const contextWrapper = function(...args) {
        return manager.with(context2, () => target.apply(this, args));
      };
      Object.defineProperty(contextWrapper, "length", {
        enumerable: false,
        configurable: true,
        writable: false,
        value: target.length
      });
      return contextWrapper;
    }
    /**
     * Returns the active context
     */
    active() {
      return this._currentContext;
    }
    /**
     * Binds a the certain context or the active one to the target function and then returns the target
     * @param context A context (span) to be bind to target
     * @param target a function or event emitter. When target or one of its callbacks is called,
     *  the provided context will be used as the active context for the duration of the call.
     */
    bind(context2, target) {
      if (context2 === void 0) {
        context2 = this.active();
      }
      if (typeof target === "function") {
        return this._bindFunction(context2, target);
      }
      return target;
    }
    /**
     * Disable the context manager (clears the current context)
     */
    disable() {
      this._currentContext = ROOT_CONTEXT;
      this._enabled = false;
      return this;
    }
    /**
     * Enables the context manager and creates a default(root) context
     */
    enable() {
      if (this._enabled) {
        return this;
      }
      this._enabled = true;
      this._currentContext = ROOT_CONTEXT;
      return this;
    }
    /**
     * Calls the callback function [fn] with the provided [context]. If [context] is undefined then it will use the window.
     * The context will be set as active
     * @param context
     * @param fn Callback function
     * @param thisArg optional receiver to be used for calling fn
     * @param args optional arguments forwarded to fn
     */
    with(context2, fn, thisArg, ...args) {
      const previousContext = this._currentContext;
      this._currentContext = context2 || ROOT_CONTEXT;
      try {
        return fn.call(thisArg, ...args);
      } finally {
        this._currentContext = previousContext;
      }
    }
  };

  // node_modules/@opentelemetry/sdk-trace-web/build/esm/WebTracerProvider.js
  function setupContextManager(contextManager) {
    if (contextManager === null) {
      return;
    }
    if (contextManager === void 0) {
      const defaultContextManager = new StackContextManager();
      defaultContextManager.enable();
      context.setGlobalContextManager(defaultContextManager);
      return;
    }
    contextManager.enable();
    context.setGlobalContextManager(contextManager);
  }
  function setupPropagator(propagator) {
    if (propagator === null) {
      return;
    }
    if (propagator === void 0) {
      propagation.setGlobalPropagator(new CompositePropagator({
        propagators: [
          new W3CTraceContextPropagator(),
          new W3CBaggagePropagator()
        ]
      }));
      return;
    }
    propagation.setGlobalPropagator(propagator);
  }
  var WebTracerProvider = class extends BasicTracerProvider {
    /**
     * Constructs a new Tracer instance.
     * @param config Web Tracer config
     */
    constructor(config = {}) {
      super(config);
    }
    /**
     * Register this TracerProvider for use with the OpenTelemetry API.
     * Undefined values may be replaced with defaults, and
     * null values will be skipped.
     *
     * @param config Configuration object for SDK registration
     */
    register(config = {}) {
      trace.setGlobalTracerProvider(this);
      setupPropagator(config.propagator);
      setupContextManager(config.contextManager);
    }
  };

  // node_modules/@opentelemetry/sdk-trace-web/build/esm/enums/PerformanceTimingNames.js
  var PerformanceTimingNames;
  (function(PerformanceTimingNames3) {
    PerformanceTimingNames3["CONNECT_END"] = "connectEnd";
    PerformanceTimingNames3["CONNECT_START"] = "connectStart";
    PerformanceTimingNames3["DECODED_BODY_SIZE"] = "decodedBodySize";
    PerformanceTimingNames3["DOM_COMPLETE"] = "domComplete";
    PerformanceTimingNames3["DOM_CONTENT_LOADED_EVENT_END"] = "domContentLoadedEventEnd";
    PerformanceTimingNames3["DOM_CONTENT_LOADED_EVENT_START"] = "domContentLoadedEventStart";
    PerformanceTimingNames3["DOM_INTERACTIVE"] = "domInteractive";
    PerformanceTimingNames3["DOMAIN_LOOKUP_END"] = "domainLookupEnd";
    PerformanceTimingNames3["DOMAIN_LOOKUP_START"] = "domainLookupStart";
    PerformanceTimingNames3["ENCODED_BODY_SIZE"] = "encodedBodySize";
    PerformanceTimingNames3["FETCH_START"] = "fetchStart";
    PerformanceTimingNames3["LOAD_EVENT_END"] = "loadEventEnd";
    PerformanceTimingNames3["LOAD_EVENT_START"] = "loadEventStart";
    PerformanceTimingNames3["NAVIGATION_START"] = "navigationStart";
    PerformanceTimingNames3["REDIRECT_END"] = "redirectEnd";
    PerformanceTimingNames3["REDIRECT_START"] = "redirectStart";
    PerformanceTimingNames3["REQUEST_START"] = "requestStart";
    PerformanceTimingNames3["RESPONSE_END"] = "responseEnd";
    PerformanceTimingNames3["RESPONSE_START"] = "responseStart";
    PerformanceTimingNames3["SECURE_CONNECTION_START"] = "secureConnectionStart";
    PerformanceTimingNames3["START_TIME"] = "startTime";
    PerformanceTimingNames3["UNLOAD_EVENT_END"] = "unloadEventEnd";
    PerformanceTimingNames3["UNLOAD_EVENT_START"] = "unloadEventStart";
  })(PerformanceTimingNames || (PerformanceTimingNames = {}));

  // node_modules/@opentelemetry/sdk-trace-web/build/esm/semconv.js
  var ATTR_HTTP_RESPONSE_CONTENT_LENGTH = "http.response_content_length";
  var ATTR_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = "http.response_content_length_uncompressed";

  // node_modules/@opentelemetry/sdk-trace-web/build/esm/utils.js
  var urlNormalizingAnchor;
  function getUrlNormalizingAnchor() {
    if (!urlNormalizingAnchor) {
      urlNormalizingAnchor = document.createElement("a");
    }
    return urlNormalizingAnchor;
  }
  function hasKey(obj, key) {
    return key in obj;
  }
  function addSpanNetworkEvent(span, performanceName, entries, ignoreZeros = true) {
    if (hasKey(entries, performanceName) && typeof entries[performanceName] === "number" && !(ignoreZeros && entries[performanceName] === 0)) {
      return span.addEvent(performanceName, entries[performanceName]);
    }
    return void 0;
  }
  function addSpanNetworkEvents(span, resource, ignoreNetworkEvents = false, ignoreZeros, skipOldSemconvContentLengthAttrs) {
    if (ignoreZeros === void 0) {
      ignoreZeros = resource[PerformanceTimingNames.START_TIME] !== 0;
    }
    if (!ignoreNetworkEvents) {
      addSpanNetworkEvent(span, PerformanceTimingNames.FETCH_START, resource, ignoreZeros);
      addSpanNetworkEvent(span, PerformanceTimingNames.DOMAIN_LOOKUP_START, resource, ignoreZeros);
      addSpanNetworkEvent(span, PerformanceTimingNames.DOMAIN_LOOKUP_END, resource, ignoreZeros);
      addSpanNetworkEvent(span, PerformanceTimingNames.CONNECT_START, resource, ignoreZeros);
      addSpanNetworkEvent(span, PerformanceTimingNames.SECURE_CONNECTION_START, resource, ignoreZeros);
      addSpanNetworkEvent(span, PerformanceTimingNames.CONNECT_END, resource, ignoreZeros);
      addSpanNetworkEvent(span, PerformanceTimingNames.REQUEST_START, resource, ignoreZeros);
      addSpanNetworkEvent(span, PerformanceTimingNames.RESPONSE_START, resource, ignoreZeros);
      addSpanNetworkEvent(span, PerformanceTimingNames.RESPONSE_END, resource, ignoreZeros);
    }
    if (!skipOldSemconvContentLengthAttrs) {
      const encodedLength = resource[PerformanceTimingNames.ENCODED_BODY_SIZE];
      if (encodedLength !== void 0) {
        span.setAttribute(ATTR_HTTP_RESPONSE_CONTENT_LENGTH, encodedLength);
      }
      const decodedLength = resource[PerformanceTimingNames.DECODED_BODY_SIZE];
      if (decodedLength !== void 0 && encodedLength !== decodedLength) {
        span.setAttribute(ATTR_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED, decodedLength);
      }
    }
  }
  function sortResources(filteredResources) {
    return filteredResources.slice().sort((a2, b2) => {
      const valueA = a2[PerformanceTimingNames.FETCH_START];
      const valueB = b2[PerformanceTimingNames.FETCH_START];
      if (valueA > valueB) {
        return 1;
      } else if (valueA < valueB) {
        return -1;
      }
      return 0;
    });
  }
  function getOrigin() {
    return typeof location !== "undefined" ? location.origin : void 0;
  }
  function getResource(spanUrl, startTimeHR, endTimeHR, resources, ignoredResources = /* @__PURE__ */ new WeakSet(), initiatorType) {
    const parsedSpanUrl = parseUrl(spanUrl);
    spanUrl = parsedSpanUrl.toString();
    const filteredResources = filterResourcesForSpan(spanUrl, startTimeHR, endTimeHR, resources, ignoredResources, initiatorType);
    if (filteredResources.length === 0) {
      return {
        mainRequest: void 0
      };
    }
    if (filteredResources.length === 1) {
      return {
        mainRequest: filteredResources[0]
      };
    }
    const sorted = sortResources(filteredResources);
    if (parsedSpanUrl.origin !== getOrigin() && sorted.length > 1) {
      let corsPreFlightRequest = sorted[0];
      let mainRequest = findMainRequest(sorted, corsPreFlightRequest[PerformanceTimingNames.RESPONSE_END], endTimeHR);
      const responseEnd = corsPreFlightRequest[PerformanceTimingNames.RESPONSE_END];
      const fetchStart = mainRequest[PerformanceTimingNames.FETCH_START];
      if (fetchStart < responseEnd) {
        mainRequest = corsPreFlightRequest;
        corsPreFlightRequest = void 0;
      }
      return {
        corsPreFlightRequest,
        mainRequest
      };
    } else {
      return {
        mainRequest: filteredResources[0]
      };
    }
  }
  function findMainRequest(resources, corsPreFlightRequestEndTime, spanEndTimeHR) {
    const spanEndTime = hrTimeToNanoseconds(spanEndTimeHR);
    const minTime = hrTimeToNanoseconds(timeInputToHrTime(corsPreFlightRequestEndTime));
    let mainRequest = resources[1];
    let bestGap;
    const length = resources.length;
    for (let i2 = 1; i2 < length; i2++) {
      const resource = resources[i2];
      const resourceStartTime = hrTimeToNanoseconds(timeInputToHrTime(resource[PerformanceTimingNames.FETCH_START]));
      const resourceEndTime = hrTimeToNanoseconds(timeInputToHrTime(resource[PerformanceTimingNames.RESPONSE_END]));
      const currentGap = spanEndTime - resourceEndTime;
      if (resourceStartTime >= minTime && (!bestGap || currentGap < bestGap)) {
        bestGap = currentGap;
        mainRequest = resource;
      }
    }
    return mainRequest;
  }
  function filterResourcesForSpan(spanUrl, startTimeHR, endTimeHR, resources, ignoredResources, initiatorType) {
    const startTime = hrTimeToNanoseconds(startTimeHR);
    const endTime = hrTimeToNanoseconds(endTimeHR);
    let filteredResources = resources.filter((resource) => {
      const resourceStartTime = hrTimeToNanoseconds(timeInputToHrTime(resource[PerformanceTimingNames.FETCH_START]));
      const resourceEndTime = hrTimeToNanoseconds(timeInputToHrTime(resource[PerformanceTimingNames.RESPONSE_END]));
      return resource.initiatorType.toLowerCase() === (initiatorType || "xmlhttprequest") && resource.name === spanUrl && resourceStartTime >= startTime && resourceEndTime <= endTime;
    });
    if (filteredResources.length > 0) {
      filteredResources = filteredResources.filter((resource) => {
        return !ignoredResources.has(resource);
      });
    }
    return filteredResources;
  }
  function parseUrl(url) {
    if (typeof URL === "function") {
      return new URL(url, typeof document !== "undefined" ? document.baseURI : typeof location !== "undefined" ? location.href : void 0);
    }
    const element = getUrlNormalizingAnchor();
    element.href = url;
    return element;
  }
  function getElementXPath(target, optimised) {
    if (target.nodeType === Node.DOCUMENT_NODE) {
      return "/";
    }
    const targetValue = getNodeValue(target, optimised);
    if (optimised && targetValue.indexOf("@id") > 0) {
      return targetValue;
    }
    let xpath = "";
    if (target.parentNode) {
      xpath += getElementXPath(target.parentNode, false);
    }
    xpath += targetValue;
    return xpath;
  }
  function getNodeIndex(target) {
    if (!target.parentNode) {
      return 0;
    }
    const allowedTypes = [target.nodeType];
    if (target.nodeType === Node.CDATA_SECTION_NODE) {
      allowedTypes.push(Node.TEXT_NODE);
    }
    let elements = Array.from(target.parentNode.childNodes);
    elements = elements.filter((element) => {
      const localName = element.localName;
      return allowedTypes.indexOf(element.nodeType) >= 0 && localName === target.localName;
    });
    if (elements.length >= 1) {
      return elements.indexOf(target) + 1;
    }
    return 0;
  }
  function getNodeValue(target, optimised) {
    const nodeType = target.nodeType;
    const index = getNodeIndex(target);
    let nodeValue = "";
    if (nodeType === Node.ELEMENT_NODE) {
      const id = target.getAttribute("id");
      if (optimised && id) {
        return `//*[@id="${id}"]`;
      }
      nodeValue = target.localName;
    } else if (nodeType === Node.TEXT_NODE || nodeType === Node.CDATA_SECTION_NODE) {
      nodeValue = "text()";
    } else if (nodeType === Node.COMMENT_NODE) {
      nodeValue = "comment()";
    } else {
      return "";
    }
    if (nodeValue && index > 1) {
      return `/${nodeValue}[${index}]`;
    }
    return `/${nodeValue}`;
  }
  function shouldPropagateTraceHeaders(spanUrl, propagateTraceHeaderCorsUrls) {
    let propagateTraceHeaderUrls = propagateTraceHeaderCorsUrls || [];
    if (typeof propagateTraceHeaderUrls === "string" || propagateTraceHeaderUrls instanceof RegExp) {
      propagateTraceHeaderUrls = [propagateTraceHeaderUrls];
    }
    const parsedSpanUrl = parseUrl(spanUrl);
    if (parsedSpanUrl.origin === getOrigin()) {
      return true;
    } else {
      return propagateTraceHeaderUrls.some((propagateTraceHeaderUrl) => urlMatches(spanUrl, propagateTraceHeaderUrl));
    }
  }

  // node_modules/@opentelemetry/context-zone-peer-dep/build/esm/util.js
  function isListenerObject(obj) {
    return typeof obj === "object" && obj !== null && "addEventListener" in obj && typeof obj.addEventListener === "function" && "removeEventListener" in obj && typeof obj.removeEventListener === "function";
  }

  // node_modules/@opentelemetry/context-zone-peer-dep/build/esm/ZoneContextManager.js
  var ZONE_CONTEXT_KEY = "OT_ZONE_CONTEXT";
  var ZoneContextManager = class {
    constructor() {
      /**
       * whether the context manager is enabled or not
       */
      __publicField(this, "_enabled", false);
      /**
       * Helps to create a unique name for the zones - part of zone name
       */
      __publicField(this, "_zoneCounter", 0);
    }
    /**
     * Returns the active context from certain zone name
     * @param activeZone
     */
    _activeContextFromZone(activeZone) {
      return activeZone && activeZone.get(ZONE_CONTEXT_KEY) || ROOT_CONTEXT;
    }
    /**
     * @param context A context (span) to be executed within target function
     * @param target Function to be executed within the context
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    _bindFunction(context2, target) {
      const manager = this;
      const contextWrapper = function(...args) {
        return manager.with(context2, () => target.apply(this, args));
      };
      Object.defineProperty(contextWrapper, "length", {
        enumerable: false,
        configurable: true,
        writable: false,
        value: target.length
      });
      return contextWrapper;
    }
    /**
     * @param context A context (span) to be bind to target
     * @param obj target object on which the listeners will be patched
     */
    _bindListener(context2, obj) {
      const target = obj;
      if (target.__ot_listeners !== void 0) {
        return obj;
      }
      target.__ot_listeners = {};
      if (typeof target.addEventListener === "function") {
        target.addEventListener = this._patchAddEventListener(target, target.addEventListener, context2);
      }
      if (typeof target.removeEventListener === "function") {
        target.removeEventListener = this._patchRemoveEventListener(target, target.removeEventListener);
      }
      return obj;
    }
    /**
     * Creates a new unique zone name
     */
    _createZoneName() {
      this._zoneCounter++;
      const random = Math.random();
      return `${this._zoneCounter}-${random}`;
    }
    /**
     * Creates a new zone
     * @param zoneName zone name
     * @param context A context (span) to be bind with Zone
     */
    _createZone(zoneName, context2) {
      return Zone.current.fork({
        name: zoneName,
        properties: {
          [ZONE_CONTEXT_KEY]: context2
        }
      });
    }
    /**
     * Returns the active zone
     */
    _getActiveZone() {
      return Zone.current;
    }
    /**
     * Patches addEventListener method
     * @param target any target that has "addEventListener" method
     * @param original reference to the patched method
     * @param [context] context to be bind to the listener
     */
    _patchAddEventListener(target, original, context2) {
      const contextManager = this;
      return function(event, listener, opts) {
        if (target.__ot_listeners === void 0) {
          target.__ot_listeners = {};
        }
        let listeners = target.__ot_listeners[event];
        if (listeners === void 0) {
          listeners = /* @__PURE__ */ new WeakMap();
          target.__ot_listeners[event] = listeners;
        }
        const patchedListener = contextManager.bind(context2, listener);
        listeners.set(listener, patchedListener);
        return original.call(this, event, patchedListener, opts);
      };
    }
    /**
     * Patches removeEventListener method
     * @param target any target that has "removeEventListener" method
     * @param original reference to the patched method
     */
    _patchRemoveEventListener(target, original) {
      return function(event, listener) {
        if (target.__ot_listeners === void 0 || target.__ot_listeners[event] === void 0) {
          return original.call(this, event, listener);
        }
        const events = target.__ot_listeners[event];
        const patchedListener = events.get(listener);
        events.delete(listener);
        return original.call(this, event, patchedListener || listener);
      };
    }
    /**
     * Returns the active context
     */
    active() {
      if (!this._enabled) {
        return ROOT_CONTEXT;
      }
      const activeZone = this._getActiveZone();
      const active = this._activeContextFromZone(activeZone);
      if (active) {
        return active;
      }
      return ROOT_CONTEXT;
    }
    /**
     * Binds a the certain context or the active one to the target function and then returns the target
     * @param context A context (span) to be bind to target
     * @param target a function or event emitter. When target or one of its callbacks is called,
     *  the provided context will be used as the active context for the duration of the call.
     */
    bind(context2, target) {
      if (context2 === void 0) {
        context2 = this.active();
      }
      if (typeof target === "function") {
        return this._bindFunction(context2, target);
      } else if (isListenerObject(target)) {
        this._bindListener(context2, target);
      }
      return target;
    }
    /**
     * Disable the context manager (clears all the contexts)
     */
    disable() {
      this._enabled = false;
      return this;
    }
    /**
     * Enables the context manager and creates a default(root) context
     */
    enable() {
      this._enabled = true;
      return this;
    }
    /**
     * Calls the callback function [fn] with the provided [context].
     *     If [context] is undefined then it will use the active context.
     *     The context will be set as active
     * @param context A context (span) to be called with provided callback
     * @param fn Callback function
     * @param thisArg optional receiver to be used for calling fn
     * @param args optional arguments forwarded to fn
     */
    with(context2, fn, thisArg, ...args) {
      const zoneName = this._createZoneName();
      const newZone = this._createZone(zoneName, context2);
      return newZone.run(fn, thisArg, args);
    }
  };

  // node_modules/zone.js/fesm2015/zone.js
  var __defProp2 = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a2, b2) => {
    for (var prop in b2 || (b2 = {}))
      if (__hasOwnProp.call(b2, prop))
        __defNormalProp2(a2, prop, b2[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b2)) {
        if (__propIsEnum.call(b2, prop))
          __defNormalProp2(a2, prop, b2[prop]);
      }
    return a2;
  };
  var __spreadProps = (a2, b2) => __defProps(a2, __getOwnPropDescs(b2));
  var __publicField2 = (obj, key, value) => {
    __defNormalProp2(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var global2 = globalThis;
  function __symbol__(name) {
    const symbolPrefix = global2["__Zone_symbol_prefix"] || "__zone_symbol__";
    return symbolPrefix + name;
  }
  function initZone() {
    const performance2 = global2["performance"];
    function mark(name) {
      performance2 && performance2["mark"] && performance2["mark"](name);
    }
    function performanceMeasure(name, label) {
      performance2 && performance2["measure"] && performance2["measure"](name, label);
    }
    mark("Zone");
    const _ZoneImpl = class _ZoneImpl2 {
      constructor(parent, zoneSpec) {
        __publicField2(this, "_parent");
        __publicField2(this, "_name");
        __publicField2(this, "_properties");
        __publicField2(this, "_zoneDelegate");
        this._parent = parent;
        this._name = zoneSpec ? zoneSpec.name || "unnamed" : "<root>";
        this._properties = zoneSpec && zoneSpec.properties || {};
        this._zoneDelegate = new _ZoneDelegate(this, this._parent && this._parent._zoneDelegate, zoneSpec);
      }
      static assertZonePatched() {
        if (global2["Promise"] !== patches["ZoneAwarePromise"]) {
          throw new Error("Zone.js has detected that ZoneAwarePromise `(window|global).Promise` has been overwritten.\nMost likely cause is that a Promise polyfill has been loaded after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. If you must load one, do so before loading zone.js.)");
        }
      }
      static get root() {
        let zone = _ZoneImpl2.current;
        while (zone.parent) {
          zone = zone.parent;
        }
        return zone;
      }
      static get current() {
        return _currentZoneFrame.zone;
      }
      static get currentTask() {
        return _currentTask;
      }
      static __load_patch(name, fn, ignoreDuplicate = false) {
        if (patches.hasOwnProperty(name)) {
          const checkDuplicate = global2[__symbol__("forceDuplicateZoneCheck")] === true;
          if (!ignoreDuplicate && checkDuplicate) {
            throw Error("Already loaded patch: " + name);
          }
        } else if (!global2["__Zone_disable_" + name]) {
          const perfName = "Zone:" + name;
          mark(perfName);
          patches[name] = fn(global2, _ZoneImpl2, _api);
          performanceMeasure(perfName, perfName);
        }
      }
      get parent() {
        return this._parent;
      }
      get name() {
        return this._name;
      }
      get(key) {
        const zone = this.getZoneWith(key);
        if (zone)
          return zone._properties[key];
      }
      getZoneWith(key) {
        let current = this;
        while (current) {
          if (current._properties.hasOwnProperty(key)) {
            return current;
          }
          current = current._parent;
        }
        return null;
      }
      fork(zoneSpec) {
        if (!zoneSpec)
          throw new Error("ZoneSpec required!");
        return this._zoneDelegate.fork(this, zoneSpec);
      }
      wrap(callback, source) {
        if (typeof callback !== "function") {
          throw new Error("Expecting function got: " + callback);
        }
        const _callback = this._zoneDelegate.intercept(this, callback, source);
        const zone = this;
        return function() {
          return zone.runGuarded(_callback, this, arguments, source);
        };
      }
      run(callback, applyThis, applyArgs, source) {
        _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
        try {
          return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
        } finally {
          _currentZoneFrame = _currentZoneFrame.parent;
        }
      }
      runGuarded(callback, applyThis = null, applyArgs, source) {
        _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
        try {
          try {
            return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
          } catch (error) {
            if (this._zoneDelegate.handleError(this, error)) {
              throw error;
            }
          }
        } finally {
          _currentZoneFrame = _currentZoneFrame.parent;
        }
      }
      runTask(task, applyThis, applyArgs) {
        if (task.zone != this) {
          throw new Error("A task can only be run in the zone of creation! (Creation: " + (task.zone || NO_ZONE).name + "; Execution: " + this.name + ")");
        }
        const zoneTask = task;
        const { type, data: { isPeriodic = false, isRefreshable = false } = {} } = task;
        if (task.state === notScheduled && (type === eventTask || type === macroTask)) {
          return;
        }
        const reEntryGuard = task.state != running;
        reEntryGuard && zoneTask._transitionTo(running, scheduled);
        const previousTask = _currentTask;
        _currentTask = zoneTask;
        _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
        try {
          if (type == macroTask && task.data && !isPeriodic && !isRefreshable) {
            task.cancelFn = void 0;
          }
          try {
            return this._zoneDelegate.invokeTask(this, zoneTask, applyThis, applyArgs);
          } catch (error) {
            if (this._zoneDelegate.handleError(this, error)) {
              throw error;
            }
          }
        } finally {
          const state = task.state;
          if (state !== notScheduled && state !== unknown) {
            if (type == eventTask || isPeriodic || isRefreshable && state === scheduling) {
              reEntryGuard && zoneTask._transitionTo(scheduled, running, scheduling);
            } else {
              const zoneDelegates = zoneTask._zoneDelegates;
              this._updateTaskCount(zoneTask, -1);
              reEntryGuard && zoneTask._transitionTo(notScheduled, running, notScheduled);
              if (isRefreshable) {
                zoneTask._zoneDelegates = zoneDelegates;
              }
            }
          }
          _currentZoneFrame = _currentZoneFrame.parent;
          _currentTask = previousTask;
        }
      }
      scheduleTask(task) {
        if (task.zone && task.zone !== this) {
          let newZone = this;
          while (newZone) {
            if (newZone === task.zone) {
              throw Error(`can not reschedule task to ${this.name} which is descendants of the original zone ${task.zone.name}`);
            }
            newZone = newZone.parent;
          }
        }
        task._transitionTo(scheduling, notScheduled);
        const zoneDelegates = [];
        task._zoneDelegates = zoneDelegates;
        task._zone = this;
        try {
          task = this._zoneDelegate.scheduleTask(this, task);
        } catch (err) {
          task._transitionTo(unknown, scheduling, notScheduled);
          this._zoneDelegate.handleError(this, err);
          throw err;
        }
        if (task._zoneDelegates === zoneDelegates) {
          this._updateTaskCount(task, 1);
        }
        if (task.state == scheduling) {
          task._transitionTo(scheduled, scheduling);
        }
        return task;
      }
      scheduleMicroTask(source, callback, data, customSchedule) {
        return this.scheduleTask(new ZoneTask(microTask, source, callback, data, customSchedule, void 0));
      }
      scheduleMacroTask(source, callback, data, customSchedule, customCancel) {
        return this.scheduleTask(new ZoneTask(macroTask, source, callback, data, customSchedule, customCancel));
      }
      scheduleEventTask(source, callback, data, customSchedule, customCancel) {
        return this.scheduleTask(new ZoneTask(eventTask, source, callback, data, customSchedule, customCancel));
      }
      cancelTask(task) {
        if (task.zone != this)
          throw new Error("A task can only be cancelled in the zone of creation! (Creation: " + (task.zone || NO_ZONE).name + "; Execution: " + this.name + ")");
        if (task.state !== scheduled && task.state !== running) {
          return;
        }
        task._transitionTo(canceling, scheduled, running);
        try {
          this._zoneDelegate.cancelTask(this, task);
        } catch (err) {
          task._transitionTo(unknown, canceling);
          this._zoneDelegate.handleError(this, err);
          throw err;
        }
        this._updateTaskCount(task, -1);
        task._transitionTo(notScheduled, canceling);
        task.runCount = -1;
        return task;
      }
      _updateTaskCount(task, count) {
        const zoneDelegates = task._zoneDelegates;
        if (count == -1) {
          task._zoneDelegates = null;
        }
        for (let i2 = 0; i2 < zoneDelegates.length; i2++) {
          zoneDelegates[i2]._updateTaskCount(task.type, count);
        }
      }
    };
    __publicField2(_ZoneImpl, "__symbol__", __symbol__);
    let ZoneImpl = _ZoneImpl;
    const DELEGATE_ZS = {
      name: "",
      onHasTask: (delegate, _2, target, hasTaskState) => delegate.hasTask(target, hasTaskState),
      onScheduleTask: (delegate, _2, target, task) => delegate.scheduleTask(target, task),
      onInvokeTask: (delegate, _2, target, task, applyThis, applyArgs) => delegate.invokeTask(target, task, applyThis, applyArgs),
      onCancelTask: (delegate, _2, target, task) => delegate.cancelTask(target, task)
    };
    class _ZoneDelegate {
      constructor(zone, parentDelegate, zoneSpec) {
        __publicField2(this, "_zone");
        __publicField2(this, "_taskCounts", {
          "microTask": 0,
          "macroTask": 0,
          "eventTask": 0
        });
        __publicField2(this, "_parentDelegate");
        __publicField2(this, "_forkDlgt");
        __publicField2(this, "_forkZS");
        __publicField2(this, "_forkCurrZone");
        __publicField2(this, "_interceptDlgt");
        __publicField2(this, "_interceptZS");
        __publicField2(this, "_interceptCurrZone");
        __publicField2(this, "_invokeDlgt");
        __publicField2(this, "_invokeZS");
        __publicField2(this, "_invokeCurrZone");
        __publicField2(this, "_handleErrorDlgt");
        __publicField2(this, "_handleErrorZS");
        __publicField2(this, "_handleErrorCurrZone");
        __publicField2(this, "_scheduleTaskDlgt");
        __publicField2(this, "_scheduleTaskZS");
        __publicField2(this, "_scheduleTaskCurrZone");
        __publicField2(this, "_invokeTaskDlgt");
        __publicField2(this, "_invokeTaskZS");
        __publicField2(this, "_invokeTaskCurrZone");
        __publicField2(this, "_cancelTaskDlgt");
        __publicField2(this, "_cancelTaskZS");
        __publicField2(this, "_cancelTaskCurrZone");
        __publicField2(this, "_hasTaskDlgt");
        __publicField2(this, "_hasTaskDlgtOwner");
        __publicField2(this, "_hasTaskZS");
        __publicField2(this, "_hasTaskCurrZone");
        this._zone = zone;
        this._parentDelegate = parentDelegate;
        this._forkZS = zoneSpec && (zoneSpec && zoneSpec.onFork ? zoneSpec : parentDelegate._forkZS);
        this._forkDlgt = zoneSpec && (zoneSpec.onFork ? parentDelegate : parentDelegate._forkDlgt);
        this._forkCurrZone = zoneSpec && (zoneSpec.onFork ? this._zone : parentDelegate._forkCurrZone);
        this._interceptZS = zoneSpec && (zoneSpec.onIntercept ? zoneSpec : parentDelegate._interceptZS);
        this._interceptDlgt = zoneSpec && (zoneSpec.onIntercept ? parentDelegate : parentDelegate._interceptDlgt);
        this._interceptCurrZone = zoneSpec && (zoneSpec.onIntercept ? this._zone : parentDelegate._interceptCurrZone);
        this._invokeZS = zoneSpec && (zoneSpec.onInvoke ? zoneSpec : parentDelegate._invokeZS);
        this._invokeDlgt = zoneSpec && (zoneSpec.onInvoke ? parentDelegate : parentDelegate._invokeDlgt);
        this._invokeCurrZone = zoneSpec && (zoneSpec.onInvoke ? this._zone : parentDelegate._invokeCurrZone);
        this._handleErrorZS = zoneSpec && (zoneSpec.onHandleError ? zoneSpec : parentDelegate._handleErrorZS);
        this._handleErrorDlgt = zoneSpec && (zoneSpec.onHandleError ? parentDelegate : parentDelegate._handleErrorDlgt);
        this._handleErrorCurrZone = zoneSpec && (zoneSpec.onHandleError ? this._zone : parentDelegate._handleErrorCurrZone);
        this._scheduleTaskZS = zoneSpec && (zoneSpec.onScheduleTask ? zoneSpec : parentDelegate._scheduleTaskZS);
        this._scheduleTaskDlgt = zoneSpec && (zoneSpec.onScheduleTask ? parentDelegate : parentDelegate._scheduleTaskDlgt);
        this._scheduleTaskCurrZone = zoneSpec && (zoneSpec.onScheduleTask ? this._zone : parentDelegate._scheduleTaskCurrZone);
        this._invokeTaskZS = zoneSpec && (zoneSpec.onInvokeTask ? zoneSpec : parentDelegate._invokeTaskZS);
        this._invokeTaskDlgt = zoneSpec && (zoneSpec.onInvokeTask ? parentDelegate : parentDelegate._invokeTaskDlgt);
        this._invokeTaskCurrZone = zoneSpec && (zoneSpec.onInvokeTask ? this._zone : parentDelegate._invokeTaskCurrZone);
        this._cancelTaskZS = zoneSpec && (zoneSpec.onCancelTask ? zoneSpec : parentDelegate._cancelTaskZS);
        this._cancelTaskDlgt = zoneSpec && (zoneSpec.onCancelTask ? parentDelegate : parentDelegate._cancelTaskDlgt);
        this._cancelTaskCurrZone = zoneSpec && (zoneSpec.onCancelTask ? this._zone : parentDelegate._cancelTaskCurrZone);
        this._hasTaskZS = null;
        this._hasTaskDlgt = null;
        this._hasTaskDlgtOwner = null;
        this._hasTaskCurrZone = null;
        const zoneSpecHasTask = zoneSpec && zoneSpec.onHasTask;
        const parentHasTask = parentDelegate && parentDelegate._hasTaskZS;
        if (zoneSpecHasTask || parentHasTask) {
          this._hasTaskZS = zoneSpecHasTask ? zoneSpec : DELEGATE_ZS;
          this._hasTaskDlgt = parentDelegate;
          this._hasTaskDlgtOwner = this;
          this._hasTaskCurrZone = this._zone;
          if (!zoneSpec.onScheduleTask) {
            this._scheduleTaskZS = DELEGATE_ZS;
            this._scheduleTaskDlgt = parentDelegate;
            this._scheduleTaskCurrZone = this._zone;
          }
          if (!zoneSpec.onInvokeTask) {
            this._invokeTaskZS = DELEGATE_ZS;
            this._invokeTaskDlgt = parentDelegate;
            this._invokeTaskCurrZone = this._zone;
          }
          if (!zoneSpec.onCancelTask) {
            this._cancelTaskZS = DELEGATE_ZS;
            this._cancelTaskDlgt = parentDelegate;
            this._cancelTaskCurrZone = this._zone;
          }
        }
      }
      get zone() {
        return this._zone;
      }
      fork(targetZone, zoneSpec) {
        return this._forkZS ? this._forkZS.onFork(this._forkDlgt, this.zone, targetZone, zoneSpec) : new ZoneImpl(targetZone, zoneSpec);
      }
      intercept(targetZone, callback, source) {
        return this._interceptZS ? this._interceptZS.onIntercept(this._interceptDlgt, this._interceptCurrZone, targetZone, callback, source) : callback;
      }
      invoke(targetZone, callback, applyThis, applyArgs, source) {
        return this._invokeZS ? this._invokeZS.onInvoke(this._invokeDlgt, this._invokeCurrZone, targetZone, callback, applyThis, applyArgs, source) : callback.apply(applyThis, applyArgs);
      }
      handleError(targetZone, error) {
        return this._handleErrorZS ? this._handleErrorZS.onHandleError(this._handleErrorDlgt, this._handleErrorCurrZone, targetZone, error) : true;
      }
      scheduleTask(targetZone, task) {
        let returnTask = task;
        if (this._scheduleTaskZS) {
          if (this._hasTaskZS) {
            returnTask._zoneDelegates.push(this._hasTaskDlgtOwner);
          }
          returnTask = this._scheduleTaskZS.onScheduleTask(this._scheduleTaskDlgt, this._scheduleTaskCurrZone, targetZone, task);
          if (!returnTask)
            returnTask = task;
        } else {
          if (task.scheduleFn) {
            task.scheduleFn(task);
          } else if (task.type == microTask) {
            scheduleMicroTask(task);
          } else {
            throw new Error("Task is missing scheduleFn.");
          }
        }
        return returnTask;
      }
      invokeTask(targetZone, task, applyThis, applyArgs) {
        return this._invokeTaskZS ? this._invokeTaskZS.onInvokeTask(this._invokeTaskDlgt, this._invokeTaskCurrZone, targetZone, task, applyThis, applyArgs) : task.callback.apply(applyThis, applyArgs);
      }
      cancelTask(targetZone, task) {
        let value;
        if (this._cancelTaskZS) {
          value = this._cancelTaskZS.onCancelTask(this._cancelTaskDlgt, this._cancelTaskCurrZone, targetZone, task);
        } else {
          if (!task.cancelFn) {
            throw Error("Task is not cancelable");
          }
          value = task.cancelFn(task);
        }
        return value;
      }
      hasTask(targetZone, isEmpty) {
        try {
          this._hasTaskZS && this._hasTaskZS.onHasTask(this._hasTaskDlgt, this._hasTaskCurrZone, targetZone, isEmpty);
        } catch (err) {
          this.handleError(targetZone, err);
        }
      }
      _updateTaskCount(type, count) {
        const counts = this._taskCounts;
        const prev = counts[type];
        const next = counts[type] = prev + count;
        if (next < 0) {
          throw new Error("More tasks executed then were scheduled.");
        }
        if (prev == 0 || next == 0) {
          const isEmpty = {
            microTask: counts["microTask"] > 0,
            macroTask: counts["macroTask"] > 0,
            eventTask: counts["eventTask"] > 0,
            change: type
          };
          this.hasTask(this._zone, isEmpty);
        }
      }
    }
    class ZoneTask {
      constructor(type, source, callback, options, scheduleFn, cancelFn) {
        __publicField2(this, "type");
        __publicField2(this, "source");
        __publicField2(this, "invoke");
        __publicField2(this, "callback");
        __publicField2(this, "data");
        __publicField2(this, "scheduleFn");
        __publicField2(this, "cancelFn");
        __publicField2(this, "_zone", null);
        __publicField2(this, "runCount", 0);
        __publicField2(this, "_zoneDelegates", null);
        __publicField2(this, "_state", "notScheduled");
        this.type = type;
        this.source = source;
        this.data = options;
        this.scheduleFn = scheduleFn;
        this.cancelFn = cancelFn;
        if (!callback) {
          throw new Error("callback is not defined");
        }
        this.callback = callback;
        const self2 = this;
        if (type === eventTask && options && options.useG) {
          this.invoke = ZoneTask.invokeTask;
        } else {
          this.invoke = function() {
            return ZoneTask.invokeTask.call(global2, self2, this, arguments);
          };
        }
      }
      static invokeTask(task, target, args) {
        if (!task) {
          task = this;
        }
        _numberOfNestedTaskFrames++;
        try {
          task.runCount++;
          return task.zone.runTask(task, target, args);
        } finally {
          if (_numberOfNestedTaskFrames == 1) {
            drainMicroTaskQueue();
          }
          _numberOfNestedTaskFrames--;
        }
      }
      get zone() {
        return this._zone;
      }
      get state() {
        return this._state;
      }
      cancelScheduleRequest() {
        this._transitionTo(notScheduled, scheduling);
      }
      _transitionTo(toState, fromState1, fromState2) {
        if (this._state === fromState1 || this._state === fromState2) {
          this._state = toState;
          if (toState == notScheduled) {
            this._zoneDelegates = null;
          }
        } else {
          throw new Error(`${this.type} '${this.source}': can not transition to '${toState}', expecting state '${fromState1}'${fromState2 ? " or '" + fromState2 + "'" : ""}, was '${this._state}'.`);
        }
      }
      toString() {
        if (this.data && typeof this.data.handleId !== "undefined") {
          return this.data.handleId.toString();
        } else {
          return Object.prototype.toString.call(this);
        }
      }
      // add toJSON method to prevent cyclic error when
      // call JSON.stringify(zoneTask)
      toJSON() {
        return {
          type: this.type,
          state: this.state,
          source: this.source,
          zone: this.zone.name,
          runCount: this.runCount
        };
      }
    }
    const symbolSetTimeout = __symbol__("setTimeout");
    const symbolPromise = __symbol__("Promise");
    const symbolThen = __symbol__("then");
    let _microTaskQueue = [];
    let _isDrainingMicrotaskQueue = false;
    let nativeMicroTaskQueuePromise;
    function nativeScheduleMicroTask(func) {
      if (!nativeMicroTaskQueuePromise) {
        if (global2[symbolPromise]) {
          nativeMicroTaskQueuePromise = global2[symbolPromise].resolve(0);
        }
      }
      if (nativeMicroTaskQueuePromise) {
        let nativeThen = nativeMicroTaskQueuePromise[symbolThen];
        if (!nativeThen) {
          nativeThen = nativeMicroTaskQueuePromise["then"];
        }
        nativeThen.call(nativeMicroTaskQueuePromise, func);
      } else {
        global2[symbolSetTimeout](func, 0);
      }
    }
    function scheduleMicroTask(task) {
      if (_numberOfNestedTaskFrames === 0 && _microTaskQueue.length === 0) {
        nativeScheduleMicroTask(drainMicroTaskQueue);
      }
      task && _microTaskQueue.push(task);
    }
    function drainMicroTaskQueue() {
      if (!_isDrainingMicrotaskQueue) {
        _isDrainingMicrotaskQueue = true;
        while (_microTaskQueue.length) {
          const queue = _microTaskQueue;
          _microTaskQueue = [];
          for (let i2 = 0; i2 < queue.length; i2++) {
            const task = queue[i2];
            try {
              task.zone.runTask(task, null, null);
            } catch (error) {
              _api.onUnhandledError(error);
            }
          }
        }
        _api.microtaskDrainDone();
        _isDrainingMicrotaskQueue = false;
      }
    }
    const NO_ZONE = { name: "NO ZONE" };
    const notScheduled = "notScheduled", scheduling = "scheduling", scheduled = "scheduled", running = "running", canceling = "canceling", unknown = "unknown";
    const microTask = "microTask", macroTask = "macroTask", eventTask = "eventTask";
    const patches = {};
    const _api = {
      symbol: __symbol__,
      currentZoneFrame: () => _currentZoneFrame,
      onUnhandledError: noop,
      microtaskDrainDone: noop,
      scheduleMicroTask,
      showUncaughtError: () => !ZoneImpl[__symbol__("ignoreConsoleErrorUncaughtError")],
      patchEventTarget: () => [],
      patchOnProperties: noop,
      patchMethod: () => noop,
      bindArguments: () => [],
      patchThen: () => noop,
      patchMacroTask: () => noop,
      patchEventPrototype: () => noop,
      getGlobalObjects: () => void 0,
      ObjectDefineProperty: () => noop,
      ObjectGetOwnPropertyDescriptor: () => void 0,
      ObjectCreate: () => void 0,
      ArraySlice: () => [],
      patchClass: () => noop,
      wrapWithCurrentZone: () => noop,
      filterProperties: () => [],
      attachOriginToPatched: () => noop,
      _redefineProperty: () => noop,
      patchCallbacks: () => noop,
      nativeScheduleMicroTask
    };
    let _currentZoneFrame = { parent: null, zone: new ZoneImpl(null, null) };
    let _currentTask = null;
    let _numberOfNestedTaskFrames = 0;
    function noop() {
    }
    performanceMeasure("Zone", "Zone");
    return ZoneImpl;
  }
  function loadZone() {
    var _a;
    const global22 = globalThis;
    const checkDuplicate = global22[__symbol__("forceDuplicateZoneCheck")] === true;
    if (global22["Zone"] && (checkDuplicate || typeof global22["Zone"].__symbol__ !== "function")) {
      throw new Error("Zone already loaded.");
    }
    (_a = global22["Zone"]) != null ? _a : global22["Zone"] = initZone();
    return global22["Zone"];
  }
  var ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var ObjectDefineProperty = Object.defineProperty;
  var ObjectGetPrototypeOf = Object.getPrototypeOf;
  var ObjectCreate = Object.create;
  var ArraySlice = Array.prototype.slice;
  var ADD_EVENT_LISTENER_STR = "addEventListener";
  var REMOVE_EVENT_LISTENER_STR = "removeEventListener";
  var ZONE_SYMBOL_ADD_EVENT_LISTENER = __symbol__(ADD_EVENT_LISTENER_STR);
  var ZONE_SYMBOL_REMOVE_EVENT_LISTENER = __symbol__(REMOVE_EVENT_LISTENER_STR);
  var TRUE_STR = "true";
  var FALSE_STR = "false";
  var ZONE_SYMBOL_PREFIX = __symbol__("");
  function wrapWithCurrentZone(callback, source) {
    return Zone.current.wrap(callback, source);
  }
  function scheduleMacroTaskWithCurrentZone(source, callback, data, customSchedule, customCancel) {
    return Zone.current.scheduleMacroTask(source, callback, data, customSchedule, customCancel);
  }
  var zoneSymbol = __symbol__;
  var isWindowExists = typeof window !== "undefined";
  var internalWindow = isWindowExists ? window : void 0;
  var _global2 = isWindowExists && internalWindow || globalThis;
  var REMOVE_ATTRIBUTE = "removeAttribute";
  function bindArguments(args, source) {
    for (let i2 = args.length - 1; i2 >= 0; i2--) {
      if (typeof args[i2] === "function") {
        args[i2] = wrapWithCurrentZone(args[i2], source + "_" + i2);
      }
    }
    return args;
  }
  function patchPrototype(prototype, fnNames) {
    const source = prototype.constructor["name"];
    for (let i2 = 0; i2 < fnNames.length; i2++) {
      const name = fnNames[i2];
      const delegate = prototype[name];
      if (delegate) {
        const prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, name);
        if (!isPropertyWritable(prototypeDesc)) {
          continue;
        }
        prototype[name] = ((delegate2) => {
          const patched = function() {
            return delegate2.apply(this, bindArguments(arguments, source + "." + name));
          };
          attachOriginToPatched(patched, delegate2);
          return patched;
        })(delegate);
      }
    }
  }
  function isPropertyWritable(propertyDesc) {
    if (!propertyDesc) {
      return true;
    }
    if (propertyDesc.writable === false) {
      return false;
    }
    return !(typeof propertyDesc.get === "function" && typeof propertyDesc.set === "undefined");
  }
  var isWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
  var isNode = !("nw" in _global2) && typeof _global2.process !== "undefined" && _global2.process.toString() === "[object process]";
  var isBrowser = !isNode && !isWebWorker && !!(isWindowExists && internalWindow["HTMLElement"]);
  var isMix = typeof _global2.process !== "undefined" && _global2.process.toString() === "[object process]" && !isWebWorker && !!(isWindowExists && internalWindow["HTMLElement"]);
  var zoneSymbolEventNames = {};
  var enableBeforeunloadSymbol = zoneSymbol("enable_beforeunload");
  var wrapFn = function(event) {
    event = event || _global2.event;
    if (!event) {
      return;
    }
    let eventNameSymbol = zoneSymbolEventNames[event.type];
    if (!eventNameSymbol) {
      eventNameSymbol = zoneSymbolEventNames[event.type] = zoneSymbol("ON_PROPERTY" + event.type);
    }
    const target = this || event.target || _global2;
    const listener = target[eventNameSymbol];
    let result;
    if (isBrowser && target === internalWindow && event.type === "error") {
      const errorEvent = event;
      result = listener && listener.call(this, errorEvent.message, errorEvent.filename, errorEvent.lineno, errorEvent.colno, errorEvent.error);
      if (result === true) {
        event.preventDefault();
      }
    } else {
      result = listener && listener.apply(this, arguments);
      if (
        // https://github.com/angular/angular/issues/47579
        // https://www.w3.org/TR/2011/WD-html5-20110525/history.html#beforeunloadevent
        // This is the only specific case we should check for. The spec defines that the
        // `returnValue` attribute represents the message to show the user. When the event
        // is created, this attribute must be set to the empty string.
        event.type === "beforeunload" && // To prevent any breaking changes resulting from this change, given that
        // it was already causing a significant number of failures in G3, we have hidden
        // that behavior behind a global configuration flag. Consumers can enable this
        // flag explicitly if they want the `beforeunload` event to be handled as defined
        // in the specification.
        _global2[enableBeforeunloadSymbol] && // The IDL event definition is `attribute DOMString returnValue`, so we check whether
        // `typeof result` is a string.
        typeof result === "string"
      ) {
        event.returnValue = result;
      } else if (result != void 0 && !result) {
        event.preventDefault();
      }
    }
    return result;
  };
  function patchProperty(obj, prop, prototype) {
    let desc = ObjectGetOwnPropertyDescriptor(obj, prop);
    if (!desc && prototype) {
      const prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, prop);
      if (prototypeDesc) {
        desc = { enumerable: true, configurable: true };
      }
    }
    if (!desc || !desc.configurable) {
      return;
    }
    const onPropPatchedSymbol = zoneSymbol("on" + prop + "patched");
    if (obj.hasOwnProperty(onPropPatchedSymbol) && obj[onPropPatchedSymbol]) {
      return;
    }
    delete desc.writable;
    delete desc.value;
    const originalDescGet = desc.get;
    const originalDescSet = desc.set;
    const eventName = prop.slice(2);
    let eventNameSymbol = zoneSymbolEventNames[eventName];
    if (!eventNameSymbol) {
      eventNameSymbol = zoneSymbolEventNames[eventName] = zoneSymbol("ON_PROPERTY" + eventName);
    }
    desc.set = function(newValue) {
      let target = this;
      if (!target && obj === _global2) {
        target = _global2;
      }
      if (!target) {
        return;
      }
      const previousValue = target[eventNameSymbol];
      if (typeof previousValue === "function") {
        target.removeEventListener(eventName, wrapFn);
      }
      originalDescSet == null ? void 0 : originalDescSet.call(target, null);
      target[eventNameSymbol] = newValue;
      if (typeof newValue === "function") {
        target.addEventListener(eventName, wrapFn, false);
      }
    };
    desc.get = function() {
      let target = this;
      if (!target && obj === _global2) {
        target = _global2;
      }
      if (!target) {
        return null;
      }
      const listener = target[eventNameSymbol];
      if (listener) {
        return listener;
      } else if (originalDescGet) {
        let value = originalDescGet.call(this);
        if (value) {
          desc.set.call(this, value);
          if (typeof target[REMOVE_ATTRIBUTE] === "function") {
            target.removeAttribute(prop);
          }
          return value;
        }
      }
      return null;
    };
    ObjectDefineProperty(obj, prop, desc);
    obj[onPropPatchedSymbol] = true;
  }
  function patchOnProperties(obj, properties, prototype) {
    if (properties) {
      for (let i2 = 0; i2 < properties.length; i2++) {
        patchProperty(obj, "on" + properties[i2], prototype);
      }
    } else {
      const onProperties = [];
      for (const prop in obj) {
        if (prop.slice(0, 2) == "on") {
          onProperties.push(prop);
        }
      }
      for (let j = 0; j < onProperties.length; j++) {
        patchProperty(obj, onProperties[j], prototype);
      }
    }
  }
  var originalInstanceKey = zoneSymbol("originalInstance");
  function patchClass(className) {
    const OriginalClass = _global2[className];
    if (!OriginalClass)
      return;
    _global2[zoneSymbol(className)] = OriginalClass;
    _global2[className] = function() {
      const a2 = bindArguments(arguments, className);
      switch (a2.length) {
        case 0:
          this[originalInstanceKey] = new OriginalClass();
          break;
        case 1:
          this[originalInstanceKey] = new OriginalClass(a2[0]);
          break;
        case 2:
          this[originalInstanceKey] = new OriginalClass(a2[0], a2[1]);
          break;
        case 3:
          this[originalInstanceKey] = new OriginalClass(a2[0], a2[1], a2[2]);
          break;
        case 4:
          this[originalInstanceKey] = new OriginalClass(a2[0], a2[1], a2[2], a2[3]);
          break;
        default:
          throw new Error("Arg list too long.");
      }
    };
    attachOriginToPatched(_global2[className], OriginalClass);
    const instance = new OriginalClass(function() {
    });
    let prop;
    for (prop in instance) {
      if (className === "XMLHttpRequest" && prop === "responseBlob")
        continue;
      (function(prop2) {
        if (typeof instance[prop2] === "function") {
          _global2[className].prototype[prop2] = function() {
            return this[originalInstanceKey][prop2].apply(this[originalInstanceKey], arguments);
          };
        } else {
          ObjectDefineProperty(_global2[className].prototype, prop2, {
            set: function(fn) {
              if (typeof fn === "function") {
                this[originalInstanceKey][prop2] = wrapWithCurrentZone(fn, className + "." + prop2);
                attachOriginToPatched(this[originalInstanceKey][prop2], fn);
              } else {
                this[originalInstanceKey][prop2] = fn;
              }
            },
            get: function() {
              return this[originalInstanceKey][prop2];
            }
          });
        }
      })(prop);
    }
    for (prop in OriginalClass) {
      if (prop !== "prototype" && OriginalClass.hasOwnProperty(prop)) {
        _global2[className][prop] = OriginalClass[prop];
      }
    }
  }
  function copySymbolProperties(src, dest) {
    if (typeof Object.getOwnPropertySymbols !== "function") {
      return;
    }
    const symbols = Object.getOwnPropertySymbols(src);
    symbols.forEach((symbol) => {
      const desc = Object.getOwnPropertyDescriptor(src, symbol);
      Object.defineProperty(dest, symbol, {
        get: function() {
          return src[symbol];
        },
        set: function(value) {
          if (desc && (!desc.writable || typeof desc.set !== "function")) {
            return;
          }
          src[symbol] = value;
        },
        enumerable: desc ? desc.enumerable : true,
        configurable: desc ? desc.configurable : true
      });
    });
  }
  var shouldCopySymbolProperties = false;
  function patchMethod(target, name, patchFn) {
    let proto = target;
    while (proto && !proto.hasOwnProperty(name)) {
      proto = ObjectGetPrototypeOf(proto);
    }
    if (!proto && target[name]) {
      proto = target;
    }
    const delegateName = zoneSymbol(name);
    let delegate = null;
    if (proto && (!(delegate = proto[delegateName]) || !proto.hasOwnProperty(delegateName))) {
      delegate = proto[delegateName] = proto[name];
      const desc = proto && ObjectGetOwnPropertyDescriptor(proto, name);
      if (isPropertyWritable(desc)) {
        const patchDelegate = patchFn(delegate, delegateName, name);
        proto[name] = function() {
          return patchDelegate(this, arguments);
        };
        attachOriginToPatched(proto[name], delegate);
        if (shouldCopySymbolProperties) {
          copySymbolProperties(delegate, proto[name]);
        }
      }
    }
    return delegate;
  }
  function patchMacroTask(obj, funcName, metaCreator) {
    let setNative = null;
    function scheduleTask(task) {
      const data = task.data;
      data.args[data.cbIdx] = function() {
        task.invoke.apply(this, arguments);
      };
      setNative.apply(data.target, data.args);
      return task;
    }
    setNative = patchMethod(obj, funcName, (delegate) => function(self2, args) {
      const meta = metaCreator(self2, args);
      if (meta.cbIdx >= 0 && typeof args[meta.cbIdx] === "function") {
        return scheduleMacroTaskWithCurrentZone(meta.name, args[meta.cbIdx], meta, scheduleTask);
      } else {
        return delegate.apply(self2, args);
      }
    });
  }
  function attachOriginToPatched(patched, original) {
    patched[zoneSymbol("OriginalDelegate")] = original;
  }
  function isFunction2(value) {
    return typeof value === "function";
  }
  function isNumber(value) {
    return typeof value === "number";
  }
  var OPTIMIZED_ZONE_EVENT_TASK_DATA = {
    useG: true
  };
  var zoneSymbolEventNames2 = {};
  var globalSources = {};
  var EVENT_NAME_SYMBOL_REGX = new RegExp("^" + ZONE_SYMBOL_PREFIX + "(\\w+)(true|false)$");
  var IMMEDIATE_PROPAGATION_SYMBOL = zoneSymbol("propagationStopped");
  function prepareEventNames(eventName, eventNameToString) {
    const falseEventName = (eventNameToString ? eventNameToString(eventName) : eventName) + FALSE_STR;
    const trueEventName = (eventNameToString ? eventNameToString(eventName) : eventName) + TRUE_STR;
    const symbol = ZONE_SYMBOL_PREFIX + falseEventName;
    const symbolCapture = ZONE_SYMBOL_PREFIX + trueEventName;
    zoneSymbolEventNames2[eventName] = {};
    zoneSymbolEventNames2[eventName][FALSE_STR] = symbol;
    zoneSymbolEventNames2[eventName][TRUE_STR] = symbolCapture;
  }
  function patchEventTarget(_global22, api, apis, patchOptions) {
    const ADD_EVENT_LISTENER = patchOptions && patchOptions.add || ADD_EVENT_LISTENER_STR;
    const REMOVE_EVENT_LISTENER = patchOptions && patchOptions.rm || REMOVE_EVENT_LISTENER_STR;
    const LISTENERS_EVENT_LISTENER = patchOptions && patchOptions.listeners || "eventListeners";
    const REMOVE_ALL_LISTENERS_EVENT_LISTENER = patchOptions && patchOptions.rmAll || "removeAllListeners";
    const zoneSymbolAddEventListener = zoneSymbol(ADD_EVENT_LISTENER);
    const ADD_EVENT_LISTENER_SOURCE = "." + ADD_EVENT_LISTENER + ":";
    const PREPEND_EVENT_LISTENER = "prependListener";
    const PREPEND_EVENT_LISTENER_SOURCE = "." + PREPEND_EVENT_LISTENER + ":";
    const invokeTask = function(task, target, event) {
      if (task.isRemoved) {
        return;
      }
      const delegate = task.callback;
      if (typeof delegate === "object" && delegate.handleEvent) {
        task.callback = (event2) => delegate.handleEvent(event2);
        task.originalDelegate = delegate;
      }
      let error;
      try {
        task.invoke(task, target, [event]);
      } catch (err) {
        error = err;
      }
      const options = task.options;
      if (options && typeof options === "object" && options.once) {
        const delegate2 = task.originalDelegate ? task.originalDelegate : task.callback;
        target[REMOVE_EVENT_LISTENER].call(target, event.type, delegate2, options);
      }
      return error;
    };
    function globalCallback(context2, event, isCapture) {
      event = event || _global22.event;
      if (!event) {
        return;
      }
      const target = context2 || event.target || _global22;
      const tasks = target[zoneSymbolEventNames2[event.type][isCapture ? TRUE_STR : FALSE_STR]];
      if (tasks) {
        const errors = [];
        if (tasks.length === 1) {
          const err = invokeTask(tasks[0], target, event);
          err && errors.push(err);
        } else {
          const copyTasks = tasks.slice();
          for (let i2 = 0; i2 < copyTasks.length; i2++) {
            if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
              break;
            }
            const err = invokeTask(copyTasks[i2], target, event);
            err && errors.push(err);
          }
        }
        if (errors.length === 1) {
          throw errors[0];
        } else {
          for (let i2 = 0; i2 < errors.length; i2++) {
            const err = errors[i2];
            api.nativeScheduleMicroTask(() => {
              throw err;
            });
          }
        }
      }
    }
    const globalZoneAwareCallback = function(event) {
      return globalCallback(this, event, false);
    };
    const globalZoneAwareCaptureCallback = function(event) {
      return globalCallback(this, event, true);
    };
    function patchEventTargetMethods(obj, patchOptions2) {
      if (!obj) {
        return false;
      }
      let useGlobalCallback = true;
      if (patchOptions2 && patchOptions2.useG !== void 0) {
        useGlobalCallback = patchOptions2.useG;
      }
      const validateHandler = patchOptions2 && patchOptions2.vh;
      let checkDuplicate = true;
      if (patchOptions2 && patchOptions2.chkDup !== void 0) {
        checkDuplicate = patchOptions2.chkDup;
      }
      let returnTarget = false;
      if (patchOptions2 && patchOptions2.rt !== void 0) {
        returnTarget = patchOptions2.rt;
      }
      let proto = obj;
      while (proto && !proto.hasOwnProperty(ADD_EVENT_LISTENER)) {
        proto = ObjectGetPrototypeOf(proto);
      }
      if (!proto && obj[ADD_EVENT_LISTENER]) {
        proto = obj;
      }
      if (!proto) {
        return false;
      }
      if (proto[zoneSymbolAddEventListener]) {
        return false;
      }
      const eventNameToString = patchOptions2 && patchOptions2.eventNameToString;
      const taskData = {};
      const nativeAddEventListener = proto[zoneSymbolAddEventListener] = proto[ADD_EVENT_LISTENER];
      const nativeRemoveEventListener = proto[zoneSymbol(REMOVE_EVENT_LISTENER)] = proto[REMOVE_EVENT_LISTENER];
      const nativeListeners = proto[zoneSymbol(LISTENERS_EVENT_LISTENER)] = proto[LISTENERS_EVENT_LISTENER];
      const nativeRemoveAllListeners = proto[zoneSymbol(REMOVE_ALL_LISTENERS_EVENT_LISTENER)] = proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER];
      let nativePrependEventListener;
      if (patchOptions2 && patchOptions2.prepend) {
        nativePrependEventListener = proto[zoneSymbol(patchOptions2.prepend)] = proto[patchOptions2.prepend];
      }
      function buildEventListenerOptions(options, passive) {
        if (!passive) {
          return options;
        }
        if (typeof options === "boolean") {
          return { capture: options, passive: true };
        }
        if (!options) {
          return { passive: true };
        }
        if (typeof options === "object" && options.passive !== false) {
          return __spreadProps(__spreadValues({}, options), { passive: true });
        }
        return options;
      }
      const customScheduleGlobal = function(task) {
        if (taskData.isExisting) {
          return;
        }
        return nativeAddEventListener.call(taskData.target, taskData.eventName, taskData.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, taskData.options);
      };
      const customCancelGlobal = function(task) {
        if (!task.isRemoved) {
          const symbolEventNames = zoneSymbolEventNames2[task.eventName];
          let symbolEventName;
          if (symbolEventNames) {
            symbolEventName = symbolEventNames[task.capture ? TRUE_STR : FALSE_STR];
          }
          const existingTasks = symbolEventName && task.target[symbolEventName];
          if (existingTasks) {
            for (let i2 = 0; i2 < existingTasks.length; i2++) {
              const existingTask = existingTasks[i2];
              if (existingTask === task) {
                existingTasks.splice(i2, 1);
                task.isRemoved = true;
                if (task.removeAbortListener) {
                  task.removeAbortListener();
                  task.removeAbortListener = null;
                }
                if (existingTasks.length === 0) {
                  task.allRemoved = true;
                  task.target[symbolEventName] = null;
                }
                break;
              }
            }
          }
        }
        if (!task.allRemoved) {
          return;
        }
        return nativeRemoveEventListener.call(task.target, task.eventName, task.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, task.options);
      };
      const customScheduleNonGlobal = function(task) {
        return nativeAddEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
      };
      const customSchedulePrepend = function(task) {
        return nativePrependEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
      };
      const customCancelNonGlobal = function(task) {
        return nativeRemoveEventListener.call(task.target, task.eventName, task.invoke, task.options);
      };
      const customSchedule = useGlobalCallback ? customScheduleGlobal : customScheduleNonGlobal;
      const customCancel = useGlobalCallback ? customCancelGlobal : customCancelNonGlobal;
      const compareTaskCallbackVsDelegate = function(task, delegate) {
        const typeOfDelegate = typeof delegate;
        return typeOfDelegate === "function" && task.callback === delegate || typeOfDelegate === "object" && task.originalDelegate === delegate;
      };
      const compare = (patchOptions2 == null ? void 0 : patchOptions2.diff) || compareTaskCallbackVsDelegate;
      const unpatchedEvents = Zone[zoneSymbol("UNPATCHED_EVENTS")];
      const passiveEvents = _global22[zoneSymbol("PASSIVE_EVENTS")];
      function copyEventListenerOptions(options) {
        if (typeof options === "object" && options !== null) {
          const newOptions = __spreadValues({}, options);
          if (options.signal) {
            newOptions.signal = options.signal;
          }
          return newOptions;
        }
        return options;
      }
      const makeAddListener = function(nativeListener, addSource, customScheduleFn, customCancelFn, returnTarget2 = false, prepend = false) {
        return function() {
          const target = this || _global22;
          let eventName = arguments[0];
          if (patchOptions2 && patchOptions2.transferEventName) {
            eventName = patchOptions2.transferEventName(eventName);
          }
          let delegate = arguments[1];
          if (!delegate) {
            return nativeListener.apply(this, arguments);
          }
          if (isNode && eventName === "uncaughtException") {
            return nativeListener.apply(this, arguments);
          }
          let isEventListenerObject = false;
          if (typeof delegate !== "function") {
            if (!delegate.handleEvent) {
              return nativeListener.apply(this, arguments);
            }
            isEventListenerObject = true;
          }
          if (validateHandler && !validateHandler(nativeListener, delegate, target, arguments)) {
            return;
          }
          const passive = !!passiveEvents && passiveEvents.indexOf(eventName) !== -1;
          const options = copyEventListenerOptions(buildEventListenerOptions(arguments[2], passive));
          const signal = options == null ? void 0 : options.signal;
          if (signal == null ? void 0 : signal.aborted) {
            return;
          }
          if (unpatchedEvents) {
            for (let i2 = 0; i2 < unpatchedEvents.length; i2++) {
              if (eventName === unpatchedEvents[i2]) {
                if (passive) {
                  return nativeListener.call(target, eventName, delegate, options);
                } else {
                  return nativeListener.apply(this, arguments);
                }
              }
            }
          }
          const capture = !options ? false : typeof options === "boolean" ? true : options.capture;
          const once = options && typeof options === "object" ? options.once : false;
          const zone = Zone.current;
          let symbolEventNames = zoneSymbolEventNames2[eventName];
          if (!symbolEventNames) {
            prepareEventNames(eventName, eventNameToString);
            symbolEventNames = zoneSymbolEventNames2[eventName];
          }
          const symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
          let existingTasks = target[symbolEventName];
          let isExisting = false;
          if (existingTasks) {
            isExisting = true;
            if (checkDuplicate) {
              for (let i2 = 0; i2 < existingTasks.length; i2++) {
                if (compare(existingTasks[i2], delegate)) {
                  return;
                }
              }
            }
          } else {
            existingTasks = target[symbolEventName] = [];
          }
          let source;
          const constructorName = target.constructor["name"];
          const targetSource = globalSources[constructorName];
          if (targetSource) {
            source = targetSource[eventName];
          }
          if (!source) {
            source = constructorName + addSource + (eventNameToString ? eventNameToString(eventName) : eventName);
          }
          taskData.options = options;
          if (once) {
            taskData.options.once = false;
          }
          taskData.target = target;
          taskData.capture = capture;
          taskData.eventName = eventName;
          taskData.isExisting = isExisting;
          const data = useGlobalCallback ? OPTIMIZED_ZONE_EVENT_TASK_DATA : void 0;
          if (data) {
            data.taskData = taskData;
          }
          if (signal) {
            taskData.options.signal = void 0;
          }
          const task = zone.scheduleEventTask(source, delegate, data, customScheduleFn, customCancelFn);
          if (signal) {
            taskData.options.signal = signal;
            const onAbort = () => task.zone.cancelTask(task);
            nativeListener.call(signal, "abort", onAbort, { once: true });
            task.removeAbortListener = () => signal.removeEventListener("abort", onAbort);
          }
          taskData.target = null;
          if (data) {
            data.taskData = null;
          }
          if (once) {
            taskData.options.once = true;
          }
          if (typeof task.options !== "boolean") {
            task.options = options;
          }
          task.target = target;
          task.capture = capture;
          task.eventName = eventName;
          if (isEventListenerObject) {
            task.originalDelegate = delegate;
          }
          if (!prepend) {
            existingTasks.push(task);
          } else {
            existingTasks.unshift(task);
          }
          if (returnTarget2) {
            return target;
          }
        };
      };
      proto[ADD_EVENT_LISTENER] = makeAddListener(nativeAddEventListener, ADD_EVENT_LISTENER_SOURCE, customSchedule, customCancel, returnTarget);
      if (nativePrependEventListener) {
        proto[PREPEND_EVENT_LISTENER] = makeAddListener(nativePrependEventListener, PREPEND_EVENT_LISTENER_SOURCE, customSchedulePrepend, customCancel, returnTarget, true);
      }
      proto[REMOVE_EVENT_LISTENER] = function() {
        const target = this || _global22;
        let eventName = arguments[0];
        if (patchOptions2 && patchOptions2.transferEventName) {
          eventName = patchOptions2.transferEventName(eventName);
        }
        const options = arguments[2];
        const capture = !options ? false : typeof options === "boolean" ? true : options.capture;
        const delegate = arguments[1];
        if (!delegate) {
          return nativeRemoveEventListener.apply(this, arguments);
        }
        if (validateHandler && !validateHandler(nativeRemoveEventListener, delegate, target, arguments)) {
          return;
        }
        const symbolEventNames = zoneSymbolEventNames2[eventName];
        let symbolEventName;
        if (symbolEventNames) {
          symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
        }
        const existingTasks = symbolEventName && target[symbolEventName];
        if (existingTasks) {
          for (let i2 = 0; i2 < existingTasks.length; i2++) {
            const existingTask = existingTasks[i2];
            if (compare(existingTask, delegate)) {
              existingTasks.splice(i2, 1);
              existingTask.isRemoved = true;
              if (existingTasks.length === 0) {
                existingTask.allRemoved = true;
                target[symbolEventName] = null;
                if (!capture && typeof eventName === "string") {
                  const onPropertySymbol = ZONE_SYMBOL_PREFIX + "ON_PROPERTY" + eventName;
                  target[onPropertySymbol] = null;
                }
              }
              existingTask.zone.cancelTask(existingTask);
              if (returnTarget) {
                return target;
              }
              return;
            }
          }
        }
        return nativeRemoveEventListener.apply(this, arguments);
      };
      proto[LISTENERS_EVENT_LISTENER] = function() {
        const target = this || _global22;
        let eventName = arguments[0];
        if (patchOptions2 && patchOptions2.transferEventName) {
          eventName = patchOptions2.transferEventName(eventName);
        }
        const listeners = [];
        const tasks = findEventTasks(target, eventNameToString ? eventNameToString(eventName) : eventName);
        for (let i2 = 0; i2 < tasks.length; i2++) {
          const task = tasks[i2];
          let delegate = task.originalDelegate ? task.originalDelegate : task.callback;
          listeners.push(delegate);
        }
        return listeners;
      };
      proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER] = function() {
        const target = this || _global22;
        let eventName = arguments[0];
        if (!eventName) {
          const keys = Object.keys(target);
          for (let i2 = 0; i2 < keys.length; i2++) {
            const prop = keys[i2];
            const match = EVENT_NAME_SYMBOL_REGX.exec(prop);
            let evtName = match && match[1];
            if (evtName && evtName !== "removeListener") {
              this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, evtName);
            }
          }
          this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, "removeListener");
        } else {
          if (patchOptions2 && patchOptions2.transferEventName) {
            eventName = patchOptions2.transferEventName(eventName);
          }
          const symbolEventNames = zoneSymbolEventNames2[eventName];
          if (symbolEventNames) {
            const symbolEventName = symbolEventNames[FALSE_STR];
            const symbolCaptureEventName = symbolEventNames[TRUE_STR];
            const tasks = target[symbolEventName];
            const captureTasks = target[symbolCaptureEventName];
            if (tasks) {
              const removeTasks = tasks.slice();
              for (let i2 = 0; i2 < removeTasks.length; i2++) {
                const task = removeTasks[i2];
                let delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
              }
            }
            if (captureTasks) {
              const removeTasks = captureTasks.slice();
              for (let i2 = 0; i2 < removeTasks.length; i2++) {
                const task = removeTasks[i2];
                let delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
              }
            }
          }
        }
        if (returnTarget) {
          return this;
        }
      };
      attachOriginToPatched(proto[ADD_EVENT_LISTENER], nativeAddEventListener);
      attachOriginToPatched(proto[REMOVE_EVENT_LISTENER], nativeRemoveEventListener);
      if (nativeRemoveAllListeners) {
        attachOriginToPatched(proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER], nativeRemoveAllListeners);
      }
      if (nativeListeners) {
        attachOriginToPatched(proto[LISTENERS_EVENT_LISTENER], nativeListeners);
      }
      return true;
    }
    let results = [];
    for (let i2 = 0; i2 < apis.length; i2++) {
      results[i2] = patchEventTargetMethods(apis[i2], patchOptions);
    }
    return results;
  }
  function findEventTasks(target, eventName) {
    if (!eventName) {
      const foundTasks = [];
      for (let prop in target) {
        const match = EVENT_NAME_SYMBOL_REGX.exec(prop);
        let evtName = match && match[1];
        if (evtName && (!eventName || evtName === eventName)) {
          const tasks = target[prop];
          if (tasks) {
            for (let i2 = 0; i2 < tasks.length; i2++) {
              foundTasks.push(tasks[i2]);
            }
          }
        }
      }
      return foundTasks;
    }
    let symbolEventName = zoneSymbolEventNames2[eventName];
    if (!symbolEventName) {
      prepareEventNames(eventName);
      symbolEventName = zoneSymbolEventNames2[eventName];
    }
    const captureFalseTasks = target[symbolEventName[FALSE_STR]];
    const captureTrueTasks = target[symbolEventName[TRUE_STR]];
    if (!captureFalseTasks) {
      return captureTrueTasks ? captureTrueTasks.slice() : [];
    } else {
      return captureTrueTasks ? captureFalseTasks.concat(captureTrueTasks) : captureFalseTasks.slice();
    }
  }
  function patchEventPrototype(global22, api) {
    const Event2 = global22["Event"];
    if (Event2 && Event2.prototype) {
      api.patchMethod(Event2.prototype, "stopImmediatePropagation", (delegate) => function(self2, args) {
        self2[IMMEDIATE_PROPAGATION_SYMBOL] = true;
        delegate && delegate.apply(self2, args);
      });
    }
  }
  function patchQueueMicrotask(global22, api) {
    api.patchMethod(global22, "queueMicrotask", (delegate) => {
      return function(self2, args) {
        Zone.current.scheduleMicroTask("queueMicrotask", args[0]);
      };
    });
  }
  var taskSymbol = zoneSymbol("zoneTask");
  function patchTimer(window2, setName, cancelName, nameSuffix) {
    let setNative = null;
    let clearNative = null;
    setName += nameSuffix;
    cancelName += nameSuffix;
    const tasksByHandleId = {};
    function scheduleTask(task) {
      const data = task.data;
      data.args[0] = function() {
        return task.invoke.apply(this, arguments);
      };
      const handleOrId = setNative.apply(window2, data.args);
      if (isNumber(handleOrId)) {
        data.handleId = handleOrId;
      } else {
        data.handle = handleOrId;
        data.isRefreshable = isFunction2(handleOrId.refresh);
      }
      return task;
    }
    function clearTask(task) {
      const { handle, handleId } = task.data;
      return clearNative.call(window2, handle != null ? handle : handleId);
    }
    setNative = patchMethod(window2, setName, (delegate) => function(self2, args) {
      var _a;
      if (isFunction2(args[0])) {
        const options = {
          isRefreshable: false,
          isPeriodic: nameSuffix === "Interval",
          delay: nameSuffix === "Timeout" || nameSuffix === "Interval" ? args[1] || 0 : void 0,
          args
        };
        const callback = args[0];
        args[0] = function timer() {
          try {
            return callback.apply(this, arguments);
          } finally {
            const { handle: handle2, handleId: handleId2, isPeriodic: isPeriodic2, isRefreshable: isRefreshable2 } = options;
            if (!isPeriodic2 && !isRefreshable2) {
              if (handleId2) {
                delete tasksByHandleId[handleId2];
              } else if (handle2) {
                handle2[taskSymbol] = null;
              }
            }
          }
        };
        const task = scheduleMacroTaskWithCurrentZone(setName, args[0], options, scheduleTask, clearTask);
        if (!task) {
          return task;
        }
        const { handleId, handle, isRefreshable, isPeriodic } = task.data;
        if (handleId) {
          tasksByHandleId[handleId] = task;
        } else if (handle) {
          handle[taskSymbol] = task;
          if (isRefreshable && !isPeriodic) {
            const originalRefresh = handle.refresh;
            handle.refresh = function() {
              const { zone, state } = task;
              if (state === "notScheduled") {
                task._state = "scheduled";
                zone._updateTaskCount(task, 1);
              } else if (state === "running") {
                task._state = "scheduling";
              }
              return originalRefresh.call(this);
            };
          }
        }
        return (_a = handle != null ? handle : handleId) != null ? _a : task;
      } else {
        return delegate.apply(window2, args);
      }
    });
    clearNative = patchMethod(window2, cancelName, (delegate) => function(self2, args) {
      const id = args[0];
      let task;
      if (isNumber(id)) {
        task = tasksByHandleId[id];
        delete tasksByHandleId[id];
      } else {
        task = id == null ? void 0 : id[taskSymbol];
        if (task) {
          id[taskSymbol] = null;
        } else {
          task = id;
        }
      }
      if (task == null ? void 0 : task.type) {
        if (task.cancelFn) {
          task.zone.cancelTask(task);
        }
      } else {
        delegate.apply(window2, args);
      }
    });
  }
  function patchCustomElements(_global22, api) {
    const { isBrowser: isBrowser2, isMix: isMix2 } = api.getGlobalObjects();
    if (!isBrowser2 && !isMix2 || !_global22["customElements"] || !("customElements" in _global22)) {
      return;
    }
    const callbacks = [
      "connectedCallback",
      "disconnectedCallback",
      "adoptedCallback",
      "attributeChangedCallback",
      "formAssociatedCallback",
      "formDisabledCallback",
      "formResetCallback",
      "formStateRestoreCallback"
    ];
    api.patchCallbacks(api, _global22.customElements, "customElements", "define", callbacks);
  }
  function eventTargetPatch(_global22, api) {
    if (Zone[api.symbol("patchEventTarget")]) {
      return;
    }
    const { eventNames, zoneSymbolEventNames: zoneSymbolEventNames3, TRUE_STR: TRUE_STR2, FALSE_STR: FALSE_STR2, ZONE_SYMBOL_PREFIX: ZONE_SYMBOL_PREFIX2 } = api.getGlobalObjects();
    for (let i2 = 0; i2 < eventNames.length; i2++) {
      const eventName = eventNames[i2];
      const falseEventName = eventName + FALSE_STR2;
      const trueEventName = eventName + TRUE_STR2;
      const symbol = ZONE_SYMBOL_PREFIX2 + falseEventName;
      const symbolCapture = ZONE_SYMBOL_PREFIX2 + trueEventName;
      zoneSymbolEventNames3[eventName] = {};
      zoneSymbolEventNames3[eventName][FALSE_STR2] = symbol;
      zoneSymbolEventNames3[eventName][TRUE_STR2] = symbolCapture;
    }
    const EVENT_TARGET = _global22["EventTarget"];
    if (!EVENT_TARGET || !EVENT_TARGET.prototype) {
      return;
    }
    api.patchEventTarget(_global22, api, [EVENT_TARGET && EVENT_TARGET.prototype]);
    return true;
  }
  function patchEvent(global22, api) {
    api.patchEventPrototype(global22, api);
  }
  function filterProperties(target, onProperties, ignoreProperties) {
    if (!ignoreProperties || ignoreProperties.length === 0) {
      return onProperties;
    }
    const tip = ignoreProperties.filter((ip) => ip.target === target);
    if (tip.length === 0) {
      return onProperties;
    }
    const targetIgnoreProperties = tip[0].ignoreProperties;
    return onProperties.filter((op) => targetIgnoreProperties.indexOf(op) === -1);
  }
  function patchFilteredProperties(target, onProperties, ignoreProperties, prototype) {
    if (!target) {
      return;
    }
    const filteredProperties = filterProperties(target, onProperties, ignoreProperties);
    patchOnProperties(target, filteredProperties, prototype);
  }
  function getOnEventNames(target) {
    return Object.getOwnPropertyNames(target).filter((name) => name.startsWith("on") && name.length > 2).map((name) => name.substring(2));
  }
  function propertyDescriptorPatch(api, _global22) {
    if (isNode && !isMix) {
      return;
    }
    if (Zone[api.symbol("patchEvents")]) {
      return;
    }
    const ignoreProperties = _global22["__Zone_ignore_on_properties"];
    let patchTargets = [];
    if (isBrowser) {
      const internalWindow2 = window;
      patchTargets = patchTargets.concat([
        "Document",
        "SVGElement",
        "Element",
        "HTMLElement",
        "HTMLBodyElement",
        "HTMLMediaElement",
        "HTMLFrameSetElement",
        "HTMLFrameElement",
        "HTMLIFrameElement",
        "HTMLMarqueeElement",
        "Worker"
      ]);
      patchFilteredProperties(internalWindow2, getOnEventNames(internalWindow2), ignoreProperties, ObjectGetPrototypeOf(internalWindow2));
    }
    patchTargets = patchTargets.concat([
      "XMLHttpRequest",
      "XMLHttpRequestEventTarget",
      "IDBIndex",
      "IDBRequest",
      "IDBOpenDBRequest",
      "IDBDatabase",
      "IDBTransaction",
      "IDBCursor",
      "WebSocket"
    ]);
    for (let i2 = 0; i2 < patchTargets.length; i2++) {
      const target = _global22[patchTargets[i2]];
      (target == null ? void 0 : target.prototype) && patchFilteredProperties(target.prototype, getOnEventNames(target.prototype), ignoreProperties);
    }
  }
  function patchBrowser(Zone3) {
    Zone3.__load_patch("timers", (global22) => {
      const set = "set";
      const clear = "clear";
      patchTimer(global22, set, clear, "Timeout");
      patchTimer(global22, set, clear, "Interval");
      patchTimer(global22, set, clear, "Immediate");
    });
    Zone3.__load_patch("requestAnimationFrame", (global22) => {
      patchTimer(global22, "request", "cancel", "AnimationFrame");
      patchTimer(global22, "mozRequest", "mozCancel", "AnimationFrame");
      patchTimer(global22, "webkitRequest", "webkitCancel", "AnimationFrame");
    });
    Zone3.__load_patch("blocking", (global22, Zone4) => {
      const blockingMethods = ["alert", "prompt", "confirm"];
      for (let i2 = 0; i2 < blockingMethods.length; i2++) {
        const name = blockingMethods[i2];
        patchMethod(global22, name, (delegate, symbol, name2) => {
          return function(s2, args) {
            return Zone4.current.run(delegate, global22, args, name2);
          };
        });
      }
    });
    Zone3.__load_patch("EventTarget", (global22, Zone4, api) => {
      patchEvent(global22, api);
      eventTargetPatch(global22, api);
      const XMLHttpRequestEventTarget = global22["XMLHttpRequestEventTarget"];
      if (XMLHttpRequestEventTarget && XMLHttpRequestEventTarget.prototype) {
        api.patchEventTarget(global22, api, [XMLHttpRequestEventTarget.prototype]);
      }
    });
    Zone3.__load_patch("MutationObserver", (global22, Zone4, api) => {
      patchClass("MutationObserver");
      patchClass("WebKitMutationObserver");
    });
    Zone3.__load_patch("IntersectionObserver", (global22, Zone4, api) => {
      patchClass("IntersectionObserver");
    });
    Zone3.__load_patch("FileReader", (global22, Zone4, api) => {
      patchClass("FileReader");
    });
    Zone3.__load_patch("on_property", (global22, Zone4, api) => {
      propertyDescriptorPatch(api, global22);
    });
    Zone3.__load_patch("customElements", (global22, Zone4, api) => {
      patchCustomElements(global22, api);
    });
    Zone3.__load_patch("XHR", (global22, Zone4) => {
      patchXHR(global22);
      const XHR_TASK = zoneSymbol("xhrTask");
      const XHR_SYNC = zoneSymbol("xhrSync");
      const XHR_LISTENER = zoneSymbol("xhrListener");
      const XHR_SCHEDULED = zoneSymbol("xhrScheduled");
      const XHR_URL = zoneSymbol("xhrURL");
      const XHR_ERROR_BEFORE_SCHEDULED = zoneSymbol("xhrErrorBeforeScheduled");
      function patchXHR(window2) {
        const XMLHttpRequest2 = window2["XMLHttpRequest"];
        if (!XMLHttpRequest2) {
          return;
        }
        const XMLHttpRequestPrototype = XMLHttpRequest2.prototype;
        function findPendingTask(target) {
          return target[XHR_TASK];
        }
        let oriAddListener = XMLHttpRequestPrototype[ZONE_SYMBOL_ADD_EVENT_LISTENER];
        let oriRemoveListener = XMLHttpRequestPrototype[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
        if (!oriAddListener) {
          const XMLHttpRequestEventTarget = window2["XMLHttpRequestEventTarget"];
          if (XMLHttpRequestEventTarget) {
            const XMLHttpRequestEventTargetPrototype = XMLHttpRequestEventTarget.prototype;
            oriAddListener = XMLHttpRequestEventTargetPrototype[ZONE_SYMBOL_ADD_EVENT_LISTENER];
            oriRemoveListener = XMLHttpRequestEventTargetPrototype[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
          }
        }
        const READY_STATE_CHANGE = "readystatechange";
        const SCHEDULED = "scheduled";
        function scheduleTask(task) {
          const data = task.data;
          const target = data.target;
          target[XHR_SCHEDULED] = false;
          target[XHR_ERROR_BEFORE_SCHEDULED] = false;
          const listener = target[XHR_LISTENER];
          if (!oriAddListener) {
            oriAddListener = target[ZONE_SYMBOL_ADD_EVENT_LISTENER];
            oriRemoveListener = target[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
          }
          if (listener) {
            oriRemoveListener.call(target, READY_STATE_CHANGE, listener);
          }
          const newListener = target[XHR_LISTENER] = () => {
            if (target.readyState === target.DONE) {
              if (!data.aborted && target[XHR_SCHEDULED] && task.state === SCHEDULED) {
                const loadTasks = target[Zone4.__symbol__("loadfalse")];
                if (target.status !== 0 && loadTasks && loadTasks.length > 0) {
                  const oriInvoke = task.invoke;
                  task.invoke = function() {
                    const loadTasks2 = target[Zone4.__symbol__("loadfalse")];
                    for (let i2 = 0; i2 < loadTasks2.length; i2++) {
                      if (loadTasks2[i2] === task) {
                        loadTasks2.splice(i2, 1);
                      }
                    }
                    if (!data.aborted && task.state === SCHEDULED) {
                      oriInvoke.call(task);
                    }
                  };
                  loadTasks.push(task);
                } else {
                  task.invoke();
                }
              } else if (!data.aborted && target[XHR_SCHEDULED] === false) {
                target[XHR_ERROR_BEFORE_SCHEDULED] = true;
              }
            }
          };
          oriAddListener.call(target, READY_STATE_CHANGE, newListener);
          const storedTask = target[XHR_TASK];
          if (!storedTask) {
            target[XHR_TASK] = task;
          }
          sendNative.apply(target, data.args);
          target[XHR_SCHEDULED] = true;
          return task;
        }
        function placeholderCallback() {
        }
        function clearTask(task) {
          const data = task.data;
          data.aborted = true;
          return abortNative.apply(data.target, data.args);
        }
        const openNative = patchMethod(XMLHttpRequestPrototype, "open", () => function(self2, args) {
          self2[XHR_SYNC] = args[2] == false;
          self2[XHR_URL] = args[1];
          return openNative.apply(self2, args);
        });
        const XMLHTTPREQUEST_SOURCE = "XMLHttpRequest.send";
        const fetchTaskAborting = zoneSymbol("fetchTaskAborting");
        const fetchTaskScheduling = zoneSymbol("fetchTaskScheduling");
        const sendNative = patchMethod(XMLHttpRequestPrototype, "send", () => function(self2, args) {
          if (Zone4.current[fetchTaskScheduling] === true) {
            return sendNative.apply(self2, args);
          }
          if (self2[XHR_SYNC]) {
            return sendNative.apply(self2, args);
          } else {
            const options = {
              target: self2,
              url: self2[XHR_URL],
              isPeriodic: false,
              args,
              aborted: false
            };
            const task = scheduleMacroTaskWithCurrentZone(XMLHTTPREQUEST_SOURCE, placeholderCallback, options, scheduleTask, clearTask);
            if (self2 && self2[XHR_ERROR_BEFORE_SCHEDULED] === true && !options.aborted && task.state === SCHEDULED) {
              task.invoke();
            }
          }
        });
        const abortNative = patchMethod(XMLHttpRequestPrototype, "abort", () => function(self2, args) {
          const task = findPendingTask(self2);
          if (task && typeof task.type == "string") {
            if (task.cancelFn == null || task.data && task.data.aborted) {
              return;
            }
            task.zone.cancelTask(task);
          } else if (Zone4.current[fetchTaskAborting] === true) {
            return abortNative.apply(self2, args);
          }
        });
      }
    });
    Zone3.__load_patch("geolocation", (global22) => {
      if (global22["navigator"] && global22["navigator"].geolocation) {
        patchPrototype(global22["navigator"].geolocation, ["getCurrentPosition", "watchPosition"]);
      }
    });
    Zone3.__load_patch("PromiseRejectionEvent", (global22, Zone4) => {
      function findPromiseRejectionHandler(evtName) {
        return function(e2) {
          const eventTasks = findEventTasks(global22, evtName);
          eventTasks.forEach((eventTask) => {
            const PromiseRejectionEvent = global22["PromiseRejectionEvent"];
            if (PromiseRejectionEvent) {
              const evt = new PromiseRejectionEvent(evtName, {
                promise: e2.promise,
                reason: e2.rejection
              });
              eventTask.invoke(evt);
            }
          });
        };
      }
      if (global22["PromiseRejectionEvent"]) {
        Zone4[zoneSymbol("unhandledPromiseRejectionHandler")] = findPromiseRejectionHandler("unhandledrejection");
        Zone4[zoneSymbol("rejectionHandledHandler")] = findPromiseRejectionHandler("rejectionhandled");
      }
    });
    Zone3.__load_patch("queueMicrotask", (global22, Zone4, api) => {
      patchQueueMicrotask(global22, api);
    });
  }
  function patchPromise(Zone3) {
    Zone3.__load_patch("ZoneAwarePromise", (global22, Zone4, api) => {
      const ObjectGetOwnPropertyDescriptor2 = Object.getOwnPropertyDescriptor;
      const ObjectDefineProperty2 = Object.defineProperty;
      function readableObjectToString(obj) {
        if (obj && obj.toString === Object.prototype.toString) {
          const className = obj.constructor && obj.constructor.name;
          return (className ? className : "") + ": " + JSON.stringify(obj);
        }
        return obj ? obj.toString() : Object.prototype.toString.call(obj);
      }
      const __symbol__2 = api.symbol;
      const _uncaughtPromiseErrors = [];
      const isDisableWrappingUncaughtPromiseRejection = global22[__symbol__2("DISABLE_WRAPPING_UNCAUGHT_PROMISE_REJECTION")] !== false;
      const symbolPromise = __symbol__2("Promise");
      const symbolThen = __symbol__2("then");
      const creationTrace = "__creationTrace__";
      api.onUnhandledError = (e2) => {
        if (api.showUncaughtError()) {
          const rejection = e2 && e2.rejection;
          if (rejection) {
            console.error("Unhandled Promise rejection:", rejection instanceof Error ? rejection.message : rejection, "; Zone:", e2.zone.name, "; Task:", e2.task && e2.task.source, "; Value:", rejection, rejection instanceof Error ? rejection.stack : void 0);
          } else {
            console.error(e2);
          }
        }
      };
      api.microtaskDrainDone = () => {
        while (_uncaughtPromiseErrors.length) {
          const uncaughtPromiseError = _uncaughtPromiseErrors.shift();
          try {
            uncaughtPromiseError.zone.runGuarded(() => {
              if (uncaughtPromiseError.throwOriginal) {
                throw uncaughtPromiseError.rejection;
              }
              throw uncaughtPromiseError;
            });
          } catch (error) {
            handleUnhandledRejection(error);
          }
        }
      };
      const UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL = __symbol__2("unhandledPromiseRejectionHandler");
      function handleUnhandledRejection(e2) {
        api.onUnhandledError(e2);
        try {
          const handler = Zone4[UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL];
          if (typeof handler === "function") {
            handler.call(this, e2);
          }
        } catch (err) {
        }
      }
      function isThenable(value) {
        return value && typeof value.then === "function";
      }
      function forwardResolution(value) {
        return value;
      }
      function forwardRejection(rejection) {
        return ZoneAwarePromise.reject(rejection);
      }
      const symbolState = __symbol__2("state");
      const symbolValue = __symbol__2("value");
      const symbolFinally = __symbol__2("finally");
      const symbolParentPromiseValue = __symbol__2("parentPromiseValue");
      const symbolParentPromiseState = __symbol__2("parentPromiseState");
      const source = "Promise.then";
      const UNRESOLVED = null;
      const RESOLVED = true;
      const REJECTED = false;
      const REJECTED_NO_CATCH = 0;
      function makeResolver(promise, state) {
        return (v2) => {
          try {
            resolvePromise(promise, state, v2);
          } catch (err) {
            resolvePromise(promise, false, err);
          }
        };
      }
      const once = function() {
        let wasCalled = false;
        return function wrapper(wrappedFunction) {
          return function() {
            if (wasCalled) {
              return;
            }
            wasCalled = true;
            wrappedFunction.apply(null, arguments);
          };
        };
      };
      const TYPE_ERROR = "Promise resolved with itself";
      const CURRENT_TASK_TRACE_SYMBOL = __symbol__2("currentTaskTrace");
      function resolvePromise(promise, state, value) {
        const onceWrapper = once();
        if (promise === value) {
          throw new TypeError(TYPE_ERROR);
        }
        if (promise[symbolState] === UNRESOLVED) {
          let then = null;
          try {
            if (typeof value === "object" || typeof value === "function") {
              then = value && value.then;
            }
          } catch (err) {
            onceWrapper(() => {
              resolvePromise(promise, false, err);
            })();
            return promise;
          }
          if (state !== REJECTED && value instanceof ZoneAwarePromise && value.hasOwnProperty(symbolState) && value.hasOwnProperty(symbolValue) && value[symbolState] !== UNRESOLVED) {
            clearRejectedNoCatch(value);
            resolvePromise(promise, value[symbolState], value[symbolValue]);
          } else if (state !== REJECTED && typeof then === "function") {
            try {
              then.call(value, onceWrapper(makeResolver(promise, state)), onceWrapper(makeResolver(promise, false)));
            } catch (err) {
              onceWrapper(() => {
                resolvePromise(promise, false, err);
              })();
            }
          } else {
            promise[symbolState] = state;
            const queue = promise[symbolValue];
            promise[symbolValue] = value;
            if (promise[symbolFinally] === symbolFinally) {
              if (state === RESOLVED) {
                promise[symbolState] = promise[symbolParentPromiseState];
                promise[symbolValue] = promise[symbolParentPromiseValue];
              }
            }
            if (state === REJECTED && value instanceof Error) {
              const trace2 = Zone4.currentTask && Zone4.currentTask.data && Zone4.currentTask.data[creationTrace];
              if (trace2) {
                ObjectDefineProperty2(value, CURRENT_TASK_TRACE_SYMBOL, {
                  configurable: true,
                  enumerable: false,
                  writable: true,
                  value: trace2
                });
              }
            }
            for (let i2 = 0; i2 < queue.length; ) {
              scheduleResolveOrReject(promise, queue[i2++], queue[i2++], queue[i2++], queue[i2++]);
            }
            if (queue.length == 0 && state == REJECTED) {
              promise[symbolState] = REJECTED_NO_CATCH;
              let uncaughtPromiseError = value;
              try {
                throw new Error("Uncaught (in promise): " + readableObjectToString(value) + (value && value.stack ? "\n" + value.stack : ""));
              } catch (err) {
                uncaughtPromiseError = err;
              }
              if (isDisableWrappingUncaughtPromiseRejection) {
                uncaughtPromiseError.throwOriginal = true;
              }
              uncaughtPromiseError.rejection = value;
              uncaughtPromiseError.promise = promise;
              uncaughtPromiseError.zone = Zone4.current;
              uncaughtPromiseError.task = Zone4.currentTask;
              _uncaughtPromiseErrors.push(uncaughtPromiseError);
              api.scheduleMicroTask();
            }
          }
        }
        return promise;
      }
      const REJECTION_HANDLED_HANDLER = __symbol__2("rejectionHandledHandler");
      function clearRejectedNoCatch(promise) {
        if (promise[symbolState] === REJECTED_NO_CATCH) {
          try {
            const handler = Zone4[REJECTION_HANDLED_HANDLER];
            if (handler && typeof handler === "function") {
              handler.call(this, { rejection: promise[symbolValue], promise });
            }
          } catch (err) {
          }
          promise[symbolState] = REJECTED;
          for (let i2 = 0; i2 < _uncaughtPromiseErrors.length; i2++) {
            if (promise === _uncaughtPromiseErrors[i2].promise) {
              _uncaughtPromiseErrors.splice(i2, 1);
            }
          }
        }
      }
      function scheduleResolveOrReject(promise, zone, chainPromise, onFulfilled, onRejected) {
        clearRejectedNoCatch(promise);
        const promiseState = promise[symbolState];
        const delegate = promiseState ? typeof onFulfilled === "function" ? onFulfilled : forwardResolution : typeof onRejected === "function" ? onRejected : forwardRejection;
        zone.scheduleMicroTask(source, () => {
          try {
            const parentPromiseValue = promise[symbolValue];
            const isFinallyPromise = !!chainPromise && symbolFinally === chainPromise[symbolFinally];
            if (isFinallyPromise) {
              chainPromise[symbolParentPromiseValue] = parentPromiseValue;
              chainPromise[symbolParentPromiseState] = promiseState;
            }
            const value = zone.run(delegate, void 0, isFinallyPromise && delegate !== forwardRejection && delegate !== forwardResolution ? [] : [parentPromiseValue]);
            resolvePromise(chainPromise, true, value);
          } catch (error) {
            resolvePromise(chainPromise, false, error);
          }
        }, chainPromise);
      }
      const ZONE_AWARE_PROMISE_TO_STRING = "function ZoneAwarePromise() { [native code] }";
      const noop = function() {
      };
      const AggregateError = global22.AggregateError;
      class ZoneAwarePromise {
        static toString() {
          return ZONE_AWARE_PROMISE_TO_STRING;
        }
        static resolve(value) {
          if (value instanceof ZoneAwarePromise) {
            return value;
          }
          return resolvePromise(new this(null), RESOLVED, value);
        }
        static reject(error) {
          return resolvePromise(new this(null), REJECTED, error);
        }
        static withResolvers() {
          const result = {};
          result.promise = new ZoneAwarePromise((res, rej) => {
            result.resolve = res;
            result.reject = rej;
          });
          return result;
        }
        static any(values) {
          if (!values || typeof values[Symbol.iterator] !== "function") {
            return Promise.reject(new AggregateError([], "All promises were rejected"));
          }
          const promises = [];
          let count = 0;
          try {
            for (let v2 of values) {
              count++;
              promises.push(ZoneAwarePromise.resolve(v2));
            }
          } catch (err) {
            return Promise.reject(new AggregateError([], "All promises were rejected"));
          }
          if (count === 0) {
            return Promise.reject(new AggregateError([], "All promises were rejected"));
          }
          let finished = false;
          const errors = [];
          return new ZoneAwarePromise((resolve, reject) => {
            for (let i2 = 0; i2 < promises.length; i2++) {
              promises[i2].then((v2) => {
                if (finished) {
                  return;
                }
                finished = true;
                resolve(v2);
              }, (err) => {
                errors.push(err);
                count--;
                if (count === 0) {
                  finished = true;
                  reject(new AggregateError(errors, "All promises were rejected"));
                }
              });
            }
          });
        }
        static race(values) {
          let resolve;
          let reject;
          let promise = new this((res, rej) => {
            resolve = res;
            reject = rej;
          });
          function onResolve(value) {
            resolve(value);
          }
          function onReject(error) {
            reject(error);
          }
          for (let value of values) {
            if (!isThenable(value)) {
              value = this.resolve(value);
            }
            value.then(onResolve, onReject);
          }
          return promise;
        }
        static all(values) {
          return ZoneAwarePromise.allWithCallback(values);
        }
        static allSettled(values) {
          const P2 = this && this.prototype instanceof ZoneAwarePromise ? this : ZoneAwarePromise;
          return P2.allWithCallback(values, {
            thenCallback: (value) => ({ status: "fulfilled", value }),
            errorCallback: (err) => ({ status: "rejected", reason: err })
          });
        }
        static allWithCallback(values, callback) {
          let resolve;
          let reject;
          let promise = new this((res, rej) => {
            resolve = res;
            reject = rej;
          });
          let unresolvedCount = 2;
          let valueIndex = 0;
          const resolvedValues = [];
          for (let value of values) {
            if (!isThenable(value)) {
              value = this.resolve(value);
            }
            const curValueIndex = valueIndex;
            try {
              value.then((value2) => {
                resolvedValues[curValueIndex] = callback ? callback.thenCallback(value2) : value2;
                unresolvedCount--;
                if (unresolvedCount === 0) {
                  resolve(resolvedValues);
                }
              }, (err) => {
                if (!callback) {
                  reject(err);
                } else {
                  resolvedValues[curValueIndex] = callback.errorCallback(err);
                  unresolvedCount--;
                  if (unresolvedCount === 0) {
                    resolve(resolvedValues);
                  }
                }
              });
            } catch (thenErr) {
              reject(thenErr);
            }
            unresolvedCount++;
            valueIndex++;
          }
          unresolvedCount -= 2;
          if (unresolvedCount === 0) {
            resolve(resolvedValues);
          }
          return promise;
        }
        constructor(executor) {
          const promise = this;
          if (!(promise instanceof ZoneAwarePromise)) {
            throw new Error("Must be an instanceof Promise.");
          }
          promise[symbolState] = UNRESOLVED;
          promise[symbolValue] = [];
          try {
            const onceWrapper = once();
            executor && executor(onceWrapper(makeResolver(promise, RESOLVED)), onceWrapper(makeResolver(promise, REJECTED)));
          } catch (error) {
            resolvePromise(promise, false, error);
          }
        }
        get [Symbol.toStringTag]() {
          return "Promise";
        }
        get [Symbol.species]() {
          return ZoneAwarePromise;
        }
        then(onFulfilled, onRejected) {
          var _a;
          let C2 = (_a = this.constructor) == null ? void 0 : _a[Symbol.species];
          if (!C2 || typeof C2 !== "function") {
            C2 = this.constructor || ZoneAwarePromise;
          }
          const chainPromise = new C2(noop);
          const zone = Zone4.current;
          if (this[symbolState] == UNRESOLVED) {
            this[symbolValue].push(zone, chainPromise, onFulfilled, onRejected);
          } else {
            scheduleResolveOrReject(this, zone, chainPromise, onFulfilled, onRejected);
          }
          return chainPromise;
        }
        catch(onRejected) {
          return this.then(null, onRejected);
        }
        finally(onFinally) {
          var _a;
          let C2 = (_a = this.constructor) == null ? void 0 : _a[Symbol.species];
          if (!C2 || typeof C2 !== "function") {
            C2 = ZoneAwarePromise;
          }
          const chainPromise = new C2(noop);
          chainPromise[symbolFinally] = symbolFinally;
          const zone = Zone4.current;
          if (this[symbolState] == UNRESOLVED) {
            this[symbolValue].push(zone, chainPromise, onFinally, onFinally);
          } else {
            scheduleResolveOrReject(this, zone, chainPromise, onFinally, onFinally);
          }
          return chainPromise;
        }
      }
      ZoneAwarePromise["resolve"] = ZoneAwarePromise.resolve;
      ZoneAwarePromise["reject"] = ZoneAwarePromise.reject;
      ZoneAwarePromise["race"] = ZoneAwarePromise.race;
      ZoneAwarePromise["all"] = ZoneAwarePromise.all;
      const NativePromise = global22[symbolPromise] = global22["Promise"];
      global22["Promise"] = ZoneAwarePromise;
      const symbolThenPatched = __symbol__2("thenPatched");
      function patchThen(Ctor) {
        const proto = Ctor.prototype;
        const prop = ObjectGetOwnPropertyDescriptor2(proto, "then");
        if (prop && (prop.writable === false || !prop.configurable)) {
          return;
        }
        const originalThen = proto.then;
        proto[symbolThen] = originalThen;
        Ctor.prototype.then = function(onResolve, onReject) {
          const wrapped = new ZoneAwarePromise((resolve, reject) => {
            originalThen.call(this, resolve, reject);
          });
          return wrapped.then(onResolve, onReject);
        };
        Ctor[symbolThenPatched] = true;
      }
      api.patchThen = patchThen;
      function zoneify(fn) {
        return function(self2, args) {
          let resultPromise = fn.apply(self2, args);
          if (resultPromise instanceof ZoneAwarePromise) {
            return resultPromise;
          }
          let ctor = resultPromise.constructor;
          if (!ctor[symbolThenPatched]) {
            patchThen(ctor);
          }
          return resultPromise;
        };
      }
      if (NativePromise) {
        patchThen(NativePromise);
        patchMethod(global22, "fetch", (delegate) => zoneify(delegate));
      }
      Promise[Zone4.__symbol__("uncaughtPromiseErrors")] = _uncaughtPromiseErrors;
      return ZoneAwarePromise;
    });
  }
  function patchToString(Zone3) {
    Zone3.__load_patch("toString", (global22) => {
      const originalFunctionToString = Function.prototype.toString;
      const ORIGINAL_DELEGATE_SYMBOL = zoneSymbol("OriginalDelegate");
      const PROMISE_SYMBOL = zoneSymbol("Promise");
      const ERROR_SYMBOL = zoneSymbol("Error");
      const newFunctionToString = function toString() {
        if (typeof this === "function") {
          const originalDelegate = this[ORIGINAL_DELEGATE_SYMBOL];
          if (originalDelegate) {
            if (typeof originalDelegate === "function") {
              return originalFunctionToString.call(originalDelegate);
            } else {
              return Object.prototype.toString.call(originalDelegate);
            }
          }
          if (this === Promise) {
            const nativePromise = global22[PROMISE_SYMBOL];
            if (nativePromise) {
              return originalFunctionToString.call(nativePromise);
            }
          }
          if (this === Error) {
            const nativeError = global22[ERROR_SYMBOL];
            if (nativeError) {
              return originalFunctionToString.call(nativeError);
            }
          }
        }
        return originalFunctionToString.call(this);
      };
      newFunctionToString[ORIGINAL_DELEGATE_SYMBOL] = originalFunctionToString;
      Function.prototype.toString = newFunctionToString;
      const originalObjectToString = Object.prototype.toString;
      const PROMISE_OBJECT_TO_STRING = "[object Promise]";
      Object.prototype.toString = function() {
        if (typeof Promise === "function" && this instanceof Promise) {
          return PROMISE_OBJECT_TO_STRING;
        }
        return originalObjectToString.call(this);
      };
    });
  }
  function patchCallbacks(api, target, targetName, method, callbacks) {
    const symbol = Zone.__symbol__(method);
    if (target[symbol]) {
      return;
    }
    const nativeDelegate = target[symbol] = target[method];
    target[method] = function(name, opts, options) {
      if (opts && opts.prototype) {
        callbacks.forEach(function(callback) {
          const source = `${targetName}.${method}::` + callback;
          const prototype = opts.prototype;
          try {
            if (prototype.hasOwnProperty(callback)) {
              const descriptor = api.ObjectGetOwnPropertyDescriptor(prototype, callback);
              if (descriptor && descriptor.value) {
                descriptor.value = api.wrapWithCurrentZone(descriptor.value, source);
                api._redefineProperty(opts.prototype, callback, descriptor);
              } else if (prototype[callback]) {
                prototype[callback] = api.wrapWithCurrentZone(prototype[callback], source);
              }
            } else if (prototype[callback]) {
              prototype[callback] = api.wrapWithCurrentZone(prototype[callback], source);
            }
          } catch (e2) {
          }
        });
      }
      return nativeDelegate.call(target, name, opts, options);
    };
    api.attachOriginToPatched(target[method], nativeDelegate);
  }
  function patchUtil(Zone3) {
    Zone3.__load_patch("util", (global22, Zone4, api) => {
      const eventNames = getOnEventNames(global22);
      api.patchOnProperties = patchOnProperties;
      api.patchMethod = patchMethod;
      api.bindArguments = bindArguments;
      api.patchMacroTask = patchMacroTask;
      const SYMBOL_BLACK_LISTED_EVENTS = Zone4.__symbol__("BLACK_LISTED_EVENTS");
      const SYMBOL_UNPATCHED_EVENTS = Zone4.__symbol__("UNPATCHED_EVENTS");
      if (global22[SYMBOL_UNPATCHED_EVENTS]) {
        global22[SYMBOL_BLACK_LISTED_EVENTS] = global22[SYMBOL_UNPATCHED_EVENTS];
      }
      if (global22[SYMBOL_BLACK_LISTED_EVENTS]) {
        Zone4[SYMBOL_BLACK_LISTED_EVENTS] = Zone4[SYMBOL_UNPATCHED_EVENTS] = global22[SYMBOL_BLACK_LISTED_EVENTS];
      }
      api.patchEventPrototype = patchEventPrototype;
      api.patchEventTarget = patchEventTarget;
      api.ObjectDefineProperty = ObjectDefineProperty;
      api.ObjectGetOwnPropertyDescriptor = ObjectGetOwnPropertyDescriptor;
      api.ObjectCreate = ObjectCreate;
      api.ArraySlice = ArraySlice;
      api.patchClass = patchClass;
      api.wrapWithCurrentZone = wrapWithCurrentZone;
      api.filterProperties = filterProperties;
      api.attachOriginToPatched = attachOriginToPatched;
      api._redefineProperty = Object.defineProperty;
      api.patchCallbacks = patchCallbacks;
      api.getGlobalObjects = () => ({
        globalSources,
        zoneSymbolEventNames: zoneSymbolEventNames2,
        eventNames,
        isBrowser,
        isMix,
        isNode,
        TRUE_STR,
        FALSE_STR,
        ZONE_SYMBOL_PREFIX,
        ADD_EVENT_LISTENER_STR,
        REMOVE_EVENT_LISTENER_STR
      });
    });
  }
  function patchCommon(Zone3) {
    patchPromise(Zone3);
    patchToString(Zone3);
    patchUtil(Zone3);
  }
  var Zone2 = loadZone();
  patchCommon(Zone2);
  patchBrowser(Zone2);

  // node_modules/@opentelemetry/api-logs/build/esm/NoopLogger.js
  var NoopLogger = class {
    emit(_logRecord) {
    }
  };
  var NOOP_LOGGER = new NoopLogger();

  // node_modules/@opentelemetry/api-logs/build/esm/internal/global-utils.js
  var GLOBAL_LOGS_API_KEY = /* @__PURE__ */ Symbol.for("io.opentelemetry.js.api.logs");
  var _global3 = globalThis;
  function makeGetter(requiredVersion, instance, fallback) {
    return (version) => version === requiredVersion ? instance : fallback;
  }
  var API_BACKWARDS_COMPATIBILITY_VERSION = 1;

  // node_modules/@opentelemetry/api-logs/build/esm/NoopLoggerProvider.js
  var NoopLoggerProvider = class {
    getLogger(_name, _version, _options) {
      return new NoopLogger();
    }
  };
  var NOOP_LOGGER_PROVIDER = new NoopLoggerProvider();

  // node_modules/@opentelemetry/api-logs/build/esm/ProxyLogger.js
  var ProxyLogger = class {
    constructor(provider, name, version, options) {
      this._provider = provider;
      this.name = name;
      this.version = version;
      this.options = options;
    }
    /**
     * Emit a log record. This method should only be used by log appenders.
     *
     * @param logRecord
     */
    emit(logRecord) {
      this._getLogger().emit(logRecord);
    }
    /**
     * Try to get a logger from the proxy logger provider.
     * If the proxy logger provider has no delegate, return a noop logger.
     */
    _getLogger() {
      if (this._delegate) {
        return this._delegate;
      }
      const logger3 = this._provider._getDelegateLogger(this.name, this.version, this.options);
      if (!logger3) {
        return NOOP_LOGGER;
      }
      this._delegate = logger3;
      return this._delegate;
    }
  };

  // node_modules/@opentelemetry/api-logs/build/esm/ProxyLoggerProvider.js
  var ProxyLoggerProvider = class {
    getLogger(name, version, options) {
      var _a;
      return (_a = this._getDelegateLogger(name, version, options)) !== null && _a !== void 0 ? _a : new ProxyLogger(this, name, version, options);
    }
    /**
     * Get the delegate logger provider.
     * Used by tests only.
     * @internal
     */
    _getDelegate() {
      var _a;
      return (_a = this._delegate) !== null && _a !== void 0 ? _a : NOOP_LOGGER_PROVIDER;
    }
    /**
     * Set the delegate logger provider
     * @internal
     */
    _setDelegate(delegate) {
      this._delegate = delegate;
    }
    /**
     * @internal
     */
    _getDelegateLogger(name, version, options) {
      var _a;
      return (_a = this._delegate) === null || _a === void 0 ? void 0 : _a.getLogger(name, version, options);
    }
  };

  // node_modules/@opentelemetry/api-logs/build/esm/api/logs.js
  var LogsAPI = class _LogsAPI {
    constructor() {
      this._proxyLoggerProvider = new ProxyLoggerProvider();
    }
    static getInstance() {
      if (!this._instance) {
        this._instance = new _LogsAPI();
      }
      return this._instance;
    }
    setGlobalLoggerProvider(provider) {
      if (_global3[GLOBAL_LOGS_API_KEY]) {
        return this.getLoggerProvider();
      }
      _global3[GLOBAL_LOGS_API_KEY] = makeGetter(API_BACKWARDS_COMPATIBILITY_VERSION, provider, NOOP_LOGGER_PROVIDER);
      this._proxyLoggerProvider._setDelegate(provider);
      return provider;
    }
    /**
     * Returns the global logger provider.
     *
     * @returns LoggerProvider
     */
    getLoggerProvider() {
      var _a, _b;
      return (_b = (_a = _global3[GLOBAL_LOGS_API_KEY]) === null || _a === void 0 ? void 0 : _a.call(_global3, API_BACKWARDS_COMPATIBILITY_VERSION)) !== null && _b !== void 0 ? _b : this._proxyLoggerProvider;
    }
    /**
     * Returns a logger from the global logger provider.
     *
     * @returns Logger
     */
    getLogger(name, version, options) {
      return this.getLoggerProvider().getLogger(name, version, options);
    }
    /** Remove the global logger provider */
    disable() {
      delete _global3[GLOBAL_LOGS_API_KEY];
      this._proxyLoggerProvider = new ProxyLoggerProvider();
    }
  };

  // node_modules/@opentelemetry/api-logs/build/esm/index.js
  var logs = LogsAPI.getInstance();

  // node_modules/@opentelemetry/instrumentation/build/esm/autoLoaderUtils.js
  function enableInstrumentations(instrumentations, tracerProvider, meterProvider, loggerProvider) {
    for (let i2 = 0, j = instrumentations.length; i2 < j; i2++) {
      const instrumentation = instrumentations[i2];
      if (tracerProvider) {
        instrumentation.setTracerProvider(tracerProvider);
      }
      if (meterProvider) {
        instrumentation.setMeterProvider(meterProvider);
      }
      if (loggerProvider && instrumentation.setLoggerProvider) {
        instrumentation.setLoggerProvider(loggerProvider);
      }
      if (!instrumentation.getConfig().enabled) {
        instrumentation.enable();
      }
    }
  }
  function disableInstrumentations(instrumentations) {
    instrumentations.forEach((instrumentation) => instrumentation.disable());
  }

  // node_modules/@opentelemetry/instrumentation/build/esm/autoLoader.js
  function registerInstrumentations(options) {
    var _a, _b;
    const tracerProvider = options.tracerProvider || trace.getTracerProvider();
    const meterProvider = options.meterProvider || metrics.getMeterProvider();
    const loggerProvider = options.loggerProvider || logs.getLoggerProvider();
    const instrumentations = (_b = (_a = options.instrumentations) == null ? void 0 : _a.flat()) != null ? _b : [];
    enableInstrumentations(instrumentations, tracerProvider, meterProvider, loggerProvider);
    return () => {
      disableInstrumentations(instrumentations);
    };
  }

  // node_modules/@opentelemetry/instrumentation/build/esm/shimmer.js
  var logger = console.error.bind(console);
  function defineProperty(obj, name, value) {
    const enumerable = !!obj[name] && Object.prototype.propertyIsEnumerable.call(obj, name);
    Object.defineProperty(obj, name, {
      configurable: true,
      enumerable,
      writable: true,
      value
    });
  }
  var wrap = (nodule, name, wrapper) => {
    if (!nodule || !nodule[name]) {
      logger("no original function " + String(name) + " to wrap");
      return;
    }
    if (!wrapper) {
      logger("no wrapper function");
      logger(new Error().stack);
      return;
    }
    const original = nodule[name];
    if (typeof original !== "function" || typeof wrapper !== "function") {
      logger("original object and wrapper must be functions");
      return;
    }
    const wrapped = wrapper(original, name);
    defineProperty(wrapped, "__original", original);
    defineProperty(wrapped, "__unwrap", () => {
      if (nodule[name] === wrapped) {
        defineProperty(nodule, name, original);
      }
    });
    defineProperty(wrapped, "__wrapped", true);
    defineProperty(nodule, name, wrapped);
    return wrapped;
  };
  var massWrap = (nodules, names, wrapper) => {
    if (!nodules) {
      logger("must provide one or more modules to patch");
      logger(new Error().stack);
      return;
    } else if (!Array.isArray(nodules)) {
      nodules = [nodules];
    }
    if (!(names && Array.isArray(names))) {
      logger("must provide one or more functions to wrap on modules");
      return;
    }
    nodules.forEach((nodule) => {
      names.forEach((name) => {
        wrap(nodule, name, wrapper);
      });
    });
  };
  var unwrap = (nodule, name) => {
    if (!nodule || !nodule[name]) {
      logger("no function to unwrap.");
      logger(new Error().stack);
      return;
    }
    const wrapped = nodule[name];
    if (!wrapped.__unwrap) {
      logger("no original to unwrap to -- has " + String(name) + " already been unwrapped?");
    } else {
      wrapped.__unwrap();
      return;
    }
  };
  var massUnwrap = (nodules, names) => {
    if (!nodules) {
      logger("must provide one or more modules to patch");
      logger(new Error().stack);
      return;
    } else if (!Array.isArray(nodules)) {
      nodules = [nodules];
    }
    if (!(names && Array.isArray(names))) {
      logger("must provide one or more functions to unwrap on modules");
      return;
    }
    nodules.forEach((nodule) => {
      names.forEach((name) => {
        unwrap(nodule, name);
      });
    });
  };
  function shimmer(options) {
    if (options && options.logger) {
      if (typeof options.logger !== "function") {
        logger("new logger isn't a function, not replacing");
      } else {
        logger = options.logger;
      }
    }
  }
  shimmer.wrap = wrap;
  shimmer.massWrap = massWrap;
  shimmer.unwrap = unwrap;
  shimmer.massUnwrap = massUnwrap;

  // node_modules/@opentelemetry/instrumentation/build/esm/instrumentation.js
  var InstrumentationAbstract = class {
    constructor(instrumentationName, instrumentationVersion, config) {
      __publicField(this, "_config", {});
      __publicField(this, "_tracer");
      __publicField(this, "_meter");
      __publicField(this, "_logger");
      __publicField(this, "_diag");
      __publicField(this, "instrumentationName");
      __publicField(this, "instrumentationVersion");
      /* Api to wrap instrumented method */
      __publicField(this, "_wrap", wrap);
      /* Api to unwrap instrumented methods */
      __publicField(this, "_unwrap", unwrap);
      /* Api to mass wrap instrumented method */
      __publicField(this, "_massWrap", massWrap);
      /* Api to mass unwrap instrumented methods */
      __publicField(this, "_massUnwrap", massUnwrap);
      this.instrumentationName = instrumentationName;
      this.instrumentationVersion = instrumentationVersion;
      this.setConfig(config);
      this._diag = diag2.createComponentLogger({
        namespace: instrumentationName
      });
      this._tracer = trace.getTracer(instrumentationName, instrumentationVersion);
      this._meter = metrics.getMeter(instrumentationName, instrumentationVersion);
      this._logger = logs.getLogger(instrumentationName, instrumentationVersion);
      this._updateMetricInstruments();
    }
    /* Returns meter */
    get meter() {
      return this._meter;
    }
    /**
     * Sets MeterProvider to this plugin
     * @param meterProvider
     */
    setMeterProvider(meterProvider) {
      this._meter = meterProvider.getMeter(this.instrumentationName, this.instrumentationVersion);
      this._updateMetricInstruments();
    }
    /* Returns logger */
    get logger() {
      return this._logger;
    }
    /**
     * Sets LoggerProvider to this plugin
     * @param loggerProvider
     */
    setLoggerProvider(loggerProvider) {
      this._logger = loggerProvider.getLogger(this.instrumentationName, this.instrumentationVersion);
    }
    /**
     * @experimental
     *
     * Get module definitions defined by {@link init}.
     * This can be used for experimental compile-time instrumentation.
     *
     * @returns an array of {@link InstrumentationModuleDefinition}
     */
    getModuleDefinitions() {
      var _a;
      const initResult = (_a = this.init()) != null ? _a : [];
      if (!Array.isArray(initResult)) {
        return [initResult];
      }
      return initResult;
    }
    /**
     * Sets the new metric instruments with the current Meter.
     */
    _updateMetricInstruments() {
      return;
    }
    /* Returns InstrumentationConfig */
    getConfig() {
      return this._config;
    }
    /**
     * Sets InstrumentationConfig to this plugin
     * @param config
     */
    setConfig(config) {
      this._config = {
        enabled: true,
        ...config
      };
    }
    /**
     * Sets TraceProvider to this plugin
     * @param tracerProvider
     */
    setTracerProvider(tracerProvider) {
      this._tracer = tracerProvider.getTracer(this.instrumentationName, this.instrumentationVersion);
    }
    /* Returns tracer */
    get tracer() {
      return this._tracer;
    }
    /**
     * Execute span customization hook, if configured, and log any errors.
     * Any semantics of the trigger and info are defined by the specific instrumentation.
     * @param hookHandler The optional hook handler which the user has configured via instrumentation config
     * @param triggerName The name of the trigger for executing the hook for logging purposes
     * @param span The span to which the hook should be applied
     * @param info The info object to be passed to the hook, with useful data the hook may use
     */
    _runSpanCustomizationHook(hookHandler, triggerName, span, info) {
      if (!hookHandler) {
        return;
      }
      try {
        hookHandler(span, info);
      } catch (e2) {
        this._diag.error(`Error running span customization hook due to exception in handler`, { triggerName }, e2);
      }
    }
  };

  // node_modules/@opentelemetry/instrumentation/build/esm/platform/browser/instrumentation.js
  var InstrumentationBase = class extends InstrumentationAbstract {
    constructor(instrumentationName, instrumentationVersion, config) {
      super(instrumentationName, instrumentationVersion, config);
      if (this._config.enabled) {
        this.enable();
      }
    }
  };

  // node_modules/@opentelemetry/instrumentation/build/esm/utils.js
  function safeExecuteInTheMiddle(execute, onFinish, preventThrowingError) {
    let error;
    let result;
    try {
      result = execute();
    } catch (e2) {
      error = e2;
    } finally {
      onFinish(error, result);
      if (error && !preventThrowingError) {
        throw error;
      }
      return result;
    }
  }
  function isWrapped(func) {
    return typeof func === "function" && typeof func.__original === "function" && typeof func.__unwrap === "function" && func.__wrapped === true;
  }

  // node_modules/@opentelemetry/instrumentation/build/esm/semconvStability.js
  var SemconvStability;
  (function(SemconvStability3) {
    SemconvStability3[SemconvStability3["STABLE"] = 1] = "STABLE";
    SemconvStability3[SemconvStability3["OLD"] = 2] = "OLD";
    SemconvStability3[SemconvStability3["DUPLICATE"] = 3] = "DUPLICATE";
  })(SemconvStability || (SemconvStability = {}));
  function semconvStabilityFromStr(namespace, str) {
    let semconvStability = SemconvStability.OLD;
    const entries = str == null ? void 0 : str.split(",").map((v2) => v2.trim()).filter((s2) => s2 !== "");
    for (const entry of entries != null ? entries : []) {
      if (entry.toLowerCase() === namespace + "/dup") {
        semconvStability = SemconvStability.DUPLICATE;
        break;
      } else if (entry.toLowerCase() === namespace) {
        semconvStability = SemconvStability.STABLE;
      }
    }
    return semconvStability;
  }

  // node_modules/@opentelemetry/instrumentation-document-load/build/esm/enums/AttributeNames.js
  var AttributeNames;
  (function(AttributeNames5) {
    AttributeNames5["DOCUMENT_LOAD"] = "documentLoad";
    AttributeNames5["DOCUMENT_FETCH"] = "documentFetch";
    AttributeNames5["RESOURCE_FETCH"] = "resourceFetch";
  })(AttributeNames || (AttributeNames = {}));

  // node_modules/@opentelemetry/instrumentation-document-load/build/esm/version.js
  var PACKAGE_VERSION = "0.56.0";
  var PACKAGE_NAME = "@opentelemetry/instrumentation-document-load";

  // node_modules/@opentelemetry/instrumentation-document-load/build/esm/semconv.js
  var ATTR_HTTP_URL = "http.url";
  var ATTR_HTTP_USER_AGENT = "http.user_agent";

  // node_modules/@opentelemetry/instrumentation-document-load/build/esm/enums/EventNames.js
  var EventNames;
  (function(EventNames3) {
    EventNames3["FIRST_PAINT"] = "firstPaint";
    EventNames3["FIRST_CONTENTFUL_PAINT"] = "firstContentfulPaint";
  })(EventNames || (EventNames = {}));

  // node_modules/@opentelemetry/instrumentation-document-load/build/esm/utils.js
  var getPerformanceNavigationEntries = () => {
    var _a, _b;
    const entries = {};
    const performanceNavigationTiming = (_b = (_a = otperformance).getEntriesByType) == null ? void 0 : _b.call(_a, "navigation")[0];
    if (performanceNavigationTiming) {
      const keys = Object.values(PerformanceTimingNames);
      keys.forEach((key) => {
        if (hasKey(performanceNavigationTiming, key)) {
          const value = performanceNavigationTiming[key];
          if (typeof value === "number") {
            entries[key] = value;
          }
        }
      });
    } else {
      const perf = otperformance;
      const performanceTiming = perf.timing;
      if (performanceTiming) {
        const keys = Object.values(PerformanceTimingNames);
        keys.forEach((key) => {
          if (hasKey(performanceTiming, key)) {
            const value = performanceTiming[key];
            if (typeof value === "number") {
              entries[key] = value;
            }
          }
        });
      }
    }
    return entries;
  };
  var performancePaintNames = {
    "first-paint": EventNames.FIRST_PAINT,
    "first-contentful-paint": EventNames.FIRST_CONTENTFUL_PAINT
  };
  var addSpanPerformancePaintEvents = (span) => {
    var _a, _b;
    const performancePaintTiming = (_b = (_a = otperformance).getEntriesByType) == null ? void 0 : _b.call(_a, "paint");
    if (performancePaintTiming) {
      performancePaintTiming.forEach(({ name, startTime }) => {
        if (hasKey(performancePaintNames, name)) {
          span.addEvent(performancePaintNames[name], startTime);
        }
      });
    }
  };

  // node_modules/@opentelemetry/instrumentation-document-load/build/esm/instrumentation.js
  var DocumentLoadInstrumentation = class extends InstrumentationBase {
    constructor(config = {}) {
      super(PACKAGE_NAME, PACKAGE_VERSION, config);
      __publicField(this, "component", "document-load");
      __publicField(this, "version", "1");
      __publicField(this, "moduleName", this.component);
      __publicField(this, "_semconvStability");
      this._semconvStability = semconvStabilityFromStr("http", config == null ? void 0 : config.semconvStabilityOptIn);
    }
    init() {
    }
    /**
     * callback to be executed when page is loaded
     */
    _onDocumentLoaded() {
      window.setTimeout(() => {
        this._collectPerformance();
      });
    }
    /**
     * Adds spans for all resources
     * @param rootSpan
     */
    _addResourcesSpans(rootSpan) {
      var _a, _b;
      const resources = (_b = (_a = otperformance).getEntriesByType) == null ? void 0 : _b.call(_a, "resource");
      if (resources) {
        resources.forEach((resource) => {
          this._initResourceSpan(resource, rootSpan);
        });
      }
    }
    /**
     * Collects information about performance and creates appropriate spans
     */
    _collectPerformance() {
      const metaElement = Array.from(document.getElementsByTagName("meta")).find((e2) => e2.getAttribute("name") === TRACE_PARENT_HEADER);
      const entries = getPerformanceNavigationEntries();
      const traceparent = metaElement && metaElement.content || "";
      context.with(propagation.extract(ROOT_CONTEXT, { traceparent }), () => {
        var _a;
        const rootSpan = this._startSpan(AttributeNames.DOCUMENT_LOAD, PerformanceTimingNames.FETCH_START, entries);
        if (!rootSpan) {
          return;
        }
        context.with(trace.setSpan(context.active(), rootSpan), () => {
          const fetchSpan = this._startSpan(AttributeNames.DOCUMENT_FETCH, PerformanceTimingNames.FETCH_START, entries);
          if (fetchSpan) {
            if (this._semconvStability & SemconvStability.OLD) {
              fetchSpan.setAttribute(ATTR_HTTP_URL, location.href);
            }
            if (this._semconvStability & SemconvStability.STABLE) {
              fetchSpan.setAttribute(ATTR_URL_FULL, location.href);
            }
            context.with(trace.setSpan(context.active(), fetchSpan), () => {
              var _a2;
              const skipOldSemconvContentLengthAttrs = !(this._semconvStability & SemconvStability.OLD);
              addSpanNetworkEvents(fetchSpan, entries, this.getConfig().ignoreNetworkEvents, void 0, skipOldSemconvContentLengthAttrs);
              this._addCustomAttributesOnSpan(fetchSpan, (_a2 = this.getConfig().applyCustomAttributesOnSpan) == null ? void 0 : _a2.documentFetch);
              this._endSpan(fetchSpan, PerformanceTimingNames.RESPONSE_END, entries);
            });
          }
        });
        if (this._semconvStability & SemconvStability.OLD) {
          rootSpan.setAttribute(ATTR_HTTP_URL, location.href);
          rootSpan.setAttribute(ATTR_HTTP_USER_AGENT, navigator.userAgent);
        }
        if (this._semconvStability & SemconvStability.STABLE) {
          rootSpan.setAttribute(ATTR_URL_FULL, location.href);
          rootSpan.setAttribute(ATTR_USER_AGENT_ORIGINAL, navigator.userAgent);
        }
        this._addResourcesSpans(rootSpan);
        if (!this.getConfig().ignoreNetworkEvents) {
          addSpanNetworkEvent(rootSpan, PerformanceTimingNames.FETCH_START, entries);
          addSpanNetworkEvent(rootSpan, PerformanceTimingNames.UNLOAD_EVENT_START, entries);
          addSpanNetworkEvent(rootSpan, PerformanceTimingNames.UNLOAD_EVENT_END, entries);
          addSpanNetworkEvent(rootSpan, PerformanceTimingNames.DOM_INTERACTIVE, entries);
          addSpanNetworkEvent(rootSpan, PerformanceTimingNames.DOM_CONTENT_LOADED_EVENT_START, entries);
          addSpanNetworkEvent(rootSpan, PerformanceTimingNames.DOM_CONTENT_LOADED_EVENT_END, entries);
          addSpanNetworkEvent(rootSpan, PerformanceTimingNames.DOM_COMPLETE, entries);
          addSpanNetworkEvent(rootSpan, PerformanceTimingNames.LOAD_EVENT_START, entries);
          addSpanNetworkEvent(rootSpan, PerformanceTimingNames.LOAD_EVENT_END, entries);
        }
        if (!this.getConfig().ignorePerformancePaintEvents) {
          addSpanPerformancePaintEvents(rootSpan);
        }
        this._addCustomAttributesOnSpan(rootSpan, (_a = this.getConfig().applyCustomAttributesOnSpan) == null ? void 0 : _a.documentLoad);
        this._endSpan(rootSpan, PerformanceTimingNames.LOAD_EVENT_END, entries);
      });
    }
    /**
     * Helper function for ending span
     * @param span
     * @param performanceName name of performance entry for time end
     * @param entries
     */
    _endSpan(span, performanceName, entries) {
      if (span) {
        if (hasKey(entries, performanceName)) {
          span.end(entries[performanceName]);
        } else {
          span.end();
        }
      }
    }
    /**
     * Creates and ends a span with network information about resource added as timed events
     * @param resource
     * @param parentSpan
     */
    _initResourceSpan(resource, parentSpan) {
      var _a;
      const span = this._startSpan(AttributeNames.RESOURCE_FETCH, PerformanceTimingNames.FETCH_START, resource, parentSpan);
      if (span) {
        if (this._semconvStability & SemconvStability.OLD) {
          span.setAttribute(ATTR_HTTP_URL, resource.name);
        }
        if (this._semconvStability & SemconvStability.STABLE) {
          span.setAttribute(ATTR_URL_FULL, resource.name);
        }
        const skipOldSemconvContentLengthAttrs = !(this._semconvStability & SemconvStability.OLD);
        addSpanNetworkEvents(span, resource, this.getConfig().ignoreNetworkEvents, void 0, skipOldSemconvContentLengthAttrs);
        this._addCustomAttributesOnResourceSpan(span, resource, (_a = this.getConfig().applyCustomAttributesOnSpan) == null ? void 0 : _a.resourceFetch);
        this._endSpan(span, PerformanceTimingNames.RESPONSE_END, resource);
      }
    }
    /**
     * Helper function for starting a span
     * @param spanName name of span
     * @param performanceName name of performance entry for time start
     * @param entries
     * @param parentSpan
     */
    _startSpan(spanName, performanceName, entries, parentSpan) {
      if (hasKey(entries, performanceName) && typeof entries[performanceName] === "number") {
        const span = this.tracer.startSpan(spanName, {
          startTime: entries[performanceName]
        }, parentSpan ? trace.setSpan(context.active(), parentSpan) : void 0);
        return span;
      }
      return void 0;
    }
    /**
     * executes callback {_onDocumentLoaded} when the page is loaded
     */
    _waitForPageLoad() {
      if (window.document.readyState === "complete") {
        this._onDocumentLoaded();
      } else {
        this._onDocumentLoaded = this._onDocumentLoaded.bind(this);
        window.addEventListener("load", this._onDocumentLoaded);
      }
    }
    /**
     * adds custom attributes to root span if configured
     */
    _addCustomAttributesOnSpan(span, applyCustomAttributesOnSpan) {
      if (applyCustomAttributesOnSpan) {
        safeExecuteInTheMiddle(() => applyCustomAttributesOnSpan(span), (error) => {
          if (!error) {
            return;
          }
          this._diag.error("addCustomAttributesOnSpan", error);
        }, true);
      }
    }
    /**
     * adds custom attributes to span if configured
     */
    _addCustomAttributesOnResourceSpan(span, resource, applyCustomAttributesOnSpan) {
      if (applyCustomAttributesOnSpan) {
        safeExecuteInTheMiddle(() => applyCustomAttributesOnSpan(span, resource), (error) => {
          if (!error) {
            return;
          }
          this._diag.error("addCustomAttributesOnResourceSpan", error);
        }, true);
      }
    }
    /**
     * implements enable function
     */
    enable() {
      window.removeEventListener("load", this._onDocumentLoaded);
      this._waitForPageLoad();
    }
    /**
     * implements disable function
     */
    disable() {
      window.removeEventListener("load", this._onDocumentLoaded);
    }
  };

  // node_modules/@opentelemetry/instrumentation-user-interaction/build/esm/enums/AttributeNames.js
  var AttributeNames2;
  (function(AttributeNames5) {
    AttributeNames5["EVENT_TYPE"] = "event_type";
    AttributeNames5["TARGET_ELEMENT"] = "target_element";
    AttributeNames5["TARGET_XPATH"] = "target_xpath";
    AttributeNames5["HTTP_URL"] = "http.url";
  })(AttributeNames2 || (AttributeNames2 = {}));

  // node_modules/@opentelemetry/instrumentation-user-interaction/build/esm/version.js
  var PACKAGE_VERSION2 = "0.55.0";
  var PACKAGE_NAME2 = "@opentelemetry/instrumentation-user-interaction";

  // node_modules/@opentelemetry/instrumentation-user-interaction/build/esm/instrumentation.js
  var ZONE_CONTEXT_KEY2 = "OT_ZONE_CONTEXT";
  var EVENT_NAVIGATION_NAME = "Navigation:";
  var DEFAULT_EVENT_NAMES = ["click"];
  function defaultShouldPreventSpanCreation() {
    return false;
  }
  var UserInteractionInstrumentation = class extends InstrumentationBase {
    constructor(config = {}) {
      var _a;
      super(PACKAGE_NAME2, PACKAGE_VERSION2, config);
      __publicField(this, "version", PACKAGE_VERSION2);
      __publicField(this, "moduleName", "user-interaction");
      __publicField(this, "_spansData", /* @__PURE__ */ new WeakMap());
      // for addEventListener/removeEventListener state
      __publicField(this, "_wrappedListeners", /* @__PURE__ */ new WeakMap());
      // for event bubbling
      __publicField(this, "_eventsSpanMap", /* @__PURE__ */ new WeakMap());
      __publicField(this, "_eventNames");
      __publicField(this, "_shouldPreventSpanCreation");
      this._eventNames = new Set((_a = config == null ? void 0 : config.eventNames) != null ? _a : DEFAULT_EVENT_NAMES);
      this._shouldPreventSpanCreation = typeof (config == null ? void 0 : config.shouldPreventSpanCreation) === "function" ? config.shouldPreventSpanCreation : defaultShouldPreventSpanCreation;
    }
    init() {
    }
    /**
     * This will check if last task was timeout and will save the time to
     * fix the user interaction when nothing happens
     * This timeout comes from xhr plugin which is needed to collect information
     * about last xhr main request from observer
     * @param task
     * @param span
     */
    _checkForTimeout(task, span) {
      const spanData = this._spansData.get(span);
      if (spanData) {
        if (task.source === "setTimeout") {
          spanData.hrTimeLastTimeout = hrTime();
        } else if (task.source !== "Promise.then" && task.source !== "setTimeout") {
          spanData.hrTimeLastTimeout = void 0;
        }
      }
    }
    /**
     * Controls whether or not to create a span, based on the event type.
     */
    _allowEventName(eventName) {
      return this._eventNames.has(eventName);
    }
    /**
     * Creates a new span
     * @param element
     * @param eventName
     * @param parentSpan
     */
    _createSpan(element, eventName, parentSpan) {
      if (!(element instanceof HTMLElement)) {
        return void 0;
      }
      if (!element.getAttribute) {
        return void 0;
      }
      if (element.hasAttribute("disabled")) {
        return void 0;
      }
      if (!this._allowEventName(eventName)) {
        return void 0;
      }
      const xpath = getElementXPath(element, true);
      try {
        const span = this.tracer.startSpan(eventName, {
          attributes: {
            [AttributeNames2.EVENT_TYPE]: eventName,
            [AttributeNames2.TARGET_ELEMENT]: element.tagName,
            [AttributeNames2.TARGET_XPATH]: xpath,
            [AttributeNames2.HTTP_URL]: window.location.href
          }
        }, parentSpan ? trace.setSpan(context.active(), parentSpan) : void 0);
        if (this._shouldPreventSpanCreation(eventName, element, span) === true) {
          return void 0;
        }
        this._spansData.set(span, {
          taskCount: 0
        });
        return span;
      } catch (e2) {
        this._diag.error("failed to start create new user interaction span", e2);
      }
      return void 0;
    }
    /**
     * Decrement number of tasks that left in zone,
     * This is needed to be able to end span when no more tasks left
     * @param span
     */
    _decrementTask(span) {
      const spanData = this._spansData.get(span);
      if (spanData) {
        spanData.taskCount--;
        if (spanData.taskCount === 0) {
          this._tryToEndSpan(span, spanData.hrTimeLastTimeout);
        }
      }
    }
    /**
     * Return the current span
     * @param zone
     * @private
     */
    _getCurrentSpan(zone) {
      const context2 = zone.get(ZONE_CONTEXT_KEY2);
      if (context2) {
        return trace.getSpan(context2);
      }
      return context2;
    }
    /**
     * Increment number of tasks that are run within the same zone.
     *     This is needed to be able to end span when no more tasks left
     * @param span
     */
    _incrementTask(span) {
      const spanData = this._spansData.get(span);
      if (spanData) {
        spanData.taskCount++;
      }
    }
    /**
     * Returns true iff we should use the patched callback; false if it's already been patched
     */
    addPatchedListener(on, type, listener, wrappedListener) {
      let listener2Type = this._wrappedListeners.get(listener);
      if (!listener2Type) {
        listener2Type = /* @__PURE__ */ new Map();
        this._wrappedListeners.set(listener, listener2Type);
      }
      let element2patched = listener2Type.get(type);
      if (!element2patched) {
        element2patched = /* @__PURE__ */ new Map();
        listener2Type.set(type, element2patched);
      }
      if (element2patched.has(on)) {
        return false;
      }
      element2patched.set(on, wrappedListener);
      return true;
    }
    /**
     * Returns the patched version of the callback (or undefined)
     */
    removePatchedListener(on, type, listener) {
      const listener2Type = this._wrappedListeners.get(listener);
      if (!listener2Type) {
        return void 0;
      }
      const element2patched = listener2Type.get(type);
      if (!element2patched) {
        return void 0;
      }
      const patched = element2patched.get(on);
      if (patched) {
        element2patched.delete(on);
        if (element2patched.size === 0) {
          listener2Type.delete(type);
          if (listener2Type.size === 0) {
            this._wrappedListeners.delete(listener);
          }
        }
      }
      return patched;
    }
    // utility method to deal with the Function|EventListener nature of addEventListener
    _invokeListener(listener, target, args) {
      if (typeof listener === "function") {
        return listener.apply(target, args);
      } else {
        return listener.handleEvent(args[0]);
      }
    }
    /**
     * This patches the addEventListener of HTMLElement to be able to
     * auto instrument the click events
     * This is done when zone is not available
     */
    _patchAddEventListener() {
      const plugin = this;
      return (original) => {
        return function addEventListenerPatched(type, listener, useCapture) {
          if (!listener) {
            return original.call(this, type, listener, useCapture);
          }
          const once = useCapture && typeof useCapture === "object" && useCapture.once;
          const patchedListener = function(...args) {
            let parentSpan;
            const event = args[0];
            const target = event == null ? void 0 : event.target;
            if (event) {
              parentSpan = plugin._eventsSpanMap.get(event);
            }
            if (once) {
              plugin.removePatchedListener(this, type, listener);
            }
            const span = plugin._createSpan(target, type, parentSpan);
            if (span) {
              if (event) {
                plugin._eventsSpanMap.set(event, span);
              }
              return context.with(trace.setSpan(context.active(), span), () => {
                const result = plugin._invokeListener(listener, this, args);
                span.end();
                return result;
              });
            } else {
              return plugin._invokeListener(listener, this, args);
            }
          };
          if (plugin.addPatchedListener(this, type, listener, patchedListener)) {
            return original.call(this, type, patchedListener, useCapture);
          }
        };
      };
    }
    /**
     * This patches the removeEventListener of HTMLElement to handle the fact that
     * we patched the original callbacks
     * This is done when zone is not available
     */
    _patchRemoveEventListener() {
      const plugin = this;
      return (original) => {
        return function removeEventListenerPatched(type, listener, useCapture) {
          const wrappedListener = plugin.removePatchedListener(this, type, listener);
          if (wrappedListener) {
            return original.call(this, type, wrappedListener, useCapture);
          } else {
            return original.call(this, type, listener, useCapture);
          }
        };
      };
    }
    /**
     * Most browser provide event listener api via EventTarget in prototype chain.
     * Exception to this is IE 11 which has it on the prototypes closest to EventTarget:
     *
     * * - has addEventListener in IE
     * ** - has addEventListener in all other browsers
     * ! - missing in IE
     *
     * HTMLElement -> Element -> Node * -> EventTarget **! -> Object
     * Document -> Node * -> EventTarget **! -> Object
     * Window * -> WindowProperties ! -> EventTarget **! -> Object
     */
    _getPatchableEventTargets() {
      return window.EventTarget ? [EventTarget.prototype] : [Node.prototype, Window.prototype];
    }
    /**
     * Patches the history api
     */
    _patchHistoryApi() {
      this._unpatchHistoryApi();
      this._wrap(history, "replaceState", this._patchHistoryMethod());
      this._wrap(history, "pushState", this._patchHistoryMethod());
      this._wrap(history, "back", this._patchHistoryMethod());
      this._wrap(history, "forward", this._patchHistoryMethod());
      this._wrap(history, "go", this._patchHistoryMethod());
    }
    /**
     * Patches the certain history api method
     */
    _patchHistoryMethod() {
      const plugin = this;
      return (original) => {
        return function patchHistoryMethod(...args) {
          const url = `${location.pathname}${location.hash}${location.search}`;
          const result = original.apply(this, args);
          const urlAfter = `${location.pathname}${location.hash}${location.search}`;
          if (url !== urlAfter) {
            plugin._updateInteractionName(urlAfter);
          }
          return result;
        };
      };
    }
    /**
     * unpatch the history api methods
     */
    _unpatchHistoryApi() {
      if (isWrapped(history.replaceState))
        this._unwrap(history, "replaceState");
      if (isWrapped(history.pushState))
        this._unwrap(history, "pushState");
      if (isWrapped(history.back))
        this._unwrap(history, "back");
      if (isWrapped(history.forward))
        this._unwrap(history, "forward");
      if (isWrapped(history.go))
        this._unwrap(history, "go");
    }
    /**
     * Updates interaction span name
     * @param url
     */
    _updateInteractionName(url) {
      const span = trace.getSpan(context.active());
      if (span && typeof span.updateName === "function") {
        span.updateName(`${EVENT_NAVIGATION_NAME} ${url}`);
      }
    }
    /**
     * Patches zone cancel task - this is done to be able to correctly
     * decrement the number of remaining tasks
     */
    _patchZoneCancelTask() {
      const plugin = this;
      return (original) => {
        return function patchCancelTask(task) {
          const currentZone = Zone.current;
          const currentSpan = plugin._getCurrentSpan(currentZone);
          if (currentSpan && plugin._shouldCountTask(task, currentZone)) {
            plugin._decrementTask(currentSpan);
          }
          return original.call(this, task);
        };
      };
    }
    /**
     * Patches zone schedule task - this is done to be able to correctly
     * increment the number of tasks running within current zone but also to
     * save time in case of timeout running from xhr plugin when waiting for
     * main request from PerformanceResourceTiming
     */
    _patchZoneScheduleTask() {
      const plugin = this;
      return (original) => {
        return function patchScheduleTask(task) {
          const currentZone = Zone.current;
          const currentSpan = plugin._getCurrentSpan(currentZone);
          if (currentSpan && plugin._shouldCountTask(task, currentZone)) {
            plugin._incrementTask(currentSpan);
            plugin._checkForTimeout(task, currentSpan);
          }
          return original.call(this, task);
        };
      };
    }
    /**
     * Patches zone run task - this is done to be able to create a span when
     * user interaction starts
     * @private
     */
    _patchZoneRunTask() {
      const plugin = this;
      return (original) => {
        return function patchRunTask(task, applyThis, applyArgs) {
          const event = Array.isArray(applyArgs) && applyArgs[0] instanceof Event ? applyArgs[0] : void 0;
          const target = event == null ? void 0 : event.target;
          let span;
          const activeZone = this;
          if (target) {
            span = plugin._createSpan(target, task.eventName);
            if (span) {
              plugin._incrementTask(span);
              return activeZone.run(() => {
                try {
                  return context.with(trace.setSpan(context.active(), span), () => {
                    const currentZone = Zone.current;
                    task._zone = currentZone;
                    return original.call(currentZone, task, applyThis, applyArgs);
                  });
                } finally {
                  plugin._decrementTask(span);
                }
              });
            }
          } else {
            span = plugin._getCurrentSpan(activeZone);
          }
          try {
            return original.call(activeZone, task, applyThis, applyArgs);
          } finally {
            if (span && plugin._shouldCountTask(task, activeZone)) {
              plugin._decrementTask(span);
            }
          }
        };
      };
    }
    /**
     * Decides if task should be counted.
     * @param task
     * @param currentZone
     * @private
     */
    _shouldCountTask(task, currentZone) {
      if (task._zone) {
        currentZone = task._zone;
      }
      if (!currentZone || !task.data || task.data.isPeriodic) {
        return false;
      }
      const currentSpan = this._getCurrentSpan(currentZone);
      if (!currentSpan) {
        return false;
      }
      if (!this._spansData.get(currentSpan)) {
        return false;
      }
      return task.type === "macroTask" || task.type === "microTask";
    }
    /**
     * Will try to end span when such span still exists.
     * @param span
     * @param endTime
     * @private
     */
    _tryToEndSpan(span, endTime) {
      if (span) {
        const spanData = this._spansData.get(span);
        if (spanData) {
          span.end(endTime);
          this._spansData.delete(span);
        }
      }
    }
    /**
     * implements enable function
     */
    enable() {
      const ZoneWithPrototype = this._getZoneWithPrototype();
      this._diag.debug("applying patch to", this.moduleName, this.version, "zone:", !!ZoneWithPrototype);
      if (ZoneWithPrototype) {
        if (isWrapped(ZoneWithPrototype.prototype.runTask)) {
          this._unwrap(ZoneWithPrototype.prototype, "runTask");
          this._diag.debug("removing previous patch from method runTask");
        }
        if (isWrapped(ZoneWithPrototype.prototype.scheduleTask)) {
          this._unwrap(ZoneWithPrototype.prototype, "scheduleTask");
          this._diag.debug("removing previous patch from method scheduleTask");
        }
        if (isWrapped(ZoneWithPrototype.prototype.cancelTask)) {
          this._unwrap(ZoneWithPrototype.prototype, "cancelTask");
          this._diag.debug("removing previous patch from method cancelTask");
        }
        this._zonePatched = true;
        this._wrap(ZoneWithPrototype.prototype, "runTask", this._patchZoneRunTask());
        this._wrap(ZoneWithPrototype.prototype, "scheduleTask", this._patchZoneScheduleTask());
        this._wrap(ZoneWithPrototype.prototype, "cancelTask", this._patchZoneCancelTask());
      } else {
        this._zonePatched = false;
        const targets = this._getPatchableEventTargets();
        targets.forEach((target) => {
          if (isWrapped(target.addEventListener)) {
            this._unwrap(target, "addEventListener");
            this._diag.debug("removing previous patch from method addEventListener");
          }
          if (isWrapped(target.removeEventListener)) {
            this._unwrap(target, "removeEventListener");
            this._diag.debug("removing previous patch from method removeEventListener");
          }
          this._wrap(target, "addEventListener", this._patchAddEventListener());
          this._wrap(target, "removeEventListener", this._patchRemoveEventListener());
        });
      }
      this._patchHistoryApi();
    }
    /**
     * implements unpatch function
     */
    disable() {
      const ZoneWithPrototype = this._getZoneWithPrototype();
      this._diag.debug("removing patch from", this.moduleName, this.version, "zone:", !!ZoneWithPrototype);
      if (ZoneWithPrototype && this._zonePatched) {
        if (isWrapped(ZoneWithPrototype.prototype.runTask)) {
          this._unwrap(ZoneWithPrototype.prototype, "runTask");
        }
        if (isWrapped(ZoneWithPrototype.prototype.scheduleTask)) {
          this._unwrap(ZoneWithPrototype.prototype, "scheduleTask");
        }
        if (isWrapped(ZoneWithPrototype.prototype.cancelTask)) {
          this._unwrap(ZoneWithPrototype.prototype, "cancelTask");
        }
      } else {
        const targets = this._getPatchableEventTargets();
        targets.forEach((target) => {
          if (isWrapped(target.addEventListener)) {
            this._unwrap(target, "addEventListener");
          }
          if (isWrapped(target.removeEventListener)) {
            this._unwrap(target, "removeEventListener");
          }
        });
      }
      this._unpatchHistoryApi();
    }
    /**
     * returns Zone
     */
    _getZoneWithPrototype() {
      const _window = window;
      return _window.Zone;
    }
  };

  // node_modules/@opentelemetry/instrumentation-xml-http-request/node_modules/@opentelemetry/core/build/esm/platform/browser/environment.js
  function getStringListFromEnv2(_2) {
    return void 0;
  }

  // node_modules/@opentelemetry/instrumentation-xml-http-request/node_modules/@opentelemetry/core/build/esm/platform/browser/index.js
  var otperformance2 = performance;

  // node_modules/@opentelemetry/instrumentation-xml-http-request/node_modules/@opentelemetry/core/build/esm/common/time.js
  var NANOSECOND_DIGITS2 = 9;
  var NANOSECOND_DIGITS_IN_MILLIS2 = 6;
  var MILLISECONDS_TO_NANOSECONDS2 = Math.pow(10, NANOSECOND_DIGITS_IN_MILLIS2);
  var SECOND_TO_NANOSECONDS2 = Math.pow(10, NANOSECOND_DIGITS2);
  function millisToHrTime2(epochMillis) {
    const epochSeconds = epochMillis / 1e3;
    const seconds = Math.trunc(epochSeconds);
    const nanos = Math.round(epochMillis % 1e3 * MILLISECONDS_TO_NANOSECONDS2);
    return [seconds, nanos];
  }
  function hrTime2(performanceNow) {
    const timeOrigin = millisToHrTime2(otperformance2.timeOrigin);
    const now = millisToHrTime2(typeof performanceNow === "number" ? performanceNow : otperformance2.now());
    return addHrTimes2(timeOrigin, now);
  }
  function timeInputToHrTime2(time) {
    if (isTimeInputHrTime2(time)) {
      return time;
    } else if (typeof time === "number") {
      if (time < otperformance2.timeOrigin) {
        return hrTime2(time);
      } else {
        return millisToHrTime2(time);
      }
    } else if (time instanceof Date) {
      return millisToHrTime2(time.getTime());
    } else {
      throw TypeError("Invalid input type");
    }
  }
  function hrTimeToNanoseconds2(time) {
    return time[0] * SECOND_TO_NANOSECONDS2 + time[1];
  }
  function isTimeInputHrTime2(value) {
    return Array.isArray(value) && value.length === 2 && typeof value[0] === "number" && typeof value[1] === "number";
  }
  function addHrTimes2(time1, time2) {
    const out = [time1[0] + time2[0], time1[1] + time2[1]];
    if (out[1] >= SECOND_TO_NANOSECONDS2) {
      out[1] -= SECOND_TO_NANOSECONDS2;
      out[0] += 1;
    }
    return out;
  }

  // node_modules/@opentelemetry/instrumentation-xml-http-request/node_modules/@opentelemetry/core/build/esm/utils/url.js
  function urlMatches2(url, urlToMatch) {
    if (typeof urlToMatch === "string") {
      return url === urlToMatch;
    } else {
      return !!url.match(urlToMatch);
    }
  }
  function isUrlIgnored2(url, ignoredUrls) {
    if (!ignoredUrls) {
      return false;
    }
    for (const ignoreUrl of ignoredUrls) {
      if (urlMatches2(url, ignoreUrl)) {
        return true;
      }
    }
    return false;
  }

  // node_modules/@opentelemetry/instrumentation-xml-http-request/node_modules/@opentelemetry/sdk-trace-web/build/esm/enums/PerformanceTimingNames.js
  var PerformanceTimingNames2;
  (function(PerformanceTimingNames3) {
    PerformanceTimingNames3["CONNECT_END"] = "connectEnd";
    PerformanceTimingNames3["CONNECT_START"] = "connectStart";
    PerformanceTimingNames3["DECODED_BODY_SIZE"] = "decodedBodySize";
    PerformanceTimingNames3["DOM_COMPLETE"] = "domComplete";
    PerformanceTimingNames3["DOM_CONTENT_LOADED_EVENT_END"] = "domContentLoadedEventEnd";
    PerformanceTimingNames3["DOM_CONTENT_LOADED_EVENT_START"] = "domContentLoadedEventStart";
    PerformanceTimingNames3["DOM_INTERACTIVE"] = "domInteractive";
    PerformanceTimingNames3["DOMAIN_LOOKUP_END"] = "domainLookupEnd";
    PerformanceTimingNames3["DOMAIN_LOOKUP_START"] = "domainLookupStart";
    PerformanceTimingNames3["ENCODED_BODY_SIZE"] = "encodedBodySize";
    PerformanceTimingNames3["FETCH_START"] = "fetchStart";
    PerformanceTimingNames3["LOAD_EVENT_END"] = "loadEventEnd";
    PerformanceTimingNames3["LOAD_EVENT_START"] = "loadEventStart";
    PerformanceTimingNames3["NAVIGATION_START"] = "navigationStart";
    PerformanceTimingNames3["REDIRECT_END"] = "redirectEnd";
    PerformanceTimingNames3["REDIRECT_START"] = "redirectStart";
    PerformanceTimingNames3["REQUEST_START"] = "requestStart";
    PerformanceTimingNames3["RESPONSE_END"] = "responseEnd";
    PerformanceTimingNames3["RESPONSE_START"] = "responseStart";
    PerformanceTimingNames3["SECURE_CONNECTION_START"] = "secureConnectionStart";
    PerformanceTimingNames3["START_TIME"] = "startTime";
    PerformanceTimingNames3["UNLOAD_EVENT_END"] = "unloadEventEnd";
    PerformanceTimingNames3["UNLOAD_EVENT_START"] = "unloadEventStart";
  })(PerformanceTimingNames2 || (PerformanceTimingNames2 = {}));

  // node_modules/@opentelemetry/instrumentation-xml-http-request/node_modules/@opentelemetry/sdk-trace-web/build/esm/semconv.js
  var ATTR_HTTP_RESPONSE_CONTENT_LENGTH2 = "http.response_content_length";
  var ATTR_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED2 = "http.response_content_length_uncompressed";

  // node_modules/@opentelemetry/instrumentation-xml-http-request/node_modules/@opentelemetry/sdk-trace-web/build/esm/utils.js
  var urlNormalizingAnchor2;
  function getUrlNormalizingAnchor2() {
    if (!urlNormalizingAnchor2) {
      urlNormalizingAnchor2 = document.createElement("a");
    }
    return urlNormalizingAnchor2;
  }
  function hasKey2(obj, key) {
    return key in obj;
  }
  function addSpanNetworkEvent2(span, performanceName, entries, ignoreZeros = true) {
    if (hasKey2(entries, performanceName) && typeof entries[performanceName] === "number" && !(ignoreZeros && entries[performanceName] === 0)) {
      return span.addEvent(performanceName, entries[performanceName]);
    }
    return void 0;
  }
  function addSpanNetworkEvents2(span, resource, ignoreNetworkEvents = false, ignoreZeros, skipOldSemconvContentLengthAttrs) {
    if (ignoreZeros === void 0) {
      ignoreZeros = resource[PerformanceTimingNames2.START_TIME] !== 0;
    }
    if (!ignoreNetworkEvents) {
      addSpanNetworkEvent2(span, PerformanceTimingNames2.FETCH_START, resource, ignoreZeros);
      addSpanNetworkEvent2(span, PerformanceTimingNames2.DOMAIN_LOOKUP_START, resource, ignoreZeros);
      addSpanNetworkEvent2(span, PerformanceTimingNames2.DOMAIN_LOOKUP_END, resource, ignoreZeros);
      addSpanNetworkEvent2(span, PerformanceTimingNames2.CONNECT_START, resource, ignoreZeros);
      addSpanNetworkEvent2(span, PerformanceTimingNames2.SECURE_CONNECTION_START, resource, ignoreZeros);
      addSpanNetworkEvent2(span, PerformanceTimingNames2.CONNECT_END, resource, ignoreZeros);
      addSpanNetworkEvent2(span, PerformanceTimingNames2.REQUEST_START, resource, ignoreZeros);
      addSpanNetworkEvent2(span, PerformanceTimingNames2.RESPONSE_START, resource, ignoreZeros);
      addSpanNetworkEvent2(span, PerformanceTimingNames2.RESPONSE_END, resource, ignoreZeros);
    }
    if (!skipOldSemconvContentLengthAttrs) {
      const encodedLength = resource[PerformanceTimingNames2.ENCODED_BODY_SIZE];
      if (encodedLength !== void 0) {
        span.setAttribute(ATTR_HTTP_RESPONSE_CONTENT_LENGTH2, encodedLength);
      }
      const decodedLength = resource[PerformanceTimingNames2.DECODED_BODY_SIZE];
      if (decodedLength !== void 0 && encodedLength !== decodedLength) {
        span.setAttribute(ATTR_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED2, decodedLength);
      }
    }
  }
  function sortResources2(filteredResources) {
    return filteredResources.slice().sort((a2, b2) => {
      const valueA = a2[PerformanceTimingNames2.FETCH_START];
      const valueB = b2[PerformanceTimingNames2.FETCH_START];
      if (valueA > valueB) {
        return 1;
      } else if (valueA < valueB) {
        return -1;
      }
      return 0;
    });
  }
  function getOrigin2() {
    return typeof location !== "undefined" ? location.origin : void 0;
  }
  function getResource2(spanUrl, startTimeHR, endTimeHR, resources, ignoredResources = /* @__PURE__ */ new WeakSet(), initiatorType) {
    const parsedSpanUrl = parseUrl2(spanUrl);
    spanUrl = parsedSpanUrl.toString();
    const filteredResources = filterResourcesForSpan2(spanUrl, startTimeHR, endTimeHR, resources, ignoredResources, initiatorType);
    if (filteredResources.length === 0) {
      return {
        mainRequest: void 0
      };
    }
    if (filteredResources.length === 1) {
      return {
        mainRequest: filteredResources[0]
      };
    }
    const sorted = sortResources2(filteredResources);
    if (parsedSpanUrl.origin !== getOrigin2() && sorted.length > 1) {
      let corsPreFlightRequest = sorted[0];
      let mainRequest = findMainRequest2(sorted, corsPreFlightRequest[PerformanceTimingNames2.RESPONSE_END], endTimeHR);
      const responseEnd = corsPreFlightRequest[PerformanceTimingNames2.RESPONSE_END];
      const fetchStart = mainRequest[PerformanceTimingNames2.FETCH_START];
      if (fetchStart < responseEnd) {
        mainRequest = corsPreFlightRequest;
        corsPreFlightRequest = void 0;
      }
      return {
        corsPreFlightRequest,
        mainRequest
      };
    } else {
      return {
        mainRequest: filteredResources[0]
      };
    }
  }
  function findMainRequest2(resources, corsPreFlightRequestEndTime, spanEndTimeHR) {
    const spanEndTime = hrTimeToNanoseconds2(spanEndTimeHR);
    const minTime = hrTimeToNanoseconds2(timeInputToHrTime2(corsPreFlightRequestEndTime));
    let mainRequest = resources[1];
    let bestGap;
    const length = resources.length;
    for (let i2 = 1; i2 < length; i2++) {
      const resource = resources[i2];
      const resourceStartTime = hrTimeToNanoseconds2(timeInputToHrTime2(resource[PerformanceTimingNames2.FETCH_START]));
      const resourceEndTime = hrTimeToNanoseconds2(timeInputToHrTime2(resource[PerformanceTimingNames2.RESPONSE_END]));
      const currentGap = spanEndTime - resourceEndTime;
      if (resourceStartTime >= minTime && (!bestGap || currentGap < bestGap)) {
        bestGap = currentGap;
        mainRequest = resource;
      }
    }
    return mainRequest;
  }
  function filterResourcesForSpan2(spanUrl, startTimeHR, endTimeHR, resources, ignoredResources, initiatorType) {
    const startTime = hrTimeToNanoseconds2(startTimeHR);
    const endTime = hrTimeToNanoseconds2(endTimeHR);
    let filteredResources = resources.filter((resource) => {
      const resourceStartTime = hrTimeToNanoseconds2(timeInputToHrTime2(resource[PerformanceTimingNames2.FETCH_START]));
      const resourceEndTime = hrTimeToNanoseconds2(timeInputToHrTime2(resource[PerformanceTimingNames2.RESPONSE_END]));
      return resource.initiatorType.toLowerCase() === (initiatorType || "xmlhttprequest") && resource.name === spanUrl && resourceStartTime >= startTime && resourceEndTime <= endTime;
    });
    if (filteredResources.length > 0) {
      filteredResources = filteredResources.filter((resource) => {
        return !ignoredResources.has(resource);
      });
    }
    return filteredResources;
  }
  function parseUrl2(url) {
    if (typeof URL === "function") {
      return new URL(url, typeof document !== "undefined" ? document.baseURI : typeof location !== "undefined" ? location.href : void 0);
    }
    const element = getUrlNormalizingAnchor2();
    element.href = url;
    return element;
  }
  function shouldPropagateTraceHeaders2(spanUrl, propagateTraceHeaderCorsUrls) {
    let propagateTraceHeaderUrls = propagateTraceHeaderCorsUrls || [];
    if (typeof propagateTraceHeaderUrls === "string" || propagateTraceHeaderUrls instanceof RegExp) {
      propagateTraceHeaderUrls = [propagateTraceHeaderUrls];
    }
    const parsedSpanUrl = parseUrl2(spanUrl);
    if (parsedSpanUrl.origin === getOrigin2()) {
      return true;
    } else {
      return propagateTraceHeaderUrls.some((propagateTraceHeaderUrl) => urlMatches2(spanUrl, propagateTraceHeaderUrl));
    }
  }

  // node_modules/@opentelemetry/instrumentation-xml-http-request/build/esm/semconv.js
  var ATTR_HTTP_HOST = "http.host";
  var ATTR_HTTP_METHOD = "http.method";
  var ATTR_HTTP_REQUEST_BODY_SIZE = "http.request.body.size";
  var ATTR_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = "http.request_content_length_uncompressed";
  var ATTR_HTTP_SCHEME = "http.scheme";
  var ATTR_HTTP_STATUS_CODE = "http.status_code";
  var ATTR_HTTP_URL2 = "http.url";
  var ATTR_HTTP_USER_AGENT2 = "http.user_agent";

  // node_modules/@opentelemetry/instrumentation-xml-http-request/build/esm/enums/EventNames.js
  var EventNames2;
  (function(EventNames3) {
    EventNames3["METHOD_OPEN"] = "open";
    EventNames3["METHOD_SEND"] = "send";
    EventNames3["EVENT_ABORT"] = "abort";
    EventNames3["EVENT_ERROR"] = "error";
    EventNames3["EVENT_LOAD"] = "loaded";
    EventNames3["EVENT_TIMEOUT"] = "timeout";
  })(EventNames2 || (EventNames2 = {}));

  // node_modules/@opentelemetry/instrumentation-xml-http-request/build/esm/utils.js
  var DIAG_LOGGER = diag2.createComponentLogger({
    namespace: "@opentelemetry/opentelemetry-instrumentation-xml-http-request/utils"
  });
  function isDocument(value) {
    return typeof Document !== "undefined" && value instanceof Document;
  }
  function getXHRBodyLength(body) {
    if (isDocument(body)) {
      return new XMLSerializer().serializeToString(document).length;
    }
    if (typeof body === "string") {
      return getByteLength(body);
    }
    if (body instanceof Blob) {
      return body.size;
    }
    if (body instanceof FormData) {
      return getFormDataSize(body);
    }
    if (body instanceof URLSearchParams) {
      return getByteLength(body.toString());
    }
    if (body.byteLength !== void 0) {
      return body.byteLength;
    }
    DIAG_LOGGER.warn("unknown body type");
    return void 0;
  }
  var TEXT_ENCODER = new TextEncoder();
  function getByteLength(s2) {
    return TEXT_ENCODER.encode(s2).byteLength;
  }
  function getFormDataSize(formData) {
    let size = 0;
    for (const [key, value] of formData.entries()) {
      size += key.length;
      if (value instanceof Blob) {
        size += value.size;
      } else {
        size += value.length;
      }
    }
    return size;
  }
  function normalizeHttpRequestMethod(method) {
    const knownMethods3 = getKnownMethods();
    const methUpper = method.toUpperCase();
    if (methUpper in knownMethods3) {
      return methUpper;
    } else {
      return "_OTHER";
    }
  }
  var DEFAULT_KNOWN_METHODS = {
    CONNECT: true,
    DELETE: true,
    GET: true,
    HEAD: true,
    OPTIONS: true,
    PATCH: true,
    POST: true,
    PUT: true,
    TRACE: true,
    // QUERY from https://datatracker.ietf.org/doc/draft-ietf-httpbis-safe-method-w-body/
    QUERY: true
  };
  var knownMethods;
  function getKnownMethods() {
    if (knownMethods === void 0) {
      const cfgMethods = getStringListFromEnv2("OTEL_INSTRUMENTATION_HTTP_KNOWN_METHODS");
      if (cfgMethods && cfgMethods.length > 0) {
        knownMethods = {};
        cfgMethods.forEach((m2) => {
          knownMethods[m2] = true;
        });
      } else {
        knownMethods = DEFAULT_KNOWN_METHODS;
      }
    }
    return knownMethods;
  }
  var HTTP_PORT_FROM_PROTOCOL = {
    "https:": "443",
    "http:": "80"
  };
  function serverPortFromUrl(url) {
    const serverPort = Number(url.port || HTTP_PORT_FROM_PROTOCOL[url.protocol]);
    if (serverPort && !isNaN(serverPort)) {
      return serverPort;
    } else {
      return void 0;
    }
  }

  // node_modules/@opentelemetry/instrumentation-xml-http-request/build/esm/version.js
  var VERSION4 = "0.211.0";

  // node_modules/@opentelemetry/instrumentation-xml-http-request/build/esm/enums/AttributeNames.js
  var AttributeNames3;
  (function(AttributeNames5) {
    AttributeNames5["HTTP_STATUS_TEXT"] = "http.status_text";
  })(AttributeNames3 || (AttributeNames3 = {}));

  // node_modules/@opentelemetry/instrumentation-xml-http-request/build/esm/xhr.js
  var OBSERVER_WAIT_TIME_MS = 300;
  var XMLHttpRequestInstrumentation = class extends InstrumentationBase {
    constructor(config = {}) {
      super("@opentelemetry/instrumentation-xml-http-request", VERSION4, config);
      __publicField(this, "component", "xml-http-request");
      __publicField(this, "version", VERSION4);
      __publicField(this, "moduleName", this.component);
      __publicField(this, "_tasksCount", 0);
      __publicField(this, "_xhrMem", /* @__PURE__ */ new WeakMap());
      __publicField(this, "_usedResources", /* @__PURE__ */ new WeakSet());
      __publicField(this, "_semconvStability");
      this._semconvStability = semconvStabilityFromStr("http", config == null ? void 0 : config.semconvStabilityOptIn);
    }
    init() {
    }
    /**
     * Adds custom headers to XMLHttpRequest
     * @param xhr
     * @param spanUrl
     * @private
     */
    _addHeaders(xhr, spanUrl) {
      const url = parseUrl2(spanUrl).href;
      if (!shouldPropagateTraceHeaders2(url, this.getConfig().propagateTraceHeaderCorsUrls)) {
        const headers2 = {};
        propagation.inject(context.active(), headers2);
        if (Object.keys(headers2).length > 0) {
          this._diag.debug("headers inject skipped due to CORS policy");
        }
        return;
      }
      const headers = {};
      propagation.inject(context.active(), headers);
      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, String(headers[key]));
      });
    }
    /**
     * Add cors pre flight child span
     * @param span
     * @param corsPreFlightRequest
     * @private
     */
    _addChildSpan(span, corsPreFlightRequest) {
      context.with(trace.setSpan(context.active(), span), () => {
        const childSpan = this.tracer.startSpan("CORS Preflight", {
          startTime: corsPreFlightRequest[PerformanceTimingNames2.FETCH_START]
        });
        const skipOldSemconvContentLengthAttrs = !(this._semconvStability & SemconvStability.OLD);
        addSpanNetworkEvents2(childSpan, corsPreFlightRequest, this.getConfig().ignoreNetworkEvents, void 0, skipOldSemconvContentLengthAttrs);
        childSpan.end(corsPreFlightRequest[PerformanceTimingNames2.RESPONSE_END]);
      });
    }
    /**
     * Add attributes when span is going to end
     * @param span
     * @param xhr
     * @param spanUrl
     * @private
     */
    _addFinalSpanAttributes(span, xhrMem, spanUrl) {
      if (this._semconvStability & SemconvStability.OLD) {
        if (xhrMem.status !== void 0) {
          span.setAttribute(ATTR_HTTP_STATUS_CODE, xhrMem.status);
        }
        if (xhrMem.statusText !== void 0) {
          span.setAttribute(AttributeNames3.HTTP_STATUS_TEXT, xhrMem.statusText);
        }
        if (typeof spanUrl === "string") {
          const parsedUrl = parseUrl2(spanUrl);
          span.setAttribute(ATTR_HTTP_HOST, parsedUrl.host);
          span.setAttribute(ATTR_HTTP_SCHEME, parsedUrl.protocol.replace(":", ""));
        }
        span.setAttribute(ATTR_HTTP_USER_AGENT2, navigator.userAgent);
      }
      if (this._semconvStability & SemconvStability.STABLE) {
        if (xhrMem.status) {
          span.setAttribute(ATTR_HTTP_RESPONSE_STATUS_CODE, xhrMem.status);
        }
      }
    }
    _applyAttributesAfterXHR(span, xhr) {
      const applyCustomAttributesOnSpan = this.getConfig().applyCustomAttributesOnSpan;
      if (typeof applyCustomAttributesOnSpan === "function") {
        safeExecuteInTheMiddle(() => applyCustomAttributesOnSpan(span, xhr), (error) => {
          if (!error) {
            return;
          }
          this._diag.error("applyCustomAttributesOnSpan", error);
        }, true);
      }
    }
    /**
     * will collect information about all resources created
     * between "send" and "end" with additional waiting for main resource
     * @param xhr
     * @param spanUrl
     * @private
     */
    _addResourceObserver(xhr, spanUrl) {
      const xhrMem = this._xhrMem.get(xhr);
      if (!xhrMem || typeof PerformanceObserver !== "function" || typeof PerformanceResourceTiming !== "function") {
        return;
      }
      xhrMem.createdResources = {
        observer: new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const parsedUrl = parseUrl2(spanUrl);
          entries.forEach((entry) => {
            if (entry.initiatorType === "xmlhttprequest" && entry.name === parsedUrl.href) {
              if (xhrMem.createdResources) {
                xhrMem.createdResources.entries.push(entry);
              }
            }
          });
        }),
        entries: []
      };
      xhrMem.createdResources.observer.observe({
        entryTypes: ["resource"]
      });
    }
    /**
     * Clears the resource timings and all resources assigned with spans
     *     when {@link XMLHttpRequestInstrumentationConfig.clearTimingResources} is
     *     set to true (default false)
     * @private
     */
    _clearResources() {
      if (this._tasksCount === 0 && this.getConfig().clearTimingResources) {
        otperformance2.clearResourceTimings();
        this._xhrMem = /* @__PURE__ */ new WeakMap();
        this._usedResources = /* @__PURE__ */ new WeakSet();
      }
    }
    /**
     * Finds appropriate resource and add network events to the span
     * @param span
     */
    _findResourceAndAddNetworkEvents(xhrMem, span, spanUrl, startTime, endTime) {
      if (!spanUrl || !startTime || !endTime || !xhrMem.createdResources) {
        return;
      }
      let resources = xhrMem.createdResources.entries;
      if (!resources || !resources.length) {
        resources = otperformance2.getEntriesByType("resource");
      }
      const resource = getResource2(parseUrl2(spanUrl).href, startTime, endTime, resources, this._usedResources);
      if (resource.mainRequest) {
        const mainRequest = resource.mainRequest;
        this._markResourceAsUsed(mainRequest);
        const corsPreFlightRequest = resource.corsPreFlightRequest;
        if (corsPreFlightRequest) {
          this._addChildSpan(span, corsPreFlightRequest);
          this._markResourceAsUsed(corsPreFlightRequest);
        }
        const skipOldSemconvContentLengthAttrs = !(this._semconvStability & SemconvStability.OLD);
        addSpanNetworkEvents2(span, mainRequest, this.getConfig().ignoreNetworkEvents, void 0, skipOldSemconvContentLengthAttrs);
      }
    }
    /**
     * Removes the previous information about span.
     * This might happened when the same xhr is used again.
     * @param xhr
     * @private
     */
    _cleanPreviousSpanInformation(xhr) {
      const xhrMem = this._xhrMem.get(xhr);
      if (xhrMem) {
        const callbackToRemoveEvents = xhrMem.callbackToRemoveEvents;
        if (callbackToRemoveEvents) {
          callbackToRemoveEvents();
        }
        this._xhrMem.delete(xhr);
      }
    }
    /**
     * Creates a new span when method "open" is called
     * @param xhr
     * @param url
     * @param method
     * @private
     */
    _createSpan(xhr, url, method) {
      if (isUrlIgnored2(url, this.getConfig().ignoreUrls)) {
        this._diag.debug("ignoring span as url matches ignored url");
        return;
      }
      let name = "";
      const parsedUrl = parseUrl2(url);
      const attributes = {};
      if (this._semconvStability & SemconvStability.OLD) {
        name = method.toUpperCase();
        attributes[ATTR_HTTP_METHOD] = method;
        attributes[ATTR_HTTP_URL2] = parsedUrl.toString();
      }
      if (this._semconvStability & SemconvStability.STABLE) {
        const origMethod = method;
        const normMethod = normalizeHttpRequestMethod(method);
        if (!name) {
          name = normMethod;
        }
        attributes[ATTR_HTTP_REQUEST_METHOD] = normMethod;
        if (normMethod !== origMethod) {
          attributes[ATTR_HTTP_REQUEST_METHOD_ORIGINAL] = origMethod;
        }
        attributes[ATTR_URL_FULL] = parsedUrl.toString();
        attributes[ATTR_SERVER_ADDRESS] = parsedUrl.hostname;
        const serverPort = serverPortFromUrl(parsedUrl);
        if (serverPort) {
          attributes[ATTR_SERVER_PORT] = serverPort;
        }
      }
      const currentSpan = this.tracer.startSpan(name, {
        kind: SpanKind.CLIENT,
        attributes
      });
      currentSpan.addEvent(EventNames2.METHOD_OPEN);
      this._cleanPreviousSpanInformation(xhr);
      this._xhrMem.set(xhr, {
        span: currentSpan,
        spanUrl: url
      });
      return currentSpan;
    }
    /**
     * Marks certain [resource]{@link PerformanceResourceTiming} when information
     * from this is used to add events to span.
     * This is done to avoid reusing the same resource again for next span
     * @param resource
     * @private
     */
    _markResourceAsUsed(resource) {
      this._usedResources.add(resource);
    }
    /**
     * Patches the method open
     * @private
     */
    _patchOpen() {
      return (original) => {
        const plugin = this;
        return function patchOpen(...args) {
          const method = args[0];
          const url = args[1];
          plugin._createSpan(this, url, method);
          return original.apply(this, args);
        };
      };
    }
    /**
     * Patches the method send
     * @private
     */
    _patchSend() {
      const plugin = this;
      function endSpanTimeout(eventName, xhrMem, performanceEndTime, endTime) {
        const callbackToRemoveEvents = xhrMem.callbackToRemoveEvents;
        if (typeof callbackToRemoveEvents === "function") {
          callbackToRemoveEvents();
        }
        const { span, spanUrl, sendStartTime } = xhrMem;
        if (span) {
          plugin._findResourceAndAddNetworkEvents(xhrMem, span, spanUrl, sendStartTime, performanceEndTime);
          span.addEvent(eventName, endTime);
          plugin._addFinalSpanAttributes(span, xhrMem, spanUrl);
          span.end(endTime);
          plugin._tasksCount--;
        }
        plugin._clearResources();
      }
      function endSpan(eventName, xhr, isError, errorType) {
        const xhrMem = plugin._xhrMem.get(xhr);
        if (!xhrMem) {
          return;
        }
        xhrMem.status = xhr.status;
        xhrMem.statusText = xhr.statusText;
        plugin._xhrMem.delete(xhr);
        if (xhrMem.span) {
          const span = xhrMem.span;
          plugin._applyAttributesAfterXHR(span, xhr);
          if (plugin._semconvStability & SemconvStability.STABLE) {
            if (isError) {
              if (errorType) {
                span.setStatus({
                  code: SpanStatusCode.ERROR,
                  message: errorType
                });
                span.setAttribute(ATTR_ERROR_TYPE, errorType);
              }
            } else if (xhrMem.status && xhrMem.status >= 400) {
              span.setStatus({ code: SpanStatusCode.ERROR });
              span.setAttribute(ATTR_ERROR_TYPE, String(xhrMem.status));
            }
          }
        }
        const performanceEndTime = hrTime2();
        const endTime = Date.now();
        setTimeout(() => {
          endSpanTimeout(eventName, xhrMem, performanceEndTime, endTime);
        }, OBSERVER_WAIT_TIME_MS);
      }
      function onError() {
        endSpan(EventNames2.EVENT_ERROR, this, true, "error");
      }
      function onAbort() {
        endSpan(EventNames2.EVENT_ABORT, this, false);
      }
      function onTimeout() {
        endSpan(EventNames2.EVENT_TIMEOUT, this, true, "timeout");
      }
      function onLoad() {
        if (this.status < 299) {
          endSpan(EventNames2.EVENT_LOAD, this, false);
        } else {
          endSpan(EventNames2.EVENT_ERROR, this, false);
        }
      }
      function unregister(xhr) {
        xhr.removeEventListener("abort", onAbort);
        xhr.removeEventListener("error", onError);
        xhr.removeEventListener("load", onLoad);
        xhr.removeEventListener("timeout", onTimeout);
        const xhrMem = plugin._xhrMem.get(xhr);
        if (xhrMem) {
          xhrMem.callbackToRemoveEvents = void 0;
        }
      }
      return (original) => {
        return function patchSend(...args) {
          const xhrMem = plugin._xhrMem.get(this);
          if (!xhrMem) {
            return original.apply(this, args);
          }
          const currentSpan = xhrMem.span;
          const spanUrl = xhrMem.spanUrl;
          if (currentSpan && spanUrl) {
            if (plugin.getConfig().measureRequestSize && (args == null ? void 0 : args[0])) {
              const body = args[0];
              const bodyLength = getXHRBodyLength(body);
              if (bodyLength !== void 0) {
                if (plugin._semconvStability & SemconvStability.OLD) {
                  currentSpan.setAttribute(ATTR_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED, bodyLength);
                }
                if (plugin._semconvStability & SemconvStability.STABLE) {
                  currentSpan.setAttribute(ATTR_HTTP_REQUEST_BODY_SIZE, bodyLength);
                }
              }
            }
            context.with(trace.setSpan(context.active(), currentSpan), () => {
              plugin._tasksCount++;
              xhrMem.sendStartTime = hrTime2();
              currentSpan.addEvent(EventNames2.METHOD_SEND);
              this.addEventListener("abort", onAbort);
              this.addEventListener("error", onError);
              this.addEventListener("load", onLoad);
              this.addEventListener("timeout", onTimeout);
              xhrMem.callbackToRemoveEvents = () => {
                unregister(this);
                if (xhrMem.createdResources) {
                  xhrMem.createdResources.observer.disconnect();
                }
              };
              plugin._addHeaders(this, spanUrl);
              plugin._addResourceObserver(this, spanUrl);
            });
          }
          return original.apply(this, args);
        };
      };
    }
    /**
     * implements enable function
     */
    enable() {
      this._diag.debug("applying patch to", this.moduleName, this.version);
      if (isWrapped(XMLHttpRequest.prototype.open)) {
        this._unwrap(XMLHttpRequest.prototype, "open");
        this._diag.debug("removing previous patch from method open");
      }
      if (isWrapped(XMLHttpRequest.prototype.send)) {
        this._unwrap(XMLHttpRequest.prototype, "send");
        this._diag.debug("removing previous patch from method send");
      }
      this._wrap(XMLHttpRequest.prototype, "open", this._patchOpen());
      this._wrap(XMLHttpRequest.prototype, "send", this._patchSend());
    }
    /**
     * implements disable function
     */
    disable() {
      this._diag.debug("removing patch from", this.moduleName, this.version);
      this._unwrap(XMLHttpRequest.prototype, "open");
      this._unwrap(XMLHttpRequest.prototype, "send");
      this._tasksCount = 0;
      this._xhrMem = /* @__PURE__ */ new WeakMap();
      this._usedResources = /* @__PURE__ */ new WeakSet();
    }
  };

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/OTLPExporterBase.js
  var OTLPExporterBase = class {
    constructor(delegate) {
      __publicField(this, "_delegate");
      this._delegate = delegate;
    }
    /**
     * Export items.
     * @param items
     * @param resultCallback
     */
    export(items, resultCallback) {
      this._delegate.export(items, resultCallback);
    }
    forceFlush() {
      return this._delegate.forceFlush();
    }
    shutdown() {
      return this._delegate.shutdown();
    }
  };

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/types.js
  var OTLPExporterError = class extends Error {
    constructor(message, code, data) {
      super(message);
      __publicField(this, "code");
      __publicField(this, "name", "OTLPExporterError");
      __publicField(this, "data");
      this.data = data;
      this.code = code;
    }
  };

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/shared-configuration.js
  function validateTimeoutMillis(timeoutMillis) {
    if (Number.isFinite(timeoutMillis) && timeoutMillis > 0) {
      return timeoutMillis;
    }
    throw new Error(`Configuration: timeoutMillis is invalid, expected number greater than 0 (actual: '${timeoutMillis}')`);
  }
  function wrapStaticHeadersInFunction(headers) {
    if (headers == null) {
      return void 0;
    }
    return async () => headers;
  }
  function mergeOtlpSharedConfigurationWithDefaults(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration) {
    var _a, _b, _c, _d, _e, _f;
    return {
      timeoutMillis: validateTimeoutMillis((_b = (_a = userProvidedConfiguration.timeoutMillis) != null ? _a : fallbackConfiguration.timeoutMillis) != null ? _b : defaultConfiguration.timeoutMillis),
      concurrencyLimit: (_d = (_c = userProvidedConfiguration.concurrencyLimit) != null ? _c : fallbackConfiguration.concurrencyLimit) != null ? _d : defaultConfiguration.concurrencyLimit,
      compression: (_f = (_e = userProvidedConfiguration.compression) != null ? _e : fallbackConfiguration.compression) != null ? _f : defaultConfiguration.compression
    };
  }
  function getSharedConfigurationDefaults() {
    return {
      timeoutMillis: 1e4,
      concurrencyLimit: 30,
      compression: "none"
    };
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/bounded-queue-export-promise-handler.js
  var BoundedQueueExportPromiseHandler = class {
    /**
     * @param concurrencyLimit maximum promises allowed in a queue at the same time.
     */
    constructor(concurrencyLimit) {
      __publicField(this, "_concurrencyLimit");
      __publicField(this, "_sendingPromises", []);
      this._concurrencyLimit = concurrencyLimit;
    }
    pushPromise(promise) {
      if (this.hasReachedLimit()) {
        throw new Error("Concurrency Limit reached");
      }
      this._sendingPromises.push(promise);
      const popPromise = () => {
        const index = this._sendingPromises.indexOf(promise);
        void this._sendingPromises.splice(index, 1);
      };
      promise.then(popPromise, popPromise);
    }
    hasReachedLimit() {
      return this._sendingPromises.length >= this._concurrencyLimit;
    }
    async awaitAll() {
      await Promise.all(this._sendingPromises);
    }
  };
  function createBoundedQueueExportPromiseHandler(options) {
    return new BoundedQueueExportPromiseHandler(options.concurrencyLimit);
  }

  // node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/esm/ExportResult.js
  var ExportResultCode2;
  (function(ExportResultCode3) {
    ExportResultCode3[ExportResultCode3["SUCCESS"] = 0] = "SUCCESS";
    ExportResultCode3[ExportResultCode3["FAILED"] = 1] = "FAILED";
  })(ExportResultCode2 || (ExportResultCode2 = {}));

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/logging-response-handler.js
  function isPartialSuccessResponse(response) {
    return Object.prototype.hasOwnProperty.call(response, "partialSuccess");
  }
  function createLoggingPartialSuccessResponseHandler() {
    return {
      handleResponse(response) {
        if (response == null || !isPartialSuccessResponse(response) || response.partialSuccess == null || Object.keys(response.partialSuccess).length === 0) {
          return;
        }
        diag2.warn("Received Partial Success response:", JSON.stringify(response.partialSuccess));
      }
    };
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/otlp-export-delegate.js
  var OTLPExportDelegate = class {
    constructor(transport, serializer, responseHandler, promiseQueue, timeout) {
      __publicField(this, "_diagLogger");
      __publicField(this, "_transport");
      __publicField(this, "_serializer");
      __publicField(this, "_responseHandler");
      __publicField(this, "_promiseQueue");
      __publicField(this, "_timeout");
      this._transport = transport;
      this._serializer = serializer;
      this._responseHandler = responseHandler;
      this._promiseQueue = promiseQueue;
      this._timeout = timeout;
      this._diagLogger = diag2.createComponentLogger({
        namespace: "OTLPExportDelegate"
      });
    }
    export(internalRepresentation, resultCallback) {
      this._diagLogger.debug("items to be sent", internalRepresentation);
      if (this._promiseQueue.hasReachedLimit()) {
        resultCallback({
          code: ExportResultCode2.FAILED,
          error: new Error("Concurrent export limit reached")
        });
        return;
      }
      const serializedRequest = this._serializer.serializeRequest(internalRepresentation);
      if (serializedRequest == null) {
        resultCallback({
          code: ExportResultCode2.FAILED,
          error: new Error("Nothing to send")
        });
        return;
      }
      this._promiseQueue.pushPromise(this._transport.send(serializedRequest, this._timeout).then((response) => {
        var _a;
        if (response.status === "success") {
          if (response.data != null) {
            try {
              this._responseHandler.handleResponse(this._serializer.deserializeResponse(response.data));
            } catch (e2) {
              this._diagLogger.warn("Export succeeded but could not deserialize response - is the response specification compliant?", e2, response.data);
            }
          }
          resultCallback({
            code: ExportResultCode2.SUCCESS
          });
          return;
        } else if (response.status === "failure" && response.error) {
          resultCallback({
            code: ExportResultCode2.FAILED,
            error: response.error
          });
          return;
        } else if (response.status === "retryable") {
          resultCallback({
            code: ExportResultCode2.FAILED,
            error: (_a = response.error) != null ? _a : new OTLPExporterError("Export failed with retryable status")
          });
        } else {
          resultCallback({
            code: ExportResultCode2.FAILED,
            error: new OTLPExporterError("Export failed with unknown error")
          });
        }
      }, (reason) => resultCallback({
        code: ExportResultCode2.FAILED,
        error: reason
      })));
    }
    forceFlush() {
      return this._promiseQueue.awaitAll();
    }
    async shutdown() {
      this._diagLogger.debug("shutdown started");
      await this.forceFlush();
      this._transport.shutdown();
    }
  };
  function createOtlpExportDelegate(components, settings) {
    return new OTLPExportDelegate(components.transport, components.serializer, createLoggingPartialSuccessResponseHandler(), components.promiseHandler, settings.timeout);
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/otlp-network-export-delegate.js
  function createOtlpNetworkExportDelegate(options, serializer, transport) {
    return createOtlpExportDelegate({
      transport,
      serializer,
      promiseHandler: createBoundedQueueExportPromiseHandler(options)
    }, { timeout: options.timeoutMillis });
  }

  // node_modules/@opentelemetry/otlp-transformer/node_modules/@opentelemetry/core/build/esm/common/time.js
  var NANOSECOND_DIGITS3 = 9;
  var NANOSECOND_DIGITS_IN_MILLIS3 = 6;
  var MILLISECONDS_TO_NANOSECONDS3 = Math.pow(10, NANOSECOND_DIGITS_IN_MILLIS3);
  var SECOND_TO_NANOSECONDS3 = Math.pow(10, NANOSECOND_DIGITS3);
  function hrTimeToNanoseconds3(time) {
    return time[0] * SECOND_TO_NANOSECONDS3 + time[1];
  }

  // node_modules/@opentelemetry/otlp-transformer/build/esm/common/hex-to-binary.js
  function intValue(charCode) {
    if (charCode >= 48 && charCode <= 57) {
      return charCode - 48;
    }
    if (charCode >= 97 && charCode <= 102) {
      return charCode - 87;
    }
    return charCode - 55;
  }
  function hexToBinary(hexStr) {
    const buf = new Uint8Array(hexStr.length / 2);
    let offset = 0;
    for (let i2 = 0; i2 < hexStr.length; i2 += 2) {
      const hi = intValue(hexStr.charCodeAt(i2));
      const lo = intValue(hexStr.charCodeAt(i2 + 1));
      buf[offset++] = hi << 4 | lo;
    }
    return buf;
  }

  // node_modules/@opentelemetry/otlp-transformer/build/esm/common/utils.js
  function hrTimeToNanos(hrTime4) {
    const NANOSECONDS = BigInt(1e9);
    return BigInt(Math.trunc(hrTime4[0])) * NANOSECONDS + BigInt(Math.trunc(hrTime4[1]));
  }
  function toLongBits(value) {
    const low = Number(BigInt.asUintN(32, value));
    const high = Number(BigInt.asUintN(32, value >> BigInt(32)));
    return { low, high };
  }
  function encodeAsLongBits(hrTime4) {
    const nanos = hrTimeToNanos(hrTime4);
    return toLongBits(nanos);
  }
  function encodeAsString(hrTime4) {
    const nanos = hrTimeToNanos(hrTime4);
    return nanos.toString();
  }
  var encodeTimestamp = typeof BigInt !== "undefined" ? encodeAsString : hrTimeToNanoseconds3;
  function identity(value) {
    return value;
  }
  function optionalHexToBinary(str) {
    if (str === void 0)
      return void 0;
    return hexToBinary(str);
  }
  var DEFAULT_ENCODER = {
    encodeHrTime: encodeAsLongBits,
    encodeSpanContext: hexToBinary,
    encodeOptionalSpanContext: optionalHexToBinary
  };
  function getOtlpEncoder(options) {
    var _a, _b;
    if (options === void 0) {
      return DEFAULT_ENCODER;
    }
    const useLongBits = (_a = options.useLongBits) != null ? _a : true;
    const useHex = (_b = options.useHex) != null ? _b : false;
    return {
      encodeHrTime: useLongBits ? encodeAsLongBits : encodeTimestamp,
      encodeSpanContext: useHex ? identity : hexToBinary,
      encodeOptionalSpanContext: useHex ? identity : optionalHexToBinary
    };
  }

  // node_modules/@opentelemetry/otlp-transformer/build/esm/common/internal.js
  function createResource(resource) {
    const result = {
      attributes: toAttributes(resource.attributes),
      droppedAttributesCount: 0
    };
    const schemaUrl = resource.schemaUrl;
    if (schemaUrl && schemaUrl !== "")
      result.schemaUrl = schemaUrl;
    return result;
  }
  function createInstrumentationScope(scope) {
    return {
      name: scope.name,
      version: scope.version
    };
  }
  function toAttributes(attributes) {
    return Object.keys(attributes).map((key) => toKeyValue(key, attributes[key]));
  }
  function toKeyValue(key, value) {
    return {
      key,
      value: toAnyValue(value)
    };
  }
  function toAnyValue(value) {
    const t2 = typeof value;
    if (t2 === "string")
      return { stringValue: value };
    if (t2 === "number") {
      if (!Number.isInteger(value))
        return { doubleValue: value };
      return { intValue: value };
    }
    if (t2 === "boolean")
      return { boolValue: value };
    if (value instanceof Uint8Array)
      return { bytesValue: value };
    if (Array.isArray(value))
      return { arrayValue: { values: value.map(toAnyValue) } };
    if (t2 === "object" && value != null)
      return {
        kvlistValue: {
          values: Object.entries(value).map(([k2, v2]) => toKeyValue(k2, v2))
        }
      };
    return {};
  }

  // node_modules/@opentelemetry/otlp-transformer/build/esm/trace/internal.js
  var SPAN_FLAGS_CONTEXT_HAS_IS_REMOTE_MASK = 256;
  var SPAN_FLAGS_CONTEXT_IS_REMOTE_MASK = 512;
  function buildSpanFlagsFrom(traceFlags, isRemote) {
    let flags = traceFlags & 255 | SPAN_FLAGS_CONTEXT_HAS_IS_REMOTE_MASK;
    if (isRemote) {
      flags |= SPAN_FLAGS_CONTEXT_IS_REMOTE_MASK;
    }
    return flags;
  }
  function sdkSpanToOtlpSpan(span, encoder) {
    var _a, _b, _c, _d;
    const ctx = span.spanContext();
    const status = span.status;
    const parentSpanId = ((_a = span.parentSpanContext) == null ? void 0 : _a.spanId) ? encoder.encodeSpanContext((_b = span.parentSpanContext) == null ? void 0 : _b.spanId) : void 0;
    return {
      traceId: encoder.encodeSpanContext(ctx.traceId),
      spanId: encoder.encodeSpanContext(ctx.spanId),
      parentSpanId,
      traceState: (_c = ctx.traceState) == null ? void 0 : _c.serialize(),
      name: span.name,
      // Span kind is offset by 1 because the API does not define a value for unset
      kind: span.kind == null ? 0 : span.kind + 1,
      startTimeUnixNano: encoder.encodeHrTime(span.startTime),
      endTimeUnixNano: encoder.encodeHrTime(span.endTime),
      attributes: toAttributes(span.attributes),
      droppedAttributesCount: span.droppedAttributesCount,
      events: span.events.map((event) => toOtlpSpanEvent(event, encoder)),
      droppedEventsCount: span.droppedEventsCount,
      status: {
        // API and proto enums share the same values
        code: status.code,
        message: status.message
      },
      links: span.links.map((link) => toOtlpLink(link, encoder)),
      droppedLinksCount: span.droppedLinksCount,
      flags: buildSpanFlagsFrom(ctx.traceFlags, (_d = span.parentSpanContext) == null ? void 0 : _d.isRemote)
    };
  }
  function toOtlpLink(link, encoder) {
    var _a;
    return {
      attributes: link.attributes ? toAttributes(link.attributes) : [],
      spanId: encoder.encodeSpanContext(link.context.spanId),
      traceId: encoder.encodeSpanContext(link.context.traceId),
      traceState: (_a = link.context.traceState) == null ? void 0 : _a.serialize(),
      droppedAttributesCount: link.droppedAttributesCount || 0,
      flags: buildSpanFlagsFrom(link.context.traceFlags, link.context.isRemote)
    };
  }
  function toOtlpSpanEvent(timedEvent, encoder) {
    return {
      attributes: timedEvent.attributes ? toAttributes(timedEvent.attributes) : [],
      name: timedEvent.name,
      timeUnixNano: encoder.encodeHrTime(timedEvent.time),
      droppedAttributesCount: timedEvent.droppedAttributesCount || 0
    };
  }
  function createExportTraceServiceRequest(spans, options) {
    const encoder = getOtlpEncoder(options);
    return {
      resourceSpans: spanRecordsToResourceSpans(spans, encoder)
    };
  }
  function createResourceMap(readableSpans) {
    const resourceMap = /* @__PURE__ */ new Map();
    for (const record of readableSpans) {
      let ilsMap = resourceMap.get(record.resource);
      if (!ilsMap) {
        ilsMap = /* @__PURE__ */ new Map();
        resourceMap.set(record.resource, ilsMap);
      }
      const instrumentationScopeKey = `${record.instrumentationScope.name}@${record.instrumentationScope.version || ""}:${record.instrumentationScope.schemaUrl || ""}`;
      let records = ilsMap.get(instrumentationScopeKey);
      if (!records) {
        records = [];
        ilsMap.set(instrumentationScopeKey, records);
      }
      records.push(record);
    }
    return resourceMap;
  }
  function spanRecordsToResourceSpans(readableSpans, encoder) {
    const resourceMap = createResourceMap(readableSpans);
    const out = [];
    const entryIterator = resourceMap.entries();
    let entry = entryIterator.next();
    while (!entry.done) {
      const [resource, ilmMap] = entry.value;
      const scopeResourceSpans = [];
      const ilmIterator = ilmMap.values();
      let ilmEntry = ilmIterator.next();
      while (!ilmEntry.done) {
        const scopeSpans = ilmEntry.value;
        if (scopeSpans.length > 0) {
          const spans = scopeSpans.map((readableSpan) => sdkSpanToOtlpSpan(readableSpan, encoder));
          scopeResourceSpans.push({
            scope: createInstrumentationScope(scopeSpans[0].instrumentationScope),
            spans,
            schemaUrl: scopeSpans[0].instrumentationScope.schemaUrl
          });
        }
        ilmEntry = ilmIterator.next();
      }
      const processedResource = createResource(resource);
      const transformedSpans = {
        resource: processedResource,
        scopeSpans: scopeResourceSpans,
        schemaUrl: processedResource.schemaUrl
      };
      out.push(transformedSpans);
      entry = entryIterator.next();
    }
    return out;
  }

  // node_modules/@opentelemetry/otlp-transformer/build/esm/trace/json/trace.js
  var JsonTraceSerializer = {
    serializeRequest: (arg) => {
      const request = createExportTraceServiceRequest(arg, {
        useHex: true,
        useLongBits: false
      });
      const encoder = new TextEncoder();
      return encoder.encode(JSON.stringify(request));
    },
    deserializeResponse: (arg) => {
      if (arg.length === 0) {
        return {};
      }
      const decoder = new TextDecoder();
      return JSON.parse(decoder.decode(arg));
    }
  };

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/retrying-transport.js
  var MAX_ATTEMPTS = 5;
  var INITIAL_BACKOFF = 1e3;
  var MAX_BACKOFF = 5e3;
  var BACKOFF_MULTIPLIER = 1.5;
  var JITTER = 0.2;
  function getJitter() {
    return Math.random() * (2 * JITTER) - JITTER;
  }
  var RetryingTransport = class {
    constructor(transport) {
      __publicField(this, "_transport");
      this._transport = transport;
    }
    retry(data, timeoutMillis, inMillis) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this._transport.send(data, timeoutMillis).then(resolve, reject);
        }, inMillis);
      });
    }
    async send(data, timeoutMillis) {
      var _a;
      let attempts = MAX_ATTEMPTS;
      let nextBackoff = INITIAL_BACKOFF;
      const deadline = Date.now() + timeoutMillis;
      let result = await this._transport.send(data, timeoutMillis);
      while (result.status === "retryable" && attempts > 0) {
        attempts--;
        const backoff = Math.max(Math.min(nextBackoff * (1 + getJitter()), MAX_BACKOFF), 0);
        nextBackoff = nextBackoff * BACKOFF_MULTIPLIER;
        const retryInMillis = (_a = result.retryInMillis) != null ? _a : backoff;
        const remainingTimeoutMillis = deadline - Date.now();
        if (retryInMillis > remainingTimeoutMillis) {
          diag2.info(`Export retry time ${Math.round(retryInMillis)}ms exceeds remaining timeout ${Math.round(remainingTimeoutMillis)}ms, not retrying further.`);
          return result;
        }
        diag2.verbose(`Scheduling export retry in ${Math.round(retryInMillis)}ms`);
        result = await this.retry(data, remainingTimeoutMillis, retryInMillis);
      }
      if (result.status === "success") {
        diag2.verbose(`Export succeeded after ${MAX_ATTEMPTS - attempts} retry attempts.`);
      } else if (result.status === "retryable") {
        diag2.info(`Export failed after maximum retry attempts (${MAX_ATTEMPTS}).`);
      } else {
        diag2.info(`Export failed with non-retryable error: ${result.error}`);
      }
      return result;
    }
    shutdown() {
      return this._transport.shutdown();
    }
  };
  function createRetryingTransport(options) {
    return new RetryingTransport(options.transport);
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/transport/send-beacon-transport.js
  var SendBeaconTransport = class {
    constructor(params) {
      __publicField(this, "_params");
      this._params = params;
    }
    async send(data) {
      const blobType = (await this._params.headers())["Content-Type"];
      return new Promise((resolve) => {
        if (navigator.sendBeacon(this._params.url, new Blob([data], { type: blobType }))) {
          diag2.debug("SendBeacon success");
          resolve({
            status: "success"
          });
        } else {
          resolve({
            status: "failure",
            error: new Error("SendBeacon failed")
          });
        }
      });
    }
    shutdown() {
    }
  };
  function createSendBeaconTransport(parameters) {
    return new SendBeaconTransport(parameters);
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/is-export-retryable.js
  function isExportHTTPErrorRetryable(statusCode) {
    return statusCode === 429 || statusCode === 502 || statusCode === 503 || statusCode === 504;
  }
  function parseRetryAfterToMills(retryAfter) {
    if (retryAfter == null) {
      return void 0;
    }
    const seconds = Number.parseInt(retryAfter, 10);
    if (Number.isInteger(seconds)) {
      return seconds > 0 ? seconds * 1e3 : -1;
    }
    const delay = new Date(retryAfter).getTime() - Date.now();
    if (delay >= 0) {
      return delay;
    }
    return 0;
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/transport/fetch-transport.js
  var FetchTransport = class {
    constructor(parameters) {
      __publicField(this, "_parameters");
      this._parameters = parameters;
    }
    async send(data, timeoutMillis) {
      var _a;
      const abortController = new AbortController();
      const timeout = setTimeout(() => abortController.abort(), timeoutMillis);
      try {
        const isBrowserEnvironment = !!globalThis.location;
        const url = new URL(this._parameters.url);
        const response = await fetch(url.href, {
          method: "POST",
          headers: await this._parameters.headers(),
          body: data,
          signal: abortController.signal,
          keepalive: isBrowserEnvironment,
          mode: isBrowserEnvironment ? ((_a = globalThis.location) == null ? void 0 : _a.origin) === url.origin ? "same-origin" : "cors" : "no-cors"
        });
        if (response.status >= 200 && response.status <= 299) {
          diag2.debug("response success");
          return { status: "success" };
        } else if (isExportHTTPErrorRetryable(response.status)) {
          const retryAfter = response.headers.get("Retry-After");
          const retryInMillis = parseRetryAfterToMills(retryAfter);
          return { status: "retryable", retryInMillis };
        }
        return {
          status: "failure",
          error: new Error("Fetch request failed with non-retryable status")
        };
      } catch (error) {
        if (isFetchNetworkErrorRetryable(error)) {
          return {
            status: "retryable",
            error: new Error("Fetch request encountered a network error", {
              cause: error
            })
          };
        }
        return {
          status: "failure",
          error: new Error("Fetch request errored", { cause: error })
        };
      } finally {
        clearTimeout(timeout);
      }
    }
    shutdown() {
    }
  };
  function createFetchTransport(parameters) {
    return new FetchTransport(parameters);
  }
  function isFetchNetworkErrorRetryable(error) {
    return error instanceof TypeError && !error.cause;
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/otlp-browser-http-export-delegate.js
  function createOtlpFetchExportDelegate(options, serializer) {
    return createOtlpNetworkExportDelegate(options, serializer, createRetryingTransport({
      transport: createFetchTransport(options)
    }));
  }
  function createOtlpSendBeaconExportDelegate(options, serializer) {
    return createOtlpNetworkExportDelegate(options, serializer, createRetryingTransport({
      transport: createSendBeaconTransport({
        url: options.url,
        headers: options.headers
      })
    }));
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/util.js
  function validateAndNormalizeHeaders(partialHeaders) {
    const headers = {};
    Object.entries(partialHeaders != null ? partialHeaders : {}).forEach(([key, value]) => {
      if (typeof value !== "undefined") {
        headers[key] = String(value);
      } else {
        diag2.warn(`Header "${key}" has invalid value (${value}) and will be ignored`);
      }
    });
    return headers;
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/otlp-http-configuration.js
  function mergeHeaders(userProvidedHeaders, fallbackHeaders, defaultHeaders) {
    return async () => {
      const requiredHeaders = {
        ...await defaultHeaders()
      };
      const headers = {};
      if (fallbackHeaders != null) {
        Object.assign(headers, await fallbackHeaders());
      }
      if (userProvidedHeaders != null) {
        Object.assign(headers, validateAndNormalizeHeaders(await userProvidedHeaders()));
      }
      return Object.assign(headers, requiredHeaders);
    };
  }
  function validateUserProvidedUrl(url) {
    var _a;
    if (url == null) {
      return void 0;
    }
    try {
      const base = (_a = globalThis.location) == null ? void 0 : _a.href;
      return new URL(url, base).href;
    } catch (e2) {
      throw new Error(`Configuration: Could not parse user-provided export URL: '${url}'`);
    }
  }
  function mergeOtlpHttpConfigurationWithDefaults(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration) {
    var _a, _b;
    return {
      ...mergeOtlpSharedConfigurationWithDefaults(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration),
      headers: mergeHeaders(userProvidedConfiguration.headers, fallbackConfiguration.headers, defaultConfiguration.headers),
      url: (_b = (_a = validateUserProvidedUrl(userProvidedConfiguration.url)) != null ? _a : fallbackConfiguration.url) != null ? _b : defaultConfiguration.url
    };
  }
  function getHttpConfigurationDefaults(requiredHeaders, signalResourcePath) {
    return {
      ...getSharedConfigurationDefaults(),
      headers: async () => requiredHeaders,
      url: "http://localhost:4318/" + signalResourcePath
    };
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/convert-legacy-http-options.js
  function convertLegacyHeaders(config) {
    if (typeof config.headers === "function") {
      return config.headers;
    }
    return wrapStaticHeadersInFunction(config.headers);
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/convert-legacy-browser-http-options.js
  function convertLegacyBrowserHttpOptions(config, signalResourcePath, requiredHeaders) {
    return mergeOtlpHttpConfigurationWithDefaults(
      {
        url: config.url,
        timeoutMillis: config.timeoutMillis,
        headers: convertLegacyHeaders(config),
        concurrencyLimit: config.concurrencyLimit
      },
      {},
      // no fallback for browser case
      getHttpConfigurationDefaults(requiredHeaders, signalResourcePath)
    );
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/create-legacy-browser-delegate.js
  function createLegacyOtlpBrowserExportDelegate(config, serializer, signalResourcePath, requiredHeaders) {
    const createOtlpExportDelegate2 = inferExportDelegateToUse(config.headers);
    const options = convertLegacyBrowserHttpOptions(config, signalResourcePath, requiredHeaders);
    return createOtlpExportDelegate2(options, serializer);
  }
  function inferExportDelegateToUse(configHeaders) {
    if (!configHeaders && typeof navigator.sendBeacon === "function") {
      return createOtlpSendBeaconExportDelegate;
    }
    return createOtlpFetchExportDelegate;
  }

  // node_modules/@opentelemetry/exporter-trace-otlp-http/build/esm/platform/browser/OTLPTraceExporter.js
  var OTLPTraceExporter = class extends OTLPExporterBase {
    constructor(config = {}) {
      super(createLegacyOtlpBrowserExportDelegate(config, JsonTraceSerializer, "v1/traces", { "Content-Type": "application/json" }));
    }
  };

  // node_modules/@opentelemetry/opentelemetry-browser-detector/node_modules/@opentelemetry/resources/build/esm/utils.js
  var isPromiseLike2 = (val) => {
    return val !== null && typeof val === "object" && typeof val.then === "function";
  };

  // node_modules/@opentelemetry/opentelemetry-browser-detector/node_modules/@opentelemetry/resources/build/esm/ResourceImpl.js
  var ResourceImpl2 = class _ResourceImpl {
    constructor(resource, options) {
      __publicField(this, "_rawAttributes");
      __publicField(this, "_asyncAttributesPending", false);
      __publicField(this, "_schemaUrl");
      __publicField(this, "_memoizedAttributes");
      var _a;
      const attributes = (_a = resource.attributes) != null ? _a : {};
      this._rawAttributes = Object.entries(attributes).map(([k2, v2]) => {
        if (isPromiseLike2(v2)) {
          this._asyncAttributesPending = true;
        }
        return [k2, v2];
      });
      this._rawAttributes = guardedRawAttributes2(this._rawAttributes);
      this._schemaUrl = validateSchemaUrl2(options == null ? void 0 : options.schemaUrl);
    }
    static FromAttributeList(attributes, options) {
      const res = new _ResourceImpl({}, options);
      res._rawAttributes = guardedRawAttributes2(attributes);
      res._asyncAttributesPending = attributes.filter(([_2, val]) => isPromiseLike2(val)).length > 0;
      return res;
    }
    get asyncAttributesPending() {
      return this._asyncAttributesPending;
    }
    async waitForAsyncAttributes() {
      if (!this.asyncAttributesPending) {
        return;
      }
      for (let i2 = 0; i2 < this._rawAttributes.length; i2++) {
        const [k2, v2] = this._rawAttributes[i2];
        this._rawAttributes[i2] = [k2, isPromiseLike2(v2) ? await v2 : v2];
      }
      this._asyncAttributesPending = false;
    }
    get attributes() {
      var _a;
      if (this.asyncAttributesPending) {
        diag2.error("Accessing resource attributes before async attributes settled");
      }
      if (this._memoizedAttributes) {
        return this._memoizedAttributes;
      }
      const attrs = {};
      for (const [k2, v2] of this._rawAttributes) {
        if (isPromiseLike2(v2)) {
          diag2.debug(`Unsettled resource attribute ${k2} skipped`);
          continue;
        }
        if (v2 != null) {
          (_a = attrs[k2]) != null ? _a : attrs[k2] = v2;
        }
      }
      if (!this._asyncAttributesPending) {
        this._memoizedAttributes = attrs;
      }
      return attrs;
    }
    getRawAttributes() {
      return this._rawAttributes;
    }
    get schemaUrl() {
      return this._schemaUrl;
    }
    merge(resource) {
      if (resource == null)
        return this;
      const mergedSchemaUrl = mergeSchemaUrl2(this, resource);
      const mergedOptions = mergedSchemaUrl ? { schemaUrl: mergedSchemaUrl } : void 0;
      return _ResourceImpl.FromAttributeList([...resource.getRawAttributes(), ...this.getRawAttributes()], mergedOptions);
    }
  };
  function resourceFromAttributes2(attributes, options) {
    return ResourceImpl2.FromAttributeList(Object.entries(attributes), options);
  }
  function emptyResource2() {
    return resourceFromAttributes2({});
  }
  function guardedRawAttributes2(attributes) {
    return attributes.map(([k2, v2]) => {
      if (isPromiseLike2(v2)) {
        return [
          k2,
          v2.catch((err) => {
            diag2.debug("promise rejection for resource attribute: %s - %s", k2, err);
            return void 0;
          })
        ];
      }
      return [k2, v2];
    });
  }
  function validateSchemaUrl2(schemaUrl) {
    if (typeof schemaUrl === "string" || schemaUrl === void 0) {
      return schemaUrl;
    }
    diag2.warn("Schema URL must be string or undefined, got %s. Schema URL will be ignored.", schemaUrl);
    return void 0;
  }
  function mergeSchemaUrl2(old, updating) {
    const oldSchemaUrl = old == null ? void 0 : old.schemaUrl;
    const updatingSchemaUrl = updating == null ? void 0 : updating.schemaUrl;
    const isOldEmpty = oldSchemaUrl === void 0 || oldSchemaUrl === "";
    const isUpdatingEmpty = updatingSchemaUrl === void 0 || updatingSchemaUrl === "";
    if (isOldEmpty) {
      return updatingSchemaUrl;
    }
    if (isUpdatingEmpty) {
      return oldSchemaUrl;
    }
    if (oldSchemaUrl === updatingSchemaUrl) {
      return oldSchemaUrl;
    }
    diag2.warn('Schema URL merge conflict: old resource has "%s", updating resource has "%s". Resulting resource will have undefined Schema URL.', oldSchemaUrl, updatingSchemaUrl);
    return void 0;
  }

  // node_modules/@opentelemetry/opentelemetry-browser-detector/build/esm/types.js
  var BROWSER_ATTRIBUTES = {
    PLATFORM: "browser.platform",
    BRANDS: "browser.brands",
    MOBILE: "browser.mobile",
    LANGUAGE: "browser.language",
    USER_AGENT: "browser.user_agent"
  };

  // node_modules/@opentelemetry/opentelemetry-browser-detector/build/esm/BrowserDetector.js
  var BrowserDetector = class {
    detect(config) {
      const isBrowser2 = typeof window !== "undefined" && typeof document !== "undefined";
      if (!isBrowser2) {
        return emptyResource2();
      }
      const browserResource = getBrowserAttributes();
      return this._getResourceAttributes(browserResource, config);
    }
    /**
     * Validates browser resource attribute map from browser variables
     *
     * @param browserResource The un-sanitized resource attributes from browser as key/value pairs.
     * @param config: Config
     * @returns The sanitized resource attributes.
     */
    _getResourceAttributes(browserResource, _config) {
      if (!browserResource[BROWSER_ATTRIBUTES.USER_AGENT] && !browserResource[BROWSER_ATTRIBUTES.PLATFORM]) {
        diag2.debug("BrowserDetector failed: Unable to find required browser resources. ");
        return emptyResource2();
      } else {
        return { attributes: browserResource };
      }
    }
  };
  function getBrowserAttributes() {
    const browserAttribs = {};
    const userAgentData = navigator.userAgentData;
    if (userAgentData) {
      browserAttribs[BROWSER_ATTRIBUTES.PLATFORM] = userAgentData.platform;
      browserAttribs[BROWSER_ATTRIBUTES.BRANDS] = userAgentData.brands.map((b2) => `${b2.brand} ${b2.version}`);
      browserAttribs[BROWSER_ATTRIBUTES.MOBILE] = userAgentData.mobile;
    } else {
      browserAttribs[BROWSER_ATTRIBUTES.USER_AGENT] = navigator.userAgent;
    }
    browserAttribs[BROWSER_ATTRIBUTES.LANGUAGE] = navigator.language;
    return browserAttribs;
  }
  var browserDetector = new BrowserDetector();

  // node_modules/web-vitals/dist/web-vitals.js
  var e = -1;
  var t = (t2) => {
    addEventListener("pageshow", ((n2) => {
      n2.persisted && (e = n2.timeStamp, t2(n2));
    }), true);
  };
  var n = (e2, t2, n2, i2) => {
    let s2, o2;
    return (r2) => {
      t2.value >= 0 && (r2 || i2) && (o2 = t2.value - (s2 != null ? s2 : 0), (o2 || void 0 === s2) && (s2 = t2.value, t2.delta = o2, t2.rating = ((e3, t3) => e3 > t3[1] ? "poor" : e3 > t3[0] ? "needs-improvement" : "good")(t2.value, n2), e2(t2)));
    };
  };
  var i = (e2) => {
    requestAnimationFrame((() => requestAnimationFrame((() => e2()))));
  };
  var s = () => {
    const e2 = performance.getEntriesByType("navigation")[0];
    if (e2 && e2.responseStart > 0 && e2.responseStart < performance.now()) return e2;
  };
  var o = () => {
    var _a;
    const e2 = s();
    return (_a = e2 == null ? void 0 : e2.activationStart) != null ? _a : 0;
  };
  var r = (t2, n2 = -1) => {
    const i2 = s();
    let r2 = "navigate";
    e >= 0 ? r2 = "back-forward-cache" : i2 && (document.prerendering || o() > 0 ? r2 = "prerender" : document.wasDiscarded ? r2 = "restore" : i2.type && (r2 = i2.type.replace(/_/g, "-")));
    return { name: t2, value: n2, rating: "good", delta: 0, entries: [], id: `v5-${Date.now()}-${Math.floor(8999999999999 * Math.random()) + 1e12}`, navigationType: r2 };
  };
  var c = /* @__PURE__ */ new WeakMap();
  function a(e2, t2) {
    return c.get(e2) || c.set(e2, new t2()), c.get(e2);
  }
  var d = class {
    constructor() {
      __publicField(this, "t");
      __publicField(this, "i", 0);
      __publicField(this, "o", []);
    }
    h(e2) {
      var _a;
      if (e2.hadRecentInput) return;
      const t2 = this.o[0], n2 = this.o.at(-1);
      this.i && t2 && n2 && e2.startTime - n2.startTime < 1e3 && e2.startTime - t2.startTime < 5e3 ? (this.i += e2.value, this.o.push(e2)) : (this.i = e2.value, this.o = [e2]), (_a = this.t) == null ? void 0 : _a.call(this, e2);
    }
  };
  var h = (e2, t2, n2 = {}) => {
    try {
      if (PerformanceObserver.supportedEntryTypes.includes(e2)) {
        const i2 = new PerformanceObserver(((e3) => {
          Promise.resolve().then((() => {
            t2(e3.getEntries());
          }));
        }));
        return i2.observe({ type: e2, buffered: true, ...n2 }), i2;
      }
    } catch (e3) {
    }
  };
  var f = (e2) => {
    let t2 = false;
    return () => {
      t2 || (e2(), t2 = true);
    };
  };
  var u = -1;
  var l = /* @__PURE__ */ new Set();
  var m = () => "hidden" !== document.visibilityState || document.prerendering ? 1 / 0 : 0;
  var p = (e2) => {
    if ("hidden" === document.visibilityState) {
      if ("visibilitychange" === e2.type) for (const e3 of l) e3();
      isFinite(u) || (u = "visibilitychange" === e2.type ? e2.timeStamp : 0, removeEventListener("prerenderingchange", p, true));
    }
  };
  var v = () => {
    var _a;
    if (u < 0) {
      const e2 = o(), n2 = document.prerendering ? void 0 : (_a = globalThis.performance.getEntriesByType("visibility-state").filter(((t2) => "hidden" === t2.name && t2.startTime > e2))[0]) == null ? void 0 : _a.startTime;
      u = n2 != null ? n2 : m(), addEventListener("visibilitychange", p, true), addEventListener("prerenderingchange", p, true), t((() => {
        setTimeout((() => {
          u = m();
        }));
      }));
    }
    return { get firstHiddenTime() {
      return u;
    }, onHidden(e2) {
      l.add(e2);
    } };
  };
  var g = (e2) => {
    document.prerendering ? addEventListener("prerenderingchange", (() => e2()), true) : e2();
  };
  var y = [1800, 3e3];
  var E = (e2, s2 = {}) => {
    g((() => {
      const c2 = v();
      let a2, d2 = r("FCP");
      const f2 = h("paint", ((e3) => {
        for (const t2 of e3) "first-contentful-paint" === t2.name && (f2.disconnect(), t2.startTime < c2.firstHiddenTime && (d2.value = Math.max(t2.startTime - o(), 0), d2.entries.push(t2), a2(true)));
      }));
      f2 && (a2 = n(e2, d2, y, s2.reportAllChanges), t(((t2) => {
        d2 = r("FCP"), a2 = n(e2, d2, y, s2.reportAllChanges), i((() => {
          d2.value = performance.now() - t2.timeStamp, a2(true);
        }));
      })));
    }));
  };
  var b = [0.1, 0.25];
  var L = (e2, s2 = {}) => {
    const o2 = v();
    E(f((() => {
      let c2, f2 = r("CLS", 0);
      const u2 = a(s2, d), l2 = (e3) => {
        for (const t2 of e3) u2.h(t2);
        u2.i > f2.value && (f2.value = u2.i, f2.entries = u2.o, c2());
      }, m2 = h("layout-shift", l2);
      m2 && (c2 = n(e2, f2, b, s2.reportAllChanges), o2.onHidden((() => {
        l2(m2.takeRecords()), c2(true);
      })), t((() => {
        u2.i = 0, f2 = r("CLS", 0), c2 = n(e2, f2, b, s2.reportAllChanges), i((() => c2()));
      })), setTimeout(c2));
    })));
  };
  var P = 0;
  var T = 1 / 0;
  var _ = 0;
  var M = (e2) => {
    for (const t2 of e2) t2.interactionId && (T = Math.min(T, t2.interactionId), _ = Math.max(_, t2.interactionId), P = _ ? (_ - T) / 7 + 1 : 0);
  };
  var w;
  var C = () => {
    var _a;
    return w ? P : (_a = performance.interactionCount) != null ? _a : 0;
  };
  var I = () => {
    "interactionCount" in performance || w || (w = h("event", M, { type: "event", buffered: true, durationThreshold: 0 }));
  };
  var F = 0;
  var k = class {
    constructor() {
      __publicField(this, "u", []);
      __publicField(this, "l", /* @__PURE__ */ new Map());
      __publicField(this, "m");
      __publicField(this, "p");
    }
    v() {
      F = C(), this.u.length = 0, this.l.clear();
    }
    L() {
      const e2 = Math.min(this.u.length - 1, Math.floor((C() - F) / 50));
      return this.u[e2];
    }
    h(e2) {
      var _a, _b;
      if ((_a = this.m) == null ? void 0 : _a.call(this, e2), !e2.interactionId && "first-input" !== e2.entryType) return;
      const t2 = this.u.at(-1);
      let n2 = this.l.get(e2.interactionId);
      if (n2 || this.u.length < 10 || e2.duration > t2.P) {
        if (n2 ? e2.duration > n2.P ? (n2.entries = [e2], n2.P = e2.duration) : e2.duration === n2.P && e2.startTime === n2.entries[0].startTime && n2.entries.push(e2) : (n2 = { id: e2.interactionId, entries: [e2], P: e2.duration }, this.l.set(n2.id, n2), this.u.push(n2)), this.u.sort(((e3, t3) => t3.P - e3.P)), this.u.length > 10) {
          const e3 = this.u.splice(10);
          for (const t3 of e3) this.l.delete(t3.id);
        }
        (_b = this.p) == null ? void 0 : _b.call(this, n2);
      }
    }
  };
  var A = (e2) => {
    const t2 = globalThis.requestIdleCallback || setTimeout;
    "hidden" === document.visibilityState ? e2() : (e2 = f(e2), addEventListener("visibilitychange", e2, { once: true, capture: true }), t2((() => {
      e2(), removeEventListener("visibilitychange", e2, { capture: true });
    })));
  };
  var B = [200, 500];
  var S = (e2, i2 = {}) => {
    if (!globalThis.PerformanceEventTiming || !("interactionId" in PerformanceEventTiming.prototype)) return;
    const s2 = v();
    g((() => {
      var _a;
      I();
      let o2, c2 = r("INP");
      const d2 = a(i2, k), f2 = (e3) => {
        A((() => {
          for (const t3 of e3) d2.h(t3);
          const t2 = d2.L();
          t2 && t2.P !== c2.value && (c2.value = t2.P, c2.entries = t2.entries, o2());
        }));
      }, u2 = h("event", f2, { durationThreshold: (_a = i2.durationThreshold) != null ? _a : 40 });
      o2 = n(e2, c2, B, i2.reportAllChanges), u2 && (u2.observe({ type: "first-input", buffered: true }), s2.onHidden((() => {
        f2(u2.takeRecords()), o2(true);
      })), t((() => {
        d2.v(), c2 = r("INP"), o2 = n(e2, c2, B, i2.reportAllChanges);
      })));
    }));
  };
  var N = class {
    constructor() {
      __publicField(this, "m");
    }
    h(e2) {
      var _a;
      (_a = this.m) == null ? void 0 : _a.call(this, e2);
    }
  };
  var q = [2500, 4e3];
  var x = (e2, s2 = {}) => {
    g((() => {
      const c2 = v();
      let d2, u2 = r("LCP");
      const l2 = a(s2, N), m2 = (e3) => {
        s2.reportAllChanges || (e3 = e3.slice(-1));
        for (const t2 of e3) l2.h(t2), t2.startTime < c2.firstHiddenTime && (u2.value = Math.max(t2.startTime - o(), 0), u2.entries = [t2], d2());
      }, p2 = h("largest-contentful-paint", m2);
      if (p2) {
        d2 = n(e2, u2, q, s2.reportAllChanges);
        const o2 = f((() => {
          m2(p2.takeRecords()), p2.disconnect(), d2(true);
        })), c3 = (e3) => {
          e3.isTrusted && (A(o2), removeEventListener(e3.type, c3, { capture: true }));
        };
        for (const e3 of ["keydown", "click", "visibilitychange"]) addEventListener(e3, c3, { capture: true });
        t(((t2) => {
          u2 = r("LCP"), d2 = n(e2, u2, q, s2.reportAllChanges), i((() => {
            u2.value = performance.now() - t2.timeStamp, d2(true);
          }));
        }));
      }
    }));
  };

  // node_modules/@opentelemetry/instrumentation-fetch/node_modules/@opentelemetry/api-logs/build/esm/NoopLogger.js
  var NoopLogger2 = class {
    emit(_logRecord) {
    }
  };
  var NOOP_LOGGER2 = new NoopLogger2();

  // node_modules/@opentelemetry/instrumentation-fetch/node_modules/@opentelemetry/api-logs/build/esm/internal/global-utils.js
  var GLOBAL_LOGS_API_KEY2 = /* @__PURE__ */ Symbol.for("io.opentelemetry.js.api.logs");
  var _global4 = globalThis;
  function makeGetter2(requiredVersion, instance, fallback) {
    return (version) => version === requiredVersion ? instance : fallback;
  }
  var API_BACKWARDS_COMPATIBILITY_VERSION2 = 1;

  // node_modules/@opentelemetry/instrumentation-fetch/node_modules/@opentelemetry/api-logs/build/esm/NoopLoggerProvider.js
  var NoopLoggerProvider2 = class {
    getLogger(_name, _version, _options) {
      return new NoopLogger2();
    }
  };
  var NOOP_LOGGER_PROVIDER2 = new NoopLoggerProvider2();

  // node_modules/@opentelemetry/instrumentation-fetch/node_modules/@opentelemetry/api-logs/build/esm/ProxyLogger.js
  var ProxyLogger2 = class {
    constructor(provider, name, version, options) {
      this._provider = provider;
      this.name = name;
      this.version = version;
      this.options = options;
    }
    /**
     * Emit a log record. This method should only be used by log appenders.
     *
     * @param logRecord
     */
    emit(logRecord) {
      this._getLogger().emit(logRecord);
    }
    /**
     * Try to get a logger from the proxy logger provider.
     * If the proxy logger provider has no delegate, return a noop logger.
     */
    _getLogger() {
      if (this._delegate) {
        return this._delegate;
      }
      const logger3 = this._provider._getDelegateLogger(this.name, this.version, this.options);
      if (!logger3) {
        return NOOP_LOGGER2;
      }
      this._delegate = logger3;
      return this._delegate;
    }
  };

  // node_modules/@opentelemetry/instrumentation-fetch/node_modules/@opentelemetry/api-logs/build/esm/ProxyLoggerProvider.js
  var ProxyLoggerProvider2 = class {
    getLogger(name, version, options) {
      var _a;
      return (_a = this._getDelegateLogger(name, version, options)) !== null && _a !== void 0 ? _a : new ProxyLogger2(this, name, version, options);
    }
    /**
     * Get the delegate logger provider.
     * Used by tests only.
     * @internal
     */
    _getDelegate() {
      var _a;
      return (_a = this._delegate) !== null && _a !== void 0 ? _a : NOOP_LOGGER_PROVIDER2;
    }
    /**
     * Set the delegate logger provider
     * @internal
     */
    _setDelegate(delegate) {
      this._delegate = delegate;
    }
    /**
     * @internal
     */
    _getDelegateLogger(name, version, options) {
      var _a;
      return (_a = this._delegate) === null || _a === void 0 ? void 0 : _a.getLogger(name, version, options);
    }
  };

  // node_modules/@opentelemetry/instrumentation-fetch/node_modules/@opentelemetry/api-logs/build/esm/api/logs.js
  var LogsAPI2 = class _LogsAPI {
    constructor() {
      this._proxyLoggerProvider = new ProxyLoggerProvider2();
    }
    static getInstance() {
      if (!this._instance) {
        this._instance = new _LogsAPI();
      }
      return this._instance;
    }
    setGlobalLoggerProvider(provider) {
      if (_global4[GLOBAL_LOGS_API_KEY2]) {
        return this.getLoggerProvider();
      }
      _global4[GLOBAL_LOGS_API_KEY2] = makeGetter2(API_BACKWARDS_COMPATIBILITY_VERSION2, provider, NOOP_LOGGER_PROVIDER2);
      this._proxyLoggerProvider._setDelegate(provider);
      return provider;
    }
    /**
     * Returns the global logger provider.
     *
     * @returns LoggerProvider
     */
    getLoggerProvider() {
      var _a, _b;
      return (_b = (_a = _global4[GLOBAL_LOGS_API_KEY2]) === null || _a === void 0 ? void 0 : _a.call(_global4, API_BACKWARDS_COMPATIBILITY_VERSION2)) !== null && _b !== void 0 ? _b : this._proxyLoggerProvider;
    }
    /**
     * Returns a logger from the global logger provider.
     *
     * @returns Logger
     */
    getLogger(name, version, options) {
      return this.getLoggerProvider().getLogger(name, version, options);
    }
    /** Remove the global logger provider */
    disable() {
      delete _global4[GLOBAL_LOGS_API_KEY2];
      this._proxyLoggerProvider = new ProxyLoggerProvider2();
    }
  };

  // node_modules/@opentelemetry/instrumentation-fetch/node_modules/@opentelemetry/api-logs/build/esm/index.js
  var logs2 = LogsAPI2.getInstance();

  // node_modules/@opentelemetry/instrumentation-fetch/node_modules/@opentelemetry/instrumentation/build/esm/shimmer.js
  var logger2 = console.error.bind(console);
  function defineProperty2(obj, name, value) {
    const enumerable = !!obj[name] && Object.prototype.propertyIsEnumerable.call(obj, name);
    Object.defineProperty(obj, name, {
      configurable: true,
      enumerable,
      writable: true,
      value
    });
  }
  var wrap2 = (nodule, name, wrapper) => {
    if (!nodule || !nodule[name]) {
      logger2("no original function " + String(name) + " to wrap");
      return;
    }
    if (!wrapper) {
      logger2("no wrapper function");
      logger2(new Error().stack);
      return;
    }
    const original = nodule[name];
    if (typeof original !== "function" || typeof wrapper !== "function") {
      logger2("original object and wrapper must be functions");
      return;
    }
    const wrapped = wrapper(original, name);
    defineProperty2(wrapped, "__original", original);
    defineProperty2(wrapped, "__unwrap", () => {
      if (nodule[name] === wrapped) {
        defineProperty2(nodule, name, original);
      }
    });
    defineProperty2(wrapped, "__wrapped", true);
    defineProperty2(nodule, name, wrapped);
    return wrapped;
  };
  var massWrap2 = (nodules, names, wrapper) => {
    if (!nodules) {
      logger2("must provide one or more modules to patch");
      logger2(new Error().stack);
      return;
    } else if (!Array.isArray(nodules)) {
      nodules = [nodules];
    }
    if (!(names && Array.isArray(names))) {
      logger2("must provide one or more functions to wrap on modules");
      return;
    }
    nodules.forEach((nodule) => {
      names.forEach((name) => {
        wrap2(nodule, name, wrapper);
      });
    });
  };
  var unwrap2 = (nodule, name) => {
    if (!nodule || !nodule[name]) {
      logger2("no function to unwrap.");
      logger2(new Error().stack);
      return;
    }
    const wrapped = nodule[name];
    if (!wrapped.__unwrap) {
      logger2("no original to unwrap to -- has " + String(name) + " already been unwrapped?");
    } else {
      wrapped.__unwrap();
      return;
    }
  };
  var massUnwrap2 = (nodules, names) => {
    if (!nodules) {
      logger2("must provide one or more modules to patch");
      logger2(new Error().stack);
      return;
    } else if (!Array.isArray(nodules)) {
      nodules = [nodules];
    }
    if (!(names && Array.isArray(names))) {
      logger2("must provide one or more functions to unwrap on modules");
      return;
    }
    nodules.forEach((nodule) => {
      names.forEach((name) => {
        unwrap2(nodule, name);
      });
    });
  };
  function shimmer2(options) {
    if (options && options.logger) {
      if (typeof options.logger !== "function") {
        logger2("new logger isn't a function, not replacing");
      } else {
        logger2 = options.logger;
      }
    }
  }
  shimmer2.wrap = wrap2;
  shimmer2.massWrap = massWrap2;
  shimmer2.unwrap = unwrap2;
  shimmer2.massUnwrap = massUnwrap2;

  // node_modules/@opentelemetry/instrumentation-fetch/node_modules/@opentelemetry/instrumentation/build/esm/instrumentation.js
  var InstrumentationAbstract2 = class {
    constructor(instrumentationName, instrumentationVersion, config) {
      __publicField(this, "_config", {});
      __publicField(this, "_tracer");
      __publicField(this, "_meter");
      __publicField(this, "_logger");
      __publicField(this, "_diag");
      __publicField(this, "instrumentationName");
      __publicField(this, "instrumentationVersion");
      /* Api to wrap instrumented method */
      __publicField(this, "_wrap", wrap2);
      /* Api to unwrap instrumented methods */
      __publicField(this, "_unwrap", unwrap2);
      /* Api to mass wrap instrumented method */
      __publicField(this, "_massWrap", massWrap2);
      /* Api to mass unwrap instrumented methods */
      __publicField(this, "_massUnwrap", massUnwrap2);
      this.instrumentationName = instrumentationName;
      this.instrumentationVersion = instrumentationVersion;
      this.setConfig(config);
      this._diag = diag2.createComponentLogger({
        namespace: instrumentationName
      });
      this._tracer = trace.getTracer(instrumentationName, instrumentationVersion);
      this._meter = metrics.getMeter(instrumentationName, instrumentationVersion);
      this._logger = logs2.getLogger(instrumentationName, instrumentationVersion);
      this._updateMetricInstruments();
    }
    /* Returns meter */
    get meter() {
      return this._meter;
    }
    /**
     * Sets MeterProvider to this plugin
     * @param meterProvider
     */
    setMeterProvider(meterProvider) {
      this._meter = meterProvider.getMeter(this.instrumentationName, this.instrumentationVersion);
      this._updateMetricInstruments();
    }
    /* Returns logger */
    get logger() {
      return this._logger;
    }
    /**
     * Sets LoggerProvider to this plugin
     * @param loggerProvider
     */
    setLoggerProvider(loggerProvider) {
      this._logger = loggerProvider.getLogger(this.instrumentationName, this.instrumentationVersion);
    }
    /**
     * @experimental
     *
     * Get module definitions defined by {@link init}.
     * This can be used for experimental compile-time instrumentation.
     *
     * @returns an array of {@link InstrumentationModuleDefinition}
     */
    getModuleDefinitions() {
      var _a;
      const initResult = (_a = this.init()) != null ? _a : [];
      if (!Array.isArray(initResult)) {
        return [initResult];
      }
      return initResult;
    }
    /**
     * Sets the new metric instruments with the current Meter.
     */
    _updateMetricInstruments() {
      return;
    }
    /* Returns InstrumentationConfig */
    getConfig() {
      return this._config;
    }
    /**
     * Sets InstrumentationConfig to this plugin
     * @param config
     */
    setConfig(config) {
      this._config = {
        enabled: true,
        ...config
      };
    }
    /**
     * Sets TraceProvider to this plugin
     * @param tracerProvider
     */
    setTracerProvider(tracerProvider) {
      this._tracer = tracerProvider.getTracer(this.instrumentationName, this.instrumentationVersion);
    }
    /* Returns tracer */
    get tracer() {
      return this._tracer;
    }
    /**
     * Execute span customization hook, if configured, and log any errors.
     * Any semantics of the trigger and info are defined by the specific instrumentation.
     * @param hookHandler The optional hook handler which the user has configured via instrumentation config
     * @param triggerName The name of the trigger for executing the hook for logging purposes
     * @param span The span to which the hook should be applied
     * @param info The info object to be passed to the hook, with useful data the hook may use
     */
    _runSpanCustomizationHook(hookHandler, triggerName, span, info) {
      if (!hookHandler) {
        return;
      }
      try {
        hookHandler(span, info);
      } catch (e2) {
        this._diag.error(`Error running span customization hook due to exception in handler`, { triggerName }, e2);
      }
    }
  };

  // node_modules/@opentelemetry/instrumentation-fetch/node_modules/@opentelemetry/instrumentation/build/esm/platform/browser/instrumentation.js
  var InstrumentationBase2 = class extends InstrumentationAbstract2 {
    constructor(instrumentationName, instrumentationVersion, config) {
      super(instrumentationName, instrumentationVersion, config);
      if (this._config.enabled) {
        this.enable();
      }
    }
  };

  // node_modules/@opentelemetry/instrumentation-fetch/node_modules/@opentelemetry/instrumentation/build/esm/utils.js
  function safeExecuteInTheMiddle2(execute, onFinish, preventThrowingError) {
    let error;
    let result;
    try {
      result = execute();
    } catch (e2) {
      error = e2;
    } finally {
      onFinish(error, result);
      if (error && !preventThrowingError) {
        throw error;
      }
      return result;
    }
  }
  function isWrapped2(func) {
    return typeof func === "function" && typeof func.__original === "function" && typeof func.__unwrap === "function" && func.__wrapped === true;
  }

  // node_modules/@opentelemetry/instrumentation-fetch/node_modules/@opentelemetry/instrumentation/build/esm/semconvStability.js
  var SemconvStability2;
  (function(SemconvStability3) {
    SemconvStability3[SemconvStability3["STABLE"] = 1] = "STABLE";
    SemconvStability3[SemconvStability3["OLD"] = 2] = "OLD";
    SemconvStability3[SemconvStability3["DUPLICATE"] = 3] = "DUPLICATE";
  })(SemconvStability2 || (SemconvStability2 = {}));
  function semconvStabilityFromStr2(namespace, str) {
    let semconvStability = SemconvStability2.OLD;
    const entries = str == null ? void 0 : str.split(",").map((v2) => v2.trim()).filter((s2) => s2 !== "");
    for (const entry of entries != null ? entries : []) {
      if (entry.toLowerCase() === namespace + "/dup") {
        semconvStability = SemconvStability2.DUPLICATE;
        break;
      } else if (entry.toLowerCase() === namespace) {
        semconvStability = SemconvStability2.STABLE;
      }
    }
    return semconvStability;
  }

  // node_modules/@opentelemetry/instrumentation-fetch/build/esm/enums/AttributeNames.js
  var AttributeNames4;
  (function(AttributeNames5) {
    AttributeNames5["COMPONENT"] = "component";
    AttributeNames5["HTTP_STATUS_TEXT"] = "http.status_text";
  })(AttributeNames4 || (AttributeNames4 = {}));

  // node_modules/@opentelemetry/instrumentation-fetch/build/esm/semconv.js
  var ATTR_HTTP_HOST2 = "http.host";
  var ATTR_HTTP_METHOD2 = "http.method";
  var ATTR_HTTP_REQUEST_BODY_SIZE2 = "http.request.body.size";
  var ATTR_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED2 = "http.request_content_length_uncompressed";
  var ATTR_HTTP_SCHEME2 = "http.scheme";
  var ATTR_HTTP_STATUS_CODE2 = "http.status_code";
  var ATTR_HTTP_URL3 = "http.url";
  var ATTR_HTTP_USER_AGENT3 = "http.user_agent";

  // node_modules/@opentelemetry/instrumentation-fetch/build/esm/utils.js
  var DIAG_LOGGER2 = diag2.createComponentLogger({
    namespace: "@opentelemetry/opentelemetry-instrumentation-fetch/utils"
  });
  function getFetchBodyLength(...args) {
    if (args[0] instanceof URL || typeof args[0] === "string") {
      const requestInit = args[1];
      if (!(requestInit == null ? void 0 : requestInit.body)) {
        return Promise.resolve();
      }
      if (requestInit.body instanceof ReadableStream) {
        const { body, length } = _getBodyNonDestructively(requestInit.body);
        requestInit.body = body;
        return length;
      } else {
        return Promise.resolve(getXHRBodyLength2(requestInit.body));
      }
    } else {
      const info = args[0];
      if (!(info == null ? void 0 : info.body)) {
        return Promise.resolve();
      }
      return info.clone().text().then((t2) => getByteLength2(t2));
    }
  }
  function _getBodyNonDestructively(body) {
    if (!body.pipeThrough) {
      DIAG_LOGGER2.warn("Platform has ReadableStream but not pipeThrough!");
      return {
        body,
        length: Promise.resolve(void 0)
      };
    }
    let length = 0;
    let resolveLength;
    const lengthPromise = new Promise((resolve) => {
      resolveLength = resolve;
    });
    const transform = new TransformStream({
      start() {
      },
      async transform(chunk, controller) {
        const bytearray = await chunk;
        length += bytearray.byteLength;
        controller.enqueue(chunk);
      },
      flush() {
        resolveLength(length);
      }
    });
    return {
      body: body.pipeThrough(transform),
      length: lengthPromise
    };
  }
  function isDocument2(value) {
    return typeof Document !== "undefined" && value instanceof Document;
  }
  function getXHRBodyLength2(body) {
    if (isDocument2(body)) {
      return new XMLSerializer().serializeToString(document).length;
    }
    if (typeof body === "string") {
      return getByteLength2(body);
    }
    if (body instanceof Blob) {
      return body.size;
    }
    if (body instanceof FormData) {
      return getFormDataSize2(body);
    }
    if (body instanceof URLSearchParams) {
      return getByteLength2(body.toString());
    }
    if (body.byteLength !== void 0) {
      return body.byteLength;
    }
    DIAG_LOGGER2.warn("unknown body type");
    return void 0;
  }
  var TEXT_ENCODER2 = new TextEncoder();
  function getByteLength2(s2) {
    return TEXT_ENCODER2.encode(s2).byteLength;
  }
  function getFormDataSize2(formData) {
    let size = 0;
    for (const [key, value] of formData.entries()) {
      size += key.length;
      if (value instanceof Blob) {
        size += value.size;
      } else {
        size += value.length;
      }
    }
    return size;
  }
  function normalizeHttpRequestMethod2(method) {
    const knownMethods3 = getKnownMethods2();
    const methUpper = method.toUpperCase();
    if (methUpper in knownMethods3) {
      return methUpper;
    } else {
      return "_OTHER";
    }
  }
  var DEFAULT_KNOWN_METHODS2 = {
    CONNECT: true,
    DELETE: true,
    GET: true,
    HEAD: true,
    OPTIONS: true,
    PATCH: true,
    POST: true,
    PUT: true,
    TRACE: true,
    // QUERY from https://datatracker.ietf.org/doc/draft-ietf-httpbis-safe-method-w-body/
    QUERY: true
  };
  var knownMethods2;
  function getKnownMethods2() {
    if (knownMethods2 === void 0) {
      const cfgMethods = getStringListFromEnv("OTEL_INSTRUMENTATION_HTTP_KNOWN_METHODS");
      if (cfgMethods && cfgMethods.length > 0) {
        knownMethods2 = {};
        cfgMethods.forEach((m2) => {
          knownMethods2[m2] = true;
        });
      } else {
        knownMethods2 = DEFAULT_KNOWN_METHODS2;
      }
    }
    return knownMethods2;
  }
  var HTTP_PORT_FROM_PROTOCOL2 = {
    "https:": "443",
    "http:": "80"
  };
  function serverPortFromUrl2(url) {
    const serverPort = Number(url.port || HTTP_PORT_FROM_PROTOCOL2[url.protocol]);
    if (serverPort && !isNaN(serverPort)) {
      return serverPort;
    } else {
      return void 0;
    }
  }

  // node_modules/@opentelemetry/instrumentation-fetch/build/esm/version.js
  var VERSION5 = "0.212.0";

  // node_modules/@opentelemetry/instrumentation-fetch/build/esm/fetch.js
  var OBSERVER_WAIT_TIME_MS2 = 300;
  var hasBrowserPerformanceAPI = typeof PerformanceObserver !== "undefined";
  var FetchInstrumentation = class extends InstrumentationBase2 {
    constructor(config = {}) {
      super("@opentelemetry/instrumentation-fetch", VERSION5, config);
      __publicField(this, "component", "fetch");
      __publicField(this, "version", VERSION5);
      __publicField(this, "moduleName", this.component);
      __publicField(this, "_usedResources", /* @__PURE__ */ new WeakSet());
      __publicField(this, "_tasksCount", 0);
      __publicField(this, "_semconvStability");
      this._semconvStability = semconvStabilityFromStr2("http", config == null ? void 0 : config.semconvStabilityOptIn);
    }
    init() {
    }
    /**
     * Add cors pre flight child span
     * @param span
     * @param corsPreFlightRequest
     */
    _addChildSpan(span, corsPreFlightRequest) {
      const childSpan = this.tracer.startSpan("CORS Preflight", {
        startTime: corsPreFlightRequest[PerformanceTimingNames.FETCH_START]
      }, trace.setSpan(context.active(), span));
      const skipOldSemconvContentLengthAttrs = !(this._semconvStability & SemconvStability2.OLD);
      addSpanNetworkEvents(childSpan, corsPreFlightRequest, this.getConfig().ignoreNetworkEvents, void 0, skipOldSemconvContentLengthAttrs);
      childSpan.end(corsPreFlightRequest[PerformanceTimingNames.RESPONSE_END]);
    }
    /**
     * Adds more attributes to span just before ending it
     * @param span
     * @param response
     */
    _addFinalSpanAttributes(span, response) {
      const parsedUrl = parseUrl(response.url);
      if (this._semconvStability & SemconvStability2.OLD) {
        span.setAttribute(ATTR_HTTP_STATUS_CODE2, response.status);
        if (response.statusText != null) {
          span.setAttribute(AttributeNames4.HTTP_STATUS_TEXT, response.statusText);
        }
        span.setAttribute(ATTR_HTTP_HOST2, parsedUrl.host);
        span.setAttribute(ATTR_HTTP_SCHEME2, parsedUrl.protocol.replace(":", ""));
        if (typeof navigator !== "undefined") {
          span.setAttribute(ATTR_HTTP_USER_AGENT3, navigator.userAgent);
        }
      }
      if (this._semconvStability & SemconvStability2.STABLE) {
        span.setAttribute(ATTR_HTTP_RESPONSE_STATUS_CODE, response.status);
        span.setAttribute(ATTR_SERVER_ADDRESS, parsedUrl.hostname);
        const serverPort = serverPortFromUrl2(parsedUrl);
        if (serverPort) {
          span.setAttribute(ATTR_SERVER_PORT, serverPort);
        }
      }
    }
    /**
     * Add headers
     * @param options
     * @param spanUrl
     */
    _addHeaders(options, spanUrl) {
      if (!shouldPropagateTraceHeaders(spanUrl, this.getConfig().propagateTraceHeaderCorsUrls)) {
        const headers = {};
        propagation.inject(context.active(), headers);
        if (Object.keys(headers).length > 0) {
          this._diag.debug("headers inject skipped due to CORS policy");
        }
        return;
      }
      if (options instanceof Request) {
        propagation.inject(context.active(), options.headers, {
          set: (h2, k2, v2) => h2.set(k2, typeof v2 === "string" ? v2 : String(v2))
        });
      } else if (options.headers instanceof Headers) {
        propagation.inject(context.active(), options.headers, {
          set: (h2, k2, v2) => h2.set(k2, typeof v2 === "string" ? v2 : String(v2))
        });
      } else if (options.headers instanceof Map) {
        propagation.inject(context.active(), options.headers, {
          set: (h2, k2, v2) => h2.set(k2, typeof v2 === "string" ? v2 : String(v2))
        });
      } else {
        const headers = {};
        propagation.inject(context.active(), headers);
        options.headers = Object.assign({}, headers, options.headers || {});
      }
    }
    /**
     * Clears the resource timings and all resources assigned with spans
     *     when {@link FetchPluginConfig.clearTimingResources} is
     *     set to true (default false)
     * @private
     */
    _clearResources() {
      if (this._tasksCount === 0 && this.getConfig().clearTimingResources) {
        performance.clearResourceTimings();
        this._usedResources = /* @__PURE__ */ new WeakSet();
      }
    }
    /**
     * Creates a new span
     * @param url
     * @param options
     */
    _createSpan(url, options = {}) {
      if (isUrlIgnored(url, this.getConfig().ignoreUrls)) {
        this._diag.debug("ignoring span as url matches ignored url");
        return;
      }
      let name = "";
      const attributes = {};
      if (this._semconvStability & SemconvStability2.OLD) {
        const method = (options.method || "GET").toUpperCase();
        name = `HTTP ${method}`;
        attributes[AttributeNames4.COMPONENT] = this.moduleName;
        attributes[ATTR_HTTP_METHOD2] = method;
        attributes[ATTR_HTTP_URL3] = url;
      }
      if (this._semconvStability & SemconvStability2.STABLE) {
        const origMethod = options.method;
        const normMethod = normalizeHttpRequestMethod2(options.method || "GET");
        if (!name) {
          name = normMethod;
        }
        attributes[ATTR_HTTP_REQUEST_METHOD] = normMethod;
        if (normMethod !== origMethod) {
          attributes[ATTR_HTTP_REQUEST_METHOD_ORIGINAL] = origMethod;
        }
        attributes[ATTR_URL_FULL] = url;
      }
      return this.tracer.startSpan(name, {
        kind: SpanKind.CLIENT,
        attributes
      });
    }
    /**
     * Finds appropriate resource and add network events to the span
     * @param span
     * @param resourcesObserver
     * @param endTime
     */
    _findResourceAndAddNetworkEvents(span, resourcesObserver, endTime) {
      let resources = resourcesObserver.entries;
      if (!resources.length) {
        if (!performance.getEntriesByType) {
          return;
        }
        resources = performance.getEntriesByType("resource");
      }
      const resource = getResource(resourcesObserver.spanUrl, resourcesObserver.startTime, endTime, resources, this._usedResources, "fetch");
      if (resource.mainRequest) {
        const mainRequest = resource.mainRequest;
        this._markResourceAsUsed(mainRequest);
        const corsPreFlightRequest = resource.corsPreFlightRequest;
        if (corsPreFlightRequest) {
          this._addChildSpan(span, corsPreFlightRequest);
          this._markResourceAsUsed(corsPreFlightRequest);
        }
        const skipOldSemconvContentLengthAttrs = !(this._semconvStability & SemconvStability2.OLD);
        addSpanNetworkEvents(span, mainRequest, this.getConfig().ignoreNetworkEvents, void 0, skipOldSemconvContentLengthAttrs);
      }
    }
    /**
     * Marks certain [resource]{@link PerformanceResourceTiming} when information
     * from this is used to add events to span.
     * This is done to avoid reusing the same resource again for next span
     * @param resource
     */
    _markResourceAsUsed(resource) {
      this._usedResources.add(resource);
    }
    /**
     * Finish span, add attributes, network events etc.
     * @param span
     * @param spanData
     * @param response
     */
    _endSpan(span, spanData, response) {
      const endTime = millisToHrTime(Date.now());
      const performanceEndTime = hrTime();
      this._addFinalSpanAttributes(span, response);
      if (this._semconvStability & SemconvStability2.STABLE) {
        if (response.status >= 400) {
          span.setStatus({ code: SpanStatusCode.ERROR });
          span.setAttribute(ATTR_ERROR_TYPE, String(response.status));
        }
      }
      setTimeout(() => {
        var _a;
        (_a = spanData.observer) == null ? void 0 : _a.disconnect();
        this._findResourceAndAddNetworkEvents(span, spanData, performanceEndTime);
        this._tasksCount--;
        this._clearResources();
        span.end(endTime);
      }, OBSERVER_WAIT_TIME_MS2);
    }
    /**
     * Patches the constructor of fetch
     */
    _patchConstructor() {
      return (original) => {
        const plugin = this;
        const readOnlyProps = /* @__PURE__ */ new Set(["url", "type", "redirected"]);
        function createResponseProxy(target, originalResponse) {
          return new Proxy(target, {
            get(t2, prop, _receiver) {
              if (typeof prop === "string" && readOnlyProps.has(prop)) {
                return Reflect.get(originalResponse, prop);
              }
              if (prop === "clone") {
                return function clone() {
                  return createResponseProxy(t2.clone(), originalResponse);
                };
              }
              const value = Reflect.get(t2, prop, t2);
              return typeof value === "function" ? value.bind(t2) : value;
            }
          });
        }
        return function patchConstructor(...args) {
          const self2 = this;
          const url = parseUrl(args[0] instanceof Request ? args[0].url : String(args[0])).href;
          const options = args[0] instanceof Request ? args[0] : args[1] || {};
          const createdSpan = plugin._createSpan(url, options);
          if (!createdSpan) {
            return original.apply(this, args);
          }
          const spanData = plugin._prepareSpanData(url);
          if (plugin.getConfig().measureRequestSize) {
            getFetchBodyLength(...args).then((bodyLength) => {
              if (!bodyLength)
                return;
              if (plugin._semconvStability & SemconvStability2.OLD) {
                createdSpan.setAttribute(ATTR_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED2, bodyLength);
              }
              if (plugin._semconvStability & SemconvStability2.STABLE) {
                createdSpan.setAttribute(ATTR_HTTP_REQUEST_BODY_SIZE2, bodyLength);
              }
            }).catch((error) => {
              plugin._diag.warn("getFetchBodyLength", error);
            });
          }
          function endSpanOnError(span, error) {
            plugin._applyAttributesAfterFetch(span, options, error);
            plugin._endSpan(span, spanData, {
              status: error.status || 0,
              statusText: error.message,
              url
            });
          }
          function endSpanOnSuccess(span, response) {
            plugin._applyAttributesAfterFetch(span, options, response);
            if (response.status >= 200 && response.status < 400) {
              plugin._endSpan(span, spanData, response);
            } else {
              plugin._endSpan(span, spanData, {
                status: response.status,
                statusText: response.statusText,
                url
              });
            }
          }
          function withCancelPropagation(body, readerClone) {
            if (!body)
              return null;
            const reader = body.getReader();
            return new ReadableStream({
              async pull(controller) {
                try {
                  const { value, done } = await reader.read();
                  if (done) {
                    reader.releaseLock();
                    controller.close();
                  } else {
                    controller.enqueue(value);
                  }
                } catch (err) {
                  controller.error(err);
                  reader.cancel(err).catch((_2) => {
                  });
                  try {
                    reader.releaseLock();
                  } catch (e2) {
                  }
                }
              },
              cancel(reason) {
                readerClone.cancel(reason).catch((_2) => {
                });
                return reader.cancel(reason);
              }
            });
          }
          function onSuccess(span, resolve, response) {
            let proxiedResponse = null;
            try {
              const resClone = response.clone();
              const body = resClone.body;
              if (body) {
                const reader = body.getReader();
                const isNullBodyStatus = (
                  // 101 responses and protocol upgrading is handled internally by the browser
                  response.status === 204 || response.status === 205 || response.status === 304
                );
                const wrappedBody = isNullBodyStatus ? null : withCancelPropagation(response.body, reader);
                const newResponse = new Response(wrappedBody, {
                  status: response.status,
                  statusText: response.statusText,
                  headers: response.headers
                });
                proxiedResponse = createResponseProxy(newResponse, response);
                const read = () => {
                  reader.read().then(({ done }) => {
                    if (done) {
                      endSpanOnSuccess(span, response);
                    } else {
                      read();
                    }
                  }, (error) => {
                    endSpanOnError(span, error);
                  });
                };
                read();
              } else {
                endSpanOnSuccess(span, response);
              }
            } finally {
              resolve(proxiedResponse != null ? proxiedResponse : response);
            }
          }
          function onError(span, reject, error) {
            try {
              endSpanOnError(span, error);
            } finally {
              reject(error);
            }
          }
          return new Promise((resolve, reject) => {
            return context.with(trace.setSpan(context.active(), createdSpan), () => {
              plugin._addHeaders(options, url);
              plugin._callRequestHook(createdSpan, options);
              plugin._tasksCount++;
              return original.apply(self2, options instanceof Request ? [options] : [url, options]).then(onSuccess.bind(self2, createdSpan, resolve), onError.bind(self2, createdSpan, reject));
            });
          });
        };
      };
    }
    _applyAttributesAfterFetch(span, request, result) {
      const applyCustomAttributesOnSpan = this.getConfig().applyCustomAttributesOnSpan;
      if (applyCustomAttributesOnSpan) {
        safeExecuteInTheMiddle2(() => applyCustomAttributesOnSpan(span, request, result), (error) => {
          if (!error) {
            return;
          }
          this._diag.error("applyCustomAttributesOnSpan", error);
        }, true);
      }
    }
    _callRequestHook(span, request) {
      const requestHook = this.getConfig().requestHook;
      if (requestHook) {
        safeExecuteInTheMiddle2(() => requestHook(span, request), (error) => {
          if (!error) {
            return;
          }
          this._diag.error("requestHook", error);
        }, true);
      }
    }
    /**
     * Prepares a span data - needed later for matching appropriate network
     *     resources
     * @param spanUrl
     */
    _prepareSpanData(spanUrl) {
      const startTime = hrTime();
      const entries = [];
      if (typeof PerformanceObserver !== "function") {
        return { entries, startTime, spanUrl };
      }
      const observer = new PerformanceObserver((list) => {
        const perfObsEntries = list.getEntries();
        perfObsEntries.forEach((entry) => {
          if (entry.initiatorType === "fetch" && entry.name === spanUrl) {
            entries.push(entry);
          }
        });
      });
      observer.observe({
        entryTypes: ["resource"]
      });
      return { entries, observer, startTime, spanUrl };
    }
    /**
     * implements enable function
     */
    enable() {
      if (!hasBrowserPerformanceAPI) {
        this._diag.warn("this instrumentation is intended for web usage only, it does not instrument server-side fetch()");
        return;
      }
      if (isWrapped2(fetch)) {
        this._unwrap(globalThis, "fetch");
        this._diag.debug("removing previous patch for constructor");
      }
      this._wrap(globalThis, "fetch", this._patchConstructor());
    }
    /**
     * implements unpatch function
     */
    disable() {
      if (!hasBrowserPerformanceAPI) {
        return;
      }
      this._unwrap(globalThis, "fetch");
      this._usedResources = /* @__PURE__ */ new WeakSet();
    }
  };

  // js-src/otel.js
  (function initOpenTelemetry() {
    var _a, _b, _c;
    const CONFIG = window.MatomoOpenTelemetry || {};
    if (!CONFIG.enabled) {
      return;
    }
    const OTEL_TRACE_URL = (_a = CONFIG.traceUrl) != null ? _a : "";
    const SERVICE_NAME = (_b = CONFIG.serviceName) != null ? _b : "matomo-frontend";
    const detectedResources = detectResources({
      detectors: [browserDetector]
    });
    const customAttributes = parseResourceAttributes(
      CONFIG.resourceAttributes
    );
    let resource = resourceFromAttributes({
      [ATTR_SERVICE_NAME]: SERVICE_NAME,
      ...customAttributes
    });
    resource = resource.merge(detectedResources);
    const provider = new WebTracerProvider({
      resource,
      spanProcessors: [
        new BatchSpanProcessor(
          new OTLPTraceExporter({ url: OTEL_TRACE_URL })
        )
      ]
    });
    provider.register({
      contextManager: new ZoneContextManager(),
      propagator: new CompositePropagator({
        propagators: [
          new W3CTraceContextPropagator()
        ]
      })
    });
    const instrumentations = [];
    if (CONFIG.enableDocumentLoadMonitoring) {
      instrumentations.push(
        new DocumentLoadInstrumentation()
      );
    }
    if (CONFIG.enableUserInteractionMonitoring) {
      instrumentations.push(
        new UserInteractionInstrumentation()
      );
    }
    if (CONFIG.enableXMLHttpRequestMonitoring) {
      instrumentations.push(
        new XMLHttpRequestInstrumentation({
          propagateTraceHeaderCorsUrls: [/.*/]
        })
      );
      instrumentations.push(
        new FetchInstrumentation({
          propagateTraceHeaderCorsUrls: [/.*/]
        })
      );
    }
    if (instrumentations.length > 0) {
      registerInstrumentations({
        instrumentations
      });
    }
    const tracer = trace.getTracer(SERVICE_NAME);
    let currentPageSpan = null;
    let currentPageContext = context.active();
    if (CONFIG.enableUxMonitoring) {
      let startPageSpan = function() {
        if (currentPageSpan) {
          currentPageSpan.end();
        }
        currentPageSpan = tracer.startSpan("ui.page", {
          attributes: {
            "http.url": window.location.href,
            "http.path": window.location.pathname,
            "http.title": document.title
          }
        });
        currentPageContext = trace.setSpan(context.active(), currentPageSpan);
      };
      startPageSpan();
      window.addEventListener("hashchange", () => {
        startPageSpan();
      });
      window.addEventListener("beforeunload", () => {
        if (currentPageSpan) {
          currentPageSpan.end();
        }
      });
    }
    function parseResourceAttributes(input) {
      if (!input || typeof input !== "string") {
        return {};
      }
      return input.split(",").map((pair) => pair.trim()).filter(Boolean).reduce((acc, pair) => {
        const [key, ...rest] = pair.split("=");
        if (!key || rest.length === 0) {
          return acc;
        }
        acc[key.trim()] = rest.join("=").trim();
        return acc;
      }, {});
    }
    function recordErrorSpan(name, error) {
      var _a2;
      try {
        const span = tracer.startSpan(name, {}, currentPageContext);
        span.recordException(error);
        span.setStatus({ code: SpanStatusCode.ERROR });
        span.setAttribute("error.message", error.message);
        span.setAttribute("error.name", error.name);
        span.setAttribute("error.stack", (_a2 = error.stack) != null ? _a2 : "");
        span.setAttribute("http.url", window.location.href);
        span.setAttribute("http.path", window.location.pathname);
        span.setAttribute("http.title", document.title);
        span.end();
        provider.forceFlush();
      } catch (e2) {
        console.warn("OpenTelemetry: failed to record error span", e2);
      }
    }
    window.addEventListener("error", (event) => {
      recordErrorSpan("js.error", event.error || new Error(event.message));
    });
    window.addEventListener("unhandledrejection", (event) => {
      recordErrorSpan(
        "js.unhandled_promise",
        event.reason instanceof Error ? event.reason : new Error(String(event.reason))
      );
    });
    function observeAjaxErrors() {
      const container = document.getElementById("ajaxError");
      if (!container) {
        return;
      }
      const observer = new MutationObserver((mutations) => {
        var _a2, _b2, _c2, _d;
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (!(node instanceof HTMLElement)) {
              continue;
            }
            const errorNode = ((_a2 = node.matches) == null ? void 0 : _a2.call(node, ".notification-error")) ? node : (_b2 = node.querySelector) == null ? void 0 : _b2.call(node, ".notification-error");
            if (!errorNode) {
              continue;
            }
            const message = (_d = (_c2 = errorNode.querySelector(".notification-body div")) == null ? void 0 : _c2.innerText) == null ? void 0 : _d.trim();
            if (!message) {
              continue;
            }
            const span = tracer.startSpan(
              "ui.notification.error",
              {
                attributes: {
                  "ui.notification.type": "error",
                  "ui.notification.message": message,
                  "http.url": window.location.href,
                  "http.path": window.location.pathname
                }
              },
              currentPageContext
            );
            span.setStatus({ code: SpanStatusCode.ERROR });
            span.end();
          }
        }
      });
      observer.observe(container, {
        childList: true,
        subtree: true
      });
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", observeAjaxErrors);
    } else {
      observeAjaxErrors();
    }
    if (CONFIG.enableWebVitals) {
      let emitWebVital = function(metric) {
        const span = tracer.startSpan(
          "browser.web_vital",
          {
            attributes: {
              "http.url": window.location.href,
              "http.path": window.location.pathname
            }
          },
          currentPageContext
        );
        span.addEvent("browser.web_vital", {
          name: metric.name,
          value: metric.value,
          delta: metric.delta,
          id: metric.id
        });
        span.end();
      };
      L(emitWebVital);
      x(emitWebVital);
      S(emitWebVital);
    }
    if (CONFIG.enableUxMonitoring && "PerformanceObserver" in window && ((_c = PerformanceObserver.supportedEntryTypes) == null ? void 0 : _c.includes("longtask"))) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const span = tracer.startSpan(
            "ux.long_task",
            {
              attributes: {
                "http.url": window.location.href,
                "http.path": window.location.pathname
              }
            },
            currentPageContext
          );
          span.addEvent("ux.long_task", {
            duration: entry.duration,
            startTime: entry.startTime
          });
          span.end();
        }
      });
      observer.observe({ entryTypes: ["longtask"] });
    }
  })();
})();
/*! Bundled license information:

zone.js/fesm2015/zone.js:
  (**
   * @license Angular
   * (c) 2010-2025 Google LLC. https://angular.dev/
   * License: MIT
   *)
*/
//# sourceMappingURL=otel.js.map
