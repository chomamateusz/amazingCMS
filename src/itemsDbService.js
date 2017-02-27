import {
  inject
} from "aurelia-framework";

@inject('dbRef')
export class ItemsDbService {

  constructor(dbRef) {
    this.itemsOrginal = [];
    this.itemsWorkingCopy = [];
    this.dbRef = dbRef;
  }

  // return an array of items snapshots
  getItems(mainItemName, orderBy, startAt, endAt, reverse) {
    var promise = new Promise((resolve, reject) => {
      if (!(this.itemsOrginal[mainItemName] && this.itemsWorkingCopy[mainItemName]) || startAt != null || endAt != null) { // if items arent already loaded OR startAt endAt force reload (we dont know what part of data was previously loaded)
        if (orderBy == undefined) {
          console.log('ITEMS-DB-SERVICE: no orderBy specified - using default');
          orderBy = 'meta/order';
        } else {
          console.log('ITEMS-DB-SERVICE: orderBy is specified - ', orderBy);
        }
        if (reverse == undefined){
          console.log('ITEMS-DB-SERVICE: no reverse specified - using false');
          reverse = false;
        }else{
          console.log('ITEMS-DB-SERVICE: reverse is specified - using ', reverse);
        }
        if (startAt != undefined) {
          if (endAt != undefined) {
            console.log('ITEMS-DB-SERVICE: startAt and endAt are specified - using ', startAt, endAt);
            this.dbRef.child(mainItemName).orderByChild(orderBy).startAt(startAt).endAt(endAt).once('value').then(mainItemSnapshot => {
              console.log('ITEMS-DB-SERVICE: callback fired');
              if (mainItemSnapshot.numChildren() == 0) {
                console.log('ITEMS-DB-SERVICE: no items found in DB');
                reject('No items in: ' + mainItemName + '!');
              } else {
                var tmpItems = [];
                mainItemSnapshot.forEach(itemSnapshot => {
                  let tmpItem = itemSnapshot.val();
                  // if(tmpItem.meta == undefined)  tmpItem.meta = {}; // new item
                  tmpItem.meta.key = itemSnapshot.key; // store key in value
                  tmpItems.push(tmpItem);
                });
                if(reverse == true) {tmpItems.reverse();}
                this.itemsOrginal[mainItemName] = JSON.parse(JSON.stringify(tmpItems));
                this.itemsWorkingCopy[mainItemName] = JSON.parse(JSON.stringify(tmpItems));
                console.log('ITEMS-DB-SERVICE: itemsWorkingCopy form DB:');
                console.log(this.itemsWorkingCopy[mainItemName]);
                resolve(this.itemsWorkingCopy[mainItemName]);
              }
            }).catch(error => {
              console.error('ITEMS-DB-SERVICE - db error: ', error);
              reject(error);
            });
          } else {
            console.log('ITEMS-DB-SERVICE: startAt is specified - using ', startAt);
            this.dbRef.child(mainItemName).orderByChild(orderBy).startAt(startAt).once('value').then(mainItemSnapshot => {
              console.log('ITEMS-DB-SERVICE: callback fired');
              if (mainItemSnapshot.numChildren() == 0) {
                console.log('ITEMS-DB-SERVICE: no items found in DB');
                reject('No items in: ' + mainItemName + '!');
              } else {
                var tmpItems = [];
                mainItemSnapshot.forEach(itemSnapshot => {
                  let tmpItem = itemSnapshot.val();
                  // if(tmpItem.meta == undefined)  tmpItem.meta = {}; // new item
                  tmpItem.meta.key = itemSnapshot.key; // store key in value
                  tmpItems.push(tmpItem);
                });
                if(reverse == true) {tmpItems.reverse();}
                this.itemsOrginal[mainItemName] = JSON.parse(JSON.stringify(tmpItems));
                this.itemsWorkingCopy[mainItemName] = JSON.parse(JSON.stringify(tmpItems));
                console.log('ITEMS-DB-SERVICE: itemsWorkingCopy form DB:');
                console.log(this.itemsWorkingCopy[mainItemName]);
                resolve(this.itemsWorkingCopy[mainItemName]);
              }
            }).catch(error => {
              console.error('ITEMS-DB-SERVICE - db error: ', error);
              reject(error);
            });
          }
        } else {
          if (endAt != undefined) {
            console.log('ITEMS-DB-SERVICE: endAt is specified - using ', endAt);
            this.dbRef.child(mainItemName).orderByChild(orderBy).endAt(endAt).once('value').then(mainItemSnapshot => {
              console.log('ITEMS-DB-SERVICE: callback fired');
              if (mainItemSnapshot.numChildren() == 0) {
                console.log('ITEMS-DB-SERVICE: no items found in DB');
                reject('No items in: ' + mainItemName + '!');
              } else {
                var tmpItems = [];
                mainItemSnapshot.forEach(itemSnapshot => {
                  let tmpItem = itemSnapshot.val();
                  // if(tmpItem.meta == undefined)  tmpItem.meta = {}; // new item
                  tmpItem.meta.key = itemSnapshot.key; // store key in value
                  tmpItems.push(tmpItem);
                });
                if(reverse == true) {tmpItems.reverse();}
                this.itemsOrginal[mainItemName] = JSON.parse(JSON.stringify(tmpItems));
                this.itemsWorkingCopy[mainItemName] = JSON.parse(JSON.stringify(tmpItems));
                console.log('ITEMS-DB-SERVICE: itemsWorkingCopy form DB:');
                console.log(this.itemsWorkingCopy[mainItemName]);
                resolve(this.itemsWorkingCopy[mainItemName]);
              }
            }).catch(error => {
              console.error('ITEMS-DB-SERVICE - db error: ', error);
              reject(error);
            });
          } else {
            console.log('ITEMS-DB-SERVICE: no startAt and no endAt are specified - using none');
            this.dbRef.child(mainItemName).orderByChild(orderBy).once('value').then(mainItemSnapshot => {
              console.log('ITEMS-DB-SERVICE: callback fired');
              if (mainItemSnapshot.numChildren() == 0) {
                console.log('ITEMS-DB-SERVICE: no items found in DB');
                reject('No items in: ' + mainItemName + '!');
              } else {
                var tmpItems = [];
                mainItemSnapshot.forEach(itemSnapshot => {
                  let tmpItem = itemSnapshot.val();
                  // if(tmpItem.meta == undefined)  tmpItem.meta = {}; // new item
                  tmpItem.meta.key = itemSnapshot.key; // store key in value
                  tmpItems.push(tmpItem);
                });
                if(reverse == true) {tmpItems.reverse();}
                this.itemsOrginal[mainItemName] = JSON.parse(JSON.stringify(tmpItems));
                this.itemsWorkingCopy[mainItemName] = JSON.parse(JSON.stringify(tmpItems));
                console.log('ITEMS-DB-SERVICE: itemsWorkingCopy form DB:');
                console.log(this.itemsWorkingCopy[mainItemName]);
                resolve(this.itemsWorkingCopy[mainItemName]);
              }
            }).catch(error => {
              console.error('ITEMS-DB-SERVICE - db error: ', error);
              reject(error);
            });
          }
        }
      } else { // if items are already loaded
        resolve(this.itemsWorkingCopy[mainItemName]);
      }
    });
    return promise;
  }

