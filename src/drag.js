import {
  inject,
  bindable
} from "aurelia-framework";
import {
  Router
} from 'aurelia-router';
import {
  ItemsDbService
} from "itemsDbService";
import {
  SubitemsDbService
} from "subitemsDbService";
import {
  MainItemsDbService
} from "mainItemsDbService";

import {
  DialogService
} from 'aurelia-dialog';
import {
  Confirm
} from 'confirm';

import {
  FirebaseAuth
} from 'firebaseAuth'

@inject(ItemsDbService, Router, SubitemsDbService, DialogService, FirebaseAuth, MainItemsDbService, 'nestedItemsSeparator')
export class Drag {
  dragItems = [];
  dragItemsOrder = [];
  itemsToChange = {};
  itemsOrderChanged = false;

  // these elements are not draggable
  disallowedDragTagNames = ['INPUT', 'SELECT', 'TEXTAREA'];

  constructor(itemsDbService, router, subitemsDbService, dialogService, firebaseAuth, mainItemsDbService, nestedItemsSeparator) {
    this.noItems = false;
    this.mainItem = ''; // it should be main Item name
    this.mainItemDefs = '';
    this.subitemsToShow = [];
    this.dragMode = '';
    this.orderBy = '';
    this.router = router;
    this.firebaseAuth = firebaseAuth;
    this.dialogService = dialogService;
    this.itemsDbService = itemsDbService;
    this.subitemsDbService = subitemsDbService;
    this.mainItemsDbService = mainItemsDbService;
    this.nestedItemsSeparator = nestedItemsSeparator;
    this.parentMainItemName = false;
    this.parenItemKey = false;
  }

  canActivate() {
    if (this.firebaseAuth.user != false) {
      console.log('DRAG auth ok - displaying view');
      return true;
    } else {
      console.log('DRAG no user logged - NOT displaying view ');
      this.router.navigate("login");
      return false;
    }
  }

  activate(params) {
    console.log('DRAG view activated! With params:', params);
    this.mainItem = params.mainItem;

    var mainItemName = '';
    var checkNestedArr = this.mainItem.split(this.nestedItemsSeparator);

    mainItemName = checkNestedArr[0];

    console.log(this.nestedItemsSeparator, checkNestedArr);
    if (checkNestedArr.length == 1) {
      console.log('DRAG - displaying NO nested main item named: ', mainItemName);
      this.parentMainItemName = false;
    } else {
      console.log('DRAG - displaying nested main item named: ', mainItemName);
      this.parentMainItemName = checkNestedArr[1];
      this.parenItemKey = checkNestedArr[2];
    }

    this.subitemsToShow = [];
    this.dragMode = '';
    this.orderBy = '';
    this.noItems = false;
    this.dragItems = [];
    this.itemsOrderChanged = false;
    this.mainItemsDbService.getMainItem(mainItemName).then(mainItem => {
      this.mainItemDefs = mainItem;
      console.log('DRAG - main item loaded', mainItem);
      for (var subitem in mainItem.subitems) { // forEach for objects ;) - changing mainItemDefs's subitems into an repetable array 
        this.subitemsToShow.push(mainItem.subitems[subitem]);
      }
      console.log('DRAG - subitemsToShow', this.subitemsToShow);
      this.dragMode = mainItem.drag;
      console.log('DRAG - drag mode: ', this.dragMode);
      this.orderBy = mainItem.order;
      console.log('DRAG - order by: ', this.orderBy);
      this.startAt = this.setStartEndAt(mainItem.startAt);
      console.log('DRAG - startAt: ', this.startAt);
      this.endAt = this.setStartEndAt(mainItem.endAt);
      console.log('DRAG - endAt: ', this.endAt);
      this.reverse = this.setStartEndAt(mainItem.reverse);
      console.log('DRAG - reverse: ', this.reverse);
      if (mainItem.mainItem != undefined) {
        this.mainItem = mainItem.mainItem;
        console.log('DRAG - main item overwritten by: ', this.mainItem);
      } else {
        console.log('DRAG - main item not overwritten: ', this.mainItem);
      }
      this.itemsDbService.getItems(this.mainItem, this.orderBy, this.startAt, this.endAt, this.reverse).then(itemsWorkingCopy => {
        this.dragItems = itemsWorkingCopy;
      }).catch(() => {
        console.log('DRAG - no items passed from DB!');
        this.noItems = 'No items found in database!';
      });
    }).catch((e) => {
      console.log('DRAG - error loading main item!', e);
    });
  }

  setStartEndAt(value) {
    if (value == '~~!~~now') {
      return Date.now();
    } else {
      return value;
    }
  }

