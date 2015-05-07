SCTI = {version:0.1, autor:"Ignacio Medina Castillo", contacto:"ignacio.medina.castillo@gmail.com"};

SCTI.id_counter = 0;
SCTI.getID = function(){
	var newID = SCTI.id_counter +1;
	SCTI.id_counter += 1;
	return newID;
}
SCTI.ContainersList = [];
SCTI.MobileViewsList = [];
SCTI.selecedContainer = "";

SCTI.SetContainers = function(array_containersIds){
	SCTI.ContainersList = array_containersIds;
}


SCTI.gotoView = function(idContainer){
	
	if (SCTI.selecedContainer ===""){
		$("#"+idContainer).removeClass("right").removeClass("left");
		
	}
	else{
		
			var pos = SCTI.ContainersList.indexOf(idContainer);
			var posAnterior = SCTI.ContainersList.indexOf(SCTI.selecedContainer);
			if (pos < posAnterior){
				$("#"+idContainer).removeClass("right").removeClass("left");
				for (var i=pos+1;i<=posAnterior;i++){
					$("#"+SCTI.ContainersList[i]).removeClass("left").addClass("right");
				} 
			}else{
				$("#"+idContainer).removeClass("right");
				for (var i=pos-1;i>=posAnterior;i--){
					$("#"+SCTI.ContainersList[i]).removeClass("left").addClass("left");
				}
			}
		
	}
	SCTI.selecedContainer = idContainer;
}

SCTI.goBack = function(callingContainer){
	if ((callingContainer && callingContainer == SCTI.selecedContainer) || !callingContainer  ){
		var pos = SCTI.ContainersList.indexOf(SCTI.selecedContainer) - 1;
		var posAnterior = SCTI.ContainersList.indexOf(SCTI.selecedContainer);
		
			$("#"+SCTI.ContainersList[pos]).removeClass("right").removeClass("left");

			$("#"+SCTI.ContainersList[posAnterior]).removeClass("left").addClass("right");
		SCTI.selecedContainer = SCTI.ContainersList[pos];

		if ($("#"+SCTI.ContainersList[pos]).data("omit") == true){
			SCTI.goBack();
		}
	}else{
		SCTI.gotoView(callingContainer);
	}
}

SCTI.swapContainers = function(target,swaped,direction){
	$("#"+target).removeClass("right").removeClass("left");
	$("#"+swaped).addClass(direction);
}


SCTI.addMobileView = function(scti_mobile_view){
	SCTI.MobileViewsList.push(scti_mobile_view);
}

SCTI.Incinicalizar = function(){

}
SCTI.Tablet_view = function(argument) {
	// body...
}





/* Pasar Parametros como objetos
* titulo:"articulos",backRoute:"catalogo",menuType:0
* elemento: object
*
* scti_foot = 
* Ejemplo: var catalogoView = new SCTI.Mobile_view({titulo:"Catalogo",backRoute:"inicio",menuType:0},{SCTI.Listado: object, tipo: "cuadricula"})
*/
SCTI.Mobile_view = function(SRGM_actual,Params){//scti_head,scti_body,scti_foot){//pasar parametros como objetos
	var mobile_view = this;
	this.id = SCTI.getID();
	this.containerId = Params.container;
	Params.elemento.container = Params.container;
	this.body = new SCTI.Body_view(Params.elemento);
	this.html = $("<div class='mobile_view' id='"+this.id+"'></div>");

	$(mobile_view.html).empty().append(mobile_view.body.getView());
	$("#"+mobile_view.containerId).empty().append(mobile_view.html);
	this.getView = function () {
		
		$(mobile_view.html).empty().append(mobile_view.head.getView()).append(mobile_view.body.getView());//.append(mobile_view.menu.getView());//.append(mobile_view.foot.getView());
		$("#"+mobile_view.containerId).empty().append(mobile_view.html);
		mobile_view.html.css("height", "100%").css("height", "-=40px");
		return mobile_view.html;
	}

	this.refreshFunctionality = function(){
		mobile_view.body.refreshFunctionality();
	}
	this.hidden = function(){

	}

	this.show = function(){
		$("#"+mobile_view.containerId).removeClass("right").removeClass("left");
	}
}


SCTI.Head_view = function(menuType){
	var head_view = this;
	this.id = SCTI.getID();

	
	this.menuButton = new SCTI.Menu_button(menuType ? menuType : 0);
	

	this.html = $("<div class='head_view' id='"+this.id+"'></div>")
		.append(this.menuButton.getView());
		
	
	this.getView = function(){
		head_view.html = $("<div class='head_view' id='"+head_view.id+"'> </div>")
			.append(head_view.menuButton.getView());
			if(SRGM.GLOBALS.Camarero && SRGM.GLOBALS.Camarero.getHead){
				head_view.html.append(SRGM.GLOBALS.Camarero.getHead());
			}

			if(SRGM.GLOBALS.Salon && SRGM.GLOBALS.Salon.getHead ){
				head_view.html.append(SRGM.GLOBALS.Salon.getHead());
			}

			if(SRGM.GLOBALS.Mesa && SRGM.GLOBALS.Mesa.getHead ){
				head_view.html.append(SRGM.GLOBALS.Mesa.getHead());
			}
			if(SRGM.GLOBALS.Conection &&  SRGM.GLOBALS.Conection.getHead ){
				head_view.html.append(SRGM.GLOBALS.Conection.getHead());
			}
			
		return head_view.html;
	}

	this.refreshFunctionality = function(){
		head_view.menuButton.refreshFunctionality();
	}
	this.actualize = function(){
		head_view.html.empty()
		.append(head_view.menuButton.getView());
			if(SRGM.GLOBALS.Camarero && SRGM.GLOBALS.Camarero.getHead){
				head_view.html.append(SRGM.GLOBALS.Camarero.getHead());
			}

			if(SRGM.GLOBALS.Salon && SRGM.GLOBALS.Salon.getHead ){
				head_view.html.append(SRGM.GLOBALS.Salon.getHead());
			}
			if(SRGM.GLOBALS.Mesa && SRGM.GLOBALS.Mesa.getHead ){
				head_view.html.append(SRGM.GLOBALS.Mesa.getHead());
			}
			if(SRGM.GLOBALS.Conection &&  SRGM.GLOBALS.Conection.getHead ){
				head_view.html.append(SRGM.GLOBALS.Conection.getHead());
			}
			
	}	
}

