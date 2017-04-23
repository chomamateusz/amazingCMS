import {
  inject
} from "aurelia-framework";

import {
  DbFirebaseHandler
} from "services/dbHandlers/dbFirebaseHandler.js";

@inject(DbFirebaseHandler)
export class DbService {
  constructor(dbFirebaseHandler) {
    this.dbFirebaseHandler = dbFirebaseHandler; // DbFirebaseService
    // TODO get handler form config
    this.setActiveDbHandler('firebase');
  }

  getSubitems(mainItemName) {
    return this.dbHandler.getSubitems(mainItemName);
  }

  getMainItem(mainItemName) {
    return this.dbHandler.getMainItem(mainItemName);
  }

  getMainItems(mainItemName) {
    return this.dbHandler.getMainItems(mainItemName);
  }

  getItems(mainItemName, orderBy, startAt, endAt, reverse) {
    return this.dbHandler.getItems(mainItemName, orderBy, startAt, endAt, reverse);
  }

  getItem(mainItemName, itemKey, orderBy) {
    return this.dbHandler.getItem(mainItemName, itemKey, orderBy);
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
