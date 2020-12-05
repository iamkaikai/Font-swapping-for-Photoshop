//Dropdown UI
var w = new Window ("dialog", "Nvidia", undefined, {closeButton: true});
  w.add ("statictext", undefined, "Replace english font with:");
  w.preferredSize = [280,180];


//font size
var font_size = Math.round( app.activeDocument.activeLayer.textItem.size );
var grp_font_size = w.add ('group');
    grp_font_size.alignment = 'left';
var f_title = grp_font_size.add ('statictext {text: "Font size: "}');
var f_input = grp_font_size.add ("edittext", undefined, font_size);    
    f_input.characters = 6;
    f_input.active = true;

//Typo input
var grp_font = w.add ('group');
    grp_font.add ('statictext {text: "Typography: "}');
    grp_font.alignment = 'left';
var myDropdown = grp_font.add ('dropdownlist', undefined, ['Dinpro', 'Geforce']);
    myDropdown.selection = 0;

//Font weight input
var grp_font_style = w.add ('group');
    grp_font_style.add ('statictext {text: "Font Style: "}');
    grp_font_style.alignment = 'left';
var myDropdown_style = grp_font_style.add ('dropdownlist', undefined, ['Light', 'Regular', 'Medium', 'Bold']);
    myDropdown_style.selection = 0;

//Read active layer fontstyle and extract weight from last word
var fw = app.activeDocument.activeLayer.textItem.font.match(/\w+$/g);
var fw_to_string = "" + fw;

//scale input
var grp_v_scale = w.add ('group');
  grp_v_scale.alignment = 'left';
var v_title = grp_v_scale.add ('statictext {text: "Text scale: "}');
var v_input = grp_v_scale.add ("edittext", undefined, "100");    
    v_input.characters = 6;
    v_input.active = true;

//Baseline
var grp_baseline = w.add ('group');
    grp_baseline.alignment = 'left';
var b_title = grp_baseline.add ('statictext {text: "Baselin Shift: "}');
var b_input = grp_baseline.add ("edittext", undefined, "0");    
    b_input.characters = 6;
    b_input.active = true;

//btn
var btn = w.add ('group'); 
    btn.alignment = 'right';
var btn_cancel = btn.add ('button {text: "Cancel"}'); 
var btn_ok = btn.add ('button {text: "Replace"}');



//Dropdown typo selection check
var chosen_font;
var font_s
var click_status = 0;

//variable get for popup menu and push into font replace function
var v;
var b;
var f;
var font_s;

btn_ok.onClick = function () {    
  var s = myDropdown.selection;
 

  if(s == 0){
    chosen_font = "DINPro";  
  }else{
    chosen_font = "GeForce"; 
  }
  //text scale & baseline
  v = v_input.text;
  b = b_input.text;
  f = f_input.text;

  //append font weight when cliking
  font_s = myDropdown_style.selection;

  w.close();
  click_status = 1;
}

btn_cancel.onClick = function(){
  w.close();
  click_status = 0;
}





//Font replace function
var copy = app.activeDocument.activeLayer

//Start check space between chinese and english, if not add space
function add_space(callback) {

  var str = app.activeDocument.activeLayer.textItem.contents;
  var re1 = /([\u4e00-\u9fa5])(\w+)/g;
  var re2 = /(\w+)([\u4e00-\u9fa5])/g;
  var newstr = str.replace(re1, "$1 $2").replace(re2,"$1 $2");
  app.activeDocument.activeLayer.textItem.contents = newstr;
  callback();

}
//Change all the english and symbol into Dinpro
function check(){
  
  try {
      
      //read active layer font size
      var s = copy.textItem.contents;
      var layer_font_size = Math.round( app.activeDocument.activeLayer.textItem.size );
      
      //read active layer color style
      var layer_color_r = copy.textItem.color.rgb.red;
      var layer_color_g = copy.textItem.color.rgb.green;
      var layer_color_b = copy.textItem.color.rgb.blue;
      
      //Change English to Dinpro
      for (var i = 0; i < s.length; i++) {
        var n = s.charCodeAt(i);  
        if (n < 256){
          setFormatting(i, i+1, chosen_font, font_s, f, v, v, b, [layer_color_r,layer_color_g,layer_color_b]);  
        }   
      }

  }catch (e) { alert(e);}

}

