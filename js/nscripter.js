/*Nscripter 支持*/
function setwindow(x,y,wordNum,lineNum,weight,height,wordDist,lineDist,speed,bold,shade,winColor_Dir,winX,winY){
/*setwindow 头文字左上角x坐标,y坐标,每行字数,行数,字宽,字高,字间距,行间距,单字显示速度毫秒数,粗体状态,阴影状态,窗体颜色,窗体左上角x坐标,y坐标,右下角x坐标,y坐标*/
	maxWeigh=0;
	for(count=0;count<=wordNum;count++){maxWeigh+=ctx_text.measureText('一').width;}
settextLayer(x,y,maxWeigh,textsetting.font,speed,bold,shade,winColor_Dir,winX,winY);
}

function setwindow2(winColor_Dir){
alert('setwindow2 is undefined.');
}

function erasetextwindow(num){
if(num==0){setting.erasetextwindow=false};
if(num==1){setting.erasetextwindow=true};
}
function puttext(text){
//检测@及\的存在，并输出。0为不清屏只换行，1为不清屏不换行，2为清屏
	var pos=text.indexOf('@')
	var lastpos=-1;
	while(pos!=-1 && textCanDrawing){
		drawText(text.slice(lastpos+1,pos));
		drawTextPos.status=1
		lastpos=pos;
		pos=text.indexOf('@',lastpos+1)
	}

	pos=text.indexOf('\\')
	while(pos!=-1 && textCanDrawing){
		drawText(text.slice(lastpos+1,pos));
		drawTextPos.status=2;
		lastpos=pos;
		pos=text.indexOf('\\',lastpos+1);
	}
	if(lastpos<text.length && textCanDrawing){drawText(text.slice(lastpos+1));drawTextPos.status=0;}
	
}



