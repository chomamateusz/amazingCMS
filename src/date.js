import moment from 'moment';

export class DateValueConverter {
  toView(value, format) {
    if (!value) return null;
    var valid = (new Date(value)).getTime() > 0;
    if (!valid) return value;
    if(!format) format = 'YYYY-MM-DD';
    return moment(value).format(format);
  }
  fromView(value, format) {
    if (!value) return null;
    var valid = (new Date(value)).getTime() > 0;
    if (!valid) return value;
    if(!format) format = 'YYYY-MM-DD';
    return moment(value).valueOf();
  }
}