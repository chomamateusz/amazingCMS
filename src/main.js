export function configure(aurelia) {
  // main data db ref
  let dbRef = firebase.database().ref('mainItemsData');
  // subitemDefs db ref
  let subitemRef = firebase.database().ref('subitemDefs');
  // mainItemsRef db ref
  let mainItemsRef = firebase.database().ref('mainItemsDefs');
  // storage data refernece
  let storageRef = firebase.storage().ref('mainItemsData');

  // nested items separator
  let nestedItemsSeparator = '~~!~~';

  // materialize using jspm
  let materialize = 'materialize';

  return System.import(materialize).then(() => {
    aurelia.use
      .instance('dbRef', dbRef)
      .instance('subitemRef', subitemRef)
      .instance('storageRef', storageRef)
      .instance('mainItemsRef', mainItemsRef)
      .instance('nestedItemsSeparator', nestedItemsSeparator)
      .standardConfiguration()
      .developmentLogging()
      .plugin("aurelia-dialog")
      .plugin("oribella-aurelia-sortable")
      .plugin('aurelia-configuration', config => {
        config.setConfig('config.json');
        config.setCascadeMode(false);
        config.setEnvironments({
          development: ['localhost', 'dev.local'],
          staging: ['staging.website.com', 'test.staging.website.com'],
          production: ['website.com']
        });
      })
      .plugin('aurelia-materialize-bridge', bridge => bridge.useAll());

    aurelia.start().then(a => a.setRoot('shell'));
  });

}
