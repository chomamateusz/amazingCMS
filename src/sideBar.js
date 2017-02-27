import {
    inject
} from "aurelia-framework";
import {
    Router
} from "aurelia-router";
import {
    MainItemsDbService
} from "mainItemsDbService";

import{FirebaseAuth} from 'firebaseAuth';

@inject(MainItemsDbService, Router, FirebaseAuth)
export class SideBar {
    constructor(mainItemsDbService, router, firebaseAuth) {
        this.firebaseAuth = firebaseAuth;
        this.mainItemsDbService = mainItemsDbService;
        this.router = router;
    }

    activate() {
        this.mainItemsDbService.getMainItems().then(mainItems => {
            this.mainItems = mainItems;
            console.log('SIDE BAR - items loaded', this.mainItems);
        });
        console.log('SIDE BAR - activated', this.mainItems);
    }

    goToDrag(mainItemName){
        this.router.navigate('drag/'+mainItemName);
    }

    goToRoute(route){
        this.router.navigate(route);
    }

    extarnalLink(url){
        window.location = url;
    }

    logout(){
        this.firebaseAuth.logout().then(()=>{
            this.goToRoute('login');
        });
    }
}