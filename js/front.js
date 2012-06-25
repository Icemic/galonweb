var canvas=document.getElementById('imgLayer');
var ctx=canvas.getContext('2d');
var canvas_text=document.getElementById('textLayer');
var ctx_text=canvas_text.getContext('2d');
//零散的变量定义
var setting={
erasetextwindow:false
}
var drawTextPos=new Object();
drawTextPos.dx=0;
drawTextPos.dy=0;
drawTextPos.status=2;
textCanDrawing=true;
bgCanDrawing=true;
scriptCanGoOn=true;  //存储是否有\符号，控制脚本执行
/*功能_lookback*/
var lookback = {
Text:new Array(),
Mode:false,
lookback:function(direction){
if (lookback.Mode==false){lookback.Count=0;lookback.Mode=true;}
ctx_text.clearRect(0, 0, 800, 600);
ctx_text.fillStyle=lookback.Color;   
ctx_text.font=textsetting.font;   
ctx_text.textBaseline='top';
if (direction=='up'){
	if (lookback.Count<lookback.Text.length-1){lookback.Count+=1;}
		}
else{
	if (lookback.Count>0){lookback.Count-=1;}
	}
ctx_text.fillText(lookback.Text[lookback.Count],textsetting.x,textsetting.y);
},
Color:'#FFFF33', /*黄色*/
Count:0,
}
/*获取脚本*/
var scriptlines=new Array();
$.get("/getscript",function(response){scriptlines=response.split('\n');});
scriptNum=0;  <!--用于记录脚本位置-->
preloadCount=0;
imgNum=0;
var textsetting={
x:0,
y:0,
maxWeigh:800,
color:'#fff',
font:'normal 17px 楷体',
speed:500,
bold:1,
shade:1,
winColor_Dir:'#fff',
winX:0,
winY:0
}

/*测试用区域开始*/
imgPreload();
/*测试用区域结束*/

/*鼠标点击事件*/
$('.display').click(onclick);
function onclick(){scriptCanGoOn=true;eventLoop()}
function eventLoop(){
	if (lookback.Mode==true){drawText2();lookback.Mode=false;}
	//scriptCanGoOn=true;
	while (scriptCanGoOn && textCanDrawing && bgCanDrawing){
		//alert('a')
		$('div[id="run"]').html('<script>' + scriptlines[scriptNum] + '</script>');
		<!-- 定义支持的图片/媒体格式（正则）-->
		if (scriptlines[scriptNum].search(/\.jpg|\.png|\.bmp|\.ogg|\.wav|\.mp3/i)!=-1){imgNum-=1;if (imgNum<=0){imgPreload();}} /*记录已显示的图片数，判断是否启动预载*/
		//if (scriptlines[scriptNum].search(/\\/)!=-1){scriptCanGoOn=false;}
		scriptNum+=1;
	}
}
/*滚轮滚动事件*/
$('.display').mousewheel(function(event,delta){
	if (!(textCanDrawing && bgCanDrawing)){return false;}  <!--阻止动画执行中的事件-->
	if (delta > 0){  <!--鼠标滚轮向上-->
	lookback.lookback('up');
	return false;
	;}
	else if (delta < 0){  <!--鼠标滚轮向下-->
	lookback.lookback('down');
	return false;
	;}
});
/*图片预载*/
function imgPreload(){
	var list=new Array();
	$.get("/imgPreload",{int:String(preloadCount)},function(response){
		list=response.split(",");
		imgNum=0;
		$('link[rel="prerender"]').remove(); <!-- chrome --> /*清除原有预载内容*/
		$('link[rel="prefetch"]').remove(); <!-- firefox --> /*清除原有预载内容*/
		for (x in list){
			imgNum+=1;
			$('head').append('<link rel="prerender" href="' + list[x] + '">');
			//$('head').append('<link rel="prefetch" href="' + list[x] + '">');
		}
		preloadCount+=imgNum;
	});
}
/*命令_drawText*/
function drawText(text){
//drawTextPos.status参数：0为不清屏只换行，1为不清屏不换行，2为清屏
textCanDrawing=false; //由于setTimeout，需要加入变量控制，在文本绘制完成前制止自动执行
var chars=text.split('');
if(drawTextPos.status==0){drawTextPos.dx=0;drawTextPos.dy+=ctx_text.measureText('一').width;} 
if(drawTextPos.status==2){drawTextPos.dx=0;drawTextPos.dy=0;} 
var count=0;
ctx_text.fillStyle=textsetting.color;   
ctx_text.font=textsetting.font; 
ctx_text.textBaseline='top';
if(drawTextPos.status==2){ctx_text.clearRect(0, 0, 800, 600);}
lookback.Text.unshift(text);/*向数组头部添加，便于lookback*/
	fnc=function(){
	ctx_text.fillText(chars[count],textsetting.x+drawTextPos.dx,textsetting.y+drawTextPos.dy);
	drawTextPos.dx+=ctx_text.measureText(chars[count]).width
		if(drawTextPos.dx>=textsetting.maxWeigh){drawTextPos.dx=0;drawTextPos.dy+=ctx_text.measureText('一').width;}
	count++;
		if(count<chars.length){setTimeout(fnc,textsetting.speed);} //持续执行
			else{textCanDrawing=true;if(drawTextPos.status==0)eventLoop()} //绘制完成，修改状态。
}
fnc(); //绘制入口
}