  getItem(mainItemName, itemKey, orderBy) {
    var promise = new Promise((resolve, reject) => {
      this.getItems(mainItemName, orderBy).then(() => { // get items if they are not loaded
        var i = 0;
        this.itemsWorkingCopy[mainItemName].forEach((item) => {
          if (item.meta.key == itemKey) {
            resolve([this.itemsOrginal[mainItemName][i], this.itemsWorkingCopy[mainItemName][i]]); // there is an item with that key | i cant find the way to resolve with 2 args so it is resolved with array
          }
          i++;
        });
        reject(); // mo item found
      }).catch(() => {
        reject(); // DB promise rejected
      });
    });
    return promise;
  }

  update(mainItemName, itemsToChange) {
    var promise = new Promise((resolve, reject) => {
      this.dbRef.child(mainItemName).update(itemsToChange, () => {
        console.log('Changes updated in database!', mainItemName, itemsToChange);
        this.itemsOrginal[mainItemName] = JSON.parse(JSON.stringify(this.itemsWorkingCopy[mainItemName]));
        resolve();
      });
    });
    return promise;
  }

  push(mainItemName, itemsToPush, orderBy) {
    var promise = new Promise((resolve, reject) => {
      this.dbRef.child(mainItemName).push(itemsToPush).then(callback => {
        itemsToPush.meta.key = callback.key;
        if (this.itemsOrginal[mainItemName] == undefined || this.itemsOrginal[mainItemName] == null) { // if no items there is no this two vars
          this.itemsOrginal[mainItemName] = [];
        }
        if (this.itemsWorkingCopy[mainItemName] == undefined || this.itemsWorkingCopy[mainItemName] == null) {
          this.itemsWorkingCopy[mainItemName] = [];
        }
        if (orderBy == "meta/timestamp") {
          // item in front of table
          this.itemsOrginal[mainItemName].unshift(JSON.parse(JSON.stringify(itemsToPush)));
          this.itemsWorkingCopy[mainItemName].unshift(JSON.parse(JSON.stringify(itemsToPush)));
        } else {
          // item in end of table
          this.itemsOrginal[mainItemName].push(JSON.parse(JSON.stringify(itemsToPush)));
          this.itemsWorkingCopy[mainItemName].push(JSON.parse(JSON.stringify(itemsToPush)));
        }
        resolve(callback.key)
      }).catch((e) => {
        reject();
      });
    });
    return promise;
  }

