"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/.pnpm/reflect-metadata@0.2.2/node_modules/reflect-metadata/Reflect.js
  var require_Reflect = __commonJS({
    "node_modules/.pnpm/reflect-metadata@0.2.2/node_modules/reflect-metadata/Reflect.js"() {
      "use strict";
      var Reflect2;
      (function(Reflect3) {
        (function(factory) {
          var root = typeof globalThis === "object" ? globalThis : typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : sloppyModeThis();
          var exporter = makeExporter(Reflect3);
          if (typeof root.Reflect !== "undefined") {
            exporter = makeExporter(root.Reflect, exporter);
          }
          factory(exporter, root);
          if (typeof root.Reflect === "undefined") {
            root.Reflect = Reflect3;
          }
          function makeExporter(target, previous) {
            return function(key, value) {
              Object.defineProperty(target, key, { configurable: true, writable: true, value });
              if (previous)
                previous(key, value);
            };
          }
          function functionThis() {
            try {
              return Function("return this;")();
            } catch (_) {
            }
          }
          function indirectEvalThis() {
            try {
              return (void 0, eval)("(function() { return this; })()");
            } catch (_) {
            }
          }
          function sloppyModeThis() {
            return functionThis() || indirectEvalThis();
          }
        })(function(exporter, root) {
          var hasOwn = Object.prototype.hasOwnProperty;
          var supportsSymbol = typeof Symbol === "function";
          var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
          var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
          var supportsCreate = typeof Object.create === "function";
          var supportsProto = { __proto__: [] } instanceof Array;
          var downLevel = !supportsCreate && !supportsProto;
          var HashMap = {
            // create an object in dictionary mode (a.k.a. "slow" mode in v8)
            create: supportsCreate ? function() {
              return MakeDictionary(/* @__PURE__ */ Object.create(null));
            } : supportsProto ? function() {
              return MakeDictionary({ __proto__: null });
            } : function() {
              return MakeDictionary({});
            },
            has: downLevel ? function(map, key) {
              return hasOwn.call(map, key);
            } : function(map, key) {
              return key in map;
            },
            get: downLevel ? function(map, key) {
              return hasOwn.call(map, key) ? map[key] : void 0;
            } : function(map, key) {
              return map[key];
            }
          };
          var functionPrototype = Object.getPrototypeOf(Function);
          var _Map = typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
          var _Set = typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
          var _WeakMap = typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
          var registrySymbol = supportsSymbol ? /* @__PURE__ */ Symbol.for("@reflect-metadata:registry") : void 0;
          var metadataRegistry = GetOrCreateMetadataRegistry();
          var metadataProvider = CreateMetadataProvider(metadataRegistry);
          function decorate(decorators, target, propertyKey, attributes) {
            if (!IsUndefined(propertyKey)) {
              if (!IsArray(decorators))
                throw new TypeError();
              if (!IsObject(target))
                throw new TypeError();
              if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                throw new TypeError();
              if (IsNull(attributes))
                attributes = void 0;
              propertyKey = ToPropertyKey(propertyKey);
              return DecorateProperty(decorators, target, propertyKey, attributes);
            } else {
              if (!IsArray(decorators))
                throw new TypeError();
              if (!IsConstructor(target))
                throw new TypeError();
              return DecorateConstructor(decorators, target);
            }
          }
          exporter("decorate", decorate);
          function metadata(metadataKey, metadataValue) {
            function decorator(target, propertyKey) {
              if (!IsObject(target))
                throw new TypeError();
              if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                throw new TypeError();
              OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
            }
            return decorator;
          }
          exporter("metadata", metadata);
          function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
            if (!IsObject(target))
              throw new TypeError();
            if (!IsUndefined(propertyKey))
              propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
          }
          exporter("defineMetadata", defineMetadata);
          function hasMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
              throw new TypeError();
            if (!IsUndefined(propertyKey))
              propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasMetadata(metadataKey, target, propertyKey);
          }
          exporter("hasMetadata", hasMetadata);
          function hasOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
              throw new TypeError();
            if (!IsUndefined(propertyKey))
              propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
          }
          exporter("hasOwnMetadata", hasOwnMetadata);
          function getMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
              throw new TypeError();
            if (!IsUndefined(propertyKey))
              propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetMetadata(metadataKey, target, propertyKey);
          }
          exporter("getMetadata", getMetadata);
          function getOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
              throw new TypeError();
            if (!IsUndefined(propertyKey))
              propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
          }
          exporter("getOwnMetadata", getOwnMetadata);
          function getMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
              throw new TypeError();
            if (!IsUndefined(propertyKey))
              propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryMetadataKeys(target, propertyKey);
          }
          exporter("getMetadataKeys", getMetadataKeys);
          function getOwnMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
              throw new TypeError();
            if (!IsUndefined(propertyKey))
              propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryOwnMetadataKeys(target, propertyKey);
          }
          exporter("getOwnMetadataKeys", getOwnMetadataKeys);
          function deleteMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
              throw new TypeError();
            if (!IsUndefined(propertyKey))
              propertyKey = ToPropertyKey(propertyKey);
            if (!IsObject(target))
              throw new TypeError();
            if (!IsUndefined(propertyKey))
              propertyKey = ToPropertyKey(propertyKey);
            var provider = GetMetadataProvider(
              target,
              propertyKey,
              /*Create*/
              false
            );
            if (IsUndefined(provider))
              return false;
            return provider.OrdinaryDeleteMetadata(metadataKey, target, propertyKey);
          }
          exporter("deleteMetadata", deleteMetadata);
          function DecorateConstructor(decorators, target) {
            for (var i = decorators.length - 1; i >= 0; --i) {
              var decorator = decorators[i];
              var decorated = decorator(target);
              if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsConstructor(decorated))
                  throw new TypeError();
                target = decorated;
              }
            }
            return target;
          }
          function DecorateProperty(decorators, target, propertyKey, descriptor) {
            for (var i = decorators.length - 1; i >= 0; --i) {
              var decorator = decorators[i];
              var decorated = decorator(target, propertyKey, descriptor);
              if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsObject(decorated))
                  throw new TypeError();
                descriptor = decorated;
              }
            }
            return descriptor;
          }
          function OrdinaryHasMetadata(MetadataKey, O, P) {
            var hasOwn2 = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn2)
              return true;
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
              return OrdinaryHasMetadata(MetadataKey, parent, P);
            return false;
          }
          function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
            var provider = GetMetadataProvider(
              O,
              P,
              /*Create*/
              false
            );
            if (IsUndefined(provider))
              return false;
            return ToBoolean(provider.OrdinaryHasOwnMetadata(MetadataKey, O, P));
          }
          function OrdinaryGetMetadata(MetadataKey, O, P) {
            var hasOwn2 = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn2)
              return OrdinaryGetOwnMetadata(MetadataKey, O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
              return OrdinaryGetMetadata(MetadataKey, parent, P);
            return void 0;
          }
          function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
            var provider = GetMetadataProvider(
              O,
              P,
              /*Create*/
              false
            );
            if (IsUndefined(provider))
              return;
            return provider.OrdinaryGetOwnMetadata(MetadataKey, O, P);
          }
          function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
            var provider = GetMetadataProvider(
              O,
              P,
              /*Create*/
              true
            );
            provider.OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P);
          }
          function OrdinaryMetadataKeys(O, P) {
            var ownKeys = OrdinaryOwnMetadataKeys(O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (parent === null)
              return ownKeys;
            var parentKeys = OrdinaryMetadataKeys(parent, P);
            if (parentKeys.length <= 0)
              return ownKeys;
            if (ownKeys.length <= 0)
              return parentKeys;
            var set = new _Set();
            var keys = [];
            for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
              var key = ownKeys_1[_i];
              var hasKey = set.has(key);
              if (!hasKey) {
                set.add(key);
                keys.push(key);
              }
            }
            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
              var key = parentKeys_1[_a];
              var hasKey = set.has(key);
              if (!hasKey) {
                set.add(key);
                keys.push(key);
              }
            }
            return keys;
          }
          function OrdinaryOwnMetadataKeys(O, P) {
            var provider = GetMetadataProvider(
              O,
              P,
              /*create*/
              false
            );
            if (!provider) {
              return [];
            }
            return provider.OrdinaryOwnMetadataKeys(O, P);
          }
          function Type(x) {
            if (x === null)
              return 1;
            switch (typeof x) {
              case "undefined":
                return 0;
              case "boolean":
                return 2;
              case "string":
                return 3;
              case "symbol":
                return 4;
              case "number":
                return 5;
              case "object":
                return x === null ? 1 : 6;
              default:
                return 6;
            }
          }
          function IsUndefined(x) {
            return x === void 0;
          }
          function IsNull(x) {
            return x === null;
          }
          function IsSymbol(x) {
            return typeof x === "symbol";
          }
          function IsObject(x) {
            return typeof x === "object" ? x !== null : typeof x === "function";
          }
          function ToPrimitive(input, PreferredType) {
            switch (Type(input)) {
              case 0:
                return input;
              case 1:
                return input;
              case 2:
                return input;
              case 3:
                return input;
              case 4:
                return input;
              case 5:
                return input;
            }
            var hint = PreferredType === 3 ? "string" : PreferredType === 5 ? "number" : "default";
            var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
            if (exoticToPrim !== void 0) {
              var result = exoticToPrim.call(input, hint);
              if (IsObject(result))
                throw new TypeError();
              return result;
            }
            return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
          }
          function OrdinaryToPrimitive(O, hint) {
            if (hint === "string") {
              var toString_1 = O.toString;
              if (IsCallable(toString_1)) {
                var result = toString_1.call(O);
                if (!IsObject(result))
                  return result;
              }
              var valueOf = O.valueOf;
              if (IsCallable(valueOf)) {
                var result = valueOf.call(O);
                if (!IsObject(result))
                  return result;
              }
            } else {
              var valueOf = O.valueOf;
              if (IsCallable(valueOf)) {
                var result = valueOf.call(O);
                if (!IsObject(result))
                  return result;
              }
              var toString_2 = O.toString;
              if (IsCallable(toString_2)) {
                var result = toString_2.call(O);
                if (!IsObject(result))
                  return result;
              }
            }
            throw new TypeError();
          }
          function ToBoolean(argument) {
            return !!argument;
          }
          function ToString(argument) {
            return "" + argument;
          }
          function ToPropertyKey(argument) {
            var key = ToPrimitive(
              argument,
              3
              /* String */
            );
            if (IsSymbol(key))
              return key;
            return ToString(key);
          }
          function IsArray(argument) {
            return Array.isArray ? Array.isArray(argument) : argument instanceof Object ? argument instanceof Array : Object.prototype.toString.call(argument) === "[object Array]";
          }
          function IsCallable(argument) {
            return typeof argument === "function";
          }
          function IsConstructor(argument) {
            return typeof argument === "function";
          }
          function IsPropertyKey(argument) {
            switch (Type(argument)) {
              case 3:
                return true;
              case 4:
                return true;
              default:
                return false;
            }
          }
          function SameValueZero(x, y) {
            return x === y || x !== x && y !== y;
          }
          function GetMethod(V, P) {
            var func = V[P];
            if (func === void 0 || func === null)
              return void 0;
            if (!IsCallable(func))
              throw new TypeError();
            return func;
          }
          function GetIterator(obj) {
            var method = GetMethod(obj, iteratorSymbol);
            if (!IsCallable(method))
              throw new TypeError();
            var iterator = method.call(obj);
            if (!IsObject(iterator))
              throw new TypeError();
            return iterator;
          }
          function IteratorValue(iterResult) {
            return iterResult.value;
          }
          function IteratorStep(iterator) {
            var result = iterator.next();
            return result.done ? false : result;
          }
          function IteratorClose(iterator) {
            var f = iterator["return"];
            if (f)
              f.call(iterator);
          }
          function OrdinaryGetPrototypeOf(O) {
            var proto = Object.getPrototypeOf(O);
            if (typeof O !== "function" || O === functionPrototype)
              return proto;
            if (proto !== functionPrototype)
              return proto;
            var prototype = O.prototype;
            var prototypeProto = prototype && Object.getPrototypeOf(prototype);
            if (prototypeProto == null || prototypeProto === Object.prototype)
              return proto;
            var constructor = prototypeProto.constructor;
            if (typeof constructor !== "function")
              return proto;
            if (constructor === O)
              return proto;
            return constructor;
          }
          function CreateMetadataRegistry() {
            var fallback;
            if (!IsUndefined(registrySymbol) && typeof root.Reflect !== "undefined" && !(registrySymbol in root.Reflect) && typeof root.Reflect.defineMetadata === "function") {
              fallback = CreateFallbackProvider(root.Reflect);
            }
            var first;
            var second;
            var rest;
            var targetProviderMap = new _WeakMap();
            var registry = {
              registerProvider,
              getProvider,
              setProvider
            };
            return registry;
            function registerProvider(provider) {
              if (!Object.isExtensible(registry)) {
                throw new Error("Cannot add provider to a frozen registry.");
              }
              switch (true) {
                case fallback === provider:
                  break;
                case IsUndefined(first):
                  first = provider;
                  break;
                case first === provider:
                  break;
                case IsUndefined(second):
                  second = provider;
                  break;
                case second === provider:
                  break;
                default:
                  if (rest === void 0)
                    rest = new _Set();
                  rest.add(provider);
                  break;
              }
            }
            function getProviderNoCache(O, P) {
              if (!IsUndefined(first)) {
                if (first.isProviderFor(O, P))
                  return first;
                if (!IsUndefined(second)) {
                  if (second.isProviderFor(O, P))
                    return first;
                  if (!IsUndefined(rest)) {
                    var iterator = GetIterator(rest);
                    while (true) {
                      var next = IteratorStep(iterator);
                      if (!next) {
                        return void 0;
                      }
                      var provider = IteratorValue(next);
                      if (provider.isProviderFor(O, P)) {
                        IteratorClose(iterator);
                        return provider;
                      }
                    }
                  }
                }
              }
              if (!IsUndefined(fallback) && fallback.isProviderFor(O, P)) {
                return fallback;
              }
              return void 0;
            }
            function getProvider(O, P) {
              var providerMap = targetProviderMap.get(O);
              var provider;
              if (!IsUndefined(providerMap)) {
                provider = providerMap.get(P);
              }
              if (!IsUndefined(provider)) {
                return provider;
              }
              provider = getProviderNoCache(O, P);
              if (!IsUndefined(provider)) {
                if (IsUndefined(providerMap)) {
                  providerMap = new _Map();
                  targetProviderMap.set(O, providerMap);
                }
                providerMap.set(P, provider);
              }
              return provider;
            }
            function hasProvider(provider) {
              if (IsUndefined(provider))
                throw new TypeError();
              return first === provider || second === provider || !IsUndefined(rest) && rest.has(provider);
            }
            function setProvider(O, P, provider) {
              if (!hasProvider(provider)) {
                throw new Error("Metadata provider not registered.");
              }
              var existingProvider = getProvider(O, P);
              if (existingProvider !== provider) {
                if (!IsUndefined(existingProvider)) {
                  return false;
                }
                var providerMap = targetProviderMap.get(O);
                if (IsUndefined(providerMap)) {
                  providerMap = new _Map();
                  targetProviderMap.set(O, providerMap);
                }
                providerMap.set(P, provider);
              }
              return true;
            }
          }
          function GetOrCreateMetadataRegistry() {
            var metadataRegistry2;
            if (!IsUndefined(registrySymbol) && IsObject(root.Reflect) && Object.isExtensible(root.Reflect)) {
              metadataRegistry2 = root.Reflect[registrySymbol];
            }
            if (IsUndefined(metadataRegistry2)) {
              metadataRegistry2 = CreateMetadataRegistry();
            }
            if (!IsUndefined(registrySymbol) && IsObject(root.Reflect) && Object.isExtensible(root.Reflect)) {
              Object.defineProperty(root.Reflect, registrySymbol, {
                enumerable: false,
                configurable: false,
                writable: false,
                value: metadataRegistry2
              });
            }
            return metadataRegistry2;
          }
          function CreateMetadataProvider(registry) {
            var metadata2 = new _WeakMap();
            var provider = {
              isProviderFor: function(O, P) {
                var targetMetadata = metadata2.get(O);
                if (IsUndefined(targetMetadata))
                  return false;
                return targetMetadata.has(P);
              },
              OrdinaryDefineOwnMetadata: OrdinaryDefineOwnMetadata2,
              OrdinaryHasOwnMetadata: OrdinaryHasOwnMetadata2,
              OrdinaryGetOwnMetadata: OrdinaryGetOwnMetadata2,
              OrdinaryOwnMetadataKeys: OrdinaryOwnMetadataKeys2,
              OrdinaryDeleteMetadata
            };
            metadataRegistry.registerProvider(provider);
            return provider;
            function GetOrCreateMetadataMap(O, P, Create) {
              var targetMetadata = metadata2.get(O);
              var createdTargetMetadata = false;
              if (IsUndefined(targetMetadata)) {
                if (!Create)
                  return void 0;
                targetMetadata = new _Map();
                metadata2.set(O, targetMetadata);
                createdTargetMetadata = true;
              }
              var metadataMap = targetMetadata.get(P);
              if (IsUndefined(metadataMap)) {
                if (!Create)
                  return void 0;
                metadataMap = new _Map();
                targetMetadata.set(P, metadataMap);
                if (!registry.setProvider(O, P, provider)) {
                  targetMetadata.delete(P);
                  if (createdTargetMetadata) {
                    metadata2.delete(O);
                  }
                  throw new Error("Wrong provider for target.");
                }
              }
              return metadataMap;
            }
            function OrdinaryHasOwnMetadata2(MetadataKey, O, P) {
              var metadataMap = GetOrCreateMetadataMap(
                O,
                P,
                /*Create*/
                false
              );
              if (IsUndefined(metadataMap))
                return false;
              return ToBoolean(metadataMap.has(MetadataKey));
            }
            function OrdinaryGetOwnMetadata2(MetadataKey, O, P) {
              var metadataMap = GetOrCreateMetadataMap(
                O,
                P,
                /*Create*/
                false
              );
              if (IsUndefined(metadataMap))
                return void 0;
              return metadataMap.get(MetadataKey);
            }
            function OrdinaryDefineOwnMetadata2(MetadataKey, MetadataValue, O, P) {
              var metadataMap = GetOrCreateMetadataMap(
                O,
                P,
                /*Create*/
                true
              );
              metadataMap.set(MetadataKey, MetadataValue);
            }
            function OrdinaryOwnMetadataKeys2(O, P) {
              var keys = [];
              var metadataMap = GetOrCreateMetadataMap(
                O,
                P,
                /*Create*/
                false
              );
              if (IsUndefined(metadataMap))
                return keys;
              var keysObj = metadataMap.keys();
              var iterator = GetIterator(keysObj);
              var k = 0;
              while (true) {
                var next = IteratorStep(iterator);
                if (!next) {
                  keys.length = k;
                  return keys;
                }
                var nextValue = IteratorValue(next);
                try {
                  keys[k] = nextValue;
                } catch (e) {
                  try {
                    IteratorClose(iterator);
                  } finally {
                    throw e;
                  }
                }
                k++;
              }
            }
            function OrdinaryDeleteMetadata(MetadataKey, O, P) {
              var metadataMap = GetOrCreateMetadataMap(
                O,
                P,
                /*Create*/
                false
              );
              if (IsUndefined(metadataMap))
                return false;
              if (!metadataMap.delete(MetadataKey))
                return false;
              if (metadataMap.size === 0) {
                var targetMetadata = metadata2.get(O);
                if (!IsUndefined(targetMetadata)) {
                  targetMetadata.delete(P);
                  if (targetMetadata.size === 0) {
                    metadata2.delete(targetMetadata);
                  }
                }
              }
              return true;
            }
          }
          function CreateFallbackProvider(reflect) {
            var defineMetadata2 = reflect.defineMetadata, hasOwnMetadata2 = reflect.hasOwnMetadata, getOwnMetadata2 = reflect.getOwnMetadata, getOwnMetadataKeys2 = reflect.getOwnMetadataKeys, deleteMetadata2 = reflect.deleteMetadata;
            var metadataOwner = new _WeakMap();
            var provider = {
              isProviderFor: function(O, P) {
                var metadataPropertySet = metadataOwner.get(O);
                if (!IsUndefined(metadataPropertySet) && metadataPropertySet.has(P)) {
                  return true;
                }
                if (getOwnMetadataKeys2(O, P).length) {
                  if (IsUndefined(metadataPropertySet)) {
                    metadataPropertySet = new _Set();
                    metadataOwner.set(O, metadataPropertySet);
                  }
                  metadataPropertySet.add(P);
                  return true;
                }
                return false;
              },
              OrdinaryDefineOwnMetadata: defineMetadata2,
              OrdinaryHasOwnMetadata: hasOwnMetadata2,
              OrdinaryGetOwnMetadata: getOwnMetadata2,
              OrdinaryOwnMetadataKeys: getOwnMetadataKeys2,
              OrdinaryDeleteMetadata: deleteMetadata2
            };
            return provider;
          }
          function GetMetadataProvider(O, P, Create) {
            var registeredProvider = metadataRegistry.getProvider(O, P);
            if (!IsUndefined(registeredProvider)) {
              return registeredProvider;
            }
            if (Create) {
              if (metadataRegistry.setProvider(O, P, metadataProvider)) {
                return metadataProvider;
              }
              throw new Error("Illegal state.");
            }
            return void 0;
          }
          function CreateMapPolyfill() {
            var cacheSentinel = {};
            var arraySentinel = [];
            var MapIterator = (
              /** @class */
              (function() {
                function MapIterator2(keys, values, selector) {
                  this._index = 0;
                  this._keys = keys;
                  this._values = values;
                  this._selector = selector;
                }
                MapIterator2.prototype["@@iterator"] = function() {
                  return this;
                };
                MapIterator2.prototype[iteratorSymbol] = function() {
                  return this;
                };
                MapIterator2.prototype.next = function() {
                  var index = this._index;
                  if (index >= 0 && index < this._keys.length) {
                    var result = this._selector(this._keys[index], this._values[index]);
                    if (index + 1 >= this._keys.length) {
                      this._index = -1;
                      this._keys = arraySentinel;
                      this._values = arraySentinel;
                    } else {
                      this._index++;
                    }
                    return { value: result, done: false };
                  }
                  return { value: void 0, done: true };
                };
                MapIterator2.prototype.throw = function(error) {
                  if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                  }
                  throw error;
                };
                MapIterator2.prototype.return = function(value) {
                  if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                  }
                  return { value, done: true };
                };
                return MapIterator2;
              })()
            );
            var Map2 = (
              /** @class */
              (function() {
                function Map3() {
                  this._keys = [];
                  this._values = [];
                  this._cacheKey = cacheSentinel;
                  this._cacheIndex = -2;
                }
                Object.defineProperty(Map3.prototype, "size", {
                  get: function() {
                    return this._keys.length;
                  },
                  enumerable: true,
                  configurable: true
                });
                Map3.prototype.has = function(key) {
                  return this._find(
                    key,
                    /*insert*/
                    false
                  ) >= 0;
                };
                Map3.prototype.get = function(key) {
                  var index = this._find(
                    key,
                    /*insert*/
                    false
                  );
                  return index >= 0 ? this._values[index] : void 0;
                };
                Map3.prototype.set = function(key, value) {
                  var index = this._find(
                    key,
                    /*insert*/
                    true
                  );
                  this._values[index] = value;
                  return this;
                };
                Map3.prototype.delete = function(key) {
                  var index = this._find(
                    key,
                    /*insert*/
                    false
                  );
                  if (index >= 0) {
                    var size = this._keys.length;
                    for (var i = index + 1; i < size; i++) {
                      this._keys[i - 1] = this._keys[i];
                      this._values[i - 1] = this._values[i];
                    }
                    this._keys.length--;
                    this._values.length--;
                    if (SameValueZero(key, this._cacheKey)) {
                      this._cacheKey = cacheSentinel;
                      this._cacheIndex = -2;
                    }
                    return true;
                  }
                  return false;
                };
                Map3.prototype.clear = function() {
                  this._keys.length = 0;
                  this._values.length = 0;
                  this._cacheKey = cacheSentinel;
                  this._cacheIndex = -2;
                };
                Map3.prototype.keys = function() {
                  return new MapIterator(this._keys, this._values, getKey);
                };
                Map3.prototype.values = function() {
                  return new MapIterator(this._keys, this._values, getValue);
                };
                Map3.prototype.entries = function() {
                  return new MapIterator(this._keys, this._values, getEntry);
                };
                Map3.prototype["@@iterator"] = function() {
                  return this.entries();
                };
                Map3.prototype[iteratorSymbol] = function() {
                  return this.entries();
                };
                Map3.prototype._find = function(key, insert) {
                  if (!SameValueZero(this._cacheKey, key)) {
                    this._cacheIndex = -1;
                    for (var i = 0; i < this._keys.length; i++) {
                      if (SameValueZero(this._keys[i], key)) {
                        this._cacheIndex = i;
                        break;
                      }
                    }
                  }
                  if (this._cacheIndex < 0 && insert) {
                    this._cacheIndex = this._keys.length;
                    this._keys.push(key);
                    this._values.push(void 0);
                  }
                  return this._cacheIndex;
                };
                return Map3;
              })()
            );
            return Map2;
            function getKey(key, _) {
              return key;
            }
            function getValue(_, value) {
              return value;
            }
            function getEntry(key, value) {
              return [key, value];
            }
          }
          function CreateSetPolyfill() {
            var Set2 = (
              /** @class */
              (function() {
                function Set3() {
                  this._map = new _Map();
                }
                Object.defineProperty(Set3.prototype, "size", {
                  get: function() {
                    return this._map.size;
                  },
                  enumerable: true,
                  configurable: true
                });
                Set3.prototype.has = function(value) {
                  return this._map.has(value);
                };
                Set3.prototype.add = function(value) {
                  return this._map.set(value, value), this;
                };
                Set3.prototype.delete = function(value) {
                  return this._map.delete(value);
                };
                Set3.prototype.clear = function() {
                  this._map.clear();
                };
                Set3.prototype.keys = function() {
                  return this._map.keys();
                };
                Set3.prototype.values = function() {
                  return this._map.keys();
                };
                Set3.prototype.entries = function() {
                  return this._map.entries();
                };
                Set3.prototype["@@iterator"] = function() {
                  return this.keys();
                };
                Set3.prototype[iteratorSymbol] = function() {
                  return this.keys();
                };
                return Set3;
              })()
            );
            return Set2;
          }
          function CreateWeakMapPolyfill() {
            var UUID_SIZE = 16;
            var keys = HashMap.create();
            var rootKey = CreateUniqueKey();
            return (
              /** @class */
              (function() {
                function WeakMap2() {
                  this._key = CreateUniqueKey();
                }
                WeakMap2.prototype.has = function(target) {
                  var table = GetOrCreateWeakMapTable(
                    target,
                    /*create*/
                    false
                  );
                  return table !== void 0 ? HashMap.has(table, this._key) : false;
                };
                WeakMap2.prototype.get = function(target) {
                  var table = GetOrCreateWeakMapTable(
                    target,
                    /*create*/
                    false
                  );
                  return table !== void 0 ? HashMap.get(table, this._key) : void 0;
                };
                WeakMap2.prototype.set = function(target, value) {
                  var table = GetOrCreateWeakMapTable(
                    target,
                    /*create*/
                    true
                  );
                  table[this._key] = value;
                  return this;
                };
                WeakMap2.prototype.delete = function(target) {
                  var table = GetOrCreateWeakMapTable(
                    target,
                    /*create*/
                    false
                  );
                  return table !== void 0 ? delete table[this._key] : false;
                };
                WeakMap2.prototype.clear = function() {
                  this._key = CreateUniqueKey();
                };
                return WeakMap2;
              })()
            );
            function CreateUniqueKey() {
              var key;
              do
                key = "@@WeakMap@@" + CreateUUID();
              while (HashMap.has(keys, key));
              keys[key] = true;
              return key;
            }
            function GetOrCreateWeakMapTable(target, create) {
              if (!hasOwn.call(target, rootKey)) {
                if (!create)
                  return void 0;
                Object.defineProperty(target, rootKey, { value: HashMap.create() });
              }
              return target[rootKey];
            }
            function FillRandomBytes(buffer, size) {
              for (var i = 0; i < size; ++i)
                buffer[i] = Math.random() * 255 | 0;
              return buffer;
            }
            function GenRandomBytes(size) {
              if (typeof Uint8Array === "function") {
                var array = new Uint8Array(size);
                if (typeof crypto !== "undefined") {
                  crypto.getRandomValues(array);
                } else if (typeof msCrypto !== "undefined") {
                  msCrypto.getRandomValues(array);
                } else {
                  FillRandomBytes(array, size);
                }
                return array;
              }
              return FillRandomBytes(new Array(size), size);
            }
            function CreateUUID() {
              var data = GenRandomBytes(UUID_SIZE);
              data[6] = data[6] & 79 | 64;
              data[8] = data[8] & 191 | 128;
              var result = "";
              for (var offset = 0; offset < UUID_SIZE; ++offset) {
                var byte = data[offset];
                if (offset === 4 || offset === 6 || offset === 8)
                  result += "-";
                if (byte < 16)
                  result += "0";
                result += byte.toString(16).toLowerCase();
              }
              return result;
            }
          }
          function MakeDictionary(obj) {
            obj.__ = void 0;
            delete obj.__;
            return obj;
          }
        });
      })(Reflect2 || (Reflect2 = {}));
    }
  });

  // node_modules/.pnpm/bondage-club-mod-sdk@1.2.0/node_modules/bondage-club-mod-sdk/dist/bcmodsdk.js
  var require_bcmodsdk = __commonJS({
    "node_modules/.pnpm/bondage-club-mod-sdk@1.2.0/node_modules/bondage-club-mod-sdk/dist/bcmodsdk.js"(exports) {
      "use strict";
      var bcModSdk2 = (function() {
        "use strict";
        const o = "1.2.0";
        function e(o2) {
          alert("Mod ERROR:\n" + o2);
          const e2 = new Error(o2);
          throw console.error(e2), e2;
        }
        const t = new TextEncoder();
        function n(o2) {
          return !!o2 && "object" == typeof o2 && !Array.isArray(o2);
        }
        function r(o2) {
          const e2 = /* @__PURE__ */ new Set();
          return o2.filter(((o3) => !e2.has(o3) && e2.add(o3)));
        }
        const i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set();
        function c(o2) {
          a.has(o2) || (a.add(o2), console.warn(o2));
        }
        function s(o2) {
          const e2 = [], t2 = /* @__PURE__ */ new Map(), n2 = /* @__PURE__ */ new Set();
          for (const r3 of f.values()) {
            const i3 = r3.patching.get(o2.name);
            if (i3) {
              e2.push(...i3.hooks);
              for (const [e3, a2] of i3.patches.entries()) t2.has(e3) && t2.get(e3) !== a2 && c(`ModSDK: Mod '${r3.name}' is patching function ${o2.name} with same pattern that is already applied by different mod, but with different pattern:
Pattern:
${e3}
Patch1:
${t2.get(e3) || ""}
Patch2:
${a2}`), t2.set(e3, a2), n2.add(r3.name);
            }
          }
          e2.sort(((o3, e3) => e3.priority - o3.priority));
          const r2 = (function(o3, e3) {
            if (0 === e3.size) return o3;
            let t3 = o3.toString().replaceAll("\r\n", "\n");
            for (const [n3, r3] of e3.entries()) t3.includes(n3) || c(`ModSDK: Patching ${o3.name}: Patch ${n3} not applied`), t3 = t3.replaceAll(n3, r3);
            return (0, eval)(`(${t3})`);
          })(o2.original, t2);
          let i2 = function(e3) {
            var t3, i3;
            const a2 = null === (i3 = (t3 = m.errorReporterHooks).hookChainExit) || void 0 === i3 ? void 0 : i3.call(t3, o2.name, n2), c2 = r2.apply(this, e3);
            return null == a2 || a2(), c2;
          };
          for (let t3 = e2.length - 1; t3 >= 0; t3--) {
            const n3 = e2[t3], r3 = i2;
            i2 = function(e3) {
              var t4, i3;
              const a2 = null === (i3 = (t4 = m.errorReporterHooks).hookEnter) || void 0 === i3 ? void 0 : i3.call(t4, o2.name, n3.mod), c2 = n3.hook.apply(this, [e3, (o3) => {
                if (1 !== arguments.length || !Array.isArray(e3)) throw new Error(`Mod ${n3.mod} failed to call next hook: Expected args to be array, got ${typeof o3}`);
                return r3.call(this, o3);
              }]);
              return null == a2 || a2(), c2;
            };
          }
          return { hooks: e2, patches: t2, patchesSources: n2, enter: i2, final: r2 };
        }
        function l(o2, e2 = false) {
          let r2 = i.get(o2);
          if (r2) e2 && (r2.precomputed = s(r2));
          else {
            let e3 = window;
            const a2 = o2.split(".");
            for (let t2 = 0; t2 < a2.length - 1; t2++) if (e3 = e3[a2[t2]], !n(e3)) throw new Error(`ModSDK: Function ${o2} to be patched not found; ${a2.slice(0, t2 + 1).join(".")} is not object`);
            const c2 = e3[a2[a2.length - 1]];
            if ("function" != typeof c2) throw new Error(`ModSDK: Function ${o2} to be patched not found`);
            const l2 = (function(o3) {
              let e4 = -1;
              for (const n2 of t.encode(o3)) {
                let o4 = 255 & (e4 ^ n2);
                for (let e5 = 0; e5 < 8; e5++) o4 = 1 & o4 ? -306674912 ^ o4 >>> 1 : o4 >>> 1;
                e4 = e4 >>> 8 ^ o4;
              }
              return ((-1 ^ e4) >>> 0).toString(16).padStart(8, "0").toUpperCase();
            })(c2.toString().replaceAll("\r\n", "\n")), d2 = { name: o2, original: c2, originalHash: l2 };
            r2 = Object.assign(Object.assign({}, d2), { precomputed: s(d2), router: () => {
            }, context: e3, contextProperty: a2[a2.length - 1] }), r2.router = /* @__PURE__ */ (function(o3) {
              return function(...e4) {
                return o3.precomputed.enter.apply(this, [e4]);
              };
            })(r2), i.set(o2, r2), e3[r2.contextProperty] = r2.router;
          }
          return r2;
        }
        function d() {
          for (const o2 of i.values()) o2.precomputed = s(o2);
        }
        function p() {
          const o2 = /* @__PURE__ */ new Map();
          for (const [e2, t2] of i) o2.set(e2, { name: e2, original: t2.original, originalHash: t2.originalHash, sdkEntrypoint: t2.router, currentEntrypoint: t2.context[t2.contextProperty], hookedByMods: r(t2.precomputed.hooks.map(((o3) => o3.mod))), patchedByMods: Array.from(t2.precomputed.patchesSources) });
          return o2;
        }
        const f = /* @__PURE__ */ new Map();
        function u(o2) {
          f.get(o2.name) !== o2 && e(`Failed to unload mod '${o2.name}': Not registered`), f.delete(o2.name), o2.loaded = false, d();
        }
        function g(o2, t2) {
          o2 && "object" == typeof o2 || e("Failed to register mod: Expected info object, got " + typeof o2), "string" == typeof o2.name && o2.name || e("Failed to register mod: Expected name to be non-empty string, got " + typeof o2.name);
          let r2 = `'${o2.name}'`;
          "string" == typeof o2.fullName && o2.fullName || e(`Failed to register mod ${r2}: Expected fullName to be non-empty string, got ${typeof o2.fullName}`), r2 = `'${o2.fullName} (${o2.name})'`, "string" != typeof o2.version && e(`Failed to register mod ${r2}: Expected version to be string, got ${typeof o2.version}`), o2.repository || (o2.repository = void 0), void 0 !== o2.repository && "string" != typeof o2.repository && e(`Failed to register mod ${r2}: Expected repository to be undefined or string, got ${typeof o2.version}`), null == t2 && (t2 = {}), t2 && "object" == typeof t2 || e(`Failed to register mod ${r2}: Expected options to be undefined or object, got ${typeof t2}`);
          const i2 = true === t2.allowReplace, a2 = f.get(o2.name);
          a2 && (a2.allowReplace && i2 || e(`Refusing to load mod ${r2}: it is already loaded and doesn't allow being replaced.
Was the mod loaded multiple times?`), u(a2));
          const c2 = (o3) => {
            let e2 = g2.patching.get(o3.name);
            return e2 || (e2 = { hooks: [], patches: /* @__PURE__ */ new Map() }, g2.patching.set(o3.name, e2)), e2;
          }, s2 = (o3, t3) => (...n2) => {
            var i3, a3;
            const c3 = null === (a3 = (i3 = m.errorReporterHooks).apiEndpointEnter) || void 0 === a3 ? void 0 : a3.call(i3, o3, g2.name);
            g2.loaded || e(`Mod ${r2} attempted to call SDK function after being unloaded`);
            const s3 = t3(...n2);
            return null == c3 || c3(), s3;
          }, p2 = { unload: s2("unload", (() => u(g2))), hookFunction: s2("hookFunction", ((o3, t3, n2) => {
            "string" == typeof o3 && o3 || e(`Mod ${r2} failed to patch a function: Expected function name string, got ${typeof o3}`);
            const i3 = l(o3), a3 = c2(i3);
            "number" != typeof t3 && e(`Mod ${r2} failed to hook function '${o3}': Expected priority number, got ${typeof t3}`), "function" != typeof n2 && e(`Mod ${r2} failed to hook function '${o3}': Expected hook function, got ${typeof n2}`);
            const s3 = { mod: g2.name, priority: t3, hook: n2 };
            return a3.hooks.push(s3), d(), () => {
              const o4 = a3.hooks.indexOf(s3);
              o4 >= 0 && (a3.hooks.splice(o4, 1), d());
            };
          })), patchFunction: s2("patchFunction", ((o3, t3) => {
            "string" == typeof o3 && o3 || e(`Mod ${r2} failed to patch a function: Expected function name string, got ${typeof o3}`);
            const i3 = l(o3), a3 = c2(i3);
            n(t3) || e(`Mod ${r2} failed to patch function '${o3}': Expected patches object, got ${typeof t3}`);
            for (const [n2, i4] of Object.entries(t3)) "string" == typeof i4 ? a3.patches.set(n2, i4) : null === i4 ? a3.patches.delete(n2) : e(`Mod ${r2} failed to patch function '${o3}': Invalid format of patch '${n2}'`);
            d();
          })), removePatches: s2("removePatches", ((o3) => {
            "string" == typeof o3 && o3 || e(`Mod ${r2} failed to patch a function: Expected function name string, got ${typeof o3}`);
            const t3 = l(o3);
            c2(t3).patches.clear(), d();
          })), callOriginal: s2("callOriginal", ((o3, t3, n2) => {
            "string" == typeof o3 && o3 || e(`Mod ${r2} failed to call a function: Expected function name string, got ${typeof o3}`);
            const i3 = l(o3);
            return Array.isArray(t3) || e(`Mod ${r2} failed to call a function: Expected args array, got ${typeof t3}`), i3.original.apply(null != n2 ? n2 : globalThis, t3);
          })), getOriginalHash: s2("getOriginalHash", ((o3) => {
            "string" == typeof o3 && o3 || e(`Mod ${r2} failed to get hash: Expected function name string, got ${typeof o3}`);
            return l(o3).originalHash;
          })) }, g2 = { name: o2.name, fullName: o2.fullName, version: o2.version, repository: o2.repository, allowReplace: i2, api: p2, loaded: true, patching: /* @__PURE__ */ new Map() };
          return f.set(o2.name, g2), Object.freeze(p2);
        }
        function h() {
          const o2 = [];
          for (const e2 of f.values()) o2.push({ name: e2.name, fullName: e2.fullName, version: e2.version, repository: e2.repository });
          return o2;
        }
        let m;
        const y = void 0 === window.bcModSdk ? window.bcModSdk = (function() {
          const e2 = { version: o, apiVersion: 1, registerMod: g, getModsInfo: h, getPatchingInfo: p, errorReporterHooks: Object.seal({ apiEndpointEnter: null, hookEnter: null, hookChainExit: null }) };
          return m = e2, Object.freeze(e2);
        })() : (n(window.bcModSdk) || e("Failed to init Mod SDK: Name already in use"), 1 !== window.bcModSdk.apiVersion && e(`Failed to init Mod SDK: Different version already loaded ('1.2.0' vs '${window.bcModSdk.version}')`), window.bcModSdk.version !== o && alert(`Mod SDK warning: Loading different but compatible versions ('1.2.0' vs '${window.bcModSdk.version}')
One of mods you are using is using an old version of SDK. It will work for now but please inform author to update`), window.bcModSdk);
        return "undefined" != typeof exports && (Object.defineProperty(exports, "__esModule", { value: true }), exports.default = y), y;
      })();
    }
  });

  // src/index.ts
  var import_reflect_metadata = __toESM(require_Reflect());

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/styles.css
  var styles_default = ".zcInput {\n  background: var(--tmd-element, white);\n  color: var(--tmd-text, black);\n  padding: 2vw;\n  border: 2px solid var(--tmd-accent, black);\n  border-radius: 4px;\n}\n.zcInput::placeholder {\n  color: var(--tmd-text, black);\n}\n.zcTabs {\n  display: flex;\n}\n.zcTabs button {\n  cursor: pointer;\n  width: 100%;\n  color: var(--tmd-text, black);\n  background: none;\n  border: none;\n  border-bottom: 2px solid var(--tmd-element, rgb(214, 214, 214));\n  padding: 0.25em;\n}\n.zcTabs button[data-opened=true] {\n  font-weight: bold;\n  border-bottom: 2px solid var(--tmd-accent, rgb(81, 81, 231)) !important;\n}\n.zcTabs button:hover {\n  background: var(--tmd-element, rgb(235, 235, 235));\n  border-bottom: 2px solid var(--tmd-element-hover, rgb(149, 149, 149));\n}\n.zcCard {\n  border: 2px solid var(--tmd-accent, rgb(195, 195, 195));\n  border-radius: 0.4em;\n  background: var(--tmd-element, white);\n  color: var(--tmd-text, black);\n  padding: 0.4em 2.5em 0.4em 0.4em;\n  box-sizing: border-box;\n}\n.zcCard:hover {\n  border: 2px solid var(--tmd-accent-hover, rgb(170, 170, 170));\n}\n.zcCard_name {\n  font-size: 0.5em;\n  color: var(--tmd-text, rgb(100, 100, 100));\n  margin: 0;\n}\n.zcCard_value {\n  color: var(--tmd-text, black);\n  margin: 0;\n  margin-top: 0.4em;\n  font-weight: bold;\n}\n.zcToastsContainer {\n  display: flex;\n  flex-direction: column;\n  gap: 0.15vw;\n  cursor: pointer;\n  position: fixed;\n  z-index: 30;\n}\n@keyframes zcToast-progress {\n  0% {\n    width: 0;\n  }\n  100% {\n    width: 100%;\n  }\n}\n@keyframes zcSlideInFromLeft {\n  from {\n    transform: translateX(-100%);\n    opacity: 0;\n  }\n  to {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n@keyframes zcSlideInFromRight {\n  from {\n    transform: translateX(100%);\n    opacity: 0;\n  }\n  to {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n@keyframes zcSlideOutToLeft {\n  from {\n    transform: translateX(0);\n    opacity: 1;\n  }\n  to {\n    transform: translateX(-100%);\n    opacity: 0;\n  }\n}\n@keyframes zcSlideOutToRight {\n  from {\n    transform: translateX(0);\n    opacity: 1;\n  }\n  to {\n    transform: translateX(100%);\n    opacity: 0;\n  }\n}\n@keyframes pop {\n  0% {\n    transform: scale(0.9);\n  }\n  50% {\n    transform: scale(1.1);\n  }\n  100% {\n    transform: scale(1);\n  }\n}\n.zcToast {\n  display: flex;\n  column-gap: 0.6em;\n  align-items: center;\n  max-width: 25vw;\n  border-radius: 0.15em;\n  position: relative;\n}\n.zcToast p {\n  color: white;\n  margin: 0;\n}\n.zcToast > svg {\n  flex-shrink: 0;\n}\n.zcDialog {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  background: rgb(57, 64, 77);\n  margin: auto;\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  border: none;\n  border-radius: 4px;\n  min-width: 200px;\n  max-width: 450px;\n  width: 90%;\n  height: fit-content;\n  z-index: 100;\n  pointer-events: all !important;\n  box-shadow: 0px 0px 6px 1px #0000006e;\n}\n.zcDialog > p {\n  padding: 0.85em 0px;\n  margin: 0;\n  user-select: none;\n  width: 90%;\n  color: white;\n}\n.zcDialog > input:focus {\n  outline: 2px solid rgb(0, 238, 255);\n}\n.zcDialog > div > button {\n  cursor: pointer;\n  padding: 6px 14px;\n  border: none;\n  border-radius: 4px;\n  font-weight: bold;\n}\n.zcDialog > div > button:first-child {\n  background: rgba(73, 82, 99, 1);\n  color: white;\n}\n.zcDialog > div > button:first-child:hover {\n  background: rgb(86, 94, 108);\n}\n.zcDialog > div > button:last-child {\n  background: #00eeffff;\n}\n.zcDialog > div > button:last-child:hover {\n  background: rgb(4, 203, 217);\n}\n@keyframes zcSpin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n@keyframes zcCursorBlink {\n  from {\n    border-right-color: transparent;\n  }\n  to {\n    border-right-color: rgb(42, 42, 42);\n  }\n}\n@keyframes zcStrokeUD {\n  0%, 100% {\n    transform: translateY(0) rotate(-25deg);\n  }\n  50% {\n    transform: translateY(15px) rotate(-45deg);\n  }\n}\n@keyframes zcFloatHeart {\n  0% {\n    transform: translateY(0) scale(0.5);\n    opacity: 0;\n  }\n  15% {\n    opacity: 1;\n  }\n  100% {\n    transform: translateY(-70px) scale(1.1);\n    opacity: 0;\n  }\n}\n.zcCursor {\n  border-right: 2px solid var(--tmd-text, rgb(42, 42, 42));\n  width: fit-content;\n}\n.zcDisabled {\n  pointer-events: none;\n  opacity: 0.6;\n}\n";

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/modSdk.js
  var import_bondage_club_mod_sdk = __toESM(require_bcmodsdk());

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/logging.js
  var logs = [];
  var Logger = class {
    /**
    * Returns the list of all recorded log entries.
    */
    get logs() {
      return logs;
    }
    pushLog(level, message) {
      this.logs.push({
        level,
        message,
        timestamp: Date.now()
      });
      console[level](`%c${MOD_DATA.key}:`, "color: #00ffe7;", ...message);
    }
    /**
    * Logs a debug-level message.
    * @param message - The message arguments to log.
    */
    debug(...message) {
      this.pushLog("debug", message);
    }
    /**
    * Logs a standard-level message.
    * @param message - The message arguments to log.
    */
    log(...message) {
      this.pushLog("log", message);
    }
    /**
    * Logs a warning-level message.
    * @param message - The message arguments to log.
    */
    warn(...message) {
      this.pushLog("warn", message);
    }
    /**
    * Logs an error-level message.
    * @param message - The message arguments to log.
    */
    error(...message) {
      this.pushLog("error", message);
    }
  };
  var logger = new Logger();

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/modSdk.js
  var HookPriority = /* @__PURE__ */ ((HookPriority2) => {
    HookPriority2[HookPriority2["OBSERVE"] = 0] = "OBSERVE";
    HookPriority2[HookPriority2["ADD_BEHAVIOR"] = 1] = "ADD_BEHAVIOR";
    HookPriority2[HookPriority2["MODIFY_BEHAVIOR"] = 5] = "MODIFY_BEHAVIOR";
    HookPriority2[HookPriority2["OVERRIDE_BEHAVIOR"] = 10] = "OVERRIDE_BEHAVIOR";
    HookPriority2[HookPriority2["TOP"] = 100] = "TOP";
    return HookPriority2;
  })(HookPriority || {});
  var modSdk;
  function createModSdk() {
    modSdk = import_bondage_club_mod_sdk.default.registerMod({
      name: MOD_DATA.name,
      fullName: MOD_DATA.fullName,
      version: MOD_DATA.version,
      repository: MOD_DATA.repository
    });
  }
  function hookFunction(functionName, priority, hook) {
    if (!modSdk) throw new Error("zois-core is not registered");
    try {
      return modSdk.hookFunction(functionName, priority, hook);
    } catch (e) {
      logger.error(e);
      return () => {
      };
    }
  }

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/shard-modules/shardModule.js
  var ShardModule = class {
    overrideContext(context, target) {
      return context;
    }
    layoutEffect(context, target) {
    }
    effect(context, target) {
    }
  };

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/shard-modules/styleModule.js
  var StyleModule = class extends ShardModule {
    constructor(style) {
      super();
      this.style = style;
    }
    style;
    applyStyle(target, style) {
      for (const styleProperty of Object.keys(style)) {
        if (!isNaN(styleProperty) || typeof style[styleProperty] === "function" || typeof style[styleProperty] === "undefined") continue;
        target.style[styleProperty] = style[styleProperty];
      }
    }
    layoutEffect(context, target) {
      this.applyStyle(target, this.style);
    }
  };

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/events.js
  var listeners = /* @__PURE__ */ new Map();
  var onceListeners = /* @__PURE__ */ new Map();
  function parseEventSpec(spec) {
    const idx = spec.indexOf(":");
    if (idx === -1) {
      return { event: spec, senderFilter: null };
    }
    return {
      senderFilter: spec.slice(0, idx),
      event: spec.slice(idx + 1)
    };
  }
  var EventBus = class {
    #id;
    get id() {
      return this.#id;
    }
    constructor(id) {
      this.#id = id;
    }
    emit(event, data) {
      const fullData = { ...data, sender: this.id };
      const commonEventListeners = listeners.get(event);
      if (commonEventListeners) {
        for (const listener of commonEventListeners) {
          try {
            if (listener.senderFilter) {
              if (listener.senderFilter === this.id) listener.callback(fullData);
            } else {
              listener.callback(fullData);
            }
          } catch (e) {
          }
        }
      }
      const onceEventListeners = onceListeners.get(event);
      if (onceEventListeners) {
        for (const listener of onceEventListeners) {
          try {
            if (listener.senderFilter) {
              if (listener.senderFilter === this.id) {
                listener.callback(fullData);
                onceEventListeners.delete(listener);
              }
            } else {
              listener.callback(fullData);
              onceEventListeners.delete(listener);
            }
          } catch (e) {
          }
        }
      }
    }
    on(eventSpec, callback) {
      const { event, senderFilter } = parseEventSpec(eventSpec);
      let eventListeners = listeners.get(event);
      if (!eventListeners) {
        eventListeners = /* @__PURE__ */ new Set();
        listeners.set(event, eventListeners);
      }
      const listener = {
        callback,
        senderFilter
      };
      eventListeners.add(listener);
      return () => {
        eventListeners.delete(listener);
      };
    }
    once(eventSpec, callback) {
      const { event, senderFilter } = parseEventSpec(eventSpec);
      let eventListeners = onceListeners.get(event);
      if (!eventListeners) {
        eventListeners = /* @__PURE__ */ new Set();
        onceListeners.set(event, eventListeners);
      }
      const listener = {
        callback,
        senderFilter
      };
      eventListeners.add(listener);
      return () => {
        eventListeners.delete(listener);
      };
    }
  };
  var createdBuses = /* @__PURE__ */ new Map();
  function getEventBus(id) {
    if (typeof id !== "string" || id.trim() === "") {
      throw new Error("id must be a non-empty string");
    }
    if (createdBuses.has(id)) {
      throw new Error(
        `EventBus with id "${id}" already exists`
      );
    }
    const bus = new EventBus(id);
    createdBuses.set(id, bus);
    return bus;
  }
  var eventBus = null;
  function createEventBus() {
    try {
      eventBus = window.ZOIS_CORE.getEventBus(MOD_DATA.name);
    } catch (e) {
      logger.error("Failed to create EventBus:", e);
    }
  }

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/shards/shard.js
  var Shard = class {
    constructor(context) {
      this.context = context;
      this.body = this.generateBody();
      this.processModules("overrideContext");
      this.processModules("layoutEffect");
    }
    context;
    body = null;
    get mountReturnValue() {
      return this.body?.base ?? null;
    }
    mount(parentElement = this.context.parent ?? document.body) {
      parentElement.append(this.body.base);
      this.update();
      this.processModules("effect");
      eventBus?.emit("shardMounted", {
        shard: this
      });
      window.addEventListener("resize", () => this.update());
      eventBus?.once("subscreenUnloaded", () => {
        this.body.base.remove();
        eventBus?.emit("shardUnmounted", {
          shard: this
        });
      });
      return this.mountReturnValue;
    }
    processModules(stage) {
      const modules = this.context.modules ?? {};
      if (stage === "overrideContext") {
        for (const key of Object.keys(modules)) {
          for (const module of modules[key] ?? []) {
            if (module instanceof ShardModule) {
              if (this.body?.[key]) {
                try {
                  this.context = module.overrideContext(this.context, this.body[key]);
                } catch (e) {
                  logger.error("OverrideContext call failed in", module, e);
                }
              }
            }
          }
        }
      }
      if (stage === "layoutEffect") {
        for (const key of Object.keys(modules)) {
          for (const module of modules[key] ?? []) {
            if (module instanceof ShardModule) {
              if (this.body?.[key]) {
                try {
                  module.layoutEffect(this.context, this.body[key]);
                } catch (e) {
                  logger.error("LayoutEffect call failed in", module, e);
                }
              }
            }
          }
        }
      }
      if (stage === "effect") {
        for (const key of Object.keys(modules)) {
          for (const module of modules[key] ?? []) {
            if (module instanceof ShardModule) {
              if (this.body?.[key]) {
                try {
                  module.effect(this.context, this.body[key]);
                } catch (e) {
                  logger.error("Effect call failed in", module, e);
                }
              }
            }
          }
        }
      }
    }
    update() {
      const { x, y, anchor, padding, width, height } = this.context;
      if (typeof x === "number" && typeof y === "number") setPosition(this.body.base, x, y, anchor);
      if (padding) setPadding(this.body.base, padding);
      if (width) this.body.base.style.width = getRelativeWidth(width) + "px";
      if (height) this.body.base.style.height = getRelativeHeight(height) + "px";
    }
  };

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/shards/backNextButtonShard.js
  var BackNextButtonShard = class extends Shard {
    get dynamicClassContainer() {
      return {
        base: {
          display: "flex",
          columnGap: "2vw",
          justifyContent: "center",
          alignItems: "center",
          background: "var(--tmd- element, white)",
          color: "var(--tmd-text, black)",
          border: "2px solid var(--tmd-accent, black)",
          borderRadius: "4px"
        }
      };
    }
    get dynamicClassButton() {
      return {
        base: {
          cursor: "pointer",
          background: "var(--tmd-element, white)",
          color: "var(--tmd-text, black)",
          border: "2px solid var(--tmd-accent, rgb(34, 34, 34))",
          borderRadius: "6px"
        },
        hover: {
          background: "var(--tmd-element-hover, #ebf7fe)",
          borderColor: "var(--tmd-accent-hover, #7dd3fc)",
          color: "var(--tmd-accent-hover, #015a8c)"
        },
        disabled: {
          background: "var(--tmd-element-disabled, #ffa590)",
          pointerEvents: "none"
        }
      };
    }
    generateBody() {
      const { onChange, isDisabled } = this.context;
      const div = document.createElement("div");
      addDynamicClass(div, this.dynamicClassContainer);
      setFontFamily(div, MOD_DATA.fontFamily);
      let currentIndex = this.context.currentIndex;
      let items = this.context.items;
      const updateClasses = () => {
        if (currentIndex === 0 || typeof isDisabled === "function" && isDisabled(items[currentIndex - 1][1])) backBtn.disabled = true;
        else backBtn.disabled = false;
        if (currentIndex === items.length - 1 || typeof isDisabled === "function" && isDisabled(items[currentIndex + 1][1])) nextBtn.disabled = true;
        else nextBtn.disabled = false;
        ;
      };
      const backBtn = document.createElement("button");
      backBtn.style.cssText = `
                position: absolute; left: 1vw; font-size: 3.5vw; aspect-ratio: 1/1;
                height: 140%; background-image: url("Icons/Prev.png"); background-size: 100%;
                `;
      addDynamicClass(backBtn, this.dynamicClassButton);
      backBtn.addEventListener("click", () => {
        if (currentIndex === 0) return backBtn.classList.add("zcDisabled");
        if (typeof isDisabled === "function" && isDisabled(items[currentIndex - 1][1])) return backBtn.classList.add("zcDisabled");
        currentIndex--;
        text.textContent = items[currentIndex][0];
        if (typeof onChange === "function") onChange(items[currentIndex][1]);
        updateClasses();
      });
      const nextBtn = document.createElement("button");
      nextBtn.style.cssText = `
                position: absolute; right: 1vw; font-size: 3.5vw; aspect-ratio: 1/1;
                height: 140%; background-image: url("Icons/Next.png"); background-size: 100%;
                `;
      addDynamicClass(nextBtn, this.dynamicClassButton);
      nextBtn.addEventListener("click", () => {
        if (currentIndex === items.length - 1) return nextBtn.classList.add("zcDisabled");
        if (typeof isDisabled === "function" && isDisabled(items[currentIndex + 1][1])) return nextBtn.classList.add("zcDisabled");
        currentIndex++;
        text.textContent = items[currentIndex][0];
        if (typeof onChange === "function") onChange(items[currentIndex][1]);
        updateClasses();
      });
      updateClasses();
      const text = document.createElement("b");
      text.textContent = items[currentIndex][0];
      div.append(backBtn, text, nextBtn);
      return {
        base: div,
        backButton: backBtn,
        nextButton: nextBtn,
        text
      };
    }
    update() {
      super.update();
      autosetFontSize(this.body.base);
    }
  };

  // node_modules/.pnpm/lucide@1.58.0/node_modules/lucide/dist/esm/defaultAttributes.mjs
  var defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  };

  // node_modules/.pnpm/lucide@1.58.0/node_modules/lucide/dist/esm/createElement.mjs
  var createSVGElement = ([tag, attrs, children]) => {
    const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attrs).forEach((name) => {
      element.setAttribute(name, String(attrs[name]));
    });
    if (children?.length) {
      children.forEach((child) => {
        const childElement = createSVGElement(child);
        element.appendChild(childElement);
      });
    }
    return element;
  };
  var createElement = (iconNode, customAttrs = {}) => {
    const tag = "svg";
    const attrs = {
      ...defaultAttributes,
      ...customAttrs
    };
    return createSVGElement([tag, attrs, iconNode]);
  };

  // node_modules/.pnpm/lucide@1.58.0/node_modules/lucide/dist/esm/icons/book-text.mjs
  var BookText = [
    [
      "path",
      { d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" }
    ],
    ["path", { d: "M8 11h8" }],
    ["path", { d: "M8 7h6" }]
  ];

  // node_modules/.pnpm/lucide@1.58.0/node_modules/lucide/dist/esm/icons/check.mjs
  var Check = [["path", { d: "M20 6 9 17l-5-5" }]];

  // node_modules/.pnpm/lucide@1.58.0/node_modules/lucide/dist/esm/icons/chevron-down.mjs
  var ChevronDown = [["path", { d: "m6 9 6 6 6-6" }]];

  // node_modules/.pnpm/lucide@1.58.0/node_modules/lucide/dist/esm/icons/circle-alert.mjs
  var CircleAlert = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["line", { x1: "12", x2: "12", y1: "8", y2: "12" }],
    ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16" }]
  ];

  // node_modules/.pnpm/lucide@1.58.0/node_modules/lucide/dist/esm/icons/circle-check.mjs
  var CircleCheck = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "m16 9-5.5 5.5L8 12" }]
  ];

  // node_modules/.pnpm/lucide@1.58.0/node_modules/lucide/dist/esm/icons/circle-x.mjs
  var CircleX = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "m15 9-6 6" }],
    ["path", { d: "m9 9 6 6" }]
  ];

  // node_modules/.pnpm/lucide@1.58.0/node_modules/lucide/dist/esm/icons/external-link.mjs
  var ExternalLink = [
    ["path", { d: "M15 3h6v6" }],
    ["path", { d: "M10 14 21 3" }],
    ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }]
  ];

  // node_modules/.pnpm/lucide@1.58.0/node_modules/lucide/dist/esm/icons/info.mjs
  var Info = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M12 16v-4" }],
    ["path", { d: "M12 8h.01" }]
  ];

  // node_modules/.pnpm/lucide@1.58.0/node_modules/lucide/dist/esm/icons/rotate-ccw.mjs
  var RotateCcw = [
    ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }],
    ["path", { d: "M3 3v5h5" }]
  ];

  // node_modules/.pnpm/lucide@1.58.0/node_modules/lucide/dist/esm/icons/sliders-vertical.mjs
  var SlidersVertical = [
    ["path", { d: "M10 8h4" }],
    ["path", { d: "M12 21v-9" }],
    ["path", { d: "M12 8V3" }],
    ["path", { d: "M17 16h4" }],
    ["path", { d: "M19 12V3" }],
    ["path", { d: "M19 21v-5" }],
    ["path", { d: "M3 14h4" }],
    ["path", { d: "M5 10V3" }],
    ["path", { d: "M5 21v-7" }]
  ];

  // node_modules/.pnpm/lucide@1.58.0/node_modules/lucide/dist/esm/icons/terminal.mjs
  var Terminal = [
    ["path", { d: "M12 19h8" }],
    ["path", { d: "m4 17 6-6-6-6" }]
  ];

  // node_modules/.pnpm/lucide@1.58.0/node_modules/lucide/dist/esm/icons/trash.mjs
  var Trash = [
    ["path", { d: "M10 11v6" }],
    ["path", { d: "M14 11v6" }],
    ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }],
    ["path", { d: "M3 6h18" }],
    ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }]
  ];

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/shards/buttonShard.js
  var ButtonShard = class extends Shard {
    get dynamicClassButton() {
      return {
        base: {
          cursor: "pointer",
          background: "var(--tmd-element, white)",
          color: "var(--tmd-text, black)",
          border: "2px solid var(--tmd-accent, rgb(34, 34, 34))",
          borderRadius: "6px"
        },
        hover: {
          background: "var(--tmd-element-hover, #ebf7fe)",
          borderColor: "var(--tmd-accent-hover, #7dd3fc)",
          color: "var(--tmd-accent-hover, #015a8c)"
        },
        "> .tooltip": {
          position: "absolute",
          color: "var(--tmd-text, black)",
          textAlign: "center",
          padding: "0.3em 0.6em",
          borderRadius: "4px",
          background: "var(--tmd-element-hint, #e6e6e6)",
          width: "max-content",
          visibility: "hidden",
          zIndex: "10"
        },
        "> .tooltip[position=left]": {
          right: "calc(100% + 1vw)"
        },
        "> .tooltip[position=right]": {
          left: "calc(100% + 1vw)"
        },
        ":hover .tooltip": {
          visibility: "visible"
        },
        "[data-zc-variant=filled]": {
          background: "var(--tmd-accent, #111)",
          border: "2px solid var(--tmd-accent, #111)",
          color: "var(--tmd-text, white)"
        },
        "[data-zc-variant=filled]:hover": {
          background: "var(--tmd-accent-hover, none)",
          color: "var(--tmd-text, black)"
        },
        "> .external-link-icon": {
          display: "flex",
          columnGap: "0.25em",
          position: "absolute",
          right: "-0.25em",
          top: "-0.25em",
          width: "0.75em",
          height: "0.75em",
          background: "var(--tmd-accent, #5b5bff)",
          color: "var(--tmd-text, white)",
          padding: "0.1em",
          boxSizing: "border-box",
          borderRadius: "50%"
        }
      };
    }
    generateBody() {
      const { height, text, variant, icon, iconAbsolutePosition = true, tooltip, href, onClick, isDisabled } = this.context;
      let iconElement;
      let textElement;
      const btn = document.createElement("button");
      addDynamicClass(btn, this.dynamicClassButton);
      btn.setAttribute("data-zc-variant", variant);
      btn.style.display = "flex";
      btn.style.alignItems = "center";
      btn.style.justifyContent = "center";
      btn.style.columnGap = "1.25vw";
      setFontFamily(btn, MOD_DATA.fontFamily);
      if (icon) {
        if (typeof icon === "string") {
          iconElement = document.createElement("img");
          iconElement.src = icon;
        } else {
          iconElement = icon;
        }
        iconElement.style.height = "80%";
        iconElement.style.width = "auto";
        if (text && iconAbsolutePosition) {
          iconElement.style.position = "absolute";
          iconElement.style.left = "1vw";
        }
        if (text && !iconAbsolutePosition) btn.style.justifyContent = "";
        btn.append(iconElement);
      }
      if (text) {
        textElement = document.createElement("span");
        textElement.textContent = text;
        if (height) {
          textElement.style.overflow = "hidden";
          textElement.style.textOverflow = "ellipsis";
          textElement.style.whiteSpace = "nowrap";
          textElement.style.maxHeight = "100%";
        }
        btn.append(textElement);
      }
      if (tooltip) {
        const tooltipEl = document.createElement("span");
        tooltipEl.classList.add("tooltip");
        tooltipEl.setAttribute("position", tooltip.position);
        tooltipEl.textContent = tooltip.text;
        btn.append(tooltipEl);
      }
      if (href) {
        const externalLinkContainer = document.createElement("div");
        externalLinkContainer.classList.add("external-link-icon");
        const externalLinkIcon = createElement(ExternalLink);
        externalLinkIcon.style.width = "auto";
        externalLinkIcon.style.height = "100%";
        externalLinkContainer.append(externalLinkIcon);
        btn.append(externalLinkContainer);
        let hrefTooltip = null;
        btn.addEventListener("mouseenter", () => {
          if (hrefTooltip) return;
          hrefTooltip = document.createElement("div");
          hrefTooltip.style.cssText = `position: fixed; top: 0; left: 0; right: 0; bottom: 0; margin: auto;
                width: fit-content; height: fit-content; font-size: calc(3.5px * var(--size-unit));
                z-index: 100; color: var(--tmd-text, black); background: var(--tmd-element, #f8f8f8); padding: 0.2em;
                border-radius: 4px; border: 1px solid var(--tmd-element-hover, #9f9f9f);`;
          setFontFamily(hrefTooltip, CommonGetFontName());
          hrefTooltip.textContent = href;
          document.body.append(hrefTooltip);
        });
        btn.addEventListener("mouseleave", () => {
          if (!hrefTooltip) return;
          hrefTooltip.remove();
          hrefTooltip = null;
        });
      }
      if (typeof isDisabled === "function" && isDisabled()) btn.classList.add("zcDisabled");
      btn.addEventListener("click", () => {
        if (typeof isDisabled === "function" && isDisabled()) return btn.classList.add("zcDisabled");
        if (typeof onClick === "function") onClick();
        if (href) window.open(href, "_blank", "noopener,noreferrer");
      });
      return {
        text: textElement,
        icon: iconElement,
        base: btn
      };
    }
    update() {
      super.update();
      if ((this.context.fontSize ?? "auto") === "auto") autosetFontSize(this.body.base);
      else if (typeof this.context.fontSize === "number") setFontSize(this.body.base, this.context.fontSize);
    }
  };

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/shards/cardShard.js
  var CardShard = class extends Shard {
    generateBody() {
      const { name, value, icon } = this.context;
      const cardEl = document.createElement("div");
      cardEl.classList.add("zcCard");
      setFontFamily(cardEl, MOD_DATA.fontFamily);
      const cardName = document.createElement("p");
      cardName.classList.add("zcCard_name");
      cardName.textContent = name;
      const cardValue = document.createElement("p");
      cardValue.classList.add("zcCard_value");
      cardValue.textContent = `${value}`;
      if (icon) {
        icon.style.cssText += "position: absolute; top: 0.4em; right: 0.4em; width: 1.2em; height: 1.2em;";
        cardEl.append(icon);
      }
      cardEl.append(cardName, cardValue);
      return {
        base: cardEl,
        name: cardName,
        value: cardValue,
        icon
      };
    }
    update() {
      super.update();
      autosetFontSize(this.body.base);
    }
  };

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/shards/checkboxShard.js
  var CheckboxShard = class extends Shard {
    get dynamicClassInput() {
      return {
        base: {
          width: "min(6dvh, 3dvw)",
          height: "min(6dvh, 3dvw)",
          borderRadius: "min(0.8dvh, 0.3dvw)",
          border: "var(--border-width, 2px) solid #333",
          backgroundColor: "var(--checkbox-color, #fff)",
          position: "relative",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: "0",
          transition: "background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          appearance: "none"
        },
        ":checked": {
          backgroundColor: "var(--tmd-accent, black)",
          borderColor: "var(--tmd-accent, black)"
        },
        ":checked + svg": {
          strokeDashoffset: "0"
        },
        ":checked:hover": {
          backgroundColor: "var(--tmd-accent-hover, black)"
        },
        ".zcDisabled": {
          opacity: "0.6",
          cursor: "not-allowed",
          backgroundColor: "var(--disabled-color, #e5e5e5)"
        },
        ".pop": {
          animation: "pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
        }
      };
    }
    get dynamicClassCheckmark() {
      return {
        base: {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "70%",
          height: "70%",
          pointerEvents: "none",
          stroke: "var(--tmd-text, white)",
          strokeWidth: "3.5",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          fill: "none",
          strokeDasharray: "24",
          strokeDashoffset: "24",
          transition: "stroke-dashoffset 0.45s cubic-bezier(0.25, 0.1, 0.25, 1)"
        }
      };
    }
    get dynamicClassTooltip() {
      return {
        base: {
          position: "absolute",
          color: "var(--tmd-text, black)",
          fontSize: "0.65em",
          textAlign: "center",
          padding: "0.3em 0.6em",
          borderRadius: "4px",
          background: "var(--tmd-element-hint, #e6e6e6)",
          width: "max-content",
          visibility: "hidden",
          zIndex: "10",
          pointerEvents: "none",
          whiteSpace: "nowrap"
        },
        "[position=left]": {
          right: "calc(100% + 1vw)"
        },
        "[position=right]": {
          left: "calc(100% + 1vw)"
        }
      };
    }
    get dynamicClassBox() {
      return {
        base: {
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: "0"
        },
        ":hover .tooltip": {
          visibility: "visible"
        }
      };
    }
    get textColor() {
      return "var(--tmd-text, black)";
    }
    generateBody() {
      const { isChecked, text, tooltip, onChange, isDisabled } = this.context;
      const wrapper = document.createElement("div");
      wrapper.style.display = "flex";
      wrapper.style.alignItems = "center";
      wrapper.style.columnGap = "1vw";
      wrapper.style.padding = "0.25em";
      setFontFamily(wrapper, MOD_DATA.fontFamily);
      const box = document.createElement("div");
      addDynamicClass(box, this.dynamicClassBox);
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = isChecked;
      input.classList.add("zcCheckbox");
      addDynamicClass(input, this.dynamicClassInput);
      const checkmark = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      checkmark.setAttribute("viewBox", "0 0 24 24");
      checkmark.setAttribute("class", "checkmark");
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M5 13L9 17L19 7");
      checkmark.appendChild(path);
      addDynamicClass(checkmark, this.dynamicClassCheckmark);
      box.append(input, checkmark);
      const label = document.createElement("p");
      label.textContent = text;
      label.style.color = this.textColor;
      label.style.margin = "0";
      if (typeof isDisabled === "function" && isDisabled()) {
        input.disabled = true;
        wrapper.classList.add("zcDisabled");
      }
      input.addEventListener("change", () => {
        if (typeof isDisabled === "function" && isDisabled()) {
          input.checked = !input.checked;
          return;
        }
        if (typeof onChange === "function") onChange();
        if (input.checked) {
        }
      });
      wrapper.append(box, label);
      if (tooltip) {
        const tooltipEl = document.createElement("span");
        tooltipEl.classList.add("tooltip");
        tooltipEl.setAttribute("position", tooltip.position);
        tooltipEl.textContent = tooltip.text;
        addDynamicClass(tooltipEl, this.dynamicClassTooltip);
        box.appendChild(tooltipEl);
      }
      return {
        base: wrapper,
        checkbox: input,
        label
      };
    }
    update() {
      super.update();
      if (this.body?.base) {
        autosetFontSize(this.body.base);
      }
    }
  };

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/shards/containerShard.js
  var ContainerShard = class extends Shard {
    get dynamicClassContainer() {
      return {
        base: {},
        "> div:first-child::-webkit-scrollbar": {
          display: "none"
        },
        "> div:first-child": {
          scrollbarWidth: "none"
        }
      };
    }
    get mountReturnValue() {
      return this.body?.content ?? null;
    }
    generateBody() {
      const scrollMode = this.context.scroll ?? "auto";
      const container = document.createElement("div");
      container.style.position = "relative";
      addDynamicClass(container, this.dynamicClassContainer);
      const mayNeedVerticalScrollbar = scrollMode === "y" || scrollMode === "all" || scrollMode === "auto";
      const containerContent = document.createElement("div");
      containerContent.style.width = "100%";
      containerContent.style.height = "100%";
      containerContent.style.boxSizing = "border-box";
      switch (scrollMode) {
        case "all":
          containerContent.style.overflow = "scroll";
          break;
        case "x":
          containerContent.style.overflowX = "scroll";
          containerContent.style.overflowY = "hidden";
          break;
        case "y":
          containerContent.style.overflowY = "scroll";
          containerContent.style.overflowX = "hidden";
          break;
        case "none":
          containerContent.style.overflow = "unset";
          break;
        case "auto":
        default:
          containerContent.style.overflow = "auto";
          break;
      }
      const scrollbar = document.createElement("div");
      scrollbar.style.cssText = `
      position: absolute;
      right: 0;
      top: 50%;
      display: none;
      flex-direction: column;
      gap: calc(var(--size-unit) * 1.25px);
      transform: translateY(-50%);
      pointer-events: none;
      z-index: 10;
      width: calc(var(--size-unit) * 1.25px);
    `;
      const diamonds = [];
      for (let i = 0; i < 6; i++) {
        const diamond = document.createElement("div");
        diamond.style.cssText = `
        transform: rotate(45deg);
        width: 100%;
        aspect-ratio: 1/1;
        background: var(--tmd-element, gray);
        border: 1px solid var(--tmd-accent, black);
        transition: background 0.15s ease, transform 0.15s ease;
      `;
        scrollbar.append(diamond);
        diamonds.push(diamond);
      }
      const updateIndicators = () => {
        const maxScroll = containerContent.scrollHeight - containerContent.clientHeight;
        if (maxScroll <= 1) {
          diamonds.forEach((d) => {
            d.style.background = "var(--tmd-element, gray)";
            d.style.transform = "rotate(45deg) scale(1)";
          });
          return;
        }
        const progress = Math.min(1, Math.max(0, containerContent.scrollTop / maxScroll));
        const activeIndex = Math.round(progress * (diamonds.length - 1));
        diamonds.forEach((diamond, i) => {
          if (i === activeIndex) {
            diamond.style.background = "var(--tmd-accent, #fff)";
            diamond.style.transform = "rotate(45deg) scale(1.25)";
          } else if (i < activeIndex) {
            diamond.style.background = "var(--tmd-element, #aaa)";
            diamond.style.transform = "rotate(45deg) scale(1)";
          } else {
            diamond.style.background = "var(--tmd-element-hover, gray)";
            diamond.style.transform = "rotate(45deg) scale(1)";
          }
        });
      };
      containerContent.addEventListener("scroll", updateIndicators, { passive: true });
      const needsVerticalScrollbar = scrollMode === "y" || scrollMode === "all";
      const updateScrollbarVisibility = () => {
        const isOverflowing = containerContent.scrollHeight - containerContent.clientHeight > 1;
        const shouldShow = needsVerticalScrollbar || scrollMode === "auto" && isOverflowing;
        containerContent.style.paddingRight = shouldShow ? "min(2vw, 2vh)" : "";
        scrollbar.style.display = shouldShow ? "flex" : "none";
        updateIndicators();
      };
      if (mayNeedVerticalScrollbar) {
        const resizeObserver = new ResizeObserver(() => {
          requestAnimationFrame(updateScrollbarVisibility);
        });
        resizeObserver.observe(containerContent);
        const mutationObserver = new MutationObserver(() => {
          requestAnimationFrame(updateScrollbarVisibility);
        });
        mutationObserver.observe(containerContent, {
          childList: true,
          subtree: true,
          characterData: true
        });
        requestAnimationFrame(updateScrollbarVisibility);
      }
      container.append(containerContent, scrollbar);
      return {
        base: container,
        content: containerContent,
        scrollbar
      };
    }
  };

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/shards/imageShard.js
  var ImageShard = class extends Shard {
    modal = null;
    generateBody() {
      const { src, alt = "" } = this.context;
      const img = document.createElement("img");
      img.src = src;
      img.alt = alt;
      img.style.cursor = "zoom-in";
      img.style.maxWidth = "100%";
      img.style.height = "auto";
      img.addEventListener("click", () => this.openModal(src, alt));
      return {
        base: img
      };
    }
    openModal(src, alt) {
      this.closeModal();
      this.modal = document.createElement("div");
      this.modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
      const modalContent = document.createElement("div");
      modalContent.style.cssText = `
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
            transform: scale(0.7);
            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        `;
      const bigImg = document.createElement("img");
      bigImg.src = src;
      bigImg.alt = alt;
      bigImg.style.cssText = `
            max-width: 100%;
            max-height: 90vh;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
        `;
      const closeBtn = document.createElement("button");
      closeBtn.innerHTML = "\u2715";
      closeBtn.style.cssText = `
            position: absolute;
            top: -15px;
            right: -15px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: white;
            color: black;
            font-size: 20px;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
        `;
      modalContent.appendChild(bigImg);
      modalContent.appendChild(closeBtn);
      this.modal.appendChild(modalContent);
      document.body.appendChild(this.modal);
      setTimeout(() => {
        this.modal.style.opacity = "1";
        modalContent.style.transform = "scale(1)";
      }, 10);
      const close = () => this.closeModal();
      closeBtn.addEventListener("click", close);
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal) close();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
      }, { once: true });
    }
    closeModal() {
      if (!this.modal) return;
      this.modal.style.opacity = "0";
      setTimeout(() => {
        this.modal?.remove();
        this.modal = null;
      }, 300);
    }
  };

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/shards/inputListShard.js
  var InputListShard = class extends Shard {
    get dynamicClassContainer() {
      return {
        base: {
          display: "flex",
          flexDirection: "column",
          gap: "1vw",
          border: "2px solid var(--tmd-accent, black)",
          borderRadius: "4px",
          padding: "0.75vw",
          boxSizing: "border-box",
          background: "var(--tmd-element, none)"
        },
        "> div:first-child": {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          columnGap: "0.75vw",
          width: "100%"
        },
        "> div:first-child > b": {
          fontSize: "clamp(10px, 2.4vw, 28px)",
          color: "var(--tmd-text, black)"
        },
        "> div:first-child > div:last-child": {
          display: "flex",
          columnGap: "0.75vw"
        },
        "> div:last-child": {
          display: "flex",
          gap: "0.25em",
          alignContent: "flex-start",
          flexWrap: "wrap",
          overflowY: "scroll",
          width: "100%"
        },
        "> div:last-child > div": {
          cursor: "pointer",
          background: "var(--tmd-element-hover, rgb(206, 206, 206))",
          color: "var(--tmd-text, black)",
          height: "fit-content",
          padding: "0.25em 0.45em",
          borderRadius: "0.25em",
          fontSize: "clamp(8px, 1.85vw, 24px)"
        }
      };
    }
    get dynamicClassInput() {
      return {
        base: {
          border: "none !important",
          outline: "none !important",
          background: "none !important",
          flexGrow: "1",
          width: "6vw",
          fontSize: "clamp(8px, 1.85vw, 20px)"
        }
      };
    }
    get dynamicClassToolsButton() {
      return {
        base: {
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
          background: "var(--tmd-accent, #333)",
          color: "white",
          width: "2.5vw",
          aspectRatio: "1/1",
          borderRadius: "8px",
          border: "none"
        },
        hover: {
          background: "var(--tmd-accent-hover, #00c2cc)"
        }
      };
    }
    generateBody() {
      const { value, title, fontSize, numbersOnly, onChange, isDisabled } = this.context;
      const checkbox = document.createElement("div");
      const items = [];
      const div = document.createElement("div");
      addDynamicClass(div, this.dynamicClassContainer);
      setFontFamily(div, MOD_DATA.fontFamily);
      const headerElement = document.createElement("div");
      const toolsElement = document.createElement("div");
      const titleElement = document.createElement("b");
      titleElement.textContent = title + ":";
      const itemsElement = document.createElement("div");
      const input = document.createElement("input");
      addDynamicClass(input, this.dynamicClassInput);
      const addButton = (icon, onClick) => {
        const b = document.createElement("button");
        addDynamicClass(b, this.dynamicClassToolsButton);
        icon.style.cssText = "width: 80%; height: auto;";
        b.append(icon);
        b.addEventListener("click", onClick);
        toolsElement.append(b);
      };
      const addItem = (text) => {
        const item = document.createElement("div");
        item.textContent = text;
        itemsElement.insertBefore(item, input);
        item.addEventListener("click", (e) => {
          if (item.style.border === "") item.style.border = "2px solid red";
          else item.style.border = "";
          e.stopPropagation();
        });
        items.push(text);
      };
      addButton(createElement(RotateCcw), () => {
        if (typeof isDisabled === "function" && isDisabled()) return div.classList.add("zcDisabled");
        itemsElement.innerHTML = "";
        items.splice(0, items.length);
        itemsElement.append(input);
        value?.forEach((v) => addItem(String(v)));
        if (typeof onChange === "function") onChange(numbersOnly ? items.map((i) => parseInt(i, 10)) : items);
      });
      addButton(createElement(Trash), () => {
        if (typeof isDisabled === "function" && isDisabled()) return div.classList.add("zcDisabled");
        for (const c of [...itemsElement.children]) {
          if (c.getAttribute("style")?.includes("border: 2px solid red;")) {
            items.splice(items.indexOf(c.textContent), 1);
            c.remove();
          }
        }
        if (typeof onChange === "function") onChange(numbersOnly ? items.map((i) => parseInt(i, 10)) : items);
      });
      if (typeof isDisabled === "function" && isDisabled()) div.classList.add("zcDisabled");
      input.addEventListener("keypress", (e) => {
        if (document.activeElement === input) {
          switch (e.key) {
            case "Enter":
              if (numbersOnly && Number.isNaN(parseInt(input.value))) return;
              if (input.value.trim() === "") return;
              if (typeof isDisabled === "function" && isDisabled()) return div.classList.add("zcDisabled");
              addItem(input.value);
              input.value = "";
              if (typeof onChange === "function") onChange(numbersOnly ? items.map((i) => parseInt(i, 10)) : items);
              break;
          }
        }
      });
      div.addEventListener("click", (e) => {
        if (e.currentTarget == div) input.focus();
      });
      headerElement.append(titleElement, toolsElement);
      itemsElement.append(input);
      div.append(headerElement, itemsElement);
      value?.forEach((v) => addItem(String(v)));
      return {
        base: div,
        input
      };
    }
  };

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/shards/inputShard.js
  var InputShard = class extends Shard {
    generateBody() {
      const { textArea, placeholder, value, isDisabled, onChange, onInput } = this.context;
      const input = document.createElement(textArea ? "textarea" : "input");
      input.classList.add("zcInput");
      if (placeholder) input.placeholder = placeholder;
      if (value) input.value = value;
      setFontFamily(input, MOD_DATA.fontFamily);
      if (typeof isDisabled === "function" && isDisabled()) input.classList.add("zcDisabled");
      input.addEventListener("change", () => {
        if (typeof isDisabled === "function" && isDisabled()) return input.classList.add("zcDisabled");
        if (typeof onChange === "function") onChange();
      });
      input.addEventListener("input", () => {
        if (typeof isDisabled === "function" && isDisabled()) return input.classList.add("zcDisabled");
        if (typeof onInput === "function") onInput();
      });
      return {
        base: input
      };
    }
    update() {
      super.update();
      if ((this.context.fontSize ?? "auto") === "auto") autosetFontSize(this.body.base);
      else if (typeof this.context.fontSize === "number") setFontSize(this.body.base, this.context.fontSize);
    }
  };

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/shards/selectShard.js
  var SelectShard = class extends Shard {
    get dynamicClassContainer() {
      return {
        base: {
          cursor: "pointer",
          background: "var(--tmd-element, white)",
          color: "var(--tmd-text, black)",
          border: "2px solid var(--tmd-accent, rgb(195, 195, 195))",
          borderRadius: "0.4em",
          padding: "0.25em",
          boxSizing: "border-box",
          zIndex: "10"
        },
        "[opened=true]": {
          borderColor: "var(--tmd-accent-hover, rgb(0, 96, 223))"
        },
        "[opened=false]:hover": {
          borderColor: "var(--tmd-accent-hover, rgb(170, 170, 170))"
        },
        "> p": {
          margin: "0"
        },
        ">svg": {
          position: "absolute",
          right: "0.45em",
          top: "50%",
          transform: "translateY(-50%)",
          width: "1.5em",
          height: "1.5em",
          color: "var(--tmd-accent, rgb(0, 96, 223))"
        },
        ">div[data-zc-position='bottom']": {
          position: "absolute",
          top: "calc(100% + 0.45em)",
          left: "0",
          width: "100%",
          background: "var(--tmd-element, #f6f6f6)",
          border: "2px solid var(--tmd-element-hover, rgb(235 235 235))",
          borderRadius: "0.4em"
        },
        ">div[data-zc-position='top']": {
          position: "absolute",
          bottom: "calc(100% + 0.45em)",
          left: "0",
          width: "100%",
          background: "var(--tmd-element, #f6f6f6)",
          border: "2px solid var(--tmd-element-hover, rgb(235 235 235))",
          borderRadius: "0.4em"
        },
        ">div>div": {
          color: "var(--tmd-text, black)",
          width: "100%",
          padding: "0.25em",
          boxSizing: "border-box",
          borderRadius: "0.25em"
        },
        ">div>div>svg": {
          width: "1.25em",
          height: "1.25em",
          color: "var(--tmd-accent, rgb(0, 96, 223))"
        },
        ">div>div:hover": {
          background: "var(--tmd-element-hover, #ededed)"
        }
      };
    }
    generateBody() {
      let { options, currentOption, x, y } = CommonCloneDeep(this.context);
      let isOpened = false;
      let optionsContainer;
      const select = document.createElement("div");
      addDynamicClass(select, this.dynamicClassContainer);
      setFontFamily(select, MOD_DATA.fontFamily);
      select.setAttribute("opened", false);
      select.addEventListener("click", () => {
        if (this.context.isDisabled && this.context.isDisabled()) return select.classList.add("zcDisabled");
        if (isOpened) {
          isOpened = false;
          optionsContainer.remove();
        } else {
          isOpened = true;
          optionsContainer = document.createElement("div");
          optionsContainer.setAttribute(
            "data-zc-position",
            typeof y === "number" && y > 500 - select.offsetHeight / 2 ? "top" : "bottom"
          );
          options.forEach((option) => {
            const e = document.createElement("div");
            e.style.cssText = "display: flex; align-items: center; column-gap: 0.5em;";
            if (option.icon) {
              option.icon.style.cssText = "color: #bcbcbc;";
              e.append(option.icon);
            }
            e.append(option.text);
            if (option.name === currentOption) {
              e.append(checkmark);
            }
            e.addEventListener("click", () => {
              currentOption = option.name;
              p.textContent = option.text;
              optionsContainer.remove();
              if (this.context.onChange) this.context.onChange(option.name);
            });
            optionsContainer.append(e);
          });
          select.append(optionsContainer);
        }
      });
      const p = document.createElement("p");
      p.textContent = options.find((option) => option.name === currentOption)?.text ?? "";
      const arrow = createElement(ChevronDown);
      const checkmark = createElement(Check);
      checkmark.style.cssText = "position: absolute; right: 0.25em;";
      select.append(p, arrow);
      if (this.context.isDisabled && this.context.isDisabled()) select.classList.add("zcDisabled");
      return {
        base: select
      };
    }
    update() {
      super.update();
      autosetFontSize(this.body.base);
    }
  };

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/shards/svgShard.js
  var SvgShard = class extends Shard {
    generateBody() {
      const { dataurl, size, fill = "var(--tmd-accent, black)", stroke = "var(--tmd-accent-hover, black)", strokeWidth = "2px" } = this.context;
      function dataURLToSVGElement(dataURL) {
        const svgEncoded = dataURL.replace("data:image/svg+xml,", "");
        const svgString = decodeURIComponent(svgEncoded);
        const div = document.createElement("div");
        div.innerHTML = svgString;
        return div.firstElementChild;
      }
      const svg = dataURLToSVGElement(dataurl);
      if (svg) {
        recolorSVG(svg, { fill, stroke });
        svg.setAttribute("stroke-width", strokeWidth);
      }
      return {
        base: svg
      };
    }
    update() {
      super.update();
      setSize(this.body.base, this.context.size, this.context.size);
    }
  };

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/shards/tabsShard.js
  var TabsShard = class extends Shard {
    tabHandlers = {};
    clearDrawProcessHook = null;
    constructor(context) {
      super(context);
    }
    generateBody() {
      this.tabHandlers ??= {};
      this.clearDrawProcessHook = null;
      const { tabs, currentTabName } = this.context;
      let tabElements = [];
      const tabsEl = document.createElement("div");
      tabsEl.classList.add("zcTabs");
      setFontFamily(tabsEl, MOD_DATA.fontFamily);
      tabs.forEach((tab) => {
        const switchTab = () => {
          for (const c of tabsEl.children) {
            c.removeAttribute("data-opened");
          }
          for (const c of tabElements) {
            if (c instanceof Node) document.body.removeChild(c);
          }
          tabElements = [];
          tabEl.setAttribute("data-opened", "true");
          const originalAppend = document.body.append.bind(document.body);
          document.body.append = (...nodes) => {
            tabElements.push(...nodes);
            originalAppend(...nodes);
          };
          this.clearDrawProcessHook?.();
          this.tabHandlers.unload?.();
          this.tabHandlers.exit?.();
          this.tabHandlers = {
            run: tab.run,
            load: tab.load,
            unload: tab.unload,
            exit: tab.exit
          };
          this.clearDrawProcessHook = null;
          this.tabHandlers.load?.();
          if (tab.run) {
            this.clearDrawProcessHook = hookFunction("DrawProcess", HookPriority.ADD_BEHAVIOR, (args, next) => {
              next(args);
              tab.run?.();
            });
          }
          document.body.append = originalAppend;
        };
        const tabEl = document.createElement("button");
        tabEl.textContent = tab.name;
        if (tab.name === currentTabName) switchTab();
        tabEl.addEventListener("click", switchTab);
        tabsEl.append(tabEl);
      });
      eventBus?.once("subscreenUnloaded", () => this.clearDrawProcessHook?.());
      return {
        base: tabsEl
      };
    }
    update() {
      super.update();
      autosetFontSize(this.body.base);
    }
  };

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/shards/textShard.js
  var TextShard = class extends Shard {
    get defaultColor() {
      return "var(--tmd-text, black)";
    }
    generateBody() {
      const p = document.createElement("p");
      p.innerHTML = this.context.text ?? "";
      p.style.color = this.context.color ?? this.defaultColor;
      p.style.margin = "0";
      p.style.boxSizing = "border-box";
      if (this.context.height) p.style.overflow = "auto";
      if (this.context.withBackground) p.style.background = "var(--tmd-element,rgb(239, 239, 239))";
      if (this.context.withBorder) p.style.border = "2px solid var(--tmd-accent, rgb(236, 236, 236))";
      setFontFamily(p, MOD_DATA.fontFamily);
      return {
        base: p
      };
    }
    update() {
      super.update();
      if ((this.context.fontSize ?? "auto") === "auto") autosetFontSize(this.body.base);
      else if (typeof this.context.fontSize === "number") setFontSize(this.body.base, this.context.fontSize);
    }
  };

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/assets/icons/exit.svg
  var exit_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" %0A     width="86" height="86" %0A     viewBox="0 0 86 86" %0A     fill="none">%0A  <g transform="translate(0.000000,86.000000) scale(0.100000,-0.100000)"%0A     fill="currentColor" stroke="none">%0A    <path d="M120 507 l0 -305 151 -81 c83 -45 160 -81 170 -81 18 0 19 12 19 281%0A            0 163 -4 288 -10 299 -11 20 -44 40 -212 129 l-118 62 0 -304z"/>%0A    <path d="M260 787 c31 -19 52 -23 180 -27 l145 -5 3 -72 3 -73 29 0 30 0 0 81%0A            c0 126 14 119 -223 119 l-202 0 35 -23z"/>%0A    <path d="M690 590 c0 -19 -7 -20 -90 -20 l-90 0 0 -60 0 -60 90 0 c83 0 90 -1%0A            90 -20 0 -11 3 -20 7 -20 14 0 93 84 93 99 0 16 -78 101 -92 101 -4 0 -8 -9%0A            -8 -20z"/>%0A    <path d="M590 336 l0 -76 -40 0 c-38 0 -40 -2 -40 -30 0 -29 1 -30 50 -30 77 0%0A            92 20 88 123 -3 81 -3 82 -30 85 l-28 3 0 -75z"/>%0A  </g>%0A</svg>';

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/ui.js
  function hexToRgb(hex) {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgb(${r}, ${g}, ${b})`;
  }
  function recolorSVG(svgElement, { fill, stroke }) {
    const elements = svgElement.querySelectorAll("*");
    elements.forEach((element) => {
      if (element.getAttribute("fill") !== "none") {
        element.setAttribute("fill", fill);
      }
      if (element.getAttribute("stroke") !== "none") {
        element.setAttribute("stroke", stroke);
      }
    });
    if (svgElement.getAttribute("fill") !== "none") {
      svgElement.setAttribute("fill", fill);
    }
    if (svgElement.getAttribute("stroke") !== "none") {
      svgElement.setAttribute("stroke", stroke);
    }
    return svgElement;
  }
  function dataUrlSvgWithColor(dataUrl, newColor) {
    if (newColor.fill?.startsWith("#")) newColor.fill = hexToRgb(newColor.fill);
    if (newColor.stroke?.startsWith("#")) newColor.stroke = hexToRgb(newColor.stroke);
    if (newColor.fill) dataUrl = dataUrl.replace(/fill="[^"]*"/g, `fill="${newColor.fill}"`);
    if (newColor.stroke) dataUrl = dataUrl.replace(/stroke="[^"]*"/g, `stroke="${newColor.stroke}"`);
    return dataUrl;
  }
  function cssVar(name, fallback) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  }
  function getRelativeHeight(height) {
    return height * (MainCanvas.canvas.clientHeight / 1e3);
  }
  function getRelativeWidth(width) {
    return width * (MainCanvas.canvas.clientWidth / 2e3);
  }
  function getRelativeY(yPos, anchorPosition = "top") {
    const scaleY = MainCanvas.canvas.clientHeight / 1e3;
    return anchorPosition === "top" ? MainCanvas.canvas.offsetTop + yPos * scaleY : window.innerHeight - (MainCanvas.canvas.offsetTop + MainCanvas.canvas.clientHeight) + yPos * scaleY;
  }
  function getRelativeX(xPos, anchorPosition = "left") {
    const scaleX = MainCanvas.canvas.clientWidth / 2e3;
    return anchorPosition === "left" ? MainCanvas.canvas.offsetLeft + xPos * scaleX : window.innerWidth - (MainCanvas.canvas.offsetLeft + MainCanvas.canvas.clientWidth) + xPos * scaleX;
  }
  function setPosition(element, xPos, yPos, anchor = "top-left") {
    const yAnchor = anchor === "top-left" || anchor === "top-right" ? "top" : "bottom";
    const xAnchor = anchor === "top-left" || anchor === "bottom-left" ? "left" : "right";
    const y = getRelativeY(yPos, yAnchor);
    const x = getRelativeX(xPos, xAnchor);
    Object.assign(element.style, {
      position: "fixed",
      [xAnchor]: x + "px",
      [yAnchor]: y + "px"
    });
  }
  function setSize(element, width, height) {
    Object.assign(element.style, {
      width: getRelativeWidth(width) + "px",
      height: getRelativeHeight(height) + "px"
    });
  }
  function setFontSize(element, targetFontSize) {
    const canvasWidth = MainCanvas.canvas.clientWidth;
    const canvasHeight = MainCanvas.canvas.clientHeight;
    const scaleFactor = Math.min(canvasWidth, canvasHeight) / 100;
    const fontSize = targetFontSize * scaleFactor;
    Object.assign(element.style, {
      fontSize: fontSize + "px"
    });
  }
  function setFontFamily(element, fontFamily) {
    element.style.fontFamily = fontFamily ?? "sans-serif";
  }
  function setPadding(element, targetPadding) {
    const canvasWidth = MainCanvas.canvas.clientWidth;
    const canvasHeight = MainCanvas.canvas.clientHeight;
    const scaleFactor = Math.min(canvasWidth, canvasHeight) / 100;
    const paddingValue = targetPadding * scaleFactor;
    Object.assign(element.style, {
      padding: paddingValue + "px"
    });
  }
  function autosetFontSize(element) {
    const Font = MainCanvas.canvas.clientWidth <= MainCanvas.canvas.clientHeight * 2 ? MainCanvas.canvas.clientWidth / 50 : MainCanvas.canvas.clientHeight / 25;
    Object.assign(element.style, {
      fontSize: Font + "px"
    });
  }
  function setSizeUnitVariable() {
    const canvasWidth = MainCanvas.canvas.clientWidth;
    const canvasHeight = MainCanvas.canvas.clientHeight;
    const scaleFactor = Math.min(canvasWidth, canvasHeight) / 100;
    document.documentElement.style.setProperty("--size-unit", scaleFactor.toString());
  }
  var createdDynamicClasses = [];
  function generateDynamicClassCacheKey(styles) {
    const sortedStringify = (obj) => {
      if (!obj) return "null";
      return JSON.stringify(
        Object.keys(obj).sort().reduce((acc, key) => {
          acc[key] = obj[key];
          return acc;
        }, {})
      );
    };
    let cacheKey = "";
    for (const [key, value] of Object.entries(styles)) {
      if (value === void 0) continue;
      cacheKey += `${key}:=${sortedStringify(value)}|`;
    }
    return cacheKey;
  }
  function addDynamicClass(targetElement, styles) {
    const cacheKey = generateDynamicClassCacheKey(styles);
    const _class = createdDynamicClasses.find((g) => g.key === cacheKey);
    if (_class) return targetElement.classList.add(_class.className);
    let className;
    do {
      className = "dynamic-" + Math.random().toString(36).substring(2, 10);
    } while (createdDynamicClasses.find((g) => g.className === className));
    createdDynamicClasses.push({
      key: cacheKey,
      className
    });
    const buildCssBlock = (selector, styleRules) => {
      let css = `${selector} {`;
      for (const [property, value] of Object.entries(styleRules)) {
        css += `${property.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase()}: ${value};`;
      }
      css += "}";
      return css;
    };
    let cssRules = "";
    for (const [key, value] of Object.entries(styles)) {
      if (value === void 0) continue;
      if (key === "base") {
        cssRules += buildCssBlock(`.${className}`, value);
      } else if (["hover", "active", "focus", "disabled", "before", "after"].includes(key)) {
        cssRules += buildCssBlock(`.${className}:${key}`, value);
      } else {
        cssRules += buildCssBlock(`.${className}${key}`, value);
      }
    }
    let styleElement = document.getElementById(`${MOD_DATA.key ?? ""}-dynamic-classes`);
    if (styleElement) {
      styleElement.textContent += cssRules;
    } else {
      styleElement = document.createElement("style");
      styleElement.id = `${MOD_DATA.key ?? ""}-dynamic-classes`;
      styleElement.textContent = cssRules;
      document.head.appendChild(styleElement);
    }
    targetElement.classList.add(className);
  }
  function setPreviousSubscreen() {
    setSubscreen(previousSubscreen);
  }
  var previousSubscreen = null;
  var currentSubscreen = null;
  function setSubscreen(subscreen) {
    previousSubscreen = currentSubscreen;
    currentSubscreen = subscreen;
    if (previousSubscreen) {
      try {
        previousSubscreen.unload();
      } catch (e) {
        logger.error("Failed to unload subscreen", previousSubscreen, e);
      }
    }
    if (subscreen) {
      try {
        subscreen.load();
      } catch (e) {
        logger.error("Failed to load subscreen", subscreen, e);
      }
    }
  }
  function getCurrentSubscreen() {
    return currentSubscreen;
  }
  function getPreviousSubscreen() {
    return previousSubscreen;
  }
  var BaseSubscreen = class {
    setSubscreen = setSubscreen;
    setPreviousSubscreen = setPreviousSubscreen;
    get currentSubscreen() {
      return getCurrentSubscreen();
    }
    get previousSubscreen() {
      return getPreviousSubscreen();
    }
    /**
     * Called each frame.
     * 
     * You probably want to override {@link onRun}, **do not** override `run` if you don't understand what you're doing.
     */
    run() {
      this.onRun?.();
    }
    /**
     * Called once after `setSubscreen()`.
     * Responsible for how the subscreen will load.
     * 
     * You probably want to override {@link onLoad}, **do not** override `load` if you don't understand what you're doing.
     * 
     * Override {@link onLoad} for creating UI elements.
     */
    load() {
      setSizeUnitVariable();
      this.createExitButton();
      if (this.name) this.createSubscreenTitle();
      this.onLoad?.();
      eventBus?.emit("subscreenLoaded", {
        subscreen: this
      });
    }
    /**
     * Called once when subscreen is being unloaded.
     * 
     * You probably want to override {@link onUnload}, **do not** override `unload` if you don't understand what you're doing.
     */
    unload() {
      this.onUnload?.();
      eventBus?.emit("subscreenUnloaded", {
        subscreen: this
      });
    }
    /**
     * Called after user clicks.
     * 
     * You probably want to override {@link onClick}, **do not** override `click` if you don't understand what you're doing.
     */
    click() {
      this.onClick?.();
    }
    /**
     * Called after user presses `Esc` or clicks on exit button.
     * 
     * Not called after subscreen unloading with `setSubscreen()`
     * 
     * You probably want to override {@link onExit}, **do not** override `exit` if you don't understand what you're doing.
     */
    exit() {
      this.onExit?.();
      setPreviousSubscreen();
    }
    update() {
    }
    /**
     * Called after screen size change.
     * 
     * You probably want to override {@link onResize}, **do not** override `resize` if you don't understand what you're doing.
     */
    resize() {
      setSizeUnitVariable();
      this.onResize?.();
    }
    createExitButton() {
      this.createButton({
        x: 1815,
        y: 75,
        width: 90,
        height: 90,
        icon: dataUrlSvgWithColor(exit_default, { fill: cssVar("--tmd-text", "black") }),
        tooltip: {
          position: "left",
          text: "Back"
        },
        modules: {
          base: [
            new StyleModule({
              zIndex: "10"
            })
          ]
        },
        onClick: () => this.exit()
      });
    }
    createSubscreenTitle() {
      this.createText({
        text: this.name,
        x: 100,
        y: 60,
        fontSize: 8
      }).style.cssText += "max-width: 85%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding: 0.1em;";
    }
    create(shard) {
      const htmlElement = shard.mount();
      return htmlElement;
    }
    createButton(ctx) {
      const shard = new ButtonShard(ctx);
      const htmlElement = shard.mount();
      return htmlElement;
    }
    createText(ctx) {
      const shard = new TextShard(ctx);
      const htmlElement = shard.mount();
      return htmlElement;
    }
    createInput(ctx) {
      const shard = new InputShard(ctx);
      const htmlElement = shard.mount();
      return htmlElement;
    }
    createCheckbox(ctx) {
      const shard = new CheckboxShard(ctx);
      const htmlElement = shard.mount();
      return htmlElement;
    }
    createInputList(ctx) {
      const shard = new InputListShard(ctx);
      const htmlElement = shard.mount();
      return htmlElement;
    }
    createImage(ctx) {
      const shard = new ImageShard(ctx);
      const htmlElement = shard.mount();
      return htmlElement;
    }
    createSvg(ctx) {
      const shard = new SvgShard(ctx);
      const htmlElement = shard.mount();
      return htmlElement;
    }
    createBackNextButton(ctx) {
      const shard = new BackNextButtonShard(ctx);
      const htmlElement = shard.mount();
      return htmlElement;
    }
    createTabs(ctx) {
      const shard = new TabsShard(ctx);
      const htmlElement = shard.mount();
      return htmlElement;
    }
    drawPolylineArrow({
      points,
      strokeColor = cssVar("--tmd-text", "black"),
      lineWidth = 2,
      circleRadius = 5,
      circleColor = cssVar("--tmd-text", "black")
    }) {
      if (points.length < 2) return;
      const ctx = MainCanvas.canvas.getContext("2d");
      if (!ctx) return;
      ctx.save();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.fillStyle = circleColor;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(points[0].x, points[0].y, circleRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(points[points.length - 1].x, points[points.length - 1].y, circleRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    createCard(ctx) {
      const shard = new CardShard(ctx);
      const htmlElement = shard.mount();
      return htmlElement;
    }
    createSelect(ctx) {
      const shard = new SelectShard(ctx);
      const htmlElement = shard.mount();
      return htmlElement;
    }
    createContainer(ctx) {
      const shard = new ContainerShard(ctx);
      const htmlElement = shard.mount();
      return htmlElement;
    }
  };

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/core-subscreen/shards/coreButtonShard.js
  var CoreButtonShard = class extends ButtonShard {
    get dynamicClassButton() {
      return {
        ...super.dynamicClassButton,
        base: {
          ...super.dynamicClassButton.base,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          columnGap: "1.25vw",
          border: "2px solid #33c633",
          outline: "none",
          cursor: "pointer",
          background: "#20a214",
          color: "#004800",
          borderRadius: "0.1em"
        },
        hover: {
          ...super.dynamicClassButton.hover,
          background: "#39bd2dff",
          color: "#76ff76ff",
          borderColor: "#76ff76ff"
        }
      };
    }
  };

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/core-subscreen/shards/coreTextShard.js
  var CoreTextShard = class extends TextShard {
    get defaultColor() {
      return "rgb(162, 255, 19)";
    }
  };

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/core-subscreen/shards/coreSelectShard.js
  var CoreSelectShard = class extends SelectShard {
    get dynamicClassContainer() {
      return {
        ...super.dynamicClassContainer,
        base: {
          ...super.dynamicClassContainer.base,
          background: "#20a214",
          color: "rgb(162, 255, 19)",
          border: "2px solid #33c633"
        }
      };
    }
  };

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/core-subscreen/shards/coreCheckboxShard.js
  var CoreCheckboxShard = class extends CheckboxShard {
    get dynamicClassInput() {
      return {
        ...super.dynamicClassInput,
        base: {
          ...super.dynamicClassInput.base,
          border: "var(--border-width) solid #33c633 !important",
          backgroundColor: "#20a214 !important",
          color: "rgb(162, 255, 19) !important"
        },
        hover: {
          ...super.dynamicClassInput.hover,
          backgroundColor: "#39bd2dff !important",
          color: "#76ff76ff !important"
        },
        before: {
          ...super.dynamicClassInput.before,
          backgroundColor: "rgb(162, 255, 19) !important"
        },
        ".zcDisabled": {
          ...super.dynamicClassInput[".zcDisabled"],
          backgroundColor: "var(--disabled-color)"
        }
      };
    }
    get textColor() {
      return "rgb(162, 255, 19)";
    }
  };

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/core-subscreen/shards/coreInputListShard.js
  var CoreInputListShard = class extends InputListShard {
    get dynamicClassContainer() {
      return {
        ...super.dynamicClassContainer,
        base: {
          ...super.dynamicClassContainer.base,
          background: "#20a214 !important",
          border: "2px solid #33c633"
        },
        "> div:first-child > b": {
          ...super.dynamicClassContainer["> div:first-child > b"],
          color: "rgb(155, 255, 0)"
        },
        "> div:last-child > div": {
          ...super.dynamicClassContainer["> div:last-child > div"],
          background: "rgb(112, 234, 68)",
          color: "black"
        }
      };
    }
    get dynamicClassToolsButton() {
      return {
        ...super.dynamicClassToolsButton,
        base: {
          ...super.dynamicClassToolsButton.base,
          background: "rgb(112, 234, 68)",
          color: "black"
        },
        hover: {
          background: "rgb(77, 221, 65)"
        }
      };
    }
  };

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/core-subscreen/coreSubscreen.js
  var CoreSubscreen = class extends BaseSubscreen {
    g = 40;
    h = 0.05;
    interval = null;
    run() {
      DrawRect(0, 0, 2e3, 1e3, "#008600ff");
      for (let x = 0; x <= 2e3; x += this.g) {
        DrawRect(x, 0, 5, 1e3, "#17a117ff");
      }
      for (let y = 0; y <= 1e3; y += this.g) {
        DrawRect(0, y, 2e3, 5, "#17a117ff");
      }
    }
    load() {
      this.createText({
        x: 60,
        y: 40,
        text: this.name,
        fontSize: 6,
        modules: {
          base: [
            new StyleModule({
              fontWeight: "bold"
            })
          ]
        }
      });
      this.createButton({
        anchor: "top-right",
        x: 40,
        y: 40,
        width: 90,
        height: 90,
        icon: "Icons/Exit.png",
        onClick: () => this.exit()
      });
      this.g = 40;
      this.h = 0.05;
      this.interval = setInterval(() => {
        this.g += this.h;
        if (this.g >= 60) this.h = -0.05;
        if (this.g <= 40) this.h = 0.05;
      }, 50);
    }
    createText(ctx) {
      const shard = new CoreTextShard(ctx);
      const htmlElement = shard.mount();
      return htmlElement;
    }
    createButton(ctx) {
      const shard = new CoreButtonShard(ctx);
      const htmlElement = shard.mount();
      return htmlElement;
    }
    createCheckbox(ctx) {
      const shard = new CoreCheckboxShard(ctx);
      const htmlElement = shard.mount();
      return htmlElement;
    }
    createInputList(ctx) {
      const shard = new CoreInputListShard(ctx);
      const htmlElement = shard.mount();
      return htmlElement;
    }
    createSelect(ctx) {
      const shard = new CoreSelectShard(ctx);
      const htmlElement = shard.mount();
      return htmlElement;
    }
    unload() {
      super.unload();
      if (this.interval) clearInterval(this.interval);
    }
  };

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/core-subscreen/generalSubscreen.js
  var GeneralSubscreen = class extends CoreSubscreen {
    get name() {
      return "General";
    }
    load() {
      super.load();
      this.createCheckbox({
        x: 60,
        y: 200,
        text: "Dev Mode",
        isChecked: !!coreSettings.devMode,
        onChange: () => {
          coreSettings.devMode = false;
          delete PreferenceExtensionsSettings.ZOIS_CORE;
        }
      });
    }
  };

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/toasts.js
  function createToastsContainer() {
    const container = document.createElement("div");
    container.classList.add("zcToastsContainer");
    container.addEventListener("click", () => {
      const pos = window.ZOIS_CORE.getSettings().toasts?.position ?? "bottom-left";
      for (const toast of container.children) {
        if (toast instanceof HTMLElement) {
          toast.style.animation = `${pos.includes("left") ? "zcSlideOutToLeft" : "zcSlideOutToRight"} 0.3s ease-out forwards`;
        }
      }
      setTimeout(() => container.innerHTML = "", 300);
    });
    const update = () => {
      container.style.cssText = `font-family: ${CommonGetFontName()};`;
      setPosition(container, 5, 5, window.ZOIS_CORE.getSettings().toasts?.position ?? "bottom-left");
    };
    window.addEventListener("resize", update);
    document.body.append(container);
    update();
    eventBus?.on("zois-core:coreSettingsChanged", update);
    return container;
  }
  function getToastIcon(type, theme) {
    let icon;
    switch (type) {
      case "info":
        icon = createElement(Info);
        icon.style.fill = theme ? theme.iconFillColor : "rgb(68, 70, 202)";
        icon.style.stroke = theme ? theme.iconStrokeColor : "rgb(148, 178, 217)";
        break;
      case "warning":
        icon = createElement(CircleAlert);
        icon.style.fill = theme ? theme.iconFillColor : "rgb(198, 146, 25)";
        icon.style.stroke = theme ? theme.iconStrokeColor : "rgb(244, 220, 147)";
        break;
      case "error":
        icon = createElement(CircleX);
        icon.style.fill = theme ? theme.iconFillColor : "rgb(174, 1, 1)";
        icon.style.stroke = theme ? theme.iconStrokeColor : "rgb(255, 163, 163)";
        break;
      case "success":
        icon = createElement(CircleCheck);
        icon.style.fill = theme ? theme.iconFillColor : "rgb(49, 142, 68)";
        icon.style.stroke = theme ? theme.iconStrokeColor : "rgb(122, 213, 162)";
        break;
      case "spinner":
        icon = document.createElement("div");
        icon.style.cssText = `
                box-sizing: border-box;
                border: 2px solid;
                border-radius: 100%;
                border-color: transparent ${theme ? theme.iconFillColor : "rgb(68, 70, 202)"};
                animation: zcSpin 0.65s linear infinite;
            `;
        break;
    }
    icon.style.cssText += `flex-shink: 0; width: 1.65em; height: 1.65em;`;
    return icon;
  }
  function createToast({ title, message, type, duration, theme, id }) {
    const pos = window.ZOIS_CORE.getSettings().toasts?.position ?? "bottom-left";
    const backgroundColor = theme ? theme.backgroundColor : type === "success" ? "rgb(122, 213, 162)" : type === "warning" ? "rgb(244, 220, 147)" : type === "error" ? "rgb(255, 163, 163)" : "rgb(148, 178, 217)";
    const textColor = theme ? theme.titleColor : type === "info" || type === "spinner" ? "rgb(0, 2, 125)" : type === "success" ? "#244428" : type === "error" ? "rgb(128, 22, 22)" : "rgb(100, 74, 16)";
    const progressBarColor = theme ? theme.progressBarColor : "#00000014";
    const toastContainer = document.querySelector(".zcToastsContainer") ?? createToastsContainer();
    const toast = document.createElement("div");
    toast.classList.add("zcToast");
    toast.setAttribute("data-zc-toast-type", type);
    toast.setAttribute("data-zc-toast-id", id);
    const update = () => {
      const canvasWidth = MainCanvas.canvas.clientWidth;
      const canvasHeight = MainCanvas.canvas.clientHeight;
      const scaleFactor = Math.min(canvasWidth, canvasHeight) / 100;
      toast.style.cssText = `width: 100%; font-size: ${2.85 * scaleFactor}px; padding: ${1 * scaleFactor}px; background: ${backgroundColor}; border: 1px solid #555;`;
      toast.style.animation = `${pos.includes("left") ? "zcSlideInFromLeft" : "zcSlideInFromRight"} 0.3s ease-out forwards`;
    };
    if (type !== "spinner") {
      const progressBar = document.createElement("div");
      progressBar.classList.add("zcToast-ProgressBar");
      progressBar.style.cssText = `animation: zcToast-progress ${duration}ms linear 0s 1 alternate none; position: absolute; top: 0; left: 0; height: 100%; border-radius: 4px; background: ${progressBarColor};`;
      toast.append(progressBar);
    }
    const textContainer = document.createElement("div");
    if (title) {
      const _title = document.createElement("p");
      _title.style.color = textColor;
      _title.style.fontWeight = "bold";
      _title.style.fontSize = "0.9em";
      _title.textContent = title;
      textContainer.append(_title);
    }
    const _message = document.createElement("p");
    _message.style.color = textColor;
    _message.style.fontSize = !!title ? "0.7em" : "0.9em";
    _message.style.overflowWrap = "anywhere";
    if (!title) {
      _message.style.fontWeight = "bold";
    } else {
      _message.style.marginTop = "0.15em";
    }
    _message.textContent = message;
    textContainer.append(_message);
    toast.append(getToastIcon(type, theme), textContainer);
    window.addEventListener("resize", update);
    toastContainer.append(toast);
    update();
    void toast.offsetHeight;
    setTimeout(() => {
      toast.style.animation = `${pos.includes("left") ? "zcSlideOutToLeft" : "zcSlideOutToRight"} 0.3s ease-out forwards`;
    }, duration);
    setTimeout(() => toast.remove(), duration + 300);
  }
  var ToastsManager = class {
    generateToastId() {
      return crypto.randomUUID();
    }
    process({ title, message, duration, type, id, theme }) {
      const coreSettings2 = window.ZOIS_CORE.getSettings();
      if (coreSettings2.toasts?.blacklist?.enabled && coreSettings2.toasts.blacklist.content?.length !== 0) {
        if (coreSettings2.toasts.blacklist.content?.some((v) => {
          const regexp = new RegExp(v);
          return regexp.test(title ?? "") || regexp.test(message);
        })) {
          logger.log("Toast message blocked due to blacklist settings");
          return;
        }
      }
      if (coreSettings2.toasts?.preventUsingSingleTheme) {
        createToast({
          id,
          title,
          message,
          duration,
          type
        });
      } else {
        createToast({
          id,
          title,
          message,
          duration,
          type,
          theme
        });
      }
    }
    /**
    * Displays informational toast.
    * @param options - Title, message and duration of toast.
    */
    info({ title, message, duration }) {
      const id = this.generateToastId();
      const theme = MOD_DATA.singleToastsTheme;
      this.process({ title, message, duration, type: "info", id, theme });
    }
    /**
    * Displays success toast.
    * @param options - Title, message and duration of toast.
    */
    success({ title, message, duration }) {
      const id = this.generateToastId();
      const theme = MOD_DATA.singleToastsTheme;
      this.process({ title, message, duration, type: "success", id, theme });
    }
    /**
    * Displays warning toast.
    * @param options - Title, message and duration of toast.
    */
    warn({ title, message, duration }) {
      const id = this.generateToastId();
      const theme = MOD_DATA.singleToastsTheme;
      this.process({ title, message, duration, type: "warning", id, theme });
    }
    /**
    * Displays error toast.
    * @param options - Title, message and duration of toast.
    */
    error({ title, message, duration }) {
      const id = this.generateToastId();
      const theme = MOD_DATA.singleToastsTheme;
      this.process({ title, message, duration, type: "error", id, theme });
    }
    /**
    * Displays a long-running spinner toast and returns its ID.
    * Toast can be deleted manually with `toastsManager.removeSpinner(ID)` or by the user by clicking.
    * @param options - Title and message of toast.
    * @returns The unique ID of the created spinner toast.
    */
    spinner({ title, message }) {
      const id = this.generateToastId();
      const theme = MOD_DATA.singleToastsTheme;
      this.process({ title, message, duration: 1e6, type: "spinner", id, theme });
      return id;
    }
    /**
    * Removes a spinner toast by its ID.
    * @param id - Unique ID of the spinner toast to remove.
    */
    removeSpinner(id) {
      const toast = document.querySelector(`div[data-zc-toast-id="${id}"]`);
      if (!toast) return;
      const pos = window.ZOIS_CORE.getSettings().toasts?.position ?? "bottom-left";
      toast.style.animation = `${pos.includes("left") ? "zcSlideOutToLeft" : "zcSlideOutToRight"} 0.3s ease-out forwards`;
      setTimeout(() => toast.remove(), 300);
    }
  };
  var toastsManager = new ToastsManager();

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/core-subscreen/toastsSubscreen.js
  var ToastsSubscreen = class extends CoreSubscreen {
    get name() {
      return "Toasts";
    }
    load() {
      super.load();
      this.createCheckbox({
        x: 60,
        y: 200,
        text: "Blacklist Enabled",
        isChecked: !!coreSettings.toasts?.blacklist?.enabled,
        onChange: () => {
          coreSettings.toasts ??= {};
          coreSettings.toasts.blacklist ??= {};
          coreSettings.toasts.blacklist.enabled = !coreSettings.toasts.blacklist.enabled;
        }
      });
      this.createCheckbox({
        x: 60,
        y: 280,
        text: "Prevent Using Single Theme",
        isChecked: !!coreSettings.toasts?.preventUsingSingleTheme,
        onChange: () => {
          coreSettings.toasts ??= {};
          coreSettings.toasts.preventUsingSingleTheme = !coreSettings.toasts.preventUsingSingleTheme;
        }
      });
      this.createText({
        text: "Toasts Position:",
        x: 60,
        y: 380
      });
      this.createSelect({
        x: 400,
        y: 360,
        width: 500,
        options: [
          {
            name: "top-left",
            text: "Top Left"
          },
          {
            name: "top-right",
            text: "Top Right"
          },
          {
            name: "bottom-left",
            text: "Bottom Left"
          },
          {
            name: "bottom-right",
            text: "Bottom Right"
          }
        ],
        currentOption: coreSettings.toasts?.position ?? "bottom-left",
        onChange: (pos) => {
          coreSettings.toasts ??= {};
          coreSettings.toasts.position = pos;
        }
      });
      this.createInputList({
        title: "Blacklist",
        x: 1100,
        y: 200,
        width: 800,
        height: 600,
        value: coreSettings.toasts?.blacklist?.content ?? [],
        onChange: (value) => {
          coreSettings.toasts ??= {};
          coreSettings.toasts.blacklist ??= {};
          coreSettings.toasts.blacklist.content = value;
        }
      });
      this.createButton({
        text: "Test",
        x: 60,
        y: 850,
        padding: 1,
        width: 400,
        onClick: () => {
          syncSettings();
          toastsManager.success({
            title: "Something was completed successfully",
            message: "Message details",
            duration: 8e3
          });
          toastsManager.info({
            title: "Very important announcement",
            message: "You have been informed that you have been informed",
            duration: 8e3
          });
          toastsManager.warn({
            title: "Don't look at me like that",
            message: "You were warned",
            duration: 8e3
          });
          toastsManager.error({
            title: "Critical bug found",
            message: "Catch him!",
            duration: 8e3
          });
        }
      });
    }
  };

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/core-subscreen/developmentSubscreen.js
  var DevelopmentSubscreen = class extends CoreSubscreen {
    get name() {
      return "Development";
    }
    load() {
      super.load();
      this.createCheckbox({
        x: 60,
        y: 200,
        text: "Auto Connect To Dev Server",
        isChecked: localStorage.getItem("autoConnectToDevServer") === "true",
        onChange: () => {
          const prev = localStorage.getItem("autoConnectToDevServer");
          localStorage.setItem("autoConnectToDevServer", prev === "true" ? "false" : "true");
        }
      });
    }
  };

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/core-subscreen/mainSubscreen.js
  var MainSubscreen = class extends CoreSubscreen {
    get name() {
      return "Zoi's Modding Core";
    }
    load() {
      super.load();
      this.createText({
        x: 60,
        y: 120,
        text: "Here are all the experimental settings and settings for developing and debugging my mods."
      });
      [new GeneralSubscreen(), new ToastsSubscreen(), new DevelopmentSubscreen()].forEach((s, i) => {
        this.createButton({
          x: 100,
          y: 240 + 115 * i,
          padding: 2,
          text: s.name,
          width: 600,
          fontSize: 5,
          onClick: () => {
            this.setSubscreen(s);
          }
        });
      });
      this.createButton({
        anchor: "bottom-right",
        x: 40,
        y: 40,
        width: 90,
        height: 90,
        icon: createElement(BookText),
        onClick: () => {
          window.open(`https://github.com/FurryZoi/zois-core`, "_blank");
        }
      });
      this.createText({
        text: "This place is in WIP stage",
        x: 1e3,
        y: 500,
        fontSize: 6
      });
    }
    exit() {
      super.exit();
      this.setSubscreen(null);
      PreferenceSubscreenExtensionsClear();
      syncSettings();
    }
  };

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/dialogs.js
  function createDialog(dialog) {
    return new Promise((resolve, reject) => {
      let inputOrSelectElement = null;
      const clear = () => {
        _dialog.remove();
        background.remove();
        document.removeEventListener("keydown", handleKeyDown, { capture: true });
      };
      const submit = () => {
        clear();
        if (dialog.type === "prompt") {
          resolve(inputOrSelectElement.value);
        }
        if (dialog.type === "confirm") {
          resolve(true);
        }
        if (dialog.type === "pick") {
          resolve(inputOrSelectElement.value);
        }
      };
      const cancel = () => {
        clear();
        resolve(false);
      };
      const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
        }
        if (e.key === "Enter") submit();
        if (e.key === "Escape") cancel();
      };
      document.addEventListener("keydown", handleKeyDown, { capture: true });
      const background = document.createElement("div");
      background.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 20; opacity: 0.5; background: black;";
      const _dialog = document.createElement("div");
      _dialog.classList.add("zcDialog");
      _dialog.setAttribute("data-zc-dialog-type", dialog.type);
      _dialog.style.fontFamily = CommonGetFontName();
      const message = document.createElement("p");
      message.textContent = dialog.message;
      _dialog.append(message);
      switch (dialog.type) {
        case "confirm": {
          break;
        }
        case "prompt": {
          const input = document.createElement("input");
          input.style.cssText = "color: white; margin-top: 1px; width: 90%; background: rgb(82, 89, 104); border: none; border-radius: 4px; padding: 0.45em;";
          inputOrSelectElement = input;
          _dialog.append(input);
          break;
        }
        case "pick": {
          const select = document.createElement("select");
          select.style.cssText = "cursor: pointer; width: 90%; background: rgb(82, 89, 104); border: none; padding: 0.4em; color: white; border-radius: 4px;";
          dialog.options.forEach((o) => {
            const option = document.createElement("option");
            option.setAttribute("key", o.name);
            option.text = o.name;
            select.append(option);
          });
          inputOrSelectElement = select;
          _dialog.append(select);
          break;
        }
      }
      const buttons = document.createElement("div");
      buttons.style.cssText = "display: flex; justify-content: end; column-gap: 0.75em; width: 90%; padding: 0.9em 0;";
      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Cancel";
      cancelBtn.addEventListener("click", cancel);
      const submitBtn = document.createElement("button");
      submitBtn.textContent = "Ok";
      submitBtn.addEventListener("click", submit);
      buttons.append(cancelBtn, submitBtn);
      _dialog.append(buttons);
      document.body.append(_dialog, background);
      if (inputOrSelectElement) inputOrSelectElement.focus();
    });
  }
  var DialogsManager = class {
    process(dialogProps) {
      return createDialog(dialogProps);
    }
    prompt({ message }) {
      return this.process({
        type: "prompt",
        message
      });
    }
    confirm({ message }) {
      return this.process({
        type: "confirm",
        message
      });
    }
    pick({ message, options }) {
      return this.process({
        type: "pick",
        message,
        options
      });
    }
  };
  var dialogsManager = new DialogsManager();

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/core.js
  var coreSettings = {};
  var coreEventBus = null;
  function syncSettings() {
    if (typeof coreSettings !== "object") return;
    Player.ExtensionSettings.ZOIS_CORE = LZString.compressToBase64(JSON.stringify(coreSettings));
    ServerPlayerExtensionSettingsSync("ZOIS_CORE");
    coreEventBus?.emit("coreSettingsChanged", {
      settings: structuredClone(coreSettings)
    });
  }
  function registerSubscreen() {
    PreferenceRegisterExtensionSetting({
      Identifier: "ZOIS_CORE",
      Image: () => {
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(createElement(Terminal));
        return "data:image/svg+xml," + svgString;
      },
      ButtonText: () => "Zoi's Modding Core",
      load: () => {
        setSubscreen(new MainSubscreen());
      },
      run: () => {
        getCurrentSubscreen()?.run();
      },
      resize: () => {
        getCurrentSubscreen()?.resize();
      },
      click: () => {
        getCurrentSubscreen()?.click();
      },
      exit: () => {
        getCurrentSubscreen()?.exit();
      }
    });
  }
  var loginScreenElements = [];
  function registerCore() {
    const style = document.createElement("style");
    style.innerHTML = styles_default;
    document.head.append(style);
    coreEventBus = getEventBus("zois-core");
    window.ZOIS_CORE = Object.freeze({
      version,
      enableDevMode: () => {
        if (typeof Player?.MemberNumber !== "number") return;
        coreSettings.devMode = true;
        syncSettings();
        registerSubscreen();
      },
      getSettings: () => {
        return JSON.parse(JSON.stringify(coreSettings));
      },
      getEventBus
    });
    if (localStorage.getItem("autoConnectToDevServer") === "true") {
      hookFunction("CommonGetServer", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
        return "https://bondage-club-server-test.herokuapp.com/";
      });
      const containerShard = new ContainerShard({
        x: 1250,
        y: 900,
        modules: {
          base: [
            new StyleModule({
              display: "flex"
            })
          ]
        }
      });
      const container = containerShard.mount();
      new ButtonShard({
        padding: 1,
        parent: container,
        text: "You connected to dev server"
      }).mount();
      new ButtonShard({
        width: 90,
        height: 90,
        padding: 1,
        icon: "Icons/Cancel.png",
        parent: container,
        onClick: () => {
          localStorage.removeItem("autoConnectToDevServer");
          location.reload();
        }
      }).mount();
      loginScreenElements.push(container);
      hookFunction("LoginUnload", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
        loginScreenElements.forEach((e) => e.remove());
        return next(args);
      });
      ServerURL = CommonGetServer();
      ServerInit();
    }
    hookFunction("ChatRoomMessageCreateReplyMessageElement", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
      const [msgId, displayMessage, data] = args;
      const r = formatString(displayMessage);
      if (!r.isBeatifulString) return next(args);
      if (!msgId) {
        return [displayMessage];
      }
      const metadata = ChatRoomGetMetadataElem(data.time, data.sender);
      metadata.setAttribute("aria-hidden", "true");
      return [
        ElementCreate({
          tag: "span",
          classList: ["chat-room-message-content"],
          attributes: { "msgid": msgId },
          innerHTML: r.html
        }),
        ElementMenu.Create(
          ElementGenerateID(),
          [
            metadata,
            ElementButton.Create(
              null,
              () => ChatRoomMessageSetReply(msgId),
              { noStyling: true, tooltip: "Reply" },
              { button: { attributes: { name: "reply" } } }
            )
          ],
          { direction: "rtl", role: "menu" },
          { menu: { classList: ["chat-room-message-popup"], attributes: { "aria-direction": "horizontal" } } }
        )
      ];
    });
    document.addEventListener("click", async (event) => {
      const link = event.target.closest("a");
      if (link && link.href) {
        try {
          const url = new URL(link.href);
          if (url.protocol === "zc:") {
            event.preventDefault();
            if (link.href.startsWith("zc://open")) {
              const target = url.pathname.split("/").filter(Boolean)[1];
              if (target === void 0) return;
              switch (target) {
                case "Admin": {
                  if (await dialogsManager.confirm({ message: "This deep link wants to redirect you to Admin subscreen. Confirm the redirecting." })) {
                    ChatRoomOpenAdminScreen();
                  }
                  break;
                }
                case "Wardrobe": {
                  if (await dialogsManager.confirm({ message: "This deep link wants to redirect you to Wardrobe subscreen. Confirm the redirecting." })) {
                    ChatRoomOpenWardrobeScreen();
                  }
                  break;
                }
                case "Information": {
                  if (await dialogsManager.confirm({ message: "This deep link wants to redirect you to Information subscreen. Confirm the redirecting." })) {
                    ChatRoomOpenInformationScreen();
                  }
                  break;
                }
                default: {
                  coreEventBus?.emit("setSubscreen", {
                    target,
                    isTrusted: false
                  });
                }
              }
            }
          }
        } catch (e) {
        }
      }
    }, true);
    waitFor(() => typeof Player?.MemberNumber === "number").then(() => {
      if (typeof Player.ExtensionSettings.ZOIS_CORE === "string") {
        coreSettings = JSON.parse(LZString.decompressFromBase64(Player.ExtensionSettings.ZOIS_CORE) ?? "{}");
      }
      if (coreSettings.devMode) registerSubscreen();
    });
  }

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/localization.js
  var translations = {};
  async function loadLocalization() {
    if (MOD_DATA.localization === void 0) {
      logger.log("Skip localization procedure because its not configured");
      return;
    }
    const supportedLocales = MOD_DATA.localization.locales.supported;
    const defaultLocale = MOD_DATA.localization.locales.default;
    const preferredLocale = TranslationLanguage.toLowerCase();
    if (!supportedLocales.includes(defaultLocale)) {
      logger.warn(`Default locale ${defaultLocale} isn't supported, fix configuration`);
      return;
    }
    hookFunction("TranslationSwitchLanguage", HookPriority.OBSERVE, (args, next) => {
      const value = next(args);
      if (supportedLocales.includes(TranslationLanguage.toLowerCase()) && !(TranslationLanguage.toLowerCase() in translations)) {
        fetchTranslationsForLocale(TranslationLanguage.toLowerCase());
      }
      return value;
    });
    await fetchTranslationsForLocale(defaultLocale);
    if (preferredLocale !== defaultLocale && supportedLocales.includes(preferredLocale)) {
      await fetchTranslationsForLocale(preferredLocale);
    }
  }
  async function fetchTranslationsForLocale(locale) {
    const response = await fetch(MOD_DATA.localization.translationsFolderPath + "/" + locale + ".json?=" + Date.now());
    if (!response.ok) return logger.error(`Failed to fetch ${locale} translations at ${response.url}` + locale);
    const data = await response.json();
    logger.log(`Fetched translations for locale: ${locale}`, data);
    translations[locale] = data;
  }

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/package.json
  var version = "2.2.1";

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/index.js
  var MOD_DATA;
  function bootstrap(modData) {
    MOD_DATA = modData;
    createModSdk();
    if (!window.ZOIS_CORE) registerCore();
    createEventBus();
    loadLocalization();
    hookFunction("GameKeyDown", HookPriority.ADD_BEHAVIOR, (args, next) => {
      const currentSubscreen2 = getCurrentSubscreen();
      if (CommonKey.IsPressed(args[0], "Escape") && !!currentSubscreen2) {
        currentSubscreen2.exit();
        return false;
      }
      const zcDialog = document.querySelector(".zcDialog");
      if (zcDialog instanceof HTMLDivElement) {
        zcDialog.focus();
        return false;
      }
      return next(args);
    });
    eventBus?.on("setSubscreen", async (data) => {
      const target = data.target;
      const isTrusted = data.isTrusted;
      if (target === void 0) return;
      if (target.startsWith(MOD_DATA.key + ":")) {
        const currentSubscreen2 = getCurrentSubscreen();
        const mod = target.substring(0, MOD_DATA.key.length);
        const subscreen = target.substring(MOD_DATA.key.length + 1);
        if (currentSubscreen2?.constructor?.name === subscreen) return;
        const s = MOD_DATA.subscreens?.[subscreen];
        if (s === void 0) return;
        if (isTrusted || await dialogsManager.confirm({ message: `Confirm the redirecting to modded subscreen ${target}` })) {
          await PreferenceOpenSubscreen("Extensions");
          await PreferenceSubscreenExtensionsOpen(mod, ["Online", "ChatRoom"]);
          setSubscreen(new s());
        }
      }
    });
    ServerIsLoggedInAsync().then(() => {
      if (modData.onReady) setTimeout(modData.onReady, getRandomNumber(3e3, 6e3));
    });
  }
  function formatString(text) {
    if (!text || typeof text !== "string") {
      return { isBeatifulString: false };
    }
    let result = text;
    let hasChanges = false;
    const markdownRegex = /\[([^\]]+?)\]\(([^)]+?)\)/g;
    const newResult = result.replace(markdownRegex, (match, linkText, url) => {
      hasChanges = true;
      const escapedText = linkText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${escapedText}</a>`;
    });
    if (newResult !== result) {
      result = newResult;
    }
    const zcRegex = /(?<!\S)zc:\/\/open[^\s<>"']*(?!\S)/gi;
    result = result.replace(zcRegex, (match) => {
      hasChanges = true;
      return `<a href="${match}" target="_blank" rel="noopener noreferrer">${match}</a>`;
    });
    if (hasChanges) {
      return {
        html: result,
        isBeatifulString: true
      };
    }
    return { isBeatifulString: false };
  }
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async function waitFor(func, cancelFunc = () => false) {
    while (!func()) {
      if (cancelFunc()) {
        return false;
      }
      await sleep(10);
    }
    return true;
  }
  function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // package.json
  var version2 = "1.0.0";

  // src/constants.ts
  var MOD_NAME = "Quality of Club";
  var MOD_FULL_NAME = "Quality of Club (QoC)";
  var MOD_KEY = "QoC";
  var MOD_VERSION = "1.0.0";
  var MOD_REPOSITORY = "https://github.com/GeneralKakyoin/QualityOfClub";
  var STORAGE_KEY = "QOC_SETTINGS";
  var CANVAS_WIDTH = 2e3;
  var CANVAS_HEIGHT = 1e3;
  var DEFAULT_SPLIT_PERCENT = 50;
  var MIN_SPLIT_PERCENT = 50;
  var MAX_SPLIT_PERCENT = 80;

  // src/modules/storage.ts
  var DEFAULT_SETTINGS = {
    version: version2,
    chatResizer: {
      enabled: true,
      splitPercent: DEFAULT_SPLIT_PERCENT,
      showDivider: true
    }
  };
  var modStorage = structuredClone(DEFAULT_SETTINGS);
  function loadStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        modStorage = {
          ...DEFAULT_SETTINGS,
          ...parsed,
          chatResizer: {
            ...DEFAULT_SETTINGS.chatResizer,
            ...parsed.chatResizer || {}
          }
        };
        return;
      }
    } catch (e) {
      console.warn("[QoC] Failed to load settings from localStorage, using defaults", e);
    }
    modStorage = structuredClone(DEFAULT_SETTINGS);
  }
  function saveStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(modStorage));
    } catch (e) {
      console.error("[QoC] Failed to save settings to localStorage", e);
    }
  }

  // src/modules/chatResizer.ts
  var dividerElement = null;
  var isDragging = false;
  function getGraphicWidth() {
    if (!modStorage.chatResizer.enabled) return 1e3;
    const pct = Math.max(MIN_SPLIT_PERCENT, Math.min(MAX_SPLIT_PERCENT, modStorage.chatResizer.splitPercent));
    return Math.round(pct / 100 * CANVAS_WIDTH);
  }
  function setSplitPercent(percent) {
    const clamped = Math.max(MIN_SPLIT_PERCENT, Math.min(MAX_SPLIT_PERCENT, Math.round(percent)));
    modStorage.chatResizer.splitPercent = clamped;
    saveStorage();
    applyChatDimensions();
  }
  function applyChatDimensions() {
    const graphicWidth = getGraphicWidth();
    if (typeof ChatRoomDivRect !== "undefined" && Array.isArray(ChatRoomDivRect)) {
      ChatRoomDivRect[0] = graphicWidth + 5;
      ChatRoomDivRect[1] = 2;
      ChatRoomDivRect[2] = CANVAS_WIDTH - graphicWidth - 12;
      ChatRoomDivRect[3] = 998;
    }
    if (typeof CurrentScreen !== "undefined" && CurrentScreen === "ChatRoom") {
      if (typeof ChatRoomResize === "function") {
        try {
          ChatRoomResize(false);
        } catch (e) {
          console.warn("[QoC] Error running ChatRoomResize", e);
        }
      }
    }
    updateDividerPosition();
  }
  function updateDividerPosition() {
    if (!dividerElement) return;
    if (typeof CurrentScreen === "undefined" || CurrentScreen !== "ChatRoom" || !modStorage.chatResizer.enabled || !modStorage.chatResizer.showDivider) {
      dividerElement.style.display = "none";
      return;
    }
    const canvas = typeof MainCanvas !== "undefined" ? MainCanvas.canvas : document.getElementById("MainCanvas");
    if (!canvas) {
      dividerElement.style.display = "none";
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const graphicWidth = getGraphicWidth();
    const scaleX = rect.width / CANVAS_WIDTH;
    const dividerX = rect.left + graphicWidth * scaleX;
    dividerElement.style.display = "flex";
    dividerElement.style.left = `${dividerX - 4}px`;
    dividerElement.style.top = `${rect.top}px`;
    dividerElement.style.height = `${rect.height}px`;
  }
  function createDividerElement() {
    if (dividerElement && dividerElement.parentElement) return;
    dividerElement = document.createElement("div");
    dividerElement.id = "qoc-chat-divider";
    dividerElement.title = "Drag to resize Chat & Graphic view. Double-click to reset (50/50).";
    Object.assign(dividerElement.style, {
      position: "fixed",
      width: "10px",
      zIndex: "9999",
      cursor: "col-resize",
      display: "none",
      alignItems: "center",
      justifyContent: "center",
      userSelect: "none",
      touchAction: "none"
    });
    const innerLine = document.createElement("div");
    innerLine.id = "qoc-chat-divider-line";
    Object.assign(innerLine.style, {
      width: "3px",
      height: "100%",
      backgroundColor: "rgba(255, 255, 255, 0.25)",
      boxShadow: "0 0 3px rgba(0, 0, 0, 0.7)",
      transition: "background-color 0.15s ease, width 0.15s ease",
      borderRadius: "2px",
      pointerEvents: "none"
    });
    dividerElement.appendChild(innerLine);
    dividerElement.addEventListener("mouseenter", () => {
      if (!isDragging) {
        innerLine.style.backgroundColor = "rgba(100, 180, 255, 0.85)";
        innerLine.style.width = "4px";
      }
    });
    dividerElement.addEventListener("mouseleave", () => {
      if (!isDragging) {
        innerLine.style.backgroundColor = "rgba(255, 255, 255, 0.25)";
        innerLine.style.width = "3px";
      }
    });
    dividerElement.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      isDragging = true;
      dividerElement?.setPointerCapture(e.pointerId);
      innerLine.style.backgroundColor = "rgba(100, 220, 255, 1)";
      innerLine.style.width = "5px";
    });
    dividerElement.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      const canvas = typeof MainCanvas !== "undefined" ? MainCanvas.canvas : document.getElementById("MainCanvas");
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const canvasX = (e.clientX - rect.left) / rect.width * CANVAS_WIDTH;
      const pct = canvasX / CANVAS_WIDTH * 100;
      setSplitPercent(pct);
    });
    const endDrag = (e) => {
      if (!isDragging) return;
      isDragging = false;
      try {
        dividerElement?.releasePointerCapture(e.pointerId);
      } catch (_) {
      }
      innerLine.style.backgroundColor = "rgba(255, 255, 255, 0.25)";
      innerLine.style.width = "3px";
      saveStorage();
    };
    dividerElement.addEventListener("pointerup", endDrag);
    dividerElement.addEventListener("pointercancel", endDrag);
    dividerElement.addEventListener("dblclick", (e) => {
      e.preventDefault();
      e.stopPropagation();
      setSplitPercent(DEFAULT_SPLIT_PERCENT);
    });
    document.body.appendChild(dividerElement);
  }
  function initChatResizer() {
    const styleEl = document.createElement("style");
    styleEl.id = "qoc-resizer-styles";
    styleEl.innerHTML = `
        #chat-room-top-menu {
            flex-wrap: wrap !important;
            overflow-x: hidden !important;
        }
        .chat-room-top-menu-btn {
            min-width: 2.2em !important;
            padding: 2px 4px !important;
        }
        #chat-room-buttons {
            gap: 2px !important;
            padding: 2px !important;
        }
        #InputChat {
            font-size: 0.95em;
        }
    `;
    document.head.appendChild(styleEl);
    createDividerElement();
    hookFunction("ChatRoomResize", HookPriority.ADD_BEHAVIOR, (args, next) => {
      if (modStorage.chatResizer.enabled) {
        const w = getGraphicWidth();
        if (typeof ChatRoomDivRect !== "undefined" && Array.isArray(ChatRoomDivRect)) {
          ChatRoomDivRect[0] = w + 5;
          ChatRoomDivRect[1] = 2;
          ChatRoomDivRect[2] = CANVAS_WIDTH - w - 12;
          ChatRoomDivRect[3] = 998;
        }
      }
      const result = next(args);
      updateDividerPosition();
      return result;
    });
    hookFunction("ChatRoomClick", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
      const event = args[0];
      if (Player.ArousalSettings != null && Player.ArousalSettings.OrgasmTimer != null && typeof Player.ArousalSettings.OrgasmTimer === "number" && !isNaN(Player.ArousalSettings.OrgasmTimer) && Player.ArousalSettings.OrgasmTimer > 0) {
        return next(args);
      }
      const graphicWidth = getGraphicWidth();
      if (MouseIn(0, 0, graphicWidth, CANVAS_HEIGHT)) {
        if (typeof ChatRoomActiveView !== "undefined" && ChatRoomActiveView && ChatRoomActiveView.Click) {
          return ChatRoomActiveView.Click(event);
        }
      }
    });
    hookFunction("ChatRoomCharacterViewLoopCharacters", HookPriority.OVERRIDE_BEHAVIOR, (args) => {
      const callback = args[0];
      const charCount = ChatRoomCharacterViewCharacterCount;
      const charsPerRow = ChatRoomCharacterViewCharactersPerRow;
      const viewWidth = getGraphicWidth();
      const viewHeight = ChatRoomCharacterViewHeight;
      const Space = charCount >= 2 ? viewWidth / Math.min(charCount, 5) : viewWidth / 2;
      let weight = ChatRoomCharacterViewSlideWeight;
      const frametimeAdjustment = TimerRunInterval / (1e3 / 30);
      if (ChatRoomCharacterViewInitialize || !(Player.GraphicsSettings && Player.GraphicsSettings.SmoothZoom)) {
        ChatRoomCharacterViewInitialize = false;
        weight = 0;
      }
      const zoomFrameStep = (current) => (current * weight + (charCount >= 3 ? Space / 400 : 1)) / (weight + 1);
      const slideUpperFrameStep = (current) => (current * weight + viewWidth / 2 - 0.5 * Space * Math.min(charCount, charsPerRow)) / (weight + 1);
      const slideLowerFrameStep = (current) => (current * weight + viewWidth / 2 - 0.5 * Space * Math.max(1, charCount - charsPerRow)) / (weight + 1);
      let zoom = ChatRoomCharacterViewZoom;
      let upperX = ChatRoomCharacterViewX_Upper;
      let lowerX = ChatRoomCharacterViewX_Lower;
      for (let i = 0; i < frametimeAdjustment; i++) {
        const nextZoom = zoomFrameStep(zoom);
        const nextUpperX = slideUpperFrameStep(upperX);
        const nextLowerX = slideLowerFrameStep(lowerX);
        if (weight === 0) {
          zoom = nextZoom;
          upperX = nextUpperX;
          lowerX = nextLowerX;
          break;
        }
        const frametimeRemainder = frametimeAdjustment - i;
        if (frametimeRemainder >= 1) {
          zoom = nextZoom;
          upperX = nextUpperX;
          lowerX = nextLowerX;
        } else {
          zoom += (nextZoom - zoom) * frametimeRemainder;
          upperX += (nextUpperX - upperX) * frametimeRemainder;
          lowerX += (nextLowerX - lowerX) * frametimeRemainder;
        }
      }
      ChatRoomCharacterViewZoom = zoom;
      ChatRoomCharacterViewX_Upper = upperX;
      ChatRoomCharacterViewX_Lower = lowerX;
      const Zoom = zoom;
      const X = charCount >= 3 ? (Space - viewWidth / 2 * Zoom) / 2 : 0;
      const Y = charCount <= 5 ? viewHeight * (1 - Zoom) / 2 : 0;
      for (let C = 0; C < ChatRoomCharacterDrawlist.length; C++) {
        let offsetX = 0;
        if (Player.GraphicsSettings?.CenterChatrooms) {
          offsetX = C >= charsPerRow ? lowerX : upperX;
        }
        const CharX = offsetX + (charCount === 1 ? (viewWidth - 500 * Zoom) / 2 : X + C % charsPerRow * Space);
        const CharY = charCount === 1 ? 0 : Y + Math.floor(C / charsPerRow) * CanvasDrawWidth;
        if (charCount === 1 && ChatRoomCharacterViewCharacterCountTotal <= 10 && !ChatRoomCharacterDrawlist[C].IsPlayer()) {
          continue;
        }
        if (callback(C, CharX, CharY, Space, Zoom)) break;
      }
    });
    hookFunction("ChatRoomCharacterViewDraw", HookPriority.OVERRIDE_BEHAVIOR, () => {
      const backgroundURL = DrawGetBackgroundURL(false);
      const charCount = ChatRoomCharacterViewCharacterCount;
      const charsPerRow = ChatRoomCharacterViewCharactersPerRow;
      const viewWidth = getGraphicWidth();
      const viewHeight = ChatRoomCharacterViewHeight;
      const opts = {
        inverted: Player.GraphicsSettings?.InvertRoom && Player.IsInverted(),
        blur: typeof Player.GetBlurLevel === "function" ? Player.GetBlurLevel() : 0,
        darken: typeof DrawGetDarkFactor === "function" ? DrawGetDarkFactor() : 0,
        tints: typeof Player.GetTints === "function" ? Player.GetTints() : [],
        sizeMode: ChatRoomData?.Custom?.SizeMode
      };
      let hasDrawnBackground = false;
      ChatRoomCharacterViewLoopCharacters((charIdx, charX, charY, _space, roomZoom) => {
        if (backgroundURL && charIdx % charsPerRow === 0) {
          const Y = charCount <= charsPerRow ? viewHeight * (1 - roomZoom) / 2 : 0;
          const bgRect = RectMakeRect(0, Y + charIdx * 100, viewWidth, viewHeight * roomZoom);
          DrawRoomBackground(backgroundURL, bgRect, opts);
          hasDrawnBackground = true;
        }
        DrawCharacter(ChatRoomCharacterDrawlist[charIdx], charX, charY, roomZoom);
        DrawStatus(ChatRoomCharacterDrawlist[charIdx], charX, charY, roomZoom);
        if (ChatRoomCharacterDrawlist[charIdx].MemberNumber != null) {
          ChatRoomCharacterViewDrawOverlay(ChatRoomCharacterDrawlist[charIdx], charX, charY, roomZoom);
        }
      });
      if (!hasDrawnBackground && backgroundURL) {
        const bgRect = RectMakeRect(0, 0, viewWidth, viewHeight);
        DrawRoomBackground(backgroundURL, bgRect, opts);
      }
    });
    hookFunction("ChatRoomLoad", HookPriority.ADD_BEHAVIOR, (args, next) => {
      const result = next(args);
      applyChatDimensions();
      return result;
    });
    window.addEventListener("resize", () => {
      updateDividerPosition();
    });
  }

  // src/subscreens/mainSubscreen.ts
  var MainSubscreen2 = class extends BaseSubscreen {
    sliderInput = null;
    sliderValueLabel = null;
    get name() {
      return `${MOD_NAME} (v${MOD_VERSION})`;
    }
    onLoad() {
      this.createTabs({
        x: 100,
        y: 130,
        width: 1800,
        currentTabName: "Interface",
        tabs: [
          {
            name: "Interface",
            load: () => this.loadInterfaceTab(),
            unload: () => this.unloadInterfaceTab()
          }
        ]
      });
    }
    loadInterfaceTab() {
      this.createCheckbox({
        x: 120,
        y: 220,
        width: 800,
        height: 45,
        text: "Enable Chat Window Resizer",
        isChecked: modStorage.chatResizer.enabled,
        tooltip: {
          position: "right",
          text: "Shrinks chat width to give more room for avatars and room graphics."
        },
        onChange: () => {
          modStorage.chatResizer.enabled = !modStorage.chatResizer.enabled;
          saveStorage();
          applyChatDimensions();
        }
      });
      this.createCheckbox({
        x: 120,
        y: 280,
        width: 800,
        height: 45,
        text: "Show Draggable Divider in Chatrooms",
        isChecked: modStorage.chatResizer.showDivider,
        tooltip: {
          position: "right",
          text: "Shows an interactive vertical line between the canvas and chat to drag-resize directly."
        },
        onChange: () => {
          modStorage.chatResizer.showDivider = !modStorage.chatResizer.showDivider;
          saveStorage();
          applyChatDimensions();
        }
      });
      this.createText({
        x: 120,
        y: 355,
        fontSize: 4,
        text: "Graphic View Size Proportions"
      });
      this.createSliderControl(120, 400);
      this.createText({
        x: 120,
        y: 500,
        fontSize: 3.5,
        text: "Quick Presets:"
      });
      const presets = [
        { label: "50% (Default)", val: 50 },
        { label: "60% Graphic", val: 60 },
        { label: "65% Graphic", val: 65 },
        { label: "70% Graphic", val: 70 },
        { label: "75% Graphic", val: 75 },
        { label: "80% Graphic", val: 80 }
      ];
      presets.forEach((preset, idx) => {
        const btn = this.createButton({
          x: 120 + idx % 3 * 280,
          y: 545 + Math.floor(idx / 3) * 65,
          width: 260,
          height: 52,
          text: preset.label,
          onClick: () => {
            this.updateSliderValue(preset.val);
          }
        });
        btn.style.fontWeight = "bold";
      });
      const hint = this.createText({
        x: 120,
        y: 720,
        fontSize: 3,
        text: "\u{1F4A1} Tip: In any chatroom, drag the vertical line between the canvas and chat to resize live! Double-click the line to reset to 50/50."
      });
      hint.style.color = "#777";
    }
    unloadInterfaceTab() {
      this.sliderInput = null;
      this.sliderValueLabel = null;
    }
    createSliderControl(x, y) {
      const container = document.createElement("div");
      Object.assign(container.style, {
        position: "fixed",
        left: `${getRelativeX(x)}px`,
        top: `${getRelativeY(y)}px`,
        width: `${getRelativeWidth(800)}px`,
        display: "flex",
        alignItems: "center",
        gap: "16px",
        zIndex: "10"
      });
      const slider = document.createElement("input");
      slider.type = "range";
      slider.min = `${MIN_SPLIT_PERCENT}`;
      slider.max = `${MAX_SPLIT_PERCENT}`;
      slider.value = `${modStorage.chatResizer.splitPercent}`;
      Object.assign(slider.style, {
        flex: "1",
        cursor: "pointer",
        height: "8px",
        accentColor: "#3a7bd5"
      });
      const label = document.createElement("span");
      label.textContent = `${slider.value}% Graphic / ${100 - Number(slider.value)}% Chat`;
      Object.assign(label.style, {
        minWidth: "220px",
        fontWeight: "bold",
        fontSize: "calc(2.5px * var(--size-unit, 4px))",
        color: "var(--tmd-text, black)"
      });
      slider.addEventListener("input", () => {
        const val = Number(slider.value);
        label.textContent = `${val}% Graphic / ${100 - val}% Chat`;
        setSplitPercent(val);
      });
      container.appendChild(slider);
      container.appendChild(label);
      document.body.appendChild(container);
      this.sliderInput = slider;
      this.sliderValueLabel = label;
    }
    updateSliderValue(val) {
      setSplitPercent(val);
      if (this.sliderInput) {
        this.sliderInput.value = `${val}`;
      }
      if (this.sliderValueLabel) {
        this.sliderValueLabel.textContent = `${val}% Graphic / ${100 - val}% Chat`;
      }
    }
  };

  // src/modules/settingsMenu.ts
  function loadSettingsMenu() {
    PreferenceRegisterExtensionSetting({
      Identifier: MOD_KEY,
      ButtonText: MOD_NAME,
      Image: () => {
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(createElement(SlidersVertical));
        return "data:image/svg+xml," + encodeURIComponent(svgString);
      },
      click: () => {
        getCurrentSubscreen()?.click();
      },
      run: () => {
        getCurrentSubscreen()?.run();
      },
      resize: () => {
        getCurrentSubscreen()?.resize();
      },
      exit: () => false,
      load: () => {
        setSubscreen(new MainSubscreen2());
      }
    });
  }

  // src/index.ts
  var hasInitialized = false;
  function initializeQoC() {
    if (hasInitialized) return;
    hasInitialized = true;
    try {
      loadStorage();
      loadSettingsMenu();
      initChatResizer();
      console.log(`%c[${MOD_NAME}] v${version2} loaded successfully!`, "color: #3a7bd5; font-weight: bold; font-size: 13px;");
      try {
        toastsManager.success({
          title: `${MOD_NAME} Loaded`,
          message: `v${version2} ready`,
          duration: 4e3
        });
      } catch (_) {
      }
      if (typeof CurrentScreen !== "undefined" && CurrentScreen === "ChatRoom") {
        applyChatDimensions();
      }
    } catch (err) {
      console.error(`[${MOD_NAME}] Initialization error:`, err);
    }
  }
  bootstrap({
    name: MOD_KEY,
    fullName: MOD_FULL_NAME,
    key: MOD_KEY,
    version: version2,
    repository: MOD_REPOSITORY,
    subscreens: {
      MainSubscreen: MainSubscreen2
    },
    onReady: initializeQoC
  });
  if (typeof ServerIsLoggedIn === "function" && ServerIsLoggedIn()) {
    setTimeout(initializeQoC, 500);
  }
})();
/*! Bundled license information:

reflect-metadata/Reflect.js:
  (*! *****************************************************************************
  Copyright (C) Microsoft. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** *)

lucide/dist/esm/defaultAttributes.mjs:
lucide/dist/esm/createElement.mjs:
lucide/dist/esm/icons/book-text.mjs:
lucide/dist/esm/icons/check.mjs:
lucide/dist/esm/icons/chevron-down.mjs:
lucide/dist/esm/icons/circle-alert.mjs:
lucide/dist/esm/icons/circle-check.mjs:
lucide/dist/esm/icons/circle-x.mjs:
lucide/dist/esm/icons/external-link.mjs:
lucide/dist/esm/icons/info.mjs:
lucide/dist/esm/icons/rotate-ccw.mjs:
lucide/dist/esm/icons/sliders-vertical.mjs:
lucide/dist/esm/icons/terminal.mjs:
lucide/dist/esm/icons/trash.mjs:
lucide/dist/esm/lucide.mjs:
  (**
   * @license lucide v1.58.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=bundle.js.map
