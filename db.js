var wc = {};
wc.webdb = {};
wc.webdb.db = null;

wc.webdb.open = function() {
    var dbSize = 5 * 1024 * 1024; // 5MB
    wc.webdb.db = openDatabase("history", "1.0", "Chat manager", dbSize);
}

wc.webdb.createTable = function() {
    var db = wc.webdb.db;
    db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS messages(ID INTEGER PRIMARY KEY ASC, msg TEXT, time DATETIME, who TEXT)", [],wc.webdb.onSuccessT,wc.webdb.onError);
    });
}

wc.webdb.addMsg = function(messg) {
    var db = wc.webdb.db;
    db.transaction(function(tx){
        tx.executeSql("INSERT INTO messages(msg, time, who) VALUES (?,?,?)",
            [messg.what, messg.when, messg.who],
            wc.webdb.onSuccessT(),
            wc.webdb.onError);
    });
}

wc.webdb.onError = function(tx, e) {
    alert("There has been an error: " + e.message);
}

wc.webdb.onSuccess = function(tx, r) {
    // re-render the data.
    wc.webdb.getAllTodoItems(loadTodoItems);
}

wc.webdb.onSuccessT = function(tx, r) {
    // re-render the data.
}


wc.webdb.getAllTodoItems = function(renderFunc) {
    var db = wc.webdb.db;
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM messages", [], renderFunc,
            wc.webdb.onError);
    });
}

function loadTodoItems(tx, rs) {
    for (var i=0; i < rs.rows.length; i++) {
        var mess = rs.rows.item(i);

        var nachricht = {};
        nachricht.what = mess.msg;
        nachricht.who = mess.who;
        nachricht.when = mess.time;

        newBubble(nachricht);
    }
}

function init() {
    wc.webdb.open();
    wc.webdb.createTable();
    wc.webdb.getAllTodoItems(loadTodoItems);
}
