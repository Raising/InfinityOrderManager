SRGM = {Author: "Ignacio Medina Castillo", version:"1.2", name: "Solinsur RestaGest Model"};


SRGM.id_counter = 0;
SRGM.getId = function(){
	var newID = SRGM.id_counter +1;
	SRGM.id_counter += 1;
	return newID;
}


SRGM.GLOBALS = {uso : "contener variables de acceso global, tales como"+ 
						"el camarero/usuario"+
						"la mesa en la que está anotando"+
						"el pedido al que se está haciendo referencia"+
						"La base de datos"+
						"la conexion"};
SRGM.GLOBALS.DB;

SRGM.GLOBALS.Conection;
SRGM.GLOBALS.Vistas = {};
SRGM.GLOBALS.Camarero = "";
SRGM.GLOBALS.Salon = "";
SRGM.GLOBALS.Mesa = "";

SRGM.GLOBALS.SelectedComanda = "";


SRGM.setCamarero = function(camarero){
	//TODO añadir al menu superior;
	SRGM.GLOBALS.Camarero = camarero;
	SRGM.GLOBALS.Head_view.actualize();
}

SRGM.setSalon = function(salon){
	SRGM.GLOBALS.Salon = salon;
	SRGM.GLOBALS.Head_view.actualize();
}

SRGM.setMesa = function(mesa){
	SRGM.GLOBALS.Mesa = mesa;
	SRGM.GLOBALS.Head_view.actualize();
}

SRGM.setComanda = function(comanda){
	SRGM.GLOBALS.SelectedComanda = comanda;
}

SRGM.ListableItem = function(){

	var listableItem = this;
	this.id = SRGM.getId();

	this.item_view = new SCTI.Item_view(this);

	this.onTouch = function(){
		// Implementar com si fuese un interface
	}

	this.onHold = function(){
		// Implementar com si fuese un interface
	}	
}


