import {
  inject
} from "aurelia-framework";

import {
  LoaderService
} from "services/loaderService.js";
import {
  DbFirebaseHandler
} from "services/dbHandlers/dbFirebaseHandler.js";

@inject(DbFirebaseHandler, LoaderService)
export class DbService {
  constructor(dbFirebaseHandler, loaderService) {
    this.dbFirebaseHandler = dbFirebaseHandler; // DbFirebaseService
    this.loader = loaderService; // LoaderService
    // TODO get handler form config
    this.setActiveDbHandler('firebase');
  }

  loadData(functionName, args){
    let promise = new Promise((resolve, reject)=>{
      this.loader.startLoading();
      this.dbHandler[functionName](...args).then((data)=>{
        this.loader.endLoading();
        resolve(data);
      });
    });
    return promise;
  }

  getSubitems(mainItemName) {
    return this.loadData('getSubitems', [mainItemName]);
  }

  getMainItem(mainItemName) {
    return this.loadData('getMainItem', [mainItemName]);
  }

  getMainItems(mainItemName) {
    return this.loadData('getMainItems', [mainItemName]);
  }

  getItems(mainItemName, orderBy, startAt, endAt, reverse) {
    return this.loadData('getItems', [mainItemName, orderBy, startAt, endAt, reverse]);
  }

  getItem(mainItemName, itemKey, orderBy) {
    return this.loadData('getItem', [mainItemName, itemKey, orderBy]);
  }

  setActiveDbHandler(handler) {
    switch (handler) {
      case 'firebase':
        this.dbHandler = this.dbFirebaseHandler;
        break;
      case 'rethink':
        this.dbHandler = this.dbRethinkHandler;
        break;
      default: // firebase
        this.dbHandler = this.dbFirebaseHandler;
    }
  }
}
