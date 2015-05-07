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
	console.log(idContainer);
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
	//this.menu = new SCTI.Menu(Params.menuType,SRGM_actual);
	//this.head = new SCTI.Head_view(Params.titulo,Params.backRoute,this.menu);
	this.body = new SCTI.Body_view(Params.elemento);
	//this.foot = new SCTI.Foot_view(Params.foot);//scti_foot;
	//considerar otro tipo de elementos como pantallas deslizantes o menu conextual, zona de avisos
	this.html = $("<div class='mobile_view' id='"+this.id+"'></div>");
	$(mobile_view.html).empty().append(mobile_view.body.getView());/*.append(mobile_view.head.getView()).append(mobile_view.menu.getView());//.append(mobile_view.foot.getView());
	*/
	$("#"+mobile_view.containerId).empty().append(mobile_view.html);
	
	//$("#foot").append(mobile_view.foot.getView());

	this.getView = function () {
		
		$(mobile_view.html).empty().append(mobile_view.head.getView()).append(mobile_view.body.getView());//.append(mobile_view.menu.getView());//.append(mobile_view.foot.getView());
		$("#"+mobile_view.containerId).empty().append(mobile_view.html);
		return mobile_view.html;
	}

	this.refreshFunctionality = function(){
		//mobile_view.head.refreshFunctionality();
		//mobile_view.menu.refreshFunctionality();
		mobile_view.body.refreshFunctionality();
		//mobile_view.foot.refreshFunctionality();

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
		return head_view.html;
	}

	this.refreshFunctionality = function(){
		head_view.menuButton.refreshFunctionality();
	}
	
}

SCTI.Menu = function(){
	var menu = this;
	this.id = SCTI.getID();

	this.html= $("<div id='"+this.id+"' class='menu_view'></div>"); 	
	this.lista = $("<ul class='listaMenu'></ul>");
	this.guardar = $("<li><div class='menubutton'>Guardar</div></li>");
	
	if(SRGM.GLOBALS.Camarero && SRGM.GLOBALS.Camarero.getMenu){
		this.lista.append(SRGM.GLOBALS.Camarero.getMenu());
	}

	if(SRGM.GLOBALS.Salon.getMenu && SRGM.GLOBALS.Salon.getMenu ){
		this.lista.append(SRGM.GLOBALS.Salon.getMenu());
	}
	


	this.lista
		  .append("<li><span class'LineText'> IP: </span><input type='text' class='ipHolder textInput' id='ip_config' value='"+SRGM.GLOBALS.Conection.getIp()+"'></input></li>")
		  .append("<li><span class'LineText'> Puerto: </span><input type='text' class='portHolder textInput' id='port_config' value='"+SRGM.GLOBALS.Conection.getPuerto()+"'></input></li>")
		  .append(this.guardar);
	this.html.append(this.lista);

	this.refreshFunctionality = function(){
		$(menu.guardar).on('tap', function(e){
			var newIP = $("#ip_config").val();
			var newPort = $("#port_config").val();
			SRGM_actual.GLOBALS.Conection.setConfig(newIP,newPort); 
		});
	}



	this.getView = function(){
		return menu.html;
	}

	this.show = function(){
		menu.html.empty();
		menu.lista.empty();
		if(SRGM.GLOBALS.Camarero && SRGM.GLOBALS.Camarero.getMenu){
		menu.lista.append(SRGM.GLOBALS.Camarero.getMenu());
		}

		if(SRGM.GLOBALS.Salon.getMenu && SRGM.GLOBALS.Salon.getMenu ){
			menu.lista.append(SRGM.GLOBALS.Salon.getMenu());
		}
		menu.lista
		.append("<li><span class'LineText'> IP: </span><input type='text' class='ipHolder textInput' id='ip_config' value='"+SRGM.GLOBALS.Conection.getIp()+"'></input></li>")
		.append("<li><span class'LineText'> Puerto: </span><input type='text' class='portHolder textInput' id='port_config' value='"+SRGM.GLOBALS.Conection.getPuerto()+"'></input></li>")
		.append(this.guardar);
		menu.html.append(menu.lista);
		$("#SCTI_container").addClass("menuSpace");
		$(menu.html).addClass("show");

	}


	this.hide = function(){
		$("#SCTI_container").removeClass("menuSpace");
		$(menu.html).removeClass("show");	
	}

}