SRGM.Handler = function(container,TypeMap){
	var handler = this;
	this.id = SRGM.getId();
	TypeMap.handler = this;
	this.container = container;
	$("#"+this.container).data("omit","false");
	this.forward = TypeMap.forwardEnable ? TypeMap.forwardEnable : false;
	this.configuration = TypeMap.configuration ? TypeMap.configuration : false;
	this.allowSwipe = TypeMap.allowSwipe ? TypeMap.allowSwipe : true;
	this.forwardUncontroled = TypeMap.forwardUncontroled ? TypeMap.forwardUncontroled : false;
	this.entityList = [];
	//this.iconView = new SCTI.Icon_Footview(this,TypeMap.footIcon);
	this.view = new SCTI.List_view(this);
	//this.inputNumerico = TypeMap.inputNumerico ? TypeMap.inputNumerico : false;
	this.restriction = "WHERE 1=1";
	this.adds = [];
	if (TypeMap.viewAdds){
		for (var i = 0;i<TypeMap.viewAdds.length;i++){
			this.adds[i] = new TypeMap.viewAdds[i](this);
		}
	}
	
	

	
	/*this.getIconView = function(){
		return handler.iconView.getView();
	}*/
	this.refreshFunctionalityIcon = function(){
		handler.iconView.refreshFunctionality();
	}
	this.refresh = function(restriccion){
		if (TypeMap.inputNumerico === true){
			handler.inputNumerico = new SCTI.inputNumerico();
		}
		if (TypeMap.onRefresh){
			TypeMap.onRefresh();
		}
		handler.getEntitysFromDB(restriccion);

		
						
		if (handler.inputNumerico)handler.inputNumerico.refreshFunctionality();
		//handler.iconView.refreshFunctionality();
	}
	this.refreshAdds = function(){
		for (var t=0;t<handler.adds.length;t++){handler.adds[t].refresh();}
	}


	this.getEntitysFromDB = function(restriccion){
		handler.restriction = restriccion;
			if (TypeMap.isFather !== true){
				SRGM.GLOBALS.DB.getEntityList(function(entityList){
					handler.entityList = [];	
					for (var i = 0;i<entityList.length;i++){
							handler.entityList.push(entityList[i]);
						}	
					if (TypeMap.onLoadAction){TypeMap.onLoadAction(handler);}		
					handler.view.setContent(handler.entityList);
					for (var t=0;t<handler.adds.length;t++){handler.entityList.push(handler.adds[t]);handler.adds[t].refresh();}
				},TypeMap,restriccion);
			}else{
				SRGM.GLOBALS.DB.getFatherplusChildrens(function(entityList){
					handler.entityList = [];		
					for (var i = 0;i<entityList.length;i++){
							handler.entityList.push(entityList[i]);
						}
					if (TypeMap.onLoadAction){TypeMap.onLoadAction(handler);}
					for (var t=0;t<handler.adds.length;t++){handler.entityList.push(handler.adds[t]);handler.adds[t].refresh();}
					handler.view.setContent(handler.entityList);

				},TypeMap,restriccion);	
			}
	}
	this.onSelected = function(restriccion){
		if (handler.configuration != false){
			
			SRGM.GLOBALS.DB.GetEntityFromConfiguration(function(entity){
				
				if(entity != null){
					entity.select();
				}else{
					SCTI.gotoView(handler.gotoView());
					handler.refresh(restriccion);
				}
				
			},TypeMap,handler.configuration);
			handler.refresh(restriccion);
		}else{

			SCTI.gotoView(handler.gotoView());
			handler.refresh(restriccion);
		}

		
	}

	this.gotoView = function(){
		return handler.container;
	}
	this.goForward = function(){
		if (handler.forward){
			handler.entityList[0].select();
		}else if (handler.forwardUncontroled){
			handler.forwardUncontroled();
		}
	}

	this.goBack = function(){
		var preventDefault = true;
		if (TypeMap.onBack){
			var salida = TypeMap.onBack();
			preventDefault = salida ? salida : true;
		}
		if(preventDefault){
			SCTI.goBack(handler.container);
		}
		
	}
	this.onLoadback = function(){

		if (handler.entityList.length === 0){
			handler.goBack(handler.container);
		}
		
		if (TypeMap.inputNumerico === true){		
			handler.inputNumerico = new SCTI.inputNumerico();
		}
	}
}

SRGM.ChildrenHandler = function(parentContainer,container,TypeMap){
	SRGM.Handler.call(this,container,TypeMap); //herencia
	var handler = this;
	this.parentContainer = parentContainer;
	this.swap = TypeMap.swapContainer ? TypeMap.swapContainer : "";
	handler.swapDirection =  TypeMap.swapDirection ? TypeMap.swapDirection : "left";
	this.gotoView = function(){
		return handler.parentContainer;
	}
	this.onSelected = function(restriccion){
		
			SCTI.gotoView(handler.gotoView());
			if (handler.swap !== ""){
				SCTI.swapContainers(handler.container,handler.swap,handler.swapDirection);
			}
			//SCTI.gotoView(container);
			handler.refresh(restriccion);
		
		
	}
	this.refresh = function(restriccion){
		handler.getEntitysFromDB(restriccion);	
	}
	this.goBack = function(){
		var preventDefault = true;
		if (TypeMap.onBack){
			var salida = TypeMap.onBack();
			preventDefault = salida ? salida : true;
		}
		if(preventDefault){
			SCTI.goBack(handler.parentContainer);
		}
	}
	this.goForward = function(){

		//SCTI.swapContainers(handler.swap,handler.container,handler.swapDirection);
	}
}



