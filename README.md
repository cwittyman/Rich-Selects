Rich Selects
==================================================

This jQuery plugin was written to replace an existing HTML <select> input box with a series of elements that allows for easily creating rich and beautiful styles.


Requirements
--------------------------------------
This plugin was developed on jQuery 1.8.2.

We have tested the core functionality as low as jQuery 1.5 - but not as in-depth. Browser check for core functionality has been done on IE7,8,9, latest Chrome, latest Safari, and latest Firefox.

Other versions may work, but have not been tested!


Basic Usage
--------------------------------------
To initialize, simply run:
```js
$("#mySelect").richSelects();
```

The default options are:
```js
var defaults = {
  containerClass: 'dropdown',
  inheritClass: true,
  selectedClass: 'dropdown-header',
  contentClass: 'dropdown-content',
  overlayId: 'dropdown-overlay',
  openClass: 'active',
  zIndex: 500,
  openFunc: function() {},    // function that runs when dropdown is "opened"
  selFunc: function() {},     // function that runs when an option is selected
  closeFunc: function() {}    // function that runs when dropdown is "closed" (runs after "selected")
}
```
