var canvas=document.getElementById('imgLayer');
var ctx=canvas.getContext('2d');
var canvas_text=document.getElementById('textLayer');
var ctx_text=canvas_text.getContext('2d');
var lookbackText=new Array();
lookbackMode=false;
/*获取脚本*/
var scriptlines=new Array();
$.get("/getscript",function(response){scriptlines=response.split('||');});
scriptNum=0;  <!--用于记录脚本位置，目前无用....-->
preloadCount=0;
imgNum=0;
textpos_x=180;
textpos_y=358;
textsize='17';
textcolor='#fff';
lookbackcolor='#FFFF33'; /*黄色*/
lookback_count=0;
/*测试用区域开始*/
imgPreload();
/*测试用区域结束*/

/*鼠标点击事件*/
$('canvas').click(function(){
	if (lookbackMode==true){puttext2();lookbackMode=false;}
	$('div[id="run"]').html('<script>' + scriptlines[scriptNum] + '</script>');
	<!-- 定义支持的图片/媒体格式（正则）-->
	if (scriptlines[scriptNum].search(/\.jpg|\.png|\.bmp|\.ogg|\.wav|\.mp3/i)!=-1){imgNum-=1;if (imgNum<=0){imgPreload();}} /*记录已显示的图片数，判断是否启动预载*/
	scriptNum+=1;
});
/*滚轮滚动事件*/
$('canvas').mousewheel(function(event,delta){
	if (delta > 0){  <!--鼠标滚轮向上-->
	lookback('up');
	return false;
	;}
	else if (delta < 0){  <!--鼠标滚轮向下-->
	lookback('down');
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
			$('head').append('<link rel="prefetch" href="' + list[x] + '">');
		}
		preloadCount+=imgNum;
	});
}
/*命令_puttext*/
function puttext(text){
ctx_text.clearRect(0, 0, 800, 600);
ctx_text.fillStyle=textcolor;   
ctx_text.font='normal '+textsize+'px 楷体';   
ctx_text.textBaseline='top';
ctx_text.fillText(text,textpos_x,textpos_y);
lookbackText.unshift(text); /*向数组头部添加，便于lookback*/
}
function puttext2(){
ctx_text.clearRect(0, 0, 800, 600);
ctx_text.fillStyle=textcolor;   
ctx_text.font='normal '+textsize+'px 楷体';   
ctx_text.textBaseline='top';
ctx_text.fillText(lookbackText[0],textpos_x,textpos_y);
}
/*命令_bg*/
function bg(pos,effect){
var img = new Image();
img.src=pos;
img.onload=function(){
ctx.drawImage(img,0,0);
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

/*功能_lookback*/
function lookback(direction){
if (lookbackMode==false){lookback_count=0;lookbackMode=true;}
ctx_text.clearRect(0, 0, 800, 600);
ctx_text.fillStyle=lookbackcolor;   
ctx_text.font='normal '+textsize+'px 楷体';   
ctx_text.textBaseline='top';
if (direction=='up'){
	if (lookback_count<lookbackText.length-1){lookback_count+=1;}
		}
else{
	if (lookback_count>0){lookback_count-=1;}
	}
text=lookbackText[lookback_count];
ctx_text.fillText(text,textpos_x,textpos_y);
}