SRGM.Camarero = function(params){
	var camarero = this;
	
	this.id = SRGM.getId();
	this.Codigo = params.Id;
	this.Nombre =  params.Nombre;
	this.Foto = params.Foto;
	this.menu = new SCTI.camareroMenu(this);
	this.head = new SCTI.camareroHead(this);
	this.view = new SCTI.CamareroEntity_View(this);

	this.getView = function(){
		return camarero.view.getView();
	}

	this.refreshFunctionality = function(){
		camarero.view.refreshFunctionality();

	}
	this.selectNew = function(){
		SRGM.GLOBALS.DB.setConfiguration(-1,"CamareroCode");
		SRGM.GLOBALS.camareros.onSelected();
	}


	this.select = function(){
		SRGM.setCamarero(camarero);
		SRGM.GLOBALS.salones.onSelected();
		
		SRGM.GLOBALS.DB.setConfiguration(camarero.Codigo,"CamareroCode");
	}
	this.getHead = function(){
		return camarero.head.getView();
	}

	this.getMenu = function(){
		return camarero.menu.getView();
	}
}
//Numero Nombre,Nmesas,TarifaDef,HoraIni ,HoraFin ,HoraIni2 ,HoraFin2 ,HoraIni3 ,HoraFin3 
SRGM.Salon = function(params){
	var salon = this;
	this.id = SRGM.getId();
	this.Numero = params.Id;
	this.Nombre =  params.Nombre;
	this.Nmesas = params.Nmesas;

	this.TarifaDef =params.TarifaDef;
	this.HoraIni =params.HoraIni;
	this.HoraFin =params.HoraFin;
	this.HoraIni2 =params.HoraIni2;
	this.HoraFin2 =params.HoraFin2;
	this.HoraIni3 =params.HoraIni3;
	this.HoraFin3 =params.HoraFin3;
	this.menu = new SCTI.salonMenu(this);
	this.head = new SCTI.salonHead(this);
	this.view = new SCTI.SalonEntity_View(this);

	this.getView = function(){
		return salon.view.getView();
	}
	this.selectNew = function(){
		SRGM.GLOBALS.DB.setConfiguration(-1,"SalonCode");
		SRGM.GLOBALS.salones.onSelected();
	}

	this.refreshFunctionality = function(){
		salon.view.refreshFunctionality();	
	}

	this.select = function(){
		SRGM.setSalon(salon);
		SRGM.GLOBALS.Conection.getSalonStatus(salon.Numero);
		SRGM.GLOBALS.mesas.onSelected("WHERE  a.Salon = '"+salon.Numero+"'");

		SRGM.GLOBALS.DB.setConfiguration(salon.Numero,"SalonCode");
	}
	this.getHead = function(){
		return salon.head.getView();
	}
	this.getMenu = function(){
		return salon.menu.getView();
	}
}
//Salon,Mesa,CodVenta 
SRGM.Mesa = function(params){
	var mesa = this;

	this.id = SRGM.getId();
	this.Salon = params.Salon;
	this.Numero =  params.Mesa;
	this.CodVenta = params.CodVenta;
	this.handler = params.handler;
	
	this.numComensales = params.Comensales ? params.Comensales : 0 ;

	this.head = new SCTI.mesaHead(this);
	this.view = new SCTI.MesaEntity_View(this);

	this.setComensales = function(numComensales){
		mesa.numComensales = numComensales;	
		mesa.view.mesaOcupada(numComensales);
		SRGM.setMesa(mesa);
		SRGM.GLOBALS.DB.createNewComanda(mesa.Numero,mesa.Salon,mesa.numComensales);
		SRGM.GLOBALS.comandas.onSelected("WHERE  a.Mesa = "+mesa.Numero+" and  a.Salon = "+mesa.Salon+" and a.Abierto = 1");
	}

	

	this.getView = function(){
		return mesa.view.getView();
	}

	this.refreshFunctionality = function(){
		mesa.view.refreshFunctionality();	
		
	}
	this.getHead = function(){
		return mesa.head.getView();
	}

	this.select = function(){
		SRGM.setMesa(mesa);
		 SRGM.GLOBALS.articulos.refresh(" where 1=2");
		if (mesa.numComensales === 0 ){
			mesa.abrirMesa();
			
		}else{
			SRGM.GLOBALS.Conection.getComandaStatus(mesa.Salon,mesa.Numero);
			SRGM.GLOBALS.comandas.onSelected("WHERE  a.Mesa = "+mesa.Numero+" and  a.Salon = "+mesa.Salon+" and a.Abierto = 1");
			
		}

	}

	this.cerrarMesa = function(){
		mesa.numComensales=0;
	}
	this.abrirMesa = function(){
		if (SRGM.GLOBALS.DB.configuration.PedirComensales  == "True"){
			mesa.handler.inputNumerico.show(mesa.setComensales);	
		}
		else{
			mesa.setComensales(2);
		}
	}
}
//Concepto unique,Barra,Salones, Foto BINARY
SRGM.Familia = function(params){
	var familia = this;
	this.id = SRGM.getId();
	this.Concepto = params.Concepto;
	this.Barra =  params.Barra;
	this.Salones = params.Salones;
	this.Foto = params.Foto;

	this.view = new SCTI.FamiliaEntity_View(this);

	this.getView = function(){
		return familia.view.getView();
	}

	this.refreshFunctionality = function(){
		familia.view.refreshFunctionality();	
	}

	this.select = function(){
		SRGM.GLOBALS.subfamilias.onSelected("WHERE  a.Familia like '%"+familia.Concepto+"' ORDER BY a.Orden, a.Subfamilia ");
	}
}
//Familia,Subfamilia , Foto 
SRGM.Subfamilia = function(params){
	var subfamilia = this;
	this.id = SRGM.getId();
	this.Familia = params.Familia;
	this.Subfamilia =  params.Subfamilia;
	this.Foto = params.Foto;

	this.view = new SCTI.SubfamiliaEntity_View(this);

	this.getView = function(){
		return subfamilia.view.getView();
	}

	this.refreshFunctionality = function(){
		subfamilia.view.refreshFunctionality();	
	}

	this.select = function(){
		SRGM.GLOBALS.articulos.onSelected("WHERE  a.Familia like '%"+subfamilia.Familia+"' and a.Subfamilia like '%"+subfamilia.Subfamilia+"' ORDER BY Vendido DESC");
	}
}
//Codigo ,Nombre,Familia,Subfamilia,PVP,PVP2,PVP3,Foto 
SRGM.Articulo = function(params){
	var articulo = this;
	this.id = SRGM.getId();
	this.Codigo = params.Codigo;
	this.Nombre =  params.Nombre;
	this.Familia = params.Familia;
	this.Subfamilia =  params.Subfamilia;
	this.PVP = params.PVP;
	this.PVP2 = params.PVP2;
	this.PVP3 = params.PVP3;
	this.Foto = params.Foto;
	this.cantidad = 0;

	var cantLineas = SRGM.GLOBALS.SelectedComanda.lineas.length;
	for (var i = 0; i < cantLineas; i++){
		if (SRGM.GLOBALS.SelectedComanda.lineas[i].IdArticulo === articulo.Codigo){
			articulo.cantidad += SRGM.GLOBALS.SelectedComanda.lineas[i].CantidadNueva;
		}
	}

	this.view = new SCTI.ArticuloEntity_View(this);


	this.getView = function(){
		return articulo.view.getView();
	}

	this.refreshFunctionality = function(){
		articulo.view.refreshFunctionality();	
	}

	this.select = function(){
		articulo.view.addCantidad(1);
		
		SRGM.GLOBALS.DB.createNewLineaComanda(SRGM.GLOBALS.SelectedComanda.Id,articulo.Codigo,articulo.PVP);

		SRGM.GLOBALS.SelectedComanda.actualize += 1;
		var parametrofinal = SRGM.GLOBALS.SelectedComanda.actualize;
		
		setTimeout(function() {
			if (SRGM.GLOBALS.SelectedComanda.actualize == parametrofinal){	
				SRGM.GLOBALS.comandas.refresh("WHERE  a.Mesa = "+SRGM.GLOBALS.SelectedComanda.Mesa+" and  a.Salon = "+SRGM.GLOBALS.SelectedComanda.Salon+" and a.Abierto = 1");
			}
			SRGM.GLOBALS.comandas.actualize = false;
		},500);

		//animaciones
	}
}

