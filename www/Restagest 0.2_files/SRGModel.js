SRGM = {Author: "Ignacio Medina Castillo", version:"0.1", name: "Solinsur RestaGest Model"};


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
SRGM.GLOBALS.SelectedComanda = "";


SRGM.setCamarero = function(camarero){
	//TODO añadir al menu superior;
	SRGM.GLOBALS.Camarero = camarero;
}

SRGM.setSalon = function(salon){
	SRGM.GLOBALS.Salon = salon;
}


SRGM.setComanda = function(comanda){
	console.log("comandaSET");
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
	this.entityList = [];
	this.iconView = new SCTI.Icon_Footview(this,TypeMap.footIcon);
	this.view = new SCTI.List_view(this);
	this.restriction = "WHERE 1=1";
	this.adds = [];
	if (TypeMap.viewAdds){
		for (var i = 0;i<TypeMap.viewAdds.length;i++){
			this.adds[i] = new TypeMap.viewAdds[i](this);
		}
	}
	
	

	
	this.getIconView = function(){
		return handler.iconView.getView();
	}
	this.refreshFunctionalityIcon = function(){
		handler.iconView.refreshFunctionality();
	}
	this.refresh = function(restriccion){
		handler.getEntitysFromDB(restriccion);	
		
						
		if (handler.inputNumerico)handler.inputNumerico.refreshFunctionality();
		//handler.iconView.refreshFunctionality();
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
					for (var t=0;t<handler.adds.length;t++){handler.entityList.push(handler.adds[t]);}
				},TypeMap,restriccion);
			}else{
				SRGM.GLOBALS.DB.getFatherplusChildrens(function(entityList){
					handler.entityList = [];		
					for (var i = 0;i<entityList.length;i++){
							handler.entityList.push(entityList[i]);
						}
					if (TypeMap.onLoadAction){TypeMap.onLoadAction(handler);}
					for (var t=0;t<handler.adds.length;t++){handler.entityList.push(handler.adds[t]);}
					handler.view.setContent(handler.entityList);

				},TypeMap,restriccion);	
			}
	}
	this.onSelected = function(restriccion){
		if (handler.configuration != false){
			console.log("cogiendo camarero de la configuracion");
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
		}
	}

	this.goBack = function(){
	
		SCTI.goBack(handler.container);
	}
	this.onLoadback = function(){


		if (handler.entityList.length === 0){
		handler.goBack(handler.container);}
	}

	if (TypeMap.inputNumerico === true){
		console.log("input numerico enabled");
		handler.inputNumerico = new SCTI.inputNumerico();

	}

}

SRGM.ChildrenHandler = function(parentContainer,container,typeMap){
	SRGM.Handler.call(this,container,typeMap); //herencia
	console.log("children handler creado");
	var handler = this;
	this.parentContainer = parentContainer;
	this.swap = typeMap.swapContainer ? typeMap.swapContainer : "";
	handler.swapDirection =  typeMap.swapDirection ? typeMap.swapDirection : "left";
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
		SCTI.swapContainers(handler.container,handler.swap,handler.swapDirection);						
		if (handler.inputNumerico)handler.inputNumerico.refreshFunctionality();
		//handler.iconView.refreshFunctionality();
	}
	this.goBack = function(){
		SCTI.goBack(handler.parentContainer);
	}
	this.goForward = function(){

		SCTI.swapContainers(handler.swap,handler.container,handler.swapDirection);
	}
}



