'use strict';

jest.dontMock('../StoreManager');
jest.dontMock('lodash');

var StoreManager = require('../StoreManager');

describe('StoreManager', function() {

    it('constructor', function() {
        var manager = new StoreManager();
        expect(manager.getStores()).toEqual({});
    });

    it('add store to the manager', function() {
        // Create a simple store which respect the interface expected
        var store = {
            name: 'MyStore',
            serialize: function() {},
            unserialize: function() {}
        };

        var manager = new StoreManager();

        // Add it on the manager
        manager.add(store);

        expect(manager.getStores().MyStore).toEqual(store);
    });

    it('dump context of all stores', function() {
        // Create a simple store which respect the interface expected
        var store = {
            name: 'MyStore',
            serialize: function() {
                return {
                    data: 'chuck-norris'
                };
            },
            unserialize: function() {}
        };

        var manager = new StoreManager();

        // Add it on the manager
        manager.add(store);

        expect(manager.dumpContext()).toEqual({
            MyStore: {
                data: 'chuck-norris'
            }
        });
    });

    it('load context for all stores declared', function() {
        // Create a simple store which respect the interface expected
        var Store = function() {
            this.data = {};
            this.name = '';

            this.serialize = function() {};

            this.unserialize = function(payload) {
                this.data = payload;
            }.bind(this);
        };

        var myStore = new Store();
        myStore.name = 'StoreOne';

        var secondStore = new Store();
        secondStore.name = 'StoreTwo';

        var manager = new StoreManager();

        // Add it on the manager
        manager.add(myStore);
        manager.add(secondStore);

        var dataLoaded = {
            kevin: 'chuck-norris'
        };

        manager.loadContext({
            StoreNotExist: dataLoaded,
            StoreOne: dataLoaded,
            StoreTwo: dataLoaded
        });

        expect(manager.getStores().StoreOne.data).toEqual(dataLoaded);
        expect(manager.getStores().StoreTwo.data).toEqual(dataLoaded);

        // This store can't be loaded because it is not declared
        expect(manager.getStores().StoreNotExist).toEqual(undefined);
    });

    it('store not implemented the interface', function() {
        var manager = new StoreManager();

        // Create a simple store which not respect the interface
        // Without "serialize" method
        var MyStoreWithoutSerialize = function() {
            this.name = 'MyStore';
            this.unserialize = function(payload) {};
        };
        var myStoreWithoutSerialize = new MyStoreWithoutSerialize();

        expect(function() {
            manager.add(myStoreWithoutSerialize);
        }).toThrow('the store not implemented the interface');


        // Create a simple store which not respect the interface
        // Without "unserialize" method
        var MyStoreWithoutUnserialize = function() {
            this.name = 'MyStore';
            this.serialize = function(payload) {};
        };
        var myStoreWithoutUnserialize = new MyStoreWithoutUnserialize();

        expect(function() {
            manager.add(myStoreWithoutUnserialize);
        }).toThrow('the store not implemented the interface');


        // Create a simple store which not respect the interface
        // Without "name" property
        var MyStoreWithoutName = function() {
            this.serialize = function(payload) {};
            this.unserialize = function(payload) {};
        };
        var myStoreWithoutName = new MyStoreWithoutName();

        expect(function() {
            manager.add(myStoreWithoutName);
        }).toThrow('the store not implemented the interface');
    });
});


