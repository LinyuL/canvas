$(function(){
	var can,cobj,paledraw;
	var copy=$(".copy");
	var divs=$(".shape div");
	var input=$("#sz");
	// console.log(input[0].value);
	var flag=true;
	$(".new").click(function(){
		var w=prompt("画布的宽度");
		var h=prompt("画布的高度");
		if(flag){
			can=$("<canvas id='can' width="+w+" height="+h+"></canvas>")[0];
			$(can).appendTo(".canvas-box");
			copy.css({width:w,height:h,border:"1px solid #999"});
			flag=false;
		}		
		else{
			alert("当前已有画布！");
		}		
		cobj=can.getContext("2d");
		paledraw=new palette(cobj,can,copy[0]);
		paledraw.draw();
		draw();
		paledraw.pencil();
	})
	function draw(){
		divs.each(function(i,obj){
			$(obj).click(function(){
				paledraw.type=this.id;
				paledraw.draw();
				if(paledraw.type=="pencil"){
					paledraw.pencil();
				}
				if(paledraw.type=="poly"){
					paledraw.polyNum=prompt('请输入多边形边数');
					return;
				}
				if(paledraw.type=="jiao"){
					paledraw.polyNum=prompt('请输入多角形角数');
					return;
				}				
			})
		})
		input.blur(function(){
			// alert(this.value);
			paledraw.lineWidth=lineWidth.value=this.value;
		})
		$('#lineWidth').change(function(){
			input[0].value=this.value;
			paledraw.lineWidth=this.value;
		})
		$('#strokeStyle').change(function(){
			paledraw.strokeStyle=this.value;
		})
		$('#fillStyle').change(function(){
			paledraw.fillStyle=this.value;
		})
		$("#stroke").click(function(){
			paledraw.style="stroke";
		})
		$("#fill").click(function(){
			paledraw.style="fill";
		})
		$(".back").click(function(){
			var end=paledraw.history.pop();
			if(paledraw.history.length>0){
				paledraw.cobj.putImageData(paledraw.history[paledraw.history.length-1],0,0,0,0,paledraw.width,paledraw.height);
			}else{
				paledraw.cobj.clearRect(0,0,paledraw.width,paledraw.height);
				alert("没有东西了,不能再撤销了哦！");
			}
		})
		$(".save").click(function(){
			window.location.href=can.toDataURL('image/png').replace("image/png","image/octet-stream");
		})
	}
})