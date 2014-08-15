//test
var alphabet='qwertyuiopasdfghjklzxcvbnm'
var digits='0123456789'

var buttonSize=20;
var mySpaceWidth=150; 

var myKeyboard = createKeyboard()
var selectedTextfield = null;


var startMove=false;

var Ymove = scroll;
var Xmove = (Math.floor(document.body.clientWidth/2) - myKeyboard.clientWidth)+'px';

var XmoveIn=0;
var XmoveIn=0;

disableSelection(myKeyboard);
document.body.appendChild(myKeyboard);
setKeyboardPosition();

document.onmousemove = mouseMove

window.onresize=function(){	updateKeyboardPosition(); }

function createKeyboard() {

	var container = document.createElement('div');
	container.id='keyboard'
	container.className='keyboard'
	
	var startXcoord=-14;
	var startYcoord=3;
	var stepCoord=23;
	var slopeCoord=10;
		
	var xcoord=startXcoord;
	var ycoord=startYcoord;
	for (var i = 0; i < digits.length; i++) {
		xcoord=xcoord+stepCoord;
		container.appendChild(createUniversalButton(xcoord,ycoord, digits[i], 'onebutton'));
	}
	
	xcoord=startXcoord;
	ycoord=startYcoord+stepCoord;
	for (var i = 0; i < alphabet.length; i++) {
		xcoord=xcoord+stepCoord;
		if ((i==10) || (i==19)){
			xcoord=i+slopeCoord;
			ycoord=ycoord+stepCoord;
		}
		container.appendChild(createUniversalButton(xcoord,ycoord,alphabet[i], 'onebutton'));
	}	
	
	container.appendChild(createUniversalButton(xcoord+stepCoord,ycoord, 'clr', 'onebutton'));
	
	container.appendChild(createUniversalButton(startXcoord+stepCoord, ycoord+stepCoord,'space','spacebutton'));
	
	container.appendChild(createUniversalButton(startXcoord+mySpaceWidth+stepCoord+4, ycoord+stepCoord,'backspace','onebutton'));
	
	container.appendChild(createDropDownMenu(xcoord, ycoord,stepCoord));
	
	container.onclick=function(e){
		clickHandler(e);
	}
	
	container.onmouseover=function(e){
		mouseOverHandler(e);
	}
	
	container.onmouseout=function(e){
		mouseOutHandler(e);
	}

	container.onmousedown=function(e){
		mouseDownHandler(e);
	}
	
	container.onmouseup=function(e){
		mouseUpHandler(e);
	}

 	return container;
}

function createDropDownMenu(xcoord, ycoord, stepCoord){
	var menu = document.createElement('select');
	menu.id='menuList;'
	menu.innerHTML='<option>---</option>';
	
	var inputElems = [
      document.getElementsByTagName('input'),
      document.getElementsByTagName('textarea')
    ];
	
	for (var x = 0, elem; elem = inputElems[x++];)
      for (var y = 0, ex; ex = elem[y++];)
        if (ex.nodeName == "TEXTAREA" || ex.type == "text" || ex.type == "password")
			menu.innerHTML=menu.innerHTML+'<option>'+ex.name+'</option>';
						
	menu.style.position='absolute';
	menu.style.top=ycoord+2*stepCoord+'px';
	
	menu.onchange = function(){
		menuChange(this);
	}
	return menu;
}
function mouseUpHandler(event){
	targ = event.target || event.scrElement;
	startMove=false;
}
function mouseDownHandler(event){
	targ = event.target || event.scrElement;
	if (targ.id=='keyboard')	{

		startMove=true;
		
		XmoveIn=fixEvent(event).pageX-parseInt(myKeyboard.style.left)
		YmoveIn=document.body.clientHeight-parseInt(myKeyboard.style.bottom)-fixEvent(event).pageY;

		document.ondragstart = function() { return false }
        document.body.onselectstart = function() { return false }

	}
}

function mouseOverHandler(event){
	targ = event.target || event.scrElement;
	if (targ.className=='onebutton') 
		if (selectedTextfield!=null)
			targ.className+='select';
}

