
//***********************************************GRAFICADORA**********************************************************//
////////////*********************************DECLARANDO VARIABLES*******************************************////////////

var canvas = document.getElementById("canvas");//"OBJETO" CANVAS , ES LA PIZARRA
var ctx= canvas.getContext("2d");//EL CONTEXTO ES DONDE DIBUJAS , LA PARTE BLANCA DE LA PIZARRA
var cuerpoweb = document.body; //CUERPO DEL DOCUMENTO, TODA LA PÁGINA

var stringFuncion="x";//F(X)

///VARIABLES GENERALES//
var ancho = canvas.width;//ANCHO DEL CANVAS (EN PIXELES)
var alto = canvas.height;//ALTO DEL CANVAS (EN PIXELES)
var resolucion=1;//cantidad de puntos por pixel

var ejeX = new Array();
var ejeY = new Array();
var FdeX = new Array();

var unidadX=1;//CUANTO REPRESENTA CADA CUADRADO DE LA REJILLA X
var unidadY=1;//CUANTO REPRESENTA CADA CUADRADO DE LA REJILLA Y

//var vectorTamaños=[50,25];

var zoomX=0;  //ZOOM EN X E Y
var zoomY=0;

var tamanoUnidad=50;//CUANTOS PIXELES MIDE LA UNIDAD

var centroX; //VARIABLES PARA MANTENER EL CENTRO CUANDO SE HACE ZOOM
var centroY;

var Xmouse=0; //POSICIÓN DEL MOUSE EN ELE EJE X

var colorN = "white";    //COLOR DE LOS NÚMEROS Y CUADRILLAS DEL EJE X E Y.
var colorB = "gray";     //CUADRÍCULAS QUE NO SON LOS EJES
var colorW = "green";    //COLOR DEL CANVAS
var colorF = "yellow";      //COLOR DE LA FUNCIÓN

//INICIALIZAMOS VALORES DE LOS EJES:
for(var i = 0 ; i<alto;i++){
	ejeY[i]=(alto-i)*unidadY/tamanoUnidad;
}

for(var i = 0 ; i<ancho;i++){
	ejeX[i]=i*unidadX/tamanoUnidad;
}

