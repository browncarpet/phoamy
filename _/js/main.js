var sock = null;
var ellog = null;
var lastPage = null;
var home = "index2.html"

   window.onload = function() {

      var wsuri;
      ellog = document.getElementById('log');

      if (window.location.protocol === "file:") {
         wsuri = "ws://localhost:9000";
      } else {
         wsuri = "ws://" + window.location.hostname + ":9000";
      }

      if ("WebSocket" in window) {
         sock = new WebSocket(wsuri);
      } else if ("MozWebSocket" in window) {
         sock = new MozWebSocket(wsuri);
      } else {
         log("Browser does not support WebSocket!");
         window.location = "http://autobahn.ws/unsupportedbrowser";
      }

      if (sock) {
         sock.onopen = function() {
            log("Connected to " + wsuri);
         }

         sock.onclose = function(e) {
            log("Connection closed (wasClean = " + e.wasClean + ", code = " + e.code + ", reason = '" + e.reason + "')");
            sock = null;
            lastPage = location.href;
            /////////window.location.replace(lastPage.split('#')[0] + '#needRefresh');
         }

         sock.onmessage = function(e) {
            log("Got echo: " + e.data);
            if (e.data.indexOf("buttonred") != -1) {
              ChangeStyle('red');
                   };
           if (e.data.indexOf("hvac") != -1) {
            hvacStatus(e.data);
                 };
            if (e.data.indexOf("music") != -1) {
            musicStatus(e.data);
                 };
            }
      }
      
      $(".hvacStyle").fadeIn("slow");
      $('.mode').find('a').attr('onclick', 'newMode(this);');
      
      /**  Assign "hvac{num}temp" or "hvac{num}mint" etc. class for targeting  */
      $('span.temp').each(
          function(){
          $(this).addClass($(this).parents('a').attr('href').slice(1) + "temp");
          });
      $('h3.temp').each(
          function() {
              $(this).addClass($(this).closest('div[id^="hvac"]').attr('id') + "temp");
          });
      $('span.smallmint').each(
          function(){
          $(this).addClass($(this).parents('a').attr('href').slice(1) + "mint");
          });
      $('.mint').each(
          function() {
              $(this).addClass($(this).closest('div[id^="hvac"]').attr('id') + "mint");
          });
      $('span.smallmaxt').each(
          function(){
          $(this).addClass($(this).parents('a').attr('href').slice(1) + "maxt");
          });
      $('.maxt').each(
          function() {
              $(this).addClass($(this).closest('div[id^="hvac"]').attr('id') + "maxt");
          });
      $('ul.mode a').each(
          function() {
            theMode = $(this).eq(0).eq(0).html();
            hvacAddy = $(this).closest('div[id^="hvac"]').attr('id');
            $(this).addClass(hvacAddy + "mode" + theMode);
          });
      $('.shades a').append('<br/>')
      makeShades();
      makeAudio();
      $('select.select').change(function() {
        sourceCMD = $(this).val()
        simpleSend("audioa|"+ sourceCMD);
      });
};


   function broadcast() {
      var msg = document.getElementById('message').value;
      if (sock) {
         sock.send(msg);
         log("Sent: " + msg);
      } else {
         log("Not connected.");
      }
   };

   function log(m) {
      ellog.innerHTML += m + '<br/>';
      ellog.scrollTop = ellog.scrollHeight;
   };


    function ChangeStyle(c){
      document.getElementById("colorbutton").style.background=c;
    };
    function hvacStatus(data){
      //Example incoming string: "hvac01modeAuto" or "hvac02mint65"
      /*&tempSplit = data.split(".");
      hvac = tempSplit[0];
      address = tempSplit[1];
      method = tempSplit[2];
      hvacData = tempSplit[3];*/
      hvac = data.slice(0,4);
      address = data.slice(4,6);
      method = data.slice(6,10);
      hvacData = data.slice(10,14);
      targetHVAC = hvac+address+method;
      if(method == "mode"){
        $('#' + hvac  + address + " a").removeClass('ui-btn-active');
        $('.' + data).addClass('ui-btn-active');
      };
      $("."+targetHVAC).html(hvacData);
    }
    
    function changeTemp(curHVAC) {
      //method = $(curHVAC).parents().eq(0).attr('class');
      //device = $(curHVAC).parents().eq(0).attr('id');
      target = $(curHVAC).siblings().eq(0).attr('id');
      x = document.getElementById(target).innerHTML;
      if (curHVAC.innerHTML === "+") {x++;}
      else {x--;}
      document.getElementById(target).innerHTML = x;
      log(target+x)
      sock.send(target+x);
    }
    function changeMode(curHVAC) {
      var modeList = ["Auto","Off","Cool","Heat"]
      target = $(curHVAC).attr('id');
      data = curHVAC.innerHTML;
      position = jQuery.inArray(data, modeList);
      if (position <= 2) {position++;}
      else {position = 0}
      newMode = modeList[position];
      curHVAC.innerHTML = newMode;
      log(target+newMode)
      sock.send(target+newMode);
    }
    function newMode(stuff) {
      var method, addy, data;
      addy = $(stuff).parents('.ui-page').attr('id');
      data = $(stuff).find('.ui-btn-text').html();
      method = $(stuff).closest('ul').attr('class');
      sock.send("comstar|"+addy + method.slice(0, 4) + data);
    }
    function simpleSend(stuff) {
      sock.send(stuff);
    }

    function test(info) {
      
    }

    function properRefresh(page) {
      window.location.href = home;
      //window.location.href = page;

    }

    function newSetPoint(temp) {
      var x;
      var targetTempElement = $(temp).parent().parent().find("span")[0];
      var thisHvacAddy = $(temp).closest('div[id^="hvac"]').attr('id');
      var targetClass = thisHvacAddy + $(targetTempElement).attr('class').split(' ')[0];
      if (temp.innerHTML === '+') {
        x = (parseInt(targetTempElement.innerHTML) + 1);
      } else {
        x = (parseInt(targetTempElement.innerHTML) - 1);
      }
      $('.'+targetClass).html(x);
      sock.send("comstar|"+targetClass+x);
    }

