var canvas=document.getElementById('imgLayer');
var ctx=canvas.getContext('2d');
var canvas_text=document.getElementById('textLayer');
var ctx_text=canvas_text.getContext('2d');

var canvas_hide=document.createElement('canvas');
canvas_hide.width=800;
canvas_hide.height=600;
var ctx_hide=canvas_hide.getContext('2d');




//零散的变量定义
var setting={erasetextwindow:false}
var drawTextPos={dx:0,dy:0,status:0}
textCanDrawing=true;
bgCanDrawing=true;
scriptCanGoOn=true;  //存储是否有\符号，控制脚本执行
waiting=false; //是否在等待
waitEndTime=0; //等待结束时间（这里是全局初始化）
screenHeigh=600;
screenWeigh=800;

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
status:2,
textCache:''
};
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
function onclick(){
	if (waiting==true){return false;} //-阻止等待中的事件
	if (lookback.Mode==true){drawText2(lookback.Text[0]);lookback.Mode=false;}
	if (drawTextPos.status==2){textoff()}
	scriptCanGoOn=true;
	eventLoop();
}
function eventLoop(){
	//scriptCanGoOn=true;
	while (!waiting && scriptCanGoOn && textCanDrawing && bgCanDrawing){
		//alert('a')
		$('div[id="run"]').html('<script>' + scriptlines[scriptNum] + '</script>');
		<!-- 定义支持的图片/媒体格式（正则）-->
		if (scriptlines[scriptNum].search(/\.jpg|\.png|\.bmp|\.ogg|\.wav|\.mp3/i)!=-1){imgNum-=1;if (imgNum<=0){imgPreload();}} /*记录已显示的图片数，判断是否启动预载*/
		scriptNum+=1;
	}
}
/*滚轮滚动事件*/
$('.display').mousewheel(function(event,delta){
	if (waiting==true){return false;} <!--阻止等待中的事件-->
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
function drawText(text,status){
//drawTextPos.status参数：0为不清屏只换行，1为不清屏不换行，2为清屏
textCanDrawing=false; //由于setTimeout，需要加入变量控制，在文本绘制完成前制止自动执行
var chars=text.split('');
if(drawTextPos.status==0){drawTextPos.dx=0;drawTextPos.dy+=ctx_text.measureText('一').width;} ;
if(drawTextPos.status==2){drawTextPos.dx=0;drawTextPos.dy=0;ctx_text.clearRect(0, 0, 800, 600);};
var count=0;
ctx_text.fillStyle=textsetting.color;   
ctx_text.font=textsetting.font; 
ctx_text.textBaseline='top';
//关于lookback用数组的添加判断
if(drawTextPos.status==0){lookback.textCache+='\n'+text};
if(drawTextPos.status==1){lookback.textCache+=text};
if(drawTextPos.status==2){lookback.Text.unshift(lookback.textCache);lookback.textCache=text};
//为下次状态判断赋值
drawTextPos.status=status;
//填充迭代
fnc=function(callback){
	ctx_text.fillText(chars[count],textsetting.x+drawTextPos.dx,textsetting.y+drawTextPos.dy);
	drawTextPos.dx+=ctx_text.measureText(chars[count]).width;
	if(drawTextPos.dx>=textsetting.maxWeigh){drawTextPos.dx=0;drawTextPos.dy+=ctx_text.measureText('一').width;};
	count++;
	if(count<chars.length){setTimeout(fnc,textsetting.speed);}//持续执行
	else{textCanDrawing=true;if(drawTextPos.status==0){eventLoop();};};
	//else{textCanDrawing=true;if(drawTextPos.status==0){eventLoop()}} //绘制完成，修改状态。
	};
fnc(); //绘制入口
};

function drawText2(text){
ctx_text.clearRect(0, 0, 800, 600);
ctx_text.fillStyle=textsetting.color;   
ctx_text.font=textsetting.font;   
ctx_text.textBaseline='top';
var text_array=text.split('\n');
dy=0;  
for(count in text_array){
	ctx_text.fillText(text_array[count],textsetting.x,textsetting.y+dy);
	dy+=ctx_text.measureText('一').width;
	}
}
/*命令_bg*/
function bg(pos,effect,speed){
bgCanDrawing=false;
//drawTextPos.status=2;
if(setting.erasetextwindow){textoff()};
var img = new Image();
img.src=pos;
var lastTime=0;
var id=0;
x=0;
img.onload=function(){
	if(speed==undefined){speed=1200;}
	switch (effect){
		case 1:effectdraw_1();return false
	//	case 2:effectdraw_2();return false
	//	case 3:effectdraw_3();return false
	//	case 4:effectdraw_4();return false
	//	case 5:effectdraw_5();return false
	//	case 6:effectdraw_6();return false
	//	case 7:effectdraw_7();return false
	//	case 8:effectdraw_8();return false
	//	case 9:effectdraw_9();return false
		case 10:effectdraw_10();return false
	//	case 11:effectdraw_11();return false
	//	case 12:effectdraw_12();return false
	//	case 13:effectdraw_13();return false
		case 14:effectdraw_14();return false
	//	case 15:effectdraw_15();return false
	//	case 16:effectdraw_16();return false
	//	case 17:effectdraw_17();return false
	//	case 18:effectdraw_18();return false
	default:effectdraw_10()  //测试用，应为 effectdraw_1()
		};
	};

function effectdraw_1(){
	ctx.globalAlpha=1.0
	ctx.drawImage(img,0,0);
	if(setting.erasetextwindow && drawTextPos.status==0){texton()};
	bgCanDrawing=true;
	eventLoop();
	return false;
	};

function effectdraw_10(){
if(x>=0.28){if(setting.erasetextwindow && drawTextPos.status==0){texton()};bgCanDrawing=true;eventLoop();return false;}  //出口点
if (Date.now() - lastTime < speed/40){window.clearRequestTimeout(id);}
else{
	lastTime=Date.now();
	ctx.globalAlpha=x
	x+=0.007  //共需200次执行//40
	ctx.drawImage(img,0,0);
	};
id=window.requestAnimationFrame(effectdraw_10);
	};

function effectdraw_14(){
	ctx_hide.drawImage(img,0,0);
	//var imgData=ImageData();
	var times_per_fps=(screenHeigh/speed)*(1000/60);
	count=0;
	drawLoop();
	function drawLoop(){
		//console.log(count)
		if(count>=screenHeigh){if(setting.erasetextwindow && drawTextPos.status==0){texton()};bgCanDrawing=true;eventLoop();return false;}
		//if (Date.now() - lastTime < 100){console.log('test');window.clearRequestTimeout(id);}
		else{
			lastTime=Date.now();
			ctx.putImageData(ctx_hide.getImageData(0,count,800,times_per_fps),0,count);
			count+=times_per_fps;
			id=window.requestAnimationFrame(drawLoop);
			};
		};
		
		

	};

};
/*命令_mp3loop/bgm*/
function bgm(src){
/*$('audio[id="bgm"]').replaceWith('<audio id="bgm" src="'+src+'" autoplay="autoplay" loop="loop"></audio>')*/
document.getElementById("bgm").src=src;
document.getElementById("bgm").play();
};
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
drawText2(lookback.textCache)
}
function textoff(){
//$('#textLayer').hide();
ctx_text.clearRect(0, 0, 800, 600);
}

function wait(time){
	i=0;
	waitEndTime=Date.now()+time
	waiting=true;
	fnc=function(){
		if(Date.now()>=waitEndTime){waiting=false;eventLoop();return false;}
		setTimeout(fnc,1);
		}
	setTimeout(fnc,1);
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