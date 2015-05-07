	
OCV = {};


OCV.Tokenview = function (tipo) {

	var token = this;
	this.view = $("<div class='token'></div>");
	this.tipo = tipo;
	this.image = $("<img src='img/"+tipo+".png'></img>");
	this.view.append(this.image);

	ths.getView = function(){
		return token.view;
	}

	this.hide = function(){

	}
	this.show = function(){

	}

	this.setRandomPosition = function(){

	}

	this.setDrag = function(container){

	}

	this.clear = function(){
		token.view.remove();
	}

}

OCV.TokenHolderView = function(model){
	var holderview = this;
	this.model = model;

	this.view = $("<div class = 'holdertoken'></div>");
	this.areaUsado = $("<div class = 'darken'></div>");
	this.view.append(this.areaUsado);

	this.fill = function(){
		holderview.view.empty();
		for (var i in holderview.model.tokenList){
			holderview.view.append(holderview.model.tokenList[i].getView());
		}
		holderview.view.append(holderview.areaUsado);
	}
	this.getView = function(){
		return holderview.view;
	}
}



OCV.unitView = function(model){
	var view = this;
	this.html = $("<div class = 'unitView'></div>");
	this.unitIcon = $("<img src='img/"+model.img+"' class='unitIcon'></img>");
	this.unitName = $("<div class='unitName' >"+model.name+"</div>");
	this.actionSpace= $("<div class= 'actionSpace'></div>");
	this.unitDisable = $("<div class='button'><div>");

	this.html
		.append(this.unitIcon)
		.append(this.unitName)
		.append(this.unitDisable)
		.append(this.actionSpace);

	this.unitDisable.on("tap",function(){
		if (model.toggleDisable() === "disabled"){
			view.html.addClass("disabled");
		}else{
			view.html.removeClass("disabled");
		}
	});

	this.getView = function(){
		return view.html;
	}

}
OCV.groupView = function(model){
	var view = this;
	this.html = $("<div class= 'groupView'><div>");
	this.addButton = $("<div class= 'buttonAdd'> + </div>");
	this.html.append(this.addButton);

	this.addButton.on("tap",function(){
		console.log("addunit");
		model.selectUnit();
	});

	this.refresh = function(){
		view.html.empty().append(view.addButton);
		for (var i in model.unitList){
			view.html.append(model.unitList[i].getView());
		}
	}
	

	this.getView = function(){
		return view.html;
	}


}

OCV.factionView = function(model){
	var view = this;
	this.html = $("<div class = 'factionUnitList'></div>");
	for (var i in model.unitList){
		var uSelector = new OCV.unitSelector(model.unitList[i]);
		this.html.append(uSelector.getView());
	}

	this.getView = function(){
		return view.html;
	}
}

OCV.unitSelector = function(params){
	var selector = this;
	this.html = $("<div class='unitSelector'></div>");
	this.icon = $("<img class='unitIconSelector' src='img/"+params.img+"' ></img>");
	this.text = params.name;
	this.html.append(this.icon);

	this.html.on("touchstart",function(){
		$("#log").empty().append(selector.text);
	});

	this.html.on("tap",function(){
		if(GLOBALS.current.group.addUnit){
			GLOBALS.current.group.addUnit(params);
			console.log("añadiendo unidad");
		}	
	});


	this.getView = function(){
		return selector.html;
	}
}

