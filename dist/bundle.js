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
  function getLoadedMods() {
    return import_bondage_club_mod_sdk.default.getModsInfo();
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

  // node_modules/.pnpm/lucide@1.58.0/node_modules/lucide/dist/esm/icons/bug.mjs
  var Bug = [
    ["path", { d: "M12 20v-9" }],
    ["path", { d: "M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z" }],
    ["path", { d: "M14.12 3.88 16 2" }],
    ["path", { d: "M21 21a4 4 0 0 0-3.81-4" }],
    ["path", { d: "M21 5a4 4 0 0 1-3.55 3.97" }],
    ["path", { d: "M22 13h-4" }],
    ["path", { d: "M3 21a4 4 0 0 1 3.81-4" }],
    ["path", { d: "M3 5a4 4 0 0 0 3.55 3.97" }],
    ["path", { d: "M6 13H2" }],
    ["path", { d: "m8 2 1.88 1.88" }],
    ["path", { d: "M9 7.13V6a3 3 0 1 1 6 0v1.13" }]
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

  // node_modules/.pnpm/lucide@1.58.0/node_modules/lucide/dist/esm/icons/code-xml.mjs
  var CodeXml = [
    ["path", { d: "m18 16 4-4-4-4" }],
    ["path", { d: "m6 8-4 4 4 4" }],
    ["path", { d: "m14.5 4-5 16" }]
  ];

  // node_modules/.pnpm/lucide@1.58.0/node_modules/lucide/dist/esm/icons/external-link.mjs
  var ExternalLink = [
    ["path", { d: "M15 3h6v6" }],
    ["path", { d: "M10 14 21 3" }],
    ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }]
  ];

  // node_modules/.pnpm/lucide@1.58.0/node_modules/lucide/dist/esm/icons/git-pull-request.mjs
  var GitPullRequest = [
    ["circle", { cx: "18", cy: "18", r: "3" }],
    ["circle", { cx: "6", cy: "6", r: "3" }],
    ["path", { d: "M13 6h3a2 2 0 0 1 2 2v7" }],
    ["line", { x1: "6", x2: "6", y1: "9", y2: "21" }]
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

  // node_modules/.pnpm/lucide@1.58.0/node_modules/lucide/dist/esm/icons/search.mjs
  var Search = [
    ["path", { d: "m21 21-4.34-4.34" }],
    ["circle", { cx: "11", cy: "11", r: "8" }]
  ];

  // node_modules/.pnpm/lucide@1.58.0/node_modules/lucide/dist/esm/icons/shield-check.mjs
  var ShieldCheck = [
    [
      "path",
      {
        d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
      }
    ],
    ["path", { d: "m9 12 2 2 4-4" }]
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
  function getPlayer(value) {
    if (!value) return null;
    return ChatRoomCharacter.find((Character2) => {
      return Character2.MemberNumber == value || Character2.Name.toLowerCase() === value || Character2.Nickname?.toLowerCase() === value;
    }) ?? null;
  }

  // package.json
  var version2 = "1.0.17";

  // src/constants.ts
  var MOD_NAME = "Quality of Club";
  var MOD_FULL_NAME = "Quality of Club (QoC)";
  var MOD_KEY = "QoC";
  var MOD_REPOSITORY = "https://github.com/GeneralKakyoin/QualityOfClub";
  var STORAGE_KEY = "QOC_SETTINGS";
  var CANVAS_WIDTH = 2e3;
  var CANVAS_HEIGHT = 1e3;
  var DEFAULT_SPLIT_PERCENT = 50;
  var MIN_SPLIT_PERCENT = 50;
  var MAX_SPLIT_PERCENT = 80;
  var PROFILE_BUTTON_POSITION = [1700, 790, 90, 90];
  var EXTENSION_SETTINGS_KEY = "QOC";

  // src/modules/storage.ts
  var ACCESS_LEVEL_NAMES = {
    [0 /* self */]: "Self",
    [1 /* clubowner */]: "Clubowner",
    [2 /* owner */]: "Owner",
    [3 /* lover */]: "Lover",
    [4 /* mistress */]: "Mistress",
    [5 /* whitelist */]: "Whitelist",
    [6 /* friend */]: "Friend",
    [7 /* public */]: "Public"
  };
  var DEFAULT_PERMISSIONS = {
    authority_edit_roles: { self: true, min: 2 /* owner */ },
    authority_edit_min_role: { self: true, min: 2 /* owner */ },
    authority_edit_self_access: { self: true, min: 2 /* owner */ },
    inspect_view_addons: { self: true, min: 7 /* public */ },
    inspect_view_rules: { self: true, min: 5 /* whitelist */ },
    rules_lock_mandatory: { self: true, min: 2 /* owner */ },
    rules_lock_forbidden: { self: true, min: 2 /* owner */ },
    rules_remove_rules: { self: true, min: 2 /* owner */ },
    rules_edit_autoload_mode: { self: true, min: 2 /* owner */ },
    rules_force_compliance: { self: true, min: 2 /* owner */ },
    rules_force_injection: { self: true, min: 2 /* owner */ },
    menu_open_settings: { self: true, min: 2 /* owner */ }
  };
  var DEFAULT_SETTINGS = {
    version: version2,
    chatResizer: {
      enabled: false,
      splitPercent: DEFAULT_SPLIT_PERCENT,
      showDivider: true
    },
    authority: {
      owners: [],
      mistresses: [],
      permissions: structuredClone(DEFAULT_PERMISSIONS)
    },
    inspector: {
      enabled: true,
      autoLoadMode: "Prompt",
      violationAction: "toast",
      evaluationInterval: 30,
      silentTelemetry: true,
      showProfileButton: true,
      allowForcedInjection: false,
      customCatalog: [],
      rules: []
    },
    managedRules: {}
  };
  var modStorage = structuredClone(DEFAULT_SETTINGS);
  function loadStorage() {
    let loadedData = null;
    try {
      if (typeof Player !== "undefined" && Player.ExtensionSettings && Player.ExtensionSettings[EXTENSION_SETTINGS_KEY]) {
        const rawCompressed = Player.ExtensionSettings[EXTENSION_SETTINGS_KEY];
        if (typeof rawCompressed === "string" && typeof LZString !== "undefined") {
          const decompressed = LZString.decompressFromBase64(rawCompressed);
          if (decompressed) {
            loadedData = JSON.parse(decompressed);
          }
        }
      }
    } catch (e) {
      console.warn("[QoC] Failed to decompress server ExtensionSettings, falling back to localStorage", e);
    }
    if (!loadedData) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          loadedData = JSON.parse(raw);
        }
      } catch (e) {
        console.warn("[QoC] Failed to load settings from localStorage", e);
      }
    }
    if (loadedData) {
      modStorage = {
        ...DEFAULT_SETTINGS,
        ...loadedData,
        chatResizer: {
          ...DEFAULT_SETTINGS.chatResizer,
          ...loadedData.chatResizer || {}
        },
        authority: {
          owners: Array.isArray(loadedData.authority?.owners) ? loadedData.authority.owners : [],
          mistresses: Array.isArray(loadedData.authority?.mistresses) ? loadedData.authority.mistresses : [],
          permissions: {
            ...DEFAULT_PERMISSIONS,
            ...loadedData.authority?.permissions || {}
          }
        },
        inspector: {
          ...DEFAULT_SETTINGS.inspector,
          ...loadedData.inspector || {},
          rules: Array.isArray(loadedData.inspector?.rules) ? loadedData.inspector.rules : [],
          customCatalog: Array.isArray(loadedData.inspector?.customCatalog) ? loadedData.inspector.customCatalog : [],
          violationAction: loadedData.inspector?.violationAction || "toast",
          autoLoadMode: loadedData.inspector?.autoLoadMode || "Prompt",
          evaluationInterval: typeof loadedData.inspector?.evaluationInterval === "number" ? loadedData.inspector.evaluationInterval : 30,
          silentTelemetry: typeof loadedData.inspector?.silentTelemetry === "boolean" ? loadedData.inspector.silentTelemetry : true,
          showProfileButton: typeof loadedData.inspector?.showProfileButton === "boolean" ? loadedData.inspector.showProfileButton : true,
          allowForcedInjection: typeof loadedData.inspector?.allowForcedInjection === "boolean" ? loadedData.inspector.allowForcedInjection : false
        },
        managedRules: loadedData.managedRules || {}
      };
    } else {
      modStorage = structuredClone(DEFAULT_SETTINGS);
    }
  }
  function saveStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(modStorage));
    } catch (e) {
      console.error("[QoC] Failed to save settings to localStorage", e);
    }
    try {
      if (typeof Player !== "undefined" && Player.ExtensionSettings && typeof LZString !== "undefined") {
        Player.ExtensionSettings[EXTENSION_SETTINGS_KEY] = LZString.compressToBase64(JSON.stringify(modStorage));
        if (typeof ServerPlayerExtensionSettingsSync === "function") {
          ServerPlayerExtensionSettingsSync(EXTENSION_SETTINGS_KEY);
        }
      }
    } catch (e) {
      console.warn("[QoC] Failed to sync settings to BC ServerPlayerExtensionSettingsSync", e);
    }
  }
  function syncStorage() {
    saveStorage();
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
      const charCount = typeof ChatRoomCharacterDrawlist !== "undefined" ? ChatRoomCharacterDrawlist.length : 0;
      if (charCount === 0) return;
      const viewWidth = getGraphicWidth();
      const viewHeight = typeof ChatRoomCharacterViewHeight !== "undefined" ? ChatRoomCharacterViewHeight : 1e3;
      let targetZoom;
      let Space;
      let startX;
      if (charCount === 1) {
        targetZoom = 1;
        Space = viewWidth / 2;
        startX = (viewWidth - 500 * targetZoom) / 2;
      } else {
        Space = viewWidth / charCount;
        targetZoom = Math.min(1, Math.max(0.35, Space / 380));
        const totalVisualWidth = (charCount - 1) * Space + 500 * targetZoom;
        if (totalVisualWidth > viewWidth) {
          Space = (viewWidth - 500 * targetZoom) / (charCount - 1);
          startX = 0;
        } else {
          startX = (viewWidth - totalVisualWidth) / 2;
        }
      }
      let weight = typeof ChatRoomCharacterViewSlideWeight !== "undefined" ? ChatRoomCharacterViewSlideWeight : 9;
      const frametimeAdjustment = typeof TimerRunInterval !== "undefined" ? TimerRunInterval / (1e3 / 30) : 1;
      if (ChatRoomCharacterViewInitialize || !(Player.GraphicsSettings && Player.GraphicsSettings.SmoothZoom)) {
        ChatRoomCharacterViewInitialize = false;
        weight = 0;
      }
      const zoomFrameStep = (current) => (current * weight + targetZoom) / (weight + 1);
      let zoom = typeof ChatRoomCharacterViewZoom !== "undefined" ? ChatRoomCharacterViewZoom : targetZoom;
      for (let i = 0; i < frametimeAdjustment; i++) {
        const nextZoom = zoomFrameStep(zoom);
        if (weight === 0) {
          zoom = nextZoom;
          break;
        }
        const remainder = frametimeAdjustment - i;
        if (remainder >= 1) {
          zoom = nextZoom;
        } else {
          zoom += (nextZoom - zoom) * remainder;
        }
      }
      ChatRoomCharacterViewZoom = zoom;
      const Y = Math.max(0, viewHeight * (1 - zoom) / 2);
      for (let C = 0; C < charCount; C++) {
        const CharX = startX + C * Space;
        const CharY = Y;
        if (callback(C, CharX, CharY, Space, zoom)) break;
      }
    });
    hookFunction("ChatRoomCharacterViewDraw", HookPriority.OVERRIDE_BEHAVIOR, () => {
      const backgroundURL = DrawGetBackgroundURL(false);
      const viewWidth = getGraphicWidth();
      const viewHeight = typeof ChatRoomCharacterViewHeight !== "undefined" ? ChatRoomCharacterViewHeight : 1e3;
      const opts = {
        inverted: Player.GraphicsSettings?.InvertRoom && Player.IsInverted(),
        blur: typeof Player.GetBlurLevel === "function" ? Player.GetBlurLevel() : 0,
        darken: typeof DrawGetDarkFactor === "function" ? DrawGetDarkFactor() : 0,
        tints: typeof Player.GetTints === "function" ? Player.GetTints() : [],
        sizeMode: ChatRoomData?.Custom?.SizeMode
      };
      if (backgroundURL) {
        const bgRect = RectMakeRect(0, 0, viewWidth, viewHeight);
        DrawRoomBackground(backgroundURL, bgRect, opts);
      }
      ChatRoomCharacterViewLoopCharacters((charIdx, charX, charY, _space, roomZoom) => {
        if (ChatRoomCharacterDrawlist && ChatRoomCharacterDrawlist[charIdx]) {
          DrawCharacter(ChatRoomCharacterDrawlist[charIdx], charX, charY, roomZoom);
          DrawStatus(ChatRoomCharacterDrawlist[charIdx], charX, charY, roomZoom);
          if (ChatRoomCharacterDrawlist[charIdx].MemberNumber != null) {
            ChatRoomCharacterViewDrawOverlay(ChatRoomCharacterDrawlist[charIdx], charX, charY, roomZoom);
          }
        }
      });
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

  // src/subscreens/chatResizerSubscreen.ts
  var ChatResizerSubscreen = class extends BaseSubscreen {
    rootElement = null;
    sliderInput = null;
    sliderValueLabel = null;
    get name() {
      return "";
    }
    onRun() {
      DrawRect(0, 0, 2e3, 1e3, "#191f2b");
    }
    onLoad() {
      this.createUI();
    }
    exit() {
      this.cleanup();
      setSubscreen(new MainSubscreen2());
    }
    onUnload() {
      this.cleanup();
    }
    onExit() {
      this.cleanup();
    }
    cleanup() {
      if (this.rootElement) {
        this.rootElement.remove();
        this.rootElement = null;
      }
      this.sliderInput = null;
      this.sliderValueLabel = null;
    }
    createUI() {
      this.cleanup();
      const backdrop = document.createElement("div");
      backdrop.style.cssText = `
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            background: #191f2b;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 100;
            color: #e0e6ed;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            box-sizing: border-box;
            user-select: none;
        `;
      const container = document.createElement("div");
      container.style.cssText = `
            width: min(92vw, 1200px);
            height: min(90vh, 850px);
            display: flex;
            flex-direction: column;
            gap: 16px;
            box-sizing: border-box;
        `;
      const header = document.createElement("div");
      header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(80, 100, 140, 0.35);
        `;
      const titleBox = document.createElement("div");
      titleBox.innerHTML = `
            <div style="font-size: 24px; font-weight: bold; color: #64b5f6; letter-spacing: 0.5px;">
                \u{1F4D0} Chat Window Resizer Settings
            </div>
            <div style="font-size: 13px; color: #90a4ae; margin-top: 4px;">
                Adjust the balance between character graphics and the chatroom message log.
            </div>
        `;
      const backBtn = document.createElement("button");
      backBtn.textContent = "\u2715 Back to Menu";
      backBtn.style.cssText = `
            padding: 10px 24px;
            background: rgba(220, 50, 50, 0.85);
            border: 1px solid #ef5350;
            color: white;
            font-size: 15px;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.15s ease;
        `;
      backBtn.addEventListener("mouseover", () => {
        backBtn.style.background = "#d32f2f";
      });
      backBtn.addEventListener("mouseout", () => {
        backBtn.style.background = "rgba(220, 50, 50, 0.85)";
      });
      backBtn.addEventListener("click", () => this.exit());
      header.appendChild(titleBox);
      header.appendChild(backBtn);
      container.appendChild(header);
      const body = document.createElement("div");
      body.style.cssText = `
            flex: 1;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding-right: 6px;
            box-sizing: border-box;
        `;
      const togglesCard = this.createCardElement("\u2699\uFE0F Feature Toggles");
      const toggles = [
        {
          title: "Enable Chat Window Resizer",
          desc: "Activates custom chat dimensions. When off, Bondage Club uses default 50/50 sizing.",
          checked: modStorage.chatResizer.enabled,
          toggle: () => {
            modStorage.chatResizer.enabled = !modStorage.chatResizer.enabled;
            saveStorage();
            applyChatDimensions();
            this.createUI();
          }
        },
        {
          title: "Show Draggable Divider in Chatrooms",
          desc: "Draws an interactive vertical separator bar in chatrooms allowing live drag-and-drop resizing.",
          checked: modStorage.chatResizer.showDivider,
          toggle: () => {
            modStorage.chatResizer.showDivider = !modStorage.chatResizer.showDivider;
            saveStorage();
            applyChatDimensions();
            this.createUI();
          }
        }
      ];
      toggles.forEach((t) => {
        togglesCard.appendChild(this.createToggleRow(t.title, t.desc, t.checked, t.toggle));
      });
      body.appendChild(togglesCard);
      const sliderCard = this.createCardElement("\u{1F4CF} Screen Size Proportion", "Drag the slider to adjust how much screen space is allocated to graphics vs chat:");
      const currentPercent = modStorage.chatResizer.splitPercent || DEFAULT_SPLIT_PERCENT;
      const sliderContainer = document.createElement("div");
      sliderContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 20px;
            margin-top: 14px;
            padding: 8px 0;
        `;
      const slider = document.createElement("input");
      slider.type = "range";
      slider.min = `${MIN_SPLIT_PERCENT}`;
      slider.max = `${MAX_SPLIT_PERCENT}`;
      slider.value = `${currentPercent}`;
      slider.style.cssText = `
            flex: 1;
            height: 10px;
            cursor: pointer;
            accent-color: #2196f3;
            border-radius: 5px;
        `;
      const label = document.createElement("div");
      label.style.cssText = `
            min-width: 240px;
            font-size: 16px;
            font-weight: bold;
            color: #64b5f6;
            text-align: right;
            padding-right: 8px;
        `;
      label.textContent = `${currentPercent}% Graphic / ${100 - currentPercent}% Chat`;
      slider.addEventListener("input", () => {
        const val = Number(slider.value);
        label.textContent = `${val}% Graphic / ${100 - val}% Chat`;
        setSplitPercent(val);
        this.highlightActivePreset(val);
      });
      this.sliderInput = slider;
      this.sliderValueLabel = label;
      sliderContainer.appendChild(slider);
      sliderContainer.appendChild(label);
      sliderCard.appendChild(sliderContainer);
      body.appendChild(sliderCard);
      const presetsCard = this.createCardElement("\u26A1 Quick Presets", "Click a preset to instantly apply proportions:");
      const presetsGrid = document.createElement("div");
      presetsGrid.id = "qoc-presets-grid";
      presetsGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-top: 10px;
        `;
      const presets = [
        { label: "50% (Default)", val: 50 },
        { label: "60% Graphic / 40% Chat", val: 60 },
        { label: "65% Graphic / 35% Chat", val: 65 },
        { label: "70% Graphic / 30% Chat", val: 70 },
        { label: "75% Graphic / 25% Chat", val: 75 },
        { label: "80% Graphic / 20% Chat", val: 80 }
      ];
      presets.forEach((p) => {
        const isMatch = currentPercent === p.val;
        const btn = document.createElement("button");
        btn.dataset.val = `${p.val}`;
        btn.style.cssText = `
                padding: 14px 18px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                background: ${isMatch ? "rgba(25, 118, 210, 0.4)" : "rgba(35, 45, 60, 0.6)"};
                border: 1px solid ${isMatch ? "#42a5f5" : "rgba(80, 100, 140, 0.35)"};
                color: ${isMatch ? "#64b5f6" : "#e0e6ed"};
                transition: all 0.15s ease;
            `;
        btn.textContent = p.label;
        btn.addEventListener("click", () => {
          this.updateSliderValue(p.val);
        });
        presetsGrid.appendChild(btn);
      });
      presetsCard.appendChild(presetsGrid);
      body.appendChild(presetsCard);
      const tip = document.createElement("div");
      tip.style.cssText = `
            font-size: 12px;
            color: #8fa0b5;
            text-align: center;
            padding: 8px 0;
        `;
      tip.innerHTML = `\u{1F4A1} <b>Tip:</b> When enabled, drag the vertical line between the canvas and chat to resize live! <b>Double-click</b> the line to reset to 50/50.`;
      body.appendChild(tip);
      container.appendChild(body);
      backdrop.appendChild(container);
      document.body.appendChild(backdrop);
      this.rootElement = backdrop;
    }
    updateSliderValue(val) {
      setSplitPercent(val);
      if (this.sliderInput) {
        this.sliderInput.value = `${val}`;
      }
      if (this.sliderValueLabel) {
        this.sliderValueLabel.textContent = `${val}% Graphic / ${100 - val}% Chat`;
      }
      this.highlightActivePreset(val);
    }
    highlightActivePreset(val) {
      const grid = document.getElementById("qoc-presets-grid");
      if (!grid) return;
      const buttons = grid.querySelectorAll("button");
      buttons.forEach((btn) => {
        const btnVal = Number(btn.dataset.val);
        const isMatch = btnVal === val;
        btn.style.background = isMatch ? "rgba(25, 118, 210, 0.4)" : "rgba(35, 45, 60, 0.6)";
        btn.style.borderColor = isMatch ? "#42a5f5" : "rgba(80, 100, 140, 0.35)";
        btn.style.color = isMatch ? "#64b5f6" : "#e0e6ed";
      });
    }
    createCardElement(title, subtitle) {
      const card = document.createElement("div");
      card.style.cssText = `
            background: rgba(30, 36, 48, 0.85);
            border: 1px solid rgba(80, 100, 140, 0.35);
            border-radius: 8px;
            padding: 16px 20px;
            box-sizing: border-box;
        `;
      let headerHtml = `<div style="font-size: 16px; font-weight: bold; color: #64b5f6;">${title}</div>`;
      if (subtitle) {
        headerHtml += `<div style="font-size: 12px; color: #90a4ae; margin-top: 3px;">${subtitle}</div>`;
      }
      card.innerHTML = headerHtml;
      return card;
    }
    createToggleRow(title, desc, isChecked, onToggle) {
      const row = document.createElement("div");
      row.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid rgba(80, 100, 140, 0.2);
            cursor: pointer;
        `;
      row.addEventListener("click", onToggle);
      const textBox = document.createElement("div");
      textBox.style.cssText = "padding-right: 16px;";
      textBox.innerHTML = `
            <div style="font-size: 15px; font-weight: 600; color: #e0e6ed;">${title}</div>
            <div style="font-size: 12px; color: #90a4ae; margin-top: 3px;">${desc}</div>
        `;
      const switchEl = document.createElement("div");
      switchEl.style.cssText = `
            width: 48px;
            height: 26px;
            background: ${isChecked ? "#1976d2" : "rgba(60, 70, 90, 0.7)"};
            border-radius: 13px;
            position: relative;
            flex-shrink: 0;
            transition: background 0.2s ease;
            border: 1px solid ${isChecked ? "#42a5f5" : "rgba(80, 100, 140, 0.4)"};
        `;
      const knob = document.createElement("div");
      knob.style.cssText = `
            width: 20px;
            height: 20px;
            background: white;
            border-radius: 50%;
            position: absolute;
            top: 2px;
            left: ${isChecked ? "24px" : "3px"};
            transition: left 0.2s ease;
            box-shadow: 0 1px 3px rgba(0,0,0,0.4);
        `;
      switchEl.appendChild(knob);
      row.appendChild(textBox);
      row.appendChild(switchEl);
      return row;
    }
  };

  // src/modules/fusamManifest.ts
  var FUSAM_MANIFEST_URL = "https://sidiousious.gitlab.io/bc-addon-loader/manifest.json";
  var CACHE_STORAGE_KEY = "qoc.fusam_manifest_cache";
  function parseFusamAddonToCurated(addon) {
    if (!addon || !addon.id) return null;
    let primaryName = "";
    const detectKeySet = /* @__PURE__ */ new Set();
    detectKeySet.add(addon.id.toLowerCase().trim());
    if (typeof addon.name === "string") {
      primaryName = addon.name.trim();
      detectKeySet.add(primaryName.toLowerCase());
      const withoutParens = primaryName.replace(/\(.*?\)/g, "").trim().toLowerCase();
      if (withoutParens) detectKeySet.add(withoutParens);
      const insideParens = primaryName.match(/\((.*?)\)/)?.[1]?.trim().toLowerCase();
      if (insideParens) detectKeySet.add(insideParens);
    } else if (addon.name && typeof addon.name === "object") {
      const nameObj = addon.name;
      primaryName = nameObj.en || nameObj.cn || Object.values(nameObj)[0] || addon.id;
      for (const [_, val] of Object.entries(nameObj)) {
        if (typeof val === "string" && val.trim()) {
          const lower = val.trim().toLowerCase();
          detectKeySet.add(lower);
          const withoutParens = val.replace(/\(.*?\)/g, "").trim().toLowerCase();
          if (withoutParens) detectKeySet.add(withoutParens);
        }
      }
    } else {
      primaryName = addon.id;
    }
    let description = "";
    if (typeof addon.description === "string") {
      description = addon.description.trim();
    } else if (addon.description && typeof addon.description === "object") {
      const descObj = addon.description;
      description = descObj.en || descObj.cn || Object.values(descObj)[0] || "";
    }
    let scriptUrl = "";
    if (Array.isArray(addon.versions) && addon.versions.length > 0) {
      const stable = addon.versions.find((v) => v.distribution === "stable");
      scriptUrl = stable && stable.source ? stable.source : addon.versions[0].source || "";
    }
    if (!scriptUrl) {
      scriptUrl = addon.source || addon.url || "";
    }
    let repositoryMatch = void 0;
    if (addon.repository && typeof addon.repository === "string") {
      const trimmed = addon.repository.trim();
      const ghMatch = trimmed.match(/(?:github\.com|gitlab\.com|gitgud\.io)\/([^\/]+\/[^\/#?]+)/i);
      if (ghMatch && ghMatch[1]) {
        repositoryMatch = ghMatch[1].replace(/\.git$/i, "").toLowerCase();
      } else {
        repositoryMatch = trimmed.toLowerCase();
      }
    }
    return {
      id: addon.id,
      name: primaryName,
      description,
      author: addon.author || "Community",
      scriptUrl,
      scriptType: addon.type === "eval" ? "eval" : addon.type === "module" ? "module" : "script",
      noCacheBusting: addon.noCacheBusting === true,
      tags: Array.isArray(addon.tags) ? addon.tags : [],
      detectKeys: Array.from(detectKeySet),
      repositoryMatch
    };
  }
  var BUNDLED_FUSAM_ADDONS = [
    {
      "id": "WCE",
      "name": "Wholesome Club Extensions (WCE)",
      "description": "Smarter, extensible facial animation and posing engine, instant messaging, appearance layering and a collection of quality of life improvements - A fork of FBC 5.8",
      "author": "Sidious & Stella",
      "repository": "https://github.com/KittenApps/WCE",
      "tags": [
        "cheats",
        "enhancements",
        "automation",
        "recommended"
      ],
      "type": "module",
      "noCacheBusting": true,
      "website": "https://wce-docs.vercel.app",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://wce.netlify.app/wce.js"
        },
        {
          "distribution": "dev",
          "source": "https://beta--wce.netlify.app/wce.js"
        }
      ]
    },
    {
      "id": "BCX",
      "icon": "https://jomshir98.github.io/bondage-club-extended/resources/BCX_large.png",
      "name": "Bondage Club Extended (BCX)",
      "description": "Adds rules, curses, and more to enhance D/s play alongside a handful of quality of life improvements",
      "author": "Jomshir98 & Claudia",
      "repository": "https://github.com/Jomshir98/bondage-club-extended",
      "tags": [
        "enhancements",
        "expansion",
        "recommended"
      ],
      "type": "script",
      "website": "https://jomshir98.github.io/bondage-club-extended/",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://jomshir98.github.io/bondage-club-extended/bcx.js"
        },
        {
          "distribution": "dev",
          "source": "https://jomshir98.github.io/bondage-club-extended/devel/bcx.js"
        }
      ]
    },
    {
      "id": "Themed",
      "icon": "https://github.com/dDeepLb/Themed-BC/raw/main/public/icons/mod.png",
      "name": "Themed",
      "description": "Adds custom themes to BC along with other features",
      "author": "dDeepLb",
      "repository": "https://github.com/dDeepLb/Themed-BC",
      "tags": [
        "enhancements"
      ],
      "type": "script",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://protokink.github.io/Themed/themed.js"
        }
      ]
    },
    {
      "id": "ADCS",
      "icon": "https://dynilath.gitlab.io/SaotomeToyStore/logo.png",
      "name": "Advanced Drone Control System (ADCS)",
      "description": "Expansion of Drone gameplay",
      "author": "SaotomeToyStore",
      "repository": "https://gitlab.com/dynilath/BCADCS",
      "tags": [
        "expansion"
      ],
      "type": "script",
      "website": "https://dynilath.gitlab.io/SaotomeToyStore/en/Plugins/ADCS",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://dynilath.gitlab.io/SaotomeToyStoreVendor/ADCS/main.js"
        }
      ]
    },
    {
      "id": "ABCL",
      "icon": "https://zoe-64.github.io/ABCL/src/assets/icon.png",
      "name": "ABCL",
      "description": "An ABDL addon that adds mechanics towards human body functions like bladder and bowels. Also makes the experience more immersive and interactive. Littlish Club compatible.",
      "author": "Zoe",
      "repository": "https://github.com/zoe-64/ABCL/",
      "discord": "https://discord.gg/Sq9akTD6kF",
      "tags": [
        "enhancements",
        "expansion"
      ],
      "type": "script",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://zoe-64.github.io/ABCL/versions/latest/abcl.js"
        },
        {
          "distribution": "beta",
          "source": "https://zoe-64.github.io/ABCL/versions/beta/abcl.js"
        },
        {
          "distribution": "dev",
          "source": "https://zoe-64.github.io/ABCL/versions/unstable/abcl.js"
        }
      ]
    },
    {
      "id": "BRBD",
      "name": "BCX Reset Button Disabler",
      "description": "A very simple addon that disables the Module and Reset Buttons from BCX. That means you can have a new layer of helplessness.",
      "author": "Ciber",
      "tags": [],
      "type": "eval",
      "repository": "https://github.com/ciberweaboo/brbd",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://raw.githubusercontent.com/ciberweaboo/brbd/main/brbd.js"
        }
      ]
    },
    {
      "id": "BCAR",
      "name": "Bondage Club Auto React (BCAR)",
      "description": "Automatically reacts to messages in the Bondage Club",
      "author": "Dr Branestawm",
      "repository": "https://github.com/drbranestawm/bcar",
      "tags": [
        "automation"
      ],
      "type": "script",
      "website": "https://github.com/DrBranestawm/BCAR/wiki",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://drbranestawm.github.io/BCAR/script/bcarBeta.js"
        },
        {
          "distribution": "beta",
          "source": "https://drbranestawm.github.io/BCAR/script/bcarBeta.js"
        }
      ]
    },
    {
      "id": "BC-XToys",
      "name": "Bondage Club X-Toys Integration",
      "description": "Sync club interactions and toys with IRL remote-controlled toys, recommended use with https://github.com/itsFro/BCBridge",
      "author": "ItsNorin",
      "repository": "https://github.com/ItsNorin/Bondage-Club-XToys-Integration",
      "tags": [
        "automation",
        "expansion"
      ],
      "type": "script",
      "website": "https://github.com/ItsNorin/Bondage-Club-XToys-Integration#readme",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://itsnorin.github.io/Bondage-Club-XToys-Integration/BC-XToys.user.js"
        }
      ]
    },
    {
      "id": "BCT",
      "name": "BCTweaks",
      "description": "Split arousal and orgasm bars, tail wagging, and Best Friends",
      "author": "Crimsonfox & agicitag",
      "repository": "https://github.com/agicitag/BCTweaks",
      "tags": [
        "enhancements",
        "automation"
      ],
      "type": "script",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://agicitag.github.io/BCTweaks/extension/bct.js"
        },
        {
          "distribution": "beta",
          "source": "https://agicitag.github.io/BCTweaks/beta/extension/bct.js"
        }
      ]
    },
    {
      "id": "ciamod",
      "icon": "https://gitgud.io/cia/cia-bc/-/raw/master/CIA_logo.png?raw=true",
      "name": "CIA (Community Information Addon)",
      "description": "This set of scripts adds several chat commands to BC. The commands work in conjunction with a central database of players managed by members of the community of the Slave Helpline room and the BCCA",
      "author": "JD & Ramona",
      "repository": "https://gitgud.io/cia/cia-bc",
      "tags": [
        "enhancements",
        "expansion"
      ],
      "type": "script",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://bondage-dreams.com/cia.js"
        },
        {
          "distribution": "dev",
          "source": "https://bondage-dreams.com/ciadev.js"
        }
      ]
    },
    {
      "id": "EBCH",
      "name": "Eli's Bondage Club Helper (EBCH)",
      "description": "Ungarble, custom notifications, altering other player's poses",
      "author": "Elicia",
      "repository": "https://gitlab.com/zorgjbe/ebch",
      "website": "https://zorgjbe.gitlab.io/ebch/",
      "tags": [
        "enhancements",
        "automation"
      ],
      "type": "eval",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://zorgjbe.gitlab.io/ebch/master/EBCH.js"
        }
      ]
    },
    {
      "id": "LSCG",
      "name": "Little Sera's Club Games (LSCG)",
      "icon": "https://github.com/littlesera/LSCG/blob/main/icon.png?raw=true",
      "description": "Adds custom activities, large gamified systems for hypnotism, breathplay, magic, and much more",
      "author": "Little Sera",
      "repository": "https://github.com/littlesera/LSCG",
      "tags": [
        "expansion",
        "enhancements"
      ],
      "type": "script",
      "website": "https://github.com/littlesera/LSCG/wiki",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://littlesera.github.io/LSCG/bundle.js"
        },
        {
          "distribution": "beta",
          "source": "https://littlesera.github.io/LSCG/dev/bundle.js"
        }
      ]
    },
    {
      "id": "MBCHC",
      "name": "Mute's Bondage Club Hacks Collection (MBCHC)",
      "description": "Autohack, local time, some keyboard goodies etc.",
      "author": "Mute",
      "repository": "https://code.fleshless.org/mute/MBCHC/",
      "tags": [
        "enhancements",
        "automation"
      ],
      "type": "module",
      "versions": [
        {
          "distribution": "dev",
          "source": "https://code.fleshless.org/mute/MBCHC/raw/branch/master/mbchc.mjs"
        }
      ]
    },
    {
      "id": "MBS",
      "name": "Maid's Bondage Scripts (MBS)",
      "description": "Additional crafting slots, additional options in wheel of fortune, and custom outfits in wheel of fortune",
      "author": "Rama",
      "repository": "https://github.com/bananarama92/MBS",
      "tags": [
        "enhancements"
      ],
      "type": "script",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://bananarama92.github.io/MBS/main/mbs.js"
        }
      ]
    },
    {
      "id": "Responsive",
      "icon": "https://user-images.githubusercontent.com/71733861/254577970-83fb14ab-79af-46b4-9490-ea8c85dc4097.png",
      "name": "Responsive",
      "description": "Automatically sends messages when the user reaches a certain state (slapped, orgasm, etc).",
      "author": "SaotomeToyStore, dDeepLb",
      "repository": "https://github.com/ProtoKink/Responsive",
      "tags": [
        "expansion"
      ],
      "type": "script",
      "website": "https://github.com/ProtoKink/Responsive/wiki",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://protokink.github.io/Responsive/main.js"
        }
      ]
    },
    {
      "id": "ULTRAbc",
      "name": "ULTRAbc",
      "description": "A large collection of cheats, quality of life improvements, and a moaner script",
      "author": "Nemesea",
      "repository": "https://github.com/tetris245/ULTRAbc",
      "tags": [
        "cheats",
        "enhancements",
        "automation",
        "browser-only"
      ],
      "type": "script",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://tetris245.github.io/ultrabc.github.io/ULTRAbc.js"
        }
      ]
    },
    {
      "id": "NotifyPlus",
      "icon": "https://dynilath.gitlab.io/SaotomeToyStore/logo.png",
      "name": "NotifyPlus",
      "description": "Improve the Name Mentioned notification in the original BC. Use keywords for mentioning names according to different roles.",
      "author": "SaotomeToyStore",
      "repository": "https://github.com/dynilath/BCNotifyPlus",
      "tags": [
        "expansion"
      ],
      "type": "script",
      "website": "https://dynilath.gitlab.io/SaotomeToyStore/en/Plugins/NotifyPlus",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://dynilath.gitlab.io/SaotomeToyStoreVendor/NotifyPlus/main.js"
        }
      ]
    },
    {
      "id": "TTS",
      "icon": "https://gitlab.com/KatKammand/tts/-/raw/main/src/resources/ttslogo.png",
      "name": "TTS and Morse",
      "description": "Text-to-speech reading for chat messages, and some buttplug.io + morse functionalities.",
      "author": "KatKammand",
      "tags": [
        "expansion"
      ],
      "type": "module",
      "repository": "https://gitlab.com/KatKammand/tts",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://katkammand.gitlab.io/tts/ttsFUSAM.min.js"
        },
        {
          "distribution": "dev",
          "source": "https://katkammand.gitlab.io/tts/ttsFUSAM-dev.min.js"
        }
      ]
    },
    {
      "id": "CATS",
      "name": "CATS (Chat Auto Translator Script)",
      "description": "Addon that auto-translates the chat to the language you want. 130+ Languages available. Commands: /ttoggle to toggle the translator on and off. And /tlang <lang_code>, to change the language used.",
      "author": "Ciber, dDeepLb and KatKammand",
      "repository": "https://github.com/ProtoKink/CATS",
      "tags": [
        "enhancements",
        "expansion"
      ],
      "type": "script",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://protokink.github.io/CATS/index.js"
        }
      ]
    },
    {
      "id": "DOGS",
      "icon": "https://github.com/FurryZoi/Devious-Obligate-Great-Stuff/raw/main/src/images/slavery.png",
      "name": "DOGS (Devious Obligate Great Stuff)",
      "description": "Adds devious stuff, which will increase your helplessness.... or dominance",
      "author": "Zoi",
      "repository": "https://github.com/FurryZoi/Devious-Obligate-Great-Stuff",
      "tags": [
        "enhancements",
        "expansion"
      ],
      "type": "script",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://furryzoi.github.io/Devious-Obligate-Great-Stuff/bundle.js"
        }
      ]
    },
    {
      "id": "MBCFS",
      "icon": "https://gitgud.io/maples-bc-plugins/fetish-share/-/raw/main/src/assets/icon.png",
      "name": {
        "en": "BC Fetish Share",
        "de": "BC Fetisch-Austausch",
        "fr": "BC Partage de f\xE9tiches",
        "ru": "\u0411\u043E\u043D\u0434\u0430\u0436 \u041A\u043B\u0443\u0431: \u043E\u0431\u043C\u0435\u043D \u0444\u0435\u0442\u0438\u0448\u0430\u043C\u0438",
        "ua": "\u0411\u043E\u043D\u0434\u0430\u0436 \u041A\u043B\u0443\u0431: \u043E\u0431\u043C\u0456\u043D \u0444\u0435\u0442\u0438\u0448\u0430\u043C\u0438",
        "cn": "\u675F\u7F1A\u4FF1\u4E50\u90E8\u7231\u597D\u5206\u4EAB",
        "tw": "\u675F\u7E1B\u4FF1\u6A02\u90E8\u611B\u597D\u5206\u4EAB"
      },
      "description": {
        "en": "Shows how well your fetishes and activities match other players, with match badges in chat rooms and a list of the people you've met.",
        "de": "Zeigt, wie gut deine Fetische und Aktivit\xE4ten zu denen anderer passen, mit Abzeichen f\xFCr \xDCbereinstimmungen in Chatr\xE4umen und einer Liste der Leute, die du getroffen hast.",
        "fr": "Montre \xE0 quel point tes f\xE9tiches et activit\xE9s correspondent \xE0 ceux des autres, avec des badges d'affinit\xE9 dans les salons de discussion et une liste des personnes que tu as crois\xE9es.",
        "ru": "\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442, \u043D\u0430\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0442\u0432\u043E\u0438 \u0444\u0435\u0442\u0438\u0448\u0438 \u0438 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u044E\u0442 \u0441 \u0447\u0443\u0436\u0438\u043C\u0438, \u0441\u043E \u0437\u043D\u0430\u0447\u043A\u0430\u043C\u0438 \u0441\u043E\u0432\u043C\u0435\u0441\u0442\u0438\u043C\u043E\u0441\u0442\u0438 \u0432 \u0447\u0430\u0442-\u043A\u043E\u043C\u043D\u0430\u0442\u0430\u0445 \u0438 \u0441\u043F\u0438\u0441\u043A\u043E\u043C \u043B\u044E\u0434\u0435\u0439, \u043A\u043E\u0442\u043E\u0440\u044B\u0445 \u0442\u044B \u0432\u0441\u0442\u0440\u0435\u0447\u0430\u0435\u0448\u044C.",
        "ua": "\u041F\u043E\u043A\u0430\u0437\u0443\u0454, \u043D\u0430\u0441\u043A\u0456\u043B\u044C\u043A\u0438 \u0442\u0432\u043E\u0457 \u0444\u0435\u0442\u0438\u0448\u0456 \u0439 \u0434\u0456\u0457 \u0437\u0431\u0456\u0433\u0430\u044E\u0442\u044C\u0441\u044F \u0437 \u0447\u0443\u0436\u0438\u043C\u0438, \u0437\u0456 \u0437\u043D\u0430\u0447\u043A\u0430\u043C\u0438 \u0441\u0443\u043C\u0456\u0441\u043D\u043E\u0441\u0442\u0456 \u0432 \u0447\u0430\u0442-\u043A\u0456\u043C\u043D\u0430\u0442\u0430\u0445 \u0456 \u0441\u043F\u0438\u0441\u043A\u043E\u043C \u043B\u044E\u0434\u0435\u0439, \u044F\u043A\u0438\u0445 \u0442\u0438 \u0437\u0443\u0441\u0442\u0440\u0456\u0447\u0430\u0454\u0448.",
        "cn": "\u663E\u793A\u4F60\u4E0E\u5176\u4ED6\u73A9\u5BB6\u7684\u7231\u597D\u548C\u52A8\u4F5C\u5339\u914D\u7A0B\u5EA6\uFF0C\u804A\u5929\u5BA4\u91CC\u6709\u5339\u914D\u5FBD\u7AE0\uFF0C\u8FD8\u4F1A\u5217\u51FA\u4F60\u9047\u89C1\u8FC7\u7684\u4EBA\u3002",
        "tw": "\u986F\u793A\u4F60\u8207\u5176\u4ED6\u73A9\u5BB6\u7684\u611B\u597D\u548C\u52D5\u4F5C\u5339\u914D\u7A0B\u5EA6\uFF0C\u804A\u5929\u5BA4\u88E1\u6709\u5339\u914D\u5FBD\u7AE0\uFF0C\u9084\u6703\u5217\u51FA\u4F60\u9047\u898B\u904E\u7684\u4EBA\u3002"
      },
      "author": "maple",
      "tags": [
        "enhancements"
      ],
      "type": "script",
      "website": "https://maplesyrup.gitgud.site/maples-bc-plugin-library/plugins/fetish-share/",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://maplesyrup.gitgud.site/maples-bc-plugin-library/raw-plugins/stable/fetish-share/main.js"
        },
        {
          "distribution": "dev",
          "source": "https://maplesyrup.gitgud.site/maples-bc-plugin-library/raw-plugins/dev/fetish-share/main.js"
        }
      ]
    },
    {
      "id": "echocloth",
      "name": {
        "en": "Echo's Clothing Mod",
        "cn": "\u670D\u88C5\u62D3\u5C55"
      },
      "description": "Adds more clothing options and custom slots in the wardrobe. Wait for the \u{1F354} on the login character's head to make sure it loaded fully!",
      "author": "Echo",
      "repository": "https://github.com/SugarChain-Studio/echo-clothing-ext",
      "tags": [
        "expansion",
        "browser-only"
      ],
      "website": "https://github.com/emdsa2/-mod/wiki",
      "type": "script",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://sugarchain-studio.github.io/echo-clothing-ext/bc-cloth.js"
        },
        {
          "distribution": "beta",
          "source": "https://sugarchain-studio.github.io/echo-clothing-ext/bc-cloth-beta.js"
        }
      ]
    },
    {
      "id": "echomove",
      "name": {
        "en": "Echo's Activities Mod",
        "cn": "\u52A8\u4F5C\u62D3\u5C55"
      },
      "description": "Expansion on activity options",
      "author": "Echo",
      "repository": "https://github.com/SugarChain-Studio/echo-activity-ext",
      "tags": [
        "expansion",
        "browser-only"
      ],
      "website": "https://github.com/emdsa2/-mod/wiki",
      "type": "script",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://sugarchain-studio.github.io/echo-activity-ext/bc-activity.js"
        },
        {
          "distribution": "beta",
          "source": "https://sugarchain-studio.github.io/echo-activity-ext/bc-activity-beta.js"
        }
      ]
    },
    {
      "id": "MoonCEBC",
      "icon": "https://lunarkitsunify.github.io/MoonCEBC/src/Images/AddonIcon.png",
      "name": "Moon Cards Editor",
      "description": "A quality-of-life upgrade for the Club Card game deck editor.",
      "author": "Lunar Kitsunify",
      "repository": "https://github.com/LunarKitsunify/MoonCEBC",
      "discord": "https://discord.gg/ZByQXVHm4u",
      "tags": [
        "enhancements",
        "expansion"
      ],
      "type": "module",
      "website": "https://clubcardmonitoring.onrender.com/",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://lunarkitsunify.github.io/MoonCEBC/MoonCEBC.js"
        },
        {
          "distribution": "beta",
          "source": "https://lunarkitsunify.github.io/MoonCEBC/MoonCEBCBeta.js"
        }
      ]
    },
    {
      "id": "MPA",
      "icon": "https://mayathefoxy.github.io/MPA/paw64.png",
      "name": "Maya's Petplay Additions (MPA)",
      "description": "Adds more petplay themed content",
      "author": "MayaTheFoxy",
      "repository": "https://github.com/MayaTheFoxy/MPA",
      "tags": [
        "expansion"
      ],
      "type": "script",
      "website": "https://github.com/MayaTheFoxy/MPA/wiki",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://mayathefoxy.github.io/MPA/stableBundle.js"
        },
        {
          "distribution": "beta",
          "source": "https://mayathefoxy.github.io/MPA/devBundle.js"
        }
      ]
    },
    {
      "id": "ResponsiveLegacy",
      "icon": "https://dynilath.gitlab.io/SaotomeToyStore/logo.png",
      "name": "Responsive(Legacy)",
      "description": "Easily managed conditions for automatic feedback in online chat.",
      "author": "SaotomeToyStore",
      "repository": "https://github.com/dynilath/BCResponsive",
      "tags": [
        "expansion"
      ],
      "type": "script",
      "website": "https://dynilath.gitlab.io/SaotomeToyStore/en/Plugins/Responsive.html",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://dynilath.gitlab.io/SaotomeToyStoreVendor/Responsive/main.js"
        }
      ]
    },
    {
      "id": "CRABS",
      "icon": "https://sin-1337.github.io/CRABS/images/CRABS_Logo.png",
      "name": "CRABS (Crazy Roster Addon By Sin)",
      "description": "Adds a dynamic, stowable room roster (via /roster or /crabs) designed to streamline your gameplay with live player sorting, advanced map tracking, global Whisper+, and interactive management tools.",
      "author": "Sin",
      "repository": "https://github.com/sin-1337/CRABS",
      "tags": [
        "enhancements",
        "expansion"
      ],
      "type": "script",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://sin-1337.github.io/CRABS/Stable/bundle.js"
        },
        {
          "distribution": "beta",
          "source": "https://sin-1337.github.io/CRABS/Beta/bundle.js"
        }
      ]
    },
    {
      "id": "LC",
      "icon": "https://raw.githubusercontent.com/FurryZoi/Littlish-Club/main/src/images/milk-bottle.png",
      "name": "Littlish Club",
      "description": "ABDL addon for mommy & baby relationship games. Adds diapers, babiesh outfits library, rules and such stuff.",
      "author": "Zoi",
      "repository": "https://github.com/FurryZoi/Littlish-Club",
      "tags": [
        "enhancements",
        "expansion"
      ],
      "type": "script",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://furryzoi.github.io/Littlish-Club/bundle.js"
        }
      ]
    },
    {
      "id": "emoji",
      "name": "emoji",
      "description": "add emoji picker, send emoji to the chat. Lovly~",
      "author": "Ayako Qt",
      "repository": "https://github.com/Ayako-Qt/Emojis/tree/pages",
      "tags": [
        "expansion"
      ],
      "type": "script",
      "versions": [
        {
          "distribution": "dev",
          "source": "https://ayako-qt.github.io/Emojis/js/emojiPicker.js"
        }
      ]
    },
    {
      "id": "BCOM",
      "name": "BC Outfit Manager",
      "description": "An addon for managing outfits with included restraints, saving them to local storage with exporting and importing functionality. Supports BCX outfit codes.",
      "author": "Utsumi",
      "repository": "https://github.com/Utsumi24/BCOM/",
      "tags": [
        "expansion"
      ],
      "type": "script",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://utsumi24.github.io/BCOM/bcom.js"
        }
      ]
    },
    {
      "id": "LianChat",
      "icon": "https://xinlian132243.github.io/BCMod/Assets/LianChatButton.png",
      "name": {
        "en": "LianChat",
        "cn": "\u6D9F\u4FE1"
      },
      "description": "A more modern interface for private messaging with friends, custom avatars and signatures, and the ability to view lobby rooms from anywhere.",
      "author": "XinLian",
      "repository": "https://github.com/XinLian132243/BCMod/",
      "tags": [
        "expansion"
      ],
      "type": "script",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://xinlian132243.github.io/BCMod/BC_LianChat.user.js"
        }
      ]
    },
    {
      "id": "NFT",
      "name": "NFT - Nest of Fluffy Treasures",
      "description": "Save and load ItemHandheld / ItemMisc items with full appearance, crafter and property restore.",
      "author": "Nicole, Felix, Tifa",
      "repository": "https://gitlab.com/nicole-bc-group/NFT/",
      "tags": [
        "expansion"
      ],
      "type": "script",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://nft-dc4430.gitlab.io/NFT.js"
        },
        {
          "distribution": "dev",
          "source": "https://nft-dc4430.gitlab.io/NFT-dev.js"
        }
      ]
    },
    {
      "id": "EmeryBC",
      "name": "EmeryBC",
      "description": "Outfits, restraint sets, action buttons, poses, scenes, friends tools, palettes, IM & QoL features for Bondage Club.",
      "author": "Emery",
      "repository": "https://github.com/NekoEmery/EmeryBC",
      "tags": [
        "enhancements",
        "automation"
      ],
      "type": "script",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://nekoemery.github.io/EmeryBC/stable/bundle.js"
        },
        {
          "distribution": "dev",
          "source": "https://nekoemery.github.io/EmeryBC/dev/bundle.js"
        }
      ]
    },
    {
      "id": "BCNeko",
      "icon": "https://cdn.jsdelivr.net/gh/QAQMOON/meow-@main/assets/neko-icon.png",
      "name": "Bondage Club Neko Chat Enhancer",
      "description": "Catgirl chat enhancer with neko-style message conversion, chat decorations, kaomoji picker, quick roleplay actions, and color themes.",
      "author": "QAQMOON",
      "repository": "https://github.com/QAQMOON/meow-",
      "tags": [
        "enhancements"
      ],
      "type": "eval",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://cdn.jsdelivr.net/gh/QAQMOON/meow-@main/dist/bondage-club-neko.runtime.full.js"
        },
        {
          "distribution": "dev",
          "source": "https://cdn.jsdelivr.net/gh/QAQMOON/meow-@main/dist/bondage-club-neko.dev.runtime.js"
        }
      ]
    },
    {
      "id": "AFC",
      "icon": "https://cdn.jsdelivr.net/gh/awdrrawd/BC-AFC@main/Images/AFC-ICON.png",
      "name": {
        "en": "Abundantia Florum \u2500Chromatica\u2500",
        "cn": "\u7E41\u6200\u5982\u82B1 \u2500\u7E7D\u7D1B\u2500"
      },
      "description": "Extended lover framework featuring relationship progression, shared private rooms, integrated Heart Lock systems.",
      "author": "Likolisu",
      "repository": "https://github.com/awdrrawd/BC-AFC",
      "tags": [
        "expansion"
      ],
      "type": "module",
      "versions": [
        {
          "distribution": "dev",
          "source": "https://awdrrawd.github.io/BC-AFC/assets/main.js"
        }
      ]
    },
    {
      "id": "FCM",
      "name": {
        "en": "Friends and ChatRoom Manager",
        "cn": "\u597D\u53CB\u8207\u623F\u9593\u7BA1\u7406"
      },
      "description": "Friends and chatroom enhancement toolkit with avatar display, relationship tracking, player search, and extended room utilities.",
      "author": "Likolisu",
      "repository": "https://github.com/awdrrawd/BC-FCM",
      "tags": [
        "expansion"
      ],
      "type": "module",
      "versions": [
        {
          "distribution": "dev",
          "source": "https://awdrrawd.github.io/BC-FCM/assets/main.js"
        }
      ]
    },
    {
      "id": "HSC",
      "icon": "https://cdn.jsdelivr.net/gh/awdrrawd/BC-HSC@main/Assets/Icon/HSC-iconB2.png",
      "name": {
        "en": "Hypnotic Slave Club",
        "cn": "\u50AC\u7720\u5974\u96B8\u4FF1\u6A02\u90E8"
      },
      "description": "Provides a variety of hypnosis effects to enhance the immersion of the experience.",
      "author": "Likolisu",
      "repository": "https://github.com/awdrrawd/BC-HSC",
      "tags": [
        "expansion"
      ],
      "type": "module",
      "versions": [
        {
          "distribution": "dev",
          "source": "https://awdrrawd.github.io/BC-HSC/assets/main.js"
        }
      ]
    },
    {
      "id": "KikiLink",
      "icon": "https://cdn.jsdelivr.net/gh/Lilja000/KikiLink@82885c09d2be1cf22dd5423555557e96c1c1c7a3/design/branding/kikilink-emblem.webp",
      "name": "KikiLink",
      "description": "Social profiles, direct and group chat, presence, room tools, media, custom activities, reactions, and quality-of-life features.",
      "author": "Kiki",
      "repository": "https://github.com/Lilja000/KikiLink",
      "tags": [
        "enhancements",
        "expansion"
      ],
      "type": "script",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://cdn.jsdelivr.net/gh/Lilja000/KikiLink@main/dist/KikiLink.fusam.js"
        }
      ]
    },
    {
      "id": "EMLALOCK",
      "name": "EmlaLock BC Integration",
      "description": "Shows EmlaLock account and lock status badges",
      "icon": "https://gitlab.com/emlalock/bc-userscript/-/raw/main/logo.svg",
      "author": "EmlaLock",
      "repository": "https://gitlab.com/emlalock/bc-userscript",
      "website": "https://www.emlalock.com",
      "discord": "https://discord.gg/9gwPqQxqfZ",
      "tags": [
        "expansion"
      ],
      "type": "script",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://www.emlalock.com/bc-emlalock.user.js"
        }
      ]
    },
    {
      "id": "AEE",
      "icon": "https://cdn.jsdelivr.net/gh/awdrrawd/BC-AEE@main/public/AEE_icon.jpg",
      "name": {
        "cn": "\u5916\u89C0\u7DE8\u8F2F\u62D3\u5C55",
        "en": "Appearance editing extension"
      },
      "description": "A clothing editor extension for the club, featuring a modern UI, a wide range of convenient tools, intuitive controls, highly customizable settings, as well as a completely revamped wardrobe system with expanded clothing capacity.",
      "author": "Likolisu",
      "repository": "https://github.com/awdrrawd/BC-AEE",
      "tags": [
        "expansion"
      ],
      "type": "module",
      "versions": [
        {
          "distribution": "beta",
          "source": "https://awdrrawd.github.io/BC-AEE/assets/main.js"
        }
      ]
    },
    {
      "id": "BCPlus",
      "icon": "https://seles84.github.io/bc-plus/icon.png",
      "name": "BC+ (Bondage Club Plus)",
      "description": "Rules, curses, punishments, contracts, auto-generated permissions, a virtual pet module and collar welding - runs standalone or alongside BCX",
      "author": "Seles",
      "repository": "https://github.com/Seles84/bc-plus",
      "website": "https://seles84.github.io/bc-plus/",
      "tags": [
        "enhancements",
        "expansion"
      ],
      "type": "script",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://seles84.github.io/bc-plus/bcplus.js"
        }
      ]
    },
    {
      "id": "BCSecPris",
      "icon": "https://thesecretcoder-bc.gitlab.io/secretprison/icon.png",
      "name": "Secret Prison",
      "description": "Long cell and asylum sentences set by whisper, with parole by beep, taunts, status checks and a settings screen. Requires BCX",
      "author": "TheSecretCoder",
      "repository": "https://gitlab.com/TheSecretCoder-BC/secretprison",
      "website": "https://gitlab.com/TheSecretCoder-BC/secretprison/-/blob/main/KEYHOLDER.md",
      "tags": [
        "enhancements",
        "expansion"
      ],
      "type": "script",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://thesecretcoder-bc.gitlab.io/secretprison/secretprison.js"
        }
      ]
    },
    {
      "id": "FBM",
      "icon": "https://freya-bc.github.io/Freyas-Better-Maps/assets/freyas-better-maps-logo.jpg",
      "name": "Freyas Better Maps",
      "description": "Bondage Club map helpers: typing bubbles, copy and paste, build tools, templates, map library, hearing-range whisper, SuperZoom.",
      "author": "Freya",
      "repository": "https://github.com/Freya-BC/Freyas-Better-Maps",
      "tags": [
        "enhancements"
      ],
      "type": "script",
      "versions": [
        {
          "distribution": "stable",
          "source": "https://freya-bc.github.io/Freyas-Better-Maps/loader.js"
        }
      ]
    },
    {
      "id": "SlimeBeep",
      "icon": "https://proudkiller0015.github.io/slimebeep/icon-128.png",
      "name": "SlimeBeep",
      "description": "A cute beep messenger: chat with each friend, see who's online and where, beep many friends at once (WaveBeep), group chats with other SlimeBeep users, profile pictures and a night mode. Uses its own server on Cloudflare (Workers + Durable Objects, code in the repo's relay/ folder) to store group chats (members, last 200 messages, pictures) and beeps left for offline friends (kept up to 14 days).",
      "author": "SlimeQueenSamantha",
      "repository": "https://github.com/Proudkiller0015/slimebeep",
      "tags": [
        "enhancements",
        "expansion"
      ],
      "type": "script",
      "versions": [
        {
          "distribution": "beta",
          "source": "https://proudkiller0015.github.io/slimebeep/slimebeep.js"
        }
      ]
    }
  ];
  var manifestCatalog = /* @__PURE__ */ new Map();
  function loadAddonArrayIntoCatalog(addons) {
    if (!Array.isArray(addons)) return;
    for (const addon of addons) {
      const curated = parseFusamAddonToCurated(addon);
      if (curated) {
        manifestCatalog.set(curated.id.toLowerCase(), curated);
      }
    }
  }
  loadAddonArrayIntoCatalog(BUNDLED_FUSAM_ADDONS);
  if (typeof localStorage !== "undefined") {
    try {
      const cachedRaw = localStorage.getItem(CACHE_STORAGE_KEY);
      if (cachedRaw) {
        const cachedParsed = JSON.parse(cachedRaw);
        if (Array.isArray(cachedParsed)) {
          loadAddonArrayIntoCatalog(cachedParsed);
        }
      }
    } catch (_) {
    }
  }
  async function initFusamManifest() {
    if (typeof fetch === "undefined") return;
    try {
      const response = await fetch(FUSAM_MANIFEST_URL, {
        cache: "no-cache",
        headers: { "Accept": "application/json" }
      });
      if (!response.ok) {
        console.warn(`[QoC] Could not fetch FUSAM manifest (HTTP ${response.status})`);
        return;
      }
      const data = await response.json();
      if (data && Array.isArray(data.addons)) {
        loadAddonArrayIntoCatalog(data.addons);
        if (typeof localStorage !== "undefined") {
          try {
            localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(data.addons));
          } catch (_) {
          }
        }
        console.log(`[QoC] Successfully synchronized ${manifestCatalog.size} community addons from FUSAM manifest.`);
      }
    } catch (err) {
      console.warn("[QoC] Failed to synchronize live FUSAM manifest, using bundled snapshot:", err);
    }
  }
  function getFusamManifestCatalog() {
    const res = {};
    for (const [_, item] of manifestCatalog) {
      res[item.id] = item;
    }
    return res;
  }

  // src/modules/modDetection.ts
  var CURATED_MOD_CATALOG = {
    BCX: {
      id: "BCX",
      name: "Bondage Club Extended (BCX)",
      description: "Rules, curses, statistics, extended room tools",
      scriptUrl: "https://jomshir98.github.io/bondage-club-extended/bcx.js",
      detectKeys: ["bcx", "bondage club extended", "bondage-club-extended", "bondage club extended (bcx)"],
      repositoryMatch: "jomshir98/bondage-club-extended"
    },
    LSCG: {
      id: "LSCG",
      name: "Littlish Club (LSCG)",
      description: "Little Sister's Club overhaul & dynamics",
      scriptUrl: "https://furryzoi.github.io/Littlish-Club/bundle.js",
      detectKeys: ["lscg", "littlish club", "littlish-club"],
      repositoryMatch: "furryzoi/littlish-club"
    },
    BCT: {
      id: "BCT",
      name: "Bondage Club Tools (BCT)",
      description: "Inventory searching, poses, quick actions",
      scriptUrl: "https://sidiousious.gitlab.io/bct/bundle.js",
      detectKeys: ["bct", "bondage club tools", "bondage-club-tools"],
      repositoryMatch: "bct"
    },
    DOGS: {
      id: "DOGS",
      name: "Devious-Obligate-Great-Stuff (DOGS)",
      description: "Devious padlocks, remote controls, timers",
      scriptUrl: "https://furryzoi.github.io/Devious-Obligate-Great-Stuff/bundle.js",
      detectKeys: ["dogs", "devious-obligate-great-stuff", "devious obligate great stuff"],
      repositoryMatch: "devious-obligate-great-stuff"
    },
    ClubChaos: {
      id: "ClubChaos",
      name: "Club Chaos",
      description: "Interactive chaos curses & toys",
      scriptUrl: "https://sidiousious.gitlab.io/bc-chaos/bundle.js",
      detectKeys: ["clubchaos", "club chaos"],
      repositoryMatch: "bc-chaos"
    },
    FUSAM: {
      id: "FUSAM",
      name: "Fantastic Ultimate Solution to Addon Management (FUSAM)",
      description: "Centralized addon loader & manager",
      scriptUrl: "https://sidiousious.gitlab.io/bc-addon-loader/fusam.js",
      detectKeys: ["fusam", "fantastic ultimate solution to addon management", "fantastic ultimate solution to addon management (fusam)"],
      repositoryMatch: "bc-addon-loader"
    }
  };
  function getAllCatalogMods() {
    const combined = {
      ...getFusamManifestCatalog(),
      ...CURATED_MOD_CATALOG
    };
    if (modStorage?.inspector?.customCatalog && Array.isArray(modStorage.inspector.customCatalog)) {
      for (const item of modStorage.inspector.customCatalog) {
        if (item && item.id) {
          combined[item.id] = { ...item, isCustom: true };
        }
      }
    }
    return combined;
  }
  function getCuratedMod(idOrName) {
    if (!idOrName) return null;
    const target = idOrName.trim().toLowerCase();
    const all = getAllCatalogMods();
    for (const [key, item] of Object.entries(all)) {
      if (key.toLowerCase() === target) return item;
    }
    for (const item of Object.values(all)) {
      if (item.id.toLowerCase() === target || item.name.toLowerCase() === target) {
        return item;
      }
    }
    for (const item of Object.values(all)) {
      if (Array.isArray(item.detectKeys)) {
        for (const k of item.detectKeys) {
          if (k.toLowerCase() === target) return item;
        }
      }
    }
    return null;
  }
  function cleanStr(s) {
    return (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  }
  var sessionInjectedMods = /* @__PURE__ */ new Set();
  function isDetectedModMatch(mod, identifierOrCurated) {
    if (!mod || !identifierOrCurated) return false;
    const mId = (mod.id || "").trim().toLowerCase();
    const mName = (mod.name || "").trim().toLowerCase();
    const mFull = (mod.fullName || "").trim().toLowerCase();
    const mRepo = (mod.repository || "").trim().toLowerCase();
    const mCleanId = cleanStr(mId);
    const mCleanName = cleanStr(mName);
    const mCleanFull = cleanStr(mFull);
    const mCleanRepo = cleanStr(mRepo);
    const curated = typeof identifierOrCurated === "object" ? identifierOrCurated : getCuratedMod(identifierOrCurated);
    if (curated) {
      const cId = (curated.id || "").trim().toLowerCase();
      const cName = (curated.name || "").trim().toLowerCase();
      const cCleanId = cleanStr(cId);
      const cCleanName = cleanStr(cName);
      if (cId && (mId === cId || mName === cId || mCleanId === cCleanId || mCleanName === cCleanId)) return true;
      if (cName && (mId === cName || mName === cName || mFull === cName || mCleanId === cCleanName || mCleanName === cCleanName || mCleanFull === cCleanName)) return true;
      if (curated.repositoryMatch && mRepo) {
        const expectedRepo = cleanStr(curated.repositoryMatch);
        if (expectedRepo && mCleanRepo.includes(expectedRepo)) return true;
      }
      if (Array.isArray(curated.detectKeys)) {
        for (const rawKey of curated.detectKeys) {
          const key = (rawKey || "").trim().toLowerCase();
          if (!key) continue;
          const cleanKey = cleanStr(key);
          if (mId === key || mName === key || mFull === key) return true;
          if (cleanKey && (mCleanId === cleanKey || mCleanName === cleanKey || mCleanFull === cleanKey)) return true;
        }
      }
      return false;
    }
    const target = (typeof identifierOrCurated === "string" ? identifierOrCurated : "").trim().toLowerCase();
    if (!target) return false;
    const cleanTarget = cleanStr(target);
    return mId === target || mName === target || mFull === target || !!cleanTarget && (mCleanId === cleanTarget || mCleanName === cleanTarget || mCleanFull === cleanTarget);
  }
  function getLoadedMods2() {
    const modsMap = /* @__PURE__ */ new Map();
    const tryProcessModList = (list) => {
      if (!Array.isArray(list)) return;
      for (const item of list) {
        if (!item) continue;
        const name = typeof item.name === "string" && item.name.trim() ? item.name.trim() : typeof item.fullName === "string" ? item.fullName.trim() : "Unknown Mod";
        const fullName = typeof item.fullName === "string" && item.fullName.trim() ? item.fullName.trim() : name;
        const key = name.toLowerCase();
        if (!modsMap.has(key)) {
          modsMap.set(key, {
            id: item.name || key,
            name,
            fullName,
            version: item.version || "Unknown",
            repository: item.repository
          });
        }
      }
    };
    try {
      const sdkList = getLoadedMods();
      tryProcessModList(sdkList);
    } catch (_) {
    }
    try {
      const win2 = typeof window !== "undefined" ? window : null;
      const modSdk2 = win2 ? win2.bcModSdk || win2.bcModSDK : null;
      if (modSdk2 && typeof modSdk2.getModsInfo === "function") {
        tryProcessModList(modSdk2.getModsInfo());
      }
    } catch (e) {
      console.warn("[QoC] Error reading bcModSdk mods info:", e);
    }
    const win = typeof window !== "undefined" ? window : null;
    if (win) {
      const isRealGlobalObject = (obj) => {
        if (!obj || typeof obj !== "object") return false;
        if (typeof obj.nodeType === "number") return false;
        if (typeof win.HTMLElement !== "undefined" && obj instanceof win.HTMLElement) return false;
        return true;
      };
      const hasBcx = win.BCX_Loaded === true || isRealGlobalObject(win.bcx) && (typeof win.bcx.getModApi === "function" || typeof win.bcx.inBcxSubscreen === "function");
      if (hasBcx && !modsMap.has("bcx") && !modsMap.has("bondage club extended")) {
        modsMap.set("bcx", {
          id: "BCX",
          name: "BCX",
          fullName: "Bondage Club Extended",
          version: typeof win.bcx?.version === "string" ? win.bcx.version : "Active"
        });
      }
      const hasLscg = isRealGlobalObject(win.LITTLISH_CLUB) && typeof win.LITTLISH_CLUB.inModSubscreen === "function" || isRealGlobalObject(win.LSCG);
      if (hasLscg && !modsMap.has("lscg") && !modsMap.has("littlish club")) {
        modsMap.set("lscg", {
          id: "LSCG",
          name: "LSCG",
          fullName: "Littlish Club",
          version: "Active"
        });
      }
      const hasBct = isRealGlobalObject(win.BCT) && (typeof win.BCT.Init === "function" || typeof win.BCT.version === "string");
      if (hasBct && !modsMap.has("bct") && !modsMap.has("bondage club tools")) {
        modsMap.set("bct", {
          id: "BCT",
          name: "BCT",
          fullName: "Bondage Club Tools",
          version: win.BCT.version || "Active"
        });
      }
      const hasDogs = isRealGlobalObject(win.DOGS);
      if (hasDogs && !modsMap.has("dogs") && !modsMap.has("devious-obligate-great-stuff")) {
        modsMap.set("dogs", {
          id: "DOGS",
          name: "DOGS",
          fullName: "Devious-Obligate-Great-Stuff",
          version: "Active"
        });
      }
      const hasClubChaos = isRealGlobalObject(win.ClubChaos);
      if (hasClubChaos && !modsMap.has("clubchaos") && !modsMap.has("club chaos")) {
        modsMap.set("clubchaos", {
          id: "ClubChaos",
          name: "ClubChaos",
          fullName: "Club Chaos",
          version: "Active"
        });
      }
      const hasFusam = isRealGlobalObject(win.FUSAM) && win.FUSAM.present === true;
      if (hasFusam && !modsMap.has("fusam")) {
        modsMap.set("fusam", {
          id: "FUSAM",
          name: "FUSAM",
          fullName: "Fantastic Ultimate Solution to Addon Management (FUSAM)",
          version: "Active"
        });
      }
      if (hasFusam && win.FUSAM.addons && typeof win.FUSAM.addons === "object") {
        for (const [fId, fVal] of Object.entries(win.FUSAM.addons)) {
          if (!fId) continue;
          const val = fVal;
          if (val && (val.status === "loaded" || val.status === "loading" || val.distribution)) {
            const k = fId.toLowerCase();
            if (!modsMap.has(k)) {
              const curated = getCuratedMod(fId);
              modsMap.set(k, {
                id: curated?.id || fId,
                name: curated?.name || fId,
                fullName: curated?.name || fId,
                version: typeof val.distribution === "string" ? val.distribution : "Active"
              });
            }
          }
        }
      }
    }
    for (const injectedId of sessionInjectedMods) {
      const k = injectedId.toLowerCase();
      if (!modsMap.has(k)) {
        const curated = getCuratedMod(injectedId);
        modsMap.set(k, {
          id: curated?.id || injectedId,
          name: curated?.name || injectedId,
          fullName: curated?.name || injectedId,
          version: "Injected"
        });
      }
    }
    return Array.from(modsMap.values());
  }
  function isModLoaded(identifier) {
    if (!identifier) return false;
    const target = identifier.trim().toLowerCase();
    const cleanTarget = cleanStr(target);
    if (sessionInjectedMods.has(target) || cleanTarget && Array.from(sessionInjectedMods).some((m) => cleanStr(m) === cleanTarget)) {
      return true;
    }
    if (typeof window !== "undefined" && window.FUSAM && typeof window.FUSAM.addons === "object") {
      const fAddons = window.FUSAM.addons;
      for (const [fId, fVal] of Object.entries(fAddons)) {
        if (!fId) continue;
        const val = fVal;
        if (val && (val.status === "loaded" || val.status === "loading" || val.distribution)) {
          if (fId.toLowerCase() === target || cleanStr(fId) === cleanTarget) {
            return true;
          }
        }
      }
    }
    const loaded = getLoadedMods2();
    return loaded.some((mod) => isDetectedModMatch(mod, identifier));
  }
  async function loadCuratedMod(catalogId) {
    if (!catalogId) return false;
    const target = catalogId.toLowerCase().trim();
    const all = getAllCatalogMods();
    const mod = all[catalogId] || Object.values(all).find(
      (c) => c.id.toLowerCase() === target || c.name.toLowerCase() === target || Array.isArray(c.detectKeys) && c.detectKeys.some((k) => k.toLowerCase() === target)
    );
    if (!mod || !mod.scriptUrl) {
      console.warn(`[QoC] Cannot auto-load mod '${catalogId}'. No valid script URL found.`);
      return false;
    }
    if (isModLoaded(catalogId)) {
      return true;
    }
    const scriptUrl = mod.noCacheBusting ? mod.scriptUrl : mod.scriptUrl.includes("?") ? `${mod.scriptUrl}&_=${Date.now()}` : `${mod.scriptUrl}?_=${Date.now()}`;
    console.log(`[QoC] Injecting verified mod script for ${mod.name}: ${scriptUrl} (type: ${mod.scriptType || "script"})`);
    let executionSuccess = false;
    const isGithubRaw = scriptUrl.includes("raw.githubusercontent.com");
    if (mod.scriptType === "eval" || isGithubRaw) {
      try {
        const resp = await fetch(scriptUrl);
        if (!resp.ok) throw new Error(`HTTP error ${resp.status}`);
        let code = await resp.text();
        code = code.replace(/sourceMappingURL=.*?.map/u, "");
        (1, eval)(code);
        executionSuccess = true;
        console.log(`[QoC] Successfully evaluated script for ${mod.name}`);
      } catch (err) {
        console.error(`[QoC] Error evaluating ${mod.name}:`, err);
      }
    } else if (mod.scriptType === "module") {
      try {
        await new Function("u", "return import(u)")(scriptUrl);
        executionSuccess = true;
        console.log(`[QoC] Successfully imported module for ${mod.name}`);
      } catch (err) {
        console.warn(`[QoC] Dynamic import failed for ${mod.name}, falling back to <script type="module">:`, err);
        try {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.type = "module";
            script.src = scriptUrl;
            script.onload = () => resolve();
            script.onerror = (e) => reject(e);
            document.head.appendChild(script);
          });
          executionSuccess = true;
        } catch (scriptErr) {
          console.error(`[QoC] Script module tag also failed for ${mod.name}:`, scriptErr);
        }
      }
    } else {
      try {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = scriptUrl;
          script.async = true;
          script.onload = () => resolve();
          script.onerror = (e) => reject(e);
          document.head.appendChild(script);
        });
        executionSuccess = true;
        console.log(`[QoC] Successfully loaded script tag for ${mod.name}`);
      } catch (scriptErr) {
        console.warn(`[QoC] Standard script tag failed for ${mod.name}, falling back to fetch/eval:`, scriptErr);
        try {
          const resp = await fetch(scriptUrl);
          if (resp.ok) {
            let code = await resp.text();
            code = code.replace(/sourceMappingURL=.*?.map/u, "");
            (1, eval)(code);
            executionSuccess = true;
            console.log(`[QoC] Successfully loaded ${mod.name} via fetch/eval fallback`);
          }
        } catch (fetchErr) {
          console.error(`[QoC] Both script tag and fetch/eval failed for ${mod.name}:`, fetchErr);
        }
      }
    }
    if (!executionSuccess) {
      return false;
    }
    sessionInjectedMods.add(mod.id.toLowerCase());
    sessionInjectedMods.add(catalogId.toLowerCase());
    if (mod.name) sessionInjectedMods.add(mod.name.toLowerCase());
    if (Array.isArray(mod.detectKeys)) {
      for (const k of mod.detectKeys) sessionInjectedMods.add(k.toLowerCase());
    }
    for (let i = 0; i < 25; i++) {
      if (isModLoaded(catalogId)) {
        console.log(`[QoC] Confirmed active in session: ${mod.name}`);
        return true;
      }
      await new Promise((r) => setTimeout(r, 200));
    }
    return true;
  }

  // src/modules/compliance.ts
  var isEvaluating = false;
  var promptedMods = /* @__PURE__ */ new Set();
  function checkComplianceAgainstRules(mods, rules) {
    const missing = [];
    const forbidden = [];
    const details = [];
    const findLoadedMatch = (rule) => {
      return mods.find((m) => isDetectedModMatch(m, rule.modId) || rule.modName && isDetectedModMatch(m, rule.modName));
    };
    const hasRules = Array.isArray(rules) && rules.length > 0;
    if (hasRules) {
      for (const rule of rules) {
        const isMandatory = rule.type === "required" || rule.type === "mandatory";
        const isForbidden = rule.type === "forbidden";
        const matchedMod = findLoadedMatch(rule);
        if (isMandatory) {
          if (!matchedMod) {
            missing.push(rule);
            details.push({ rule, status: "violated" });
          } else {
            details.push({ rule, status: "met", matchedMod });
          }
        } else if (isForbidden) {
          if (matchedMod) {
            forbidden.push(rule);
            details.push({ rule, status: "violated", matchedMod });
          } else {
            details.push({ rule, status: "met" });
          }
        }
      }
    }
    return {
      hasRules,
      isCompliant: hasRules ? missing.length === 0 && forbidden.length === 0 : true,
      missing,
      forbidden,
      details
    };
  }
  var lockoutElement = null;
  function triggerLockoutOverlay(rule) {
    if (lockoutElement && document.body.contains(lockoutElement)) {
      return;
    }
    const overlay = document.createElement("div");
    overlay.id = "qoc-lockout-overlay";
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(18, 5, 8, 0.96);
        z-index: 100000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #ff5252;
        font-family: Arial, sans-serif;
        text-align: center;
        padding: 40px;
        box-sizing: border-box;
        user-select: none;
    `;
    const enforcer = rule.enforcedByName || `Member #${rule.enforcedBy}`;
    overlay.innerHTML = `
        <div style="font-size: 72px; margin-bottom: 16px; filter: drop-shadow(0 0 20px rgba(255, 82, 82, 0.6));">\u{1F6AB}</div>
        <div style="font-size: 28px; font-weight: bold; color: #ff5252; margin-bottom: 12px; letter-spacing: 1.5px;">
            QUALITY OF CLUB POLICY VIOLATION: INTERFACE LOCKED
        </div>
        <div style="font-size: 17px; color: #ffcdd2; max-width: 650px; line-height: 1.6; margin-bottom: 20px;">
            You are actively running the forbidden addon: <b style="color: #ff8a80;">${rule.modName}</b>.<br>
            Access to Bondage Club has been locked until this forbidden addon is disabled or uninstalled.
        </div>
        <div style="font-size: 14px; color: #ef9a9a; margin-bottom: 30px;">
            Policy enforced by: <b>${enforcer}</b>
        </div>
        <div style="display: flex; gap: 16px;">
            <button id="qoc-lockout-reload" style="padding: 12px 30px; background: #c62828; border: 1px solid #ff5252; color: white; font-size: 15px; font-weight: bold; border-radius: 6px; cursor: pointer; transition: all 0.2s;">
                \u{1F504} Reload Game Page
            </button>
            <button id="qoc-lockout-recheck" style="padding: 12px 30px; background: rgba(55, 71, 79, 0.9); border: 1px solid #78909c; color: white; font-size: 15px; font-weight: bold; border-radius: 6px; cursor: pointer; transition: all 0.2s;">
                \u26A1 Re-check Compliance
            </button>
        </div>
    `;
    overlay.querySelector("#qoc-lockout-reload")?.addEventListener("click", () => {
      window.location.reload();
    });
    overlay.querySelector("#qoc-lockout-recheck")?.addEventListener("click", async () => {
      const report = await evaluateCompliance();
      if (report.detectedForbidden.length === 0) {
        clearLockoutOverlay();
        toastsManager.success({
          title: `${MOD_NAME} Unlocked`,
          message: "Forbidden addon no longer detected. Access restored!",
          duration: 4e3
        });
      } else {
        toastsManager.error({
          title: `${MOD_NAME} Still Non-Compliant`,
          message: "Forbidden addon is still running in this session.",
          duration: 4e3
        });
      }
    });
    document.body.appendChild(overlay);
    lockoutElement = overlay;
  }
  function clearLockoutOverlay() {
    if (lockoutElement) {
      lockoutElement.remove();
      lockoutElement = null;
    }
  }
  async function evaluateCompliance() {
    if (isEvaluating || !modStorage.inspector.enabled) {
      return { isCompliant: true, missingRequired: [], detectedForbidden: [] };
    }
    isEvaluating = true;
    const missingRequired = [];
    const detectedForbidden = [];
    try {
      const rules = modStorage.inspector.rules;
      if (!rules || rules.length === 0) {
        clearLockoutOverlay();
        return { isCompliant: true, missingRequired: [], detectedForbidden: [] };
      }
      for (const rule of rules) {
        const loaded = isModLoaded(rule.modId) || isModLoaded(rule.modName);
        if (rule.type === "required" && !loaded) {
          missingRequired.push(rule);
          const enforcer = rule.enforcedByName || `Member #${rule.enforcedBy}`;
          const curated = getCuratedMod(rule.modId) || getCuratedMod(rule.modName);
          if (curated) {
            if (modStorage.inspector.autoLoadMode === "Silent") {
              toastsManager.info({
                title: `${MOD_NAME} Auto-Loader`,
                message: `Auto-injecting mandatory addon: ${curated.name}...`,
                duration: 4e3
              });
              const success = await loadCuratedMod(curated.id);
              if (success && (isModLoaded(rule.modId) || isModLoaded(rule.modName))) {
                toastsManager.success({
                  title: `${MOD_NAME} Injected`,
                  message: `Successfully loaded ${curated.name}!`,
                  duration: 4e3
                });
                const idx = missingRequired.indexOf(rule);
                if (idx !== -1) missingRequired.splice(idx, 1);
              } else if (success) {
                toastsManager.warn({
                  title: `${MOD_NAME} Injection Notice`,
                  message: `Injected ${curated.name}, but it has not initialized yet.`,
                  duration: 4500
                });
              }
            } else if (modStorage.inspector.autoLoadMode === "Prompt") {
              if (!promptedMods.has(curated.id)) {
                promptedMods.add(curated.id);
                const promptMsg = `[${MOD_NAME}] Mandatory Addon: ${curated.name} is required by ${enforcer}. Load it now?`;
                try {
                  dialogsManager.confirm({
                    message: promptMsg
                  }).then(async (ok) => {
                    if (ok) {
                      await loadCuratedMod(curated.id);
                      evaluateCompliance();
                    }
                  }).catch(async () => {
                    if (typeof window !== "undefined" && window.confirm(promptMsg)) {
                      await loadCuratedMod(curated.id);
                      evaluateCompliance();
                    }
                  });
                } catch {
                  if (typeof window !== "undefined" && window.confirm(promptMsg)) {
                    await loadCuratedMod(curated.id);
                    evaluateCompliance();
                  }
                }
              }
            } else if (modStorage.inspector.autoLoadMode === "Alert") {
              toastsManager.warn({
                title: `${MOD_NAME} Mandatory Notice`,
                message: `Mandatory addon '${curated.name}' required by ${enforcer} is missing.`,
                duration: 6e3
              });
            }
          } else {
            toastsManager.warn({
              title: `${MOD_NAME} Compliance Notice`,
              message: `Mandatory addon '${rule.modName}' is not loaded. Please load it.`,
              duration: 6e3
            });
          }
        } else if (rule.type === "forbidden" && loaded) {
          detectedForbidden.push(rule);
          const enforcer = rule.enforcedByName || `Member #${rule.enforcedBy}`;
          const violationAction = modStorage.inspector.violationAction || "toast";
          if (violationAction === "toast") {
            toastsManager.error({
              title: `${MOD_NAME} Policy Violation`,
              message: `Addon '${rule.modName}' is FORBIDDEN by ${enforcer}. Please disable it immediately!`,
              duration: 9e3
            });
          } else if (violationAction === "room_alert") {
            toastsManager.error({
              title: `${MOD_NAME} Policy Violation`,
              message: `Addon '${rule.modName}' is FORBIDDEN! Public room alert announced.`,
              duration: 9e3
            });
            if (typeof ServerSend === "function" && typeof ServerPlayerIsInChatRoom === "function" && ServerPlayerIsInChatRoom()) {
              const pName = typeof Player !== "undefined" ? Player.Name : "Player";
              ServerSend("ChatRoomChat", {
                Content: `* [${MOD_NAME} Violation] ${pName} is actively running forbidden addon '${rule.modName}'! *`,
                Type: "Emote"
              });
            }
          } else if (violationAction === "lockout") {
            triggerLockoutOverlay(rule);
          } else if (violationAction === "leave_room") {
            toastsManager.error({
              title: `${MOD_NAME} Room Ejection`,
              message: `Ejected from room: Addon '${rule.modName}' is FORBIDDEN by ${enforcer}!`,
              duration: 9e3
            });
            if (typeof ChatRoomLeave === "function" && typeof ServerPlayerIsInChatRoom === "function" && ServerPlayerIsInChatRoom()) {
              ChatRoomLeave();
            }
          }
        }
      }
      if (detectedForbidden.length === 0) {
        clearLockoutOverlay();
      }
    } catch (e) {
      console.error("[QoC] Error evaluating compliance:", e);
    } finally {
      isEvaluating = false;
    }
    return {
      isCompliant: missingRequired.length === 0 && detectedForbidden.length === 0,
      missingRequired,
      detectedForbidden
    };
  }

  // node_modules/.pnpm/class-transformer@0.5.1/node_modules/class-transformer/esm5/enums/transformation-type.enum.js
  var TransformationType;
  (function(TransformationType2) {
    TransformationType2[TransformationType2["PLAIN_TO_CLASS"] = 0] = "PLAIN_TO_CLASS";
    TransformationType2[TransformationType2["CLASS_TO_PLAIN"] = 1] = "CLASS_TO_PLAIN";
    TransformationType2[TransformationType2["CLASS_TO_CLASS"] = 2] = "CLASS_TO_CLASS";
  })(TransformationType || (TransformationType = {}));

  // node_modules/.pnpm/class-transformer@0.5.1/node_modules/class-transformer/esm5/MetadataStorage.js
  var MetadataStorage = (
    /** @class */
    (function() {
      function MetadataStorage3() {
        this._typeMetadatas = /* @__PURE__ */ new Map();
        this._transformMetadatas = /* @__PURE__ */ new Map();
        this._exposeMetadatas = /* @__PURE__ */ new Map();
        this._excludeMetadatas = /* @__PURE__ */ new Map();
        this._ancestorsMap = /* @__PURE__ */ new Map();
      }
      MetadataStorage3.prototype.addTypeMetadata = function(metadata) {
        if (!this._typeMetadatas.has(metadata.target)) {
          this._typeMetadatas.set(metadata.target, /* @__PURE__ */ new Map());
        }
        this._typeMetadatas.get(metadata.target).set(metadata.propertyName, metadata);
      };
      MetadataStorage3.prototype.addTransformMetadata = function(metadata) {
        if (!this._transformMetadatas.has(metadata.target)) {
          this._transformMetadatas.set(metadata.target, /* @__PURE__ */ new Map());
        }
        if (!this._transformMetadatas.get(metadata.target).has(metadata.propertyName)) {
          this._transformMetadatas.get(metadata.target).set(metadata.propertyName, []);
        }
        this._transformMetadatas.get(metadata.target).get(metadata.propertyName).push(metadata);
      };
      MetadataStorage3.prototype.addExposeMetadata = function(metadata) {
        if (!this._exposeMetadatas.has(metadata.target)) {
          this._exposeMetadatas.set(metadata.target, /* @__PURE__ */ new Map());
        }
        this._exposeMetadatas.get(metadata.target).set(metadata.propertyName, metadata);
      };
      MetadataStorage3.prototype.addExcludeMetadata = function(metadata) {
        if (!this._excludeMetadatas.has(metadata.target)) {
          this._excludeMetadatas.set(metadata.target, /* @__PURE__ */ new Map());
        }
        this._excludeMetadatas.get(metadata.target).set(metadata.propertyName, metadata);
      };
      MetadataStorage3.prototype.findTransformMetadatas = function(target, propertyName, transformationType) {
        return this.findMetadatas(this._transformMetadatas, target, propertyName).filter(function(metadata) {
          if (!metadata.options)
            return true;
          if (metadata.options.toClassOnly === true && metadata.options.toPlainOnly === true)
            return true;
          if (metadata.options.toClassOnly === true) {
            return transformationType === TransformationType.CLASS_TO_CLASS || transformationType === TransformationType.PLAIN_TO_CLASS;
          }
          if (metadata.options.toPlainOnly === true) {
            return transformationType === TransformationType.CLASS_TO_PLAIN;
          }
          return true;
        });
      };
      MetadataStorage3.prototype.findExcludeMetadata = function(target, propertyName) {
        return this.findMetadata(this._excludeMetadatas, target, propertyName);
      };
      MetadataStorage3.prototype.findExposeMetadata = function(target, propertyName) {
        return this.findMetadata(this._exposeMetadatas, target, propertyName);
      };
      MetadataStorage3.prototype.findExposeMetadataByCustomName = function(target, name) {
        return this.getExposedMetadatas(target).find(function(metadata) {
          return metadata.options && metadata.options.name === name;
        });
      };
      MetadataStorage3.prototype.findTypeMetadata = function(target, propertyName) {
        return this.findMetadata(this._typeMetadatas, target, propertyName);
      };
      MetadataStorage3.prototype.getStrategy = function(target) {
        var excludeMap = this._excludeMetadatas.get(target);
        var exclude = excludeMap && excludeMap.get(void 0);
        var exposeMap = this._exposeMetadatas.get(target);
        var expose = exposeMap && exposeMap.get(void 0);
        if (exclude && expose || !exclude && !expose)
          return "none";
        return exclude ? "excludeAll" : "exposeAll";
      };
      MetadataStorage3.prototype.getExposedMetadatas = function(target) {
        return this.getMetadata(this._exposeMetadatas, target);
      };
      MetadataStorage3.prototype.getExcludedMetadatas = function(target) {
        return this.getMetadata(this._excludeMetadatas, target);
      };
      MetadataStorage3.prototype.getExposedProperties = function(target, transformationType) {
        return this.getExposedMetadatas(target).filter(function(metadata) {
          if (!metadata.options)
            return true;
          if (metadata.options.toClassOnly === true && metadata.options.toPlainOnly === true)
            return true;
          if (metadata.options.toClassOnly === true) {
            return transformationType === TransformationType.CLASS_TO_CLASS || transformationType === TransformationType.PLAIN_TO_CLASS;
          }
          if (metadata.options.toPlainOnly === true) {
            return transformationType === TransformationType.CLASS_TO_PLAIN;
          }
          return true;
        }).map(function(metadata) {
          return metadata.propertyName;
        });
      };
      MetadataStorage3.prototype.getExcludedProperties = function(target, transformationType) {
        return this.getExcludedMetadatas(target).filter(function(metadata) {
          if (!metadata.options)
            return true;
          if (metadata.options.toClassOnly === true && metadata.options.toPlainOnly === true)
            return true;
          if (metadata.options.toClassOnly === true) {
            return transformationType === TransformationType.CLASS_TO_CLASS || transformationType === TransformationType.PLAIN_TO_CLASS;
          }
          if (metadata.options.toPlainOnly === true) {
            return transformationType === TransformationType.CLASS_TO_PLAIN;
          }
          return true;
        }).map(function(metadata) {
          return metadata.propertyName;
        });
      };
      MetadataStorage3.prototype.clear = function() {
        this._typeMetadatas.clear();
        this._exposeMetadatas.clear();
        this._excludeMetadatas.clear();
        this._ancestorsMap.clear();
      };
      MetadataStorage3.prototype.getMetadata = function(metadatas, target) {
        var metadataFromTargetMap = metadatas.get(target);
        var metadataFromTarget;
        if (metadataFromTargetMap) {
          metadataFromTarget = Array.from(metadataFromTargetMap.values()).filter(function(meta) {
            return meta.propertyName !== void 0;
          });
        }
        var metadataFromAncestors = [];
        for (var _i = 0, _a = this.getAncestors(target); _i < _a.length; _i++) {
          var ancestor = _a[_i];
          var ancestorMetadataMap = metadatas.get(ancestor);
          if (ancestorMetadataMap) {
            var metadataFromAncestor = Array.from(ancestorMetadataMap.values()).filter(function(meta) {
              return meta.propertyName !== void 0;
            });
            metadataFromAncestors.push.apply(metadataFromAncestors, metadataFromAncestor);
          }
        }
        return metadataFromAncestors.concat(metadataFromTarget || []);
      };
      MetadataStorage3.prototype.findMetadata = function(metadatas, target, propertyName) {
        var metadataFromTargetMap = metadatas.get(target);
        if (metadataFromTargetMap) {
          var metadataFromTarget = metadataFromTargetMap.get(propertyName);
          if (metadataFromTarget) {
            return metadataFromTarget;
          }
        }
        for (var _i = 0, _a = this.getAncestors(target); _i < _a.length; _i++) {
          var ancestor = _a[_i];
          var ancestorMetadataMap = metadatas.get(ancestor);
          if (ancestorMetadataMap) {
            var ancestorResult = ancestorMetadataMap.get(propertyName);
            if (ancestorResult) {
              return ancestorResult;
            }
          }
        }
        return void 0;
      };
      MetadataStorage3.prototype.findMetadatas = function(metadatas, target, propertyName) {
        var metadataFromTargetMap = metadatas.get(target);
        var metadataFromTarget;
        if (metadataFromTargetMap) {
          metadataFromTarget = metadataFromTargetMap.get(propertyName);
        }
        var metadataFromAncestorsTarget = [];
        for (var _i = 0, _a = this.getAncestors(target); _i < _a.length; _i++) {
          var ancestor = _a[_i];
          var ancestorMetadataMap = metadatas.get(ancestor);
          if (ancestorMetadataMap) {
            if (ancestorMetadataMap.has(propertyName)) {
              metadataFromAncestorsTarget.push.apply(metadataFromAncestorsTarget, ancestorMetadataMap.get(propertyName));
            }
          }
        }
        return metadataFromAncestorsTarget.slice().reverse().concat((metadataFromTarget || []).slice().reverse());
      };
      MetadataStorage3.prototype.getAncestors = function(target) {
        if (!target)
          return [];
        if (!this._ancestorsMap.has(target)) {
          var ancestors = [];
          for (var baseClass = Object.getPrototypeOf(target.prototype.constructor); typeof baseClass.prototype !== "undefined"; baseClass = Object.getPrototypeOf(baseClass.prototype.constructor)) {
            ancestors.push(baseClass);
          }
          this._ancestorsMap.set(target, ancestors);
        }
        return this._ancestorsMap.get(target);
      };
      return MetadataStorage3;
    })()
  );

  // node_modules/.pnpm/class-transformer@0.5.1/node_modules/class-transformer/esm5/storage.js
  var defaultMetadataStorage = new MetadataStorage();

  // node_modules/.pnpm/class-transformer@0.5.1/node_modules/class-transformer/esm5/utils/get-global.util.js
  function getGlobal() {
    if (typeof globalThis !== "undefined") {
      return globalThis;
    }
    if (typeof global !== "undefined") {
      return global;
    }
    if (typeof window !== "undefined") {
      return window;
    }
    if (typeof self !== "undefined") {
      return self;
    }
  }

  // node_modules/.pnpm/class-transformer@0.5.1/node_modules/class-transformer/esm5/utils/is-promise.util.js
  function isPromise(p) {
    return p !== null && typeof p === "object" && typeof p.then === "function";
  }

  // node_modules/.pnpm/class-transformer@0.5.1/node_modules/class-transformer/esm5/TransformOperationExecutor.js
  var __spreadArray = function(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  function instantiateArrayType(arrayType) {
    var array = new arrayType();
    if (!(array instanceof Set) && !("push" in array)) {
      return [];
    }
    return array;
  }
  var TransformOperationExecutor = (
    /** @class */
    (function() {
      function TransformOperationExecutor2(transformationType, options) {
        this.transformationType = transformationType;
        this.options = options;
        this.recursionStack = /* @__PURE__ */ new Set();
      }
      TransformOperationExecutor2.prototype.transform = function(source, value, targetType, arrayType, isMap, level) {
        var _this = this;
        if (level === void 0) {
          level = 0;
        }
        if (Array.isArray(value) || value instanceof Set) {
          var newValue_1 = arrayType && this.transformationType === TransformationType.PLAIN_TO_CLASS ? instantiateArrayType(arrayType) : [];
          value.forEach(function(subValue, index) {
            var subSource = source ? source[index] : void 0;
            if (!_this.options.enableCircularCheck || !_this.isCircular(subValue)) {
              var realTargetType = void 0;
              if (typeof targetType !== "function" && targetType && targetType.options && targetType.options.discriminator && targetType.options.discriminator.property && targetType.options.discriminator.subTypes) {
                if (_this.transformationType === TransformationType.PLAIN_TO_CLASS) {
                  realTargetType = targetType.options.discriminator.subTypes.find(function(subType) {
                    return subType.name === subValue[targetType.options.discriminator.property];
                  });
                  var options = { newObject: newValue_1, object: subValue, property: void 0 };
                  var newType = targetType.typeFunction(options);
                  realTargetType === void 0 ? realTargetType = newType : realTargetType = realTargetType.value;
                  if (!targetType.options.keepDiscriminatorProperty)
                    delete subValue[targetType.options.discriminator.property];
                }
                if (_this.transformationType === TransformationType.CLASS_TO_CLASS) {
                  realTargetType = subValue.constructor;
                }
                if (_this.transformationType === TransformationType.CLASS_TO_PLAIN) {
                  subValue[targetType.options.discriminator.property] = targetType.options.discriminator.subTypes.find(function(subType) {
                    return subType.value === subValue.constructor;
                  }).name;
                }
              } else {
                realTargetType = targetType;
              }
              var value_1 = _this.transform(subSource, subValue, realTargetType, void 0, subValue instanceof Map, level + 1);
              if (newValue_1 instanceof Set) {
                newValue_1.add(value_1);
              } else {
                newValue_1.push(value_1);
              }
            } else if (_this.transformationType === TransformationType.CLASS_TO_CLASS) {
              if (newValue_1 instanceof Set) {
                newValue_1.add(subValue);
              } else {
                newValue_1.push(subValue);
              }
            }
          });
          return newValue_1;
        } else if (targetType === String && !isMap) {
          if (value === null || value === void 0)
            return value;
          return String(value);
        } else if (targetType === Number && !isMap) {
          if (value === null || value === void 0)
            return value;
          return Number(value);
        } else if (targetType === Boolean && !isMap) {
          if (value === null || value === void 0)
            return value;
          return Boolean(value);
        } else if ((targetType === Date || value instanceof Date) && !isMap) {
          if (value instanceof Date) {
            return new Date(value.valueOf());
          }
          if (value === null || value === void 0)
            return value;
          return new Date(value);
        } else if (!!getGlobal().Buffer && (targetType === Buffer || value instanceof Buffer) && !isMap) {
          if (value === null || value === void 0)
            return value;
          return Buffer.from(value);
        } else if (isPromise(value) && !isMap) {
          return new Promise(function(resolve, reject) {
            value.then(function(data) {
              return resolve(_this.transform(void 0, data, targetType, void 0, void 0, level + 1));
            }, reject);
          });
        } else if (!isMap && value !== null && typeof value === "object" && typeof value.then === "function") {
          return value;
        } else if (typeof value === "object" && value !== null) {
          if (!targetType && value.constructor !== Object)
            if (!Array.isArray(value) && value.constructor === Array) {
            } else {
              targetType = value.constructor;
            }
          if (!targetType && source)
            targetType = source.constructor;
          if (this.options.enableCircularCheck) {
            this.recursionStack.add(value);
          }
          var keys = this.getKeys(targetType, value, isMap);
          var newValue = source ? source : {};
          if (!source && (this.transformationType === TransformationType.PLAIN_TO_CLASS || this.transformationType === TransformationType.CLASS_TO_CLASS)) {
            if (isMap) {
              newValue = /* @__PURE__ */ new Map();
            } else if (targetType) {
              newValue = new targetType();
            } else {
              newValue = {};
            }
          }
          var _loop_1 = function(key2) {
            if (key2 === "__proto__" || key2 === "constructor") {
              return "continue";
            }
            var valueKey = key2;
            var newValueKey = key2, propertyName = key2;
            if (!this_1.options.ignoreDecorators && targetType) {
              if (this_1.transformationType === TransformationType.PLAIN_TO_CLASS) {
                var exposeMetadata = defaultMetadataStorage.findExposeMetadataByCustomName(targetType, key2);
                if (exposeMetadata) {
                  propertyName = exposeMetadata.propertyName;
                  newValueKey = exposeMetadata.propertyName;
                }
              } else if (this_1.transformationType === TransformationType.CLASS_TO_PLAIN || this_1.transformationType === TransformationType.CLASS_TO_CLASS) {
                var exposeMetadata = defaultMetadataStorage.findExposeMetadata(targetType, key2);
                if (exposeMetadata && exposeMetadata.options && exposeMetadata.options.name) {
                  newValueKey = exposeMetadata.options.name;
                }
              }
            }
            var subValue = void 0;
            if (this_1.transformationType === TransformationType.PLAIN_TO_CLASS) {
              subValue = value[valueKey];
            } else {
              if (value instanceof Map) {
                subValue = value.get(valueKey);
              } else if (value[valueKey] instanceof Function) {
                subValue = value[valueKey]();
              } else {
                subValue = value[valueKey];
              }
            }
            var type = void 0, isSubValueMap = subValue instanceof Map;
            if (targetType && isMap) {
              type = targetType;
            } else if (targetType) {
              var metadata_1 = defaultMetadataStorage.findTypeMetadata(targetType, propertyName);
              if (metadata_1) {
                var options = { newObject: newValue, object: value, property: propertyName };
                var newType = metadata_1.typeFunction ? metadata_1.typeFunction(options) : metadata_1.reflectedType;
                if (metadata_1.options && metadata_1.options.discriminator && metadata_1.options.discriminator.property && metadata_1.options.discriminator.subTypes) {
                  if (!(value[valueKey] instanceof Array)) {
                    if (this_1.transformationType === TransformationType.PLAIN_TO_CLASS) {
                      type = metadata_1.options.discriminator.subTypes.find(function(subType) {
                        if (subValue && subValue instanceof Object && metadata_1.options.discriminator.property in subValue) {
                          return subType.name === subValue[metadata_1.options.discriminator.property];
                        }
                      });
                      type === void 0 ? type = newType : type = type.value;
                      if (!metadata_1.options.keepDiscriminatorProperty) {
                        if (subValue && subValue instanceof Object && metadata_1.options.discriminator.property in subValue) {
                          delete subValue[metadata_1.options.discriminator.property];
                        }
                      }
                    }
                    if (this_1.transformationType === TransformationType.CLASS_TO_CLASS) {
                      type = subValue.constructor;
                    }
                    if (this_1.transformationType === TransformationType.CLASS_TO_PLAIN) {
                      if (subValue) {
                        subValue[metadata_1.options.discriminator.property] = metadata_1.options.discriminator.subTypes.find(function(subType) {
                          return subType.value === subValue.constructor;
                        }).name;
                      }
                    }
                  } else {
                    type = metadata_1;
                  }
                } else {
                  type = newType;
                }
                isSubValueMap = isSubValueMap || metadata_1.reflectedType === Map;
              } else if (this_1.options.targetMaps) {
                this_1.options.targetMaps.filter(function(map) {
                  return map.target === targetType && !!map.properties[propertyName];
                }).forEach(function(map) {
                  return type = map.properties[propertyName];
                });
              } else if (this_1.options.enableImplicitConversion && this_1.transformationType === TransformationType.PLAIN_TO_CLASS) {
                var reflectedType = Reflect.getMetadata("design:type", targetType.prototype, propertyName);
                if (reflectedType) {
                  type = reflectedType;
                }
              }
            }
            var arrayType_1 = Array.isArray(value[valueKey]) ? this_1.getReflectedType(targetType, propertyName) : void 0;
            var subSource = source ? source[valueKey] : void 0;
            if (newValue.constructor.prototype) {
              var descriptor = Object.getOwnPropertyDescriptor(newValue.constructor.prototype, newValueKey);
              if ((this_1.transformationType === TransformationType.PLAIN_TO_CLASS || this_1.transformationType === TransformationType.CLASS_TO_CLASS) && // eslint-disable-next-line @typescript-eslint/unbound-method
              (descriptor && !descriptor.set || newValue[newValueKey] instanceof Function))
                return "continue";
            }
            if (!this_1.options.enableCircularCheck || !this_1.isCircular(subValue)) {
              var transformKey = this_1.transformationType === TransformationType.PLAIN_TO_CLASS ? newValueKey : key2;
              var finalValue = void 0;
              if (this_1.transformationType === TransformationType.CLASS_TO_PLAIN) {
                finalValue = value[transformKey];
                finalValue = this_1.applyCustomTransformations(finalValue, targetType, transformKey, value, this_1.transformationType);
                finalValue = value[transformKey] === finalValue ? subValue : finalValue;
                finalValue = this_1.transform(subSource, finalValue, type, arrayType_1, isSubValueMap, level + 1);
              } else {
                if (subValue === void 0 && this_1.options.exposeDefaultValues) {
                  finalValue = newValue[newValueKey];
                } else {
                  finalValue = this_1.transform(subSource, subValue, type, arrayType_1, isSubValueMap, level + 1);
                  finalValue = this_1.applyCustomTransformations(finalValue, targetType, transformKey, value, this_1.transformationType);
                }
              }
              if (finalValue !== void 0 || this_1.options.exposeUnsetFields) {
                if (newValue instanceof Map) {
                  newValue.set(newValueKey, finalValue);
                } else {
                  newValue[newValueKey] = finalValue;
                }
              }
            } else if (this_1.transformationType === TransformationType.CLASS_TO_CLASS) {
              var finalValue = subValue;
              finalValue = this_1.applyCustomTransformations(finalValue, targetType, key2, value, this_1.transformationType);
              if (finalValue !== void 0 || this_1.options.exposeUnsetFields) {
                if (newValue instanceof Map) {
                  newValue.set(newValueKey, finalValue);
                } else {
                  newValue[newValueKey] = finalValue;
                }
              }
            }
          };
          var this_1 = this;
          for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            _loop_1(key);
          }
          if (this.options.enableCircularCheck) {
            this.recursionStack.delete(value);
          }
          return newValue;
        } else {
          return value;
        }
      };
      TransformOperationExecutor2.prototype.applyCustomTransformations = function(value, target, key, obj, transformationType) {
        var _this = this;
        var metadatas = defaultMetadataStorage.findTransformMetadatas(target, key, this.transformationType);
        if (this.options.version !== void 0) {
          metadatas = metadatas.filter(function(metadata) {
            if (!metadata.options)
              return true;
            return _this.checkVersion(metadata.options.since, metadata.options.until);
          });
        }
        if (this.options.groups && this.options.groups.length) {
          metadatas = metadatas.filter(function(metadata) {
            if (!metadata.options)
              return true;
            return _this.checkGroups(metadata.options.groups);
          });
        } else {
          metadatas = metadatas.filter(function(metadata) {
            return !metadata.options || !metadata.options.groups || !metadata.options.groups.length;
          });
        }
        metadatas.forEach(function(metadata) {
          value = metadata.transformFn({ value, key, obj, type: transformationType, options: _this.options });
        });
        return value;
      };
      TransformOperationExecutor2.prototype.isCircular = function(object) {
        return this.recursionStack.has(object);
      };
      TransformOperationExecutor2.prototype.getReflectedType = function(target, propertyName) {
        if (!target)
          return void 0;
        var meta = defaultMetadataStorage.findTypeMetadata(target, propertyName);
        return meta ? meta.reflectedType : void 0;
      };
      TransformOperationExecutor2.prototype.getKeys = function(target, object, isMap) {
        var _this = this;
        var strategy = defaultMetadataStorage.getStrategy(target);
        if (strategy === "none")
          strategy = this.options.strategy || "exposeAll";
        var keys = [];
        if (strategy === "exposeAll" || isMap) {
          if (object instanceof Map) {
            keys = Array.from(object.keys());
          } else {
            keys = Object.keys(object);
          }
        }
        if (isMap) {
          return keys;
        }
        if (this.options.ignoreDecorators && this.options.excludeExtraneousValues && target) {
          var exposedProperties = defaultMetadataStorage.getExposedProperties(target, this.transformationType);
          var excludedProperties = defaultMetadataStorage.getExcludedProperties(target, this.transformationType);
          keys = __spreadArray(__spreadArray([], exposedProperties, true), excludedProperties, true);
        }
        if (!this.options.ignoreDecorators && target) {
          var exposedProperties = defaultMetadataStorage.getExposedProperties(target, this.transformationType);
          if (this.transformationType === TransformationType.PLAIN_TO_CLASS) {
            exposedProperties = exposedProperties.map(function(key) {
              var exposeMetadata = defaultMetadataStorage.findExposeMetadata(target, key);
              if (exposeMetadata && exposeMetadata.options && exposeMetadata.options.name) {
                return exposeMetadata.options.name;
              }
              return key;
            });
          }
          if (this.options.excludeExtraneousValues) {
            keys = exposedProperties;
          } else {
            keys = keys.concat(exposedProperties);
          }
          var excludedProperties_1 = defaultMetadataStorage.getExcludedProperties(target, this.transformationType);
          if (excludedProperties_1.length > 0) {
            keys = keys.filter(function(key) {
              return !excludedProperties_1.includes(key);
            });
          }
          if (this.options.version !== void 0) {
            keys = keys.filter(function(key) {
              var exposeMetadata = defaultMetadataStorage.findExposeMetadata(target, key);
              if (!exposeMetadata || !exposeMetadata.options)
                return true;
              return _this.checkVersion(exposeMetadata.options.since, exposeMetadata.options.until);
            });
          }
          if (this.options.groups && this.options.groups.length) {
            keys = keys.filter(function(key) {
              var exposeMetadata = defaultMetadataStorage.findExposeMetadata(target, key);
              if (!exposeMetadata || !exposeMetadata.options)
                return true;
              return _this.checkGroups(exposeMetadata.options.groups);
            });
          } else {
            keys = keys.filter(function(key) {
              var exposeMetadata = defaultMetadataStorage.findExposeMetadata(target, key);
              return !exposeMetadata || !exposeMetadata.options || !exposeMetadata.options.groups || !exposeMetadata.options.groups.length;
            });
          }
        }
        if (this.options.excludePrefixes && this.options.excludePrefixes.length) {
          keys = keys.filter(function(key) {
            return _this.options.excludePrefixes.every(function(prefix) {
              return key.substr(0, prefix.length) !== prefix;
            });
          });
        }
        keys = keys.filter(function(key, index, self2) {
          return self2.indexOf(key) === index;
        });
        return keys;
      };
      TransformOperationExecutor2.prototype.checkVersion = function(since, until) {
        var decision = true;
        if (decision && since)
          decision = this.options.version >= since;
        if (decision && until)
          decision = this.options.version < until;
        return decision;
      };
      TransformOperationExecutor2.prototype.checkGroups = function(groups) {
        if (!groups)
          return true;
        return this.options.groups.some(function(optionGroup) {
          return groups.includes(optionGroup);
        });
      };
      return TransformOperationExecutor2;
    })()
  );

  // node_modules/.pnpm/class-transformer@0.5.1/node_modules/class-transformer/esm5/constants/default-options.constant.js
  var defaultOptions = {
    enableCircularCheck: false,
    enableImplicitConversion: false,
    excludeExtraneousValues: false,
    excludePrefixes: void 0,
    exposeDefaultValues: false,
    exposeUnsetFields: true,
    groups: void 0,
    ignoreDecorators: false,
    strategy: void 0,
    targetMaps: void 0,
    version: void 0
  };

  // node_modules/.pnpm/class-transformer@0.5.1/node_modules/class-transformer/esm5/ClassTransformer.js
  var __assign = function() {
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
  var ClassTransformer = (
    /** @class */
    (function() {
      function ClassTransformer2() {
      }
      ClassTransformer2.prototype.instanceToPlain = function(object, options) {
        var executor = new TransformOperationExecutor(TransformationType.CLASS_TO_PLAIN, __assign(__assign({}, defaultOptions), options));
        return executor.transform(void 0, object, void 0, void 0, void 0, void 0);
      };
      ClassTransformer2.prototype.classToPlainFromExist = function(object, plainObject, options) {
        var executor = new TransformOperationExecutor(TransformationType.CLASS_TO_PLAIN, __assign(__assign({}, defaultOptions), options));
        return executor.transform(plainObject, object, void 0, void 0, void 0, void 0);
      };
      ClassTransformer2.prototype.plainToInstance = function(cls, plain, options) {
        var executor = new TransformOperationExecutor(TransformationType.PLAIN_TO_CLASS, __assign(__assign({}, defaultOptions), options));
        return executor.transform(void 0, plain, cls, void 0, void 0, void 0);
      };
      ClassTransformer2.prototype.plainToClassFromExist = function(clsObject, plain, options) {
        var executor = new TransformOperationExecutor(TransformationType.PLAIN_TO_CLASS, __assign(__assign({}, defaultOptions), options));
        return executor.transform(clsObject, plain, void 0, void 0, void 0, void 0);
      };
      ClassTransformer2.prototype.instanceToInstance = function(object, options) {
        var executor = new TransformOperationExecutor(TransformationType.CLASS_TO_CLASS, __assign(__assign({}, defaultOptions), options));
        return executor.transform(void 0, object, void 0, void 0, void 0, void 0);
      };
      ClassTransformer2.prototype.classToClassFromExist = function(object, fromObject, options) {
        var executor = new TransformOperationExecutor(TransformationType.CLASS_TO_CLASS, __assign(__assign({}, defaultOptions), options));
        return executor.transform(fromObject, object, void 0, void 0, void 0, void 0);
      };
      ClassTransformer2.prototype.serialize = function(object, options) {
        return JSON.stringify(this.instanceToPlain(object, options));
      };
      ClassTransformer2.prototype.deserialize = function(cls, json, options) {
        var jsonObject = JSON.parse(json);
        return this.plainToInstance(cls, jsonObject, options);
      };
      ClassTransformer2.prototype.deserializeArray = function(cls, json, options) {
        var jsonObject = JSON.parse(json);
        return this.plainToInstance(cls, jsonObject, options);
      };
      return ClassTransformer2;
    })()
  );

  // node_modules/.pnpm/class-transformer@0.5.1/node_modules/class-transformer/esm5/index.js
  var classTransformer = new ClassTransformer();
  function plainToInstance(cls, plain, options) {
    return classTransformer.plainToInstance(cls, plain, options);
  }

  // node_modules/.pnpm/class-validator@0.14.4/node_modules/class-validator/esm5/metadata/ValidationMetadata.js
  var ValidationMetadata = (
    /** @class */
    /* @__PURE__ */ (function() {
      function ValidationMetadata2(args) {
        this.groups = [];
        this.each = false;
        this.context = void 0;
        this.type = args.type;
        this.name = args.name;
        this.target = args.target;
        this.propertyName = args.propertyName;
        this.constraints = args === null || args === void 0 ? void 0 : args.constraints;
        this.constraintCls = args.constraintCls;
        this.validationTypeOptions = args.validationTypeOptions;
        if (args.validationOptions) {
          this.message = args.validationOptions.message;
          this.groups = args.validationOptions.groups;
          this.always = args.validationOptions.always;
          this.each = args.validationOptions.each;
          this.context = args.validationOptions.context;
        }
      }
      return ValidationMetadata2;
    })()
  );

  // node_modules/.pnpm/class-validator@0.14.4/node_modules/class-validator/esm5/validation-schema/ValidationSchemaToMetadataTransformer.js
  var ValidationSchemaToMetadataTransformer = (
    /** @class */
    (function() {
      function ValidationSchemaToMetadataTransformer2() {
      }
      ValidationSchemaToMetadataTransformer2.prototype.transform = function(schema) {
        var metadatas = [];
        Object.keys(schema.properties).forEach(function(property) {
          schema.properties[property].forEach(function(validation) {
            var validationOptions = {
              message: validation.message,
              groups: validation.groups,
              always: validation.always,
              each: validation.each
            };
            var args = {
              type: validation.type,
              name: validation.name,
              target: schema.name,
              propertyName: property,
              constraints: validation.constraints,
              validationTypeOptions: validation.options,
              validationOptions
            };
            metadatas.push(new ValidationMetadata(args));
          });
        });
        return metadatas;
      };
      return ValidationSchemaToMetadataTransformer2;
    })()
  );

  // node_modules/.pnpm/class-validator@0.14.4/node_modules/class-validator/esm5/utils/convert-to-array.util.js
  function convertToArray(val) {
    if (val instanceof Map) {
      return Array.from(val.values());
    }
    return Array.isArray(val) ? val : Array.from(val);
  }

  // node_modules/.pnpm/class-validator@0.14.4/node_modules/class-validator/esm5/utils/get-global.util.js
  function getGlobal2() {
    if (typeof globalThis !== "undefined") {
      return globalThis;
    }
    if (typeof global !== "undefined") {
      return global;
    }
    if (typeof window !== "undefined") {
      return window;
    }
    if (typeof self !== "undefined") {
      return self;
    }
  }

  // node_modules/.pnpm/class-validator@0.14.4/node_modules/class-validator/esm5/utils/is-promise.util.js
  function isPromise2(p) {
    return p !== null && typeof p === "object" && typeof p.then === "function";
  }

  // node_modules/.pnpm/class-validator@0.14.4/node_modules/class-validator/esm5/metadata/MetadataStorage.js
  var __values = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var __read = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray2 = function(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var MetadataStorage2 = (
    /** @class */
    (function() {
      function MetadataStorage3() {
        this.validationMetadatas = /* @__PURE__ */ new Map();
        this.constraintMetadatas = /* @__PURE__ */ new Map();
      }
      Object.defineProperty(MetadataStorage3.prototype, "hasValidationMetaData", {
        get: function() {
          return !!this.validationMetadatas.size;
        },
        enumerable: false,
        configurable: true
      });
      MetadataStorage3.prototype.addValidationSchema = function(schema) {
        var _this = this;
        var validationMetadatas = new ValidationSchemaToMetadataTransformer().transform(schema);
        validationMetadatas.forEach(function(validationMetadata) {
          return _this.addValidationMetadata(validationMetadata);
        });
      };
      MetadataStorage3.prototype.addValidationMetadata = function(metadata) {
        var existingMetadata = this.validationMetadatas.get(metadata.target);
        if (existingMetadata) {
          existingMetadata.push(metadata);
        } else {
          this.validationMetadatas.set(metadata.target, [metadata]);
        }
      };
      MetadataStorage3.prototype.addConstraintMetadata = function(metadata) {
        var existingMetadata = this.constraintMetadatas.get(metadata.target);
        if (existingMetadata) {
          existingMetadata.push(metadata);
        } else {
          this.constraintMetadatas.set(metadata.target, [metadata]);
        }
      };
      MetadataStorage3.prototype.groupByPropertyName = function(metadata) {
        var grouped = {};
        metadata.forEach(function(metadata2) {
          if (!grouped[metadata2.propertyName])
            grouped[metadata2.propertyName] = [];
          grouped[metadata2.propertyName].push(metadata2);
        });
        return grouped;
      };
      MetadataStorage3.prototype.getTargetValidationMetadatas = function(targetConstructor, targetSchema, always, strictGroups, groups) {
        var e_1, _a;
        var includeMetadataBecauseOfAlwaysOption = function(metadata) {
          if (typeof metadata.always !== "undefined")
            return metadata.always;
          if (metadata.groups && metadata.groups.length)
            return false;
          return always;
        };
        var excludeMetadataBecauseOfStrictGroupsOption = function(metadata) {
          if (strictGroups) {
            if (!groups || !groups.length) {
              if (metadata.groups && metadata.groups.length)
                return true;
            }
          }
          return false;
        };
        var filteredForOriginalMetadatasSearch = this.validationMetadatas.get(targetConstructor) || [];
        var originalMetadatas = filteredForOriginalMetadatasSearch.filter(function(metadata) {
          if (metadata.target !== targetConstructor && metadata.target !== targetSchema)
            return false;
          if (includeMetadataBecauseOfAlwaysOption(metadata))
            return true;
          if (excludeMetadataBecauseOfStrictGroupsOption(metadata))
            return false;
          if (groups && groups.length > 0)
            return metadata.groups && !!metadata.groups.find(function(group) {
              return groups.indexOf(group) !== -1;
            });
          return true;
        });
        var filteredForInheritedMetadatasSearch = [];
        try {
          for (var _b = __values(this.validationMetadatas.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
            if (targetConstructor.prototype instanceof key) {
              filteredForInheritedMetadatasSearch.push.apply(filteredForInheritedMetadatasSearch, __spreadArray2([], __read(value), false));
            }
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
        var inheritedMetadatas = filteredForInheritedMetadatasSearch.filter(function(metadata) {
          if (typeof metadata.target === "string")
            return false;
          if (metadata.target === targetConstructor)
            return false;
          if (metadata.target instanceof Function && !(targetConstructor.prototype instanceof metadata.target))
            return false;
          if (includeMetadataBecauseOfAlwaysOption(metadata))
            return true;
          if (excludeMetadataBecauseOfStrictGroupsOption(metadata))
            return false;
          if (groups && groups.length > 0)
            return metadata.groups && !!metadata.groups.find(function(group) {
              return groups.indexOf(group) !== -1;
            });
          return true;
        });
        var uniqueInheritedMetadatas = inheritedMetadatas.filter(function(inheritedMetadata) {
          return !originalMetadatas.find(function(originalMetadata) {
            return originalMetadata.propertyName === inheritedMetadata.propertyName && originalMetadata.type === inheritedMetadata.type;
          });
        });
        return originalMetadatas.concat(uniqueInheritedMetadatas);
      };
      MetadataStorage3.prototype.getTargetValidatorConstraints = function(target) {
        return this.constraintMetadatas.get(target) || [];
      };
      return MetadataStorage3;
    })()
  );
  function getMetadataStorage() {
    var global2 = getGlobal2();
    if (!global2.classValidatorMetadataStorage) {
      global2.classValidatorMetadataStorage = new MetadataStorage2();
    }
    return global2.classValidatorMetadataStorage;
  }

  // node_modules/.pnpm/class-validator@0.14.4/node_modules/class-validator/esm5/validation/ValidationError.js
  var ValidationError = (
    /** @class */
    (function() {
      function ValidationError2() {
      }
      ValidationError2.prototype.toString = function(shouldDecorate, hasParent, parentPath, showConstraintMessages) {
        var _this = this;
        if (shouldDecorate === void 0) {
          shouldDecorate = false;
        }
        if (hasParent === void 0) {
          hasParent = false;
        }
        if (parentPath === void 0) {
          parentPath = "";
        }
        if (showConstraintMessages === void 0) {
          showConstraintMessages = false;
        }
        var boldStart = shouldDecorate ? "\x1B[1m" : "";
        var boldEnd = shouldDecorate ? "\x1B[22m" : "";
        var constraintsToString = function() {
          var _a;
          return (showConstraintMessages ? Object.values : Object.keys)((_a = _this.constraints) !== null && _a !== void 0 ? _a : {}).join(", ");
        };
        var propConstraintFailed = function(propertyName) {
          return " - property ".concat(boldStart).concat(parentPath).concat(propertyName).concat(boldEnd, " has failed the following constraints: ").concat(boldStart).concat(constraintsToString()).concat(boldEnd, " \n");
        };
        if (!hasParent) {
          return "An instance of ".concat(boldStart).concat(this.target ? this.target.constructor.name : "an object").concat(boldEnd, " has failed the validation:\n") + (this.constraints ? propConstraintFailed(this.property) : "") + (this.children ? this.children.map(function(childError) {
            return childError.toString(shouldDecorate, true, _this.property, showConstraintMessages);
          }).join("") : "");
        } else {
          var formattedProperty_1 = Number.isInteger(+this.property) ? "[".concat(this.property, "]") : "".concat(parentPath ? "." : "").concat(this.property);
          if (this.constraints) {
            return propConstraintFailed(formattedProperty_1);
          } else {
            return this.children ? this.children.map(function(childError) {
              return childError.toString(shouldDecorate, true, "".concat(parentPath).concat(formattedProperty_1), showConstraintMessages);
            }).join("") : "";
          }
        }
      };
      return ValidationError2;
    })()
  );

  // node_modules/.pnpm/class-validator@0.14.4/node_modules/class-validator/esm5/validation/ValidationTypes.js
  var ValidationTypes = (
    /** @class */
    (function() {
      function ValidationTypes2() {
      }
      ValidationTypes2.isValid = function(type) {
        var _this = this;
        return type !== "isValid" && type !== "getMessage" && Object.keys(this).map(function(key) {
          return _this[key];
        }).indexOf(type) !== -1;
      };
      ValidationTypes2.CUSTOM_VALIDATION = "customValidation";
      ValidationTypes2.NESTED_VALIDATION = "nestedValidation";
      ValidationTypes2.PROMISE_VALIDATION = "promiseValidation";
      ValidationTypes2.CONDITIONAL_VALIDATION = "conditionalValidation";
      ValidationTypes2.WHITELIST = "whitelistValidation";
      ValidationTypes2.IS_DEFINED = "isDefined";
      return ValidationTypes2;
    })()
  );

  // node_modules/.pnpm/class-validator@0.14.4/node_modules/class-validator/esm5/validation/ValidationUtils.js
  function constraintToString(constraint) {
    if (Array.isArray(constraint)) {
      return constraint.join(", ");
    }
    if (typeof constraint === "symbol") {
      constraint = constraint.description;
    }
    return "".concat(constraint);
  }
  var ValidationUtils = (
    /** @class */
    (function() {
      function ValidationUtils2() {
      }
      ValidationUtils2.replaceMessageSpecialTokens = function(message, validationArguments) {
        var messageString;
        if (message instanceof Function) {
          messageString = message(validationArguments);
        } else if (typeof message === "string") {
          messageString = message;
        }
        if (messageString && Array.isArray(validationArguments.constraints)) {
          validationArguments.constraints.forEach(function(constraint, index) {
            messageString = messageString.replace(new RegExp("\\$constraint".concat(index + 1), "g"), constraintToString(constraint));
          });
        }
        if (messageString && validationArguments.value !== void 0 && validationArguments.value !== null && ["string", "boolean", "number"].includes(typeof validationArguments.value))
          messageString = messageString.replace(/\$value/g, validationArguments.value);
        if (messageString)
          messageString = messageString.replace(/\$property/g, validationArguments.property);
        if (messageString)
          messageString = messageString.replace(/\$target/g, validationArguments.targetName);
        return messageString;
      };
      return ValidationUtils2;
    })()
  );

  // node_modules/.pnpm/class-validator@0.14.4/node_modules/class-validator/esm5/validation/ValidationExecutor.js
  var __read2 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var ValidationExecutor = (
    /** @class */
    (function() {
      function ValidationExecutor2(validator, validatorOptions) {
        this.validator = validator;
        this.validatorOptions = validatorOptions;
        this.awaitingPromises = [];
        this.ignoreAsyncValidations = false;
        this.metadataStorage = getMetadataStorage();
      }
      ValidationExecutor2.prototype.execute = function(object, targetSchema, validationErrors) {
        var _this = this;
        var _a, _b;
        if (!this.metadataStorage.hasValidationMetaData && ((_a = this.validatorOptions) === null || _a === void 0 ? void 0 : _a.enableDebugMessages) === true) {
          console.warn("No validation metadata found. No validation will be  performed. There are multiple possible reasons:\n  - There may be multiple class-validator versions installed. You will need to flatten your dependencies to fix the issue.\n  - This validation runs before any file with validation decorator was parsed by NodeJS.");
        }
        var groups = this.validatorOptions ? this.validatorOptions.groups : void 0;
        var strictGroups = this.validatorOptions && this.validatorOptions.strictGroups || false;
        var always = this.validatorOptions && this.validatorOptions.always || false;
        var forbidUnknownValues = ((_b = this.validatorOptions) === null || _b === void 0 ? void 0 : _b.forbidUnknownValues) === void 0 || this.validatorOptions.forbidUnknownValues !== false;
        var targetMetadatas = this.metadataStorage.getTargetValidationMetadatas(object.constructor, targetSchema, always, strictGroups, groups);
        var groupedMetadatas = this.metadataStorage.groupByPropertyName(targetMetadatas);
        if (forbidUnknownValues && !targetMetadatas.length) {
          var validationError = new ValidationError();
          if (!this.validatorOptions || !this.validatorOptions.validationError || this.validatorOptions.validationError.target === void 0 || this.validatorOptions.validationError.target === true)
            validationError.target = object;
          validationError.value = void 0;
          validationError.property = void 0;
          validationError.children = [];
          validationError.constraints = { unknownValue: "an unknown value was passed to the validate function" };
          validationErrors.push(validationError);
          return;
        }
        if (this.validatorOptions && this.validatorOptions.whitelist)
          this.whitelist(object, groupedMetadatas, validationErrors);
        Object.keys(groupedMetadatas).forEach(function(propertyName) {
          var value = object[propertyName];
          var definedMetadatas = groupedMetadatas[propertyName].filter(function(metadata) {
            return metadata.type === ValidationTypes.IS_DEFINED;
          });
          var metadatas = groupedMetadatas[propertyName].filter(function(metadata) {
            return metadata.type !== ValidationTypes.IS_DEFINED && metadata.type !== ValidationTypes.WHITELIST;
          });
          if (value instanceof Promise && metadatas.find(function(metadata) {
            return metadata.type === ValidationTypes.PROMISE_VALIDATION;
          })) {
            _this.awaitingPromises.push(value.then(function(resolvedValue) {
              _this.performValidations(object, resolvedValue, propertyName, definedMetadatas, metadatas, validationErrors);
            }));
          } else {
            _this.performValidations(object, value, propertyName, definedMetadatas, metadatas, validationErrors);
          }
        });
      };
      ValidationExecutor2.prototype.whitelist = function(object, groupedMetadatas, validationErrors) {
        var _this = this;
        var notAllowedProperties = [];
        Object.keys(object).forEach(function(propertyName) {
          if (!groupedMetadatas[propertyName] || groupedMetadatas[propertyName].length === 0)
            notAllowedProperties.push(propertyName);
        });
        if (notAllowedProperties.length > 0) {
          if (this.validatorOptions && this.validatorOptions.forbidNonWhitelisted) {
            notAllowedProperties.forEach(function(property) {
              var _a;
              var validationError = _this.generateValidationError(object, object[property], property);
              validationError.constraints = (_a = {}, _a[ValidationTypes.WHITELIST] = "property ".concat(property, " should not exist"), _a);
              validationError.children = void 0;
              validationErrors.push(validationError);
            });
          } else {
            notAllowedProperties.forEach(function(property) {
              return delete object[property];
            });
          }
        }
      };
      ValidationExecutor2.prototype.stripEmptyErrors = function(errors) {
        var _this = this;
        return errors.filter(function(error) {
          if (error.children) {
            error.children = _this.stripEmptyErrors(error.children);
          }
          if (Object.keys(error.constraints).length === 0) {
            if (error.children.length === 0) {
              return false;
            } else {
              delete error.constraints;
            }
          }
          return true;
        });
      };
      ValidationExecutor2.prototype.performValidations = function(object, value, propertyName, definedMetadatas, metadatas, validationErrors) {
        var customValidationMetadatas = metadatas.filter(function(metadata) {
          return metadata.type === ValidationTypes.CUSTOM_VALIDATION;
        });
        var nestedValidationMetadatas = metadatas.filter(function(metadata) {
          return metadata.type === ValidationTypes.NESTED_VALIDATION;
        });
        var conditionalValidationMetadatas = metadatas.filter(function(metadata) {
          return metadata.type === ValidationTypes.CONDITIONAL_VALIDATION;
        });
        var validationError = this.generateValidationError(object, value, propertyName);
        validationErrors.push(validationError);
        var canValidate = this.conditionalValidations(object, value, conditionalValidationMetadatas);
        if (!canValidate) {
          return;
        }
        this.customValidations(object, value, definedMetadatas, validationError);
        this.mapContexts(object, value, definedMetadatas, validationError);
        if (value === void 0 && this.validatorOptions && this.validatorOptions.skipUndefinedProperties === true) {
          return;
        }
        if (value === null && this.validatorOptions && this.validatorOptions.skipNullProperties === true) {
          return;
        }
        if ((value === null || value === void 0) && this.validatorOptions && this.validatorOptions.skipMissingProperties === true) {
          return;
        }
        this.customValidations(object, value, customValidationMetadatas, validationError);
        this.nestedValidations(value, nestedValidationMetadatas, validationError);
        this.mapContexts(object, value, metadatas, validationError);
        this.mapContexts(object, value, customValidationMetadatas, validationError);
      };
      ValidationExecutor2.prototype.generateValidationError = function(object, value, propertyName) {
        var validationError = new ValidationError();
        if (!this.validatorOptions || !this.validatorOptions.validationError || this.validatorOptions.validationError.target === void 0 || this.validatorOptions.validationError.target === true)
          validationError.target = object;
        if (!this.validatorOptions || !this.validatorOptions.validationError || this.validatorOptions.validationError.value === void 0 || this.validatorOptions.validationError.value === true)
          validationError.value = value;
        validationError.property = propertyName;
        validationError.children = [];
        validationError.constraints = {};
        return validationError;
      };
      ValidationExecutor2.prototype.conditionalValidations = function(object, value, metadatas) {
        return metadatas.map(function(metadata) {
          return metadata.constraints[0](object, value);
        }).reduce(function(resultA, resultB) {
          return resultA && resultB;
        }, true);
      };
      ValidationExecutor2.prototype.customValidations = function(object, value, metadatas, error) {
        var _this = this;
        metadatas.forEach(function(metadata) {
          _this.metadataStorage.getTargetValidatorConstraints(metadata.constraintCls).forEach(function(customConstraintMetadata) {
            if (customConstraintMetadata.async && _this.ignoreAsyncValidations)
              return;
            if (_this.validatorOptions && _this.validatorOptions.stopAtFirstError && Object.keys(error.constraints || {}).length > 0)
              return;
            var validationArguments = {
              targetName: object.constructor ? object.constructor.name : void 0,
              property: metadata.propertyName,
              object,
              value,
              constraints: metadata.constraints
            };
            if (!metadata.each || !(Array.isArray(value) || value instanceof Set || value instanceof Map)) {
              var validatedValue = customConstraintMetadata.instance.validate(value, validationArguments);
              if (isPromise2(validatedValue)) {
                var promise = validatedValue.then(function(isValid) {
                  if (!isValid) {
                    var _a2 = __read2(_this.createValidationError(object, value, metadata, customConstraintMetadata), 2), type2 = _a2[0], message2 = _a2[1];
                    error.constraints[type2] = message2;
                    if (metadata.context) {
                      if (!error.contexts) {
                        error.contexts = {};
                      }
                      error.contexts[type2] = Object.assign(error.contexts[type2] || {}, metadata.context);
                    }
                  }
                });
                _this.awaitingPromises.push(promise);
              } else {
                if (!validatedValue) {
                  var _a = __read2(_this.createValidationError(object, value, metadata, customConstraintMetadata), 2), type = _a[0], message = _a[1];
                  error.constraints[type] = message;
                }
              }
              return;
            }
            var arrayValue = convertToArray(value);
            var validatedSubValues = arrayValue.map(function(subValue) {
              return customConstraintMetadata.instance.validate(subValue, validationArguments);
            });
            var validationIsAsync = validatedSubValues.some(function(validatedSubValue) {
              return isPromise2(validatedSubValue);
            });
            if (validationIsAsync) {
              var asyncValidatedSubValues = validatedSubValues.map(function(validatedSubValue) {
                return isPromise2(validatedSubValue) ? validatedSubValue : Promise.resolve(validatedSubValue);
              });
              var asyncValidationIsFinishedPromise = Promise.all(asyncValidatedSubValues).then(function(flatValidatedValues) {
                var validationResult2 = flatValidatedValues.every(function(isValid) {
                  return isValid;
                });
                if (!validationResult2) {
                  var _a2 = __read2(_this.createValidationError(object, value, metadata, customConstraintMetadata), 2), type2 = _a2[0], message2 = _a2[1];
                  error.constraints[type2] = message2;
                  if (metadata.context) {
                    if (!error.contexts) {
                      error.contexts = {};
                    }
                    error.contexts[type2] = Object.assign(error.contexts[type2] || {}, metadata.context);
                  }
                }
              });
              _this.awaitingPromises.push(asyncValidationIsFinishedPromise);
              return;
            }
            var validationResult = validatedSubValues.every(function(isValid) {
              return isValid;
            });
            if (!validationResult) {
              var _b = __read2(_this.createValidationError(object, value, metadata, customConstraintMetadata), 2), type = _b[0], message = _b[1];
              error.constraints[type] = message;
            }
          });
        });
      };
      ValidationExecutor2.prototype.nestedValidations = function(value, metadatas, error) {
        var _this = this;
        if (value === void 0) {
          return;
        }
        metadatas.forEach(function(metadata) {
          if (metadata.type !== ValidationTypes.NESTED_VALIDATION && metadata.type !== ValidationTypes.PROMISE_VALIDATION) {
            return;
          } else if (_this.validatorOptions && _this.validatorOptions.stopAtFirstError && Object.keys(error.constraints || {}).length > 0) {
            return;
          }
          if (Array.isArray(value) || value instanceof Set || value instanceof Map) {
            var arrayLikeValue = value instanceof Set ? Array.from(value) : value;
            arrayLikeValue.forEach(function(subValue, index) {
              _this.performValidations(value, subValue, index.toString(), [], metadatas, error.children);
            });
          } else if (value instanceof Object) {
            var targetSchema = typeof metadata.target === "string" ? metadata.target : metadata.target.name;
            _this.execute(value, targetSchema, error.children);
          } else {
            var _a = __read2(_this.createValidationError(metadata.target, value, metadata), 2), type = _a[0], message = _a[1];
            error.constraints[type] = message;
          }
        });
      };
      ValidationExecutor2.prototype.mapContexts = function(object, value, metadatas, error) {
        var _this = this;
        return metadatas.forEach(function(metadata) {
          if (metadata.context) {
            var customConstraint = void 0;
            if (metadata.type === ValidationTypes.CUSTOM_VALIDATION) {
              var customConstraints = _this.metadataStorage.getTargetValidatorConstraints(metadata.constraintCls);
              customConstraint = customConstraints[0];
            }
            var type = _this.getConstraintType(metadata, customConstraint);
            if (error.constraints[type]) {
              if (!error.contexts) {
                error.contexts = {};
              }
              error.contexts[type] = Object.assign(error.contexts[type] || {}, metadata.context);
            }
          }
        });
      };
      ValidationExecutor2.prototype.createValidationError = function(object, value, metadata, customValidatorMetadata) {
        var targetName = object.constructor ? object.constructor.name : void 0;
        var type = this.getConstraintType(metadata, customValidatorMetadata);
        var validationArguments = {
          targetName,
          property: metadata.propertyName,
          object,
          value,
          constraints: metadata.constraints
        };
        var message = metadata.message || "";
        if (!metadata.message && (!this.validatorOptions || this.validatorOptions && !this.validatorOptions.dismissDefaultMessages)) {
          if (customValidatorMetadata && customValidatorMetadata.instance.defaultMessage instanceof Function) {
            message = customValidatorMetadata.instance.defaultMessage(validationArguments);
          }
        }
        var messageString = ValidationUtils.replaceMessageSpecialTokens(message, validationArguments);
        return [type, messageString];
      };
      ValidationExecutor2.prototype.getConstraintType = function(metadata, customValidatorMetadata) {
        var type = customValidatorMetadata && customValidatorMetadata.name ? customValidatorMetadata.name : metadata.type;
        return type;
      };
      return ValidationExecutor2;
    })()
  );

  // node_modules/.pnpm/class-validator@0.14.4/node_modules/class-validator/esm5/validation/Validator.js
  var __awaiter = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var Validator = (
    /** @class */
    (function() {
      function Validator2() {
      }
      Validator2.prototype.validate = function(objectOrSchemaName, objectOrValidationOptions, maybeValidatorOptions) {
        return this.coreValidate(objectOrSchemaName, objectOrValidationOptions, maybeValidatorOptions);
      };
      Validator2.prototype.validateOrReject = function(objectOrSchemaName, objectOrValidationOptions, maybeValidatorOptions) {
        return __awaiter(this, void 0, void 0, function() {
          var errors;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                return [4, this.coreValidate(objectOrSchemaName, objectOrValidationOptions, maybeValidatorOptions)];
              case 1:
                errors = _a.sent();
                if (errors.length)
                  return [2, Promise.reject(errors)];
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      Validator2.prototype.validateSync = function(objectOrSchemaName, objectOrValidationOptions, maybeValidatorOptions) {
        var object = typeof objectOrSchemaName === "string" ? objectOrValidationOptions : objectOrSchemaName;
        var options = typeof objectOrSchemaName === "string" ? maybeValidatorOptions : objectOrValidationOptions;
        var schema = typeof objectOrSchemaName === "string" ? objectOrSchemaName : void 0;
        var executor = new ValidationExecutor(this, options);
        executor.ignoreAsyncValidations = true;
        var validationErrors = [];
        executor.execute(object, schema, validationErrors);
        return executor.stripEmptyErrors(validationErrors);
      };
      Validator2.prototype.coreValidate = function(objectOrSchemaName, objectOrValidationOptions, maybeValidatorOptions) {
        var object = typeof objectOrSchemaName === "string" ? objectOrValidationOptions : objectOrSchemaName;
        var options = typeof objectOrSchemaName === "string" ? maybeValidatorOptions : objectOrValidationOptions;
        var schema = typeof objectOrSchemaName === "string" ? objectOrSchemaName : void 0;
        var executor = new ValidationExecutor(this, options);
        var validationErrors = [];
        executor.execute(object, schema, validationErrors);
        return Promise.all(executor.awaitingPromises).then(function() {
          return executor.stripEmptyErrors(validationErrors);
        });
      };
      return Validator2;
    })()
  );

  // node_modules/.pnpm/class-validator@0.14.4/node_modules/class-validator/esm5/container.js
  var defaultContainer = new /** @class */
  ((function() {
    function class_1() {
      this.instances = [];
    }
    class_1.prototype.get = function(someClass) {
      var instance = this.instances.find(function(instance2) {
        return instance2.type === someClass;
      });
      if (!instance) {
        instance = { type: someClass, object: new someClass() };
        this.instances.push(instance);
      }
      return instance.object;
    };
    return class_1;
  })())();
  var userContainer;
  var userContainerOptions;
  function getFromContainer(someClass) {
    if (userContainer) {
      try {
        var instance = userContainer.get(someClass);
        if (instance)
          return instance;
        if (!userContainerOptions || !userContainerOptions.fallback)
          return instance;
      } catch (error) {
        if (!userContainerOptions || !userContainerOptions.fallbackOnErrors)
          throw error;
      }
    }
    return defaultContainer.get(someClass);
  }

  // node_modules/.pnpm/class-validator@0.14.4/node_modules/class-validator/esm5/index.js
  function validate(schemaNameOrObject, objectOrValidationOptions, maybeValidatorOptions) {
    if (typeof schemaNameOrObject === "string") {
      return getFromContainer(Validator).validate(schemaNameOrObject, objectOrValidationOptions, maybeValidatorOptions);
    } else {
      return getFromContainer(Validator).validate(schemaNameOrObject, objectOrValidationOptions);
    }
  }

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/validation.js
  async function validateData(data, dtoClass) {
    try {
      const dtoInstance = plainToInstance(dtoClass, data);
      const errors = await validate(dtoInstance);
      if (errors.length > 0) {
        const errorMessages = errors.flatMap(
          (error) => Object.values(error.constraints || {})
        );
        return {
          isValid: false,
          errors: errorMessages
        };
      }
      return {
        isValid: true,
        validatedData: dtoInstance
      };
    } catch (error) {
      return {
        isValid: false,
        errors: ["Validation error: " + error.message]
      };
    }
  }

  // node_modules/.pnpm/zois-core@2.2.1/node_modules/zois-core/dist/messaging.js
  function isZoiChatRoomMessage(m) {
    return m.Content === MOD_DATA.key;
  }
  function isClassConstructor(c) {
    return typeof c === "function" && c.prototype?.constructor == c;
  }
  var MessagesManager = class {
    /**
     * Sends beep message to a specific player.
     * @param data - The data to send in the beep.
     * @param targetId - The member number of the target player.
     */
    sendBeep(data, targetId) {
      const beep = {
        IsSecret: true,
        BeepType: "Leash",
        MemberNumber: targetId,
        Message: JSON.stringify({
          ...data
        })
      };
      ServerSend("AccountBeep", beep);
    }
    /**
     * Sends hidden packet message to the chat room or a specific player.
     * @param msg - The message identifier.
     * @param _data - Optional data payload to include.
     * @param targetNumber - Optional target player member number.
     */
    sendPacket(msg, _data, targetNumber) {
      const data = {
        Content: MOD_DATA.key,
        Dictionary: {
          msg
        },
        Type: "Hidden"
      };
      if (_data) data.Dictionary.data = _data;
      if (targetNumber) data.Target = targetNumber;
      ServerSend("ChatRoomChat", data);
    }
    /**
     * Sends a custom action message to the chat room with automatic pronoun replacement.
     * 
     * Replaces placeholders such as `<Possessive>`, `<Intensive>`, `<SelfIntensive>`, and `<Pronoun>`.
     * @param msg - The action message text.
     * @param target - Optional target player member number.
     * @param dictionary - Optional additional dictionary entries.
     */
    sendAction(msg, target = void 0, dictionary = []) {
      if (!msg || !ServerPlayerIsInChatRoom()) return;
      const isFemale = CharacterPronounDescription(Player) === "She/Her";
      const capPossessive = isFemale ? "Her" : "His";
      const capIntensive = isFemale ? "Her" : "Him";
      const capSelfIntensive = isFemale ? "Herself" : "Himself";
      const capPronoun = isFemale ? "She" : "He";
      msg = msg.replaceAll("<Possessive>", capPossessive).replaceAll("<possessive>", capPossessive.toLocaleLowerCase()).replaceAll("<Intensive>", capIntensive).replaceAll("<intensive>", capIntensive.toLocaleLowerCase()).replaceAll("<SelfIntensive>", capSelfIntensive).replaceAll("<selfIntensive>", capSelfIntensive.toLocaleLowerCase()).replaceAll("<Pronoun>", capPronoun).replaceAll("<pronoun>", capPronoun.toLocaleLowerCase());
      ServerSend("ChatRoomChat", {
        Content: "Beep",
        Type: "Action",
        Target: target ?? void 0,
        Dictionary: [
          // EN
          { Tag: "Beep", Text: "msg" },
          // CN
          { Tag: "\u53D1\u9001\u79C1\u804A", Text: "msg" },
          // DE
          { Tag: "Biep", Text: "msg" },
          // FR
          { Tag: "Sonner", Text: "msg" },
          // RU
          { Tag: "\u0417\u0432\u0443\u043A\u043E\u0432\u043E\u0439 \u0441\u0438\u0433\u043D\u0430\u043B", Text: "msg" },
          { Tag: "msg", Text: msg },
          ...dictionary
        ]
      });
    }
    /**
     * Sends a request to a target player and waits for a response.
     * 
     * Supports both packet and beep transport. Automatically times out after 6 seconds.
     * @param options - Request configuration.
     * @param options.message - The request message identifier.
     * @param options.data - Optional data to send with the request.
     * @param options.target - Target player member number.
     * @param options.type - Transport type: `"packet"` or `"beep"`.
     * @returns A promise that resolves with the response data or an error flag.
     */
    sendRequest({
      message,
      data = {},
      target,
      type = "packet",
      responseDto
    }) {
      const requestId = crypto.randomUUID();
      return new Promise((resolve) => {
        let deleteHook;
        if (type === "packet") {
          messagesManager.sendPacket("request", {
            requestId,
            message,
            data
          }, target);
          deleteHook = hookFunction("ChatRoomMessage", HookPriority.ADD_BEHAVIOR, async (args, next) => {
            const _message = args[0];
            const sender = getPlayer(_message.Sender);
            if (!sender) return next(args);
            if (isZoiChatRoomMessage(_message) && !sender.IsPlayer()) {
              const msg = _message.Dictionary.msg;
              const data2 = _message.Dictionary.data;
              if (msg === "requestResponse" && data2.requestId === requestId) {
                deleteHook();
                if (responseDto) {
                  const validationResult = await validateData(data2.data, responseDto);
                  if (!validationResult.isValid) {
                    logger.warn(`DTO Failure:`, validationResult);
                    resolve({
                      isError: true
                    });
                  }
                }
                resolve({
                  data: data2.data,
                  isError: false
                });
              }
            }
            return next(args);
          });
        } else {
          messagesManager.sendBeep({
            type: `${MOD_DATA.key}_request`,
            requestId,
            message,
            data
          }, target);
          deleteHook = hookFunction("ServerAccountBeep", HookPriority.ADD_BEHAVIOR, async (args, next) => {
            const beep = args[0];
            if (beep.BeepType !== "Leash") return next(args);
            let data2;
            try {
              data2 = JSON.parse(beep.Message);
            } catch {
              return next(args);
            }
            if (data2.type === `${MOD_DATA.key}_requestResponse` && data2.requestId === requestId) {
              deleteHook();
              if (responseDto) {
                const validationResult = await validateData(data2.data, responseDto);
                if (!validationResult.isValid) {
                  logger.warn(`DTO Failure:`, validationResult);
                  resolve({
                    isError: true
                  });
                }
              }
              resolve({
                data: data2.data,
                isError: false
              });
            }
            return next(args);
          });
        }
        setTimeout(() => {
          deleteHook();
          resolve({
            isError: true
          });
        }, 6e3);
      });
    }
    /**
     * Displays a local message in the chat log (visible only to the current player).
     * @param message - The message content as a string or DOM node.
     */
    sendLocal(message) {
      if (!ServerPlayerIsInChatRoom()) return;
      const div = document.createElement("div");
      div.setAttribute("class", "ChatMessage ChatMessageLocalMessage");
      div.setAttribute("data-time", ChatRoomCurrentTime());
      div.setAttribute("data-sender", `${Player.MemberNumber}`);
      setFontFamily(div, MOD_DATA.fontFamily);
      div.style.background = MOD_DATA.chatMessageBackground ?? "#55edc095";
      div.style.color = MOD_DATA.chatMessageColor ?? "black";
      div.style.margin = "0.15em 0";
      if (typeof message === "string") div.innerHTML = message;
      else div.appendChild(message);
      document.querySelector("#TextAreaChatLog")?.appendChild(div);
      ElementScrollToEnd("TextAreaChatLog");
    }
    /**
     * Sends a regular chat message to the chat room.
     * @param message - The chat message content.
     */
    sendChat(message) {
      ServerSend("ChatRoomChat", { Type: "Chat", Content: message });
    }
    onRequest(message, dtoOrListener, listener) {
      let _listener;
      let dto;
      if (isClassConstructor(dtoOrListener)) {
        dto = dtoOrListener;
        _listener = listener;
      } else {
        _listener = dtoOrListener;
      }
      const rm1 = hookFunction("ChatRoomMessage", HookPriority.ADD_BEHAVIOR, async (args, next) => {
        const _message = args[0];
        const sender = getPlayer(_message.Sender);
        if (!sender) return next(args);
        if (isZoiChatRoomMessage(_message) && !sender.IsPlayer()) {
          const msg = _message.Dictionary?.msg;
          const data = _message.Dictionary?.data;
          if (msg === "request" && data.message === message) {
            if (typeof data.requestId !== "string" || typeof data.message !== "string") return;
            if (dto) {
              const validationResult = await validateData(data.data, dto);
              if (!validationResult.isValid) {
                logger.warn(`DTO Failure:`, validationResult);
                return;
              }
            }
            const _data = _listener?.(data.data, sender);
            if (_data !== void 0) {
              messagesManager.sendPacket("requestResponse", {
                requestId: data.requestId,
                message: data.message,
                data: _data
              }, sender.MemberNumber);
            }
          }
        }
        return next(args);
      });
      const rm2 = hookFunction("ServerAccountBeep", HookPriority.ADD_BEHAVIOR, async (args, next) => {
        const beep = args[0];
        if (beep.BeepType !== "Leash") return next(args);
        let data;
        try {
          data = JSON.parse(beep.Message);
        } catch {
          return next(args);
        }
        if (data.type === `${MOD_DATA.key}_request` && data.message === message) {
          if (typeof data.requestId !== "string") return;
          const validationResult = await validateData(data.data, dto);
          if (dto && !validationResult.isValid) {
            logger.warn(`DTO Failure:`, validationResult);
            return next(args);
          }
          const _data = _listener?.(data.data, beep.MemberNumber, beep.MemberName);
          if (_data !== void 0) {
            messagesManager.sendBeep({
              type: `${MOD_DATA.key}_requestResponse`,
              requestId: data.requestId,
              message: data.message,
              data: _data
            }, beep.MemberNumber);
          }
        }
        return next(args);
      });
      return () => {
        rm1();
        rm2();
      };
    }
    onPacket(message, dtoOrListener, listener) {
      return hookFunction("ChatRoomMessage", HookPriority.ADD_BEHAVIOR, async (args, next) => {
        let _listener;
        let dto;
        if (isClassConstructor(dtoOrListener)) {
          dto = dtoOrListener;
          _listener = listener;
        } else {
          _listener = dtoOrListener;
        }
        const _message = args[0];
        const sender = getPlayer(_message.Sender);
        if (!sender) return next(args);
        if (isZoiChatRoomMessage(_message) && _message.Dictionary.msg === message && !sender.IsPlayer()) {
          const validationResult = await validateData(_message.Dictionary.data, dto);
          if (dto && !validationResult.isValid) {
            logger.warn(`DTO Failure:`, validationResult);
            return next(args);
          }
          _listener?.(_message.Dictionary.data, sender);
        }
        return next(args);
      });
    }
  };
  var messagesManager = new MessagesManager();

  // src/modules/authority.ts
  var PERMISSION_DEFINITIONS = [
    // Authority module
    {
      key: "authority_edit_roles",
      name: "Allow managing Owner & Mistress roles",
      description: "Permits adding or removing member numbers from the custom QoC Owner and Mistress lists.",
      category: "Authority"
    },
    {
      key: "authority_edit_min_role",
      name: "Allow lowest access modification",
      description: "Permits modifying the lowest permitted role required for any permission.",
      category: "Authority"
    },
    {
      key: "authority_edit_self_access",
      name: "Allow modifying self access",
      description: "Permits granting or revoking self-access on permissions (required to gift or reclaim control).",
      category: "Authority"
    },
    // Inspection
    {
      key: "inspect_view_addons",
      name: "Allow inspecting loaded addons",
      description: "Permits querying and viewing the list of external addons loaded in this character's browser session.",
      category: "Inspection"
    },
    {
      key: "inspect_view_rules",
      name: "Allow viewing active addon rules",
      description: "Permits viewing the active mandatory and forbidden addon rules currently locked on this character.",
      category: "Inspection"
    },
    // Rules & Compliance
    {
      key: "rules_lock_mandatory",
      name: "Allow locking mandatory addons",
      description: "Permits locking mandatory addon requirements and forcing auto-injection on this character.",
      category: "Rules"
    },
    {
      key: "rules_lock_forbidden",
      name: "Allow locking forbidden addons",
      description: "Permits locking forbidden addon bans and policy violation notices on this character.",
      category: "Rules"
    },
    {
      key: "rules_remove_rules",
      name: "Allow removing active rules",
      description: "Permits removing, resetting, or clearing active addon rules from this character.",
      category: "Rules"
    },
    {
      key: "rules_edit_autoload_mode",
      name: "Allow changing auto-load behavior",
      description: "Permits toggling between Silent Auto-Load and Prompt First confirmation for missing addons.",
      category: "Rules"
    },
    {
      key: "rules_force_compliance",
      name: "Allow forcing compliance evaluations",
      description: "Permits commanding this character's game to immediately evaluate all active rules and alert on violations.",
      category: "Rules"
    },
    {
      key: "rules_force_injection",
      name: "Allow forcing addon injection",
      description: "Permits remotely commanding this character's game to force-inject missing mandatory addons, even if auto-injection is off.",
      category: "Rules"
    },
    // General
    {
      key: "menu_open_settings",
      name: "Allow opening QoC settings menu",
      description: "Controls whether this character is allowed to open the Quality of Club configuration menu.",
      category: "General"
    }
  ];
  function getCharacterAccessLevel(character) {
    if (character === null || character === void 0) return 7 /* public */;
    const memberNumber = typeof character === "number" ? character : character.MemberNumber;
    if (typeof Player !== "undefined" && Player.MemberNumber === memberNumber) {
      return 0 /* self */;
    }
    if (memberNumber !== null && typeof memberNumber === "number") {
      if (typeof Player !== "undefined") {
        if (Player.Ownership && typeof Player.Ownership.MemberNumber === "number" && Player.Ownership.MemberNumber === memberNumber && Player.Ownership.Stage === 1) {
          return 1 /* clubowner */;
        }
        if (typeof Player.IsOwnedByMemberNumber === "function" && Player.IsOwnedByMemberNumber(memberNumber)) {
          return 1 /* clubowner */;
        }
      }
      if (Array.isArray(modStorage.authority?.owners) && modStorage.authority.owners.includes(memberNumber)) {
        return 2 /* owner */;
      }
      if (typeof Player !== "undefined") {
        if (Array.isArray(Player.Lovership) && Player.Lovership.some((l) => l && l.MemberNumber === memberNumber && l.Stage === 1)) {
          return 3 /* lover */;
        }
        if (typeof Player.GetLoversNumbers === "function") {
          const lovers = Player.GetLoversNumbers(true);
          if (Array.isArray(lovers) && lovers.includes(memberNumber)) {
            return 3 /* lover */;
          }
        }
        if (typeof Player.IsLoverOfMemberNumber === "function" && Player.IsLoverOfMemberNumber(memberNumber)) {
          return 3 /* lover */;
        }
      }
      if (Array.isArray(modStorage.authority?.mistresses) && modStorage.authority.mistresses.includes(memberNumber)) {
        return 4 /* mistress */;
      }
      if (typeof Player !== "undefined" && Array.isArray(Player.WhiteList) && Player.WhiteList.includes(memberNumber)) {
        return 5 /* whitelist */;
      }
      if (typeof Player !== "undefined" && Array.isArray(Player.FriendList) && Player.FriendList.includes(memberNumber)) {
        return 6 /* friend */;
      }
    }
    return 7 /* public */;
  }
  function checkPermissionAccess(perm, character) {
    const permSetting = modStorage.authority?.permissions?.[perm];
    if (!permSetting) return true;
    const accessLevel = getCharacterAccessLevel(character !== void 0 ? character : Player?.MemberNumber);
    if (accessLevel === 0 /* self */) {
      return permSetting.self || permSetting.min === 0 /* self */;
    }
    return accessLevel <= permSetting.min;
  }
  function addRoleMember(role, memberNumber, byCharacter) {
    if (!checkPermissionAccess("authority_edit_roles", byCharacter)) {
      return { success: false, message: "Permission Denied: You do not have authority to edit roles." };
    }
    if (!Number.isInteger(memberNumber) || memberNumber <= 0) {
      return { success: false, message: "Invalid Member Number." };
    }
    if (typeof Player !== "undefined" && memberNumber === Player.MemberNumber) {
      return { success: false, message: "You cannot add yourself to an external role list." };
    }
    const listKey = role === "owner" ? "owners" : "mistresses";
    if (!Array.isArray(modStorage.authority[listKey])) {
      modStorage.authority[listKey] = [];
    }
    if (modStorage.authority[listKey].includes(memberNumber)) {
      return { success: false, message: `Member #${memberNumber} is already in the ${role} list.` };
    }
    modStorage.authority[listKey].push(memberNumber);
    saveStorage();
    syncStorage();
    return { success: true, message: `Added Member #${memberNumber} as ${role === "owner" ? "Owner" : "Mistress"}.` };
  }
  function removeRoleMember(role, memberNumber, byCharacter) {
    if (!checkPermissionAccess("authority_edit_roles", byCharacter)) {
      return { success: false, message: "Permission Denied: You do not have authority to edit roles." };
    }
    const listKey = role === "owner" ? "owners" : "mistresses";
    if (!Array.isArray(modStorage.authority[listKey])) {
      return { success: false, message: "List is empty." };
    }
    modStorage.authority[listKey] = modStorage.authority[listKey].filter((id) => id !== memberNumber);
    saveStorage();
    syncStorage();
    return { success: true, message: `Removed Member #${memberNumber} from ${role} list.` };
  }
  function setPermissionMinRole(perm, minRole, byCharacter) {
    if (!checkPermissionAccess("authority_edit_min_role", byCharacter)) {
      return { success: false, message: "Permission Denied: You do not have authority to modify minimum access roles." };
    }
    if (!modStorage.authority.permissions[perm]) {
      return { success: false, message: "Invalid permission." };
    }
    modStorage.authority.permissions[perm].min = minRole;
    saveStorage();
    syncStorage();
    return { success: true, message: `Updated lowest permitted role for ${perm} to ${ACCESS_LEVEL_NAMES[minRole]}.` };
  }
  function setPermissionSelfAccess(perm, selfAllowed, byCharacter) {
    if (!checkPermissionAccess("authority_edit_self_access", byCharacter)) {
      return { success: false, message: "Permission Denied: You do not have authority to modify self-access." };
    }
    if (!modStorage.authority.permissions[perm]) {
      return { success: false, message: "Invalid permission." };
    }
    modStorage.authority.permissions[perm].self = selfAllowed;
    saveStorage();
    syncStorage();
    return { success: true, message: `Updated self-access for ${perm} to ${selfAllowed ? "permitted" : "forbidden"}.` };
  }

  // src/modules/networkSync.ts
  function getCallerPermissions(senderId) {
    const perms = [
      "authority_edit_roles",
      "authority_edit_min_role",
      "authority_edit_self_access",
      "inspect_view_addons",
      "inspect_view_rules",
      "rules_lock_mandatory",
      "rules_lock_forbidden",
      "rules_remove_rules",
      "rules_edit_autoload_mode",
      "rules_force_compliance",
      "rules_force_injection",
      "menu_open_settings"
    ];
    const res = {};
    for (const p of perms) {
      res[p] = checkPermissionAccess(p, senderId);
    }
    return res;
  }
  function canSenderInspect(senderId) {
    if (!modStorage.inspector.enabled) {
      return { allowed: false, canViewAddons: false, canViewRules: false, reason: "Quality of Club Addon Inspector is disabled on this player." };
    }
    const canViewAddons = checkPermissionAccess("inspect_view_addons", senderId);
    const canViewRules = checkPermissionAccess("inspect_view_rules", senderId);
    if (!canViewAddons && !canViewRules) {
      return { allowed: false, canViewAddons: false, canViewRules: false, reason: "Permission Denied: You do not meet the minimum role required to inspect this player's addons or rules." };
    }
    return { allowed: true, canViewAddons, canViewRules };
  }
  function canSenderEnforceRules(senderId, newRules) {
    if (!modStorage.inspector.enabled) {
      return { allowed: false, reason: "Quality of Club Addon Inspector is disabled on this player." };
    }
    const currentRules = modStorage.inspector.rules || [];
    const hasMandatoryAccess = checkPermissionAccess("rules_lock_mandatory", senderId);
    const hasForbiddenAccess = checkPermissionAccess("rules_lock_forbidden", senderId);
    const hasRemoveAccess = checkPermissionAccess("rules_remove_rules", senderId);
    for (const rule of newRules) {
      const isMandatory = rule.type === "required" || rule.type === "mandatory";
      const isForbidden = rule.type === "forbidden";
      const prev = currentRules.find((r) => r.modId.toLowerCase() === rule.modId.toLowerCase());
      if (isMandatory && (!prev || prev.type !== "required" && prev.type !== "mandatory")) {
        if (!hasMandatoryAccess) {
          return { allowed: false, reason: `Permission Denied: You do not meet the minimum role required to lock mandatory addons (attempted on ${rule.modName}).` };
        }
      }
      if (isForbidden && (!prev || prev.type !== "forbidden")) {
        if (!hasForbiddenAccess) {
          return { allowed: false, reason: `Permission Denied: You do not meet the minimum role required to lock forbidden addons (attempted on ${rule.modName}).` };
        }
      }
    }
    for (const prev of currentRules) {
      const stillExists = newRules.some((r) => r.modId.toLowerCase() === prev.modId.toLowerCase());
      if (!stillExists) {
        if (!hasRemoveAccess) {
          return { allowed: false, reason: `Permission Denied: You do not meet the minimum role required to remove active addon rules (attempted on ${prev.modName}).` };
        }
      }
    }
    return { allowed: true };
  }
  function sendSilentRoomTelemetry() {
    if (!modStorage.inspector.silentTelemetry) return;
    if (typeof ChatRoomCharacter === "undefined" || !Array.isArray(ChatRoomCharacter)) return;
    if (typeof Player === "undefined") return;
    const loadedMods = getLoadedMods2();
    const rules = modStorage.inspector.rules;
    const compliance = checkComplianceAgainstRules(loadedMods, rules);
    for (const char of ChatRoomCharacter) {
      if (!char || char.MemberNumber === Player.MemberNumber) continue;
      const access = getCharacterAccessLevel(char.MemberNumber);
      if (access === 1 || access === 2 || access === 4) {
        messagesManager.sendPacket("qoc_telemetry", {
          mods: loadedMods,
          rules,
          isCompliant: compliance.isCompliant,
          missingCount: compliance.missing.length,
          forbiddenCount: compliance.forbidden.length
        }, char.MemberNumber);
      }
    }
  }
  var periodicComplianceTimer = null;
  function restartPeriodicComplianceTimer() {
    if (periodicComplianceTimer) {
      clearInterval(periodicComplianceTimer);
      periodicComplianceTimer = null;
    }
    const intervalSec = modStorage.inspector.evaluationInterval;
    if (intervalSec && intervalSec > 0) {
      periodicComplianceTimer = setInterval(() => {
        evaluateCompliance();
        if (typeof ServerPlayerIsInChatRoom === "function" && ServerPlayerIsInChatRoom()) {
          if (modStorage.inspector.silentTelemetry) {
            sendSilentRoomTelemetry();
          }
        }
      }, intervalSec * 1e3);
    }
  }
  function buildInspectResponseData(senderId) {
    const permCheck = canSenderInspect(senderId);
    if (!permCheck.allowed) {
      return {
        allowed: false,
        reason: permCheck.reason
      };
    }
    return {
      allowed: true,
      canViewAddons: permCheck.canViewAddons,
      canViewRules: permCheck.canViewRules,
      mods: permCheck.canViewAddons ? getLoadedMods2() : [],
      rules: permCheck.canViewRules ? modStorage.inspector.rules : [],
      autoLoadMode: modStorage.inspector.autoLoadMode,
      preferences: {
        violationAction: modStorage.inspector.violationAction || "toast",
        autoLoadMode: modStorage.inspector.autoLoadMode || "Prompt",
        evaluationInterval: typeof modStorage.inspector.evaluationInterval === "number" ? modStorage.inspector.evaluationInterval : 30,
        silentTelemetry: typeof modStorage.inspector.silentTelemetry === "boolean" ? modStorage.inspector.silentTelemetry : true,
        showProfileButton: typeof modStorage.inspector.showProfileButton === "boolean" ? modStorage.inspector.showProfileButton : true,
        allowForcedInjection: typeof modStorage.inspector.allowForcedInjection === "boolean" ? modStorage.inspector.allowForcedInjection : false
      },
      customCatalog: modStorage.inspector.customCatalog || [],
      authority: modStorage.authority,
      callerAccessLevel: getCharacterAccessLevel(senderId),
      callerPermissions: getCallerPermissions(senderId),
      version: version2
    };
  }
  function handleSetRulesRequest(senderId, senderName, newRules) {
    const authCheck = canSenderEnforceRules(senderId, newRules);
    if (!authCheck.allowed) {
      return {
        success: false,
        reason: authCheck.reason
      };
    }
    modStorage.inspector.rules = newRules;
    syncStorage();
    evaluateCompliance();
    toastsManager.info({
      title: `${MOD_NAME} Rules Updated`,
      message: `Addon rules updated by ${senderName}.`,
      duration: 5e3
    });
    return { success: true };
  }
  async function handleTriggerComplianceRequest(senderId, senderName) {
    if (!checkPermissionAccess("rules_force_compliance", senderId)) {
      return {
        success: false,
        reason: "Permission Denied: You do not have authority to force compliance evaluations on this player."
      };
    }
    toastsManager.info({
      title: `${MOD_NAME} Compliance Triggered`,
      message: `${senderName} requested an immediate compliance check.`,
      duration: 4e3
    });
    const report = await evaluateCompliance();
    return {
      success: true,
      report: {
        isCompliant: report.isCompliant,
        missingCount: report.missingRequired.length,
        forbiddenCount: report.detectedForbidden.length
      }
    };
  }
  function handleAuthorityUpdateRequest(req, senderId, senderName) {
    let resData;
    if (!req || typeof req.action !== "string") {
      resData = { success: false, reason: "Invalid request format." };
    } else if (req.action === "add_role") {
      const res = addRoleMember(req.role, req.memberNumber, senderId);
      resData = { success: res.success, reason: res.message, authority: modStorage.authority };
    } else if (req.action === "remove_role") {
      const res = removeRoleMember(req.role, req.memberNumber, senderId);
      resData = { success: res.success, reason: res.message, authority: modStorage.authority };
    } else if (req.action === "set_min_role") {
      const res = setPermissionMinRole(req.perm, req.minRole, senderId);
      resData = { success: res.success, reason: res.message, authority: modStorage.authority };
    } else if (req.action === "set_self_access") {
      const res = setPermissionSelfAccess(req.perm, req.selfAllowed, senderId);
      resData = { success: res.success, reason: res.message, authority: modStorage.authority };
    } else if (req.action === "set_autoload_mode") {
      if (!checkPermissionAccess("rules_edit_autoload_mode", senderId)) {
        resData = { success: false, reason: "Permission Denied: You do not have authority to edit auto-load mode." };
      } else {
        modStorage.inspector.autoLoadMode = req.autoLoadMode || "Prompt";
        saveStorage();
        syncStorage();
        resData = { success: true, autoLoadMode: modStorage.inspector.autoLoadMode };
      }
    } else if (req.action === "update_preferences") {
      if (!checkPermissionAccess("rules_edit_autoload_mode", senderId)) {
        resData = { success: false, reason: "Permission Denied: You do not have authority to edit preferences." };
      } else if (req.preferences) {
        if (req.preferences.violationAction) modStorage.inspector.violationAction = req.preferences.violationAction;
        if (req.preferences.autoLoadMode) modStorage.inspector.autoLoadMode = req.preferences.autoLoadMode;
        if (typeof req.preferences.evaluationInterval === "number") modStorage.inspector.evaluationInterval = req.preferences.evaluationInterval;
        if (typeof req.preferences.silentTelemetry === "boolean") modStorage.inspector.silentTelemetry = req.preferences.silentTelemetry;
        if (typeof req.preferences.showProfileButton === "boolean") modStorage.inspector.showProfileButton = req.preferences.showProfileButton;
        if (typeof req.preferences.allowForcedInjection === "boolean") modStorage.inspector.allowForcedInjection = req.preferences.allowForcedInjection;
        saveStorage();
        syncStorage();
        restartPeriodicComplianceTimer();
        resData = {
          success: true,
          preferences: {
            violationAction: modStorage.inspector.violationAction,
            autoLoadMode: modStorage.inspector.autoLoadMode,
            evaluationInterval: modStorage.inspector.evaluationInterval,
            silentTelemetry: modStorage.inspector.silentTelemetry,
            showProfileButton: modStorage.inspector.showProfileButton,
            allowForcedInjection: modStorage.inspector.allowForcedInjection
          }
        };
      } else {
        resData = { success: false, reason: "No preferences provided." };
      }
    } else if (req.action === "add_custom_mod") {
      if (!checkPermissionAccess("rules_edit_autoload_mode", senderId)) {
        resData = { success: false, reason: "Permission Denied: You do not have authority to add custom addons." };
      } else if (req.customMod && req.customMod.id) {
        modStorage.inspector.customCatalog = modStorage.inspector.customCatalog || [];
        modStorage.inspector.customCatalog = modStorage.inspector.customCatalog.filter((c) => c.id.toLowerCase() !== req.customMod.id.toLowerCase());
        modStorage.inspector.customCatalog.push(req.customMod);
        saveStorage();
        syncStorage();
        resData = { success: true, customCatalog: modStorage.inspector.customCatalog };
      } else {
        resData = { success: false, reason: "Invalid custom addon data." };
      }
    } else if (req.action === "remove_custom_mod") {
      if (!checkPermissionAccess("rules_edit_autoload_mode", senderId)) {
        resData = { success: false, reason: "Permission Denied: You do not have authority to remove custom addons." };
      } else if (req.customModId) {
        modStorage.inspector.customCatalog = (modStorage.inspector.customCatalog || []).filter((c) => c.id.toLowerCase() !== req.customModId.toLowerCase());
        saveStorage();
        syncStorage();
        resData = { success: true, customCatalog: modStorage.inspector.customCatalog };
      } else {
        resData = { success: false, reason: "Invalid custom addon ID." };
      }
    } else {
      resData = { success: false, reason: "Unknown action." };
    }
    if (resData.success) {
      toastsManager.info({
        title: `${MOD_NAME} Authority Updated`,
        message: `Authority updated by ${senderName}.`,
        duration: 4e3
      });
    }
    return resData;
  }
  async function handleForceInjectRequest(senderId, senderName, targetModId) {
    if (!modStorage.inspector.enabled) {
      return { success: false, reason: "Quality of Club Addon Inspector is disabled on this player." };
    }
    if (!checkPermissionAccess("rules_force_injection", senderId)) {
      return { success: false, reason: "Permission Denied: You do not meet the minimum role required to force addon injection on this player." };
    }
    if (!modStorage.inspector.allowForcedInjection) {
      return { success: false, reason: "Permission Denied: Forced addon injection is disabled in this player's preferences." };
    }
    const currentRules = modStorage.inspector.rules || [];
    const missingMandatory = currentRules.filter((r) => (r.type === "required" || r.type === "mandatory") && !isModLoaded(r.modId));
    if (missingMandatory.length === 0 && (!targetModId || targetModId === "all")) {
      return {
        success: true,
        reason: "All mandatory addons are already loaded.",
        injectedCount: 0,
        report: {
          isCompliant: true,
          missingCount: 0,
          forbiddenCount: 0
        }
      };
    }
    let toInject = [];
    if (targetModId && targetModId !== "all") {
      const matching = missingMandatory.find((r) => r.modId.toLowerCase() === targetModId.toLowerCase());
      if (!matching) {
        if (isModLoaded(targetModId)) {
          return { success: true, reason: `${targetModId} is already loaded on this client.`, injectedCount: 0 };
        }
        const rule = currentRules.find((r) => r.modId.toLowerCase() === targetModId.toLowerCase() && (r.type === "required" || r.type === "mandatory"));
        if (rule) {
          toInject = [rule];
        } else {
          return { success: false, reason: `Addon '${targetModId}' is not an active mandatory requirement.` };
        }
      } else {
        toInject = [matching];
      }
    } else {
      toInject = missingMandatory;
    }
    let injectedCount = 0;
    const injectedNames = [];
    for (const rule of toInject) {
      const success = await loadCuratedMod(rule.modId);
      if (success) {
        injectedCount++;
        injectedNames.push(rule.modName || rule.modId);
      }
    }
    if (injectedNames.length > 0) {
      toastsManager.info({
        title: `${MOD_NAME} Forced Addon Injection`,
        message: `Mandatory addon${injectedNames.length > 1 ? "s" : ""} (${injectedNames.join(", ")}) ${injectedNames.length > 1 ? "were" : "was"} injected by ${senderName}.`,
        duration: 6e3
      });
    }
    const report = await evaluateCompliance();
    return {
      success: true,
      injectedCount,
      report: {
        isCompliant: report.isCompliant,
        missingCount: report.missingRequired.length,
        forbiddenCount: report.detectedForbidden.length
      }
    };
  }
  function initNetworkSync() {
    restartPeriodicComplianceTimer();
    hookFunction("ChatRoomMessage", HookPriority.ADD_BEHAVIOR, async (args, next) => {
      const msg = args[0];
      if (!msg || msg.Content !== MOD_KEY || !msg.Dictionary) {
        return next(args);
      }
      const dict = msg.Dictionary;
      const dictMsg = dict?.msg;
      const dictData = dict?.data;
      if (dictMsg === "request" && dictData && typeof dictData.requestId === "string") {
        const senderId = msg.Sender;
        if (typeof senderId !== "number") return next(args);
        if (typeof Player !== "undefined" && senderId === Player.MemberNumber) return next(args);
        const senderChar = typeof Character !== "undefined" && typeof Character.find === "function" ? Character.find((c) => c.MemberNumber === senderId) : null;
        const senderName = senderChar?.Name || `Member #${senderId}`;
        if (dictData.message === "qoc_inspect") {
          const responseData = buildInspectResponseData(senderId);
          messagesManager.sendPacket("requestResponse", {
            requestId: dictData.requestId,
            message: dictData.message,
            data: responseData
          }, senderId);
          return;
        }
        if (dictData.message === "qoc_setRules") {
          const newRules = Array.isArray(dictData.data?.rules) ? dictData.data.rules : [];
          const responseData = handleSetRulesRequest(senderId, senderName, newRules);
          messagesManager.sendPacket("requestResponse", {
            requestId: dictData.requestId,
            message: dictData.message,
            data: responseData
          }, senderId);
          return;
        }
        if (dictData.message === "qoc_triggerCompliance") {
          const responseData = await handleTriggerComplianceRequest(senderId, senderName);
          messagesManager.sendPacket("requestResponse", {
            requestId: dictData.requestId,
            message: dictData.message,
            data: responseData
          }, senderId);
          return;
        }
        if (dictData.message === "qoc_updateAuthority") {
          const resData = handleAuthorityUpdateRequest(dictData.data, senderId, senderName);
          messagesManager.sendPacket("requestResponse", {
            requestId: dictData.requestId,
            message: dictData.message,
            data: resData
          }, senderId);
          return;
        }
        if (dictData.message === "qoc_forceInject") {
          const targetModId = typeof dictData.data?.modId === "string" ? dictData.data.modId : void 0;
          const resData = await handleForceInjectRequest(senderId, senderName, targetModId);
          messagesManager.sendPacket("requestResponse", {
            requestId: dictData.requestId,
            message: dictData.message,
            data: resData
          }, senderId);
          return;
        }
      }
      if (dictMsg === "qoc_telemetry" && dictData) {
        const senderId = msg.Sender;
        const senderChar = typeof Character !== "undefined" && typeof Character.find === "function" ? Character.find((c) => c.MemberNumber === senderId) : null;
        const senderName = senderChar?.Name || `Member #${senderId}`;
        if (dictData.isCompliant) {
          toastsManager.info({
            title: `QoC Telemetry: ${senderName}`,
            message: `\u2713 In-room manifest verified: All ${dictData.mods?.length || 0} addons compliant.`,
            duration: 4e3
          });
        } else {
          toastsManager.error({
            title: `\u26A0\uFE0F QoC Rule Violation: ${senderName}`,
            message: `Policy violation: ${dictData.missingCount || 0} missing mandatory, ${dictData.forbiddenCount || 0} forbidden!`,
            duration: 8e3
          });
        }
      }
      return next(args);
    });
    hookFunction("ServerAccountBeep", HookPriority.ADD_BEHAVIOR, async (args, next) => {
      const beep = args[0];
      if (!beep || beep.BeepType !== "Leash") return next(args);
      let data;
      try {
        data = JSON.parse(beep.Message);
      } catch {
        return next(args);
      }
      if (data && data.type === `${MOD_KEY}_request` && typeof data.requestId === "string") {
        const senderId = beep.MemberNumber;
        const senderChar = typeof Character !== "undefined" && typeof Character.find === "function" ? Character.find((c) => c.MemberNumber === senderId) : null;
        const senderName = senderChar?.Name || `Member #${senderId}`;
        if (data.message === "qoc_inspect") {
          const responseData = buildInspectResponseData(senderId);
          messagesManager.sendBeep({
            type: `${MOD_KEY}_requestResponse`,
            requestId: data.requestId,
            message: data.message,
            data: responseData
          }, senderId);
          return;
        }
        if (data.message === "qoc_setRules") {
          const newRules = Array.isArray(data.data?.rules) ? data.data.rules : [];
          const responseData = handleSetRulesRequest(senderId, senderName, newRules);
          messagesManager.sendBeep({
            type: `${MOD_KEY}_requestResponse`,
            requestId: data.requestId,
            message: data.message,
            data: responseData
          }, senderId);
          return;
        }
        if (data.message === "qoc_triggerCompliance") {
          const responseData = await handleTriggerComplianceRequest(senderId, senderName);
          messagesManager.sendBeep({
            type: `${MOD_KEY}_requestResponse`,
            requestId: data.requestId,
            message: data.message,
            data: responseData
          }, senderId);
          return;
        }
        if (data.message === "qoc_updateAuthority") {
          const resData = handleAuthorityUpdateRequest(data.data, senderId, senderName);
          messagesManager.sendBeep({
            type: `${MOD_KEY}_requestResponse`,
            requestId: data.requestId,
            message: data.message,
            data: resData
          }, senderId);
          return;
        }
        if (data.message === "qoc_forceInject") {
          const targetModId = typeof data.data?.modId === "string" ? data.data.modId : void 0;
          const resData = await handleForceInjectRequest(senderId, senderName, targetModId);
          messagesManager.sendBeep({
            type: `${MOD_KEY}_requestResponse`,
            requestId: data.requestId,
            message: data.message,
            data: resData
          }, senderId);
          return;
        }
      }
      return next(args);
    });
    hookFunction("ChatRoomSync", HookPriority.OBSERVE, (args, next) => {
      const ret = next(args);
      evaluateCompliance();
      sendSilentRoomTelemetry();
      return ret;
    });
    setInterval(() => {
      if (typeof CurrentScreen !== "undefined" && CurrentScreen === "ChatRoom") {
        evaluateCompliance();
      }
    }, 2e4);
  }
  async function requestInspect(targetMemberNumber) {
    try {
      let res = await messagesManager.sendRequest({
        message: "qoc_inspect",
        target: targetMemberNumber,
        type: "packet"
      });
      if (res.isError || !res.data) {
        res = await messagesManager.sendRequest({
          message: "qoc_inspect",
          target: targetMemberNumber,
          type: "beep"
        });
      }
      if (res.isError || !res.data) {
        return {
          success: false,
          error: "Target player did not respond. They may not have Quality of Club loaded."
        };
      }
      if (!res.data.allowed) {
        return {
          success: false,
          error: res.data.reason || "Inspection permission denied by target player."
        };
      }
      return {
        success: true,
        data: res.data
      };
    } catch (err) {
      return {
        success: false,
        error: err?.message || "Failed to communicate with target player."
      };
    }
  }
  async function requestSetRules(targetMemberNumber, rules) {
    try {
      let res = await messagesManager.sendRequest({
        message: "qoc_setRules",
        data: { rules },
        target: targetMemberNumber,
        type: "packet"
      });
      if (res.isError || !res.data) {
        res = await messagesManager.sendRequest({
          message: "qoc_setRules",
          data: { rules },
          target: targetMemberNumber,
          type: "beep"
        });
      }
      if (res.isError || !res.data) {
        return {
          success: false,
          error: "Target player did not respond. Rules could not be synced."
        };
      }
      if (!res.data.success) {
        return {
          success: false,
          error: res.data.reason || "Target rejected rule update."
        };
      }
      return {
        success: true
      };
    } catch (err) {
      return {
        success: false,
        error: err?.message || "Failed to send rule update to target."
      };
    }
  }
  async function requestUpdateAuthority(targetMemberNumber, update) {
    try {
      let res = await messagesManager.sendRequest({
        message: "qoc_updateAuthority",
        data: update,
        target: targetMemberNumber,
        type: "packet"
      });
      if (res.isError || !res.data) {
        res = await messagesManager.sendRequest({
          message: "qoc_updateAuthority",
          data: update,
          target: targetMemberNumber,
          type: "beep"
        });
      }
      if (res.isError || !res.data) {
        return {
          success: false,
          error: "Target player did not respond. Quality of Club may not be running on their client."
        };
      }
      if (!res.data.success) {
        return {
          success: false,
          error: res.data.reason || "Target rejected authority update."
        };
      }
      return {
        success: true,
        data: res.data
      };
    } catch (err) {
      return {
        success: false,
        error: err?.message || "Failed to transmit authority update."
      };
    }
  }
  async function requestTriggerCompliance(targetMemberNumber) {
    try {
      let res = await messagesManager.sendRequest({
        message: "qoc_triggerCompliance",
        target: targetMemberNumber,
        type: "packet"
      });
      if (res.isError || !res.data) {
        res = await messagesManager.sendRequest({
          message: "qoc_triggerCompliance",
          target: targetMemberNumber,
          type: "beep"
        });
      }
      if (res.isError || !res.data) {
        return {
          success: false,
          error: "Target player did not respond to compliance trigger request."
        };
      }
      if (!res.data.success) {
        return {
          success: false,
          error: res.data.reason || "Target player rejected compliance trigger."
        };
      }
      return {
        success: true,
        data: res.data
      };
    } catch (err) {
      return {
        success: false,
        error: err?.message || "Failed to communicate with target player."
      };
    }
  }
  async function requestForceInject(targetMemberNumber, modId) {
    try {
      let res = await messagesManager.sendRequest({
        message: "qoc_forceInject",
        data: { modId },
        target: targetMemberNumber,
        type: "packet"
      });
      if (res.isError || !res.data) {
        res = await messagesManager.sendRequest({
          message: "qoc_forceInject",
          data: { modId },
          target: targetMemberNumber,
          type: "beep"
        });
      }
      if (res.isError || !res.data) {
        return {
          success: false,
          error: "Target player did not respond to forced injection request."
        };
      }
      if (!res.data.success) {
        return {
          success: false,
          error: res.data.reason || "Target player rejected forced injection."
        };
      }
      return {
        success: true,
        data: res.data
      };
    } catch (err) {
      return {
        success: false,
        error: err?.message || "Failed to communicate with target player."
      };
    }
  }

  // src/subscreens/inspectorSubscreen.ts
  var InspectorSubscreen = class extends BaseSubscreen {
    target = null;
    isSelf = true;
    targetData = null;
    isLoading = false;
    errorMessage = null;
    // Working copy of rules being edited on target
    targetRulesCopy = [];
    // Filter text for permissions tab
    permissionFilter = "";
    // Search filter for Enforce Rules catalog
    catalogSearchText = "";
    // Root UI container & content area
    rootElement = null;
    contentArea = null;
    modalElement = null;
    activeTab = "addons";
    constructor(target = null, initialTab = "addons") {
      super();
      this.target = target;
      this.isSelf = !target || typeof target.IsPlayer === "function" && target.IsPlayer();
      this.activeTab = initialTab;
    }
    get name() {
      return "";
    }
    onRun() {
      DrawRect(0, 0, 2e3, 1e3, "#191f2b");
    }
    onLoad() {
      this.createRootUI();
      if (!this.isSelf) {
        this.loadTargetData();
      } else {
        this.renderTabContent();
      }
    }
    exit() {
      this.cleanup();
      if (typeof CurrentScreen !== "undefined" && CurrentScreen === "InformationSheet") {
        setSubscreen(null);
        if (typeof InformationSheetLoadCharacter === "function" && this.target) {
          try {
            InformationSheetLoadCharacter(this.target);
          } catch {
          }
        }
      } else {
        setSubscreen(new MainSubscreen2());
      }
    }
    onUnload() {
      this.cleanup();
    }
    onExit() {
      this.cleanup();
    }
    cleanup() {
      if (this.modalElement) {
        this.modalElement.remove();
        this.modalElement = null;
      }
      if (this.rootElement) {
        this.rootElement.remove();
        this.rootElement = null;
      }
      this.contentArea = null;
    }
    getSubjectName() {
      if (this.isSelf) {
        return typeof Player !== "undefined" ? Player.Name || "Player" : "Player";
      }
      return this.target?.Name || (typeof this.target?.MemberNumber === "number" ? `Member #${this.target.MemberNumber}` : "Target");
    }
    createRootUI() {
      this.cleanup();
      const subjectName = this.getSubjectName();
      const backdrop = document.createElement("div");
      backdrop.style.cssText = `
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            background: #191f2b;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 100;
            color: #e0e6ed;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            box-sizing: border-box;
            user-select: none;
        `;
      const container = document.createElement("div");
      container.style.cssText = `
            width: ${getRelativeWidth(1800)}px;
            height: ${getRelativeHeight(900)}px;
            display: flex;
            flex-direction: column;
            gap: 14px;
            box-sizing: border-box;
        `;
      const header = document.createElement("div");
      header.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(80, 100, 140, 0.35);
        `;
      const titleBox = document.createElement("div");
      titleBox.innerHTML = `
            <div style="font-size: 22px; font-weight: bold; color: #64b5f6;">
                Quality of Club \u2022 ${this.isSelf ? subjectName : `Inspecting ${subjectName}`}
            </div>
            <div style="font-size: 13px; color: #90a4ae; margin-top: 2px;">
                ${this.isSelf ? "Manage your loaded addons, locked rules, authority roles, and permissions." : `Remote inspector and authority manager for ${subjectName}.`}
            </div>
        `;
      const backBtn = document.createElement("button");
      backBtn.textContent = "\u2715 Close";
      backBtn.style.cssText = `
            padding: 10px 24px;
            background: rgba(220, 50, 50, 0.85);
            border: 1px solid #ef5350;
            color: white;
            font-size: 15px;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.15s ease;
        `;
      backBtn.addEventListener("click", () => this.exit());
      header.appendChild(titleBox);
      header.appendChild(backBtn);
      container.appendChild(header);
      const tabBar = document.createElement("div");
      tabBar.style.cssText = "display: flex; gap: 10px; flex-wrap: wrap;";
      const tabs = [
        { id: "addons", label: "\u{1F4E6} Addons & Compliance" },
        { id: "rules", label: "\u{1F512} Enforce Rules" },
        { id: "roles", label: "\u{1F451} Role Management" },
        { id: "permissions", label: "\u{1F6E1}\uFE0F Permission Settings" },
        { id: "settings", label: "\u2699\uFE0F Preferences" }
      ];
      tabs.forEach((tab) => {
        const isSelected = this.activeTab === tab.id;
        const tabBtn = document.createElement("button");
        tabBtn.textContent = tab.label;
        tabBtn.style.cssText = `
                padding: 10px 20px;
                border-radius: 6px;
                font-size: 13.5px;
                font-weight: bold;
                cursor: pointer;
                background: ${isSelected ? "#1976d2" : "rgba(45, 55, 75, 0.8)"};
                border: 1px solid ${isSelected ? "#42a5f5" : "rgba(80, 100, 140, 0.4)"};
                color: ${isSelected ? "white" : "#90a4ae"};
                transition: all 0.15s ease;
            `;
        tabBtn.addEventListener("click", () => {
          this.activeTab = tab.id;
          this.createRootUI();
          this.renderTabContent();
        });
        tabBar.appendChild(tabBtn);
      });
      container.appendChild(tabBar);
      const contentArea = document.createElement("div");
      contentArea.style.cssText = `
            flex: 1;
            overflow-y: auto;
            background: rgba(25, 31, 43, 0.95);
            border: 1px solid rgba(80, 100, 140, 0.35);
            border-radius: 8px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            box-sizing: border-box;
        `;
      container.appendChild(contentArea);
      backdrop.appendChild(container);
      document.body.appendChild(backdrop);
      this.rootElement = backdrop;
      this.contentArea = contentArea;
    }
    async loadTargetData() {
      if (!this.target || typeof this.target.MemberNumber !== "number") {
        this.errorMessage = "Invalid target character.";
        this.renderTabContent();
        return;
      }
      this.isLoading = true;
      this.errorMessage = null;
      this.renderTabContent();
      const res = await requestInspect(this.target.MemberNumber);
      this.isLoading = false;
      if (!res.success || !res.data) {
        this.errorMessage = res.error || "Failed to inspect target player.";
      } else {
        this.targetData = res.data;
        this.targetRulesCopy = structuredClone(res.data.rules || []);
      }
      this.renderTabContent();
    }
    renderTabContent() {
      if (!this.contentArea) return;
      this.contentArea.innerHTML = "";
      if (!this.isSelf && this.isLoading) {
        this.contentArea.innerHTML = "<div style='font-size: 16px; color: #64b5f6; padding: 24px; text-align: center;'>Querying Quality of Club manifest and authority from target player...</div>";
        return;
      }
      if (!this.isSelf && this.errorMessage) {
        this.contentArea.innerHTML = `
                <div style='font-size: 15px; color: #ef5350; padding: 18px; background: rgba(239, 83, 80, 0.1); border: 1px solid #ef5350; border-radius: 6px;'>
                    Inspection Error: ${this.errorMessage}
                </div>
                <button id='zc-retry-inspect' style='padding: 10px 22px; border-radius: 6px; background: #1976d2; color: white; border: none; font-weight: bold; width: fit-content; cursor: pointer; margin-top: 10px;'>
                    \u{1F504} Retry Inspection
                </button>
            `;
        const retry = this.contentArea.querySelector("#zc-retry-inspect");
        retry?.addEventListener("click", () => this.loadTargetData());
        return;
      }
      switch (this.activeTab) {
        case "addons":
          this.renderAddonsTab();
          break;
        case "rules":
          this.renderRulesTab();
          break;
        case "roles":
          this.renderRolesTab();
          break;
        case "permissions":
          this.renderPermissionsTab();
          break;
        case "settings":
          this.renderSettingsTab();
          break;
        default:
          this.renderAddonsTab();
          break;
      }
    }
    // ==========================================
    // TAB 1: ADDONS & COMPLIANCE
    // ==========================================
    renderAddonsTab() {
      if (!this.contentArea) return;
      this.contentArea.innerHTML = "";
      const subjectName = this.getSubjectName();
      const canViewAddons = this.isSelf ? checkPermissionAccess("inspect_view_addons") : this.targetData?.canViewAddons ?? true;
      const canViewRules = this.isSelf ? checkPermissionAccess("inspect_view_rules") : this.targetData?.canViewRules ?? true;
      const canRemoveRules = this.isSelf ? checkPermissionAccess("rules_remove_rules") : this.targetData?.callerPermissions?.rules_remove_rules ?? false;
      const canForceCompliance = this.isSelf ? checkPermissionAccess("rules_force_compliance") : this.targetData?.callerPermissions?.rules_force_compliance ?? false;
      const canForceInjection = this.isSelf ? true : this.targetData?.callerPermissions?.rules_force_injection ?? false;
      const isForcedInjectionAllowed = this.isSelf ? true : this.targetData?.preferences?.allowForcedInjection ?? false;
      const mods = this.isSelf ? getLoadedMods2() : this.targetData?.mods || [];
      const rules = this.isSelf ? modStorage.inspector.rules : this.targetRulesCopy.length > 0 ? this.targetRulesCopy : this.targetData?.rules || [];
      const compliance = checkComplianceAgainstRules(mods, rules);
      if (this.isSelf && compliance.hasRules && compliance.missing.length > 0 && modStorage.inspector.autoLoadMode === "Silent") {
        evaluateCompliance().then((rep) => {
          if (rep.isCompliant && this.activeTab === "addons") {
            this.renderAddonsTab();
          }
        });
      }
      if (canViewRules) {
        const banner = document.createElement("div");
        if (!compliance.hasRules) {
          banner.style.cssText = `
                    padding: 14px 20px;
                    border-radius: 6px;
                    background: rgba(41, 121, 255, 0.15);
                    border: 1px solid #2979ff;
                    color: #90caf9;
                    margin-bottom: 12px;
                `;
          banner.innerHTML = `
                    <div style="font-size: 15px; font-weight: bold;">\u2139\uFE0F NO ACTIVE RULES CONFIGURED</div>
                    <div style="font-size: 13px; font-weight: normal; margin-top: 4px; color: #cfd8dc;">
                        No mandatory or forbidden addon rules are currently locked on ${subjectName}.
                        Switch to the <b>\u{1F512} Enforce Rules</b> tab to configure rules.
                    </div>
                `;
        } else if (compliance.isCompliant) {
          banner.style.cssText = `
                    padding: 14px 20px;
                    border-radius: 6px;
                    background: rgba(46, 125, 50, 0.25);
                    border: 1px solid #4caf50;
                    color: #a5d6a7;
                    margin-bottom: 12px;
                `;
          banner.innerHTML = `
                    <div style="font-size: 15px; font-weight: bold;">\u2713 FULLY COMPLIANT: All ${rules.length} active addon rule(s) met.</div>
                    <div style="font-size: 13px; font-weight: normal; margin-top: 4px; color: #cfd8dc;">
                        ${subjectName} satisfies all mandatory and forbidden addon requirements.
                    </div>
                `;
        } else {
          banner.style.cssText = `
                    padding: 14px 20px;
                    border-radius: 6px;
                    background: rgba(198, 40, 40, 0.3);
                    border: 1px solid #ef5350;
                    color: #ffcdd2;
                    margin-bottom: 12px;
                `;
          banner.innerHTML = `
                    <div style="font-size: 15px; font-weight: bold;">\u26A0\uFE0F POLICY VIOLATION: ${subjectName} is NON-COMPLIANT!</div>
                    <div style="font-size: 13px; font-weight: normal; margin-top: 4px; color: #cfd8dc;">
                        ${compliance.missing.length > 0 ? `Missing Mandatory: <b>${compliance.missing.map((m) => m.modName).join(", ")}</b>. ` : ""}
                        ${compliance.forbidden.length > 0 ? `Running Forbidden: <b>${compliance.forbidden.map((m) => m.modName).join(", ")}</b>.` : ""}
                    </div>
                `;
        }
        this.contentArea.appendChild(banner);
      } else {
        const ruleLockBanner = document.createElement("div");
        ruleLockBanner.style.cssText = "padding: 14px 20px; border-radius: 6px; background: rgba(239, 83, 80, 0.15); border: 1px solid #ef5350; color: #ef9a9a; margin-bottom: 12px;";
        ruleLockBanner.innerHTML = `
                <div style="font-size: 15px; font-weight: bold;">\u{1F512} ACTIVE RULES & COMPLIANCE HIDDEN</div>
                <div style="font-size: 13px; margin-top: 4px; color: #ffcdd2;">You do not meet the minimum role required to view active addon rules on ${subjectName}.</div>
            `;
        this.contentArea.appendChild(ruleLockBanner);
      }
      if (canViewRules && (canForceCompliance || canRemoveRules && rules.length > 0)) {
        const toolbar = document.createElement("div");
        toolbar.style.cssText = "display: flex; gap: 10px; margin-bottom: 14px; flex-wrap: wrap;";
        if (canForceCompliance) {
          const forceBtn = document.createElement("button");
          forceBtn.textContent = "\u26A1 Force Compliance Evaluation Now";
          forceBtn.style.cssText = "padding: 9px 18px; border-radius: 5px; background: #1565c0; border: 1px solid #42a5f5; color: white; font-weight: bold; font-size: 13px; cursor: pointer; transition: all 0.2s;";
          forceBtn.addEventListener("click", async () => {
            forceBtn.disabled = true;
            forceBtn.textContent = "\u23F3 Evaluating...";
            if (this.isSelf) {
              const report = await evaluateCompliance();
              toastsManager.info({
                title: `${MOD_NAME} Compliance Check`,
                message: report.isCompliant ? "All addon rules are currently satisfied." : `Check complete: ${report.missingRequired.length} missing, ${report.detectedForbidden.length} forbidden.`,
                duration: 4e3
              });
              this.renderAddonsTab();
            } else if (this.target && typeof this.target.MemberNumber === "number") {
              const res = await requestTriggerCompliance(this.target.MemberNumber);
              if (res.success && res.data?.report) {
                toastsManager.info({
                  title: `${MOD_NAME} Compliance Evaluated`,
                  message: res.data.report.isCompliant ? `${subjectName} satisfies all rules!` : `${subjectName} has ${res.data.report.missingCount} missing mandatory, ${res.data.report.forbiddenCount} forbidden addons.`,
                  duration: 5e3
                });
                this.loadTargetData();
              } else {
                toastsManager.error({
                  title: `${MOD_NAME} Trigger Failed`,
                  message: res.error || "Target player rejected compliance trigger.",
                  duration: 4e3
                });
              }
            }
            forceBtn.disabled = false;
            forceBtn.textContent = "\u26A1 Force Compliance Evaluation Now";
          });
          toolbar.appendChild(forceBtn);
          if (!this.isSelf && canForceInjection && compliance.missing.length > 0) {
            const forceInjectAllBtn = document.createElement("button");
            forceInjectAllBtn.textContent = `\u{1F489} Force Inject All Missing Addons (${compliance.missing.length})`;
            forceInjectAllBtn.style.cssText = "padding: 9px 18px; border-radius: 5px; background: rgba(76, 175, 80, 0.3); border: 1px solid #4caf50; color: #a5d6a7; font-weight: bold; font-size: 13px; cursor: pointer; transition: all 0.2s;";
            forceInjectAllBtn.addEventListener("click", async () => {
              if (!this.target || typeof this.target.MemberNumber !== "number") return;
              forceInjectAllBtn.disabled = true;
              forceInjectAllBtn.textContent = "\u23F3 Injecting Addons...";
              const res = await requestForceInject(this.target.MemberNumber, "all");
              if (res.success) {
                toastsManager.success({
                  title: `${MOD_NAME} Injection Complete`,
                  message: `Injected missing addons on ${subjectName}.`,
                  duration: 5e3
                });
                await this.loadTargetData();
              } else {
                toastsManager.error({
                  title: `${MOD_NAME} Injection Failed`,
                  message: res.error || "Failed to inject addons on target.",
                  duration: 5e3
                });
                forceInjectAllBtn.disabled = false;
                forceInjectAllBtn.textContent = `\u{1F489} Force Inject All Missing Addons (${compliance.missing.length})`;
              }
            });
            toolbar.appendChild(forceInjectAllBtn);
          }
        }
        if (canRemoveRules && rules.length > 0) {
          const clearAllBtn = document.createElement("button");
          clearAllBtn.textContent = "\u{1F5D1}\uFE0F Clear All Rules";
          clearAllBtn.style.cssText = "padding: 9px 18px; border-radius: 5px; background: rgba(198, 40, 40, 0.4); border: 1px solid #ef5350; color: #ffcdd2; font-weight: bold; font-size: 13px; cursor: pointer; transition: all 0.2s;";
          clearAllBtn.addEventListener("click", async () => {
            if (!confirm(`Are you sure you want to remove ALL active rules from ${subjectName}?`)) return;
            this.targetRulesCopy = [];
            if (this.isSelf) {
              modStorage.inspector.rules = [];
              saveStorage();
              syncStorage();
              toastsManager.info({ title: `${MOD_NAME} Rules Cleared`, message: "All addon rules cleared.", duration: 3e3 });
              this.renderAddonsTab();
            } else if (this.target && typeof this.target.MemberNumber === "number") {
              const res = await requestSetRules(this.target.MemberNumber, []);
              if (res.success) {
                if (this.targetData) this.targetData.rules = [];
                toastsManager.info({ title: `${MOD_NAME} Rules Cleared`, message: `All rules cleared from ${subjectName}.`, duration: 3e3 });
                this.renderAddonsTab();
              } else {
                toastsManager.error({ title: `${MOD_NAME} Clear Failed`, message: res.error || "Failed to clear rules.", duration: 4e3 });
              }
            }
          });
          toolbar.appendChild(clearAllBtn);
        }
        this.contentArea.appendChild(toolbar);
      }
      if (canViewRules && compliance.hasRules) {
        const rulesSection = document.createElement("div");
        rulesSection.style.cssText = "display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px;";
        rulesSection.innerHTML = `<div style="font-size: 15px; font-weight: bold; color: #64b5f6;">Rule Requirements & Live Status (${rules.length}):</div>`;
        compliance.details.forEach((detail) => {
          const isMandatory = detail.rule.type === "required" || detail.rule.type === "mandatory";
          const isMet = detail.status === "met";
          const card = document.createElement("div");
          card.style.cssText = `
                    background: rgba(35, 43, 60, 0.85);
                    border-left: 5px solid ${isMet ? "#4caf50" : "#ef5350"};
                    border: 1px solid rgba(80, 100, 140, 0.4);
                    border-radius: 6px;
                    padding: 10px 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                `;
          const matchedNote = detail.matchedMod ? ` (Matched: ${detail.matchedMod.name}${detail.matchedMod.version ? ` v${detail.matchedMod.version}` : ""})` : "";
          const leftDiv = document.createElement("div");
          leftDiv.innerHTML = `
                    <div style="font-size: 14px; font-weight: bold; color: #e0e6ed;">${detail.rule.modName}</div>
                    <div style="font-size: 12px; color: ${isMet ? "#81c784" : "#e57373"}; margin-top: 2px;">
                        ${isMandatory ? isMet ? `\u2713 Mandatory requirement satisfied${matchedNote}` : "\u274C MANDATORY REQUIREMENT VIOLATED: Mod is NOT loaded in session!" : isMet ? "\u2713 Forbidden rule satisfied (Mod is not running)" : `\u{1F6AB} FORBIDDEN RULE VIOLATED: Mod is actively running${matchedNote}!`}
                    </div>
                `;
          const rightDiv = document.createElement("div");
          rightDiv.style.cssText = "display: flex; align-items: center; gap: 8px;";
          const badge = document.createElement("span");
          badge.style.cssText = `background: ${isMet ? "rgba(76, 175, 80, 0.2)" : "rgba(244, 67, 54, 0.2)"}; color: ${isMet ? "#81c784" : "#e57373"}; border: 1px solid ${isMet ? "#4caf50" : "#f44336"}; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold;`;
          badge.textContent = isMet ? "MET" : "VIOLATION";
          rightDiv.appendChild(badge);
          if (isMandatory && !isMet) {
            if (!this.isSelf && canForceInjection) {
              const forceInjectBtn = document.createElement("button");
              forceInjectBtn.textContent = "\u{1F489} Force Inject";
              forceInjectBtn.title = `Remotely force injection of ${detail.rule.modName} on ${subjectName}`;
              forceInjectBtn.style.cssText = "padding: 4px 10px; border-radius: 4px; background: rgba(76, 175, 80, 0.25); border: 1px solid #4caf50; color: #a5d6a7; font-size: 11px; font-weight: bold; cursor: pointer; transition: all 0.15s;";
              forceInjectBtn.addEventListener("click", async () => {
                if (!this.target || typeof this.target.MemberNumber !== "number") return;
                forceInjectBtn.disabled = true;
                forceInjectBtn.textContent = "\u23F3 Injecting...";
                const res = await requestForceInject(this.target.MemberNumber, detail.rule.modId);
                if (res.success) {
                  toastsManager.success({
                    title: `${MOD_NAME} Addon Injected`,
                    message: `${detail.rule.modName} injected on ${subjectName}!`,
                    duration: 4e3
                  });
                  await this.loadTargetData();
                } else {
                  toastsManager.error({
                    title: `${MOD_NAME} Injection Failed`,
                    message: res.error || "Target client rejected addon injection.",
                    duration: 4e3
                  });
                  forceInjectBtn.disabled = false;
                  forceInjectBtn.textContent = "\u{1F489} Force Inject";
                }
              });
              rightDiv.appendChild(forceInjectBtn);
            } else if (this.isSelf) {
              const injectSelfBtn = document.createElement("button");
              injectSelfBtn.textContent = "\u{1F489} Inject Now";
              injectSelfBtn.title = `Inject ${detail.rule.modName} into your session now`;
              injectSelfBtn.style.cssText = "padding: 4px 10px; border-radius: 4px; background: rgba(76, 175, 80, 0.25); border: 1px solid #4caf50; color: #a5d6a7; font-size: 11px; font-weight: bold; cursor: pointer; transition: all 0.15s;";
              injectSelfBtn.addEventListener("click", async () => {
                injectSelfBtn.disabled = true;
                injectSelfBtn.textContent = "\u23F3 Injecting...";
                const ok = await loadCuratedMod(detail.rule.modId);
                if (ok) {
                  toastsManager.success({
                    title: `${MOD_NAME} Addon Injected`,
                    message: `${detail.rule.modName} has been injected and activated!`,
                    duration: 3500
                  });
                  await evaluateCompliance();
                  this.renderAddonsTab();
                } else {
                  toastsManager.error({
                    title: `${MOD_NAME} Injection Failed`,
                    message: `Could not load ${detail.rule.modName}. Check URL or network console.`,
                    duration: 4e3
                  });
                  injectSelfBtn.disabled = false;
                  injectSelfBtn.textContent = "\u{1F489} Inject Now";
                }
              });
              rightDiv.appendChild(injectSelfBtn);
            }
          }
          if (canRemoveRules) {
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "\u{1F5D1}\uFE0F Remove";
            removeBtn.title = "Remove this active rule";
            removeBtn.style.cssText = "padding: 4px 10px; border-radius: 4px; background: rgba(198, 40, 40, 0.2); border: 1px solid #ef5350; color: #ef9a9a; font-size: 11px; font-weight: bold; cursor: pointer; transition: all 0.15s;";
            removeBtn.addEventListener("click", async () => {
              this.targetRulesCopy = this.targetRulesCopy.filter((r) => r.modId.toLowerCase() !== detail.rule.modId.toLowerCase());
              if (this.isSelf) {
                modStorage.inspector.rules = structuredClone(this.targetRulesCopy);
                saveStorage();
                syncStorage();
                toastsManager.info({ title: `${MOD_NAME} Rule Removed`, message: `Rule for ${detail.rule.modName} removed.`, duration: 2500 });
                this.renderAddonsTab();
              } else if (this.target && typeof this.target.MemberNumber === "number") {
                const res = await requestSetRules(this.target.MemberNumber, this.targetRulesCopy);
                if (res.success) {
                  if (this.targetData) this.targetData.rules = structuredClone(this.targetRulesCopy);
                  toastsManager.info({ title: `${MOD_NAME} Rule Removed`, message: `Rule for ${detail.rule.modName} removed from ${subjectName}.`, duration: 2500 });
                  this.renderAddonsTab();
                } else {
                  toastsManager.error({ title: `${MOD_NAME} Remove Failed`, message: res.error || "Failed to remove rule.", duration: 4e3 });
                }
              }
            });
            rightDiv.appendChild(removeBtn);
          }
          card.appendChild(leftDiv);
          card.appendChild(rightDiv);
          rulesSection.appendChild(card);
        });
        this.contentArea.appendChild(rulesSection);
      }
      if (canViewAddons) {
        const modsHeader = document.createElement("div");
        modsHeader.style.cssText = "font-size: 15px; font-weight: bold; color: #64b5f6; margin-bottom: 8px;";
        modsHeader.textContent = `Loaded Addons in Session (${mods.length}):`;
        this.contentArea.appendChild(modsHeader);
        if (mods.length === 0) {
          const empty = document.createElement("div");
          empty.style.cssText = "color: #90a4ae; padding: 20px; text-align: center; background: rgba(30, 36, 48, 0.6); border-radius: 6px;";
          empty.textContent = "No external addons detected in session.";
          this.contentArea.appendChild(empty);
        } else {
          for (const mod of mods) {
            const card = document.createElement("div");
            card.style.cssText = "background: rgba(35, 43, 60, 0.85); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 6px; padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;";
            card.innerHTML = `
                        <div>
                            <div style="font-size: 15px; font-weight: bold; color: #64b5f6;">${mod.name}</div>
                            <div style="font-size: 12px; color: #8fa0b5; margin-top: 2px;">ID: ${mod.id}${mod.repository ? ` \u2022 Repo: ${mod.repository}` : ""}</div>
                        </div>
                        <span style="background: rgba(41, 121, 255, 0.2); border: 1px solid #2979ff; color: #82b1ff; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                            v${mod.version || "Active"}
                        </span>
                    `;
            this.contentArea.appendChild(card);
          }
        }
      } else {
        const addonLockNotice = document.createElement("div");
        addonLockNotice.style.cssText = "padding: 14px 20px; border-radius: 6px; background: rgba(239, 83, 80, 0.15); border: 1px solid #ef5350; color: #ef9a9a;";
        addonLockNotice.innerHTML = `
                <div style="font-size: 15px; font-weight: bold;">\u{1F512} LOADED ADDONS HIDDEN</div>
                <div style="font-size: 13px; margin-top: 4px; color: #ffcdd2;">You do not meet the minimum role required to view loaded addons in ${subjectName}'s session.</div>
            `;
        this.contentArea.appendChild(addonLockNotice);
      }
    }
    // ==========================================
    // TAB 2: ENFORCE RULES
    // ==========================================
    renderRulesTab() {
      if (!this.contentArea) return;
      this.contentArea.innerHTML = "";
      const subjectName = this.getSubjectName();
      if (this.isSelf) {
        this.targetRulesCopy = structuredClone(modStorage.inspector.rules || []);
      }
      const canMandatory = this.isSelf ? checkPermissionAccess("rules_lock_mandatory") : this.targetData?.callerPermissions?.rules_lock_mandatory ?? false;
      const canForbidden = this.isSelf ? checkPermissionAccess("rules_lock_forbidden") : this.targetData?.callerPermissions?.rules_lock_forbidden ?? false;
      const canRemove = this.isSelf ? checkPermissionAccess("rules_remove_rules") : this.targetData?.callerPermissions?.rules_remove_rules ?? false;
      if (!canMandatory && !canForbidden && !canRemove) {
        const lockNotice = document.createElement("div");
        lockNotice.style.cssText = "color: #ef5350; font-size: 13px; font-weight: bold; padding: 14px; background: rgba(239, 83, 80, 0.12); border: 1px solid #ef5350; border-radius: 6px; margin-bottom: 14px;";
        lockNotice.textContent = this.isSelf ? "\u{1F512} Rule management is locked: You do not have self-access to modify addon rules on yourself (controlled by your dominant)." : `\u{1F512} Rule enforcement is restricted: You do not meet the minimum role required to lock addon rules on ${subjectName}.`;
        this.contentArea.appendChild(lockNotice);
      }
      if (this.targetRulesCopy.length > 0) {
        const activeHeader = document.createElement("div");
        activeHeader.style.cssText = "font-size: 15px; font-weight: bold; color: #64b5f6; margin-bottom: 8px;";
        activeHeader.textContent = `Currently Active Rules (${this.targetRulesCopy.length}):`;
        this.contentArea.appendChild(activeHeader);
        const activeList = document.createElement("div");
        activeList.style.cssText = "display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px;";
        for (const rule of this.targetRulesCopy) {
          const isMandatory = rule.type === "required" || rule.type === "mandatory";
          const card = document.createElement("div");
          card.style.cssText = `
                    background: rgba(35, 43, 60, 0.85);
                    border-left: 5px solid ${isMandatory ? "#4caf50" : "#ef5350"};
                    border: 1px solid rgba(80, 100, 140, 0.4);
                    border-radius: 6px;
                    padding: 10px 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                `;
          const left = document.createElement("div");
          left.innerHTML = `
                    <div style="font-size: 14px; font-weight: bold; color: #e0e6ed;">${rule.modName}</div>
                    <div style="font-size: 12px; color: #8fa0b5; margin-top: 2px;">Enforced by: Member #${rule.enforcedBy}${rule.enforcedByName ? ` (${rule.enforcedByName})` : ""}</div>
                `;
          const right = document.createElement("div");
          right.style.cssText = "display: flex; align-items: center; gap: 8px;";
          const badge = document.createElement("span");
          badge.style.cssText = `background: ${isMandatory ? "rgba(76, 175, 80, 0.2)" : "rgba(244, 67, 54, 0.2)"}; color: ${isMandatory ? "#81c784" : "#e57373"}; border: 1px solid ${isMandatory ? "#4caf50" : "#f44336"}; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold;`;
          badge.textContent = isMandatory ? "\u{1F512} MANDATORY" : "\u{1F6AB} FORBIDDEN";
          right.appendChild(badge);
          if (canRemove) {
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "\u{1F5D1}\uFE0F Remove";
            removeBtn.style.cssText = "padding: 4px 10px; border-radius: 4px; background: rgba(198, 40, 40, 0.2); border: 1px solid #ef5350; color: #ef9a9a; font-size: 11px; font-weight: bold; cursor: pointer; transition: all 0.15s;";
            removeBtn.addEventListener("click", async () => {
              this.targetRulesCopy = this.targetRulesCopy.filter((r) => r.modId.toLowerCase() !== rule.modId.toLowerCase());
              if (this.isSelf) {
                modStorage.inspector.rules = structuredClone(this.targetRulesCopy);
                saveStorage();
                syncStorage();
                toastsManager.info({ title: `${MOD_NAME} Rule Removed`, message: `Rule for ${rule.modName} removed.`, duration: 2500 });
                this.renderRulesTab();
              } else if (this.target && typeof this.target.MemberNumber === "number") {
                const res = await requestSetRules(this.target.MemberNumber, this.targetRulesCopy);
                if (res.success) {
                  if (this.targetData) this.targetData.rules = structuredClone(this.targetRulesCopy);
                  toastsManager.info({ title: `${MOD_NAME} Rule Removed`, message: `Rule for ${rule.modName} removed from ${subjectName}.`, duration: 2500 });
                  this.renderRulesTab();
                } else {
                  toastsManager.error({ title: `${MOD_NAME} Remove Failed`, message: res.error || "Failed to remove rule.", duration: 4e3 });
                }
              }
            });
            right.appendChild(removeBtn);
          }
          card.appendChild(left);
          card.appendChild(right);
          activeList.appendChild(card);
        }
        this.contentArea.appendChild(activeList);
      }
      const catalogHeader = document.createElement("div");
      catalogHeader.style.cssText = "display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;";
      const allCatalogMods = Object.values(getAllCatalogMods());
      catalogHeader.innerHTML = `
            <div style="font-size: 15px; font-weight: bold; color: #64b5f6;">
                Community & Curated Addon Catalog (${allCatalogMods.length}):
            </div>
        `;
      const searchInput = document.createElement("input");
      searchInput.type = "text";
      searchInput.placeholder = "\u{1F50D} Search addons (name, ID, author, tags)...";
      searchInput.value = this.catalogSearchText;
      searchInput.style.cssText = `
            padding: 8px 14px;
            background: rgba(20, 26, 38, 0.9);
            border: 1px solid rgba(80, 100, 140, 0.5);
            color: white;
            font-size: 13px;
            border-radius: 6px;
            width: 340px;
            outline: none;
        `;
      catalogHeader.appendChild(searchInput);
      this.contentArea.appendChild(catalogHeader);
      const catalogContainer = document.createElement("div");
      catalogContainer.style.cssText = "display: flex; flex-direction: column; gap: 8px;";
      this.contentArea.appendChild(catalogContainer);
      const renderCatalogItems = () => {
        catalogContainer.innerHTML = "";
        const query = this.catalogSearchText.toLowerCase().trim();
        const filteredList = allCatalogMods.filter((item) => {
          if (!query) return true;
          if (item.name.toLowerCase().includes(query)) return true;
          if (item.id.toLowerCase().includes(query)) return true;
          if (item.description && item.description.toLowerCase().includes(query)) return true;
          if (item.author && item.author.toLowerCase().includes(query)) return true;
          if (Array.isArray(item.tags) && item.tags.some((t) => t.toLowerCase().includes(query))) return true;
          if (Array.isArray(item.detectKeys) && item.detectKeys.some((k) => k.toLowerCase().includes(query))) return true;
          return false;
        });
        if (filteredList.length === 0) {
          const emptyNotice = document.createElement("div");
          emptyNotice.style.cssText = "padding: 20px; text-align: center; color: #90a4ae; background: rgba(30, 36, 48, 0.5); border-radius: 6px;";
          emptyNotice.textContent = `No addons match "${this.catalogSearchText}".`;
          catalogContainer.appendChild(emptyNotice);
          return;
        }
        for (const item of filteredList) {
          const row = document.createElement("div");
          row.style.cssText = "background: rgba(35, 43, 60, 0.85); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 6px; padding: 12px 18px; display: flex; align-items: center; justify-content: space-between;";
          const tagPills = Array.isArray(item.tags) && item.tags.length > 0 ? item.tags.map((t) => `<span style="background: rgba(41, 121, 255, 0.15); border: 1px solid rgba(66, 165, 245, 0.3); color: #90caf9; font-size: 10px; padding: 1px 5px; border-radius: 3px;">${t}</span>`).join(" ") : "";
          const authorNote = item.author ? `<span style="color: #78909c; font-size: 11px;">by ${item.author}</span>` : "";
          const left = document.createElement("div");
          left.style.cssText = "max-width: 65%;";
          left.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                        <span style="font-size: 15px; font-weight: bold; color: #64b5f6;">${item.name}</span>
                        ${authorNote}
                        ${item.isCustom ? '<span style="background: rgba(255, 152, 0, 0.2); border: 1px solid #ff9800; color: #ffb74d; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 3px;">CUSTOM</span>' : ""}
                        ${tagPills}
                    </div>
                    <div style="font-size: 12px; color: #8fa0b5; margin-top: 3px; line-height: 1.4;">${item.description}</div>
                `;
          const existingRule = this.targetRulesCopy.find((r) => r.modId.toLowerCase() === item.id.toLowerCase());
          const currentState = existingRule ? existingRule.type === "required" ? "required" : existingRule.type : "none";
          const btnGroup = document.createElement("div");
          btnGroup.style.cssText = "display: flex; gap: 8px;";
          const createChoiceBtn = (state, label, color, enabled) => {
            const b = document.createElement("button");
            b.textContent = label;
            b.disabled = !enabled;
            const isSelected = currentState === state;
            b.style.cssText = `
                        padding: 7px 16px;
                        border-radius: 4px;
                        font-size: 13px;
                        font-weight: ${isSelected ? "bold" : "normal"};
                        cursor: ${enabled ? "pointer" : "not-allowed"};
                        background: ${isSelected ? color : "rgba(60, 70, 90, 0.4)"};
                        border: 1px solid ${isSelected ? color : "rgba(100, 120, 150, 0.4)"};
                        color: ${isSelected ? "white" : "#b0bec5"};
                        opacity: ${enabled ? "1" : "0.5"};
                        transition: all 0.15s ease;
                    `;
            b.addEventListener("click", async () => {
              if (!enabled) return;
              this.targetRulesCopy = this.targetRulesCopy.filter((r) => r.modId.toLowerCase() !== item.id.toLowerCase());
              if (state !== "none") {
                this.targetRulesCopy.push({
                  modId: item.id,
                  modName: item.name,
                  type: state,
                  enforcedBy: typeof Player !== "undefined" ? Player.MemberNumber || 0 : 0,
                  enforcedByName: typeof Player !== "undefined" ? Player.Name : void 0,
                  enforcedAt: Date.now()
                });
              }
              if (this.isSelf) {
                modStorage.inspector.rules = structuredClone(this.targetRulesCopy);
                saveStorage();
                syncStorage();
                evaluateCompliance();
                toastsManager.info({
                  title: `${MOD_NAME} Rules`,
                  message: `Rule for ${item.name} set to ${state === "none" ? "Neutral (Removed)" : state.toUpperCase()}.`,
                  duration: 2500
                });
                this.renderRulesTab();
              } else {
                if (this.targetData) {
                  this.targetData.rules = structuredClone(this.targetRulesCopy);
                }
                this.renderRulesTab();
                if (this.target && typeof this.target.MemberNumber === "number") {
                  const res = await requestSetRules(this.target.MemberNumber, this.targetRulesCopy);
                  if (res.success) {
                    toastsManager.info({
                      title: `${MOD_NAME} Rules`,
                      message: `Rule for ${item.name} synced to ${subjectName}.`,
                      duration: 2500
                    });
                  } else {
                    toastsManager.error({
                      title: `${MOD_NAME} Sync Failed`,
                      message: res.error || "Failed to sync rule to target.",
                      duration: 4e3
                    });
                  }
                }
              }
            });
            return b;
          };
          btnGroup.appendChild(createChoiceBtn("none", "\u{1F513} Neutral", "#78909c", canRemove));
          btnGroup.appendChild(createChoiceBtn("required", "\u{1F512} Mandatory", "#2e7d32", canMandatory));
          btnGroup.appendChild(createChoiceBtn("forbidden", "\u{1F6AB} Forbidden", "#c62828", canForbidden));
          row.appendChild(left);
          row.appendChild(btnGroup);
          catalogContainer.appendChild(row);
        }
      };
      searchInput.addEventListener("input", (e) => {
        this.catalogSearchText = e.target.value;
        renderCatalogItems();
      });
      renderCatalogItems();
      if (!this.isSelf) {
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "\u{1F4BE} Re-sync All Rules to Target";
        saveBtn.style.cssText = "padding: 12px 28px; border-radius: 6px; background: #2e7d32; border: 1px solid #4caf50; color: white; font-weight: bold; font-size: 15px; cursor: pointer; width: fit-content; margin-top: 14px;";
        saveBtn.addEventListener("click", async () => {
          if (!this.target || typeof this.target.MemberNumber !== "number") return;
          toastsManager.info({
            title: `${MOD_NAME} Syncing`,
            message: "Transmitting addon rules to target player...",
            duration: 3e3
          });
          const res = await requestSetRules(this.target.MemberNumber, this.targetRulesCopy);
          if (res.success) {
            if (this.targetData) {
              this.targetData.rules = structuredClone(this.targetRulesCopy);
            }
            toastsManager.success({
              title: `${MOD_NAME} Rules Synced`,
              message: "Addon rules successfully locked on target!",
              duration: 5e3
            });
          } else {
            toastsManager.error({
              title: `${MOD_NAME} Sync Failed`,
              message: res.error || "Target rejected rule sync.",
              duration: 5e3
            });
          }
        });
        this.contentArea.appendChild(saveBtn);
      }
    }
    // ==========================================
    // TAB 3: ROLE MANAGEMENT
    // ==========================================
    renderRolesTab() {
      if (!this.contentArea) return;
      this.contentArea.innerHTML = "";
      const subjectName = this.getSubjectName();
      const authority = this.isSelf ? modStorage.authority : this.targetData?.authority || { owners: [], mistresses: [], permissions: structuredClone(DEFAULT_PERMISSIONS) };
      const canEditRoles = this.isSelf ? checkPermissionAccess("authority_edit_roles") : this.targetData?.callerPermissions?.authority_edit_roles ?? false;
      const topRow = document.createElement("div");
      topRow.style.cssText = "display: flex; justify-content: space-between; align-items: flex-start; gap: 24px;";
      const leftCol = document.createElement("div");
      leftCol.style.cssText = "flex: 1; display: flex; flex-direction: column; gap: 16px;";
      const addCard = document.createElement("div");
      addCard.style.cssText = "background: rgba(35, 43, 60, 0.85); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 8px; padding: 18px;";
      addCard.innerHTML = `
            <div style="font-size: 16px; font-weight: bold; color: #64b5f6; margin-bottom: 6px;">
                Assign Custom Dominant Roles for ${subjectName}
            </div>
            <div style="font-size: 13px; color: #90a4ae; margin-bottom: 14px;">
                Enter a player's Member Number to grant them custom Owner or Mistress authority in Quality of Club.
            </div>
        `;
      const inputRow = document.createElement("div");
      inputRow.style.cssText = "display: flex; align-items: center; gap: 12px; flex-wrap: wrap;";
      const numInput = document.createElement("input");
      numInput.type = "number";
      numInput.placeholder = "Member Number";
      numInput.disabled = !canEditRoles;
      numInput.style.cssText = `
            padding: 8px 14px;
            background: rgba(20, 26, 38, 0.9);
            border: 1px solid rgba(80, 100, 140, 0.5);
            color: white;
            font-size: 14px;
            border-radius: 6px;
            width: 180px;
        `;
      const addOwnerBtn = document.createElement("button");
      addOwnerBtn.textContent = "Add as Owner";
      addOwnerBtn.disabled = !canEditRoles;
      addOwnerBtn.style.cssText = `
            padding: 9px 18px;
            background: ${canEditRoles ? "#1976d2" : "#455a64"};
            border: 1px solid #42a5f5;
            color: white;
            font-weight: bold;
            border-radius: 6px;
            cursor: ${canEditRoles ? "pointer" : "not-allowed"};
        `;
      addOwnerBtn.addEventListener("click", async () => {
        const val = parseInt(numInput.value.trim(), 10);
        if (!val) return;
        if (this.isSelf) {
          const res = addRoleMember("owner", val);
          if (res.success) {
            numInput.value = "";
            this.renderRolesTab();
          } else {
            alert(res.message);
          }
        } else if (this.target && typeof this.target.MemberNumber === "number") {
          const res = await requestUpdateAuthority(this.target.MemberNumber, { action: "add_role", role: "owner", memberNumber: val });
          if (res.success && res.data?.authority) {
            this.targetData.authority = res.data.authority;
            numInput.value = "";
            this.renderRolesTab();
          } else {
            alert(res.error || "Failed to add role.");
          }
        }
      });
      const addMistressBtn = document.createElement("button");
      addMistressBtn.textContent = "Add as Mistress";
      addMistressBtn.disabled = !canEditRoles;
      addMistressBtn.style.cssText = `
            padding: 9px 18px;
            background: ${canEditRoles ? "#7b1fa2" : "#455a64"};
            border: 1px solid #ba68c8;
            color: white;
            font-weight: bold;
            border-radius: 6px;
            cursor: ${canEditRoles ? "pointer" : "not-allowed"};
        `;
      addMistressBtn.addEventListener("click", async () => {
        const val = parseInt(numInput.value.trim(), 10);
        if (!val) return;
        if (this.isSelf) {
          const res = addRoleMember("mistress", val);
          if (res.success) {
            numInput.value = "";
            this.renderRolesTab();
          } else {
            alert(res.message);
          }
        } else if (this.target && typeof this.target.MemberNumber === "number") {
          const res = await requestUpdateAuthority(this.target.MemberNumber, { action: "add_role", role: "mistress", memberNumber: val });
          if (res.success && res.data?.authority) {
            this.targetData.authority = res.data.authority;
            numInput.value = "";
            this.renderRolesTab();
          } else {
            alert(res.error || "Failed to add role.");
          }
        }
      });
      inputRow.appendChild(numInput);
      inputRow.appendChild(addOwnerBtn);
      inputRow.appendChild(addMistressBtn);
      addCard.appendChild(inputRow);
      if (!canEditRoles) {
        const lockNotice = document.createElement("div");
        lockNotice.style.cssText = "color: #ef5350; font-size: 12px; margin-top: 8px; font-weight: bold;";
        lockNotice.textContent = "\u{1F512} Role editing is restricted by authority settings.";
        addCard.appendChild(lockNotice);
      }
      leftCol.appendChild(addCard);
      const listsCard = document.createElement("div");
      listsCard.style.cssText = "background: rgba(35, 43, 60, 0.85); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 8px; padding: 18px; display: flex; flex-direction: column; gap: 14px;";
      const ownersHeader = document.createElement("div");
      ownersHeader.innerHTML = `<span style="font-weight: bold; color: #64b5f6; font-size: 15px;">QoC Owners (${authority.owners.length})</span>`;
      listsCard.appendChild(ownersHeader);
      const ownersBox = document.createElement("div");
      ownersBox.style.cssText = "display: flex; flex-wrap: wrap; gap: 8px;";
      if (authority.owners.length === 0) {
        ownersBox.innerHTML = "<span style='color: #8fa0b5; font-size: 13px;'>No custom owners assigned.</span>";
      } else {
        authority.owners.forEach((id) => {
          const tag = document.createElement("div");
          tag.style.cssText = "display: flex; align-items: center; gap: 8px; background: rgba(25, 118, 210, 0.3); border: 1px solid #42a5f5; padding: 4px 12px; border-radius: 4px; font-size: 13px;";
          tag.innerHTML = `<span>Member #${id}</span>`;
          if (canEditRoles) {
            const rm = document.createElement("button");
            rm.textContent = "\u2715";
            rm.style.cssText = "background: none; border: none; color: #ef5350; cursor: pointer; font-weight: bold; font-size: 14px; margin-left: 4px;";
            rm.addEventListener("click", async () => {
              if (this.isSelf) {
                removeRoleMember("owner", id);
                this.renderRolesTab();
              } else if (this.target && typeof this.target.MemberNumber === "number") {
                const res = await requestUpdateAuthority(this.target.MemberNumber, { action: "remove_role", role: "owner", memberNumber: id });
                if (res.success && res.data?.authority) {
                  this.targetData.authority = res.data.authority;
                  this.renderRolesTab();
                }
              }
            });
            tag.appendChild(rm);
          }
          ownersBox.appendChild(tag);
        });
      }
      listsCard.appendChild(ownersBox);
      const mistressHeader = document.createElement("div");
      mistressHeader.style.cssText = "margin-top: 10px;";
      mistressHeader.innerHTML = `<span style="font-weight: bold; color: #ba68c8; font-size: 15px;">QoC Mistresses (${authority.mistresses.length})</span>`;
      listsCard.appendChild(mistressHeader);
      const mistressBox = document.createElement("div");
      mistressBox.style.cssText = "display: flex; flex-wrap: wrap; gap: 8px;";
      if (authority.mistresses.length === 0) {
        mistressBox.innerHTML = "<span style='color: #8fa0b5; font-size: 13px;'>No custom mistresses assigned.</span>";
      } else {
        authority.mistresses.forEach((id) => {
          const tag = document.createElement("div");
          tag.style.cssText = "display: flex; align-items: center; gap: 8px; background: rgba(123, 31, 162, 0.3); border: 1px solid #ba68c8; padding: 4px 12px; border-radius: 4px; font-size: 13px;";
          tag.innerHTML = `<span>Member #${id}</span>`;
          if (canEditRoles) {
            const rm = document.createElement("button");
            rm.textContent = "\u2715";
            rm.style.cssText = "background: none; border: none; color: #ef5350; cursor: pointer; font-weight: bold; font-size: 14px; margin-left: 4px;";
            rm.addEventListener("click", async () => {
              if (this.isSelf) {
                removeRoleMember("mistress", id);
                this.renderRolesTab();
              } else if (this.target && typeof this.target.MemberNumber === "number") {
                const res = await requestUpdateAuthority(this.target.MemberNumber, { action: "remove_role", role: "mistress", memberNumber: id });
                if (res.success && res.data?.authority) {
                  this.targetData.authority = res.data.authority;
                  this.renderRolesTab();
                }
              }
            });
            tag.appendChild(rm);
          }
          mistressBox.appendChild(tag);
        });
      }
      listsCard.appendChild(mistressBox);
      leftCol.appendChild(listsCard);
      topRow.appendChild(leftCol);
      const rightCol = document.createElement("div");
      rightCol.style.cssText = "width: 280px; display: flex; flex-direction: column; align-items: center; background: rgba(30, 36, 48, 0.85); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 8px; padding: 20px;";
      const pyramidTitle = document.createElement("div");
      pyramidTitle.style.cssText = "font-size: 15px; font-weight: bold; color: #64b5f6; margin-bottom: 16px; text-align: center;";
      pyramidTitle.textContent = "Hierarchy of Roles";
      rightCol.appendChild(pyramidTitle);
      const rolesList = [
        { name: subjectName, color: "#00e5ff", width: 140 },
        { name: "Clubowner", color: "#e0e6ed", width: 150 },
        { name: "Owner", color: "#e0e6ed", width: 160 },
        { name: "Lover", color: "#e0e6ed", width: 170 },
        { name: "Mistress", color: "#e0e6ed", width: 180 },
        { name: "Whitelist", color: "#e0e6ed", width: 190 },
        { name: "Friend", color: "#e0e6ed", width: 200 },
        { name: "Public", color: "#e0e6ed", width: 210 }
      ];
      rolesList.forEach((r, idx) => {
        const block = document.createElement("div");
        block.style.cssText = `
                width: ${r.width}px;
                padding: 6px 0;
                margin-bottom: 4px;
                background: ${idx === 0 ? "rgba(0, 229, 255, 0.15)" : "rgba(45, 55, 75, 0.8)"};
                border: 1px solid ${idx === 0 ? "#00e5ff" : "rgba(80, 100, 140, 0.4)"};
                color: ${r.color};
                font-size: 13px;
                font-weight: bold;
                text-align: center;
                border-radius: 4px;
            `;
        block.textContent = r.name;
        rightCol.appendChild(block);
        if (idx < rolesList.length - 1) {
          const arrow = document.createElement("div");
          arrow.style.cssText = "font-size: 10px; color: #607d8b; line-height: 10px; margin: -2px 0 2px 0;";
          arrow.textContent = "\u25BC";
          rightCol.appendChild(arrow);
        }
      });
      topRow.appendChild(rightCol);
      this.contentArea.appendChild(topRow);
    }
    // ==========================================
    // TAB 4: PERMISSION SETTINGS
    // ==========================================
    renderPermissionsTab() {
      if (!this.contentArea) return;
      this.contentArea.innerHTML = "";
      const subjectName = this.getSubjectName();
      const canEditMin = this.isSelf ? checkPermissionAccess("authority_edit_min_role") : this.targetData?.callerPermissions?.authority_edit_min_role ?? false;
      const canEditSelf = this.isSelf ? checkPermissionAccess("authority_edit_self_access") : this.targetData?.callerPermissions?.authority_edit_self_access ?? false;
      const filterBar = document.createElement("div");
      filterBar.style.cssText = "display: flex; align-items: center; gap: 12px; margin-bottom: 4px;";
      const filterLabel = document.createElement("span");
      filterLabel.textContent = "Filter:";
      filterLabel.style.cssText = "font-weight: bold; color: #90a4ae; font-size: 14px;";
      const filterInput = document.createElement("input");
      filterInput.type = "text";
      filterInput.placeholder = "Search permission by name or description...";
      filterInput.value = this.permissionFilter;
      filterInput.style.cssText = `
            flex: 1;
            padding: 8px 14px;
            background: rgba(20, 26, 38, 0.9);
            border: 1px solid rgba(80, 100, 140, 0.4);
            color: white;
            font-size: 14px;
            border-radius: 6px;
        `;
      filterInput.addEventListener("input", () => {
        this.permissionFilter = filterInput.value.toLowerCase().trim();
        this.updatePermissionsList(listContainer, subjectName, canEditMin, canEditSelf);
      });
      filterBar.appendChild(filterLabel);
      filterBar.appendChild(filterInput);
      this.contentArea.appendChild(filterBar);
      const headerRow = document.createElement("div");
      headerRow.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 16px;
            background: rgba(30, 36, 48, 0.6);
            border-bottom: 2px solid rgba(80, 100, 140, 0.4);
            font-weight: bold;
            font-size: 13px;
            color: #90caf9;
        `;
      headerRow.innerHTML = `
            <div style="flex: 1;">Permission Name & Scope</div>
            <div style="display: flex; align-items: center; gap: 40px; padding-right: 20px;">
                <span style="min-width: 150px; text-align: center;">${subjectName} is permitted</span>
                <span style="min-width: 160px; text-align: center;">Lowest permitted role</span>
            </div>
        `;
      this.contentArea.appendChild(headerRow);
      const listContainer = document.createElement("div");
      listContainer.style.cssText = "display: flex; flex-direction: column; gap: 8px;";
      this.contentArea.appendChild(listContainer);
      this.updatePermissionsList(listContainer, subjectName, canEditMin, canEditSelf);
    }
    updatePermissionsList(container, subjectName, canEditMin, canEditSelf) {
      container.innerHTML = "";
      const authority = this.isSelf ? modStorage.authority : this.targetData?.authority || { owners: [], mistresses: [], permissions: structuredClone(DEFAULT_PERMISSIONS) };
      const filtered = PERMISSION_DEFINITIONS.filter((def) => {
        if (!this.permissionFilter) return true;
        return def.name.toLowerCase().includes(this.permissionFilter) || def.description.toLowerCase().includes(this.permissionFilter);
      });
      if (filtered.length === 0) {
        const empty = document.createElement("div");
        empty.style.cssText = "color: #90a4ae; padding: 24px; text-align: center;";
        empty.textContent = "No matching permissions found.";
        container.appendChild(empty);
        return;
      }
      filtered.forEach((def) => {
        const currentSetting = authority.permissions[def.key] || { self: true, min: 2 /* owner */ };
        const row = document.createElement("div");
        row.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 16px;
                background: rgba(35, 43, 60, 0.85);
                border: 1px solid rgba(80, 100, 140, 0.35);
                border-radius: 6px;
                gap: 16px;
                transition: background 0.15s ease;
            `;
        const left = document.createElement("div");
        left.style.cssText = "flex: 1; display: flex; align-items: center; gap: 12px;";
        left.innerHTML = `
                <span style="font-size: 18px;">\u{1F512}</span>
                <div>
                    <div style="font-size: 15px; font-weight: bold; color: #e0e6ed;">${def.name}</div>
                    <div style="font-size: 12px; color: #90a4ae; margin-top: 2px;">${def.description}</div>
                </div>
            `;
        const right = document.createElement("div");
        right.style.cssText = "display: flex; align-items: center; gap: 40px; padding-right: 10px;";
        const selfBoxContainer = document.createElement("div");
        selfBoxContainer.style.cssText = "min-width: 150px; display: flex; justify-content: center;";
        const selfCheckbox = document.createElement("input");
        selfCheckbox.type = "checkbox";
        selfCheckbox.checked = currentSetting.self;
        selfCheckbox.disabled = !canEditSelf;
        selfCheckbox.style.cssText = `
                width: 22px;
                height: 22px;
                cursor: ${canEditSelf ? "pointer" : "not-allowed"};
                accent-color: #1976d2;
            `;
        selfCheckbox.addEventListener("change", async () => {
          const newVal = selfCheckbox.checked;
          if (this.isSelf) {
            if (!newVal && (def.key === "authority_edit_self_access" || def.key === "authority_edit_min_role")) {
              const ok = confirm(`\u26A0\uFE0F Surrendering Self-Access:

Are you sure you want to disable your own access to "${def.name}"?

You will lose the ability to modify or reclaim this permission yourself \u2014 only an authorized Owner or Mistress will be able to restore it.`);
              if (!ok) {
                selfCheckbox.checked = true;
                return;
              }
            }
            setPermissionSelfAccess(def.key, newVal);
            this.updatePermissionsList(container, subjectName, canEditMin, canEditSelf);
          } else if (this.target && typeof this.target.MemberNumber === "number") {
            const res = await requestUpdateAuthority(this.target.MemberNumber, { action: "set_self_access", perm: def.key, selfAllowed: newVal });
            if (res.success && res.data?.authority) {
              this.targetData.authority = res.data.authority;
              this.updatePermissionsList(container, subjectName, canEditMin, canEditSelf);
            } else {
              selfCheckbox.checked = !newVal;
              alert(res.error || "Failed to update target's self access.");
            }
          }
        });
        selfBoxContainer.appendChild(selfCheckbox);
        const roleBtnContainer = document.createElement("div");
        roleBtnContainer.style.cssText = "min-width: 160px; display: flex; justify-content: center;";
        const roleBtn = document.createElement("button");
        roleBtn.textContent = ACCESS_LEVEL_NAMES[currentSetting.min];
        roleBtn.disabled = !canEditMin;
        roleBtn.style.cssText = `
                padding: 8px 18px;
                width: 130px;
                text-align: center;
                background: ${currentSetting.min === 0 /* self */ ? "#00838f" : currentSetting.min <= 4 /* mistress */ ? "#1565c0" : "#455a64"};
                border: 1px solid ${canEditMin ? "#42a5f5" : "#607d8b"};
                color: white;
                font-size: 13px;
                font-weight: bold;
                border-radius: 4px;
                cursor: ${canEditMin ? "pointer" : "not-allowed"};
                transition: all 0.15s ease;
            `;
        roleBtn.addEventListener("click", () => {
          if (canEditMin) {
            this.openRoleSelectorModal(def, currentSetting.min, subjectName);
          }
        });
        roleBtnContainer.appendChild(roleBtn);
        right.appendChild(selfBoxContainer);
        right.appendChild(roleBtnContainer);
        row.appendChild(left);
        row.appendChild(right);
        container.appendChild(row);
      });
    }
    // ==========================================
    // ROLE SELECTION MODAL
    // ==========================================
    openRoleSelectorModal(def, currentMin, subjectName) {
      if (this.modalElement) this.modalElement.remove();
      let selectedRole = currentMin;
      const modalBackdrop = document.createElement("div");
      modalBackdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            user-select: none;
        `;
      const dialog = document.createElement("div");
      dialog.style.cssText = `
            width: min(90vw, 850px);
            background: #191f2b;
            border: 2px solid #64b5f6;
            border-radius: 8px;
            padding: 28px 32px;
            display: flex;
            flex-direction: column;
            gap: 18px;
            color: #e0e6ed;
            box-sizing: border-box;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
        `;
      dialog.innerHTML = `
            <div style="font-size: 18px; font-weight: bold; color: #64b5f6; border-bottom: 1px solid rgba(80,100,140,0.3); padding-bottom: 8px;">
                Authority: Changing minimum access to "${def.name}" for ${subjectName}
            </div>
            <div style="font-size: 14px; text-align: center; color: #cfd8dc; margin-top: 4px;">
                Please select the new lowest role that should still have this permission.
            </div>
            <div id="qoc-role-info" style="font-size: 13px; text-align: center; color: #90a4ae;">
                Currently set role: <b>${ACCESS_LEVEL_NAMES[currentMin]}</b> &nbsp;\u2192&nbsp; Newly selected role: <b id="qoc-selected-label" style="color: #64b5f6;">${ACCESS_LEVEL_NAMES[selectedRole]}</b>
            </div>
            <div style="font-size: 12px; text-align: center; color: #78909c;">
                All roles to the left of the selected one will also automatically get access.
            </div>
        `;
      const chainContainer = document.createElement("div");
      chainContainer.style.cssText = "display: flex; flex-direction: column; align-items: center; gap: 12px; margin: 10px 0;";
      const selfBtn = document.createElement("button");
      selfBtn.textContent = subjectName;
      selfBtn.style.cssText = `
            padding: 10px 28px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            border-radius: 4px;
            background: ${selectedRole === 0 /* self */ ? "#00e5ff" : "rgba(45, 55, 75, 0.8)"};
            border: 1px solid #00e5ff;
            color: ${selectedRole === 0 /* self */ ? "black" : "#00e5ff"};
            transition: all 0.15s ease;
        `;
      selfBtn.addEventListener("click", () => {
        selectedRole = 0 /* self */;
        updateSelection();
      });
      chainContainer.appendChild(selfBtn);
      const lowerRow = document.createElement("div");
      lowerRow.style.cssText = "display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 6px;";
      const chainRoles = [
        1 /* clubowner */,
        2 /* owner */,
        3 /* lover */,
        4 /* mistress */,
        5 /* whitelist */,
        6 /* friend */,
        7 /* public */
      ];
      const roleButtons = [];
      chainRoles.forEach((lvl, idx) => {
        const b = document.createElement("button");
        b.textContent = ACCESS_LEVEL_NAMES[lvl];
        b.style.cssText = `
                padding: 8px 14px;
                font-size: 13px;
                font-weight: bold;
                cursor: pointer;
                border-radius: 4px;
                background: ${selectedRole === lvl ? "#1976d2" : "rgba(45, 55, 75, 0.8)"};
                border: 1px solid ${selectedRole === lvl ? "#42a5f5" : "rgba(80, 100, 140, 0.4)"};
                color: ${selectedRole === lvl ? "white" : "#cfd8dc"};
                transition: all 0.15s ease;
            `;
        b.addEventListener("click", () => {
          selectedRole = lvl;
          updateSelection();
        });
        roleButtons.push({ level: lvl, btn: b });
        lowerRow.appendChild(b);
        if (idx < chainRoles.length - 1) {
          const separator = document.createElement("span");
          separator.textContent = ">";
          separator.style.cssText = "color: #78909c; font-weight: bold; font-size: 14px;";
          lowerRow.appendChild(separator);
        }
      });
      chainContainer.appendChild(lowerRow);
      dialog.appendChild(chainContainer);
      const updateSelection = () => {
        const labelEl = dialog.querySelector("#qoc-selected-label");
        if (labelEl) labelEl.textContent = ACCESS_LEVEL_NAMES[selectedRole];
        selfBtn.style.background = selectedRole === 0 /* self */ ? "#00e5ff" : "rgba(45, 55, 75, 0.8)";
        selfBtn.style.color = selectedRole === 0 /* self */ ? "black" : "#00e5ff";
        roleButtons.forEach((r) => {
          const isMatch = r.level === selectedRole;
          r.btn.style.background = isMatch ? "#1976d2" : "rgba(45, 55, 75, 0.8)";
          r.btn.style.borderColor = isMatch ? "#42a5f5" : "rgba(80, 100, 140, 0.4)";
          r.btn.style.color = isMatch ? "white" : "#cfd8dc";
        });
      };
      const actionRow = document.createElement("div");
      actionRow.style.cssText = "display: flex; justify-content: center; gap: 16px; margin-top: 10px;";
      const confirmBtn = document.createElement("button");
      confirmBtn.textContent = "Confirm";
      confirmBtn.style.cssText = `
            padding: 10px 32px;
            background: #2e7d32;
            border: 1px solid #4caf50;
            color: white;
            font-size: 15px;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
        `;
      confirmBtn.addEventListener("click", async () => {
        if (this.isSelf) {
          setPermissionMinRole(def.key, selectedRole);
          modalBackdrop.remove();
          this.modalElement = null;
          this.renderPermissionsTab();
        } else if (this.target && typeof this.target.MemberNumber === "number") {
          const res = await requestUpdateAuthority(this.target.MemberNumber, { action: "set_min_role", perm: def.key, minRole: selectedRole });
          if (res.success && res.data?.authority) {
            this.targetData.authority = res.data.authority;
            modalBackdrop.remove();
            this.modalElement = null;
            this.renderPermissionsTab();
          } else {
            alert(res.error || "Failed to update minimum role on target.");
          }
        }
      });
      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Cancel";
      cancelBtn.style.cssText = `
            padding: 10px 32px;
            background: rgba(60, 70, 90, 0.8);
            border: 1px solid rgba(80, 100, 140, 0.5);
            color: white;
            font-size: 15px;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
        `;
      cancelBtn.addEventListener("click", () => {
        modalBackdrop.remove();
        this.modalElement = null;
      });
      actionRow.appendChild(confirmBtn);
      actionRow.appendChild(cancelBtn);
      dialog.appendChild(actionRow);
      modalBackdrop.appendChild(dialog);
      document.body.appendChild(modalBackdrop);
      this.modalElement = modalBackdrop;
    }
    // ==========================================
    // TAB 5: PREFERENCES & ENGINE CONFIGURATION
    // ==========================================
    renderSettingsTab() {
      if (!this.contentArea) return;
      this.contentArea.innerHTML = "";
      const subjectName = this.getSubjectName();
      const canEditPreferences = this.isSelf ? checkPermissionAccess("rules_edit_autoload_mode") : this.targetData?.callerPermissions?.rules_edit_autoload_mode ?? false;
      const currentViolationAction = this.isSelf ? modStorage.inspector.violationAction || "toast" : this.targetData?.preferences?.violationAction || "toast";
      const currentAutoLoadMode = this.isSelf ? modStorage.inspector.autoLoadMode || "Prompt" : this.targetData?.preferences?.autoLoadMode || this.targetData?.autoLoadMode || "Prompt";
      const currentInterval = this.isSelf ? typeof modStorage.inspector.evaluationInterval === "number" ? modStorage.inspector.evaluationInterval : 30 : this.targetData?.preferences?.evaluationInterval ?? 30;
      const currentTelemetry = this.isSelf ? typeof modStorage.inspector.silentTelemetry === "boolean" ? modStorage.inspector.silentTelemetry : true : this.targetData?.preferences?.silentTelemetry ?? true;
      const currentProfileBtn = this.isSelf ? typeof modStorage.inspector.showProfileButton === "boolean" ? modStorage.inspector.showProfileButton : true : this.targetData?.preferences?.showProfileButton ?? true;
      const currentAllowForcedInjection = this.isSelf ? typeof modStorage.inspector.allowForcedInjection === "boolean" ? modStorage.inspector.allowForcedInjection : false : this.targetData?.preferences?.allowForcedInjection ?? false;
      const customCatalog = this.isSelf ? modStorage.inspector.customCatalog || [] : this.targetData?.customCatalog || [];
      const updatePref = async (newPref) => {
        if (!canEditPreferences) return;
        if (this.isSelf) {
          if (newPref.violationAction) modStorage.inspector.violationAction = newPref.violationAction;
          if (newPref.autoLoadMode) modStorage.inspector.autoLoadMode = newPref.autoLoadMode;
          if (typeof newPref.evaluationInterval === "number") modStorage.inspector.evaluationInterval = newPref.evaluationInterval;
          if (typeof newPref.silentTelemetry === "boolean") modStorage.inspector.silentTelemetry = newPref.silentTelemetry;
          if (typeof newPref.showProfileButton === "boolean") modStorage.inspector.showProfileButton = newPref.showProfileButton;
          if (typeof newPref.allowForcedInjection === "boolean") modStorage.inspector.allowForcedInjection = newPref.allowForcedInjection;
          saveStorage();
          syncStorage();
          restartPeriodicComplianceTimer();
          toastsManager.info({ title: `${MOD_NAME} Preferences`, message: "Preferences updated.", duration: 2500 });
          this.renderSettingsTab();
        } else if (this.target && typeof this.target.MemberNumber === "number") {
          const res = await requestUpdateAuthority(this.target.MemberNumber, {
            action: "update_preferences",
            preferences: newPref
          });
          if (res.success && res.data?.preferences) {
            this.targetData.preferences = res.data.preferences;
            toastsManager.info({ title: `${MOD_NAME} Preferences`, message: `Preferences updated for ${subjectName}.`, duration: 2500 });
            this.renderSettingsTab();
          } else {
            toastsManager.error({ title: `${MOD_NAME} Error`, message: res.error || "Failed to update preferences.", duration: 4e3 });
          }
        }
      };
      const addCustomMod = async (mod) => {
        if (!canEditPreferences) return;
        if (this.isSelf) {
          modStorage.inspector.customCatalog = modStorage.inspector.customCatalog || [];
          modStorage.inspector.customCatalog = modStorage.inspector.customCatalog.filter((c) => c.id.toLowerCase() !== mod.id.toLowerCase());
          modStorage.inspector.customCatalog.push(mod);
          saveStorage();
          syncStorage();
          toastsManager.success({ title: `${MOD_NAME} Catalog`, message: `Added '${mod.name}' to custom catalog.`, duration: 3e3 });
          this.renderSettingsTab();
        } else if (this.target && typeof this.target.MemberNumber === "number") {
          const res = await requestUpdateAuthority(this.target.MemberNumber, {
            action: "add_custom_mod",
            customMod: mod
          });
          if (res.success && res.data?.customCatalog) {
            this.targetData.customCatalog = res.data.customCatalog;
            toastsManager.success({ title: `${MOD_NAME} Catalog`, message: `Added '${mod.name}' to ${subjectName}'s catalog.`, duration: 3e3 });
            this.renderSettingsTab();
          } else {
            toastsManager.error({ title: `${MOD_NAME} Error`, message: res.error || "Failed to add custom addon.", duration: 4e3 });
          }
        }
      };
      const removeCustomMod = async (modId) => {
        if (!canEditPreferences) return;
        if (this.isSelf) {
          modStorage.inspector.customCatalog = (modStorage.inspector.customCatalog || []).filter((c) => c.id.toLowerCase() !== modId.toLowerCase());
          saveStorage();
          syncStorage();
          toastsManager.info({ title: `${MOD_NAME} Catalog`, message: "Custom addon removed from catalog.", duration: 2500 });
          this.renderSettingsTab();
        } else if (this.target && typeof this.target.MemberNumber === "number") {
          const res = await requestUpdateAuthority(this.target.MemberNumber, {
            action: "remove_custom_mod",
            customModId: modId
          });
          if (res.success && res.data?.customCatalog) {
            this.targetData.customCatalog = res.data.customCatalog;
            toastsManager.info({ title: `${MOD_NAME} Catalog`, message: `Custom addon removed from ${subjectName}'s catalog.`, duration: 2500 });
            this.renderSettingsTab();
          } else {
            toastsManager.error({ title: `${MOD_NAME} Error`, message: res.error || "Failed to remove custom addon.", duration: 4e3 });
          }
        }
      };
      const container = document.createElement("div");
      container.style.cssText = "display: flex; flex-direction: column; gap: 20px;";
      if (!canEditPreferences) {
        const lockMsg = document.createElement("div");
        lockMsg.style.cssText = "color: #ef5350; font-size: 13px; font-weight: bold; padding: 14px; background: rgba(239, 83, 80, 0.12); border: 1px solid #ef5350; border-radius: 6px;";
        lockMsg.textContent = this.isSelf ? "\u{1F512} Preferences are locked: You do not have self-access to modify engine preferences (controlled by your dominant)." : `\u{1F512} Preferences are restricted: You do not meet the minimum role required to modify engine preferences on ${subjectName}.`;
        container.appendChild(lockMsg);
      }
      const violationSection = document.createElement("div");
      violationSection.style.cssText = "background: rgba(35, 43, 60, 0.85); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 8px; padding: 20px;";
      violationSection.innerHTML = `
            <div style="font-size: 16px; font-weight: bold; color: #ef5350; margin-bottom: 6px;">
                \u{1F6D1} Forbidden Addon Violation Response for ${subjectName}
            </div>
            <div style="font-size: 13px; color: #90a4ae; margin-bottom: 16px;">
                Configure the enforcement action triggered when a forbidden addon is detected actively running in the player's session.
            </div>
        `;
      const violationModes = [
        { action: "toast", label: "Local Warning Toast", desc: "Discretely displays high-visibility warning notifications to the player advising them to disable the forbidden addon.", badge: "DISCREET", color: "#64b5f6" },
        { action: "room_alert", label: "Room Chat Public Warning", desc: "Broadcasts a public emote announcement in the room chat alerting room members that the player is violating policy.", badge: "PUBLIC", color: "#ffb74d" },
        { action: "lockout", label: "Screen Lockout Overlay", desc: "Displays a full-screen red lockout barrier blocking game interaction until the page is reloaded without the forbidden mod.", badge: "STRICT ENFORCEMENT", color: "#e57373" },
        { action: "leave_room", label: "Auto-Leave Room", desc: "Immediately ejects the player from the chat room upon detecting a forbidden addon.", badge: "IMMEDIATE EJECTION", color: "#f06292" }
      ];
      const violList = document.createElement("div");
      violList.style.cssText = "display: flex; flex-direction: column; gap: 8px;";
      violationModes.forEach((vm) => {
        const isSel = currentViolationAction === vm.action;
        const btn = document.createElement("button");
        btn.disabled = !canEditPreferences;
        btn.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 18px;
                border-radius: 6px;
                background: ${isSel ? "rgba(239, 83, 80, 0.15)" : "rgba(45, 55, 75, 0.7)"};
                border: 1px solid ${isSel ? "#ef5350" : "rgba(80, 100, 140, 0.4)"};
                color: ${isSel ? "#ffcdd2" : "#cfd8dc"};
                cursor: ${canEditPreferences ? "pointer" : "not-allowed"};
                text-align: left;
                transition: all 0.15s ease;
            `;
        btn.innerHTML = `
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 14px; font-weight: bold; color: ${isSel ? "#ff8a80" : "#e0e6ed"};">${isSel ? "\u25CF " : "\u25CB "}${vm.label}</span>
                        <span style="background: rgba(255, 255, 255, 0.08); border: 1px solid ${vm.color}; color: ${vm.color}; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 3px;">${vm.badge}</span>
                    </div>
                    <div style="font-size: 12px; color: #90a4ae; margin-top: 3px;">${vm.desc}</div>
                </div>
            `;
        btn.addEventListener("click", () => updatePref({ violationAction: vm.action }));
        violList.appendChild(btn);
      });
      violationSection.appendChild(violList);
      container.appendChild(violationSection);
      const autoLoadSection = document.createElement("div");
      autoLoadSection.style.cssText = "background: rgba(35, 43, 60, 0.85); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 8px; padding: 20px;";
      autoLoadSection.innerHTML = `
            <div style="font-size: 16px; font-weight: bold; color: #64b5f6; margin-bottom: 6px;">
                \u26A1 Mandatory Addon Auto-Injection Behavior for ${subjectName}
            </div>
            <div style="font-size: 13px; color: #90a4ae; margin-bottom: 16px;">
                Configure how Quality of Club acts when entering a room or checking compliance if a mandatory addon is missing.
            </div>
        `;
      const autoModes = [
        { mode: "Prompt", label: "Prompt First (Recommended)", desc: "Prompts with a confirmation dialog before injecting missing addons." },
        { mode: "Silent", label: "Silent Auto-Injection", desc: "Silently auto-injects missing mandatory scripts automatically in the background." },
        { mode: "Alert", label: "Alert Notice Only", desc: "Displays a warning notice that a required addon is missing, but does not attempt script injection." }
      ];
      const autoRow = document.createElement("div");
      autoRow.style.cssText = "display: flex; flex-direction: column; gap: 8px;";
      autoModes.forEach((m) => {
        const isSel = currentAutoLoadMode === m.mode;
        const btn = document.createElement("button");
        btn.disabled = !canEditPreferences;
        btn.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 18px;
                border-radius: 6px;
                background: ${isSel ? "rgba(25, 118, 210, 0.3)" : "rgba(45, 55, 75, 0.7)"};
                border: 1px solid ${isSel ? "#42a5f5" : "rgba(80, 100, 140, 0.4)"};
                color: ${isSel ? "#90caf9" : "#cfd8dc"};
                cursor: ${canEditPreferences ? "pointer" : "not-allowed"};
                text-align: left;
                transition: all 0.15s ease;
            `;
        btn.innerHTML = `
                <div>
                    <div style="font-size: 14px; font-weight: bold;">${isSel ? "\u25CF " : "\u25CB "}${m.label}</div>
                    <div style="font-size: 12px; color: #90a4ae; margin-top: 3px;">${m.desc}</div>
                </div>
            `;
        btn.addEventListener("click", () => updatePref({ autoLoadMode: m.mode }));
        autoRow.appendChild(btn);
      });
      autoLoadSection.appendChild(autoRow);
      const forcedInjectRow = document.createElement("div");
      forcedInjectRow.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding-top: 14px; margin-top: 14px; border-top: 1px solid rgba(80, 100, 140, 0.3);";
      forcedInjectRow.innerHTML = `
            <div>
                <div style="font-size: 14px; font-weight: bold; color: #e0e6ed;">\u{1F489} Allow Remote Forced Addon Injection by Others</div>
                <div style="font-size: 12px; color: #90a4ae; margin-top: 2px;">
                    Permits authorized dominants (governed by the <b>Force Compliance & Injection</b> permission) to remotely inject missing mandatory addons on ${subjectName}, even when auto-injection is set to Prompt or Alert.
                </div>
            </div>
        `;
      const forcedInjectBtn = document.createElement("button");
      forcedInjectBtn.disabled = !canEditPreferences;
      forcedInjectBtn.textContent = currentAllowForcedInjection ? "\u2713 Enabled" : "\u2715 Disabled";
      forcedInjectBtn.style.cssText = `
            padding: 8px 18px;
            border-radius: 4px;
            font-size: 13px;
            font-weight: bold;
            cursor: ${canEditPreferences ? "pointer" : "not-allowed"};
            background: ${currentAllowForcedInjection ? "rgba(76, 175, 80, 0.25)" : "rgba(100, 116, 139, 0.2)"};
            border: 1px solid ${currentAllowForcedInjection ? "#4caf50" : "#78909c"};
            color: ${currentAllowForcedInjection ? "#81c784" : "#90a4ae"};
            transition: all 0.15s ease;
        `;
      forcedInjectBtn.addEventListener("click", () => updatePref({ allowForcedInjection: !currentAllowForcedInjection }));
      forcedInjectRow.appendChild(forcedInjectBtn);
      autoLoadSection.appendChild(forcedInjectRow);
      container.appendChild(autoLoadSection);
      const periodicSection = document.createElement("div");
      periodicSection.style.cssText = "background: rgba(35, 43, 60, 0.85); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 8px; padding: 20px;";
      periodicSection.innerHTML = `
            <div style="font-size: 16px; font-weight: bold; color: #64b5f6; margin-bottom: 6px;">
                \u23F1\uFE0F Compliance Evaluation Interval & Dominant Telemetry
            </div>
            <div style="font-size: 13px; color: #90a4ae; margin-bottom: 16px;">
                Controls automated background evaluation frequency to catch mid-session addon tampering, and telemetry reporting to room dominants.
            </div>
        `;
      const intervalRow = document.createElement("div");
      intervalRow.style.cssText = "display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;";
      const intervalHeader = document.createElement("div");
      intervalHeader.style.cssText = "font-size: 13px; font-weight: bold; color: #cfd8dc; margin-bottom: 4px;";
      intervalHeader.textContent = "Evaluation Polling Frequency:";
      intervalRow.appendChild(intervalHeader);
      const intervalBtns = document.createElement("div");
      intervalBtns.style.cssText = "display: flex; gap: 8px; flex-wrap: wrap;";
      const intervals = [
        { sec: 0, label: "Off (Room Sync Only)" },
        { sec: 15, label: "Every 15s (Aggressive)" },
        { sec: 30, label: "Every 30s (Default)" },
        { sec: 60, label: "Every 60s (Relaxed)" }
      ];
      intervals.forEach((iv) => {
        const isSel = currentInterval === iv.sec;
        const b = document.createElement("button");
        b.disabled = !canEditPreferences;
        b.textContent = iv.label;
        b.style.cssText = `
                padding: 8px 14px;
                border-radius: 4px;
                font-size: 12.5px;
                font-weight: ${isSel ? "bold" : "normal"};
                cursor: ${canEditPreferences ? "pointer" : "not-allowed"};
                background: ${isSel ? "#1976d2" : "rgba(45, 55, 75, 0.8)"};
                border: 1px solid ${isSel ? "#42a5f5" : "rgba(80, 100, 140, 0.4)"};
                color: ${isSel ? "white" : "#b0bec5"};
                transition: all 0.15s ease;
            `;
        b.addEventListener("click", () => updatePref({ evaluationInterval: iv.sec }));
        intervalBtns.appendChild(b);
      });
      intervalRow.appendChild(intervalBtns);
      periodicSection.appendChild(intervalRow);
      const telemRow = document.createElement("div");
      telemRow.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding-top: 14px; border-top: 1px solid rgba(80, 100, 140, 0.3);";
      telemRow.innerHTML = `
            <div>
                <div style="font-size: 14px; font-weight: bold; color: #e0e6ed;">\u{1F4E1} Silent Room Telemetry to Dominants</div>
                <div style="font-size: 12px; color: #90a4ae; margin-top: 2px;">Silently broadcasts addon compliance manifests to in-room Owners, Mistresses, and Clubowners.</div>
            </div>
        `;
      const telemBtn = document.createElement("button");
      telemBtn.disabled = !canEditPreferences;
      telemBtn.textContent = currentTelemetry ? "\u2713 Enabled" : "\u2715 Disabled";
      telemBtn.style.cssText = `
            padding: 8px 18px;
            border-radius: 4px;
            font-size: 13px;
            font-weight: bold;
            cursor: ${canEditPreferences ? "pointer" : "not-allowed"};
            background: ${currentTelemetry ? "rgba(76, 175, 80, 0.25)" : "rgba(100, 116, 139, 0.2)"};
            border: 1px solid ${currentTelemetry ? "#4caf50" : "#78909c"};
            color: ${currentTelemetry ? "#81c784" : "#90a4ae"};
            transition: all 0.15s ease;
        `;
      telemBtn.addEventListener("click", () => updatePref({ silentTelemetry: !currentTelemetry }));
      telemRow.appendChild(telemBtn);
      periodicSection.appendChild(telemRow);
      container.appendChild(periodicSection);
      const uiSection = document.createElement("div");
      uiSection.style.cssText = "background: rgba(35, 43, 60, 0.85); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 8px; padding: 20px;";
      uiSection.innerHTML = `
            <div style="font-size: 16px; font-weight: bold; color: #64b5f6; margin-bottom: 6px;">
                \u{1F6E1}\uFE0F Interface & Client Preferences
            </div>
            <div style="font-size: 13px; color: #90a4ae; margin-bottom: 16px;">
                Visual display toggles and client Quality of Life settings.
            </div>
        `;
      const profileBtnRow = document.createElement("div");
      profileBtnRow.style.cssText = "display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;";
      profileBtnRow.innerHTML = `
            <div>
                <div style="font-size: 14px; font-weight: bold; color: #e0e6ed;">Show Inspector Shield on Character Profiles</div>
                <div style="font-size: 12px; color: #90a4ae; margin-top: 2px;">Renders the blue shield icon on InformationSheet under other mod buttons for 1-click inspection.</div>
            </div>
        `;
      const profileBtnToggle = document.createElement("button");
      profileBtnToggle.disabled = !canEditPreferences;
      profileBtnToggle.textContent = currentProfileBtn ? "\u2713 Shown" : "\u2715 Hidden";
      profileBtnToggle.style.cssText = `
            padding: 8px 18px;
            border-radius: 4px;
            font-size: 13px;
            font-weight: bold;
            cursor: ${canEditPreferences ? "pointer" : "not-allowed"};
            background: ${currentProfileBtn ? "rgba(41, 121, 255, 0.25)" : "rgba(100, 116, 139, 0.2)"};
            border: 1px solid ${currentProfileBtn ? "#2979ff" : "#78909c"};
            color: ${currentProfileBtn ? "#82b1ff" : "#90a4ae"};
            transition: all 0.15s ease;
        `;
      profileBtnToggle.addEventListener("click", () => updatePref({ showProfileButton: !currentProfileBtn }));
      profileBtnRow.appendChild(profileBtnToggle);
      uiSection.appendChild(profileBtnRow);
      const chatResizerNote = document.createElement("div");
      chatResizerNote.style.cssText = "padding: 12px 16px; border-radius: 6px; background: rgba(30, 45, 65, 0.5); border: 1px dashed rgba(80, 100, 140, 0.5); display: flex; align-items: center; justify-content: space-between;";
      chatResizerNote.innerHTML = `
            <div>
                <div style="font-size: 13px; font-weight: bold; color: #90caf9;">\u{1F4AC} Chat Resizer & Draggable Handle</div>
                <div style="font-size: 12px; color: #78909c; margin-top: 2px;">Local client QoL only (split ratio & divider). Maintained locally and strictly exempt from remote dominant rules.</div>
            </div>
            <span style="font-size: 11px; color: #81c784; background: rgba(76, 175, 80, 0.15); border: 1px solid #4caf50; padding: 3px 8px; border-radius: 4px; font-weight: bold;">LOCAL ONLY</span>
        `;
      uiSection.appendChild(chatResizerNote);
      container.appendChild(uiSection);
      const catalogSection = document.createElement("div");
      catalogSection.style.cssText = "background: rgba(35, 43, 60, 0.85); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 8px; padding: 20px;";
      catalogSection.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <div style="font-size: 16px; font-weight: bold; color: #64b5f6;">
                    \u{1F4DA} Custom Addon Catalog (${customCatalog.length})
                </div>
            </div>
            <div style="font-size: 13px; color: #90a4ae; margin-bottom: 16px;">
                Register custom external scripts, mods, or userscripts into the catalog so dominants can mandate or forbid them in the Enforce Rules tab.
            </div>
        `;
      if (customCatalog.length === 0) {
        const noCustom = document.createElement("div");
        noCustom.style.cssText = "color: #78909c; font-size: 13px; padding: 14px; text-align: center; background: rgba(30, 36, 48, 0.5); border-radius: 6px; margin-bottom: 16px;";
        noCustom.textContent = "No custom addons currently registered. Use the form below to add one.";
        catalogSection.appendChild(noCustom);
      } else {
        const list = document.createElement("div");
        list.style.cssText = "display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;";
        customCatalog.forEach((c) => {
          const itemCard = document.createElement("div");
          itemCard.style.cssText = "background: rgba(45, 55, 75, 0.6); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 6px; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;";
          itemCard.innerHTML = `
                    <div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 14px; font-weight: bold; color: #e0e6ed;">${c.name}</span>
                            <span style="font-size: 11px; color: #ffb74d; background: rgba(255, 152, 0, 0.15); border: 1px solid #ff9800; padding: 1px 6px; border-radius: 3px;">ID: ${c.id}</span>
                        </div>
                        <div style="font-size: 12px; color: #90a4ae; margin-top: 2px;">
                            ${c.description || "Custom mod"} ${c.detectKeys?.length ? `\u2022 Keys: [${c.detectKeys.join(", ")}]` : ""}
                        </div>
                        ${c.scriptUrl ? `<div style="font-size: 11px; color: #81c784; margin-top: 2px; word-break: break-all;">URL: ${c.scriptUrl}</div>` : ""}
                    </div>
                `;
          if (canEditPreferences) {
            const delBtn = document.createElement("button");
            delBtn.textContent = "\u{1F5D1}\uFE0F Remove";
            delBtn.title = "Delete custom addon from catalog";
            delBtn.style.cssText = "padding: 4px 10px; border-radius: 4px; background: rgba(198, 40, 40, 0.2); border: 1px solid #ef5350; color: #ef9a9a; font-size: 11px; font-weight: bold; cursor: pointer;";
            delBtn.addEventListener("click", () => removeCustomMod(c.id));
            itemCard.appendChild(delBtn);
          }
          list.appendChild(itemCard);
        });
        catalogSection.appendChild(list);
      }
      if (canEditPreferences) {
        const formBox = document.createElement("div");
        formBox.style.cssText = "background: rgba(30, 36, 48, 0.7); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 6px; padding: 16px;";
        formBox.innerHTML = `
                <div style="font-size: 14px; font-weight: bold; color: #64b5f6; margin-bottom: 12px;">\u2795 Register New Custom Addon</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                    <div>
                        <label style="font-size: 12px; color: #b0bec5; display: block; margin-bottom: 4px;">Mod Display Name *</label>
                        <input id="qoc-add-name" type="text" placeholder="e.g. Banned Cheats Script" style="width: 100%; box-sizing: border-box; padding: 7px 10px; background: #191f2b; border: 1px solid #546e7a; color: white; border-radius: 4px; font-size: 13px;" />
                    </div>
                    <div>
                        <label style="font-size: 12px; color: #b0bec5; display: block; margin-bottom: 4px;">Unique ID / Keyword *</label>
                        <input id="qoc-add-id" type="text" placeholder="e.g. BannedCheats" style="width: 100%; box-sizing: border-box; padding: 7px 10px; background: #191f2b; border: 1px solid #546e7a; color: white; border-radius: 4px; font-size: 13px;" />
                    </div>
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="font-size: 12px; color: #b0bec5; display: block; margin-bottom: 4px;">Description / Purpose</label>
                    <input id="qoc-add-desc" type="text" placeholder="e.g. Third-party automation or tampermonkey script" style="width: 100%; box-sizing: border-box; padding: 7px 10px; background: #191f2b; border: 1px solid #546e7a; color: white; border-radius: 4px; font-size: 13px;" />
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
                    <div>
                        <label style="font-size: 12px; color: #b0bec5; display: block; margin-bottom: 4px;">Detection Keywords (comma-separated)</label>
                        <input id="qoc-add-keys" type="text" placeholder="e.g. cheat, tampermonkey, hack" style="width: 100%; box-sizing: border-box; padding: 7px 10px; background: #191f2b; border: 1px solid #546e7a; color: white; border-radius: 4px; font-size: 13px;" />
                    </div>
                    <div>
                        <label style="font-size: 12px; color: #b0bec5; display: block; margin-bottom: 4px;">Script Injection URL (optional)</label>
                        <input id="qoc-add-url" type="text" placeholder="https://example.com/mod.js" style="width: 100%; box-sizing: border-box; padding: 7px 10px; background: #191f2b; border: 1px solid #546e7a; color: white; border-radius: 4px; font-size: 13px;" />
                    </div>
                </div>
                <button id="qoc-btn-add-mod" style="padding: 8px 20px; background: #1976d2; border: 1px solid #42a5f5; color: white; font-weight: bold; border-radius: 4px; cursor: pointer; font-size: 13px;">
                    \u2795 Add Custom Addon to Catalog
                </button>
            `;
        formBox.querySelector("#qoc-btn-add-mod")?.addEventListener("click", () => {
          const nameInp = formBox.querySelector("#qoc-add-name");
          const idInp = formBox.querySelector("#qoc-add-id");
          const descInp = formBox.querySelector("#qoc-add-desc");
          const keysInp = formBox.querySelector("#qoc-add-keys");
          const urlInp = formBox.querySelector("#qoc-add-url");
          const name = nameInp?.value.trim();
          const id = idInp?.value.trim();
          if (!name || !id) {
            toastsManager.error({ title: "Incomplete Addon", message: "Please provide both Mod Name and Unique ID.", duration: 3e3 });
            return;
          }
          const desc = descInp?.value.trim() || "Custom Addon";
          const rawKeys = keysInp?.value.trim();
          const detectKeys = rawKeys ? rawKeys.split(",").map((k) => k.trim()).filter(Boolean) : [id.toLowerCase(), name.toLowerCase()];
          const scriptUrl = urlInp?.value.trim() || "";
          addCustomMod({
            id,
            name,
            description: desc,
            detectKeys,
            scriptUrl,
            isCustom: true
          });
        });
        catalogSection.appendChild(formBox);
      }
      container.appendChild(catalogSection);
      this.contentArea.appendChild(container);
    }
  };

  // src/subscreens/authoritySubscreen.ts
  var AuthoritySubscreen = class extends InspectorSubscreen {
    constructor(target = null) {
      super(target || (typeof Player !== "undefined" ? Player : null), "roles");
    }
  };

  // src/subscreens/mainSubscreen.ts
  var MainSubscreen2 = class extends BaseSubscreen {
    get name() {
      return "";
    }
    onRun() {
      DrawRect(0, 0, 2e3, 1e3, "#191f2b");
    }
    onLoad() {
      this.createCard({
        anchor: "bottom-right",
        x: 90,
        y: 65,
        width: 220,
        name: "Version",
        value: `v${version2}`,
        icon: createElement(GitPullRequest)
      });
      const title = this.createText({
        text: "QUALITY OF CLUB",
        fontSize: 10,
        x: 165,
        y: 75,
        width: 1600
      });
      title.style.fontWeight = "bold";
      title.style.color = "#64b5f6";
      title.style.letterSpacing = "2px";
      const canOpenSettings = checkPermissionAccess("menu_open_settings");
      if (!canOpenSettings) {
        this.renderLockoutScreen();
        return;
      }
      const subtitle = this.createText({
        text: "Quality-of-Life & Addon Compliance Suite for Bondage Club",
        fontSize: 3.2,
        x: 165,
        y: 195,
        width: 1200
      });
      subtitle.style.color = "#90a4ae";
      const menuItems = [
        {
          name: "Chat Window Resizer",
          icon: createElement(SlidersVertical),
          subscreen: () => new ChatResizerSubscreen()
        },
        {
          name: "Authority & Roles",
          icon: createElement(ShieldCheck),
          subscreen: () => new AuthoritySubscreen()
        },
        {
          name: "My Addons & Compliance",
          icon: createElement(Search),
          subscreen: () => new InspectorSubscreen(typeof Player !== "undefined" ? Player : null)
        }
      ];
      menuItems.forEach((item, i) => {
        const btn = this.createButton({
          text: item.name,
          icon: item.icon,
          x: 165,
          y: 280 + 125 * i,
          width: 620,
          height: 85,
          padding: 2,
          onClick: () => this.setSubscreen(item.subscreen())
        });
        btn.style.fontWeight = "bold";
        btn.style.fontSize = "calc(3.5px * var(--size-unit, 4px))";
      });
      const loadedMods = getLoadedMods2();
      const rules = modStorage.inspector.rules;
      const compliance = checkComplianceAgainstRules(loadedMods, rules);
      const permSetting = modStorage.authority?.permissions?.inspect_view_addons;
      const viewMinRoleName = permSetting ? ACCESS_LEVEL_NAMES[permSetting.min] : "Public";
      const card = document.createElement("div");
      card.style.cssText = `
            position: absolute;
            left: calc(1050px * (var(--canvas-width, 2000px) / 2000));
            top: calc(280px * (var(--canvas-height, 1000px) / 1000));
            width: calc(650px * (var(--canvas-width, 2000px) / 2000));
            background: rgba(30, 36, 48, 0.9);
            border: 1px solid rgba(80, 100, 140, 0.4);
            border-radius: 8px;
            padding: 20px 24px;
            color: #e0e6ed;
            box-sizing: border-box;
            z-index: 5;
        `;
      card.innerHTML = `
            <div style="font-size: 18px; font-weight: bold; color: #64b5f6; margin-bottom: 12px; border-bottom: 1px solid rgba(80,100,140,0.3); padding-bottom: 8px;">
                Current System Overview
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #90a4ae;">Chat Resizer:</span>
                <b style="color: ${modStorage.chatResizer.enabled ? "#81c784" : "#ef5350"};">${modStorage.chatResizer.enabled ? "Enabled (" + modStorage.chatResizer.splitPercent + "%)" : "Disabled (Off)"}</b>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #90a4ae;">Authority Roles:</span>
                <b style="color: #64b5f6;">${modStorage.authority.owners.length} Owners / ${modStorage.authority.mistresses.length} Mistresses</b>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #90a4ae;">Addon Sharing:</span>
                <b style="color: ${modStorage.inspector.enabled ? "#81c784" : "#ef5350"};">${modStorage.inspector.enabled ? "Active (" + viewMinRoleName + ")" : "Disabled"}</b>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #90a4ae;">Detected Addons:</span>
                <b>${loadedMods.length} loaded</b>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 14px; padding-top: 10px; border-top: 1px solid rgba(80,100,140,0.3);">
                <span style="color: #90a4ae;">Rule Compliance:</span>
                <b style="color: ${compliance.isCompliant ? "#81c784" : "#ef5350"};">${compliance.isCompliant ? "\u2713 COMPLIANT" : "\u26A0\uFE0F " + compliance.missing.length + " MISSING / " + compliance.forbidden.length + " FORBIDDEN"}</b>
            </div>
        `;
      document.body.appendChild(card);
      this.domElements.push(card);
      this.createButton({
        text: "Source Code (GitHub)",
        icon: createElement(CodeXml),
        href: MOD_REPOSITORY,
        x: 1050,
        y: 535,
        width: 480,
        height: 60,
        padding: 2
      });
      this.createButton({
        text: "Report Issues / Feedback",
        icon: createElement(Bug),
        href: MOD_REPOSITORY ? `${MOD_REPOSITORY}/issues` : void 0,
        x: 1050,
        y: 615,
        width: 480,
        height: 60,
        padding: 2
      });
    }
    renderLockoutScreen() {
      const lockCard = document.createElement("div");
      lockCard.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: min(85vw, 680px);
            background: rgba(30, 36, 48, 0.95);
            border: 2px solid #ef5350;
            border-radius: 10px;
            padding: 36px 40px;
            color: #e0e6ed;
            box-sizing: border-box;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7);
            z-index: 20;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
        `;
      const minRole = modStorage.authority?.permissions?.menu_open_settings?.min ?? 2 /* owner */;
      const minRoleName = ACCESS_LEVEL_NAMES[minRole];
      lockCard.innerHTML = `
            <div style="font-size: 48px; line-height: 1;">\u{1F512}</div>
            <div style="font-size: 22px; font-weight: bold; color: #ef5350;">Quality of Club Access Locked</div>
            <div style="font-size: 15px; color: #cfd8dc; line-height: 1.5; max-width: 500px;">
                Access to the Quality of Club configuration menu has been surrendered or locked.
            </div>
            <div style="font-size: 13px; color: #90a4ae; background: rgba(20, 26, 38, 0.6); padding: 10px 18px; border-radius: 6px; border: 1px solid rgba(80, 100, 140, 0.3);">
                Lowest authorized role required to open this menu: <b style="color: #64b5f6;">${minRoleName}</b>
            </div>
            <div style="font-size: 12px; color: #78909c; margin-top: 6px;">
                Only an authorized Owner or Mistress can modify these permissions or restore your access.
            </div>
        `;
      const exitBtn = document.createElement("button");
      exitBtn.textContent = "\u2715 Return to Club";
      exitBtn.style.cssText = `
            margin-top: 14px;
            padding: 12px 36px;
            background: #1976d2;
            border: 1px solid #42a5f5;
            color: white;
            font-size: 15px;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.15s ease;
        `;
      exitBtn.addEventListener("click", () => this.exit());
      lockCard.appendChild(exitBtn);
      document.body.appendChild(lockCard);
      this.domElements.push(lockCard);
    }
    domElements = [];
    onUnload() {
      this.cleanup();
    }
    onExit() {
      this.cleanup();
    }
    cleanup() {
      for (const el of this.domElements) {
        try {
          el.remove();
        } catch {
        }
      }
      this.domElements = [];
    }
    exit() {
      this.cleanup();
      setSubscreen(null);
      syncStorage();
      if (typeof CurrentScreen !== "undefined" && CurrentScreen === "Preference" && typeof PreferenceSubscreenExtensionsClear === "function") {
        PreferenceSubscreenExtensionsClear();
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
      exit: () => {
        const current = getCurrentSubscreen();
        if (current) {
          current.exit();
        }
        return true;
      },
      load: () => {
        setSubscreen(new MainSubscreen2());
      },
      unload: () => {
        const current = getCurrentSubscreen();
        if (current) {
          setSubscreen(null);
        }
      }
    });
  }

  // src/modules/profileButton.ts
  var shieldIconDataUrl = null;
  function getIconDataUrl() {
    if (!shieldIconDataUrl) {
      const svg = createElement(ShieldCheck);
      svg.setAttribute("stroke", "#1976d2");
      svg.setAttribute("fill", "#e3f2fd");
      svg.setAttribute("width", "64");
      svg.setAttribute("height", "64");
      const serializer = new XMLSerializer();
      shieldIconDataUrl = "data:image/svg+xml," + encodeURIComponent(serializer.serializeToString(svg));
    }
    return shieldIconDataUrl;
  }
  function canDrawProfileButton() {
    if (!modStorage.inspector.showProfileButton) {
      return false;
    }
    if (typeof InformationSheetSelection === "undefined" || !InformationSheetSelection) {
      return false;
    }
    const win = window;
    if (win.bcx?.inBcxSubscreen && win.bcx.inBcxSubscreen()) return false;
    if (win.LSCG_REMOTE_WINDOW_OPEN) return false;
    if (win.LITTLISH_CLUB?.inModSubscreen && win.LITTLISH_CLUB.inModSubscreen()) return false;
    if (win.MPA?.menuLoaded) return false;
    if (getCurrentSubscreen() !== null) return false;
    return true;
  }
  function initProfileButton() {
    hookFunction("InformationSheetRun", HookPriority.TOP, (args, next) => {
      if (canDrawProfileButton()) {
        DrawButton(
          ...PROFILE_BUTTON_POSITION,
          "",
          "White",
          getIconDataUrl(),
          `${MOD_NAME} - Addon Inspector`
        );
      }
      const subscreen = getCurrentSubscreen();
      if (subscreen instanceof InspectorSubscreen) {
        return subscreen.run();
      }
      return next(args);
    });
    hookFunction("InformationSheetClick", HookPriority.OBSERVE, (args, next) => {
      if (canDrawProfileButton() && MouseIn(...PROFILE_BUTTON_POSITION)) {
        const target = InformationSheetSelection;
        if (typeof InformationSheetUnload === "function") {
          InformationSheetUnload();
        }
        setSubscreen(new InspectorSubscreen(target));
        return;
      }
      const subscreen = getCurrentSubscreen();
      if (subscreen instanceof InspectorSubscreen) {
        return subscreen.click();
      }
      return next(args);
    });
    hookFunction("InformationSheetExit", HookPriority.OBSERVE, (args, next) => {
      const subscreen = getCurrentSubscreen();
      if (subscreen instanceof InspectorSubscreen) {
        return subscreen.exit();
      }
      return next(args);
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
      initNetworkSync();
      initProfileButton();
      initFusamManifest().catch(console.warn);
      evaluateCompliance();
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
      MainSubscreen: MainSubscreen2,
      ChatResizerSubscreen,
      AuthoritySubscreen,
      InspectorSubscreen
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
lucide/dist/esm/icons/bug.mjs:
lucide/dist/esm/icons/check.mjs:
lucide/dist/esm/icons/chevron-down.mjs:
lucide/dist/esm/icons/circle-alert.mjs:
lucide/dist/esm/icons/circle-check.mjs:
lucide/dist/esm/icons/circle-x.mjs:
lucide/dist/esm/icons/code-xml.mjs:
lucide/dist/esm/icons/external-link.mjs:
lucide/dist/esm/icons/git-pull-request.mjs:
lucide/dist/esm/icons/info.mjs:
lucide/dist/esm/icons/rotate-ccw.mjs:
lucide/dist/esm/icons/search.mjs:
lucide/dist/esm/icons/shield-check.mjs:
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
