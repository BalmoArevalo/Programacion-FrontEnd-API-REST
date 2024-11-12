var fila = "<tr><td class='id'></td><td class='foto'></td><td class='price'></td><td class='title'></td><td class='description'></td><td class='category'></td><td class='acciones'></td></tr>";
var productos = null;
var orden = 0;

function codigoCat(catstr) {
    var code = "null";
    switch (catstr) {
        case "electronicos": code = "c1"; break;
        case "joyeria": code = "c2"; break;
        case "caballeros": code = "c3"; break;
        case "damas": code = "c4"; break;
    }
    return code;
}

function listarProductos(productos) {
    var precio = document.getElementById("price");
    precio.setAttribute("onclick", "orden*=-1;listarProductos(productos);");
    var num = productos.length;
    var listado = document.getElementById("listado");
    var ids, titles, prices, descriptions, categories, fotos, acciones;
    var tbody = document.getElementById("tbody"), nfila = 0;
    tbody.innerHTML = "";
    var catcode;
    for (i = 0; i < num; i++) tbody.innerHTML += fila;
    var tr;
    ids = document.getElementsByClassName("id");
    titles = document.getElementsByClassName("title");
    descriptions = document.getElementsByClassName("description");
    categories = document.getElementsByClassName("category");
    fotos = document.getElementsByClassName("foto");
    prices = document.getElementsByClassName("price");
    acciones = document.getElementsByClassName("acciones");
    if (orden === 0) { orden = -1; precio.innerHTML = "Precio" }
    else
        if (orden == 1) { ordenarAsc(productos, "price"); precio.innerHTML = "Precio A"; precio.style.color = "darkgreen" }
        else
            if (orden == -1) { ordenarDesc(productos, "price"); precio.innerHTML = "Precio D"; precio.style.color = "blue" }

    listado.style.display = "block";
    for (nfila = 0; nfila < num; nfila++) {
        ids[nfila].innerHTML = productos[nfila].id;
        titles[nfila].innerHTML = productos[nfila].title;
        descriptions[nfila].innerHTML = productos[nfila].description;
        categories[nfila].innerHTML = productos[nfila].category;
        catcode = codigoCat(productos[nfila].category);
        tr = categories[nfila].parentElement;
        tr.setAttribute("class", catcode);
        prices[nfila].innerHTML = "$" + productos[nfila].price;
        fotos[nfila].innerHTML = "<img src='" + productos[nfila].image + "'>";
        fotos[nfila].firstChild.setAttribute("onclick", "window.open('" + productos[nfila].image + "');");
        acciones[nfila].innerHTML = "<button onclick='eliminarProducto(" + nfila + ")'>Eliminar</button>";
    }
}

function obtenerProductos() {
    fetch("https://api-generator.retool.com/NJcNb8/productos")
        .then(res => res.json())
        .then(data => { 
            productos = data; 
            productos.forEach(    
                function(producto){
                producto.price = parseFloat(producto.price);
                }
            );
            listarProductos(data) 
        })
}

function ordenarDesc(p_array_json, p_key) {
    p_array_json.sort(function (a, b) {
        if (a[p_key] > b[p_key]) return -1;
        if (a[p_key] < b[p_key]) return 1;
        return 0;
    });
}

function ordenarAsc(p_array_json, p_key) {
    p_array_json.sort(function (a, b) {
        if (a[p_key] > b[p_key]) return 1;
        if (a[p_key] < b[p_key]) return -1;
        return 0;
    });
}

function agregarProducto() {
    var nuevoTitulo = document.getElementById("nuevoTitulo").value;
    var nuevoPrecio = parseFloat(document.getElementById("nuevoPrecio").value);
    var nuevaDescripcion = document.getElementById("nuevaDescripcion").value;
    var nuevaCategoria = document.getElementById("nuevaCategoria").value;
    var nuevaImagen = document.getElementById("nuevaImagen").value;

    var nuevoProducto = {
        id: productos.length + 1, // Generar ID automáticamente
        title: nuevoTitulo,
        price: nuevoPrecio,
        description: nuevaDescripcion,
        category: nuevaCategoria,
        image: nuevaImagen
    };

    productos.push(nuevoProducto);
    listarProductos(productos);
}

function eliminarProducto(index) {
    productos.splice(index, 1);
    listarProductos(productos);
}