SCTI.Menu = function(){
	var menu = this;
	this.id = SCTI.getID();
	this.abierto = 0;
	this.html= $("<div id='"+this.id+"' class='menu_view'></div>"); 	
	this.lista = $("<ul class='listaMenu'></ul>");
	this.cargaImagenes = $("<li><span class='LineText'> Usar Imagenes: </span><input  type='checkbox'  id='images_config' ></input></li>");
	this.vibrarcheck = $("<li><span class='LineText'> Vibrar al pulsar: </span><input  type='checkbox'  id='vibrar_config' ></input></li>");
	this.pedirComensalescheck = $("<li><span class='LineText'>Pedir comensales: </span><input  type='checkbox'  id='pedirComensales_config' ></input></li>");
	this.guardar = $("<li><div class='menubutton'>Guardar</div></li>");
	//this.configuration = SRGM.GLOBALS.DB.configuration;
	
	if(SRGM.GLOBALS.Camarero && SRGM.GLOBALS.Camarero.getMenu){
		this.lista.append(SRGM.GLOBALS.Camarero.getMenu());
	}

	if(SRGM.GLOBALS.Salon && SRGM.GLOBALS.Salon.getMenu ){
		this.lista.append(SRGM.GLOBALS.Salon.getMenu());
	}
	
	this.html.on("swipeLeft",function(){
		menu.hide();
	});

		menu.cargaImagenes.on("tap",function(){
			
			if (SRGM.GLOBALS.DB.configuration.Fotos == "True"){
				menu.cargaImagenes.empty().append("<span class='LineText'> Usar Imagenes: </span><input type='checkbox'  id='images_config' ></input ><span style='font-size:10px;'>Descargar datos de nuevo</span>");
				SRGM.GLOBALS.DB.configuration.Fotos = "False";
				SRGM.GLOBALS.DB.setConfiguration("False","Fotos");
			}else{
				menu.cargaImagenes.empty().append("<span class='LineText'> Usar Imagenes: </span><input type='checkbox'  id='images_config' checked></input><span style='font-size:10px;'>Descargar datos de nuevo</span>");
				SRGM.GLOBALS.DB.configuration.Fotos = "True";
				SRGM.GLOBALS.DB.setConfiguration("True","Fotos");
			}
			
		});

		menu.vibrarcheck.on("tap",function(){
			
			if (SRGM.GLOBALS.DB.configuration.Vibrar == "True"){
				menu.vibrarcheck.empty().append("<span class='LineText'> Vibrar al pulsar: </span><input  type='checkbox'  id='vibrar_config' ></input ><span style='font-size:10px;'></span>");
				SRGM.GLOBALS.DB.configuration.Vibrar = "False";
				SRGM.GLOBALS.DB.setConfiguration("False","Vibrar");
			}else{
				menu.vibrarcheck.empty().append("<span class='LineText'> Vibrar al pulsar: </span><input  type='checkbox'  id='vibrar_config' checked></input><span style='font-size:10px;'></span>");
				SRGM.GLOBALS.DB.configuration.Vibrar = "True";
				SRGM.GLOBALS.DB.setConfiguration("True","Vibrar");
			}
			
		});
		menu.pedirComensalescheck.on("tap",function(){
			
			if (SRGM.GLOBALS.DB.configuration.PedirComensales == "True"){
				menu.pedirComensalescheck.empty().append("<span class='LineText'>Pedir comensales: </span><input  type='checkbox'  id='pedirComensales_config' ></input ><span style='font-size:10px;'></span>");
				SRGM.GLOBALS.DB.configuration.PedirComensales = "False";
				SRGM.GLOBALS.DB.setConfiguration("False","PedirComensales");
			}else{
				menu.pedirComensalescheck.empty().append("<span class='LineText'>Pedir comensales: </span><input  type='checkbox'  id='pedirComensales_config' checked></input><span style='font-size:10px;'></span>");
				SRGM.GLOBALS.DB.configuration.PedirComensales = "True";
				SRGM.GLOBALS.DB.setConfiguration("True","PedirComensales");
			}
			
		});

	this.refreshFunctionality = function(){
		$(menu.guardar).on('tap', function(e){
			var newIP = $("#ip_config").val();
			var newPort = $("#port_config").val();
			SRGM.GLOBALS.Conection.setConfig(newIP,newPort); 
		});
		$(menu.guardar).on('touchstart', function(e){
			   $(menu.guardar).addClass('tapped');
		});
	
		$(menu.guardar).on('tap', function(e){
			  alert("Configuración guardada");
			  $(menu.guardar).removeClass('tapped');
		});
	}



	this.getView = function(){
		return menu.html;
	}

	this.show = function(){
		menu.abierto = 1;
		menu.html.empty();
		menu.lista.empty();

		if(SRGM.GLOBALS.Camarero && SRGM.GLOBALS.Camarero.getMenu){
			menu.lista.append(SRGM.GLOBALS.Camarero.getMenu());
		}

		if(SRGM.GLOBALS.Salon.getMenu && SRGM.GLOBALS.Salon.getMenu ){
			menu.lista.append(SRGM.GLOBALS.Salon.getMenu());
		}
		var imageCheck = "";


		if (SRGM.GLOBALS.DB.configuration.Fotos == "True"){
			imageCheck = "checked";
		}
		menu.cargaImagenes.empty().append("<span class='LineText'> Usar Imagenes: </span><input  type='checkbox'  id='images_config' "+imageCheck+"></input>");
		var vibrateCheck = "";
		if (SRGM.GLOBALS.DB.configuration.Vibrar == "True"){
			vibrateCheck = "checked";
		}
		menu.vibrarcheck.empty().append("<span class='LineText'> Vibrar al pulsar: </span><input  type='checkbox'  id='vibrar_config' "+vibrateCheck+"></input>");
		

		
		menu.lista
		.append(menu.cargaImagenes)
		.append(menu.vibrarcheck)
		.append(menu.pedirComensalescheck)
		.append("<li><span class='LineText'> IP: </span><input  type='text' class='ipHolder textInput' id='ip_config' value='"+SRGM.GLOBALS.Conection.getIp()+"'></input><span class='LineText'>   Puerto: </span><input  type='text' class='portHolder textInput' id='port_config' value='"+SRGM.GLOBALS.Conection.getPuerto()+"'></input>")
		.append(menu.guardar);
		menu.html.append(menu.lista);
		$("#SCTI_container").addClass("menuSpace");
		$(menu.html).addClass("show");
		$("#menu").addClass("show");
		

	}


	this.hide = function(){
		menu.abierto =0;
		$("#SCTI_container").removeClass("menuSpace");
		$(menu.html).removeClass("show");
		$("#menu").removeClass("show");	
	}

}

