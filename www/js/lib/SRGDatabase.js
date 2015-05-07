SRGDatabase = function(){
	var SGRdatabase = this;
	SGRdatabase.Version = "0.5.6";
	this.database = window.openDatabase("DB", "1.0", "restaGesDB", 20000000);
	SGRdatabase.database.transaction(function(tx){ 
		sqlCreate = 'CREATE TABLE IF NOT EXISTS CONFIGURACION (Id  INTEGER PRIMARY KEY,IP,PORT,CamareroCode INTEGER,SalonCode INTEGER,Fotos,LineasConjuntas,Vibrar,PedirComensales, Version text)';

		//tx.executeSql('DROP TABLE IF EXISTS CONFIGURACION');
		tx.executeSql(sqlCreate);
		tx.executeSql('INSERT OR IGNORE INTO CONFIGURACION '+
				'(Id,IP,PORT,CamareroCode,SalonCode, Fotos,LineasConjuntas,Vibrar,PedirComensales, Version ) '+
		 		'VALUES (1,"172.17.1.12",8100,-1,-1,"True","False","True","False","'+SGRdatabase.Version+'")') ;
		
		getRows(tx, "SELECT * FROM CONFIGURACION" ,function(tx,consulta){	
					var TempConfig = consulta.rows.item(0);	
					if (  TempConfig.Version  && SGRdatabase.Version != TempConfig.Version){ // Si ha habido un cambio de version

						console.log("Cambio de version de la base de datos de "+TempConfig.Version+" a : " + SGRdatabase.Version);
						
						tx.executeSql('DROP TABLE IF EXISTS CONFIGURACION');
						tx.executeSql(sqlCreate);
						tx.executeSql('INSERT OR IGNORE INTO CONFIGURACION '+
						'(Id,IP,PORT,CamareroCode,SalonCode, Fotos,LineasConjuntas,Vibrar,PedirComensales, Version ) '+
				 		'VALUES (1,"'+TempConfig.IP+'",'+TempConfig.PORT+','+TempConfig.CamareroCode+','+TempConfig.SalonCode+', "'+TempConfig.Fotos+'","'+TempConfig.LineasConjuntas+'","'+TempConfig.Vibrar+'","'+TempConfig.PedirComensales+'", "'+SGRdatabase.Version+'")') ;
		
					}
		});	

	},
	function(error){console.error("Error en SRGDatabase al crear configuración : "+ error.message);}, successCB);

	SGRdatabase.configuration;

	this.getConfiguration = function(){
		var salida
		SGRdatabase.database.transaction(
			function(tx){ 
				getRows(tx, "SELECT IP,PORT,LineasConjuntas as AgruparLineas,Fotos,Vibrar,PedirComensales FROM CONFIGURACION" ,function(tx,consulta){				
					SGRdatabase.configuration = consulta.rows.item(0);
				});		
			},
		function(error){console.error("Error en getConfiguration : "+ error.message);},function(){
		});
		
	}

	SGRdatabase.getConfiguration();
       
	this.setDBfromJSON = function(jsonString){
		
		try{	
			SGRdatabase.database.transaction(function(tx){ poblarDB(tx, jsonString)},
				function(error){
					console.error("Error en setDBfromJSON : "+ error.message);	
					SRGM.GLOBALS.Conection.view.dataBaseError();}, 
				function(){	SRGM.GLOBALS.Conection.dataReady();});
		}catch(e){

			SRGM.GLOBALS.Conection.view.console("fallo: "+ e.message);
		}
	}

	this.setImagesfromJSON = function(jsonString){
		
	SGRdatabase.database.transaction(function(tx){ insertImagesFromJson(tx, jsonString)},
			function(error){
				console.error("Error en setImagesfromJSON : "+ error.message);
				SRGM.GLOBALS.Conection.view.dataBaseError();},
			 function(){
				SRGM.GLOBALS.camareros.onSelected();
				SRGM.GLOBALS.Conection.dataReady();

			});
	}
	this.setConfiguration = function(newID,Field){
		console.log("estableciendo "+Field+ " como: "+newID);
			SGRdatabase.database.transaction(function(tx){ ejecutar(tx, 
				'UPDATE CONFIGURACION SET '+Field+' = "'+newID+'"')},
			function(error){console.error("Error en setConfiguration : "+ error.message);}, function(){
				console.log ("DB: succes, insertado en base de datos el valor :"+'UPDATE CONFIGURACION SET '+Field+' = "'+newID+'"');
				SGRdatabase.getConfiguration();

			});
	}


	this.getEntityList = function(callback,TypeMap,whereClause){
		var whereLocalClause = whereClause ? whereClause :"";


		var cargarEntitys = function(tx,consulta){   		
    		var tamanio = consulta.rows.length;
    		
        	var entityList = [];
            for (var i = 0; i < tamanio; i++) {
               var row = consulta.rows.item(i);   
               row.handler =  TypeMap.handler;  
               var entity = new TypeMap.model(row);                    
               entityList.push(entity);
			 }
		
			 callback(entityList);
    	}

		SGRdatabase.database.transaction(

			function(tx){ 
				console.log(TypeMap.consulta+" "+whereLocalClause);
				getRows(tx, TypeMap.consulta+" "+whereLocalClause,cargarEntitys);
			},
		function(error){console.error("Error en getEntityList : "+ error.message);},successCB);

		//return listaCamareros;
	}

	this.getFatherplusChildrens = function(callback,TypeMap,whereClause){
		var whereLocalClause = whereClause ? whereClause :"";
		var father = {};
		var entityList = [];
		var cargarFather = function(tx,consulta){
			//se espera una sola instancia de la consulta;
		
			var row = consulta.rows.item(0);
			row.handler =  TypeMap.handler;  
			father = new TypeMap.fathermodel(row);
			entityList.push(father);
			getRows(tx, TypeMap.consultaChildrens+" WHERE "+TypeMap.fatherIdKey+" = '"+row.Id+"' "+(TypeMap.groupByChildren ? TypeMap.groupByChildren:""),cargarChildrens);
		}

		var cargarChildrens = function(tx,consulta){   		
    		var tamanio = consulta.rows.length;
    		var childrenList = [];
        	
            for (var i = 0; i < tamanio; i++) {
               var row = consulta.rows.item(i);   
               row.handler =  TypeMap.handler;  
               var entity = new TypeMap.childrenmodel(row);                    
               entityList.push(entity);
               childrenList.push(entity);
			 }
			 if (father.setChildren){
			 	father.setChildren(childrenList);
			 }
			 callback(entityList);
    	}

		SGRdatabase.database.transaction(
			function(tx){ 
				getRows(tx, TypeMap.consultaFather+" "+whereLocalClause,cargarFather);		
			},
		function(error){console.error("Error en getFatherplusChildrens : "+ error.message);},successCB);

		//return listaCamareros;
	
	}
	this.GetEntityFromConfiguration = function(callback,TypeMap,configurationName){
		var getIDElement = function(tx,consulta){
			var row = consulta.rows.item(0);
			var id = row[configurationName];
			if (id === -1){
				 callback(null);
			}else{   
               row.handler =  TypeMap.handler;  
               var entity = new TypeMap.model(row);
               console.log(row.Id);
               callback(entity);  
           } 
		}
		

		SGRdatabase.database.transaction(
			function(tx){ 
				getRows(tx, "SELECT a."+configurationName+",b.* FROM CONFIGURACION a LEFT JOIN "+TypeMap.table+" b ON a."+configurationName+" = b.Id",getIDElement);		
			},
		function(error){console.error("Error en GetEntityFromConfiguration : "+ error.message);},successCB);



	}
	this.getRows = function(callback,SQL){
		SGRdatabase.database.transaction(
			function(tx){ 
				getRows(tx, SQL,callback);		
			},
		function(error){console.error("Error en getRows : "+ error.message);},successCB);

	}
	this.actualizeLineasComandaEnviadas = function(idComanda){
		SGRdatabase.database.transaction(function(tx){ ejecutar(tx, 
				'UPDATE LINEASCOMANDAS SET Enviado = Cantidad WHERE IdComanda = '+idComanda)},
			function(error){console.error("Error en actualizeLineasComandaEnviadas : "+ error.message);}, successCB);
	}


	this.createNewComanda = function(mesa,salon,comensales){
			SGRdatabase.database.transaction(function(tx){ ejecutar(tx, 
				'INSERT INTO COMANDAS (Mesa,Salon,Comensales,ImporteTotal,Abierto,Enviado) VALUES ('+mesa+','+salon+','+comensales+',0,1,0)')},
			function(error){console.error("Error en createNewComanda : "+ error.message);}, successCB);
	}
	this.setLineaComandaCant = function(idLineaComanda,cant){
		console.log("cambiabdo cantidad de un articulo a : "+ cant);
		SGRdatabase.database.transaction(function(tx){ ejecutar(tx, 
			'UPDATE LINEASCOMANDAS SET Cantidad = '+ cant +' WHERE IdLineaCentral = '+idLineaComanda)
			},
			function(error){console.error("Error en setLineaComandaCant : "+ error.message);}, successCB);	
	}	

	this.createNewLineaComanda = function(idComanda,idArticulo,Precio,cant){
			var idLinea;
			
			var cantidad = cant ? cant : 1;
			console.log(cantidad);
			if (SGRdatabase.configuration.AgruparLineas == "False"){
				idLinea = "Id";
			}else{
				idLinea = 0;
			}

			SGRdatabase.database.transaction(function(tx){ 
			ejecutar(tx, 'INSERT INTO LINEASCOMANDAS (IdComanda,IdArticulo,Cantidad,Precio,Enviado,IdLineaCentral) VALUES ('+idComanda+',"'+idArticulo+'",'+cantidad+','+Precio+','+0+',0)');
			tx.executeSql('UPDATE LINEASCOMANDAS SET IdLineaCentral = '+idLinea+' WHERE IdComanda = '+idComanda+' and idArticulo = "'+ idArticulo +'" and IdLineaCentral = 0');
			},
			function(error){console.error("Error en createNewLineaComanda : "+ error.message);}, successCB);	
		
	}


	function errorCB(err) {
		
    	console.error("DB: Error processing SQL:" +err.message);
    	
	}

	function successCB() {
		console.log("DB: success!");
	}

	function poblarDB(tx,jsonString) {
	//console.log(dataSreamed.data);
		var data = JSON.parse(jsonString);
		
		var tablas = ["ARTICULOS","FAMILIAS","SUBFAMILIAS","CAMAREROS","SALONES","MESAS","COMANDAS","LINEASCOMANDAS"];
		
		for (var i = 0 ; i<tablas.length ; i++){
			console.log('DROP TABLE IF EXISTS '+tablas[i]);
			tx.executeSql('DROP TABLE IF EXISTS '+tablas[i]);
		}
		
	
	 	tx.executeSql('CREATE TABLE IF NOT EXISTS COMANDAS (Id  INTEGER PRIMARY KEY,IdCentral INTEGER  DEFAULT 0,Mesa INTEGER,Salon INTEGER,Comensales INTEGER,ImporteTotal DECIMAL(9,2),tiempoInicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,tiempoFinal TIMESTAMP, Abierto INTEGER, Enviado INTEGER)');
	 	tx.executeSql('CREATE TABLE IF NOT EXISTS LINEASCOMANDAS (Id  INTEGER PRIMARY KEY,IdComanda INTEGER,IdComandaCentral INTEGER,IdLineaCentral INTEGER,IdArticulo text,Precio DECIMAL(9,2),cantidad INTEGER,insertDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,Enviado INTEGER)');

	    tx.executeSql('CREATE TABLE IF NOT EXISTS ARTICULOS 	(Codigo text PRIMARY KEY ,Nombre text,Familia text,Subfamilia text,PVP DECIMAL(9,2),PVP2 DECIMAL(9,2),PVP3 DECIMAL(9,2), Foto BINARY, Vendido INTEGER)');
	    tx.executeSql('CREATE TABLE IF NOT EXISTS FAMILIAS  	(Concepto text ,Barra,Salones, Foto BINARY ,Orden INTEGER)');
	    tx.executeSql('CREATE TABLE IF NOT EXISTS SUBFAMILIAS 	(Familia text,Subfamilia text, Foto BINARY ,Orden )');
	    tx.executeSql('CREATE TABLE IF NOT EXISTS CAMAREROS 	(Id INTEGER , Nombre, Foto BINARY)');
	    tx.executeSql('CREATE TABLE IF NOT EXISTS SALONES 		(Id INTEGER ,Nombre,Nmesas INTEGER,TarifaDef,HoraIni ,HoraFin ,HoraIni2 ,HoraFin2 ,HoraIni3 ,HoraFin3 )');    
	    tx.executeSql('CREATE TABLE IF NOT EXISTS MESAS  		(Salon INTEGER,Mesa INTEGER,CodVenta )');

 
	   
	    console.log('CREATE TABLE IF NOT EXISTS ARTICULOS (Id INTEGER PRIMARY KEY,Nombre,Familia,Subfamilia,PVP DECIMAL(9,2),PVP2 DECIMAL(9,2),PVP3 DECIMAL(9,2), Foto BINARY, Vendido INTEGER)');
	  	   //Articulos
		var valores;// = "('"+data[0][0].Codigo+"','"+data[0][0].Nombre+"',' "+data[0][0].Familia+"',' "+data[0][0].Subfamilia+"',' "+data[0][0].PVP+"',' "+data[0][0].PVP2+"',' "+data[0][0].PVP3+"')";
		for (var i = 0; i< data[0].length; i++){
	    	valores = "('"+data[0][i].Codigo+"','"+data[0][i].Nombre+"',' "+data[0][i].Familia+"',' "+data[0][i].Subfamilia+"',' "+data[0][i].PVP+"',' "+data[0][i].PVP2+"',' "+data[0][i].PVP3+"',' "+data[0][i].Vendido+"')";
	   		
	   		console.log('INSERT INTO ARTICULOS (Codigo,Nombre,Familia,Subfamilia,PVP,PVP2,PVP3, Vendido) VALUES '+ valores);	
	   		tx.executeSql('INSERT INTO ARTICULOS (Codigo,Nombre,Familia,Subfamilia,PVP,PVP2,PVP3, Vendido) VALUES '+ valores);
	    }
	  	
	  //  tx.executeSql('INSERT INTO ARTICULOS (Id,Nombre,Familia,Subfamilia,PVP,PVP2,PVP3) VALUES '+ valores);s

	    //var valores = "('"+data[1][0].Concepto+"','"+data[1][0].Barra+"',' "+data[1][0].Salones+"')";
		for (var i = 0; i< data[1].length; i++){
	    	valores = "('"+data[1][i].Concepto+"','"+data[1][i].Barra+"',' "+data[1][i].Salones+"',' "+data[1][i].Orden+"')";
	    	 tx.executeSql('INSERT INTO FAMILIAS (Concepto,Barra,Salones,Orden) VALUES '+ valores);
	    }
	  

	   // var valores = "('"+data[2][0].Familia+"','"+data[2][0].Subfamilia+"')";
		for (var i = 0; i< data[2].length; i++){
	    	valores = "('"+data[2][i].Familia+"','"+data[2][i].Subfamilia+"','"+data[2][i].Orden+"')";
	    	tx.executeSql('INSERT INTO SUBFAMILIAS (Familia,Subfamilia,Orden) VALUES '+ valores);
	    }
	

	     //var valores = "('"+data[3][0].CODIGO+"','"+data[3][0].NOMBRE+"')";
		for (var i = 0; i< data[3].length; i++){
	    	valores = "('"+data[3][i].CODIGO+"','"+data[3][i].NOMBRE+"')";
	    	 tx.executeSql('INSERT INTO CAMAREROS (Id,Nombre) VALUES '+ valores);
	    }
	
	   

	    //var valores = "('"+data[4][0].Numero+"','"+data[4][0].Nombre+"','"+data[4][0].Nmesas+"','"+data[4][0].TarifaDef+"',' "+data[4][0].HoraIni+"',' "+data[4][0].HoraFin+"',' "+data[4][0].HoraIni2+"',' "+data[4][0].HoraFin2+"',' "+data[4][0].HoraIni3+"',' "+data[4][0].HoraFin3+"')";
		for (var i = 0; i< data[4].length; i++){
	    	valores = "('"+data[4][i].Numero+"','"+data[4][i].Nombre+"','"+data[4][i].Nmesas+"','"+data[4][i].TarifaDef+"',' "+data[4][i].HoraIni+"',' "+data[4][i].HoraFin+"',' "+data[4][i].HoraIni2+"',' "+data[4][i].HoraFin2+"',' "+data[4][i].HoraIni3+"',' "+data[4][i].HoraFin3+"')";
	    	tx.executeSql('INSERT INTO SALONES (Id ,Nombre,Nmesas,TarifaDef,HoraIni ,HoraFin ,HoraIni2 ,HoraFin2 ,HoraIni3 ,HoraFin3 ) VALUES '+ valores);

	    }
	
	    
	   // var valores = "('"+data[5][0].Salon+"','"+data[5][0].Mesa+"','"+data[5][0].CodVenta+"')";
		for (var i = 0; i< data[5].length; i++){
	    	valores = "('"+data[5][i].Salon+"','"+data[5][i].Mesa+"','"+data[5][i].CodVenta+"')";
	    	tx.executeSql('INSERT INTO MESAS (Salon,Mesa,CodVenta) VALUES '+ valores);
	    }
 
	  	
    	return true;
    	
	}

	function insertImagesFromJson(tx,jsonString) {
	
		SRGM.GLOBALS.Conection.DataBaseWorking();
		var data = JSON.parse(jsonString);

		var tablas = ["ARTICULOS","FAMILIAS","SUBFAMILIAS","CAMAREROS"];
  
		for (var i = 0; i< data[0].length; i++){
			 tx.executeSql('UPDATE ARTICULOS SET Foto = "'+data[0][i].FOTO+'" WHERE  Codigo = "'+ data[0][i].CODIGO +'"');
	   }
	   
	   for (var i = 0; i< data[1].length; i++){
	    	 tx.executeSql('UPDATE FAMILIAS SET Foto = "'+data[1][i].FOTO+'" WHERE  Concepto = "'+ data[1][i].CONCEPTO +'"');
	   }
	     
		for (var i = 0; i< data[2].length; i++){
	    	 tx.executeSql('UPDATE SUBFAMILIAS SET Foto = "'+data[2][i].FOTO+'" WHERE  Familia = "'+ data[2][i].FAMILIA +'" and Subfamilia = "'+ data[2][i].SUBFAMILIA +'"');
	 	}
	  
		for (var i = 0; i< data[3].length; i++){
	    	 tx.executeSql('UPDATE CAMAREROS SET Foto = "'+data[3][i].FOTO+'" WHERE  Id = "'+ data[3][i].CODIGO +'"');
	 	}


	}
	this.sincronizeComandafromJSON = function(comanda,idComanda){
		SGRdatabase.database.transaction(function(tx){ sincronizarComanda(tx, comanda,idComanda)},
			function(error){console.error("Error en sincronizeComandafromJSON : "+ error.message);}, successCB);
	}

	function sincronizarComanda(tx,comanda,idComanda){
		var data = comanda;
		var tablas = ["LINEASCOMANDAS","COMANDAS"];
		var temp ='UPDATE COMANDAS SET '+
			' IdCentral = "'+ data[1][0].NUMERO + '",' +
			' ImporteTotal = "'+ data[1][0].TOTAL + '",' +
			' Enviado = 1' +
			' WHERE  Id = "'+ idComanda +'"';
		console.log(temp);
		tx.executeSql(temp);
  	 	
		tx.executeSql('DELETE FROM LINEASCOMANDAS WHERE cantidad = Enviado and IdComanda = '+idComanda );
	
		for (var i = 0; i< data[0].length; i++){
			var sql = 'INSERT INTO LINEASCOMANDAS (IdComanda,IdArticulo,Cantidad,Precio,Enviado,IdLineaCentral,IdComandaCentral)'+ 
	    	 	'VALUES ('+idComanda+','
	    	 		+data[0][i].CODIGO+','
	    	 		+data[0][i].CTDAD+','
	    	 		+data[0][i].PRECIO+','
	    	 		+data[0][i].CTDAD+','
	    	 		+data[0][i].IDVEN+','
	    	 		+data[0][i].NUMERO+')';
			console.log(sql);
	    tx.executeSql(sql);    	
	   }
	}

	function crearComanda(tx,comanda){
		var data = comanda;
		var tablas = ["LINEASCOMANDAS","COMANDAS"];
	
		tx.executeSql('UPDATE COMANDAS SET '+
			' IdCentral = "'+ data[1][0].NUMERO + '",' +
			' ImporteTotal = "'+ data[1][0].TOTAL + '"' +
			' WHERE  Id = "'+ idComanda +'"');
  	 	
		tx.executeSql('DELETE FROM LINEASCOMANDAS WHERE IdComanda = '+idComanda );
	
		for (var i = 0; i< data[0].length; i++){
			var sql = 'INSERT INTO LINEASCOMANDAS (IdComanda,IdArticulo,Cantidad,Precio,Enviado,IdLineaCentral,IdComandaCentral)'+ 
	    	 	'VALUES ('+idComanda+','
	    	 		+data[0][i].CODIGO+','
	    	 		+data[0][i].CTDAD+','
	    	 		+data[0][i].PRECIO+','
	    	 		+data[0][i].CTDAD+','
	    	 		+data[0][i].IDVEN+','
	    	 		+data[0][i].NUMERO+')';
			console.log(sql);
	    	 tx.executeSql(sql);    	
	   }
	}


	this.sincronizeSalonfromJSON = function(salon,idSalon){
	SGRdatabase.database.transaction(function(tx){ sincronizarSalon(tx, salon,idSalon)},
		function(error){console.error("Error en sincronizeSalonfromJSON : "+ error.message);}, successCB);
	}

	function sincronizarSalon(tx,salon,idSalon){
		var comandas = salon.comandas;
		var listaMesasActivas = [];
		var contadorModificaciones = 0;
		
		var creaUpdateComanda = function(comanda){
			tx.executeSql("SELECT count(*) as numRows FROM COMANDAS WHERE Salon = "+ comanda.SALON + " and Mesa = " +comanda.MESA + " and Abierto = 1", 
			[], 
			function(tx,results){
				if (results.rows.item(0)["numRows"] == 0){//añadir nueva comanda
						contadorModificaciones++;
						var sql = 'INSERT INTO COMANDAS (Mesa,Salon,Comensales,ImporteTotal,Abierto,IdCentral,Enviado) VALUES ('+comanda.MESA+','+comanda.SALON+','+comanda.COMENSALES+',0,1,'+comanda.NUMERO+',1)';
						console.log(sql);
						tx.executeSql(sql);
				console.log(contadorModificaciones);
				}
			});
		} 

		for (var i = 0 ; i< comandas.length;i++){
			listaMesasActivas.push(comandas[i][0].MESA);
			creaUpdateComanda(comandas[i][0]);			
		}
		console.log('UPDATE COMANDAS SET Abierto = 0 WHERE Salon = ' + idSalon + ' and Abierto = 1  and Enviado = 1 and Mesa not in ('+ listaMesasActivas.join() +')');
		tx.executeSql('UPDATE COMANDAS SET Abierto = 0 WHERE Salon = ' + idSalon + ' and Abierto = 1 and Enviado = 1 and Mesa not in ('+ listaMesasActivas.join() +')' );
		
	
	}

	this.statusComandafromJSON = function(comanda,idSalon,idMesa){
		SGRdatabase.database.transaction(function(tx){ 
			tx.executeSql("SELECT Id FROM COMANDAS WHERE Abierto = 1 and Mesa = "+ idMesa+ " and Salon = "+idSalon, [], function(tx,results){	
				console.log(results.rows.item(0)["Id"]);
				sincronizarComanda(tx,comanda,results.rows.item(0)["Id"]);
				});	
			},function(error){console.error("Error en statusComandafromJSON : "+ error.message);}, successCB);
		}

	
	
	this.cancelComanda = function(comanda){
		SGRdatabase.database.transaction(function(tx){ ejecutar(tx, 
				'UPDATE COMANDAS SET Abierto = 0 WHERE Id = '+ comanda.Id)},
			function(error){console.error("Error en cancelComanda : "+ error.message);}, function(){
				SRGM.GLOBALS.mesas.onSelected("WHERE  a.Salon = '"+SRGM.GLOBALS.Salon.Numero+"'");
				if (comanda.IdCentral != 0){
					SRGM.GLOBALS.Conection.cancelComanda(comanda.Salon,comanda.Mesa);
				}
			});
	}

		
	
	function getRows(tx,sqlSelect,callBack,callBackParams){
		tx.executeSql(sqlSelect, [], function(tx,results){
			
			callBack(tx,results,callBackParams);
		});
	}

	function ejecutar(tx,sqlExecute){
		tx.executeSql(sqlExecute);
	}

}