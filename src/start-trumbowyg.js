import {
  inject,
  customAttribute
} from 'aurelia-framework';
import {trumbowyg} from 'trumbowyg';
import {pl} from 'trumbowyg/dist/langs/pl.min.js';
import {noembed} from 'trumbowyg/plugins/noembed/trumbowyg.noembed.js';
import {colors} from 'trumbowyg/plugins/colors/trumbowyg.colors.js';
import {base64} from 'trumbowyg/plugins/base64/trumbowyg.base64.js';
import {ItemEdit} from 'itemEdit';

@customAttribute('start-trumbowyg')
@inject(Element, ItemEdit)
export class StartTrumbowygCustomAttribute {
  constructor(element, itemEdit) {
    this.element = element; // "element" will be the DOM element rendered from the
    this.viewmodel = itemEdit;
  }

  attached() {
    // attach to vars to work in this scope
    var viewmodel = this.viewmodel;
    var subitemName = this.value;

    $(this.element).trumbowyg({
      lang: 'pl',
      svgPath: 'jspm_packages/npm/trumbowyg@2.4.2/dist/ui/icons.svg',
      resetCss: true,
      btnsAdd: ['upload'],
      btnsDef: {
        image: {
          dropdown: ['insertImage', 'base64'],
          ico: 'insertImage'
        }
      },
      btns: [
        ['viewHTML'],
        ['undo', 'redo'],
        ['formatting'],
        'btnGrp-design', ['link'],
        ['foreColor', 'backColor'],
        ['noembed'],
        ['image'],
        'btnGrp-justify',
        'btnGrp-lists', ['horizontalRule'],
        ['fullscreen']
      ],

    }).on('tbwchange', function () {
      console.log('START-TRUMBOWYG - editor change - tbwchange');
      // passes editor changes to viewmodel
      if(viewmodel.itemWorkingCopy.data[subitemName] == undefined) viewmodel.itemWorkingCopy.data[subitemName] = {};
      viewmodel.itemWorkingCopy.data[subitemName].val= $(this).trumbowyg('html');
      // fire changed function
      viewmodel.changed(subitemName);
    }).on('tbwpaste', function () {
      console.log('START-TRUMBOWYG - editor change - tbwpaste');
      // passes editor changes to viewmodel
      if(viewmodel.itemWorkingCopy.data[subitemName] == undefined) viewmodel.itemWorkingCopy.data[subitemName] = {};
      viewmodel.itemWorkingCopy.data[subitemName].val= $(this).trumbowyg('html');
      // fire changed function
      viewmodel.changed(subitemName);
    });
  }
} 