SCTI.Menu_button = function(menu){
	var menu_button = this;
	this.id = SCTI.getID();
	this.menu = menu;

	this.html = $("<div class='menu_button topbutton' id='"+this.id+"'> <img class='menu_button_image' src='img/menu_icon.png'></img></div>");

	this.refreshFunctionality = function(){
	
		$(menu_button.html).on('tap', function(e){
			
			if(menu.abierto === 0){
 					menu_button.menu.show();
			}else{
					menu_button.menu.hide();	
			}
			 
		});

		$(menu_button.html).on('touchstart', function(e){
			   $(menu_button.html).addClass('tapped');
		});
	
		$(menu_button.html).on('tap', function(e){
			  $(menu_button.html).removeClass('tapped');
		});
	}

	this.getView = function(){
		return menu_button.html;
	}
}




SCTI.Body_view = function(elemento){
	var body_view = this;
	this.id = SCTI.getID();
	this.elemento = elemento;
	
	this.html = $("<div class='body_view' id='"+this.id+"'></div>");
	//	.append(this.elemento.view.getView());
	
	
	this.html.css("height", "100%").css("height", "-=40px");
	this.getView = function() {
		body_view.html.empty().append(body_view.elemento.view.getView());
		return body_view.html;
	}


	this.refreshFunctionality = function(){
		body_view.elemento.view.refreshFunctionality();
	}


}


SCTI.Foot_view = function(lista_elementos){
	var foot_view = this;
	this.id = SCTI.getID();
	
	this.lista_elementos = lista_elementos;
	this.html = $("<div class='foot_view' id='"+this.id+"'></div>");

	for (var i = 0; i< this.lista_elementos.length;i++){
		if (this.lista_elementos[i] != undefined){
			$(this.html).append(this.lista_elementos[i].getIconView());
		}
	}
		
	this.getView = function(){
		return foot_view.html;
	}

	this.refreshFunctionality = function(){
		for (var i = 0; i< foot_view.lista_elementos.length;i++){
			foot_view.lista_elementos[i].refreshFunctionalityIcon();
		}
	}

}

SCTI.Icon_Footview = function(element,iconPath){
	var icon_footview = this;
	this.id = SCTI.getID();
	this.element = element;
	this.html = $('<div id="'+this.id+'" class="icon_footview" ><img class="footIconImg" src="'+iconPath+'"></img></div>');

	this.getView = function () {
		return icon_footview.html;
	}

	this.refreshFunctionality = function(){
		$(icon_footview.html).on("tap", function(){
			icon_footview.element.onSelected();
		});
	}
}

SCTI.Swap_button = function(ruta){
	var swap_button = this;
	this.id = SCTI.getID();

	this.ruta = ruta;
	this.html = $("<div class='swap_button topbutton' id='"+this.id+"'> Back </div>");

	this.refreshFunctionality = function(){
		$(swap_button.html).on('tap', function(e){
			  //Go to back route;
		});

		$(swap_button.html).on('touchstart', function(e){
			   $(swap_button.html).addClass('tapped');
		});
	
		$(swap_button.html).on('tap', function(e){
			  $(swap_button.html).removeClass('tapped');
		});
	}

	this.getView = function(){
		if (swap_button.ruta = "null"){
			return "";
		}
		return swap_button.html;
	}

}


