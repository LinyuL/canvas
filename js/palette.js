function palette(cobj,canvas,copy){
	this.cobj=cobj;   //创建2d对象
	this.canvas=canvas;   //画布
	this.copy=copy;     //画布的遮罩
	this.width=canvas.width;    //获取画布的宽度
	this.height=canvas.height;   //获取画布的高度
	//线条的宽度 填充的颜色 描边的颜色 会值的类型
	this.lineWidth=1;   //边框的宽度
	this.strokeStyle="#000000";  //边框颜色
	this.fillStyle="#000000";   //填充颜色
	this.style="fill";    //是填充
	this.type="line";
	this.polyNum=5;
	this.history=[];   //将上次画的图放在一个数组内保存下来
}
palette.prototype.reset=function(){
	this.cobj.strokeStyle=this.strokeStyle;
	this.cobj.fillStyle=this.fillStyle;
	this.cobj.lineWidth=this.lineWidth;
}
palette.prototype.draw=function(){
	var that=this;
	this.copy.onmousedown=function(e){
		e.preventDefault();	
		var dx=e.offsetX;
		var dy=e.offsetY;
		that.reset();
		that.copy.onmousemove=function(e){
			e.preventDefault();
			var mx=e.offsetX;
			var my=e.offsetY;
			that.cobj.clearRect(0,0,that.width,that.height);  //清除画布
			if(that.history.length>0){
				that.cobj.putImageData(that.history[that.history.length-1],0,0,0,0,that.width,that.height);
			}
			that[that.type](dx,dy,mx,my);
		}
		document.onmouseup=function(){
			that.copy.onmousemove=null;
			document.onmouseup=null;
			that.history.push(that.cobj.getImageData(0,0,that.width,that.height));

		}
	}
}
//直线
palette.prototype.line=function(x1,y1,x2,y2){
	this.cobj.beginPath();
	this.cobj.lineTo(x1,y1);  //开始的坐标
	this.cobj.lineTo(x2,y2);  //结束的坐标
	this.cobj.stroke();
	this.cobj.closePath();
}
//矩形
palette.prototype.rect=function(x1,y1,x2,y2){
	var w=x2-x1;
	var h=y2-y1;
	this.cobj.beginPath();
	this.cobj.rect(x1+.5,y1+.5,w,h);    //创建一个矩形
	this.cobj.closePath();
	this.cobj[this.style]();
}
//圆
palette.prototype.arc=function(x1,y1,x2,y2){
	//半径  勾股定理
	var r=this._r(x1,y1,x2,y2);
	this.cobj.beginPath();
	this.cobj.arc(x1,y1,r,0,2*Math.PI,false);
	this.cobj.closePath();
	this.cobj[this.style]();
}
//多边形
palette.prototype.poly=function(x1,y1,x2,y2){
	var r=this._r(x1,y1,x2,y2);
	var len=this.polyNum;
	var ag=360/len;
	this.cobj.beginPath();
	for (var i = 0; i < len; i++) {
		this.cobj.lineTo(x1+Math.cos(i*ag*Math.PI/180)*r,y1+Math.sin(i*ag*Math.PI/180)*r);
	};
	this.cobj.closePath();
	this.cobj[this.style]();
}
//多角形
palette.prototype.jiao=function(x1,y1,x2,y2){
	var r=this._r(x1,y1,x2,y2);
	var rS=r/2.5;
	var len=this.polyNum;
	var ag=360/(len*2);
	this.cobj.beginPath();
	for (var i = 0; i < len*2; i++) {
		if(i%2==0){
			this.cobj.lineTo(x1+Math.cos(i*ag*Math.PI/180)*r,y1+Math.sin(i*ag*Math.PI/180)*r);
		}else{
			this.cobj.lineTo(x1+Math.cos(i*ag*Math.PI/180)*rS,y1+Math.sin(i*ag*Math.PI/180)*rS);
		}
	};
	this.cobj.closePath();
	this.cobj[this.style]();
}
// 铅笔
palette.prototype.pencil=function(x1,y1,x2,y2){
	var that=this;
	this.copy.onmousedown=function(e){
		e.preventDefault();	
		var dx=e.offsetX;
		var dy=e.offsetY;
		that.reset();
		that.cobj.beginPath();
		that.copy.onmousemove=function(e){
			e.preventDefault();
			var mx=e.offsetX;
			var my=e.offsetY;
			that.cobj.lineTo(mx,my);
			that.cobj.stroke();
		}
		document.onmouseup=function(){
			that.cobj.closePath();
			that.copy.onmousemove=null;
			document.onmouseup=null;
			that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
		}
	}
}
// 半径
palette.prototype._r=function(x1,y1,x2,y2){
	 return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}