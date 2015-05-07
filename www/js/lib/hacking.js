panelLogos.js  > cargaInfoLogos







	 var extraccion ={};

	for (var index in FACCIONES){
		(function(sectorial){
				if (typeof FACCIONES[sectorial] === "number"){
					console.log("numero de la faccion",FACCIONES[sectorial]);
					 var cadena = "accion=cargaLogos&faccion="+FACCIONES[sectorial];
					 var rqt = new Request({
				    method: 'post', url: 'ajx.php',
				    onSuccess: function(texto, xmlrespuesta) {
				        if (texto.indexOf("ERROR") == -1) 
				        {
				         	
							extraccion[cadena.split("faccion=")[1]] = [];

							  var imagenes = texto.split("background-image: url(");
							  var nombres =  texto.split("class='isc'>");
							  if (imagenes.length == nombres.length){
							  	 for (var indice = 1 ; indice<imagenes.length; indice++){
							  	 	var unidad = {};
							  	 	unidad.img = imagenes[indice].split(")'>")[0];
							  	 	unidad.name = nombres[indice].split("</di")[0].replace("'", "").replace('"', '');
							  	 	

							  	 	extraccion[cadena.split("faccion=")[1]].push(unidad);
							  	}
							}
							console.log(extraccion[cadena.split("faccion=")[1]],extraccion);
								console.log(JSON.stringify(extraccion));
						} // if
				        else {
				            var aux = texto.split("|");
				            log.alert(aux[0],cadena.split("faccion=")[1]);
				        } // else
				    },
				    onFailure: function(){ } // failure
				 }).send(cadena);   
				}	 
		})(index);
	}