function mouseOutHandler(event){
	targ = event.target || event.scrElement;
	if (targ.className=='onebuttonselect')
		targ.className='onebutton';
}

function clickHandler(event){
	targ = event.target || event.srcElement;
	if (selectedTextfield!=null){
		if (targ.id=='clr'){
			selectedTextfield.value='';
		}
		else if (targ.id=='space'){
			selectedTextfield.value=selectedTextfield.value+' ';
		}
		else if (targ.id=='backspace'){
			selectedTextfield.value=selectedTextfield.value.slice(0, selectedTextfield.value.length-1);  
		}
		else if ((targ.className=='onebutton') || (targ.className=='onebuttonselect')){
			selectedTextfield.value=selectedTextfield.value+targ.id;
		}

		var end = selectedTextfield.value.length;
		selectedTextfield.setSelectionRange(end,end);
	}
}

function menuChange(self){
	if (self.selectedIndex!=0)
	{
		selectedTextfield=document.getElementsByName(self.options[self.selectedIndex].innerHTML)[0]
		selectedTextfield.focus();
		selectedTextfield.value=selectedTextfield.value;
		for (var i = 0; i < myKeyboard.childNodes.length; i++) {
			myKeyboard.childNodes[i].style.color='#000000'
		}
	}
	else if (self.selectedIndex==0)
	{
		selectedTextfield=null;
		for (var i = 0; i < myKeyboard.childNodes.length; i++) {
			if ((myKeyboard.childNodes[i].className=='onebutton') || (myKeyboard.childNodes[i].className=='onebuttonselect')) {
				myKeyboard.childNodes[i].style.color='#b4b4b4'
			}
		}
	}
}

function createUniversalButton(xcoord, ycoord, text, className){
	var subcon = document.createElement('div');
	subcon.id=text;
	
	subcon.className='onebutton';
	subcon.style.width=buttonSize+'px';
	subcon.style.height=buttonSize+'px';
	if (text=='backspace'){
		subcon.innerHTML='&#x2190';
	}
	else if (text=='space'){
		subcon.innerHTML='space';
		subcon.style.width=mySpaceWidth+'px';
	}
	else {
		subcon.innerHTML=text;
	}
	disableSelection(subcon)
	subcon.style.position='absolute'
	subcon.style.top=ycoord+'px'
	subcon.style.left=xcoord+'px'
	return subcon
}

function setKeyboardPosition() {
	myKeyboard.style.position = 'fixed';
	var scroll = document.documentElement.scrollTop;
	myKeyboard.style.bottom = 0;
	myKeyboard.style.left = (Math.floor(document.body.clientWidth/2) - myKeyboard.clientWidth/2) /*- Xmove*/+'px';
}

function updateKeyboardPosition(){
	myKeyboard.style.left=Xmove-XmoveIn+'px';
	myKeyboard.style.bottom=document.body.clientHeight-Ymove-YmoveIn+'px';
}

function fixEvent(e) {
    // �������� ������ ������� ��� IE
    e = e || window.event
    // �������� pageX/pageY ��� IE
    if ( e.pageX == null && e.clientX != null ) {
        var html = document.documentElement
        var body = document.body
        e.pageX = e.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0)
        e.pageY = e.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0)
    }
    // �������� which ��� IE
    if (!e.which && e.button) {
        e.which = e.button & 1 ? 1 : ( e.button & 2 ? 3 : ( e.button & 4 ? 2 : 0 ) )
    }
    return e
}

function mouseMove(event){
    event = fixEvent(event)
	
	if (startMove==true){
		Xmove=event.pageX;
		Ymove=event.pageY;
		updateKeyboardPosition();
	}
    document.getElementById('mouseX').value = event.pageX
    document.getElementById('mouseY').value = event.pageY
}


function disableSelection(target){
	if (typeof target.onselectstart!="undefined")
		target.onselectstart=function(){return false}
	else if (typeof target.style.MozUserSelect!="undefined")
		target.style.MozUserSelect="none"
	else
		target.onmousedown=function(){return false}
	target.style.cursor = "default"
}



