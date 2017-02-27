import {
  bindable
} from "aurelia-framework"
import Cropper from 'cropperjs'

export class ImageCropper {
  @bindable params;
  @bindable currentSrc;

  constructor() {
    this.cropper = null;
  }

  attached() {
    this.isJPEG = true;
    console.log('IMAGE-CROPPER cropper started with params: ', this.params, 'and image: ', this.currentSrc);
    this.cropper = new Cropper(this.image, {
      aspectRatio: this.params.ratio,
      crop: function (e) {},
      checkCrossOrigin: true,
      viewMode: 0,
      autoCropArea: 1
    });
    if (this.currentSrc != undefined && this.currentSrc != null && this.currentSrc.trim() != '') {
      this.cropper.replace(this.currentSrc);
    }
  }

  getCroppedImage(cropperParams) {
    if (this.isJPEG == true) {
      return this.dataURItoBlob(this.cropper.getCroppedCanvas(cropperParams).toDataURL("image/jpeg", 0.8));
    } else {
      return this.dataURItoBlob(this.cropper.getCroppedCanvas(cropperParams).toDataURL('image/png'));
    }
  }

  getFileSize() {
    var size = '';
    if (this.isJPEG == true) {
      size = this.dataURItoBlob(this.cropper.getCroppedCanvas(this.params).toDataURL("image/jpeg", 0.8)).size;
    } else {
      size = this.dataURItoBlob(this.cropper.getCroppedCanvas(this.params).toDataURL('image/png')).size;
    }
     alert('Obrazek będzie zajmował około: '+Math.round(size/1024)+' KB w podstawowym rozmiarze ('+this.params.width+' x '+this.params.height+' pikseli)');
     return size;
  }

  dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], {
      type: mimeString
    });
    return blob;
  }
}
