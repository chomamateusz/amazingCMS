export function configure(aurelia) {
  // nested items separator
  let nestedItemsSeparator = '~~!~~';

  // materialize using jspm
  let materialize = 'materialize';

  return System.import(materialize).then(() => {
    aurelia.use
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
