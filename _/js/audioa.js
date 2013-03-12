//$('#shades').bind('pagecreate', function(event) {
  function makeAudio() {
    		var data, shadeControlTemplate, shadeControlhtml, shadePageTemplate, shadePagehtml;
    		data = {
    			"musicZones" : [
    				{"zone" : "01", "title" : "Grotto"},
    				{"zone" : "02", "title" : "Grotto Pool"},
            {"zone" : "03", "title" : "Grotto Theater"},
            {"zone" : "04", "title" : "Rack Rm"},
            {"zone" : "05", "title" : "Foyer"},
            {"zone" : "06", "title" : "Living Rm"},
            {"zone" : "07", "title" : "Mstr Bath"},
            {"zone" : "08", "title" : "Mstr Lav"},
            {"zone" : "09", "title" : "Mstr Bed"},
            {"zone" : "10", "title" : "Guest Bed 2nd"},
            {"zone" : "11", "title" : "Guest Bed 1st"},
            {"zone" : "12", "title" : "Kitchen"},
            {"zone" : "13", "title" : "Sun Deck E"},
            {"zone" : "14", "title" : "Sun Deck W"},
            {"zone" : "15", "title" : "Jacuzzi"},
            {"zone" : "16", "title" : "Patio"}
    			]
    		}

    		musicControlTemplate = '{{#musicZones}} \
    					<div data-role="page" id="musicZone{{zone}}" class="musicControl" data-title="Music" data-theme="a"> \
         					<div data-role="header"> \
               					<h1>Music</h1> \
           				</div> \
           				<div data-role="content"> \
            				<h3>{{title}}</h3>  \
                    <div data-role="fieldcontain"> \
                       <select name="sourceSelect{{zone}}" id="sourceSelect{{zone}}" class="select" data-theme="b"> \
                          <option value="">Choose Source</option> \
                          <option value="[CO{{zone}}I1]">Source01</option> \
                          <option value="[CO{{zone}}I2]">Source02</option> \
                          <option value="[CO{{zone}}I3]">Source03</option> \
                          <option value="[CO{{zone}}I4]">Source04</option> \
                          <option value="[CO{{zone}}I5]">Source05</option> \
                          <option value="[CO{{zone}}I6]">Source06</option> \
                          <option value="[CO{{zone}}I7]">Source07</option> \
                          <option value="[CO{{zone}}I8]">Source08</option> \
                       </select> \
                    </div> \
            				<input type="range" id="musicZone{{zone}}Vol" class="musicPopUp" name="{{zone}}" value="-40" min="-80" max="0" data-highlight="true" data-show-value="true" data-popup-enabled="true"/> \
                    <span class="floatLeft"><button id="musicZone{{zone}}Mute" onclick="simpleSend(\'audioa|[VMT{{zone}}]\')" data-inline="true" >Off</button></span> \
                    <span class="floatRight"><button onclick="history.back();" data-inline="true" >Done</button></span> \
           				</div> \
       					</div><!-- /shades --> \
       					{{/musicZones}}'; 

       	musicControlhtml = Mustache.to_html(musicControlTemplate, data);

        musicPageTemplate = '<div id="music" data-role="page" data-theme="b"> \
                 <div data-role="header" data-position="fixed" data-id="hc_header"> \
                     <h1>Music Control</h1> \
                     <a href="#home" data-icon="home" data-iconpos="notext">Home</a> \
                 </div> \
                 <div data-role="content"> \
                 {{#musicZones}} \
                     <a href="#musicZone{{zone}}" onClick="simpleSend(\'audioa|getStatusZone.{{zone}}\')" class="button250" data-role="button" data-rel="dialog" data-inline="true"> \
                      <span class="musicName">MUSIC</span><br/> \
                      <span class="buttonTitle">{{title}}</span><br/> \
                    </a> \
                  {{/musicZones}} \
                 </div> \
                 <div data-role="footer" data-position="fixed" data-id="hc_footer"> \
                     <div data-role="navbar"> \
                         <ul> \
                             <li><a href="#shades">Shades</a></li> \
                             <li><a href="#locks">Door Locks</a></li> \
                             <li><a href="#music">Music</a></li> \
                         </ul> \
                     </div><!-- /navbar --> \
                 </div> \
                  </div><!-- /shades -->'; 

          
          musicPagehtml = Mustache.to_html(musicPageTemplate, data);

       		$('body').append(musicPagehtml);
          $('body').append(musicControlhtml);

    	//});
};