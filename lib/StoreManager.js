'use strict';

var _ = require('lodash');

/**
 * Stores manager
 *
 * This manager contain the list of stores you want to share theirs context
 * between the server side and the client side
 *
 * The stores need to implement this interface
 * {
 *     name: (string),
 *     serialize: function() {},
 *     unserialize: function(payload) {}
 * }
 *
 * "serialize" method return the data you want to keep
 * "unserialize" method take in parameter the data serialized and rebuild the state of the store
 *
 * @constructor
 */
function StoreManager() {
    var _stores = {};

    var _checkStoreInterface = function(store) {
        return _.has(store, 'name') && _.has(store, 'serialize') && _.has(store, 'unserialize') &&
            _.isFunction(store.serialize) && _.isFunction(store.unserialize) && _.isString(store.name);
    };

    /**
     * Add store to the collection
     *
     * @param {object} store
     */
    this.add = function(store) {
        if (!_checkStoreInterface(store)) {
            throw new Error('the store not implemented the interface');
        }

        _stores[store.name] = store;
    };

    /**
     * Dump the context of the whole list of stores
     *
     * @returns {object}
     */
    this.dumpContext = function() {
        var serializedObject = {};
        _.forEach(_stores, function(store, storeName) {
            serializedObject[storeName] = store.serialize();
        });
        return serializedObject;
    };

    /**
     * Load the context for the stores added into the collection
     *
     * @param {object} payload
     */
    this.loadContext = function(payload) {
        _.forEach(payload, function(serializedStore, storeName) {
            if (_.has(_stores, storeName)) {
                _stores[storeName].unserialize(serializedStore);
            }
        });
    };

    /**
     * Return the plain object of stores
     *
     * @return {object}
     */
    this.getStores = function() {
        return _stores;
    };
}

module.exports = StoreManager;