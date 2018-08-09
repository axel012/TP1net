	var xo,yo;
var dragging = false;
var currentRotationX = 0;
var currentRotationY = 0;

$(".container").mousedown(function(e){
dragging = true;
xo = e.screenX;
yo = e.screenY;
dragging = true;
});

$(".container").mousemove(function(e){
if(dragging){
var dx =  e.screenX -xo ;
var dy = yo- e.screenY ;

currentRotationX +=dx;
currentRotationY +=dy;

xo = e.screenX;
yo = e.screenY;

$("#centro").css("transform","rotateX("+currentRotationY+"deg) rotateY("+currentRotationX+"deg)");
}
});

$(".container").mouseup(function(e){
dragging = false;
});

function toggleRotation(e){
if(centro.classList.contains("rotation")){
	$(e).html("ACTIVAR ROTACION")
	$(e).toggleClass("red");
	$(e).toggleClass("green");
	$("#tooltip").css("display","inherit");
}else{
$(e).html("DESACTIVAR ROTACION");
$(e).toggleClass("green");
$(e).toggleClass("red");
$("#tooltip").css("display","none");
}
	$("#centro").toggleClass("rotation");
	currentRotationX = 0;
	currentRotationY = 0;
	
$("#centro").css("transform","rotateX("+currentRotationY+"deg) rotateY("+currentRotationX+"deg)");
}


function toggleNumbers(e){
if($("#centro>div>span").hasClass("hide")){
	$(e).html("DESACTIVAR NUMEROS")
	$(e).toggleClass("red");
	$(e).toggleClass("green");
}else{
$(e).html("ACTIVAR NUMEROS");
$(e).toggleClass("green");
$(e).toggleClass("red");

}
	$(".nro").toggleClass("hide");
}



function setViewVista(e){
$(".btn").prop( "disabled", false );
$(e).prop( "disabled", true );
$("#centro").removeClass("cube");
$("#centro").removeClass("cilinder");
$("#centro").addClass("vista");
}

function setViewCubo(e){
$(".btn").prop( "disabled", false );
$(e).prop( "disabled", true );
$("#centro").removeClass("vista");
$("#centro").removeClass("cilinder");
$("#centro").addClass("cube");
}

function setViewCilinder(e){
$(".btn").prop( "disabled", false );
$(e).prop( "disabled", true );
$("#centro").removeClass("vista");
$("#centro").removeClass("cube");
$("#centro").addClass("cilinder");
}

$("#selector").on("input",function(){
var val = $("#selector").val();
$("#opacidad").html(val);
$(".plane").css("opacity",val);
});