SRGM.LineaComanda = function(params){
	var linea = this;
	
	
	this.IdComanda = params.IdComanda;
	this.IdArticulo = params.IdArticulo;
	this.FamiliaArticulo = params.Familia;
	this.Precio =  params.Precio;
	this.Enviado = params.Enviado;
	this.Mesa = params.Mesa;
	this.Salon = params.Salon;
	this.Comensales = params.Comensales; 
	this.ArticuloName = params.Nombre;
	this.Familia = params.Familia;
	this.CantidadTotal = params.CantidadTotal;
	this.CantidadNueva  = params.CantidadNueva;
	this.lineaCentral = params.IdLineaCentral;
	this.comandaCentral = params.IdComandaCentral;


	this.view = new SCTI.LineaComandaEntity_View(this);

	this.getView = function(){
		if (linea.CantidadTotal==0){
			return "";
		}else{
		return linea.view.getView();
		}	
	}

	this.refreshFunctionality = function(){
		linea.view.refreshFunctionality();	
	}

	this.select = function(){
		
		
	}

	this.addCant = function(cantidad){	
		SRGM.GLOBALS.DB.createNewLineaComanda(linea.IdComanda,linea.IdArticulo,linea.Precio,cantidad);
	}
	this.setLineaCant = function(cant){
		SRGM.GLOBALS.DB.setLineaComandaCant(linea.lineaCentral,cant);
	}

	this.toJSON = function(key){
		var salida = {};
		
		salida.IDcentralComanda = linea.comandaCentral ?  linea.comandaCentral  : 0;
		salida.IDcentral= linea.lineaCentral;
		salida.Precio = Math.round(linea.Precio * 100) / 100;
		salida.Importe = Math.round(linea.Precio * linea.CantidadTotal * 100) / 100;

		salida.Cantidad = linea.CantidadTotal;
		salida.IdArticulo = linea.IdArticulo;
		salida.Nombre = linea.ArticuloName;
		salida.FamiliaArticulo = linea.Familia;
		if (linea.CantidadNueva !== 0){
		salida.Cambiado = "true";	
		}else{
		salida.Cambiado = "false";		
		}
		return salida;
	}

}


