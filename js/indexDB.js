/**
 * Created by gecat on 2016/7/7.
 */
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
window.IDBCursor = window.IDBCursor || window || window.webkitIDBCursor || window.msIDBCursor;
var dbName = 'MyData';  //数据库名
var dbVersion = 20160705;//数据库版本号
var idb, datatable;
var data;
/* 连接数据库或者创建数据库*/
function window_onload() {
    var dbConnect = indexedDB.open(dbName, dbVersion);//连接数据库
    dbConnect.onsuccess = function (e) {   //连接成功
        idb = e.target.result;            //获取数据库
        showAllData(true);
    };
    dbConnect.onerror = function () {
        alert('数据库连接失败');
    };

    //创建对象仓库
    dbConnect.onupgradeneeded = function (e) {

        idb = e.target.result;
        if (!idb.objectStoreNames.contains('orders')) {
            var tx = e.target.transaction;
            tx.oncomplete = function () {
//                    showAllData(true);

            };
            tx.onabort = function (e) {
                alert('对象仓库创建失败');
            };
            var name = 'orders';
            var optionalParameters = {
                keyPath: 'id',
                autoIncrement: true
            };
            var store = idb.createObjectStore(name, optionalParameters);
            alert('对象仓库创建成功');
            //索引
            var name = 'codeIndex';
            var keyPath = 'name';
            var optionalParameters = {
                unique: true,
                multiEntry: false
            };
            var idx = store.createIndex(name, keyPath, optionalParameters);
            alert('创建索引成功');
        }
    };
}


//追加数据
function btnAdd_onclick() {
    var data = new Object();
    data.name = $('#name').val();
    data.price = $('#price').val();
    data.tag = $('#tag').val();
    data.src = $('#div_canvas_img').attr("src");
    if (data.name == "" || data.price == "" || data.src == "") {
        alert("请输入要添加的数据");
        return false;
    }
    var tx = idb.transaction(['orders'], 'readwrite');
    var chkErrorMsg = "";
    tx.oncomplete = function () {
        if (chkErrorMsg != "") {
            alert(chkErrorMsg);
        } else {
            alert("追加成功");
            showAllData(false);
        }
    };

    tx.onabort = function () {
        alert("追加数据失败");
    };
    var store = tx.objectStore('orders');
    var idx = store.index('codeIndex');
    var range = IDBKeyRange.only(data.name);
    var direction = "next";
    var req = idx.openCursor(range, direction);
    req.onsuccess = function () {
        var cursor = this.result;
        if (cursor) {
            chkErrorMsg = "输入的名字已经存在";
        } else {
            var value = {
                name: data.name,
                price: data.price,
                tag: data.tag,
                src: data.src
            };
            store.add(value);
        }
    };
    req.onerror = function () {
        alert("追加数据失败");
    };
    btnClear_onclick();
}

//修改数据
function btnUpdate_onclick() {
    var data = new Object();
    data.name = $('#name').val();
    data.price = $('#price').val();
    data.tag = $('#tag').val();
    data.src = $('#div_canvas_img').attr("src");

    var tx = idb.transaction(['orders'], "readwrite");
    tx.oncomplete = function () {
        alert("修改数据成功");
        showAllData(false);
    };
    tx.onabort = function () {
        alert("修改数据失败");
    };
    var store = tx.objectStore('orders');
    var idx = store.index('codeIndex');
    var range = IDBKeyRange.only(data.name);
    var direction = "next";
    var req = idx.openCursor(range, direction);
    req.onsuccess = function () {
        var cursor = this.result;
        if (cursor) {
            //console.log(data.src);
            var value = {
                id: cursor.value.id,
                name: data.name,
                price: data.price,
                tag: data.tag,
                src: data.src
            };
            cursor.update(value);
            btnClear_onclick();
        }
        else {
            alert("要更改的数据不存在");
        }
    };
    req.onerror = function () {
        alert("修改数据失败");
    };
}

