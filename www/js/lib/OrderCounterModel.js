
OCM = {};

OCM.Player = function(container){
	var player = this;
	this.container = container;
	this.tokens = {};
	this.tokenHolders = {};
	this.tipoToken = ["regular","irregular","mando"];
	for (var i in this.tipoToken){
		this.tokens[this.tipoToken[i]] = [];
		this.tokenHolders[this.tipoToken[i]] = new OCM.Tokenholder(this.tokens[this.tipoToken[i]]);


		console.log("#"+player.container+" > .espacio");
		$("#"+player.container+" > .espacio").append(this.tokenHolders[this.tipoToken[i]].getView());

		$("#"+player.container+" > .tabs > #"+this.tipoToken[i]).on("tap",function(){
			console.log("bien");
			this.tokenHolders[this.tipoToken[i]].show();
		});

	}
	

	this.addToken = function(tipo){
		player.tokens[tipo].push(new OCM.Token(tipo));
	}

	this.removeToken = function(tipo){
		var tamanio = player.tokens[tipo].length;
		if ( tamanio > 0){
			player.tokens[tipo][tamanio-1].clear();
			player.tokens[tipo].splice(tamanio-1,1);
		}
	}


}

OCM.Tokenholder = function(Tokenlist){
	var holder = this;
	this.tokenList = Tokenlist;
	this.view = new OCV.TokenHolderView(this);

	this.show = function(){
		holder.view.show();
	}

	this.hide = function(){
		holder.view.hide();
	}

	this.setTokenlist =  function(Tokenlist){
		holder.tokenList = Tokenlist;
	}	

	this.getView = function(){
		return holder.view.getView();
	}


}


OCM.Token = function(tipo){
	var token = this;
	this.view = new OCV.Tokenview(tipo);
	


	this.clear = function(){
		token.view.clear();
	}

	this.getView = function(){
		return token.view.getView();
	}
}


OCM.Log = {
	hitoric : "",

	add : function(text){
		log.hitoric = log.hitoric.concat(text+ "\n");
		console.log(text+ "\n");}
		,
	display : function(){
		console.log(log.historic);
		return log.historic;
	}
}





OCM.Unit = function(params){
	var unit = this;
	this.params = params;
	this.name = params.name;
	this.img = params.img;
	this.view = new OCV.unitView(this);
	this.disabled = false;

	this.useOrder = function(tipo){
		OCM.log.add("Orden"+tipo+" -> " +unit.nombre);
	}

	this.toggleDisable = function(){
		if (!unit.disabled){
			unit.disabled = true;
			return "disabled";
		}else{
			unit.disabled = false;
			return "abled";
		}
	}
	this.getView = function(){
		return unit.view.getView();
	}
}

OCM.Group = function(params){
	var group = this;
	this.unitList = [];
	this.orders = {regular:0,irregular:0,impetuosa:0};

	this.view = new  OCV.groupView(this);

	this.calcularOrdenes = function(){
		group.orders = {regular:0,irregular:0,impetuosa:0};
		for (var i in group.unitList){
			group.orders.regular += 1; 
			//TODO comprobar el tipo de ordenes que genera cada unidad en lugar de considerarlas todas regulares
		}
	}
	this.selectUnit = function(){

		 GLOBALS.estado.home();
	}

	this.addUnit = function(params){
		group.unitList.push(new OCM.Unit(params));
		group.view.refresh();
		GLOBALS.estado.grupos();
	}

	this.getView = function(){
		return group.view.getView();
	}
}


OCM.Faction = function(params){
	var faction = this;
	this.name = params.name;
	this.unitList = params.unitList;
	this.id = params.id;
	this.img = params.img;
	this.view = new OCV.factionView(this);
	this.icon = $("<img class='factionIcon'src= 'img/"+faction.img+" '></img>");
	
	this.icon.on("tap",function(){
		GLOBALS.estado.grupos();
		$("#home").empty().append(faction.getView());
		
	});

	this.getView = function(){
		return faction.view.getView();
	}

	this.getIcon = function(){
		return faction.icon;
	}
}