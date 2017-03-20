import {
  bindable,
  customElement
} from 'aurelia-framework';

import {
  Subitem
} from "resources/subitems/subitem"

@customElement('txt-subitem')
export class TxtSubitem extends Subitem {
  @bindable subitem;
  @bindable value;
  constructor() {
    super();
  }
}