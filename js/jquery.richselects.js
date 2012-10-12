/* 
 * Copyright (C) 2012, Wes Rich, Pyxl, Inc.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy 
 * of this software and associated documentation files (the "Software"), to deal 
 * in the Software without restriction, including without limitation the rights 
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies 
 * of the Software, and to permit persons to whom the Software is furnished to do 
 * so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all 
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION 
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function($) {
  $(function() {

    $.fn.richSelects = function(options) {
      if (this.length > 1) {
        return this.each(function() {
          $(this).richSelects(options);
        });
      }
      var $origSelect = this;
      var $newSelect,crElem,selItem,allItems,selIndex,$head,$selOpt,$overlay;
      var defaults = {
        containerClass: 'dropdown',
        inheritClass: true,
        selectedClass: 'dropdown-header',
        contentClass: 'dropdown-content',
        overlayId: 'dropdown-overlay',
        openClass: 'active',
        zIndex: 500,
        openFunc: function() {},
        selFunc: function() {},
        closeFunc: function() {}
      }
      var options = $.extend(defaults, options);

      var parentClass = options.containerClass;
      if (options.inheritClass) {
        parentClass += ' '+$origSelect.attr('class');
      }

      // Functions
      var initOverlay = function() {
        var returnVals;
        $overlay = $('<div id="'+options.overlayId+'" style="position: fixed; height: 100%; width: 100%; z-index: '+(options.zIndex-5)+'; top: 0; left: 0;"></div>');
        $('body').append($overlay);
        $overlay.click(function(e) {
          cleanupOverlay();
        });

        returnVals = {};
        returnVals.elem = $origSelect;
        returnVals.value = $origSelect.val();
        returnVals.text = $origSelect.find('option:selected').text();
        $origSelect.trigger('openDropdown', returnVals);
        return true;
      }

      var cleanupOverlay = function() {
        $overlay.remove();
        $newSelect.removeClass(options.openClass);
        $origSelect.trigger('closeDropdown');
        return true;
      }

      var checkCompat = function(property) {
        switch (property) {
          case 'ie':
            if ( $.browser.msie && $.browser.version <= 7.0 ) {
              return false;
            }
            break;
          default:
            if ( $.fn.jquery < '1.6' ) {
              return false;
            }
            break;
        }
        return true;
      }

      // Object Functions
      this.clickHeader = function() {
        if ($newSelect.hasClass(options.openClass) === true) {
          cleanupOverlay();
          return false;
        }
        $newSelect.addClass(options.openClass);
        initOverlay();
        return true;
      }

      this.clickOption = function(selectedIndex) {
        var newSelItem,newSelIndex,returnVals;
        newSelItem = $newSelect.find('a:eq('+selectedIndex+')');
        newSelIndex = newSelItem.data('index');
        if ( checkCompat() ) {
          $origSelect.prop('selectedIndex', newSelIndex); // jQuery 1.6+
        } else {
          $origSelect.attr('selectedIndex', newSelIndex);
        }
        $head.text( newSelItem.text() );
        $head.data('selected', newSelIndex);
        $selOpt.find('a').text( newSelItem.text() )
          .data('index', newSelIndex);

        returnVals = {};
        returnVals.elem = $origSelect;
        returnVals.value = $origSelect.val();
        returnVals.text = $origSelect.find('option:selected').text();
        returnVals.index = newSelIndex;
        $origSelect.trigger('selectDropdown', returnVals);
        cleanupOverlay();
        return true;
      }

      // Initialize
      selItem = $origSelect.find('option:selected');
      if ( checkCompat() ) {
        selIndex = $origSelect.prop('selectedIndex'); // jQuery 1.6+
      } else {
        selIndex = $origSelect.attr('selectedIndex');
      }
      allItems = [];
      allItems.push('<li><a href="#" data-index="'+selIndex+'">'+selItem.text()+'</a></li><li class="sep"></li>');
      $origSelect.find('option').each(function(intIndex) {
        allItems.push('<li><a href="#" data-index="'+intIndex+'">'+$(this).text()+'</a></li>');
      });

      crElem = '<div class="'+parentClass+'" style="position: relative;">';
      crElem += '<div class="'+options.selectedClass+'" style="position: relative;">'+selItem.text()+'</div>';
      crElem += '<div class="'+options.contentClass+'" style="position: absolute; z-index: '+options.zIndex+';"><ul>'+allItems.join('')+'</ul></div>';
      crElem += '</div>';
      $newSelect = $(crElem);
      $origSelect.after($newSelect);
      $origSelect.hide();

      $head = $newSelect.find('.'+options.selectedClass);
      $selOpt = $newSelect.find('.'+options.contentClass+' li:eq(0)');

      var headerWidth = $head.innerWidth();
      $head.click(function(e) {
        e.preventDefault();
        $origSelect.clickHeader();
      });
      $newSelect.find('.'+options.contentClass).css({'width': headerWidth+'px'})
        .find('a').click(function(e) {
          e.preventDefault();
          var newSelIndex = $newSelect.find('li a').index( $(this) );
          $origSelect.clickOption( newSelIndex );
        });

      $origSelect.bind('openDropdown', function(e,a) { options.openFunc(e,a); } );
      $origSelect.bind('selectDropdown', function(e,a) { options.selFunc(e,a); } );
      $origSelect.bind('closeDropdown', function(e,a) { options.closeFunc(e,a); } );

      // Wrap it up!
      return this;
    }

  });
})(jQuery);