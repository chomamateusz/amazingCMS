# Database structure
Database structure is divided into two prats first for data and second for CMS structure configuration and parameters.

First part (mainItemsData) is in 100% generated when user uses the system so we will focus on second part.

Second part has two nodes:

mainItemsDefs — node containing all definitions of main items like for example: post list, gallery etc. It contains main items names as keys and prameters object as values.

subItemsDefs — every main item contains subitems, that should be named and configured here. It contains main items names as keys and objects {key: subitems parameters object} as values.

### mainItemsDefs parameters:

- author — string — default meta author of new items
- canBeDeleted — bool — decides that items in this main item can or cant be deleted
- canBeHidden — bool — decides that items in this main item can or cant change state of visibility
- canBeSentBackToList — bool — decides if button “back to list” is displayed when editing item
- caption — string — caption above the items list
- drag — bool — decides that items in this main item can or cant change order and button “save order” is or isnt displayed
- extarnalLink — string — menu option, if set this menu position redirects to external link
- goToRoute — string — menu option, if set this menu position redirects to route not to list of items (can be used to go direct to certain item edition) menuOrder — int — order in side menu
- new-caption — string — caption on “add new” button
- order — string — ordering of items by node, can be set to “meta/order” or “meta/timestamp”
- separator — bool — menu option, decides if separator line is displayed below this menu item
- subitems — object {id: name} — decides what subitems of item are displayed in item list 
- title — string — menu option, title in menu
- visible — bool — menu option, decides if element is normally visible in side menu and redirect to items list
- visibleByDefault — bool — decides if item is visible when is created

### subitemsDefs parameters:

- name — string —subitem name used as a reference in maniItemsData
- params — object — depends on subitem type
- title — string —title displayed above edit inputs of subitem in item edit mode type — string — subitem type
- visible — bool — decides if subitem is displayed in item edit mode

# Aurelia Materialize Skeleton
This is based on [Aurelia skeleton navigation](https://github.com/aurelia/skeleton-navigation).
Bootstrap replaced with [Materialize](http://materializecss.com/) using [Aurelia Materialize Bridge](https://github.com/aurelia-ui-toolkits/aurelia-materialize-bridge).
