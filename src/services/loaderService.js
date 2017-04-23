import 'nprogress/nprogress.css!';
import * as nprogress from 'nprogress';

export class LoaderService {
  constructor() {
    this.isLoadingData = false;
  }

  startLoading() {
    if(!this.isLoadingData){
      this.isLoadingData = true;
      nprogress.start();
    }
  }

  endLoading() {
    if(this.isLoadingData){
      this.isLoadingData = false;
      nprogress.done();
    }
  }
}