  canDeactivate() {
    if (this.itemsOrderChanged) {
      return this.dialogService.open({
        viewModel: Confirm,
        model: {
          header: 'Nowy porządek nie zapisany!',
          message: 'Na pewno chcesz przejść dalej? Poprzedni porządek zostanie przywrócony!',
          btnAccept: 'Tak!',
          btnCancel: 'Nie, chcę go zapisać!'
        }
      })
        .then(result => {
          if (!result.wasCancelled) {
            this.itemsDbService.resetToOrginal(this.mainItem);
            return true;
          } else {
            return false;
          }
        }).catch(() => {
          return false;
        });
    } else {
      return true;
    }
  }

  moved() { }

  // decide if element is dragabble here
  @bindable allowDrag = args => {
    if (this.disallowedDragTagNames.indexOf(args.event.target.tagName) !== -1) {
      return false;
    }
    if (args.event.target.isContentEditable) {
      return false;
    }
    if (!this.dragMode) {
      console.log('DRAG: NO drag allowed!');
      return false;
    }
    console.log('DRAG: drag allowed!');
    return true;
  };

  @bindable moved = args => {
    console.log('Called checkorder with ' + this.mainItem);
    this.checkOrder();
  }

  checkOrder() {
    var i = 0;
    this.itemsToChange = {};

    this.itemsDbService.itemsOrginal[this.mainItem].forEach(item => { // check each dragItems with orginals from DB and write potential changes
      //console.log(item.data.title.val + ' order = ' + item.meta.order + ' AND ' + this.dragItems[i].data.title.val + ' order =  ' + this.dragItems[i].meta.order);
      if (item.meta.key !== this.dragItems[i].meta.key) {
        this.itemsToChange[this.dragItems[i].meta.key + '/meta/order'] = item.meta.order;
      }
      this.dragItems[i].meta.order = item.meta.order;
      i++;
    });
    if (!(Object.keys(this.itemsToChange).length === 0 && this.itemsToChange.constructor === Object)) { // if this.itemsToChange nat empty
      console.log('Order differ from orginal! Items to change', this.itemsToChange);
      this.itemsOrderChanged = true;
    } else {
      console.log('Same order as in DB - do nothing');
      this.itemsOrderChanged = false;
    }
  }

  saveChanges() {
    this.itemsOrderChanged = false;
    this.itemsDbService.update(this.mainItem, this.itemsToChange);
  }

  edit(itemKey) {
    this.router.navigate("itemEdit/" + this.mainItem + "/" + itemKey);
  }

  makeNewItem() {
    var newItemOrder = 0;
    if (this.itemsDbService.itemsWorkingCopy[this.mainItem] == undefined || this.itemsDbService.itemsWorkingCopy[this.mainItem] == null) {
      newItemOrder = 1;
    } else {
      this.itemsDbService.itemsWorkingCopy[this.mainItem].forEach(item => {
        // get the highest
        if (item.meta.order > newItemOrder) {
          newItemOrder = item.meta.order;
        }
      });
      // and add one more `
      newItemOrder++;
    }

    if (this.mainItemDefs.visibleByDefault == undefined) {
      this.mainItemDefs.visibleByDefault = false;
    }

    var author = '';
    if (this.mainItemDefs.author != undefined) {
      author = this.mainItemDefs.author;
    }

    var meta = {
      "author": author,
      "category": "",
      "order": newItemOrder,
      "tags": "",
      "timestamp": -(new Date().getTime()),
      "visible": this.mainItemDefs.visibleByDefault
    };

    var data = {
      "type": "",
      "val": "",
      "vals": ""
    };

    var newItem = {};

    newItem.meta = meta;
    newItem.data = {};

    var mainItemName = '';
    var checkNestedArr = this.mainItem.split(this.nestedItemsSeparator);
    if (checkNestedArr.length == 1) {
      console.log('DRAG - creating NO nested element');
    } else {
      console.log('DRAG - creating nested element');
    }
    mainItemName = checkNestedArr[0];

    this.subitemsDbService.getSubitems(mainItemName).then(subitems => {
      subitems.forEach(subitem => {
        if (subitem.type == "select-multiple") {
          data.val = []; // must be aray as a multiple select value is
        } else {
          data.val = ""; // must be else cause it would be passed on next elements
        }
        newItem.data[subitem.name] = JSON.parse(JSON.stringify(data));
        newItem.data[subitem.name].type = subitem.type;
      });
      console.log('DRAG - new item created: ', newItem);
      this.itemsDbService.push(this.mainItem, newItem, this.orderBy).then(itemKey => {
        this.router.navigate("itemEdit/" + this.mainItem + "/" + itemKey);
      });
    });
  }

  backToParent() {
    this.router.navigate("itemEdit/" + this.parentMainItemName + '/' + this.parenItemKey);
  }


}