function drawText2(){
ctx_text.clearRect(0, 0, 800, 600);
ctx_text.fillStyle=textsetting.color;   
ctx_text.font=textsetting.font;   
ctx_text.textBaseline='top';
ctx_text.fillText(lookback.Text[0],textsetting.x,textsetting.y);
}
/*命令_bg*/
function bg(pos,effect,speed){
bgCanDrawing=false;
if(erasetextwindow){textoff()};
var img = new Image();
img.src=pos;
var lastTime=0;
x=0;
img.onload=function(){
//ctx.drawImage(img,0,0);
if(speed==undefined){speed=1200;}
effectdraw=function(){
if(x>=0.28){bgCanDrawing=true;if(erasetextwindow){texton()};onclick();return false;}  //出口点
if (Date.now() - lastTime < speed/40){window.webkitCancelAnimationFrame;}
else{
lastTime=Date.now();
ctx.restore();
ctx.save();
ctx.globalAlpha=x
x+=0.007  //共需200次执行//40
ctx.drawImage(img,0,0);
}
window.webkitRequestAnimationFrame(effectdraw);
}
effectdraw();
}
}
/*命令_mp3loop/bgm*/
function bgm(src){
/*$('audio[id="bgm"]').replaceWith('<audio id="bgm" src="'+src+'" autoplay="autoplay" loop="loop"></audio>')*/
document.getElementById("bgm").src=src;
document.getElementById("bgm").play();
}
function dwave(channel,src){
/*$('audio[id="bgm"]').replaceWith('<audio id="dwave-'+String(channel)+'" src="'+src+'" autoplay="autoplay" loop="loop"></audio>')*/
document.getElementById("dwave-"+String(channel)).src=src;
document.getElementById("dwave-"+String(channel)).play();
}
function dwavestop(channel){
document.getElementById("dwave-"+String(channel)).pause();
}
function stop(channel){
var listx=new Array();
listx=document.getElementsByName("sound");
for (x in listx){listx[x].pause();}
}

function click(){
scriptCanGoOn=false;
}


function settextLayer(x,y,maxWeigh,font,speed,bold,shade,winColor_Dir,winX,winY){
textsetting.x = x;
textsetting.y = y;
textsetting.maxWeigh = maxWeigh;
textsetting.font = font;
textsetting.speed = speed;
textsetting.bold = bold;
textsetting.shade = shade;
textsetting.winColor_Dir = winColor_Dir;
textsetting.winX = winX;
textsetting.winY =winY;
needInitTextLayer=true;
}

function texton(){
//$('#textLayer').show();
ctx_text.restore();
}
function textoff(){
//$('#textLayer').hide();
ctx_text.save();
ctx_text.clearRect(0, 0, 800, 600);
}

function wait(time){
	
	
}


var systemcall={
rmenu:function(){return false;},
reset:function(){return false;},
skip:function(){return false;},
automode:function(){return false;},
save:function(){return false;},
load:function(){return false;},
lookback:function(){return false;},
windowerase:function(){return false;}
}