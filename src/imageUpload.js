import {
  inject,
  bindable,
  computedFrom
} from "aurelia-framework"
import {
  MdToastService
} from 'aurelia-materialize-bridge';
import {
  DialogController
} from 'aurelia-dialog';

@inject('storageRef', MdToastService, DialogController)
export class ImageUpload {
  constructor(storageRef, toast, dialogController) {
    this.dialogController = dialogController;
    this.storageRef = storageRef;
    this.upload = {}; // it must be an object to be passed by refference
    this.upload.running = false;
    this.upload.progress = {};
    this.toast = toast;
    this.imageSizes = [];
  }

  activate(params) {
    this.mainItem = params.mainItem;
    this.itemKey = params.itemKey;
    this.imageUploadSubitem = params.imageUploadSubitem;
    this.imageUploadSubitemName = params.imageUploadSubitemName;
    this.imageUploadPath = params.imageUploadPath;
    this.cropperParams = params.cropperParams;
    this.currentImageSrc = params.currentImageSrc;
    this.imageSizes = [];
  }

  // materialize input file and captions
  labelValue;
  @computedFrom('fileInput.files')
  get selectedFile() {
    return this.fileInput.files.length > 0 ? this.fileInput.files[0] : '';
  }

  // modal decisions
  agree() { // and upload
    console.log('You agreed!');
    this.startUpload().then(() => {
      this.dialogController.ok(); // after startUpload - add pormise
    });
  }
  disagree() { // dismis modal
    console.log('You disagreed!');
    this.dialogController.cancel();
  }

  restartCropper() { // restarts
    console.log('IMAGE-UPLOAD: cropper restated with raio:', this.cropperParams.ratio);
    // this.cropperRef.cropper.replace(this.currentImageSrc);
    this.cropperRef.cropper.setAspectRatio(1);
  }

  previewFile() { // file input onchange
    var file = this.fileInput.files[0];
    if(this.fileInput.files[0].type == 'image/jpeg'){
      console.log('IMAGE-UPLOAD image type is JPEG');
      this.cropperRef.isJPEG = true;
    }else{
      console.log('IMAGE-UPLOAD image type isnt JPEG');
      this.cropperRef.isJPEG = false;
    }
    var reader = new FileReader();
    var cropperRef = this.cropperRef;

    reader.addEventListener("load", function () {
      cropperRef.cropper.replace(reader.result);
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  startUpload() {
    var promise = new Promise((resolve, reject) => {
      var imageUploadSubitem = this.imageUploadSubitem;
      var imageUploadSubitemName = this.imageUploadSubitemName;
      var upload = this.upload;
      var imageSizes = this.imageSizes;
      var modal = this.imageUploadModal;
      var toast = this.toast;

      var tmpSize = {};
      tmpSize.width = this.cropperParams.width;
      tmpSize.height = this.cropperParams.height;
      tmpSize.key = 'main';
      imageSizes.push(tmpSize);
      if (this.cropperParams.multiple != undefined) {
        for (var key in this.cropperParams.multiple) { // forEach for objects :)
          if (key != 'main') { // main is placed direct in params not in multiple property!
            var tmpSize = {};
            tmpSize.width = this.cropperParams.multiple[key].width;
            tmpSize.height = this.cropperParams.multiple[key].height;
            tmpSize.key = key;
            imageSizes.push(tmpSize);
          }
        }
      }

      console.log(imageSizes, this.cropperParams.multiple);

      // SINGLE SIZE OF IMAGE
      imageUploadSubitem.vals = {};
      var i = 0;
      imageSizes.forEach((size) => {
        var uploadTask = this.storageRef.child(this.imageUploadPath+'-'+size.key).put(this.cropperRef.getCroppedImage(size));
        uploadTask.on('state_changed', function (snapshot) {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          upload.progress[size.key] = progress;
          upload.running = true;
          console.log('Upload is ' + upload.progress[size.key] + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
          }
        }, function (error) { // Handle unsuccessful uploads
          upload.progress[size.key] = 0;
          upload.running = false;
          toast.show('Wystąpił błąd podczas przesyłania pliku!', 4000);
          reject();
        }, function () { // Handle successful uploads on complete
          upload.progress[size.key] = 0;
          upload.running = false;
          var downloadURL = uploadTask.snapshot.downloadURL;
          if (size.key == 'main') {
            imageUploadSubitem.val = downloadURL; 
          }
          imageUploadSubitem.vals[size.key] = downloadURL;
          var args = {
            subitemName: imageUploadSubitemName
          }; // arguments passed to function call in callback
          toast.show('Poprawnie przesłano plik w rozmiarze: '+size.key, 4000);
          i++;
          if(i == imageSizes.length){
            resolve();
          }
        });
      });

    });
    return promise;
  }

}
