import {
  inject
} from "aurelia-framework";
import {
  Router
} from "aurelia-router";
import {
  DbService
} from "services/dbService";

import { FirebaseAuth } from 'firebaseAuth';

@inject(DbService, Router, FirebaseAuth)
export class SideBar {
  constructor(dbService, router, firebaseAuth) {
    this.firebaseAuth = firebaseAuth;
    this.db = dbService;
    this.router = router;
  }

  activate() {
    this.db.getMainItems().then(mainItems => {
      this.mainItems = mainItems;
      console.log('SIDE BAR - items loaded', this.mainItems);
    });
    console.log('SIDE BAR - activated', this.mainItems);
  }

  goToDrag(mainItemName) {
    this.router.navigate('drag/' + mainItemName);
  }

  goToRoute(route) {
    this.router.navigate(route);
  }

  extarnalLink(url) {
    window.location = url;
  }

  logout() {
    this.firebaseAuth.logout().then(() => {
      this.goToRoute('login');
    });
  }
}