SCTI.Conexion_view = function(Conector){
	var conexion_view = this;
	this.id = SCTI.getID();
	this.waitLogo =		$("<img class='progresoImage'  		src='img/logoTemp2.png'>		</img>");
	this.progresStatus = $("<span class='progreso '> Sin conexion</span>");
	//this.desconectar = 	$("<img class='desconectImage'  	src='img/Desconectar.png'>	</img>");
	this.headIcon = new SCTI.HeadConexion(this);
	this.position = {};
	conexion_view.swipeAvaiable = false;
	this.html = $("<div class='conexion_view' id='"+this.id+"'> </div>")
			.append(this.waitLogo)
			//.append(this.desconectar)
			.append(this.progresStatus);
	
	
	this.waitLogo.on("longTap",function(){
		if(SRGM.GLOBALS.DB.configuration && SRGM.GLOBALS.DB.configuration.Vibrar == "True"){navigator.vibrate([50]);}
		SRGM.GLOBALS.Conection.stopConection();
		conexion_view.headIcon.Off();
	});
	

	this.html.on("swipeLeft",function(e){
		SRGM.GLOBALS.camareros.onSelected("");
	});

	this.display = function(valor){
		conexion_view.progresStatus.empty().append(valor);	
	}

	this.dataReady = function(){
		conexion_view.progresStatus.removeClass("activo");
		conexion_view.progresStatus.empty().append("Datos Listos");	
		conexion_view.headIcon.StandBy();
	}
	this.startConection = function(){
		conexion_view.progresStatus.addClass("activo");
		conexion_view.progresStatus.empty().append("Creando Conexión");	
		conexion_view.headIcon.Conecting();	
	}

	this.Sending = function(){
		conexion_view.progresStatus.addClass("activo");
		conexion_view.progresStatus.empty().append("Enviando datos");	
		conexion_view.headIcon.Sending();	
	}
	this.Recibiendo = function(){
		conexion_view.progresStatus.addClass("activo");
		conexion_view.progresStatus.empty().append("Recibiendo datos");	
		conexion_view.headIcon.Pulling();	
	}
	this.StandBy = function(){
		conexion_view.progresStatus.removeClass("activo");
		conexion_view.progresStatus.empty().append("Conectado");	
		conexion_view.headIcon.StandBy();
	}

	this.conexionError = function(){
		conexion_view.progresStatus.removeClass("activo");
		conexion_view.progresStatus.empty().append("Error Conexion");	
		conexion_view.headIcon.Off();
	}
	this.dataBaseError = function(){
		conexion_view.progresStatus.removeClass("activo");
		conexion_view.progresStatus.empty().append("Error DATABASE");	
		conexion_view.headIcon.Error();
	}

	this.dataBaseWorking = function(){
		conexion_view.progresStatus.addClass("activo");
		conexion_view.progresStatus.empty().append("Guardando Datos");	
		conexion_view.headIcon.StandBy();	
	}

	this.getView = function(){
		$(conexion_view.html).empty()
			.append(conexion_view.waitLogo)
			//.append(this.desconectar)
			.append(conexion_view.progresStatus);
	
		/*return conexion_view.html;*/
		return conexion_view.html;
	}
	this.getHead =function(){
		return conexion_view.headIcon.getView();
	}

	this.closeConection = function(){
		conexion_view.progresStatus.removeClass("activo");
		conexion_view.progresStatus.empty().append("Conexion cerrada");	
		conexion_view.headIcon.Off();
	}
	conexion_view.waitLogo.on("tap",function(e){
			if(SRGM.GLOBALS.DB.configuration && SRGM.GLOBALS.DB.configuration.Vibrar == "True"){navigator.vibrate([50]);}
			SRGM.GLOBALS.Conection.getDatabase();
			conexion_view.startConection();
			
		});

	this.refreshFunctionality = function(){

		
	}
}
SCTI.List_view = function(model){
	var list_view = this;

	this.id = SCTI.getID();
	this.html = $("<div class='List_view' id='"+this.id+"'> </div>");
	
	if (model.allowSwipe == false && isTablet()){
		
	}else{
		this.html.on("swipeRight",function(event){
			model.goBack();
			event.stopPropagation();
		});
		this.html.on("swipeLeft",function(event){
			model.goForward();
			event.stopPropagation();
		});
	}

	

	this.setContent = function(entityModels){
		$(list_view.html).empty();
		for (var i = 0 ; i < entityModels.length; i++){
		
			$(list_view.html).append(entityModels[i].getView());
			entityModels[i].refreshFunctionality();
		}
		if (model.inputNumerico){
			$(list_view.html).append(model.inputNumerico.getView());
		}
	}	
	this.getView = function(){
		$(list_view.html).empty();			
		return list_view.html;
	}

	this.refreshFunctionality = function(){	
	}
}


SCTI.Comanda_view = function(model){
	var view = this;
	this.id = SCTI.getID();
	this.html = $("<div class='List_view' id='"+this.id+"'> </div>");
	this.html.on("swipeRight",function(){
			model.goBack();
		});

	this.addContent = function(entityModels){
		$(view.html).empty();

		for (var i = 0 ; i < entityModels.length; i++){
			$(view.html).append(entityModels[i].getView());
			entityModels[i].refreshFunctionality();
		}
		if (model.inputNumerico){
			$(view.html).append(model.inputNumerico.getView());
		}
	}	
	this.getView = function(){
		$(view.html).empty();			
		return view.html;
	}

	this.refreshFunctionality = function(){	
	}
}