SRGM.Camarero = function(params){
	var camarero = this;
	this.id = SRGM.getId();
	this.Codigo = params.Id;
	this.Nombre =  params.Nombre;
	this.Foto = params.Foto;
	this.menu = new SCTI.camareroMenu(this);

	this.view = new SCTI.CamareroEntity_View(this);

	this.getView = function(){
		return camarero.view.getView();
	}

	this.refreshFunctionality = function(){
		camarero.view.refreshFunctionality();

	}
	this.selectNew = function(){
		SRGM.GLOBALS.camareros.onSelected();
	}


	this.select = function(){
		SRGM.setCamarero(camarero);
		SRGM.GLOBALS.salones.onSelected();
		SRGM.GLOBALS.DB.setConfiguration(camarero.Codigo,"CamareroCode");
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

	this.view = new SCTI.SalonEntity_View(this);

	this.getView = function(){
		return salon.view.getView();
	}

	this.refreshFunctionality = function(){
		salon.view.refreshFunctionality();	
	}

	this.select = function(){
		SRGM.setSalon(salon);
		SRGM.GLOBALS.mesas.onSelected("WHERE  a.Salon = '"+salon.Numero+"'");
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


	this.view = new SCTI.MesaEntity_View(this);

	this.setComensales = function(numComensales){
		mesa.numComensales = numComensales;	
		mesa.view.mesaOcupada(numComensales);
		SRGM.GLOBALS.DB.createNewComanda(mesa.Numero,mesa.Salon,mesa.numComensales);
		SRGM.GLOBALS.comandas.onSelected("WHERE  a.Mesa = "+mesa.Numero+" and  a.Salon = "+mesa.Salon+" and a.Abierto = 1");
	}

	

	this.getView = function(){
		return mesa.view.getView();
	}

	this.refreshFunctionality = function(){
		mesa.view.refreshFunctionality();	
		
	}

	this.select = function(){
		if (mesa.numComensales === 0 ){
			mesa.abrirMesa();
			
		}else{
			SRGM.GLOBALS.comandas.onSelected("WHERE  a.Mesa = "+mesa.Numero+" and  a.Salon = "+mesa.Salon+" and a.Abierto = 1");
			
		}

	}

	this.cerrarMesa = function(){
		mesa.numComensales=0;
	}
	this.abrirMesa = function(){
		mesa.handler.inputNumerico.show(mesa.setComensales);
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
		SRGM.GLOBALS.subfamilias.onSelected("WHERE  a.Familia like '%"+familia.Concepto+"' ");
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
		SRGM.GLOBALS.articulos.onSelected("WHERE  a.Familia like '%"+subfamilia.Familia+"' and a.Subfamilia like '%"+subfamilia.Subfamilia+"' ");
	}
}
//Codigo ,Nombre,Familia,Subfamilia,PVP,PVP2,PVP3,Foto 
SRGM.Articulo = function(params){
	var articulo = this;
	this.id = SRGM.getId();
	this.Codigo = params.Id;
	this.Nombre =  params.Nombre;
	this.Familia = params.Familia;
	this.Subfamilia =  params.Subfamilia;
	this.PVP = params.PVP;
	this.PVP2 = params.PVP2;
	this.PVP3 = params.PVP3;
	this.Foto = params.Foto;

	this.view = new SCTI.ArticuloEntity_View(this);

	this.getView = function(){
		return articulo.view.getView();
	}

	this.refreshFunctionality = function(){
		articulo.view.refreshFunctionality();	
	}

	this.select = function(){
		console.log(SRGM.GLOBALS.SelectedComanda);

		SRGM.GLOBALS.DB.createNewLineaComanda(SRGM.GLOBALS.SelectedComanda.Id,articulo.Codigo,articulo.PVP);
		SRGM.GLOBALS.comandas.refresh("WHERE  a.Mesa = "+SRGM.GLOBALS.SelectedComanda.Mesa+" and  a.Salon = "+SRGM.GLOBALS.SelectedComanda.Salon+" and a.Abierto = 1");
		//Actualizar comanda
		//animaciones
	}
}

SRGM.LineaComanda = function(params){
	var linea = this;
	this.IdComanda = params.IdComanda;
	this.IdArticulo = params.IdArticulo;
	this.Precio =  params.Precio;
	this.Enviado = params.Enviado;
	this.Mesa = params.Mesa;
	this.Salon = params.Salon;
	this.Comensales = params.Comensales; 
	this.ArticuloName = params.Nombre;
	this.CantidadTotal = params.CantidadTotal;
	this.CantidadNueva  = params.CantidadNueva;


	this.view = new SCTI.LineaComandaEntity_View(this);

	this.getView = function(){
		return linea.view.getView();
	}

	this.refreshFunctionality = function(){
		linea.view.refreshFunctionality();	
	}

	this.select = function(){
		
		
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
	this.lineas = [];

	this.view = new SCTI.ComandaEntity_View(this);
	this.getView = function(){
		return comanda.view.getView();
	}

	this.refreshFunctionality = function(){
		comanda.view.refreshFunctionality();	
	}

	this.select = function(){
		
		SRGM.setComanda(comanda);
		SRGM.GLOBALS.familias.onSelected("");

	}


}


SRGM.BotoneraComanda = function(){
	var botonera = this;
	this.view = new SCTI.botoneraView();

	this.getView = function(){
		return botonera.view.getView();
	}
	this.refreshFunctionality = function(){
		botonera.view.refreshFunctionality();
	}

	this.Confirmar = function(){
		//TODO
	}
	this.Preticket = function(){
		//TODO
	}
	this.Imprimir = function(){
		//TODO
	}
	this.Cancelar  = function(){
		//TODO
	}
}