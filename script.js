//Informações sobre estado atual do jogo
var rodando = false;
var xfruta, yfruta;
var relogio;
var intervalo;

function pausa(){
	rodando = !rodando;
	if(rodando){
		btPausa.innerHTML = "Pausar";
		relogio = setInterval("loopPrincipal()", intervalo);
	}else{
		clearInterval(relogio);
		btPausa.innerHTML = "Continuar";
	}
}

//Recuperando referência dos objetos no documento
var canvas = document.getElementById("tela");
var context = canvas.getContext("2d");
var btPausa = document.getElementById("btPausa");


//Informações sobre o tabuleiro
var nx =0;
var ny = 0;
var largura = 20;
var distancia = 5;
var borda_x, borda_y;

//Inicializações
criarTabuleiro();
novoJogo();

function criarTabuleiro(){
	nx = Math.floor((canvas.width - distancia)/(largura + distancia));
	ny = Math.floor((canvas.height - distancia) / (largura + distancia));
	borda_x = nx * (distancia + largura) + distancia;
	borda_y = ny * (distancia + largura) + distancia;
}

//Array contendo todos os nodos da Snake

var nodos;

function novoJogo(){
	if(rodando)
		pausa();
	intervalo = 200;
	xfruta = nx -1;
	yfruta = ny -1;
	nodos = new Array();
	var xcenter = Math.floor(nx / 2);
	var ycenter = Math.floor(ny / 2);
	nodos.length = 0;
	nodos.push(new Nodo(xcenter,ycenter + 2,dbaixo));
	nodos.push(new Nodo(xcenter,ycenter + 1,dbaixo));
	nodos.push(new Nodo(xcenter,ycenter,dbaixo));
	nodos.push(new Nodo(xcenter,ycenter - 1,dbaixo));
	nodos.push(new Nodo(xcenter,ycenter - 2,dbaixo));
	btPausa.innerHTML = "Iniciar";
	btPausa.disabled = false;
	desenhar();
}


function desenhar(){
	//Variáveis auxiliares para desenhar
	var xi, yi;

	//Limpar a tela
	context.clearRect(0,0, canvas.width,canvas.height);

	//Desenhar bordas
	context.fillStyle = "#888888";
	context.fillRect(borda_x,0,canvas.width - 1, canvas.height - 1);
	context.fillRect(0,borda_y,canvas.width - 1, canvas.height -1);

	//Desenhar a cobra
	context.fillStyle = "#00FF00";
	for(var i = 0; i < nodos.length; i++){
		xi = distancia + nodos[i].x * (largura + distancia);
		yi = distancia + nodos[i].y * (largura + distancia);
		context.fillRect(xi,yi,largura,largura);
	}

	//Desenhar a Fruta
	context.fillStyle = "#FF0000";
	xi = distancia + (xfruta * (largura + distancia)) + Math.floor(largura / 2);
	yi = distancia + (yfruta * (largura + distancia)) + Math.floor(largura / 2);
	context.beginPath();
	context.arc(xi,yi,distancia,0,Math.PI*2,true);
	context.closePath();
	context.fill();
}

function loopPrincipal(){
	//atualizar valores
	moverSnake();
	desenhar();
}

function moverSnake(){
	//Mover todos os nodos, exceto cabeça
	for(i = nodos.length - 1; i > 0; i--){
		nodos[i].x = nodos[i-1].x;
		nodos[i].y = nodos[i-1].y;
		nodos[i].direc = nodos[i-1].direc;
	}
	//Executa movimento da cabeça
	nodos[0].Mover();
}

function carregar(){
	document.getElementById("btPausa").addEventListener("click", pausa(),false);
	document.getElementById("btNovo").addEventListener("click", novoJogo(),false);
}


//---------------------------------NODO-----------------------------------
//Sentidos de movimento
var dcima =1;
var ddireita = 2;
var dbaixo = 3;
var desquerda = 4;


function Nodo(px,py,dir){
	var x,y,direc;
	this.x = px;
	this.y = py;
	this.direc = dir;
	this.Mover = function(){
		switch(this.direc){
			case dcima:
			this.y -= 1;
			break;
			case dbaixo:
			this.y += 1;
			break
			case ddireita:
			this.x += 1;
			break;
			case desquerda:
			this.x -= 1;
			break;
		}
	};
}




