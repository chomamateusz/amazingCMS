import {
  inject
} from 'aurelia-framework';
import {
  EventAggregator
} from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class Subitem {
  constructor(ea) {
    this.ea = ea; // EventAggregator
  }

  publishChange(subitem, newVal, newVals) {
    let data = {
      subitemName: subitem.name,
      subitemType: subitem.type,
      newVal: newVal,
      newVals: newVals
    }
    console.log('EVENT - subitemValueChange - ', data);
    this.ea.publish('subitemValueChange', data);
  }
}