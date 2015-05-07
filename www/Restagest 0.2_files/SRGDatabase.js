SRGDatabase = function(){
	var SGRdatabase = this;
	this.database = window.openDatabase("DB", "1.0", "restaGesDB", 20000000);
	SGRdatabase.database.transaction(function(tx){ 
		tx.executeSql('CREATE TABLE IF NOT EXISTS CONFIGURACION (Id  INTEGER PRIMARY KEY,IP,PORT,CamareroCode INTEGER,SalonCode INTEGER)');
		tx.executeSql('INSERT OR IGNORE INTO CONFIGURACION (Id,IP,PORT,CamareroCode,SalonCode ) VALUES (1,"172.17.1.12",8100,-1,-1)') ;

	 },
	errorCB, successCB);

	this.setDBfromJSON = function(jsonString){
		SGRdatabase.database.transaction(function(tx){ poblarDB(tx, jsonString)},
			errorCB, successCB);
	}

		this.setImagesfromJSON = function(jsonString){
			
		SGRdatabase.database.transaction(function(tx){ insertImagesFromJson(tx, jsonString)},
			errorCB, function(){
				SRGM.GLOBALS.camareros.onSelected();
				

			});
	}
	this.setConfiguration = function(newID,Field){
		console.log("update configuración");
			SGRdatabase.database.transaction(function(tx){ ejecutar(tx, 
				'UPDATE COMANDAS ('+Field+') VALUES ('+newID+')')},
			errorCB, successCB);
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
				
				getRows(tx, TypeMap.consulta+" "+whereLocalClause,cargarEntitys);
			},
		errorCB,successCB);

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
    		
        	
            for (var i = 0; i < tamanio; i++) {
               var row = consulta.rows.item(i);   
               row.handler =  TypeMap.handler;  
               var entity = new TypeMap.childrenmodel(row);                    
               entityList.push(entity);
			 }
			 callback(entityList);
    	}

		SGRdatabase.database.transaction(
			function(tx){ 
				getRows(tx, TypeMap.consultaFather+" "+whereLocalClause,cargarFather);		
			},
		errorCB,successCB);

		//return listaCamareros;
	
	}
	this.GetEntityFromConfiguration = function(callback,TypeMap,configurationName){
		console.log("obteniendo elemento separado");
		var getIDElement = function(tx,consulta){
			var row = consulta.rows.item(0);
			var id = row[configurationName];
			if (id === -1){
				 callback(null);
			}else{   
               row.handler =  TypeMap.handler;  
               var entity = new TypeMap.model(row);
               callback(entity);  
           } 
		}
		

		SGRdatabase.database.transaction(
			function(tx){ 
				getRows(tx, "SELECT a."+configurationName+" FROM CONFIGURACION a LEFT JOIN "+TypeMap.table+" b ON a."+configurationName+" = b.Id",getIDElement);		
			},
		errorCB,successCB);



	}


	this.createNewComanda = function(mesa,salon,comensales){
			SGRdatabase.database.transaction(function(tx){ ejecutar(tx, 
				'INSERT INTO COMANDAS (Mesa,Salon,Comensales,ImporteTotal,Abierto) VALUES ('+mesa+','+salon+','+comensales+',0,1)')},
			errorCB, successCB);
	}
	

	this.createNewLineaComanda = function(idComanda,idArticulo,Precio){
		SGRdatabase.database.transaction(function(tx){ ejecutar(tx, 
				'INSERT INTO LINEASCOMANDAS (IdComanda,IdArticulo,Precio,Enviado) VALUES ('+idComanda+','+idArticulo+','+Precio+',0)')},
			errorCB, successCB);
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
			tx.executeSql('DROP TABLE IF EXISTS '+tablas[i]);
		}


	 	tx.executeSql('CREATE TABLE IF NOT EXISTS COMANDAS (Id  INTEGER PRIMARY KEY,Mesa INTEGER,Salon INTEGER,Comensales INTEGER,ImporteTotal DECIMAL(9,2),tiempoInicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,tiempoFinal TIMESTAMP, Abierto)');
	 	tx.executeSql('CREATE TABLE IF NOT EXISTS LINEASCOMANDAS (Id  INTEGER PRIMARY KEY,IdComanda INTEGER,IdArticulo INTEGER,Precio DECIMAL(9,2),cantidad INTEGER,insertDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,Enviado INTEGER)');

	    tx.executeSql('CREATE TABLE IF NOT EXISTS ARTICULOS (Id INTEGER PRIMARY KEY,Nombre,Familia,Subfamilia,PVP DECIMAL(9,2),PVP2 DECIMAL(9,2),PVP3 DECIMAL(9,2), Foto BINARY)');
	    tx.executeSql('CREATE TABLE IF NOT EXISTS FAMILIAS  (Concepto STRING PRIMARY KEY,Barra,Salones, Foto BINARY)');
	    tx.executeSql('CREATE TABLE IF NOT EXISTS SUBFAMILIAS (Familia,Subfamilia unique, Foto BINARY)');
	    tx.executeSql('CREATE TABLE IF NOT EXISTS CAMAREROS (Id INTEGER PRIMARY KEY, Nombre, Foto BINARY)');
	    tx.executeSql('CREATE TABLE IF NOT EXISTS SALONES (Id INTEGER PRIMARY KEY,Nombre,Nmesas INTEGER,TarifaDef,HoraIni ,HoraFin ,HoraIni2 ,HoraFin2 ,HoraIni3 ,HoraFin3 )');    
	    tx.executeSql('CREATE TABLE IF NOT EXISTS MESAS  (Salon INTEGER,Mesa INTEGER,CodVenta )');
	           

	    //Articulos
		var valores = "('"+data[0][0].Codigo+"','"+data[0][0].Nombre+"',' "+data[0][0].Familia+"',' "+data[0][0].Subfamilia+"',' "+data[0][0].PVP+"',' "+data[0][0].PVP2+"',' "+data[0][0].PVP3+"')";
		for (var i = 1; i< data[0].length; i++){
	    	valores += ",('"+data[0][i].Codigo+"','"+data[0][i].Nombre+"',' "+data[0][i].Familia+"',' "+data[0][i].Subfamilia+"',' "+data[0][i].PVP+"',' "+data[0][i].PVP2+"',' "+data[0][i].PVP3+"')";
	    }
	   
	    tx.executeSql('INSERT INTO ARTICULOS (Id,Nombre,Familia,Subfamilia,PVP,PVP2,PVP3) VALUES '+ valores);

	    var valores = "('"+data[1][0].Concepto+"','"+data[1][0].Barra+"',' "+data[1][0].Salones+"')";
		for (var i = 1; i< data[1].length; i++){
	    	valores += ",('"+data[1][i].Concepto+"','"+data[1][i].Barra+"',' "+data[1][i].Salones+"')";
	    }
	  
	    tx.executeSql('INSERT INTO FAMILIAS (Concepto,Barra,Salones) VALUES '+ valores);

	    var valores = "('"+data[2][0].Familia+"','"+data[2][0].Subfamilia+"')";
		for (var i = 1; i< data[2].length; i++){
	    	valores += ",('"+data[2][i].Familia+"','"+data[2][i].Subfamilia+"')";
	    }
	   
	    tx.executeSql('INSERT INTO SUBFAMILIAS (Familia,Subfamilia) VALUES '+ valores);

	     var valores = "('"+data[3][0].CODIGO+"','"+data[3][0].NOMBRE+"')";
		for (var i = 1; i< data[3].length; i++){
	    	valores += ",('"+data[3][i].CODIGO+"','"+data[3][i].NOMBRE+"')";
	    }
	    
	    tx.executeSql('INSERT INTO CAMAREROS (Id,Nombre) VALUES '+ valores);

	    var valores = "('"+data[4][0].Numero+"','"+data[4][0].Nombre+"','"+data[4][0].Nmesas+"','"+data[4][0].TarifaDef+"',' "+data[4][0].HoraIni+"',' "+data[4][0].HoraFin+"',' "+data[4][0].HoraIni2+"',' "+data[4][0].HoraFin2+"',' "+data[4][0].HoraIni3+"',' "+data[4][0].HoraFin3+"')";
		for (var i = 1; i< data[4].length; i++){
	    	valores += ",('"+data[4][i].Numero+"','"+data[4][i].Nombre+"','"+data[4][i].Nmesas+"','"+data[4][i].TarifaDef+"',' "+data[4][i].HoraIni+"',' "+data[4][i].HoraFin+"',' "+data[4][i].HoraIni2+"',' "+data[4][i].HoraFin2+"',' "+data[4][i].HoraIni3+"',' "+data[4][i].HoraFin3+"')";
	    }
	  
	    tx.executeSql('INSERT INTO SALONES (Id ,Nombre,Nmesas,TarifaDef,HoraIni ,HoraFin ,HoraIni2 ,HoraFin2 ,HoraIni3 ,HoraFin3 ) VALUES '+ valores);

	    var valores = "('"+data[5][0].Salon+"','"+data[5][0].Mesa+"','"+data[5][0].CodVenta+"')";
		for (var i = 1; i< data[5].length; i++){
	    	valores += ",('"+data[5][i].Salon+"','"+data[5][i].Mesa+"','"+data[5][i].CodVenta+"')";
	    }

	    tx.executeSql('INSERT INTO MESAS (Salon,Mesa,CodVenta) VALUES '+ valores);
	    
	  
    	return true;
	}

function insertImagesFromJson(tx,jsonString) {
	
		SRGM.GLOBALS.Conection.DataBaseWorking();
		var data = JSON.parse(jsonString);

		var tablas = ["ARTICULOS","FAMILIAS","SUBFAMILIAS","CAMAREROS"];
  
		for (var i = 0; i< data[0].length; i++){
			 tx.executeSql('UPDATE ARTICULOS SET Foto = "'+data[0][i].FOTO+'" WHERE  Id = "'+ data[0][i].CODIGO +'"');
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


	 	console.log("Fin");
	 	
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