  remove(mainItemName, itemKey) {
    // TODO REMOVING FOLDER FROM STOREAGE - should be easy all files from item are in the item folder
    // TODO REMOVING ALL NESTED MAINITEMS
    var promise = new Promise((resolve, reject) => {
      this.dbRef.child(mainItemName).child(itemKey).remove().then(() => {
        this.getItem(mainItemName, itemKey).then(promise => {
          var itemsOrginalIndex = this.itemsOrginal[mainItemName].indexOf(promise[0]); // index of item in array
          var itemsWorkingCopyIndex = this.itemsWorkingCopy[mainItemName].indexOf(promise[1]); // index of item in array
          this.itemsOrginal[mainItemName].remove(itemsOrginalIndex);
          this.itemsWorkingCopy[mainItemName].remove(itemsWorkingCopyIndex);
          console.log('removed');
          console.log(this.itemsOrginal);
          console.log(this.itemsWorkingCopy);
          resolve();
        });
      });
    });
    return promise;
  }

  resetToOrginal(mainItemName) {

    if (mainItemName == undefined || mainItemName == null || mainItemName.trim() == '') {
      console.log('Resetting items in: ' + mainItemName);
      this.itemsWorkingCopy[mainItemName] = JSON.parse(JSON.stringify(this.itemsOrginal[mainItemName]));
    } else {
      console.log('Resetting ALL items!');
      this.itemsWorkingCopy = JSON.parse(JSON.stringify(this.itemsOrginal));
    }
  }

  makeVisible(mainItemName, itemKey) {
    var promise = new Promise((resolve, reject) => {
      this.dbRef.child(mainItemName).child(itemKey).child('meta').child('visible').set(true).then(() => {
        resolve();
      });
    });
    return promise;
  }
  makeHidden(mainItemName, itemKey) {
    var promise = new Promise((resolve, reject) => {
      this.dbRef.child(mainItemName).child(itemKey).child('meta').child('visible').set(false).then(() => {
        resolve();
      });
    });
    return promise;
  }
}

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function (from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
