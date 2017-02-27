import {
  inject
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
  ImageUpload
} from 'imageUpload';

import {
  FirebaseAuth
} from 'firebaseAuth';

@inject(ItemsDbService, SubitemsDbService, Router, DialogService, FirebaseAuth, 'nestedItemsSeparator', MainItemsDbService)
export class ItemEdit {

  constructor(itemsDbService, subitemsDbService, router, dialogService, firebaseAuth, nestedItemsSeparator, mainItemsDbService) {
    this.firebaseAuth = firebaseAuth;
    this.dialogService = dialogService;
    this.itemsDbService = itemsDbService;
    this.subitemsDbService = subitemsDbService;
    this.mainItemsDbService = mainItemsDbService;
    this.router = router;
    this.imageUploadSubitem = null;
    this.imageUploadSubitemName = null;
    this.contentChanged = false;
    this.visibleSwitch = false;
    this.nestedItemsSeparator = nestedItemsSeparator;
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

  activate(params, routeConfig) {
    var promise = new Promise((resolve, reject) => {

      console.log('Params passed into drag model: ');
      console.log(params);
      this.mainItem = params.mainItem;
      this.itemKey = params.itemKey;

      var mainItemName = '';
      var checkNestedArr = this.mainItem.split(this.nestedItemsSeparator);

      if (checkNestedArr.length == 1) {
        console.log('ITEM-EDIT - displaying NO nested element');
      } else {
        console.log('ITEM-EDIT - displaying nested element');
      }

      mainItemName = checkNestedArr[0];

      // TOD DO it can be moved to makemainitemsparams method or something
      this.mainItemsDbService.getMainItem(mainItemName).then(mainItem => {
        console.log('ITEM-EDIT - displaying main item from DB: ', mainItem);
        //   SETTING canBeDeleted
        if (mainItem.canBeDeleted != undefined) {
          if (mainItem.canBeDeleted == true || mainItem.canBeDeleted == false) { // simply true or false
            this.canBeDeleted = mainItem.canBeDeleted;
          } else { // object user email : true/false and default : true/false
            if (mainItem.canBeDeleted[this.firebaseAuth.user.uid] != undefined) { // there is a rule for certain user
              this.canBeDeleted = mainItem.canBeDeleted[this.firebaseAuth.user.uid];
            } else { // there isnt a rule for certain user - use default
              if (mainItem.canBeDeleted.default != undefined) {
                this.canBeDeleted = mainItem.canBeDeleted.default;
              } else { // there is no default
                this.canBeDeleted = true;
              }
            }
          }
        } else { // there is no canBeDeleted param
          this.canBeDeleted = true;
        }
        //   SETTING canBeHidden
        if (mainItem.canBeHidden != undefined) {
          if (mainItem.canBeHidden == true || mainItem.canBeHidden == false) { // simply true or false
            this.canBeHidden = mainItem.canBeHidden;
          } else { // object user email : true/false and default : true/false
            if (mainItem.canBeHidden[this.firebaseAuth.user.uid] != undefined) { // there is a rule for certain user
              this.canBeHidden = mainItem.canBeHidden[this.firebaseAuth.user.uid];
            } else { // there isnt a rule for certain user - use default
              if (mainItem.canBeHidden.default != undefined) {
                this.canBeHidden = mainItem.canBeHidden.default;
              } else { // there is no default
                this.canBeHidden = true;
              }
            }
          }
        } else { // there is no canBeHidden param
          this.canBeHidden = true;
        }
        //   SETTING canBeSentBackToList
        if (mainItem.canBeSentBackToList != undefined) {
          if (mainItem.canBeSentBackToList == true || mainItem.canBeSentBackToList == false) { // simply true or false
            this.canBeSentBackToList = mainItem.canBeSentBackToList;
          } else { // object user email : true/false and default : true/false
            if (mainItem.canBeSentBackToList[this.firebaseAuth.user.uid] != undefined) { // there is a rule for certain user
              this.canBeSentBackToList = mainItem.canBeSentBackToList[this.firebaseAuth.user.uid];
            } else { // there isnt a rule for certain user - use default
              if (mainItem.canBeSentBackToList.default != undefined) {
                this.canBeSentBackToList = mainItem.canBeSentBackToList.default;
              } else { // there is no default
                this.canBeSentBackToList = true;
              }
            }
          }
        } else { // there is no canBeSentBackToList param
          this.canBeSentBackToList = true;
        };

        console.log('ITEM-EDIT - buttons control (canBeDeleted, canBeHidden, canBeSentBackToList): ', this.canBeDeleted, this.canBeHidden, this.canBeSentBackToList);

        this.itemsDbService.getItem(this.mainItem, this.itemKey, mainItem.order).then(item => {
          this.subitemsDbService.getSubitems(mainItemName).then(subitems => {
            // check here for nested selects
            this.subitems = subitems;
            this.itemOrginal = item[0]; // this is this.itemsOrginal[mainItemName][i]
            this.itemWorkingCopy = item[1]; // this is this.itemsWorkingCopy[mainItemName][i]
            this.visibleSwitch = this.itemWorkingCopy.meta.visible;
            subitems.forEach((subitem, index) => {
              if (subitem.type == 'select' || subitem.type == 'select-multiple') { // nested selects are in selects only ;)
                if (subitem.params.from) { // not all of them are nested
                  this.itemsDbService.getItems(subitem.params.from).then(items => {
                    subitems[index].params.fromItems = JSON.parse(JSON.stringify(items)); // add items to subitem as a copy (for safety)
                    console.log(this.select);
                    console.log('ITEMS-EDIT - select from items: ', subitem.params.fromItems);
                    resolve();
                  }, error => {
                    console.error('ITEMS-EDIT - db error: ', error);
                    reject();
                  });
                } else {
                  resolve();
                }
              } else {
                resolve();
              }
            });

          });
        }).catch(() => {
          console.log('ITEM-EDIT - no item passed from DB!');
          this.noItems = 'ITEM-EDIT - That item doesent exists!';
          reject();
        });

      });

    });

    return promise; // wait for data is loaded!

  }

  canDeactivate() {
    if (this.contentChanged) {
      return this.dialogService.open({
          viewModel: Confirm,
          model: {
            header: 'Zmiany nie zapisane!',
            message: 'Chcesz kontynuować? Zmiany zostaną odrzucone!',
            btnAccept: 'Tak!',
            btnCancel: 'Nie, chcę je zapisać!'
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


  checkChanges() {
    var i = 0;
    this.contentToChange = {};
    for (var subitem in this.itemWorkingCopy.data) { // forEach for objects ;)
      if ((this.itemOrginal.data[subitem] == undefined)) { // new subitem added after creation of data
        console.log('ITEM-EDIT - New subitem: ', subitem, '!');
        if (this.itemWorkingCopy.data[subitem] == undefined) {
          this.itemWorkingCopy.data[subitem] = {};
        }
        if (this.itemWorkingCopy.data[subitem].val == undefined) {
          this.itemWorkingCopy.data[subitem].val = '';
        }
        if (this.itemWorkingCopy.data[subitem].vals == undefined) {
          this.itemWorkingCopy.data[subitem].vals = '';
        }
        this.contentToChange[this.itemKey + '/data/' + subitem + '/val'] = this.itemWorkingCopy.data[subitem].val;
        this.contentToChange[this.itemKey + '/data/' + subitem + '/vals'] = this.itemWorkingCopy.data[subitem].vals;
      } else {
        if (this.itemOrginal.data[subitem].type == 'select-multiple') { // comparing arrays
          console.log("ITEM-EDIT - sorting multiple select values array");
          if (this.itemOrginal.data[subitem].val != undefined) {
            this.itemOrginal.data[subitem].val.sort();
          }
          if (this.itemWorkingCopy.data[subitem].val != undefined) {
            this.itemWorkingCopy.data[subitem].val.sort();
          }
          // ANOTHER REPRESENTATION OF SELECT MULTIPLE VALUES
          console.log("ITEM-EDIT - creating object representation of select multiple values array");
          var objectFromArray = {};
          this.itemWorkingCopy.data[subitem].val.forEach(value => {
            objectFromArray[value] = true;
          });
          this.itemWorkingCopy.data[subitem].vals = {};
          this.itemWorkingCopy.data[subitem].vals.sorted = objectFromArray;
          console.log("ITEM-EDIT - CREATED object representation of select multiple values array - ", this.itemWorkingCopy.data[subitem].vals.sorted);

        }
        if (!(JSON.stringify(this.itemOrginal.data[subitem].val) == JSON.stringify(this.itemWorkingCopy.data[subitem].val))) {
          this.contentToChange[this.itemKey + '/data/' + subitem + '/val'] = this.itemWorkingCopy.data[subitem].val;
          if (!(JSON.stringify(this.itemOrginal.data[subitem].vals) == JSON.stringify(this.itemWorkingCopy.data[subitem].vals))) {
            this.contentToChange[this.itemKey + '/data/' + subitem + '/vals'] = this.itemWorkingCopy.data[subitem].vals;
          }
        } else {
          console.log('ITEM-EDIT - No changes!');
          console.log(subitem, this.itemOrginal.data[subitem].val);
          this.contentChanged = false;
        }
      }
    }
    if (!(Object.keys(this.contentToChange).length === 0 && this.contentToChange.constructor === Object)) { // if this.contentToChange nat empty
      console.log('ITEM-EDIT - Changes!', this.contentToChange);
      console.log('ITEM-EDIT - Item orginal:', this.itemOrginal.data);
      console.log('ITEM-EDIT - Items orginal:', this.itemsDbService.itemsOrginal);
      console.log('ITEM-EDIT - Item WC:', this.itemWorkingCopy.data);
      this.contentChanged = true;
    }
  }

  changed(subitemName) {
    //SLUG
    if(subitemName == 'title' && (this.mainItem == 'posts' || this.mainItem == 'pages')){
        this.itemWorkingCopy.data['name'].val = this.slugify(this.itemWorkingCopy.data['title'].val);
    }
    // TO DO in this place should be checked only this subitem that caused change not all of them!
    this.checkChanges();
  }

  slugify(text) {
    text = this.removeDiacritics(text);
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text
      .replace(/-$/, ''); // Remove last floating dash if exists
  }

  saveContentChanges() {
    this.itemsDbService.update(this.mainItem, this.contentToChange).then(() => {
      this.itemsDbService.getItem(this.mainItem, this.itemKey).then(item => { // for some reason itemOrginal and itemWorkingCopy are not passed by refferenct to itemsOrginal[mainItemName][i] and itemsWorkingCopy[mainItemName][i]
        this.itemOrginal = item[0]; // this is this.itemsOrginal[mainItemName][i]
        this.itemWorkingCopy = item[1]; // this is this.itemsWorkingCopy[mainItemName][i]
        this.contentChanged = false;
      });
    });
  }

  imageUpload(subitemName, subitemParams) { // pass important variables to modal imageUpoad
    if (this.itemWorkingCopy.data[subitemName] == undefined) {
      this.itemWorkingCopy.data[subitemName] = {};
    }
    this.dialogService.open({
      viewModel: ImageUpload,
      model: {
        mainItem: this.mainItem,
        itemKey: this.itemKey,
        imageUploadSubitem: this.itemWorkingCopy.data[subitemName],
        imageUploadSubitemName: subitemName,
        imageUploadPath: this.mainItem + '/' + this.itemKey + '/' + subitemName,
        cropperParams: {
          width: subitemParams.width,
          height: subitemParams.height,
          ratio: subitemParams.ratio,
          multiple: subitemParams.multiple
        },
        currentImageSrc: this.itemWorkingCopy.data[subitemName].val
      }
    }).then(result => {
      if (!result.wasCancelled) {
        this.changed(subitemName);
      } else {

      }
    }).catch(() => {

    });
    // this.imageUploadRef.imageUploadSubitem = this.itemWorkingCopy.data[subitemName]; // ref to WC
    // this.imageUploadRef.imageUploadSubitemName = subitemName; // name - because it isnt present in WC (it is a key)
    // this.imageUploadRef.imageUploadPath = this.mainItem + '/' + this.itemKey + '/' + subitemName; // path to upload
    // this.imageUploadRef.cropperParams = {
    //     width: subitemParams.width,
    //     height: subitemParams.height
    // }; // params such as diemnsions
    // this.imageUploadRef.restart(this.itemWorkingCopy.data[subitemName].val, subitemParams.ratio); // this should restart cropper with url of actual image byt there is a CORS problem
  }

  deleteItem() {
    return this.dialogService.open({
        viewModel: Confirm,
        model: {
          header: 'Jesteś pewien?',
          message: 'Na pewno chcesz bezpowrotnie usunąć ten wpis?',
          btnAccept: 'Tak!',
          btnCancel: 'Nie!'
        }
      })
      .then(result => {
        if (!result.wasCancelled) {
          this.itemsDbService.remove(this.mainItem, this.itemKey).then(() => {
            this.router.navigate("drag/" + this.mainItem);
          });
        } else {
          return false;
        }
      }).catch(() => {
        return false;
      });
  }

  changeVisibility() {
    if (this.itemWorkingCopy.meta.visible) {
      this.itemsDbService.makeVisible(this.mainItem, this.itemKey).then(() => {
        this.itemWorkingCopy.meta.visible = true;
        this.itemOrginal.meta.visible = true;
      });
    } else {
      this.itemsDbService.makeHidden(this.mainItem, this.itemKey).then(() => {
        this.itemWorkingCopy.meta.visible = false;
        this.itemOrginal.meta.visible = false;
      });
    }
  }

  goToNestedEdit(nestedName) {
    this.router.navigate("drag/" + nestedName + this.nestedItemsSeparator + this.mainItem + this.nestedItemsSeparator + this.itemKey);
  }

  backToMainItem() {
    this.router.navigate("drag/" + this.mainItem);
  }

  removeDiacritics(str) {
    var defaultDiacriticsRemovalMap = [{
      'base': 'A',
      'letters': /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g
    }, {
      'base': 'AA',
      'letters': /[\uA732]/g
    }, {
      'base': 'AE',
      'letters': /[\u00C6\u01FC\u01E2]/g
    }, {
      'base': 'AO',
      'letters': /[\uA734]/g
    }, {
      'base': 'AU',
      'letters': /[\uA736]/g
    }, {
      'base': 'AV',
      'letters': /[\uA738\uA73A]/g
    }, {
      'base': 'AY',
      'letters': /[\uA73C]/g
    }, {
      'base': 'B',
      'letters': /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g
    }, {
      'base': 'C',
      'letters': /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g
    }, {
      'base': 'D',
      'letters': /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g
    }, {
      'base': 'DZ',
      'letters': /[\u01F1\u01C4]/g
    }, {
      'base': 'Dz',
      'letters': /[\u01F2\u01C5]/g
    }, {
      'base': 'E',
      'letters': /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g
    }, {
      'base': 'F',
      'letters': /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g
    }, {
      'base': 'G',
      'letters': /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g
    }, {
      'base': 'H',
      'letters': /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g
    }, {
      'base': 'I',
      'letters': /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g
    }, {
      'base': 'J',
      'letters': /[\u004A\u24BF\uFF2A\u0134\u0248]/g
    }, {
      'base': 'K',
      'letters': /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g
    }, {
      'base': 'L',
      'letters': /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g
    }, {
      'base': 'LJ',
      'letters': /[\u01C7]/g
    }, {
      'base': 'Lj',
      'letters': /[\u01C8]/g
    }, {
      'base': 'M',
      'letters': /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g
    }, {
      'base': 'N',
      'letters': /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g
    }, {
      'base': 'NJ',
      'letters': /[\u01CA]/g
    }, {
      'base': 'Nj',
      'letters': /[\u01CB]/g
    }, {
      'base': 'O',
      'letters': /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g
    }, {
      'base': 'OI',
      'letters': /[\u01A2]/g
    }, {
      'base': 'OO',
      'letters': /[\uA74E]/g
    }, {
      'base': 'OU',
      'letters': /[\u0222]/g
    }, {
      'base': 'P',
      'letters': /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g
    }, {
      'base': 'Q',
      'letters': /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g
    }, {
      'base': 'R',
      'letters': /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g
    }, {
      'base': 'S',
      'letters': /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g
    }, {
      'base': 'T',
      'letters': /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g
    }, {
      'base': 'TZ',
      'letters': /[\uA728]/g
    }, {
      'base': 'U',
      'letters': /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g
    }, {
      'base': 'V',
      'letters': /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g
    }, {
      'base': 'VY',
      'letters': /[\uA760]/g
    }, {
      'base': 'W',
      'letters': /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g
    }, {
      'base': 'X',
      'letters': /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g
    }, {
      'base': 'Y',
      'letters': /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g
    }, {
      'base': 'Z',
      'letters': /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g
    }, {
      'base': 'a',
      'letters': /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g
    }, {
      'base': 'aa',
      'letters': /[\uA733]/g
    }, {
      'base': 'ae',
      'letters': /[\u00E6\u01FD\u01E3]/g
    }, {
      'base': 'ao',
      'letters': /[\uA735]/g
    }, {
      'base': 'au',
      'letters': /[\uA737]/g
    }, {
      'base': 'av',
      'letters': /[\uA739\uA73B]/g
    }, {
      'base': 'ay',
      'letters': /[\uA73D]/g
    }, {
      'base': 'b',
      'letters': /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g
    }, {
      'base': 'c',
      'letters': /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g
    }, {
      'base': 'd',
      'letters': /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g
    }, {
      'base': 'dz',
      'letters': /[\u01F3\u01C6]/g
    }, {
      'base': 'e',
      'letters': /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g
    }, {
      'base': 'f',
      'letters': /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g
    }, {
      'base': 'g',
      'letters': /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g
    }, {
      'base': 'h',
      'letters': /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g
    }, {
      'base': 'hv',
      'letters': /[\u0195]/g
    }, {
      'base': 'i',
      'letters': /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g
    }, {
      'base': 'j',
      'letters': /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g
    }, {
      'base': 'k',
      'letters': /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g
    }, {
      'base': 'l',
      'letters': /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g
    }, {
      'base': 'lj',
      'letters': /[\u01C9]/g
    }, {
      'base': 'm',
      'letters': /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g
    }, {
      'base': 'n',
      'letters': /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g
    }, {
      'base': 'nj',
      'letters': /[\u01CC]/g
    }, {
      'base': 'o',
      'letters': /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g
    }, {
      'base': 'oi',
      'letters': /[\u01A3]/g
    }, {
      'base': 'ou',
      'letters': /[\u0223]/g
    }, {
      'base': 'oo',
      'letters': /[\uA74F]/g
    }, {
      'base': 'p',
      'letters': /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g
    }, {
      'base': 'q',
      'letters': /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g
    }, {
      'base': 'r',
      'letters': /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g
    }, {
      'base': 's',
      'letters': /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g
    }, {
      'base': 't',
      'letters': /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g
    }, {
      'base': 'tz',
      'letters': /[\uA729]/g
    }, {
      'base': 'u',
      'letters': /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g
    }, {
      'base': 'v',
      'letters': /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g
    }, {
      'base': 'vy',
      'letters': /[\uA761]/g
    }, {
      'base': 'w',
      'letters': /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g
    }, {
      'base': 'x',
      'letters': /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g
    }, {
      'base': 'y',
      'letters': /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g
    }, {
      'base': 'z',
      'letters': /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g
    }];

    for (var i = 0; i < defaultDiacriticsRemovalMap.length; i++) {
      str = str.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base);
    }

    return str;

  }
}
