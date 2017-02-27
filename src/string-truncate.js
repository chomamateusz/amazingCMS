export class TruncateValueConverter {
  toView(value, length = 100) {
    if(value == undefined){
      return value;
    }
    value = value.replace(/<img[^>]*>/g, "");
    value = value.replace(/<p class="videoWrapper"[^>]*>/g, "");
    value = value.replace(/<iframe[^>]*>/g, "");
    return value.length > length ? value.substring(0, length) + '...' : value;
  }
}


/**
 * Usage
 *
 * <require from="string-truncate"></require>
 * stringVal = 'I am a robot and this is my CPU';
 * <h1 textContent.bind="stringVal | truncate:10">I am a rob...</h1>
 */