function setFormatting(start, end, fontName, fontStyle, fontSize, vScale, hScale, baseline, colorArray){
    //Sanity checking: is the active layer a text layer?  
    if(activeDocument.activeLayer){  
        var activeLayer = app.activeDocument.activeLayer;  
        if(activeLayer.kind == LayerKind.TEXT){  

            
        //More checking: does the text layer have content, and are start and end set to reasonable values?  
           if((activeLayer.textItem.contents != "")&&(start >= 0)&&(end <= activeLayer.textItem.contents.length)){  
           var idsetd = app.charIDToTypeID( "setd" );  
           var action = new ActionDescriptor();  
           var idnull = app.charIDToTypeID( "null" );  

        //The action reference specifies the active text layer.  
           var reference = new ActionReference();  
           var idTxLr = app.charIDToTypeID( "TxLr" );  
           var idOrdn = app.charIDToTypeID( "Ordn" );  
           var idTrgt = app.charIDToTypeID( "Trgt" );  
           reference.putEnumerated( idTxLr, idOrdn, idTrgt );  
           action.putReference( idnull, reference );  
           var idT = app.charIDToTypeID( "T   " );  
           var textAction = new ActionDescriptor();  
           var idTxtt = app.charIDToTypeID( "Txtt" );  

        //actionList contains the sequence of formatting actions.  
           var actionList = new ActionList();  

        //textRange sets the range of characters to format.  
           var textRange = new ActionDescriptor();  
           var idFrom = app.charIDToTypeID( "From" );  
           textRange.putInteger( idFrom, start );  
           textRange.putInteger( idT, end );  
           var idTxtS = app.charIDToTypeID( "TxtS" );  

        //The "formatting" ActionDescriptor holds the formatting. It should be clear that you can  
        //add other attributes here--just get the relevant lines (usually 2) from the Script Listener   
        //output and graft them into this section.  
           var formatting = new ActionDescriptor();  

        //Font name.  
           var idFntN = app.charIDToTypeID( "FntN" );  
           formatting.putString( idFntN, fontName );  

        //Font style.  
           var idFntS = app.charIDToTypeID( "FntS" );  
           formatting.putString( idFntS, fontStyle );  

        //Font size.  
           var idSz = app.charIDToTypeID( "Sz  " );  
           var idPnt = app.charIDToTypeID( "#Pnt" );  
           formatting.putUnitDouble( idSz, idPnt, fontSize );  

        //Vertical Scale  
           var idVrtS = charIDToTypeID( "VrtS");  
           formatting.putDouble( idVrtS, vScale);  

        //Horizontal Scale  
           var idHrzS = charIDToTypeID( "HrzS" );  
           formatting.putDouble (idHrzS, hScale);  

        //Vertical Baseline Height  
           var idBsln = charIDToTypeID( "Bsln" );  
           var idPxl = charIDToTypeID( "#Pxl" );  
           formatting.putUnitDouble( idBsln, idPxl, baseline );  

        //Fill color (as an RGB color).  
           var idClr = app.charIDToTypeID( "Clr " );  
           var colorAction = new ActionDescriptor();  
           var idRd = app.charIDToTypeID( "Rd  " );  
           colorAction.putDouble( idRd, colorArray[0] );  
           var idGrn = app.charIDToTypeID( "Grn " );  
           colorAction.putDouble( idGrn, colorArray[1]);  
           var idBl = app.charIDToTypeID( "Bl  " );  
           colorAction.putDouble( idBl, colorArray[2] );  
           var idRGBC = app.charIDToTypeID( "RGBC" );  
           formatting.putObject( idClr, idRGBC, colorAction );  

        //end color.  
           //  
           textRange.putObject( idTxtS, idTxtS, formatting );  
           actionList.putObject( idTxtt, textRange );  
           textAction.putList( idTxtt, actionList );  
           action.putObject( idT, idTxLr, textAction );  
           app.executeAction( idsetd, action, DialogModes.NO );  
          }  
        }  
    } else{
        alert("No layer was selected!");
    }
}

//Adding space first then changing font
// add_space(function(){
//  alert("replace font start");
//    check();
// });





//POP start first then replace font
w.show();
if( click_status == 1){
  add_space(
    function(){ check(); }
  ) 
};

