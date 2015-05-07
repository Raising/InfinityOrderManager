window.addEventListener('deviceready', function () {
	console.error("DEVICEREADYEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
}, false);

$(document).ready(function () {
  
     // conn = {}, window.WebSocket = window.WebSocket || window.MozWebSocket;
	

	    
   
});





function openConnection() {

	
        var conn = new WebSocket('ws://172.17.1.12:8100');

    	console.error("conected?");
        conn.onopen = function () {
            conn.send("0//conection//Connection Established Confirmation");
        };
        conn.onmessage = function (event) {
            document.getElementById("ConexionLog").innerHTML = event.data;
        };
        conn.onerror = function (event) {

            alert("Web Socket Error");
        };
        conn.onclose = function (event) {
            alert("Web Socket Closed");
        };

}



SRGM.GLOBALS.Conection = new SGRConection();


var vista = new SCTI.Mobile_view(
   {titulo:"Conexion",backRoute:"Null",menuType:"conexion"},
   {elemento: SRGM.GLOBALS.Conection});



$("#SCTI_container").append(vista.getView());
vista.refreshFunctionality();












/*
var database;
// The dynamically built HTML pages. In a real-life app, In a real-life app, use Handlerbar.js, Mustache.js or another template engine
//onclick="callDB()"
var homePage =
    '<div>' +
        '<div class="header"><h1>Comandero</h1></div>' +
        '<div class="scroller">' +
            '<ul class="list">' +
                '<li class="navega tapable" id="catalogo"><strong>Catalogo</strong></li>' +
                '<li id="callDB" class="tapable" ><strong>pedirDB</strong></li>' +
                '<li onclick="pedir()" class="tapable"><strong>pedir server</strong></li>' +
                '<li><input type="text" style="width:90%"></input></li>' +
            '</ul>' +
        '</div>' +
    '</div>';

var detailsPage =
    '<div>' +
        '<div class="header"><a href="{{back}}" class="btn navega"><div>Back</div></a><h1>{{header}}</h1><a  id="pedido_1" class="btnTop navega"><div>P</div></a></div>' +
        '<div class="scroller">' +
        	'<ul class="list">' +
                '{{content}}' +
            '</ul>' +
        '</div>' +
    '</div>';


var slider = new PageSlider($("#container"));
$(window).on('hashchange', route);




// Basic page routing
function route(event) {
    var page,
    hash = window.location.hash;
    var lista ='';
    page = merge(detailsPage, {back:"#inicio",header: "Familias", content: lista});
	slider.slidePage($(page));
    var direccion = hash.split("_");
    if (direccion[0] == "#catalogo"){
     	var consulta;
    	var pageChange = function(consulta){
    		console.log("pagechange call");
    		var tamanio = consulta.rows.length;
    		console.log(tamanio);
        	
        	
            for (var i = 0; i < tamanio; i++) {
               var row = consulta.rows.item(i);
               lista +='<li id="familia_'+row['familia'].replace(" ","-")+'"  class="navega tapable"><strong>'+row['familia']+'</li>';
            }
        	
        	page = merge(detailsPage, {back:"#inicio",header: "Familias", content: lista});
    		slider.slidePage($(page));
    		
    		  
			$('.navega').on('tap', function(e){		
				    e.preventDefault();					    
		            document.location.hash="#"+$(this).attr("id");
				    return false;
			});
			 $('.tapable').on('touchstart', function(e){
				    $(this).addClass('tapped');   
				});
			$('.tapable').on('touchend', function(e){
				    $(this).removeClass('tapped');
				});
    	}
    	database.transaction(function(tx){ getRows(tx,'SELECT familia from ARTICULOS group by familia' ,pageChange)},errorCB, successCB);
    	

    } 
    
    else if (direccion[0] == "#familia"){
    
    	var familia = direccion[1].replace("-"," ");
    	var pageChange = function(consulta){
    		var tamanio = consulta.rows.length;
        	
            for (var i = 0; i < tamanio; ++i) {
               var row = consulta.rows.item(i);
               if (row['cantidad'] == null){var cantidad = 0;}else{var cantidad = row['cantidad'];}
               //onclick="aniadir('+row['id']+')"
               lista +='<li><div id="side_'+row['id']+'" class="side_counter">'+cantidad+'</div><strong>'+row['nombre']+'</strong><div id="'+row["id"]+'_button"  class="btn2 aniadir">+</div></li>';
            }
        	
        	page = merge(detailsPage, {back:"#catalogo",header: familia, content: lista});
    		slider.slidePage($(page));
    		$('.aniadir').on('touchstart', function(e){
			    $(this).addClass('tapped');   
			});
			$('.aniadir').on('touchend', function(e){
				$(this).removeClass('tapped');
			});
			$('.aniadir').on('tap', function(e){		
				e.preventDefault();
			    var idValue = $(this).attr('id');	
			    console.error("ID ="+ idValue);
			    aniadir(idValue.split("_")[0]);
			    return false;
			});
			$('.navega').on('tap', function(e){		
			    e.preventDefault();					    
	            document.location.hash="#"+$(this).attr("id");
			    return false;
			});
			
    		
    	}
    	database.transaction(function(tx){ getRows(tx,'SELECT a.id,a.nombre,p.cantidad from ARTICULOS a LEFT JOIN PEDIDOS p on a.id= p.id_product WHERE a.familia = "'+familia+'"' ,pageChange)},errorCB, successCB);
    }
    else if (direccion[0] == "#pedido"){
    	var num_pedido = direccion[1];
    	lista +='<li  onclick="subirPedido('+num_pedido+')"><a  ><strong>Enviar pedido<strong></a></li>';
    	var pageChange = function(consulta){
    		var tamanio = consulta.rows.length;
        	
            for (var i = 0; i < tamanio; ++i) {
               var row = consulta.rows.item(i);	
               //onclick="aniadir('+row['id']+')"
               lista +='<li><a><div id="side_'+row['id']+'" class="side_counter">'+row['cantidad']+'</div><strong> - '+row['nombre']+'</strong></a><a id="'+row['id']+'_articulo"  class="btn2 aniadir"> +</a></li>';
            }
        	
        	page = merge(detailsPage, {back:"#catalogo",header: "Pedido:"+num_pedido, content: lista});
    		slider.slidePage($(page));
    		$$$on touch
    		$('.aniadir').on('touchstart', function(e){
			    $(this).addClass('tapped');   
			});
			$('.aniadir').on('touchend', function(e){
				    $(this).removeClass('tapped');
				});
			$('.aniadir').on('tap', function(e){			
			    	
			    var idValue = $(this).attr('id');	
			    aniadir(idValue.split("_")[0]);
			    return false;
			});
			
			$('.navega').on('tap', function(e){		
			    e.preventDefault();					    
	            document.location.hash="#"+$(this).attr("id");
			    return false;
			});
			

    	}
    	database.transaction(function(tx){ getRows(tx,'SELECT a.id,a.nombre,p.cantidad from PEDIDOS p LEFT JOIN ARTICULOS a on a.id = p.id_product WHERE p.num_pedido = '+num_pedido ,pageChange)},errorCB, successCB);
    }
    else {
        page = homePage;
//        slider.slide($(homePage), "left");
        slider.slidePage($(page));
        $('#callDB').on('tap', function(e){		
        	e.preventDefault();
        	console.error("tap en main");
        	callDB();
            return false;
        });

        $('.navega').on('tap', function(e){		
        	e.preventDefault();
        	console.error("tap en main");
            document.location.hash="#"+$(this).attr("id");
            return false;
        });
        $('.tapable').on('touchstart', function(e){
		    $(this).addClass('tapped');   
		});
		$('.tapable').on('touchend', function(e){
			    $(this).removeClass('tapped');
			});
        
    }

   

}

// Primitive template processing. In a real-life app, use Handlerbar.js, Mustache.js or another template engine
function merge(tpl, data) {
    return tpl.replace("{{back}}", data.back)
    		  .replace("{{header}}", data.header)
              .replace("{{content}}", data.content);
}

function aniadir(idproduct){
	var contador = $("#side_"+idproduct);
	var cantidad = parseInt( contador.html());
	contador.empty().append(cantidad+1);
	
	database.transaction(function(tx){ 
		getRows(tx,	'SELECT cantidad from PEDIDOS where id_product ='+idproduct+' and num_pedido = 1' ,	addToPedido,idproduct)},
				errorCB, successCB);	
}

function subirPedido(idPedido){
	database.transaction(function(tx){ getRows(tx,'SELECT p.cantidad,p.id_product,a.nombre from PEDIDOS p LEFT JOIN ARTICULOS a on a.id = p.id_product WHERE p.num_pedido = '+idPedido ,enviarPedido)},errorCB, successCB);
}


function pedir(){
	socket.emit('pedido', { message: 'Huevos rotos' });
}

function callDB() {
	socket.emit('GetDB', { message: 'get Database from server' });
}

function  enviarPedido(consulta){
	
	var tamanio = consulta.rows.length;

	var data = [];
    for (var i = 0; i < tamanio; i++) {
    	
       var row = consulta.rows.item(i);
       var item = {id:row['id_product'],cantidad:row['cantidad'],nombre:row['nombre']};
       data[i] = item;
     
    }
    console.log(JSON.stringify(data));
	socket.emit('pedido_clientToServer', { message: JSON.stringify(data) });
	
	page = merge(detailsPage, {back:"#inicio",header: "Inicio", content: ""});
	slider.slidePage($(page));
}

function addToPedido(consulta,idproduct){
	
	var tamanio = consulta.rows.length;
	if (tamanio == 0){ // producto no está en el pedido -> añadirlo
		database.transaction(function(tx){ 
			ejecutar(tx,
				'INSERT INTO PEDIDOS (id_product, cantidad, num_pedido) VALUES ('+idproduct+',1,1)' 
				)},
				errorCB, successCB);
	}else{	//pruducto en el pedido, incrementar cantidad
		var row = consulta.rows.item(0);
		var cantidad = parseInt(row['cantidad']);
		
		database.transaction(function(tx){ 
			ejecutar(tx,
				'UPDATE PEDIDOS SET cantidad = '+ (cantidad+1) +' where id_product ='+idproduct+' and num_pedido = 1' 
				)},
				errorCB, successCB);
	}
	
}

route();

*/