SCTI.Entity_View = function(model){
	var entity_View = this;
	this.id = SCTI.getID();
	this.html = $("<div class='entity_selector'></div>");
	this.refreshFunctionality = function(){
		$(entity_View.html).on('tap', function(e){
			
			if(SRGM.GLOBALS.DB.configuration.Vibrar == "True"){navigator.vibrate([50]);}
			model.select();		
		});
	}
	this.getView = function(){
		return entity_View.html;
	}
	this.marco = $("<img class='marco' src='img/IconoCuadrado.png'></img>");
	this.html.append(this.marco);

	this.html.on("touchstart",function(event){
		entity_View.marco.attr("src","img/IconoCuadradoTap.png");
	});
	this.html.on("touchend",function(event){
		entity_View.marco.attr("src","img/IconoCuadrado.png");
	});
}

SCTI.CamareroEntity_View = function(camarero){
	SCTI.Entity_View.call(this,camarero);
	var camareroEntity_View = this;
	if (camarero.Foto === null){
		this.html.append("<img class='entity_imagen' src='img/defaultCamarero.png'></img><span class='entity_texto'>"+camarero.Nombre+"</span>"); //= $("<div class='entity_selector'><img class='marco' src='img/IconoCuadrado.png'></img><img class='entity_imagen' src='img/defaultCamarero.png'></img><span class='entity_texto'>"+camarero.Nombre+"</span></div>");
	
	}else{
		this.html.append("<img class='entity_imagen' src='data:image/gif;base64,"+camarero.Foto+"'></img>");
		
	}
}

SCTI.SalonEntity_View = function(salon){
	SCTI.Entity_View.call(this,salon);
	var salonEntity_View = this;
	this.html = $("<div class='salon_selector'><!--img class='Salon_imagen' src='img/defaultSalon.png'></img--><span class='salon_texto'>"+salon.Nombre+"</span></div>");
	$(salonEntity_View.html).on('touchstart', function(e){
		   $(salonEntity_View.html).addClass('tapped');
	});

	$(salonEntity_View.html).on('tap', function(e){
		if(SRGM.GLOBALS.DB.configuration.Vibrar == "True"){navigator.vibrate([50]);}
		  $(salonEntity_View.html).removeClass('tapped');
	});

}


SCTI.MesaEntity_View = function(mesa){
	SCTI.Entity_View.call(this,mesa);
	var salonEntity_View = this;
	this.html = $("<div class='entity_selector'></div>");
	this.image  = $("<img class='mesa_imagen' src='img/MesaVerde.png'></img>");
	if (mesa.numComensales){
		this.image  = $("<img class='mesa_imagen' src='img/MesaRoja.png'></img>");
	}
	
	this.numero = $("<span class='mesa_numero'>"+mesa.Numero+"</span>");
	this.nComensales = $("<span class='mesa_comensales'>"+mesa.numComensales+"</span>");
	this.html.append(this.image).append(this.numero).append(this.nComensales);

	this.mesaOcupada = function(nComensales){
		salonEntity_View.image.attr("src",'img/MesaRoja.png');
		salonEntity_View.nComensales.empty().append(nComensales);
	}

	this.mesaLibre = function(){
		salonEntity_View.image.attr("src",'img/MesaVerde.png');
		salonEntity_View.nComensales.empty().append("0");
	}



}

SCTI.ArticuloEntity_View = function(articulo){
	SCTI.Entity_View.call(this,articulo);
	var articuloEntity_View = this;
	this.cantidad = $("<span class='articulo_cantidad'>"+(articulo.cantidad ? articulo.cantidad : 0)+"</span>");

	this.addCantidad = function(cant){
		articulo.cantidad += cant;
		articuloEntity_View.cantidad.empty().append(articulo.cantidad);
	}

	if (articulo.Foto === null){
		this.html
			.append("<img class='entity_imagen' src='img/cubierto.png'></img><span class='entity_texto'>"+articulo.Nombre+"</span>")
			.append(articuloEntity_View.cantidad);// = $("<div class='entity_selector'><img class='marco' src='img/IconoCuadrado.png'></img><img class='entity_imagen' src='img/cubierto.png'></img><span class='entity_texto'>"+articulo.Nombre+"</span></div>");
	
	}else{
		this.html
		.append("<img class='entity_imagen' src='data:image/gif;base64,"+articulo.Foto+"'></img>")
		.append(articuloEntity_View.cantidad); //this.html = $("<div class='entity_selector'><img class='marco' src='img/IconoCuadrado.png'></img><img class='entity_imagen' src='data:image/gif;base64,"+articulo.Foto+"'></img></div>");
	}
}