SCTI.Menu_button = function(menu){
	var menu_button = this;
	this.id = SCTI.getID();
	this.menu = menu;
	this.abierto = 0;
	this.html = $("<div class='menu_button topbutton' id='"+this.id+"'> <img class='menu_button_image' src='img/menu_icon.png'></img></div>");

	this.refreshFunctionality = function(){
		console.log("funcionaliudad amaiado");
		$(menu_button.html).on('tap', function(e){
			
			if(menu_button.abierto == 0){
 					menu_button.menu.show();
 					menu_button.abierto=1;
			}else{
					menu_button.menu.hide();
					menu_button.abierto=0;
			}
			 
		});

		$(menu_button.html).on('touchstart', function(e){
			   $(menu_button.html).addClass('tapped');
		});
	
		$(menu_button.html).on('touchend', function(e){
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
	
		$(swap_button.html).on('touchend', function(e){
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
	this.waitLogo =$("<img class='progresoImage'  src='img/logoTemp.png'></img>");
	this.imageLogo =$("<img class='progresoImage2'  src='img/logoImage.png'></img>");
	this.progresStatus = $("<span class='progreso '> Sin conexion</span>");
	

	this.html = $("<div class='conexion_view' id='"+this.id+"'> </div>")
			.append(this.waitLogo)
			.append(this.progresStatus);
	
	this.html.on("swipeLeft",function(){
		SRGM.GLOBALS.camareros.onSelected("");
	});

	this.dataReady = function(){
		conexion_view.progresStatus.removeClass("activo");
		conexion_view.progresStatus.empty().append("Datos Listos");		
	}
	this.startConection = function(){
		conexion_view.progresStatus.addClass("activo");
		conexion_view.progresStatus.empty().append("Obteniendo Datos");	
	}
	this.conexionError = function(){
		conexion_view.progresStatus.removeClass("activo");
		conexion_view.progresStatus.empty().append("Error Conexion");	
	}

	this.dataBaseWorking = function(){
		conexion_view.progresStatus.addClass("activo");
		conexion_view.progresStatus.empty().append("Guardando Datos");		
	}

	this.getView = function(){
		$(conexion_view.html).empty()
			.append(conexion_view.waitLogo)
			.append(conexion_view.progresStatus);
	
		/*return conexion_view.html;*/
		return conexion_view.html;
	}

	this.closeConection = function(){
		conexion_view.progresStatus.removeClass("activo");
		conexion_view.progresStatus.empty().append("Conexion cerrada");	
	}

	this.refreshFunctionality = function(){
		conexion_view.waitLogo.on("tap",function(e){
			SRGM.GLOBALS.Conection.establecerConexion();
			console.log("tapenconexion");
			conexion_view.startConection();
		});
		
	}
}
SCTI.List_view = function(model){
	var list_view = this;

	this.id = SCTI.getID();
	this.html = $("<div class='List_view' id='"+this.id+"'> </div>");
	this.html.on("swipeRight",function(event){
			model.goBack();
			event.stopPropagation();
		});
	this.html.on("swipeLeft",function(event){
			model.goForward();
			event.stopPropagation();
		});
	this.setContent = function(entityModels){
		$(list_view.html).empty();
		for (var i = 0 ; i < entityModels.length; i++){
		//	console.log(entityModels[i].getView());
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
	this.html = "";
	this.refreshFunctionality = function(){
		$(entity_View.html).on('tap', function(e){
			model.select();		
		});
	}
	this.getView = function(){
		return entity_View.html;
	}
}

SCTI.CamareroEntity_View = function(camarero){
	SCTI.Entity_View.call(this,camarero);
	var camareroEntity_View = this;
	if (camarero.Foto === null){
		this.html = $("<div class='entity_selector'><img class='marco' src='img/IconoCuadrado.png'></img><img class='entity_imagen' src='img/defaultCamarero.png'></img><span class='camarero_texto'>"+camarero.Nombre+"</span></div>");
	
	}else{
		this.html = $("<div class='entity_selector'><img class='marco' src='img/IconoCuadrado.png'></img><img class='entity_imagen' src='data:image/gif;base64,"+camarero.Foto+"'></img><span class='camarero_texto'>"+camarero.Nombre+"</span></div>");
		
	}
}

SCTI.SalonEntity_View = function(salon){
	SCTI.Entity_View.call(this,salon);
	var salonEntity_View = this;
	this.html = $("<div class='salon_selector'><!--img class='Salon_imagen' src='img/defaultSalon.png'></img--><span class='salon_texto'>"+salon.Nombre+"</span></div>");
}


SCTI.MesaEntity_View = function(mesa){
	SCTI.Entity_View.call(this,mesa);
	var salonEntity_View = this;
	this.html = $("<div class='entity_selector'></div>");
	this.image  = $("<img class='mesa_imagen' src='img/MesaVerde.gif'></img>");
	if (mesa.numComensales){
		this.image  = $("<img class='mesa_imagen' src='img/MesaRoja.gif'></img>");
	}
	
	this.numero = $("<span class='mesa_numero'>"+mesa.Numero+"</span>");
	this.nComensales = $("<span class='mesa_comensales'>"+mesa.numComensales+"</span>");
	this.html.append(this.image).append(this.numero).append(this.nComensales);

	this.mesaOcupada = function(nComensales){
		salonEntity_View.image.attr("src",'img/MesaRoja.gif');
		salonEntity_View.nComensales.empty().append(nComensales);
	}

	this.mesaLibre = function(){
		salonEntity_View.image.attr("src",'img/MesaVerde.gif');
		salonEntity_View.nComensales.empty().append("0");
	}



}

SCTI.ArticuloEntity_View = function(articulo){
	SCTI.Entity_View.call(this,articulo);
	var articuloEntity_View = this;
	if (articulo.Foto === null){
		this.html = $("<div class='entity_selector'><img class='marco' src='img/IconoCuadrado.png'></img><img class='entity_imagen' src='img/defaultCamarero.png'></img><span class='camarero_texto'>"+articulo.Nombre+"</span></div>");
	
	}else{
		this.html = $("<div class='entity_selector'><img class='marco' src='img/IconoCuadrado.png'></img><img class='entity_imagen' src='data:image/gif;base64,"+articulo.Foto+"'></img><span class='camarero_texto'>"+articulo.Nombre+"</span></div>");
		
	}
}

SCTI.FamiliaEntity_View = function(familia){
	SCTI.Entity_View.call(this,familia);
	var familiaEntity_View = this;
	if (familia.Foto === null){
		this.html = $("<div class='entity_selector'><img class='marco' src='img/IconoCuadrado.png'></img><img class='entity_imagen' src='img/defaultCamarero.png'></img></div>");
	}else{
		this.html = $("<div class='entity_selector'><img class='marco' src='img/IconoCuadrado.png'></img><img class='entity_imagen' src='data:image/gif;base64,"+familia.Foto+"'></img></div>");
		
	}
}

SCTI.SubfamiliaEntity_View = function(subfamilia){
	SCTI.Entity_View.call(this,subfamilia);
	var subfamiliaEntity_View = this;
	if (subfamilia.Foto === null){
		this.html = $("<div class='entity_selector'><img class='marco' src='img/IconoCuadrado.png'></img><img class='entity_imagen' src='img/defaultCamarero.png'></img></div>");
	}else{
		this.html = $("<div class='entity_selector'><img class='marco' src='img/IconoCuadrado.png'></img><img class='entity_imagen' src='data:image/gif;base64,"+subfamilia.Foto+"'></img></div>");
		
	}


}

SCTI.LineaComandaEntity_View = function(linea){
	SCTI.Entity_View.call(this,linea);
	var Entity_View = this;
	this.html = $("<div class='lineaComandaView'></div>");
	this.description = $("<span class='lineaComandaDescription'>"+linea.ArticuloName+"</span>");
	this.cantidadTotal = $("<span class='lineaComandaRight'>"+linea.CantidadTotal+"</span>");
	this.cantidadNueva = $("<span class='lineaComandaRight add'>"+linea.CantidadNueva+"</span>");
	this.precio = $("<span class='lineaComandaRightPrice'>"+(linea.Precio * linea.CantidadTotal).toFixed(2)+"€</span>");
	
	this.html
	.append(this.description)
	.append(this.cantidadNueva)
	.append(this.cantidadTotal)
	.append(this.precio);
	
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
	this.foto = $("<img class='menuFoto' src='data:image/gif;base64,"+camarero.Foto+"'></img>");
	this.nombre = $("<span class='menutext'>"+camarero.Nombre+"</span>");

	this.html.append(this.foto).append(this.nombre);

	this.getView = function(){
		return this.html;
	}
	this.refreshFunctionality = function (argument) {
		menu.html.on("tap",function(){
			console.log("tap en camarero");
			SRGM.GLOBALS.Menu.hide();
			camarero.selectNew();
		});
	}
}

SCTI.botoneraView = function(botoneraComandaModel){
	var botonera = this;
	this.html = $("<div class='ComandaBotonera'></div>");

	this.Confirmar = $("<div class='botonComanda button'>Confirmar</div>");
	this.Preticket = $("<div class='botonComanda button'>Preticket</div>");
	this.Imprimir  = $("<div class='botonComanda button'>Imprimir</div>");
	this.Cancelar  = $("<div class='botonComanda button'>Cancelar</div>");

	this.html
	.append(this.Confirmar)
	.append(this.Preticket)
	.append(this.Imprimir )
	.append(this.Cancelar )
	.append("<div style='clear:both'></div>");

	this.refreshFunctionality = function(){

	}


	this.getView = function(){
		console.log("botonnera obtenida");
		return botonera.html;
	}

}