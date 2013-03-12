//$('#shades').bind('pagecreate', function(event) {
  function makeRCS() {
    		var data, shadeControlTemplate, shadeControlhtml, shadePageTemplate, shadePagehtml;
    		data = {
    			"climateZones" : [
    				{"zone" : "01", "title" : "Mstr Bed"},
            {"zone" : "02", "title" : "Mstr Bath"},
            {"zone" : "03", "title" : "Mstr Closet"},
            {"zone" : "04", "title" : "Walter Office"},
            {"zone" : "05", "title" : "Bed 2/3"},
            {"zone" : "06", "title" : "Exercise"},
            {"zone" : "07", "title" : "William Rm"},
            {"zone" : "08", "title" : "Dining Rm"},
            {"zone" : "09", "title" : "Living Rm"},
            {"zone" : "10", "title" : "Media Rm"},
            {"zone" : "11", "title" : "Kit/Family"}
    			]
    		}

    		climateControlTemplate = '{{#climateZones}}  \
                <div id="hvac{{zone}}" data-role="page" data-theme="a"> \
                   <div data-role="header"> \
                       <h1>{{title}}</h1> \
                   </div> \
                   <div data-role="content"> \
                      <div class="ui-grid-b ui-responsive"> \
                        <div class="ui-block-a"> \
                          <p><span class="mint">68</span><br/> \
                            <button onclick="newSetPoint(this);">+</button> \
                            <button onclick="newSetPoint(this);">-</button> \
                          </p> \
                        </div> \
                        <div class="ui-block-b"> \
                          <h3 class="temp">72</h3> \
                        </div> \
                        <div class="ui-block-c"> \
                          <p><span class="maxt">80</span><br/> \
                            <button onclick="newSetPoint(this);">+</button> \
                            <button onclick="newSetPoint(this);">-</button> \
                          </p> \
                        </div> \
                      </div><!-- grid --> \
                       <div data-role="navbar"> \
                           <ul class="mode"> \
                               <li><a href="#">Auto</a></li> \
                               <li><a href="#">Cool</a></li> \
                               <li><a href="#">Heat</a></li> \
                               <li><a href="#">Off</a></li> \
                           </ul> \
                       </div> \
                       <div style="text-align:center;"><button onclick="history.back();" data-inline="true">Done</button></div> \
                   </div> \
               </div><!-- /hvac --> \
               {{/climateZones}}'; 

       	climateControlhtml = Mustache.to_html(climateControlTemplate, data);

        climatePageTemplate = '<div id="climate" data-role="page" data-theme="b"> \
                 <div data-role="header" data-position="fixed" data-id="hc_header"> \
                     <h1>Climate Control</h1> \
                     <a href="#home" data-icon="home" data-iconpos="notext">Home</a> \
                 </div> \
                 <div data-role="content"> \
                 {{#climateZones}} \
                    <a href="#hvac{{zone}}" data-role="button" data-rel="dialog" data-inline="true"> \
                      <span class="hvacName">{{title}}</span><br/> \
                      <span class="temp">72</span><br/> \
                      <span class="smallmint">68</span><span class="smallmaxt">80</span> \
                    </a> \
                  {{/climateZones}} \
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
                  </div><!-- /climate -->'; 

          
          climatePagehtml = Mustache.to_html(climatePageTemplate, data);

       		$('body').append(climatePagehtml);
          $('body').append(climateControlhtml);

    	//});
};