SCTI.FamiliaEntity_View = function(familia){
	SCTI.Entity_View.call(this,familia);
	var familiaEntity_View = this;
		if (familia.Foto === null){
		this.html.append("<img class='entity_imagen' src='img/cubierto.png'></img><span class='entity_texto'>"+familia.Concepto+"</span>");// = $("<div class='entity_selector'><img class='marco' src='img/IconoCuadrado.png'></img><img class='entity_imagen' src='img/cubierto.png'></img><span class='entity_texto'>"+articulo.Nombre+"</span></div>");
	
	}else{
		this.html.append("<img class='entity_imagen' src='data:image/gif;base64,"+familia.Foto+"'></img>"); //this.html = $("<div class='entity_selector'><img class='marco' src='img/IconoCuadrado.png'></img><img class='entity_imagen' src='data:image/gif;base64,"+articulo.Foto+"'></img></div>");
	}
	/*
	if (familia.Foto === null){
		this.html = $("<div class='entity_selector'><img class='marco' src='img/IconoCuadrado.png'></img><img class='entity_imagen' src='img/cubierto.png'></img><span class='entity_texto'>"+familia.Concepto+"</span></div>");
	}else{
		this.html = $("<div class='entity_selector'><img class='marco' src='img/IconoCuadrado.png'></img><img class='entity_imagen' src='data:image/gif;base64,"+familia.Foto+"'></img></div>");
		
	}*/
}

SCTI.SubfamiliaEntity_View = function(subfamilia){
	SCTI.Entity_View.call(this,subfamilia);
	var subfamiliaEntity_View = this;
		if (subfamilia.Foto === null){
		this.html.append("<img class='entity_imagen' src='img/cubierto.png'></img><span class='entity_texto'>"+subfamilia.Subfamilia+"</span>");// = $("<div class='entity_selector'><img class='marco' src='img/IconoCuadrado.png'></img><img class='entity_imagen' src='img/cubierto.png'></img><span class='entity_texto'>"+articulo.Nombre+"</span></div>");
	
	}else{
		this.html.append("<img class='entity_imagen' src='data:image/gif;base64,"+subfamilia.Foto+"'></img>"); //this.html = $("<div class='entity_selector'><img class='marco' src='img/IconoCuadrado.png'></img><img class='entity_imagen' src='data:image/gif;base64,"+articulo.Foto+"'></img></div>");
	}/*
	if (subfamilia.Foto === null){
		this.html = $("<div class='entity_selector'><img class='marco' src='img/IconoCuadrado.png'></img><img class='entity_imagen' src='img/cubierto.png'></img><span class='entity_texto'>"+subfamilia.Subfamilia+"</span></div>");
	}else{
		this.html = $("<div class='entity_selector'><img class='marco' src='img/IconoCuadrado.png'></img><img class='entity_imagen' src='data:image/gif;base64,"+subfamilia.Foto+"'></img></div>");
		
	}*/


}

SCTI.LineaComandaEntity_View = function(linea){
	SCTI.Entity_View.call(this,linea);
	var Entity_View = this;
	this.html = $("<div class=''></div>");
	this.linea= $("<div class='lineaComandaView'></div>");
	this.description = $("<span class='lineaComandaDescription'>"+linea.ArticuloName+"</span>");
	this.cantidadTotal = $("<span class='lineaComandaRight'>"+linea.CantidadTotal+"</span>");
	this.cantidadNueva = $("<span class='lineaComandaRight add'>"+linea.CantidadNueva+"</span>");
	this.precio = $("<span class='lineaComandaRightPrice'>"+(linea.Precio * linea.CantidadTotal).toFixed(2)+"€</span>");
	this.editorLinea = $("<div class='lineaComandaEdit'></div>");
	this.comentarioInput = $("<textarea rows='4'  type='textarea' class='comentario textInput' value=''>Proximamente</textarea>");
	this.addButton = $("<div class='buttonItem addItem'></div>");
	this.removeButton = $("<div class='buttonItem removeItem'></div>");
	this.deleteButton  = $("<div class='buttonItem deleteItem'></div>");


	if (linea.CantidadNueva > 0 ){
		this.linea.addClass("GreenLinea");
	}else if(linea.CantidadNueva < 0 ){
		this.linea.addClass("RedLinea");
	}


	this.linea
	.append(this.description)
	.append(this.cantidadNueva)
	.append(this.cantidadTotal)
	.append(this.precio);

	this.editorLinea
	.append(this.comentarioInput)
	.append(this.addButton)
	.append(this.removeButton)
	.append(this.deleteButton);

	this.addButton.on("tap", function(){
		if(SRGM.GLOBALS.DB.configuration.Vibrar == "True"){navigator.vibrate([50]);}
		linea.CantidadTotal += 1;
		linea.CantidadNueva += 1;

		Entity_View.cantidadTotal.empty().append(linea.CantidadTotal);		
		Entity_View.cantidadNueva.empty().append(linea.CantidadNueva);//SRGM.GLOBALS.comandas.refresh("WHERE  a.Mesa = "+SRGM.GLOBALS.SelectedComanda.Mesa+" and  a.Salon = "+SRGM.GLOBALS.SelectedComanda.Salon+" and a.Abierto = 1");
		Entity_View.precio.empty().append((linea.Precio * linea.CantidadTotal).toFixed(2)+"€");
		if (linea.CantidadNueva > 0 ){
			Entity_View.linea.removeClass("BlackLinea").removeClass("RedLinea").addClass("GreenLinea");
		}else if(linea.CantidadNueva < 0 ){
			Entity_View.linea.removeClass("BlackLinea").removeClass("GreenLinea").addClass("RedLinea");
		}else{
			Entity_View.linea.removeClass("BlackLinea").removeClass("RedLinea").removeClass("GreenLinea");
		}
		linea.addCant(1);
		SRGM.GLOBALS.comandas.refreshAdds();
	});

	this.removeButton.on("tap", function(){	
		if(SRGM.GLOBALS.DB.configuration.Vibrar == "True"){navigator.vibrate([50]);}
		linea.CantidadTotal -= 1;	
		linea.CantidadNueva -= 1;
		Entity_View.cantidadTotal.empty().append(linea.CantidadTotal);
		Entity_View.cantidadNueva.empty().append(linea.CantidadNueva);
		Entity_View.precio.empty().append((linea.Precio * linea.CantidadTotal).toFixed(2)+"€");
		if (linea.CantidadNueva > 0 ){
		    Entity_View.linea.removeClass("BlackLinea").removeClass("RedLinea").addClass("GreenLinea");
		}else if(linea.CantidadNueva < 0 ){
			Entity_View.linea.removeClass("BlackLinea").removeClass("GreenLinea").addClass("RedLinea");
		}else{
			Entity_View.linea.removeClass("BlackLinea").removeClass("RedLinea").removeClass("GreenLinea");
		}
	
		
		linea.addCant(-1);
		SRGM.GLOBALS.comandas.refreshAdds();
	});

	this.deleteButton.on("tap", function(){
		if(SRGM.GLOBALS.DB.configuration.Vibrar == "True"){navigator.vibrate([50]);}
		linea.addCant(-1*linea.CantidadTotal);
		
		
		linea.CantidadNueva -= linea.CantidadTotal;	
		linea.CantidadTotal = 0;	
		
		Entity_View.cantidadTotal.empty().append(linea.CantidadTotal);
		Entity_View.cantidadNueva.empty().append(linea.CantidadNueva);
		
		
		Entity_View.linea.removeClass("RedLinea").removeClass("GreenLinea").addClass("BlackLinea");;
		SRGM.GLOBALS.comandas.refreshAdds();
		
	});


	
	this.opened = false;

	this.linea.on("tap",function(){
		if(SRGM.GLOBALS.DB.configuration.Vibrar == "True"){navigator.vibrate([50]);}
	
		if (Entity_View.opened ){
			Entity_View.closeLinea();
		}else{
			Entity_View.openLinea();	
		}
	});
	this.closeLinea = function(){
			$(Entity_View.editorLinea).removeClass("show");
			Entity_View.opened = false;
	}
	this.openLinea = function(){
			$(".lineaComandaEdit").removeClass("show");
			$(Entity_View.editorLinea).addClass("show");
			Entity_View.opened = true;
	}

	this.html
	.append(this.linea)
	.append(this.editorLinea);

}

