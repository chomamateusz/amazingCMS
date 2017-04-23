import {
	inject
} from "aurelia-framework";
import * as firebase from 'firebase';

export class DbFirebaseHandler {
	constructor() {
		this.initializeFirebase();
    this.items = [];
    this.subitems = [];
    this.mainItems = [];
	}

	initializeFirebase() {
		// Initialize Firebase
		var config = {
			apiKey: "AIzaSyCyyvpDENphJFC3Te0xkGkT6RXEodOHCcM",
			authDomain: "dajsiepoznac2017.firebaseapp.com",
			databaseURL: "https://dajsiepoznac2017.firebaseio.com",
			storageBucket: "dajsiepoznac2017.appspot.com",
			messagingSenderId: "1042862032532"
		};

		if (!firebase.apps.length) {
			firebase.initializeApp(config);
		}

		// main data db ref
		this.mainItemsDataRef = firebase.database().ref('mainItemsData');
		// subitemDefs db ref
		this.subitemRef = firebase.database().ref('subitemDefs');
		// mainItemsRef db ref
		this.mainItemsRef = firebase.database().ref('mainItemsDefs');
		// storage data refernece
		this.storageRef = firebase.storage().ref('mainItemsData');
	}

	getSubitems(mainItemName) {
		var promise = new Promise((resolve, reject) => {
			this.subitemRef.child(mainItemName).once('value').then(mainItemSnapshot => {
				if (mainItemSnapshot.numChildren() == 0) {
					reject('No children!');
				} else {
					var tmpSubitems = [];
					mainItemSnapshot.forEach(itemSnapshot => {
						let tmpItem = itemSnapshot.val();
						tmpItem.key = itemSnapshot.key; // store key in value
						tmpSubitems.push(tmpItem);
					});
					this.subitems[mainItemName] = JSON.parse(JSON.stringify(tmpSubitems));
					console.log('subitems form DB: ', this.subitems);
					resolve(this.subitems[mainItemName]);
				}
			});
		});
		return promise;
	}

	getMainItems() {
		var promise = new Promise((resolve, reject) => {
			this.mainItemsRef.orderByChild('menuOrder').once('value').then(mainItemsSnapshot => {
				if (mainItemsSnapshot.numChildren() == 0) {
					reject('No main items in DB');
				} else {
					var tmpMainItems = [];
					mainItemsSnapshot.forEach(mainItemSnapshot => {
						let tmpMainItem = mainItemSnapshot.val();
						tmpMainItem.key = mainItemSnapshot.key; // store key in value
						tmpMainItems.push(tmpMainItem);
					});
					this.mainItems = JSON.parse(JSON.stringify(tmpMainItems));
					resolve(this.mainItems);
				}
			});
		});
		return promise;
	}

	getMainItem(mainItemName) {
		var promise = new Promise((resolve, reject) => {
			this.getMainItems().then(() => {
				var i = 0;
				this.mainItems.forEach((mainItem) => {
					console.log('mainItem.key: ', mainItem.key, 'mainItemName', mainItemName);
					if (mainItem.key == mainItemName) {
						resolve(mainItem);
					}
					i++;
				});
				reject('No main item found'); // no item found
			}).catch((e) => {
				reject(e);
			});
		});
		return promise;
	}

	getItems(mainItemName, orderBy, startAt, endAt, reverse) {
		function isSpecified(variable, defaultValue) {
			if (variable == undefined) {
				variable = defaultValue;
			}
			return variable;
		}

		function dbResponseCallback(mainItemSnapshot) {
			console.log('ITEMS-DB-SERVICE: callback fired');
			if (mainItemSnapshot.numChildren() == 0) {
				console.log('ITEMS-DB-SERVICE: no items found in DB');
				throw Error;
			} else {
				var tmpItems = [];
				mainItemSnapshot.forEach(itemSnapshot => {
					let tmpItem = itemSnapshot.val();
					tmpItem.meta.key = itemSnapshot.key; // store key in value
					tmpItems.push(tmpItem);
				});
				if (reverse == true) { tmpItems.reverse(); }
				this.items[mainItemName] = JSON.parse(JSON.stringify(tmpItems));
				console.log('ITEMS-DB-SERVICE: items form DB:', this.items);
				return this.items[mainItemName];
			}
		}

		var promise = new Promise((resolve, reject) => {
			orderBy = isSpecified(orderBy, 'meta/order');
			reverse = isSpecified(reverse, false);
			if (startAt != undefined) {
				if (endAt != undefined) {
					console.log('ITEMS-DB-SERVICE: startAt and endAt are specified - using ', startAt, endAt);
					this.mainItemsDataRef.child(mainItemName).orderByChild(orderBy).startAt(startAt).endAt(endAt).once('value').then(mainItemSnapshot => {
						resolve(dbResponseCallback.call(this, mainItemSnapshot));
					}).catch(error => {
						console.error('ITEMS-DB-SERVICE - db error: ', error);
						reject(error);
					});
				} else {
					console.log('ITEMS-DB-SERVICE: startAt is specified - using ', startAt);
					this.mainItemsDataRef.child(mainItemName).orderByChild(orderBy).startAt(startAt).once('value').then(mainItemSnapshot => {
						resolve(dbResponseCallback.call(this, mainItemSnapshot));
					}).catch(error => {
						console.error('ITEMS-DB-SERVICE - db error: ', error);
						reject(error);
					});
				}
			} else {
				if (endAt != undefined) {
					console.log('ITEMS-DB-SERVICE: endAt is specified - using ', endAt);
					this.mainItemsDataRef.child(mainItemName).orderByChild(orderBy).endAt(endAt).once('value').then(mainItemSnapshot => {
						resolve(dbResponseCallback.call(this, mainItemSnapshot));
					}).catch(error => {
						console.error('ITEMS-DB-SERVICE - db error: ', error);
						reject(error);
					});
				} else {
					console.log('ITEMS-DB-SERVICE: no startAt and no endAt are specified - using none');
					this.mainItemsDataRef.child(mainItemName).orderByChild(orderBy).once('value').then(mainItemSnapshot => {
						resolve(dbResponseCallback.call(this, mainItemSnapshot));
					}).catch(error => {
						console.error('ITEMS-DB-SERVICE - db error: ', error);
						reject(error);
					});
				}
			}

		});
		return promise;
	}

  getItem(mainItemName, itemKey, orderBy) {
    var promise = new Promise((resolve, reject) => {
      this.getItems(mainItemName, orderBy).then(() => { // get items if they are not loaded
        var i = 0;
        this.items[mainItemName].forEach((item) => {
          if (item.meta.key == itemKey) {
            resolve([this.items[mainItemName][i], this.items[mainItemName][i]]); // there is an item with that key | i cant find the way to resolve with 2 args so it is resolved with array
          }
          i++;
        });
        reject('No item found'); 
      }).catch(() => {
        reject('Error');
      });
    });
    return promise;
  }

}
