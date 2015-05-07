function isTablet() {
    if (window.innerWidth > 700){
        return true;
    }
    else{
        return false;
    }
    //return {Width:window.innerWidth,Height:window.innerHeight};
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        
     
        if (isTablet()){
            SCTI.SetContainers(["Conexion","Camareros","Salones","Mesas","comandaSelection"]);
            $(".Tablet").addClass("TabletOn");
            $(".children").removeClass("children");
        }else{

            SCTI.SetContainers(["Conexion","Camareros","Salones","Mesas","Comandas","Familias","Subfamilias","Articulos"]);
        }
        SRGM.GLOBALS.DB = new SRGDatabase();
        SRGM.GLOBALS.Conection = new SGRConection();


        var camareroMap ={
            footIcon:"img/camarero.png",
            consulta:"SELECT a.* from CAMAREROS a",
            model: SRGM.Camarero,
            configuration:"CamareroCode",
             table:"CAMAREROS"
        }
        var salonMap ={
            footIcon:"img/salon.png",
            consulta:"SELECT a.* from SALONES a",
            model: SRGM.Salon,
            configuration:"SalonCode",
            table:"SALONES"
        }
        var mesaMap ={
            footIcon:"img/mesa.png",
            consulta:"SELECT a.*, b.Comensales from MESAS a LEFT JOIN COMANDAS b ON a.Salon = b.Salon and a.Mesa = b.Mesa and b.Abierto = 1",
            model: SRGM.Mesa,
            inputNumerico: true,
             table:"MESAS"
        }
        var comandaMap = {
            footIcon:"img/venta.png",
            consultaFather:"SELECT a.* from COMANDAS a ",
            consultaChildrens:"SELECT a.IdComanda, a.IdArticulo,a.Precio,a.Enviado,b.Nombre,count(*) as CantidadTotal, count(*) - sum(a.Enviado) as CantidadNueva from  (SELECT * from LINEASCOMANDAS t ORDER BY t.insertDate ) a LEFT JOIN ARTICULOS b on a.IdArticulo = b.Id ", 
            groupByChildren:"GROUP BY a.IdArticulo ORDER BY a.insertDate DESC",
            isFather:true,
            fatherIdKey:"a.IdComanda",
            childrenmodel: SRGM.LineaComanda,
            fathermodel: SRGM.Comanda,
            viewAdds: [SRGM.BotoneraComanda],
            forwardEnable: true,
            table:"COMANDAS",
            onLoadAction:function(handler){
            SRGM.setComanda(handler.entityList[0]);
            SRGM.GLOBALS.familias.refresh();
            }
        }


        var familiaMap ={
            footIcon:"img/venta.png",
            consulta:"SELECT a.* from FAMILIAS a",
            model: SRGM.Familia,
            table:"FAMILIAS",
            swapContainer:"Subfamilias",
            swapDirection:"left"
        }
        var subfamiliaMap ={
            footIcon:"img/venta.png",
            consulta:"SELECT a.* from SUBFAMILIAS a",
            model: SRGM.Subfamilia,
            onLoadAction: function(handler){
            if (handler.entityList.length === 0)
                {   $("#"+handler.container).data("omit","true");
                    SRGM.GLOBALS.articulos.onSelected(handler.restriction);
                    if (isTablet())SRGM.GLOBALS.familias.onSelected();
                }
            else{$("#"+handler.container).data("omit","false");}},
            table:"SUBFAMILIAS",
            swapContainer:"Familias",
            swapDirection:"right"
        }
        var articuloMap ={
            footIcon:"img/venta.png",
            consulta:"SELECT a.* from ARTICULOS a",
            model: SRGM.Articulo,
            table:"ARTICULOS"
        }






        SRGM.GLOBALS.camareros =    new SRGM.Handler("Camareros",camareroMap);
        SRGM.GLOBALS.salones =      new SRGM.Handler("Salones",salonMap);
        SRGM.GLOBALS.mesas =        new SRGM.Handler("Mesas",mesaMap);
        if (isTablet()){
            console.log("creando children handlers");
            SRGM.GLOBALS.comandas =     new SRGM.ChildrenHandler("comandaSelection","Comanda",comandaMap);
            SRGM.GLOBALS.familias =     new SRGM.ChildrenHandler("comandaSelection","Familias",familiaMap);
            SRGM.GLOBALS.subfamilias =  new SRGM.ChildrenHandler("comandaSelection","Subfamilias",subfamiliaMap);
            SRGM.GLOBALS.articulos =    new SRGM.ChildrenHandler("comandaSelection","Articulos",articuloMap);
        }else{
             SRGM.GLOBALS.comandas =    new SRGM.Handler("Comanda",comandaMap);
            SRGM.GLOBALS.familias =     new SRGM.Handler("Familias",familiaMap);
            SRGM.GLOBALS.subfamilias =  new SRGM.Handler("Subfamilias",subfamiliaMap);
            SRGM.GLOBALS.articulos =    new SRGM.Handler("Articulos",articuloMap);
        }
       




        SRGM.GLOBALS.footer = new SCTI.Foot_view([SRGM.GLOBALS.Conection,SRGM.GLOBALS.camareros,SRGM.GLOBALS.comandas]);
        $("#foot").append(SRGM.GLOBALS.footer.getView());
        SRGM.GLOBALS.footer.refreshFunctionality();

        SRGM.GLOBALS.Menu = new SCTI.Menu(SRGM);
        $("#menu").append(SRGM.GLOBALS.Menu.getView());
        SRGM.GLOBALS.Menu.refreshFunctionality();

         SRGM.GLOBALS.Head_view = new SCTI.Head_view(SRGM.GLOBALS.Menu);
        $("#head").append(SRGM.GLOBALS.Head_view.getView());
        SRGM.GLOBALS.Head_view.refreshFunctionality();


        var vista_conexion = new SCTI.Mobile_view(SRGM,
           {titulo:"Conexion",backRoute:"Null",menuType:"conexion",
           elemento: SRGM.GLOBALS.Conection,container:"Conexion"});
        //$("#Ventas").append(vista.getView());
        var vista_camareros = new SCTI.Mobile_view(SRGM,
           {titulo:"Camareros",backRoute:"Null",menuType:"null",
           elemento: SRGM.GLOBALS.camareros,container:"Camareros"});

         var vista_salones = new SCTI.Mobile_view(SRGM,
           {titulo:"Salones",backRoute:"Null",menuType:"null",
           elemento: SRGM.GLOBALS.salones,container:"Salones"});

          var vista_mesas = new SCTI.Mobile_view(SRGM,
           {titulo:"Mesas",backRoute:"Null",menuType:"null",
           elemento: SRGM.GLOBALS.mesas,container:"Mesas"});

        var vista_comandas = new SCTI.Mobile_view(SRGM,
           {titulo:"Comanda",backRoute:"Null",menuType:"null",
           elemento: SRGM.GLOBALS.comandas,container:"Comandas"});

        var vista_familias = new SCTI.Mobile_view(SRGM,
           {titulo:"Familias",backRoute:"Null",menuType:"null",
         elemento: SRGM.GLOBALS.familias,container:"Familias"});

        var vista_subfamilias = new SCTI.Mobile_view(SRGM,
           {titulo:"Subfamilias",backRoute:"Null",menuType:"null",
         elemento: SRGM.GLOBALS.subfamilias,container:"Subfamilias"});

        var vista_articulos = new SCTI.Mobile_view(SRGM,
           {titulo:"Articulos",backRoute:"Null",menuType:"null",
         elemento: SRGM.GLOBALS.articulos,container:"Articulos"});

       

         
        vista_conexion.refreshFunctionality();
        vista_camareros.refreshFunctionality();
        vista_salones.refreshFunctionality();
        vista_mesas.refreshFunctionality();
        vista_comandas.refreshFunctionality();
        vista_familias.refreshFunctionality();
        vista_subfamilias.refreshFunctionality();
        vista_articulos.refreshFunctionality();
        SCTI.gotoView("Conexion");
        
        

        
        
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        console.log("onDeviceReady");
        SRGM.GLOBALS.Conection.establecerConexion();
    },
    
    
    
    
    // Update DOM on a Received Event
    
    
    
    receivedEvent: function(id) {
          /*    
            var ws = new WebSocket('ws://172.17.1.12:8100');

            ws.onopen = function () {
                console.log('open');
                this.send('0//pedirDB// conexion establecida');         // transmit "hello" after connecting
            };

            ws.onmessage = function (event) {
                console.log(event.data);    // will be "hello"
                this.close();
            };

            ws.onerror = function () {
                console.log('error occurred!');
            };

            ws.onclose = function (event) {
                console.log('close code=' + event.code);
            };
        */
    }
};

app.initialize();