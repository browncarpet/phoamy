//$('#lights').bind('pagecreate', function(event) {
  function makeLights() {
    		var data, lightControlTemplate, lightControlhtml, lightPageTemplate, lightPagehtml;
    		data = {
    			"lightZones" : [
            {"nameID" : "4", "title" : "Dining Rm"}
    			]
    		}

    		lightControlTemplate = '{{#lightZones}} \
    					<div id="lights{{nameID}}" class="lights" data-role="page" data-theme="a"> \
         					<div data-role="header"> \
               					<h1>Lights</h1> \
           				</div> \
           				<div data-role="content"> \
            				<h3>{{title}}</h3>  \
            				<a href="#" class="ui-btn-up-b" data-role="button" onclick="simpleSend(\'lutron|#DEVICE,8,1,3\');" data-inline="true">High</a><br/> \
                    <a href="#" class="ui-btn-up-b" data-role="button" onclick="simpleSend(\'lutron|#DEVICE,8,2,3\');" data-inline="true">Medium</a><br/> \
                    <a href="#" class="ui-btn-up-b" data-role="button" onclick="simpleSend(\'lutron|#DEVICE,8,3,3\');" data-inline="true">Low</a><br/> \
                    <a href="#" class="ui-btn-up-b" data-role="button" onclick="simpleSend(\'lutron|#DEVICE,8,4,3\');" data-inline="true">Off</a><br/> \
             				<button onclick="history.back();" data-inline="true">Done</button> \
           				</div> \
       					</div><!-- /lights --> \
       					{{/lightZones}}'; 

       	lightControlhtml = Mustache.to_html(lightControlTemplate, data);

        lightPageTemplate = '<div id="lights" data-role="page" data-theme="b"> \
                 <div data-role="header" data-position="fixed" data-id="hc_header"> \
                     <h1>Light Control</h1> \
                     <a href="#home" data-icon="home" data-iconpos="notext">Home</a> \
                 </div> \
                 <div data-role="content"> \
                 {{#lightZones}} \
                     <a href="#lights{{nameID}}" class="button250" data-role="button" data-rel="dialog" data-inline="true"> \
                      <span class="lightsName">Lights</span><br/> \
                      <span class="buttonTitle">{{title}}</span><br/> \
                    </a> \
                  {{/lightZones}} \
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
                  </div><!-- /lights -->'; 

          
          lightPagehtml = Mustache.to_html(lightPageTemplate, data);

       		$('body').append(lightPagehtml);
          $('body').append(lightControlhtml);

    	//});
};