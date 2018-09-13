//Informações sobre estado atual do jogo
var rodando = false;
var xfruta, yfruta;
var relogio;
var intervalo;
var proxDirec = new Array();//interação usuario abaixo do intervalo ana
proxDirec.length = 0;//intereção usuario ana

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

//Sons
function sndComer() { //Reproduzir som aleatório de comer
	if (Math.random() < 0.8)
		sndcomer1.play();
	else
		sndcomer2.play();
}

function novaPosFruta() { //Determinar uma nova posição para a fruta
	do {
		xfruta = Math.floor(Math.random() * nx);
		yfruta = Math.floor(Math.random() * ny);
	} while (colisaoFruta() == true);
}

function colisaoFruta() { //Verificar se posição da fruta colide com corpo da snake
	for (i = 0; i < nodos.length; i++) {
		if ((xfruta == nodos[i].x) && (yfruta == nodos[i].y))
			return true;
	}
	return false;
}


function detectarColisoes() {
//Implementar Função
//Comer a fruta
	if ((nodos[0].x == xfruta) && (nodos[0].y == yfruta)) {
		sndComer();
		var ultimo = nodos.length - 1;
		nodos.push(new Nodo(nodos[ultimo].x, nodos[ultimo].y, nodos[ultimo].direc));
		var novoultimo = ultimo + 1;
		switch (nodos[ultimo].direc) {
			case dbaixo:
				nodos[novoultimo].y -= 1;
				break;
			case ddireita:
				nodos[novoultimo].x -= 1;
				break;
			case dcima:
				nodos[novoultimo].y += 1;
				break;
			case desquerda:
				nodos[novoultimo].x += 1;
				break;
		}
		novaPosFruta();
	}
}

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
	//Se lista de comandos não estiver vazia, interação usuário dentro de mover snake
	if(proxDirec.length>0)
		//Se há uma direção diferente da atual
		if(nodos[0].direc !=proxDirec[0])
			//alterar a direção
			nodos[0].direc = proxDirec[0];
	//Executa movimento da cabeça
	nodos[0].Mover();
	//Enquanto houverem comandos na lista , interação com usuario abaixo de movimento da cabeça
	while(proxDirec.length >0)
	{//Se o comando é redundante
		if(proxDirec[0]==nodos[0].direc)
			proxDirec.shift();//Remove o comando do inicio da lista
		else
			//Se não for, para a repetição
			break;
	}
}

//Eventos
document.onkeydown=onKD;

function onKD(evt)
{
	switch(evt.keyCode)
	{
		case 37://esquerda
			proxDirec.push(desquerda);
			break;
		case 38: //dcima
			proxDirec.push(dcima);
			break;
		case 39://direita
			proxDirec.push(ddireita);
			break;
		case 40://baixo
			proxDirec.push(dbaixo);
			break;
		
	}
}

function carregar(){
	document.getElementById("btPausa").addEventListener("click", pausa(),false);
	document.getElementById("btNovo").addEventListener("click", novoJogo(),false);
}