SRGM.Comanda = function(params){

	var comanda = this;
	//Id unique,Mesa,Salon,Comensales,ImporteTotal DECIMAL(9,2),tiempoInicio TIMESTAMP,tiempoFinal TIMESTAMP, Abierto
	this.Id = params.Id;
	this.Mesa = params.Mesa;
	this.Salon = params.Salon;
	this.Comensales = params.Comensales;
	this.ImporteTotal = params.ImporteTotal;
	this.tiempoInicio = params.tiempoInicio;
	this.tiempoFinal = params.tiempoFinal;
	this.Abierto = params.Abierto;
	this.IdCentral = params.IdCentral;
	this.lineas = [];
	this.futureLineas = [];
	this.view = new SCTI.ComandaEntity_View(this);
	this.actualize = 0;
	
	this.getView = function(){
		return comanda.view.getView();
	}

	this.refreshFunctionality = function(){
		comanda.view.refreshFunctionality();	
	}

	this.addFutureLine = function(params){
		comanda.futureLineas.push(params);
		
	}
	

	this.getCantidadTotal = function(){
		var cantidadTotal = 0;
		for (var i = 0 ; i < comanda.lineas.length;i++){
			cantidadTotal += comanda.lineas[i].CantidadTotal;
		}
		return cantidadTotal;
	}
	this.getCantidadNueva = function(){
		var CantidadNueva = 0;
		for (var i = 0 ; i < comanda.lineas.length;i++){
			CantidadNueva += comanda.lineas[i].CantidadNueva;
		}
		return CantidadNueva;
		
	}
	this.getCosteTotal = function(){
		var coste = 0;
		for (var i = 0 ; i < comanda.lineas.length;i++){
			coste += comanda.lineas[i].CantidadTotal * comanda.lineas[i].Precio;
		}
		return coste;	
	}


	this.select = function(){
		SRGM.setComanda(comanda);
		SRGM.GLOBALS.familias.onSelected("");
	}
	this.getLineas = function(){
		SRGM.GLOBALS.DB.getEntityList(function(entityList){
			comanda.lineas = [];	
			for (var i = 0;i<entityList.length;i++){
					comanda.lineas.push(entityList[i]);
				}					
		},{consulta:"SELECT a.*,b.Nombre,sum(a.Cantidad) as CantidadTotal, sum(a.Cantidad) - sum(a.Enviado) as CantidadNueva  FROM (SELECT * from LINEASCOMANDAS t ORDER BY t.insertDate ) a LEFT JOIN ARTICULOS b on a.IdArticulo = b.Codigo  WHERE a.IdComanda = '"+comanda.Id+"' GROUP BY a.IdLineaCentral,a.IdArticulo ORDER BY a.insertDate DESC",model:SRGM.LineaComanda,handler:false},"");
		return comanda.lineas;
	}
	this.setChildren = function(lineas){
		comanda.lineas = lineas;
	}
	

	this.toJSON = function(key){

		cambioMitad = false ;
		var salida = {};
		lineasAux = [];
		salida.Id= comanda.Id;
		salida.Mesa = comanda.Mesa ;
		salida.Salon = comanda.Salon;
		salida.Comensales = comanda.Comensales;
		salida.Camarero = SRGM.GLOBALS.Camarero.Codigo;
		salida.IDcentralComanda = comanda.IdCentral;
		salida.CamareroNombre = SRGM.GLOBALS.Camarero.Nombre;
		salida.SalonNombre =  SRGM.GLOBALS.Salon.Nombre;
		salida.lineas = comanda.lineas;
	
		
	
		return salida;
		
		
	}


}


