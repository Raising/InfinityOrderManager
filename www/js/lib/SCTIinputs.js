SCTI.inputNumerico = function(){
	var input = this;
	this.html = $("<div class='inputForm'></div>");
	this.textField = $("<input type='number' class='inputTextNumeric'></input>");
	this.okButton = $("<div class='button okNumeric'>Aceptar</div>");

	this.botonera = [];
	this.callFun = null;



	for (var i = 1; i<= 16;i++){
			this.botonera.push($("<div class='button numeric'><img src='img/SquareAspectRatio.png'></img><span>"+i+"</span></div>"));	
			this.botonera[i-1].valor = i;
			this.html.append(this.botonera[i-1]);	
		}
	this.html.append(this.textField).append(this.okButton);
	this.getView = function(){
		return input.html;
		

	}

	this.hide = function(){
		input.html.removeClass("show");

	}
	this.show = function(callFun){
		input.callFun = callFun;
		input.html.addClass("show");

	}
	var inicialiced = false;
	this.refreshFunctionality = function(){
		if (!inicialiced){


			input.okButton.on("tap",function(){
				if(SRGM.GLOBALS.DB.configuration.Vibrar == "True"){navigator.vibrate([50]);}
			  	var nComensales = input.textField.val();
				input.callFun(nComensales); 
				console.log(nComensales);
				input.hide();
			});
			input.okButton.on("touchstart",function(){
				   $(this).addClass('tapped');
				
			});
		
			input.okButton.on('tap', function(){

				  $(this).removeClass('tapped');
			});


			for (var i = 0; i< 16;i++){	
				input.botonera[i].on("tap",function(){		
					if(SRGM.GLOBALS.DB.configuration.Vibrar == "True"){navigator.vibrate([50]);}
				  input.callFun($(this).children("span").html());			
					input.hide();
				});
				input.botonera[i].on('touchstart', function(){
				  $(this).addClass('tapped');

				});
			
				input.botonera[i].on('tap', function(){
				  $(this).removeClass('tapped');
				});
			}	
		inicialiced = true;
		}

	}



}