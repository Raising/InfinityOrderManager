//name: "Solinsur RESTAGEST Conection";

SGRConection = function(){

	var SGRconection = this;
	this.socket;
  this.idDispositivo = 666;
	this.ip = "172.17.1.12";
	this.puerto = "8100";
	this.DBbuffer = [];
  this.ImageBuffer= [];
  this.ndbChunks = 0;
  this.ndbChunksImages = 0;
  this.chargedChunks = 0;
  this.chargedImageChunks = 0;
  this.view = new SCTI.Conexion_view(this);
  //this.iconView = new SCTI.Icon_Footview(this,"img/connection.png");
  this.vistas  = {};
  this.status = "Cerrado";

  this.setConfig = function(ip,puerto){
    SGRconection.ip = ip;
    SGRconection.puerto = puerto;
    SRGM.GLOBALS.DB.setConfiguration(ip,"IP");
    SRGM.GLOBALS.DB.setConfiguration(puerto,"PORT");
    console.log("IP y puerto establecidos a: "+ip+":"+puerto);
  }
  this.getIp = function(){
     SGRconection.ip  = SRGM.GLOBALS.DB.configuration.IP;
    return SGRconection.ip;
  }

  this.getPuerto = function(){
    SGRconection.puerto  = SRGM.GLOBALS.DB.configuration.PORT;
    return SGRconection.puerto;
  }
  this.setStatus = function(valor){
    SGRconection.status = valor;
    SGRconection.view.display(valor);
  }
  this.stopConection = function(){
    if (SGRconection.socket){
      SGRconection.setStatus("Cerrado");
      SGRconection.socket.close();
    }
  }

  this.establecerConexion = function(){
    SGRconection.ip  = SRGM.GLOBALS.DB.configuration.IP;
    SGRconection.puerto  = SRGM.GLOBALS.DB.configuration.PORT;

    SGRconection.socket =  new WebSocket('ws://'+SGRconection.ip+':'+SGRconection.puerto, []);

    SGRconection.socket.onopen = function () {
       
    
      SGRconection.setStatus("Abierto");
      SGRconection.view.StandBy(); 
      //this.send("689//conection//estableciendo conexion");
    };

    SGRconection.socket.onmessage = function (event) {
        console.info(event.data);    // will be "hello"
        var mensage = event.data.split("$$$");

        var action = mensage[0];            
        var data = mensage[1];
		    console.log("recibida la accion: " + action);
        switch(action){

          case "newDB":
            var chunk = mensage[2];    
            SGRconection.view.Recibiendo();     
            SGRconection.DBbuffer[chunk] = data;
            SGRconection.chargedChunks++;

            if (SGRconection.chargedChunks == SGRconection.ndbChunks && SGRconection.ndbChunks != 0){
              SGRconection.chargedChunks = 0;
              SGRconection.ndbChunks = 0;
              var DBjsonString = "";
              for (var i = 0; i< SGRconection.DBbuffer.length;i++){
                 DBjsonString += SGRconection.DBbuffer[i];
              }       
                 
              SRGM.GLOBALS.DB.setDBfromJSON(DBjsonString);       
              //SGRconection.EnableNavigation();
              SGRconection.view.dataBaseWorking(); 
              if (SRGM.GLOBALS.DB.configuration.Fotos == "True"){
                 SGRconection.getImages();
              }else{
                SRGM.GLOBALS.camareros.onSelected();
              }   
            }

                
              
        break;
        case "newImages":
          var chunk = mensage[2];
          SGRconection.view.Recibiendo(); 
          SGRconection.ImageBuffer[chunk] = data;
          SGRconection.chargedImageChunks++;
        
          if (SGRconection.chargedImageChunks == SGRconection.ndbChunksImages && SGRconection.ndbChunksImages != 0){
            SGRconection.ndbChunksImages = 0;
            SGRconection.chargedImageChunks = 0;
            var ImagejsonString = "";
            for (var i = 0; i< SGRconection.ImageBuffer.length;i++){
              ImagejsonString += SGRconection.ImageBuffer[i];
            }        
            SGRconection.view.dataBaseWorking();
            SRGM.GLOBALS.DB.setImagesfromJSON(ImagejsonString);
          }
        break;

        case "pedidoAceptado":
					
        break;

        case "numberOfChunksDB":
          SGRconection.ndbChunks = data;                      
        break;

        case "numberOfChunksImages":
          SGRconection.ndbChunksImages = data;
        break;

        case "comandaOK":
          SRGM.GLOBALS.DB.actualizeLineasComandaEnviadas(data);
          SRGM.GLOBALS.comandas.refresh("WHERE  a.Mesa = "+SRGM.GLOBALS.SelectedComanda.Mesa+" and  a.Salon = "+SRGM.GLOBALS.SelectedComanda.Salon+" and a.Abierto = 1");
  
        break;
          
        case "SalonStatus":
          var salonId = mensage[2];
          SRGM.GLOBALS.DB.sincronizeSalonfromJSON(JSON.parse(data),salonId);
          SRGM.GLOBALS.mesas.refresh("WHERE  a.Salon = '"+salonId+"'");
        break;

        case "ComandaStatus":
          if (data !== "noComanda"){
            var salonId = mensage[2];
            var mesaId = mensage[3];
            SRGM.GLOBALS.DB.statusComandafromJSON(JSON.parse(data),salonId,mesaId);
            SRGM.GLOBALS.comandas.onSelected("WHERE  a.Mesa = "+mesaId+" and  a.Salon = "+salonId+" and a.Abierto = 1");
          }  
        break;
           
        case "Configuration":   
          SRGM.GLOBALS.DB.setConfiguration(data,"LineasConjuntas");
        break;

        case "Time":
          console.log(data);           
        break;
        
        default:
           console.log('accion desconocida');
        break;

           }

    };
    SGRconection.socket.onerror = function (e) {
      console.log('error occurred!' + e.code);
     // for (var index in e){
     //   console.log(index+" : "+e[index]);
     // }
      SGRconection.view.conexionError();
      SGRconection.setStatus("Cerrado");
    };

    SGRconection.socket.onclose = function (event) {
      SGRconection.view.closeConection();
      console.log('close code=' + event.code);
     SGRconection.setStatus("Cerrado");
    };
  }


  this.getDatabase =  function(){

       SGRconection.DBbuffer = []; //
       SGRconection.ndbChunks = 0;
       SGRconection.chargedChunks = 0;
       SGRconection.send( SGRconection.idDispositivo+"$$$getDataBase$$$Consiguiendo DB");  
       SGRconection.view.startConection();
  }

  this.getImages =  function(){
   
      SGRconection.ImageBuffer = []; //
      SGRconection.ndbChunksImages = 0;
      SGRconection.chargedImageChunks = 0;
      SGRconection.send( SGRconection.idDispositivo +"$$$getDataImages$$$Consiguiendo Imagenes"); 
      SGRconection.view.startConection(); 
  }

  this.sendComanda = function(comanda){  
        var JsonComandaArray = JSON.stringify(comanda,null,'');
        console.log(SGRconection.idDispositivo +"$$$sendComanda$$$"+JsonComandaArray);
        SGRconection.send( SGRconection.idDispositivo +"$$$sendComanda$$$"+JsonComandaArray);
      
  }

  this.getSalonStatus = function(idSalon){
      SGRconection.send( SGRconection.idDispositivo +"$$$getSalonStatus$$$"+idSalon);
  }
  this.getComandaStatus = function(idSalon,idMesa){
     SGRconection.send( SGRconection.idDispositivo +"$$$getComandaStatus$$$"+idSalon+"$$$"+idMesa);
  }
  this.cancelComanda = function(idSalon,idMesa){
      SGRconection.send( SGRconection.idDispositivo +"$$$cancelComanda$$$"+idSalon+"$$$"+idMesa); 
  }

  this.send = function(mensaje){
    if (SGRconection.status === "Cerrado"){
      SGRconection.establecerConexion();
      try{
       setTimeout(function () {SGRconection.socket.send(mensaje);}, 1000);
      }catch(err){
        console.error("Conexion aun no establecida");
      }
       
     // 
    }else{
      SGRconection.socket.send(mensaje); 
    }
  }

  this.EnableNavigation = function(){
      SGRconection.view.dataReady();
  }

  this.DataBaseWorking = function(){
      SGRconection.view.dataBaseWorking();
  }


  /*this.getIconView = function(){
    return SGRconection.iconView.getView();
  }*/
  this.refreshFunctionalityIcon = function(){
    SGRconection.iconView.refreshFunctionality();
  }

  this.dataReady = function(){
    SGRconection.view.dataReady();
  }


  this.onSelected = function(){
    SCTI.gotoView(SGRconection.container);
  }


  this.getHead = function(){
    return SGRconection.view.getHead();
  }

}



