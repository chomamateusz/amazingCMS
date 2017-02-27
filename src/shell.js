
export class Shell {
  constructor() {

  }

  configureRouter(config, router) {
    this.router = router;
    config.title = 'Admin';
    config.map([
      { route: ['login', ''], title: 'Blog Admin - Login', name: 'Blog Admin - Login', moduleId: 'login' },
      { route: ['imagereloader'], title: 'Blog Admin - Reloader', name: 'Blog Admin - Reloader', moduleId: 'imageReloader' },
      { route: ['drag', 'drag/:mainItem'], title: 'Blog Admin - Widok Listy', name: 'Blog Admin - Widok Listy', moduleId: 'drag' },
      // { route: ['drag-list', 'drag-list/:mainItem'], title: 'Draggable arangement editor', name: 'Draggable arangement editor', moduleId: 'dragList' },
      // { route: ['drag-edit', 'drag-edit/:mainItem'], title: 'Draggable arangement editor', name: 'Draggable arangement editor', moduleId: 'dragEdit' },
      { route: ['itemEdit', 'itemEdit/:mainItem/:itemKey'], title: 'Blog Admin - Edycja Elementu', name: 'Blog Admin - Edycja Elementu', moduleId: 'itemEdit' }
    ]);
  }
}