import {
    DialogController
} from 'aurelia-dialog';
import {
    inject
} from 'aurelia-framework';

@inject(DialogController)
export class Confirm {
    constructor(dialogController) {
        this.dialogController = dialogController;
    }

    activate(params) {
        this.message = params.message;
        this.header = params.header;
        if(params.btnAccept == undefined || params.btnAccept == null || params.btnAccept.trim() == ''){
            this.btnAccept = 'Ok';
        }else{
             this.btnAccept = params.btnAccept;
        }if(params.btnCancel == undefined || params.btnCancel == null || params.btnCancel.trim() == ''){
            this.btnCancel = 'Cancel';
        }else{
            this.btnCancel = params.btnCancel;
        }
    }

    accept() {
        this.dialogController.ok();
    }

    cancel() {
        this.dialogController.cancel();
    }

}