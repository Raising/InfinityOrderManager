//name: "Solinsur RESTAGEST Conection";

SGRConection = function(){

	var SGRconection = this;
	this.socket;
	this.ip = "172.17.1.12";
	this.puerto = "8100";
	this.DBbuffer = [];
  this.ImageBuffer= [];
  this.ndbChunks = 0;
  this.ndbChunksImages = 0;
  this.chargedChunks = 0;
  this.chargedImageChunks = 0;
  this.view = new SCTI.Conexion_view(this);
  this.vistas  = {};

  this.setConfig = function(ip,puerto){
    SGRconection.ip = ip;
    SGRconection.puerto = puerto;
    console.log("IP y puerto establecidos a: "+ip+":"+puerto);
  }
  this.getIp = function(){
    return SGRconection.ip;
  }

  this.getPuerto = function(){
    return SGRconection.puerto;
  }

  this.establecerConexion = function(){
    SGRconection.socket =  new WebSocket('ws://'+SGRconection.ip+':'+SGRconection.puerto);

    SGRconection.socket.onopen = function () {
      console.log('open');
      SGRconection.getDatabase();
              //this.send("689//conection//estableciendo conexion");
            };
            SGRconection.socket.onmessage = function (event) {
             //console.log(event.data);    // will be "hello"
             var mensage = event.data.split("$$$");

             var action = mensage[0];            
             var data = mensage[1];
				//console.log(data,action);
        switch(action){
         case "newDB":
         var chunk = mensage[2];
                        // console.log('recibiendo Base de datos');
                        SGRconection.DBbuffer[chunk] = data;
                        SGRconection.chargedChunks++;

                        if (SGRconection.chargedChunks == SGRconection.ndbChunks && SGRconection.ndbChunks != 0){
                         SGRconection.chargedChunks = 0;
                         SGRconection.ndbChunks = 0;
                         var DBjsonString = "";
                         for (var i = 0; i< SGRconection.DBbuffer.length;i++){
                          DBjsonString += SGRconection.DBbuffer[i];

                        }       
              //console.log(DBjsonString);

              SRGM.GLOBALS.DB.setDBfromJSON(DBjsonString);

              SGRconection.EnableNavigation();
              SGRconection.getImages();
              
            }
            break;
            case "newImages":
              var chunk = mensage[2];
            // console.log('recibiendo Base de datos');
              SGRconection.ImageBuffer[chunk] = data;
              SGRconection.chargedImageChunks++;
              // console.log("chunk n:"+chunk+ " total = "+SGRconection.ndbChunksImages);
              if (SGRconection.chargedImageChunks == SGRconection.ndbChunksImages && SGRconection.ndbChunksImages != 0){
              SGRconection.ndbChunksImages = 0;
              SGRconection.chargedImageChunks = 0;
              var ImagejsonString = "";
              for (var i = 0; i< SGRconection.ImageBuffer.length;i++){
                ImagejsonString += SGRconection.ImageBuffer[i];

              }       
           

              SRGM.GLOBALS.DB.setImagesfromJSON(ImagejsonString);
              
              SGRconection.view.StandBy();
              
            }
            break;

            case "pedidoAceptado":
 						//console.log('Confirmado pedido recibido por el server');
             break;
             case "numberOfChunksDB":
             SGRconection.ndbChunks = data;                      
             break;
             case "numberOfChunksImages":
             SGRconection.ndbChunksImages = data;
             break;

             case "time":

             break;
             default:
             console.log('accion desconocida');
             break;

           }

         };
    SGRconection.socket.onerror = function () {
      console.log('error occurred!');
      SGRconection.view.conexionError();
    };

    SGRconection.socket.onclose = function (event) {
      SGRconection.view.closeConection();
      console.log('close code=' + event.code);
    };
  }


  this.getDatabase =  function(){
       SGRconection.DBbuffer = []; //
       SGRconection.ndbChunks = 0;
       SGRconection.chargedChunks = 0;
       SGRconection.socket.send("689$$$getDataBase$$$Consiguiendo DB");  
       SGRconection.view.startConection();
  }

  this.getImages =  function(){
      SGRconection.ImageBuffer = []; //
      SGRconection.ndbChunksImages = 0;
      SGRconection.chargedImageChunks = 0;
      SGRconection.socket.send("689$$$getDataImages$$$Consiguiendo Imagenes"); 
      SGRconection.view.startConection(); 
  }

  this.EnableNavigation = function(){
      SGRconection.view.dataReady();
  }

  this.DataBaseWorking = function(){
      SGRconection.view.dataBaseWorking();
  }


  this.getIconView = function(){
    return SGRconection.iconView.getView();
  }
  this.refreshFunctionalityIcon = function(){
    SGRconection.iconView.refreshFunctionality();
  }



  this.onSelected = function(){
    SCTI.gotoView(SGRconection.container);
  }


}