$( '.musicControl' ).live( 'pageinit',function(event){
  target = $(this).find('.musicPopUp');
  $(target).on("slidestop", function (e, ui) {
    volLevel = $(this).val();
    zone = $(this).attr("name");
    sock.send("comstar|[VO"+zone+"R"+volLevel+"]");
    });
});


function musicStatus(data){
  dataSplit = data.split(".");
  // if (dataSplit[1] === 'source') {
  //   $('#'+dataSplit[2]).siblings('a').removeClass('ui-btn-up-b');
  //   $('#'+dataSplit[2]).addClass('ui-btn-up-b');
  // }
  if (dataSplit[1] === 'source') {
    //alert($('#' + dataSplit[2]).val());
    $('#'+dataSplit[2]).val(dataSplit[3]);
    $('#'+dataSplit[2]).selectmenu('refresh');
  }  
  if (dataSplit[1] === 'vol') {
    $('#'+dataSplit[2]).val(dataSplit[3]).slider('refresh');
  }
  if (dataSplit[1] === 'mute') {
    if (dataSplit[3] === 'on') {
      $('#'+dataSplit[2]).closest('.ui-btn').removeClass('ui-btn-up-b');
      $('#'+dataSplit[2]).prev().find('.ui-btn-text').html('Off');
    }
    if (dataSplit[3] === 'off') {
      $('#'+dataSplit[2]).closest('.ui-btn').addClass('ui-btn-up-b');
      $('#'+dataSplit[2]).prev().find('.ui-btn-text').html('On');
    }
  }
}



//This breaks the slider sending code... Need to combine


(function( $, undefined ) {
$.widget( "mobile.slider", $.mobile.slider, {
    options: {
        popupEnabled: false,
        showValue: false
    },
    _create: function() {
        var o = this.options,
            popup = $( "<div></div>", {
                //class: "ui-slider-popup ui-shadow ui-corner-all ui-body-" + ( o.theme ? o.theme : $.mobile.getInheritedTheme( this.element, "b" ) )
                class: "ui-slider-popup ui-shadow ui-corner-all ui-body-b"
            });
        this._super();
        $.extend( this, {
            _currentValue: null,
            _popup: popup,
            _popupVisible: false,
            _handleText: this.handle.find( ".ui-btn-text" )
        });
        this.slider.before( popup );
        popup.hide();
        this._on( this.handle, { "vmousedown" : "_showPopup" } );
        this._on( this.slider.add( $.mobile.document ), { "vmouseup" : "_hidePopup" } );
        this._refresh();
    },
    // position the popup centered 5px above the handle
    _positionPopup: function() {
        var dstOffset = this.handle.offset();
        this._popup.offset( {
            left: dstOffset.left + ( this.handle.width() - this._popup.width() ) / 2,
            top: dstOffset.top - this._popup.outerHeight() - 5
        });
    },
    _setOption: function( key, value ) {
        this._super( key, value );
        if ( key === "showValue" ) {
            if ( value ) {
                this._handleText.html( this._value() ).show();
            } else {
                this._handleText.hide();
            }
        }
    },
    // show value on the handle and in popup
    refresh: function() {
        this._super.apply( this, arguments );
        // necessary because slider's _create() calls refresh(), and that lands
        // here before our own _create() has even run
        if ( !this._popup ) {
            return;
        }
        this._refresh();
    },
    _refresh: function() {
        var o = this.options, newValue;
        if ( o.popupEnabled ) {
            // remove the title attribute from the handle (which is
            // responsible for the annoying tooltip); NB we have
            // to do it here as the jqm slider sets it every time
            // the slider's value changes :(
            this.handle.removeAttr( 'title' );
        }
        newValue = this._value();
        if ( newValue === this._currentValue ) {
            return;
        }
        this._currentValue = newValue;
        fixValDisplay = (newValue + 80) * 1.25;
        if ( o.popupEnabled ) {
            this._positionPopup();
            this._popup.html( Math.round(fixValDisplay) );
        }
        if ( o.showValue ) {
            this._handleText.html( Math.round(fixValDisplay) );
        }
    },
    _showPopup: function() {
        if ( this.options.popupEnabled && !this._popupVisible ) {
            this._handleText.hide();
            this._popup.show();
            this._positionPopup();
            this._popupVisible = true;
        }
    },
    _hidePopup: function() {
        if ( this.options.popupEnabled && this._popupVisible ) {
            this._handleText.show();
            this._popup.hide();
            this._popupVisible = false;
            _zone = (this._popup.prev().attr('id')).slice(-5,-3);
            sock.send("audioa|[VO"+_zone+"R"+this._currentValue+"]")
        }
    }
});
})( jQuery );