SRGM.BotoneraComanda = function(){
	var botonera = this;
	this.view = new SCTI.botoneraView(this);
	this.evitaDobleclick  = true;
	this.getView = function(){
		return botonera.view.getView();
	}
	this.refreshFunctionality = function(){
		botonera.view.refreshFunctionality();
	}

	this.Confirmar = function(){
		console.log("confirmando" + botonera.evitaDobleclick);
		if (botonera.evitaDobleclick == true){
			botonera.evitaDobleclick = false;
			console.log("confirmando" + botonera.evitaDobleclick);
			setTimeout(function() {botonera.evitaDobleclick = true;}, 2000);
			if (SRGM.GLOBALS.SelectedComanda != ""){
				SRGM.GLOBALS.Conection.sendComanda(SRGM.GLOBALS.SelectedComanda);
				SRGM.GLOBALS.mesas.onSelected("WHERE  a.Salon = '"+SRGM.GLOBALS.Salon.Numero+"'");
			}	
		}
		
		
	}
	this.Preticket = function(){
		console.log("preticket");
		//todo
	}
	this.Imprimir = function(){
		console.log("imprimir");
		//todo
	}
	this.Cancelar  = function(){
		if (botonera.evitaDobleclick == true){

			botonera.evitaDobleclick = false;
			setTimeout(function() {botonera.evitaDobleclick = true;}, 2000);
			SRGM.GLOBALS.DB.cancelComanda(SRGM.GLOBALS.SelectedComanda);
		}
	}

	this.refresh = function(){
		botonera.view.refresh();
	}
}