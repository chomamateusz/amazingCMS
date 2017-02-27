import {
    inject
} from "aurelia-framework";

@inject('subitemRef')
export class SubitemsDbService {

    constructor(subitemRef) {
        this.subitemsOrginal = [];
        this.subitemsWorkingCopy = [];
        this.subitemsNames = null;
        this.subitemRef = subitemRef;
    }

    // return an array of subitems snapshots
    getSubitems(mainItemName) {
        var promise = new Promise((resolve, reject) => {
            if (!(this.subitemsOrginal[mainItemName] && this.subitemsWorkingCopy[mainItemName])) { // if subitems arent already loaded
                this.subitemRef.child(mainItemName).once('value').then(mainItemSnapshot => {
                    if (mainItemSnapshot.numChildren() == 0) {
                        reject();
                    } else {
                        var tmpSubitems = [];
                        mainItemSnapshot.forEach(itemSnapshot => {
                            let tmpItem = itemSnapshot.val();
                            tmpItem.key = itemSnapshot.key; // store key in value
                            tmpSubitems.push(tmpItem);
                        });
                        this.subitemsOrginal[mainItemName] = JSON.parse(JSON.stringify(tmpSubitems));
                        this.subitemsWorkingCopy[mainItemName] = JSON.parse(JSON.stringify(tmpSubitems));
                        console.log('subitemsWorkingCopy form DB:');
                        console.log(this.subitemsWorkingCopy[mainItemName]);
                        resolve(this.subitemsWorkingCopy[mainItemName]);
                    }
                });
            } else { // if subitems are already loaded
                resolve(this.subitemsWorkingCopy[mainItemName]);
            }
        });
        return promise;
    }

    getItem() {
        // probably useless
    }

    update() {
        // probably useless
    }
}