SCTI.ComandaEntity_View = function(comanda){
	SCTI.Entity_View.call(this,comanda);
	var Entity_View = this;
	this.html = $("<div class='ComandaView'></div>");
	this.description = $("<span class='ComandaDescription'>Salon:"+comanda.Salon+" ||</span>");
	this.cantidadTotal = $("<span class='ComandaDescription'> Mesa: "+comanda.Mesa+" ||</span>");
	this.cantidadNueva = $("<span class='ComandaDescription'> #Comensales: "+comanda.Comensales+"</span>");
	

	this.html
	.append(this.description)
	.append(this.cantidadTotal)
	.append(this.cantidadNueva);
}


SCTI.camareroMenu = function(camarero){
	var menu = this;
	this.html = $("<li class='menuLi'></li>");
	if (camarero.Foto === null){
		this.foto = $("<img class='menuFoto' src='img/defaultCamarero.png'></img>");
	}else{
	this.foto = $("<img class='menuFoto' src='data:image/gif;base64,"+camarero.Foto+"'></img>");
	}
	this.nombre = $("<span class='menutext'>"+camarero.Nombre+"</span>");

	this.html.append(this.foto).append(this.nombre);

	this.html.on("touchend",function(){
			
			SRGM.GLOBALS.Menu.hide();
			camarero.selectNew();
	});

	this.getView = function(){
		return menu.html;
	}
	
}

SCTI.salonMenu = function(salon){
	var menu = this;
	this.html = $("<li class='menuLi'></li>");
	this.foto = $("<span class='menutext' >Salon: </span>");
	this.nombre = $("<span class='menutext'>"+salon.Nombre+"</span>");

	this.html.append(this.foto).append(this.nombre);

	this.html.on("touchend",function(){
			SRGM.GLOBALS.Menu.hide();
			salon.selectNew();
	});

	this.getView = function(){
		return menu.html;
	}
}
SCTI.camareroHead = function(camarero){
	var menu = this;
	this.html = $("<div class='headElement'></div>");
	if (camarero.Foto !== null){
		this.foto = $("<img class='headFoto' src='data:image/gif;base64,"+camarero.Foto+"'></img>");
		
	}
	else{
		this.nombre = $("<span class='headtext'>"+camarero.Nombre+"</span>");
		
	}
	this.html.append(this.foto);	
	this.html.append(this.nombre);

	this.html.on("tap",function(){
			camarero.selectNew();
	});

	this.getView = function(){
		return menu.html;
	}
	
}

