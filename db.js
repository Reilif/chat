/**
 * Created by Robin on 13.04.2015.
 */
var html5rocks = {};
html5rocks.webdb = {};

html5rocks.webdb.db = null;

html5rocks.webdb.open = function() {
    var dbSize = 5 * 1024 * 1024; // 5MB
    html5rocks.webdb.db = openDatabase("Todo", "1", "Todo manager", dbSize);
}

html5rocks.webdb.onError = function(tx, e) {
    alert("There has been an error: " + e.message);
}

html5rocks.webdb.onSuccess = function(tx, r) {
    // re-render the data.
    // loadTodoItems is defined in Step 4a
    html5rocks.webdb.getAllTodoItems(loadTodoItems);
}

html5rocks.webdb.createTable = function() {
    var db = html5rocks.webdb.db;
    db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS " +
        "todo(ID INTEGER PRIMARY KEY ASC, todo TEXT, added_on DATETIME)", []);
    });
}

html5rocks.webdb.addTodo = function(todoText) {
    var db = html5rocks.webdb.db;
    db.transaction(function(tx){
        var addedOn = new Date();
        tx.executeSql("INSERT INTO todo(todo, added_on) VALUES (?,?)",
            [todoText, addedOn],
            html5rocks.webdb.onSuccess,
            html5rocks.webdb.onError);
    });
}

html5rocks.webdb.getAllTodoItems = function(renderFunc) {
    var db = html5rocks.webdb.db;
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM todo", [], renderFunc,
            html5rocks.webdb.onError);
    });
}