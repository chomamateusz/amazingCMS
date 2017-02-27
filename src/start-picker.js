import {
    inject,
    customAttribute,
    bindable
} from 'aurelia-framework';
import { ItemEdit } from 'itemEdit';
import pickerjs from 'pickerjs';
import moment from 'moment';

@customAttribute('start-picker')
@inject(Element, ItemEdit)
export class StartTrumbowygCustomAttribute {
    @bindable subitemName;
    @bindable format;
    @bindable timestampConversion;

    constructor(element, itemEdit) {
        this.element = element; // "element" will be the DOM element rendered from the
        this.viewmodel = itemEdit;
    }

    attached() {
        // attach to vars to work in this scope
        var viewmodel = this.viewmodel;
        var subitemName = this.subitemName;

        if (this.format == undefined) {
            this.format = 'YYYY-MM-DD';
        }

        if(this.timestampConversion == undefined){
            this.timestampConversion = true;
        }

        console.log('START-PICKER', Picker);
        console.log('START-PICKER format: ', this.format);

        new Picker(this.element, {
            format: this.format,
            pick: () => {
                // console.log('PICKER - date change - pick');
                // console.log('PICKER - timestamp conversion mode: ', this.timestampConversion);
                // console.log('PICKER - element value before', this.element.value);
                // var valueToPut = this.element.value;
                // if(this.timestampConversion){
                //     valueToPut = moment(this.element.value).valueOf();
                // }
                // if (viewmodel.itemWorkingCopy.data[subitemName] == undefined) viewmodel.itemWorkingCopy.data[subitemName] = {};
                // viewmodel.itemWorkingCopy.data[subitemName].val = valueToPut;
                // console.log('PICKER - element value after', valueToPut);
            }
        });
    }
} 