SCTI.salonHead = function(salon){
	var menu = this;
	this.html = $("<div class='headElement'></div>");		
	this.foto = $("<img class='headFotoSalon' src='img/HeadSalon2.png'></img>");
	this.nombre = $("<span class='headtextSalon'>"+salon.Nombre+"</span>");

	this.html.append(this.foto).append(this.nombre);

	this.html.on("tap",function(){
		
			salon.selectNew();
	});

	this.getView = function(){
		return menu.html;
	}
}
SCTI.mesaHead = function(mesa){
	var menu = this;

	this.html = $("<div class='headElement'></div>");
	this.foto = $("<img class='headFotoMesa' src='img/HeadMesa.png'></img>");
	this.nombre = $("<span class='headtextMesa'>"+mesa.Numero+"</span>");

	this.html.append(this.foto).append(this.nombre);

	this.getView = function(){
		return menu.html;
	}
}

SCTI.botoneraView = function(botoneraComandaModel){
	var botonera = this;

	this.html = $("<div class='ComandaBotonera'></div>");
	this.htmlBotonera = $("<div class='ComandaBotonera'></div>");
	this.Confirmar = $("<div class='botonComanda button'>Confirmar</div>");
	this.Preticket = $("<div class='botonComanda button'>Preticket</div>");
	this.Imprimir  = $("<div class='botonComanda button'>Imprimir</div>");
	this.Cancelar  = $("<div class='botonComanda button'>Cancelar</div>");
	this.Total = $();

	this.total= $("<div class='lineaComandaView'></div>");
	this.description = $("<span class='lineaComandaDescription'>Total</span>");


	this.cantidadTotal = $("<span class='lineaComandaRight'>"+(SRGM.GLOBALS.SelectedComanda.getCantidadTotal ? SRGM.GLOBALS.SelectedComanda.getCantidadTotal():0)+"</span>");
	this.cantidadNueva = $("<span class='lineaComandaRight add'>"+(SRGM.GLOBALS.SelectedComanda.getCantidadNueva ? SRGM.GLOBALS.SelectedComanda.getCantidadNueva():0)+"</span>");
	this.precio = $("<span class='lineaComandaRightPrice'>"+(SRGM.GLOBALS.SelectedComanda.getCosteTotal ? SRGM.GLOBALS.SelectedComanda.getCosteTotal().toFixed(2):0)+"€</span>");

	this.refresh = function(){
		this.cantidadTotal.empty().append((SRGM.GLOBALS.SelectedComanda.getCantidadTotal ? SRGM.GLOBALS.SelectedComanda.getCantidadTotal():0));
		this.cantidadNueva.empty().append((SRGM.GLOBALS.SelectedComanda.getCantidadNueva ? SRGM.GLOBALS.SelectedComanda.getCantidadNueva():0));
		this.precio.empty().append((SRGM.GLOBALS.SelectedComanda.getCosteTotal ? SRGM.GLOBALS.SelectedComanda.getCosteTotal().toFixed(2):0)+"€");
	}


	this.total
		.append(this.description)
		.append(this.cantidadNueva)
		.append(this.cantidadTotal)
		.append(this.precio);

	this.html
		.append(this.total)
		.append(this.htmlBotonera);

 
	this.htmlBotonera
	.append(this.Confirmar)
	//.append(this.Preticket)
	//.append(this.Imprimir )
	.append(this.Cancelar )
	.append("<div style='clear:both'></div>");



		$(botonera.htmlBotonera).children().on('touchstart', function(e){
		$(this).addClass('tapped');
		});
		$(botonera.htmlBotonera).children().on('tap', function(e){
			if(SRGM.GLOBALS.DB.configuration.Vibrar == "True"){navigator.vibrate([50]);}
			  $(this).removeClass('tapped');
		});
		botonera.Confirmar.on('tap',function(){
			if(SRGM.GLOBALS.DB.configuration.Vibrar == "True"){navigator.vibrate([50]);}
			botoneraComandaModel.Confirmar();
		});
		botonera.Preticket.on('tap',function(){
			if(SRGM.GLOBALS.DB.configuration.Vibrar == "True"){navigator.vibrate([50]);}
			botoneraComandaModel.Preticket();
		});
		botonera.Imprimir.on('tap',function(){
			if(SRGM.GLOBALS.DB.configuration.Vibrar == "True"){navigator.vibrate([50]);}
			botoneraComandaModel.Imprimir();
		});
		botonera.Cancelar.on('tap',function(){
			if(SRGM.GLOBALS.DB.configuration.Vibrar == "True"){navigator.vibrate([50]);}
			var r = confirm("¿Desea Cancelar la Comanda?");
			if (r == true) {
			    botoneraComandaModel.Cancelar();
			} else {
			   
			}
			
		});
	this.refreshFunctionality = function(){
		
		

	}


	this.getView = function(){
		
		return botonera.html;
	}

}
SCTI.HeadConexion = function(conexionView){
	var view = this;
	this.html = $("<div class='headElementRight'></div>");
	this.image = $("<img class='headImageConexion' src='img/Desconectar.png'></img>");
	
	this.html.append(this.image);

	this.getView = function(){
		return view.html;
	}
	this.html.on("tap",function(){
		SRGM.GLOBALS.Conection.onSelected();
	});

	this.StandBy = function(){
		view.image.attr("src","img/ConexionHeadOn.png");
	}
	this.Off = function(){
		view.image.attr("src","img/Desconectar.png");
	}
	this.Error = function(){
		view.image.attr("src","img/ConexionHeadError.png");
	}
	this.Conecting = function(){
		view.image.attr("src","img/ConexionConectando.png");
	}

	this.Sending = function(){
		view.image.attr("src","img/ConexionHeadEnviando.png");
	}

	this.Pulling = function(){
		view.image.attr("src","img/ConexionHeadRecibiendo.png");
	}
}