//删除
function btnDelete_onclick() {
    var tx = idb.transaction(['orders'], 'readwrite');
    tx.oncomplete = function () {
        alert('删除数据成功');
        showAllData(false);
        btnNew_onclick();
    };
    tx.onabort = function () {
        alert("删除数据失败");
    };
    var store = tx.objectStore('orders');

    var idx = store.index('codeIndex');
    var range = IDBKeyRange.only(document.getElementById('name').value);
    var direction = "next";
    var req = idx.openCursor(range, direction);
    req.onsuccess = function () {
        var cursor = this.result;
        if (cursor) {
            cursor.delete();
            btnClear_onclick();
        }
        else {
            alert("要删除的数据不存在");
        }
    };
    req.onerror = function () {
        alert("删除数据失败");
    }
}


//显示数据
function showAllData(loadPage) {
    if (!loadPage) {
        removeAllData();
    }
    var tx = idb.transaction(['orders'], 'readonly');
    var store = tx.objectStore('orders');
    var range = IDBKeyRange.lowerBound(1);
    var direction = "next";
    var req = store.openCursor(range, direction);
    var i = 0;
    req.onsuccess = function () {
        var cursor = this.result;
        if (cursor) {
            i++;
            showData(cursor.value);
            cursor.continue();//继续向下检索
        }
    };
    req.onerror = function () {
        alert("检索数据失败");
    };
}

function findData(name) {
    var tx = idb.transaction(['orders'], 'readonly');
    var store = tx.objectStore('orders');
    var idx = store.index('codeIndex');
    var range = IDBKeyRange.only(name);
    var direction = "next";
    var req = idx.openCursor(range, direction);
    req.onsuccess = function () {
        var cursor = this.result;
        if (cursor) {
            $('#name').val(cursor.value.name);
            $('#price').val(cursor.value.price);
            $('#tag').val(cursor.value.tag);
            $('#div_canvas_img').attr("src", cursor.value.src);
            $('.div_file').children().eq(0).text("修改图片");
        }
    };
    req.onerror = function () {
        alert("查找数据失败");
    };

}


function removeAllData() {
    $('#show_left').children().remove();
    $('#name_datalist').children().remove();
}

function showData(row) {
    var show_result = document.getElementById('show_left');
    var p1 = document.createElement('p');
    p1.innerHTML = row.name;
    var p2 = document.createElement('p');
    p2.innerHTML = row.price;
//        var p3 = document.createElement('p');
//        p3.innerHTML = row.tag;
    var img = document.createElement('img');
    img.src = row.src;
    var div1 = document.createElement('div');
    var div2 = document.createElement('div');
    div1.appendChild(img);
    div2.appendChild(p1);
    div2.appendChild(p2);
//        div2.appendChild(p3);
    var a = document.createElement('a');
    a.appendChild(div1);
    a.appendChild(div2);
//        a.setAttribute("onclick", "click_btn();");
    var div = document.createElement('div');
    div.appendChild(a);
    div1.className = "content_top";
    div2.className = "content_bottom";
    div.className = "content";
//        document.body.appendChild(div);
    show_result.appendChild(div);


    ////为菜名添加提醒

    //var name_datalist = document.getElementById('name_datalist');
    //if (name_datalist) {
    //    var option = document.createElement('option');
    //    option.value = row.name;
    //    option.innerHTML = row.name;
    //    name_datalist.appendChild(option);
    //}
}

//按钮控制
function btnControl_onclick() {
    console.log("-------");
    if ($('#div_canvas_img').attr("src") == "") {
        $('#btnUpdate').attr("disabled", "disabled");
        $('#btnUpdate').css({
            "background-color": "red",
            "color": 'black'
        });
        $('#btnDelete').attr("disabled", "disabled");
        $('#btnDelete').css({
            "background-color": "red",
            "color": 'black'
        });
        console.log($('#name').val());
    }
    else {
        $('#btnUpdate').removeAttr("disabled");
        $('#btnUpdate').css({
            "background-color": "#ff7420",
            "color": 'white'
        });
        $('#btnDelete').removeAttr("disabled");
        $('#btnDelete').css({
            "background-color": "#ff7420",
            "color": 'white'
        });
    }
}

function btnClear_onclick() {
    $('#name').val("");
    $('#price').val("");
    $('#tag').val("");
    $('#div_canvas_img').attr("src", "");
    $('.div_file').children().eq(0).text("添加图片");
}
//删除数据库
function deleteDB(name) {
    indexedDB.deleteDatabase(name);
}
function close_IndexedDB() {
    Order_Idb.close();
}