//*********************************************************************************************************************
//*************************************FUNCIÓN QUE BORRA TODA LA PANTALLA***********************************************
function limpiar(){
	ctx.fillStyle= colorW;
	ctx.fillRect(0,0,ancho,alto);
}
//**********************************************************************************************************************
//*******FUNCIÓN QUE SE ENCARGA DE EXTRAER LOS DATOS QUE INGRESA EL USUARIO Y LOS GUARDA EN UNA VARIABLE****************
function extraerFuncion(){
	stringFuncion=document.getElementById("F").value;
	if(document.getElementById("D").value>0 && document.getElementById("D").value<41){
		resolucion=document.getElementById("D").value;
	}else{
		resolucion=1;
	}
	actualizar();
}
//************************REGISTRA CALQUIER MOVIENTO QUE REALIZA EL MOUSE EN EL CANVAS**********************************
canvas.addEventListener("mousemove",Mouse);
function Mouse(e){
	Xmouse=e.offsetX;
	redibujar();
}
//**********************************************************************************************************************
//**********************************************************************************************************************
//****************FUNCIÓN QUE REDONDEA UN NÚMERO A LA CANTIDAD DE DECIMALES QUE SE ESTABLEZCA***************************
function redondeador(num, cantDec) {
	if(!("" + num).includes("e")) {
		return +(Math.round(num + "e+" + cantDec)  + "e-" + cantDec);
	} else {
		var arr = ("" + num).split("e");
		var sig = "";
		if(+arr[1] + cantDec > 0) {
			sig = "+";
		}
		return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + cantDec)) + "e-" + cantDec);
	}
}
//FUNCIÓN CUYO OBJETIVO ES SIEMPRE OBTENER UNA DIFERENCIA POSITIVA
function diferencia(a,b){
	if(a>b){
		return (a-b);
	}else{
		return (b-a);
	}
}
//***********FUNCIÓN QUE RETORNA LA POSICIÓN DEL NÚMERO MÁS CERCANO EN EL VECTOR AL NÚMERO QUE LE DAMOS****************
function aproximador(vector,num){
	if(num<=vector[0] && num>=vector[vector.length-1]){
		var I = 0;
		var minDif= diferencia(num,vector[I]);
		for(var i = 0; i < vector.length; i++){
			if(diferencia(num,vector[i])<minDif){
				I=i;
				minDif=diferencia(num,vector[I]);
			}
		}
		return I;
	}else{
		if(num>vector[0]){
			return -10;

		}else{
			return vector.length*2;
		}
	}
}
//**********************************************************************************************************************
//**********************************FUNCIÓN QUE DIBUJA LAS CUADRÍCULAS**************************************************
function dibujarCuadriculas(){
//DIBUJA LAS LÍNEAS VERTICALES
	for(var i = 1; i<ancho;i++){
		if(ejeX[i]===0){
			ctx.fillStyle = colorN;
			ctx.fillRect(i,0,2,alto-50);
			for(var k = 1; k<alto/tamanoUnidad;k++){
				ctx.fillText(redondeador(ejeY[k*tamanoUnidad],6),i+3,k*tamanoUnidad+10);
			}
		}else if(ejeX[i]%unidadX===0){
			ctx.fillStyle = colorB;
			ctx.fillRect(i,0,1,alto-50);
		}
	}
//DIBUJA LAS LÍNEAS HORIZONTALES
	for(var i = 0; i<alto;i++){
		if(ejeY[i]===0){
			ctx.fillStyle = colorN;
			ctx.fillRect(50,i,ancho,2);
			for(var k = 1; k<ancho/tamanoUnidad;k++){
				ctx.fillText(redondeador(ejeX[k*tamanoUnidad],6),k*tamanoUnidad+4,i+10);
			}
		}else if(ejeY[i]%unidadY===0){
			ctx.fillStyle = colorB;
			ctx.fillRect(0,i,ancho,1);
		}
	}
}
//**********************************************************************************************************************
//************************FUNCIÓN QUE RETORNA EL VALOR DE LA FUNCIÓN EVALUADA EN EQUIS**********************************
function evaluaFuncion(Equis,funcion){
	//Expresiones regularES o RegExp, la g es para una búsqueda global y la i para ignorar si son mayúsculas o min;
	sin = /sin/gi;
	sen = /sen/gi;
	cos = /cos/gi;
	tan = /tan/gi;
	tg = /tg/gi;
	cot = /cot/gi;
	ctg = /ctg/gi;
	sec = /sec/gi;
	csc = /csc/gi;
	pi = /pi/gi;
	e = /e/gi;
	x = /x/gi;
	ln = /ln/gi;
	log = /log/gi;
	/*Se usan las expresiones anteriores y no se reemplaza directamente un string porque de hacerlo solo se reemplaza
	el primer valor encontrado.  ^*/
	funcion = funcion.replace("^","**");
	funcion = funcion.replace(x,"(x)");
	funcion = funcion.replace(x, Equis);
	funcion = funcion.replace(log,"Math.log10").replace(ln, "Math.log");
	funcion = funcion.replace(sin, "Math.sin").replace(cos,"Math.cos");
	funcion = funcion.replace(sen, "Math.sin").replace(tan,"Math.tan");
	funcion = funcion.replace(tg,"Math.tan").replace(cot,"1/Math.tan");
	funcion = funcion.replace(ctg,"1/Math.tan");
	funcion = funcion.replace(sec,"1/Math.cos").replace(csc,"1/Math.sin");
	funcion = funcion.replace(pi, "Math.PI").replace(e, "Math.E");
	return(eval(funcion));
}
//**********************************************************************************************************************
//***************FUNCIÓN QUE EVALÚA LA FUNCIÓN SEGÚN X y GUARDA EL RESULTADO EN UN ARREGLO******************************
function calcular(){
	var Y=null;
	for(var i = 0; i<ancho;i++){
		for(var j = 0 ; j<resolucion ; j++){
			Y=evaluaFuncion(ejeX[i]+unidadX*j/(resolucion*tamanoUnidad),stringFuncion);
			FdeX[i*resolucion+j]=Y;
		}
	}
}
//**********************************************************************************************************************
//************FUNCIÓN QUE SE ENCARGAR DE GRAFICAR LA FUNCIÓN Y EL PUNTO AL QUE APUNTA NUESTRO PUNTERO*******************
function dibujarFuncion(){
	var Y=null;
	var Y2=null;
	var Ypunto=-10;
	var punto="";
	for(var i = 0; i<ancho-1;i++){
		for(var j = 0 ; j<resolucion ; j++){
			ctx.fillStyle = colorF;
			Y=FdeX[i*resolucion+j];
			Y2=FdeX[i*resolucion+j+1];
			if(Y<=0 ||Y>=0){
				if(Y2<=0 ||Y2>=0){
					Y=aproximador(ejeY,Y);
					Y2=aproximador(ejeY,Y2);
					ctx.fillRect(i,Y,1,1);
					ctx.fillRect(i,Y,1,Y2-Y);
				}
			}
		}
		if(Xmouse===i){
			Ypunto=Y;
		}
	}
	ctx.fillStyle = colorN;
	ctx.fillRect(Xmouse-2,Ypunto-2,6,6);  //dibuja el cuadradito
	punto=ejeX[Xmouse]+"  ,  "+redondeador(FdeX[Xmouse*resolucion],6);
	ctx.fillText(punto,Xmouse+6,Ypunto); //Dibuja los datos del cuadradito
}
//**********************************************************************************************************************
//***********FUNCIÓN QUE SE ENCARGA DE DIBUJAR LOS NÚMEROS QUE SE ENCUENTRAN FUERA DE LAS CUADRÍCULAS*******************
function dibujarNumeros(){
	ctx.fillStyle = colorW;
	ctx.fillRect(0,0,50,alto);
	ctx.fillRect(0,alto-49,ancho,tamanoUnidad);
	//DIBUJA LOS NÚMEROS DE LA HORIZONTAL INFERIOR
	for(var i = 1; i<ancho/tamanoUnidad;i++){
		ctx.fillStyle = colorN;
		ctx.fillText(ejeX[i*tamanoUnidad],i*tamanoUnidad-4,alto-30);
		if(ejeX[i*tamanoUnidad]===0){
			ctx.fillText(ejeX[i*tamanoUnidad],i*tamanoUnidad-4,alto-30);
		}
	}
	//DIBUJA LOS NÚMEROS DE LA VERTICAL IZQUIERDA
	for(var i = 0; i<alto/tamanoUnidad;i++){
		ctx.fillStyle = colorN;
		ctx.fillText(ejeY[i*tamanoUnidad],5,i*tamanoUnidad+8);
		if(ejeY[i*tamanoUnidad]===0){
			ctx.fillText(ejeY[i*tamanoUnidad],5,i*tamanoUnidad+8);
		}
	}
}
//**********************************************************************************************************************
//**********************FUNCIÓN QUE REDIBUJA f(x) MIENTRAS SE ENCUENTRA ESTÁTICA****************************************
function redibujar(){
	limpiar();
	dibujarCuadriculas();
	dibujarFuncion();
	dibujarNumeros();
}
//*********************FUNCIÓN QUE SE EJECUTA CUANTO EL USUARIO HACE UN MOVIMIENTO**************************************
function actualizar(){
	calcular();
	redibujar();
}
//**********************************************************************************************************************
//********************************FUNCIONES DE MOVIMIENTO EN EL CANVAS*************************************************
function moverDerecha(){//Creo que l codigo se explica solo
	for(var i = 0 ; i<ancho;i++){
		ejeX[i] = redondeador(ejeX[i]+unidadX,12);
	}
	actualizar();
}
function moverIzquierda(){//Creo que l codigo se explica solo
	for(var i = 0 ; i<ancho;i++){
		ejeX[i]=redondeador(ejeX[i]-unidadX,12);
	}
	actualizar();
}
function moverArriba(){//Creo que l codigo se explica solo
	for(var i = 0 ; i<alto;i++){
		ejeY[i] = redondeador(ejeY[i]+unidadY,12);
	}
	actualizar();
}
function moverAbajo(){//Creo que l codigo se explica solo
	for(var i = 0 ; i<alto;i++){
		ejeY[i]=redondeador(ejeY[i]-unidadY,12);
	}
	actualizar();
}
//**********************************************************************************************************************
//*************************************ZOOOOOOOOOOOOOOOOOOOOOOM*********************************************************
//ZOOM EN EL EJE X
function zoomMasX(){
	if (zoomX<8){
		zoomX++;
		unidadX = redondeador(unidadX/2,14);
		centroX = ejeX[tamanoUnidad*5];
		for (var i=0; i<ancho; i++){
			ejeX[i] = redondeador(ejeX[i]/2+centroX/2,12);
		}
		actualizar();
	}
}
function zoomMenosX(){
	if(zoomX>-8){
		zoomX--;
		unidadX=redondeador(unidadX*2,14);
		centroX = ejeX[tamanoUnidad*5];
		if(centroX%unidadX!==0){
			centroX=ejeX[tamanoUnidad*4];
		}
		for(var i = 0 ; i<ancho;i++){
			ejeX[i]=redondeador(ejeX[i]*2-centroX,12);
		}
		actualizar();
	}
}
//ZOOM EN EL EJE Y
function zoomMasY(){
	if (zoomY<8){
		zoomY++;
		unidadY = redondeador(unidadY/2,14);
		centroY = ejeY[tamanoUnidad*4];
		for (var i=0; i<alto; i++){
			ejeY[i] = redondeador(ejeY[i]/2+centroY/2,12);
		}
		actualizar();
	}
}
function zoomMenosY(){
	if (zoomY>-8){
		zoomY--;
		unidadY = redondeador(unidadY*2,14)
		centroY = ejeY[tamanoUnidad*4];
		if(centroY%unidadY!==0) {
			centroY = ejeY[tamanoUnidad * 5];
		}
		for (var i=0; i<alto;i++){
			ejeY[i] = redondeador(ejeY[i]*2-centroY,14);
		}
		actualizar();
	}
}
//ZOOM GENERAL
function zoomMas(){
	zoomMasX();
	zoomMasY();
	actualizar();
}
function zoomMenos(){
	zoomMenosX();
	zoomMenosY();
	actualizar();
}
//*********************************************************************************************************************
//****************ESCUCHADOR DE EVENTOS: EL NAVEGADOR ESTA ATENTO A LAS TECLAS QUE PRESIONA EL USUARIO******************
document.addEventListener("keydown",oprimir);//SE CREA Y AÑADE EL ESCUCHADOR, CUANDO SE PRESIONA UNA TECLA LLAMA A LA FUNCION OPRIMIR
function oprimir(e){//e ES TODA LA INFORMACION SOBRE LA TECLA QUE SE OPRIMIDO , CODIGO , NOMBRE, ETC
	
	switch(e.keyCode){ // YO SOLO NECESITO SU CODIGO Y CON ESO SE QUÉ TECLA SE OPRIME
		case 37://IZQUIERDA
			moverIzquierda();
		break;
		case 38://ARRIBA
			e.preventDefault();
			moverArriba();
		break;
		case 39://DERECHA
			moverDerecha();
		break;
		case 40://ABAJO
			e.preventDefault();
			moverAbajo();
		break;
		case 80://P
			zoomMas();
		break;
		case 77://M
			zoomMenos();
		break;
		case 74://j
			zoomMasX();
			break;
		case 75://k
			zoomMenosX();
			break;
		case 76://l
			zoomMasY();
			break;
		case 192://ñ
			zoomMenosY();
			break;
	}
}
actualizar();

