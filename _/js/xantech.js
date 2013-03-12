//$('#shades').bind('pagecreate', function(event) {
  function makeAudio() {
    		var data, shadeControlTemplate, shadeControlhtml, shadePageTemplate, shadePagehtml;
    		data = {
    			"musicZones" : [
            {"zone" : "00", "title" : "Whole House"},
            {"zone" : "01", "title" : "Family Room"},
            {"zone" : "02", "title" : "Kitchen"},
            {"zone" : "05", "title" : "Mstr Bath"},
            {"zone" : "06", "title" : "Mstr Bed"},
            {"zone" : "03", "title" : "Game Room"},
            {"zone" : "04", "title" : "Patio"},
    				
    			]
    		}

    		musicControlTemplate = '{{#musicZones}} \
    					<div data-role="page" id="musicZone{{zone}}" class="musicControl" data-title="Music" data-theme="a"> \
         					<div data-role="header"> \
               					<h1>Music</h1> \
           				</div> \
           				<div data-role="content"> \
            				<h3>{{title}}</h3>  \
                    <div data-role="fieldcontain" > \
                       <select name="sourceSelect{{zone}}" id="sourceSelect{{zone}}" class="select" data-theme="b"> \
                          <option value="">Choose Source</option> \
                          <option value="!{{zone}}I3+">iPod</option> \
                          <option value="!{{zone}}I2+">Source02</option> \
                       </select> \
                    </div> \
             				<input type="range" id="musicZone{{zone}}Vol" class="musicPopUp" name="{{zone}}" value="20" min="0" max="40" data-highlight="true" data-show-value="true" data-popup-enabled="true"/> \
                    <span class="floatLeft"><button id="musicZone{{zone}}Mute" class="ui-btn-up-b" onclick="simpleSend(\'xantech|!{{zone}}V00+\')" data-inline="true" >Off</button></span> \
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
                     <a href="#musicZone{{zone}}" class="button250" data-role="button" data-rel="dialog" data-inline="true"> \
                      <span class="musicName">MUSIC</span><br/> \
                      <span class="buttonTitle">{{title}}</span><br/> \
                    </a> \
                  {{/musicZones}} \
                 </div> \
                 <div data-role="footer" data-position="fixed" data-id="hc_footer"> \
                     <div data-role="navbar"> \
                         <ul> \
                             <li><a href="#lights">Lights</a></li> \
                             <li><a href="#shades">Shades</a></li> \
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