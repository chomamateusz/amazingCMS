import {
  inject
} from "aurelia-framework";

import {
  DbFirebaseHandler
} from "dbFirebaseHandler.js";

@inject(DbFirebaseHandler)
export class DbService {
  constructor(dbFirebaseHandler) {
    this.dbFirebaseHandler = dbFirebaseHandler; // DbFirebaseService

    // TODO get handler form config
    this.setActiveDbHandler('firebase');
  }

  getSubitems(mainItemName) {

  }

  getItemData(mainItemName, itemKey) {

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
