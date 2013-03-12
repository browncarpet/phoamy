//$('body').live('pagecreate', function(event) {
  function makeShades() {
    		var data, shadeControlTemplate, shadeControlhtml, shadePageTemplate, shadePagehtml;
    		data = {
    			"shadeZones" : [
            {"nameID" : "3", "title" : " All Grotto"},
            {"nameID" : "4", "title" : "Ntasket BO Mstr"},
            {"nameID" : "5", "title" : "Kitchen"},
            {"nameID" : "6", "title" : "Stairs"},
            {"nameID" : "7", "title" : "Ntasket Mstr"},
            {"nameID" : "8", "title" : "Big Bay L"},
            {"nameID" : "9", "title" : "All 45 Bay"},
            {"nameID" : "10", "title" : "Bay BO Mstr"},
            {"nameID" : "11", "title" : "Maurice Dr"},
            {"nameID" : "12", "title" : "Big Bay R"},
            {"nameID" : "13", "title" : "Ntasket & Maur Mid"},
            {"nameID" : "14", "title" : "Ntasket"}
    			]
    		}

    		shadeControlTemplate = '{{#shadeZones}} \
    					<div id="shades{{nameID}}" class="shades" data-role="page" data-theme="a"> \
         					<div data-role="header"> \
               					<h1>Shades</h1> \
           				</div> \
           				<div data-role="content"> \
            				<h3>{{title}}</h3>  \
            				<a href="#" class="ui-btn-up-b" data-role="button" onclick="simpleSend(\'comstar|drape{{nameID}}open\');" data-inline="true">Open</a> \
                    <a href="#" class="ui-btn-up-b" data-role="button" onclick="simpleSend(\'comstar|drape{{nameID}}close\');" data-inline="true">Close</a> \
             				<button onclick="history.back();" data-inline="true">Done</button> \
           				</div> \
       					</div><!-- /shades --> \
       					{{/shadeZones}}'; 

       	shadeControlhtml = Mustache.to_html(shadeControlTemplate, data);

        shadePageTemplate = '<div id="shades" data-role="page" data-theme="b"> \
                 <div data-role="header" data-position="fixed" data-id="hc_header"> \
                     <h1>Shade Control</h1> \
                     <a href="#home" data-icon="home" data-iconpos="notext">Home</a> \
                 </div> \
                 <div data-role="content"> \
                 {{#shadeZones}} \
                     <a href="#shades{{nameID}}" class="button250" data-role="button" data-rel="dialog" data-inline="true"> \
                      <span class="shadesName">SHADES</span><br/> \
                      <span class="buttonTitle">{{title}}</span><br/> \
                    </a> \
                  {{/shadeZones}} \
                 </div> \
                 <div data-role="footer" data-position="fixed" data-id="hc_footer"> \
                     <div data-role="navbar"> \
                         <ul> \
                             <li><a href="#shades">Shades</a></li> \
                             <li><a href="#locks">Door Locks</a></li> \
                             <li><a href="#music">Muisc</a></li> \
                         </ul> \
                     </div><!-- /navbar --> \
                 </div> \
                  </div><!-- /shades -->'; 

          
          shadePagehtml = Mustache.to_html(shadePageTemplate, data);

       		$('body').append(shadePagehtml);
          $('body').append(shadeControlhtml);

    	};