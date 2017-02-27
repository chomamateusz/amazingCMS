import {
    inject
} from "aurelia-framework";

@inject('mainItemsRef')
export class MainItemsDbService {

    constructor(mainItemsRef) {
        this.mainItems = null;
        this.mainItemsRef = mainItemsRef;
    }
    getMainItems() {
        var promise = new Promise((resolve, reject) => {
            if (!this.mainItems) { // if mainItems arent already loaded
                this.mainItemsRef.orderByChild('menuOrder').once('value').then(mainItemsSnapshot => {
                    if (mainItemsSnapshot.numChildren() == 0) {
                        reject();
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
            } else { // if mainItems are already loaded
                resolve(this.mainItems);
            }
        });
        return promise;
    }

     getMainItem(mainItemName) {
        var promise = new Promise((resolve, reject) => {
            this.getMainItems().then(() => { // get items if they are not loaded
                var i = 0;
                this.mainItems.forEach((mainItem) => {
                    console.log('mainItem.key: ', mainItem.key, 'mainItemName', mainItemName);
                    if (mainItem.key == mainItemName) {
                        resolve(mainItem);
                    }
                    i++;
                });
                reject('no item found'); // no item found
            }).catch((e) => {
                reject(e); // DB promise rejected
            });
        });
        return promise;
    }
}