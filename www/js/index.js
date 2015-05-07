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
        
        GLOBALS = {};
        GLOBALS.Players = {};
        GLOBALS.current = {};
        


        GLOBALS.estado = {};
        GLOBALS.current.estado = "home";
        GLOBALS.facciones = [];
        for (var i in facciones){
            var newFaction = new OCM.Faction({name:facciones[i].name,id:i,img:facciones[i].img,unitList:unidades[i]});
            $("#home").append(newFaction.getIcon());
            GLOBALS.facciones.push(newFaction);

        }


        var grupos = {grupo1:new OCM.Group(),grupo2:new OCM.Group(),grupo3:new OCM.Group()};
        GLOBALS.current.group = grupos.grupo1;
        for (var i in grupos){
           (function(i){ $("#"+i).append(grupos[i].getView());
            $("#"+i+"tab").on("tap",function(){
                GLOBALS.gruopSelection[i]();
            });})(i);
        }        

        GLOBALS.gruopSelection = {};

        GLOBALS.gruopSelection.grupo1 = function(){
                GLOBALS.current.group = grupos.grupo1;
            $(".tab").removeClass("selected");
            $("#grupo1tab").addClass("selected");
            $("#grupo1").removeClass("left").removeClass("right");
             $("#grupo2").removeClass("left").addClass("right");
             $("#grupo3").removeClass("left").addClass("right");
        }


        GLOBALS.gruopSelection.grupo2 = function(){
            GLOBALS.current.group = grupos.grupo2;
             $(".tab").removeClass("selected");
            $("#grupo2tab").addClass("selected");
            $("#grupo2").removeClass("left").removeClass("right");
             $("#grupo1").removeClass("right").addClass("left");
             $("#grupo3").removeClass("left").addClass("right");
        }


        GLOBALS.gruopSelection.grupo3 = function(){
                GLOBALS.current.group = grupos.grupo3;
             $(".tab").removeClass("selected");
            $("#grupo3tab").addClass("selected");
            $("#grupo3").removeClass("left").removeClass("right");
             $("#grupo1").removeClass("right").addClass("left");
             $("#grupo2").removeClass("right").addClass("left");
        }


        GLOBALS.estado.home = function(){
            console.log("estado home");
            GLOBALS.current.estadoBack  = GLOBALS.current.estado;
              GLOBALS.current.estado = "home";
            $("#home").removeClass("left");
            $("#Grupos").addClass("right");
        }

        GLOBALS.estado.grupos = function(){
       
            GLOBALS.current.estadoBack  = GLOBALS.current.estado;
            GLOBALS.current.estado = "grupos";
            $("#home").addClass("left");
            $("#Grupos").removeClass("right");
            console.log( GLOBALS.current.estado );
        } 
       
        GLOBALS.gruopSelection.grupo1();
        
        
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