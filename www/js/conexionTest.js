var database;  
//var socket = io.connect("http://10.0.2.2:8080");

var socket = io.connect("http://172.17.1.12:8080");
console.log( "connecting");


function errorCB(tx, err) {
    console.error("Error processing SQL: "+err);
}
function successCB() {
	console.log("success!");
}
function poblarDB(tx,dataStreamed) {
	//console.log(dataSreamed.data);
	var data = dataStreamed.data;
	tx.executeSql('DROP TABLE IF EXISTS ARTICULOS');
    tx.executeSql('CREATE TABLE IF NOT EXISTS ARTICULOS (id unique, nombre, familia, subfamilia)');
    tx.executeSql('DROP TABLE IF EXISTS PEDIDOS');
    tx.executeSql('CREATE TABLE IF NOT EXISTS PEDIDOS (id unique, id_product, cantidad INT(11), num_pedido)');

	var valores = "("+data[0][0]+",'"+data[0][1]+"',' "+data[0][2]+"',' "+data[0][3]+"')";
	for (var i = 1; i< data.length; i++){
    	valores += ",("+data[i][0]+",'"+data[i][1]+"',' "+data[i][2]+"',' "+data[i][3]+"')";
    }
    tx.executeSql('INSERT INTO ARTICULOS (id , nombre, familia, subfamilia) VALUES '+ valores);

   
    tx.executeSql('SELECT * FROM ARTICULOS', [], function(tx,results){
    	var len = results.rows.length;
        for (var i = 0; i < len; ++i) {
           var row = results.rows.item(i);
         }
        console.log("BASE DE DATOS IMPORTADA");
    }); 
}

function getRows(tx,sqlSelect,callBack,callBackParams){
	tx.executeSql(sqlSelect, [], function(tx,results){
		console.log(results);
		callBack(results,callBackParams);
	});
}

function ejecutar(tx,sqlExecute){
	tx.executeSql(sqlExecute);
}


socket.on('ping', function (data) {
	console.log( data.message);
  socket.emit('pong', { message: 'Hello from client!' });
});


socket.on('SendDB', function (data) {
	
	var dataStreamed = JSON.parse(data.message);
	database = window.openDatabase("DB", "1.0", "Test DB", 1000000);
	database.transaction(function(tx){ poblarDB(tx, dataStreamed)},
			errorCB, successCB);
	
});

socket.on('connect', function () {
	console.log("connected");
});

socket.on('reconnect', function () {
	console.log("reconnected");
});

socket.on('disconnect', function () {
	console.log("disconnected");
});

socket.on('reconnecting', function () {
  console.log("reconnecting...");
});

socket.on('error', function () {
	console.log("error");
});


