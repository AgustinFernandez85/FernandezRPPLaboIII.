function $(id) {
    return document.getElementById(id);
}
var idMateria;
var listaMaterias;
var id;
function cerrar(){
    let cuadro = document.getElementsByClassName("cuadro-modal");
    cuadro[0].hidden = true;
}

function cargarUsuarios() {
    document.getElementById("spinner").hidden = false;
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let respuesta = JSON.parse(this.response);
            listaMaterias = respuesta;
            console.log(respuesta);
            var body = document.getElementsByTagName("body")[0];

            var tabla = document.createElement("table");
            var tblBody = document.createElement("tbody");
            var tblHead = document.createElement("thead");

            for (var i = 0; i < listaMaterias.length; i++) {
                if (i == 0) {
                    var row = document.createElement("tr");
                    for (var z = 0; z < 4; z++) {
                        var tablaData = document.createElement("th");
                        switch (z) {
                            case 0:
                                var textoCelda = document.createTextNode("Nombre");
                                break;
                            case 1:
                                var textoCelda = document.createTextNode("Cuatrimestre");
                                break;
                            case 2:
                                var textoCelda = document.createTextNode("Fecha Final");
                                break;
                            case 3:
                                var textoCelda = document.createTextNode("Turno");
                                break;
                        }
                        tablaData.appendChild(textoCelda);
                        row.appendChild(tablaData);
                    }
                    tblHead.appendChild(row);
                }
                var hilera = document.createElement("tr");

                for (var j = 0; j < 4; j++) {
                    var celda = document.createElement("td");
                    switch (j) {
                        case 0:
                            var textoCelda = document.createTextNode(listaMaterias[i].nombre);
                            break;
                        case 1:
                            var textoCelda = document.createTextNode(listaMaterias[i].cuatrimestre);
                            break;
                        case 2:
                            var textoCelda = document.createTextNode(listaMaterias[i].fechaFinal);
                            break;
                        case 3:
                            var textoCelda = document.createTextNode(listaMaterias[i].turno);
                            break;
                    }
                    celda.appendChild(textoCelda);
                    hilera.appendChild(celda);
                }
                if(i % 2 != 0){
                    hilera.className = "colorPar";
                }
                tblBody.appendChild(hilera);
                hilera.addEventListener("click",cuadroModal);
            }

            tabla.appendChild(tblHead);
            tabla.appendChild(tblBody);
            body.appendChild(tabla);

            tabla.className = "prueba";
            document.getElementById("spinner").hidden = true;
            
        }
    };
    xhttp.open("GET", "http://localhost:3000/materias", true, "usuario", "pass");
    xhttp.send();
}

function cuadroModal(event){
    let cuadro = document.getElementsByClassName("cuadro-modal");
    cuadro[0].hidden = false;

    var fila = event.target.parentNode; 
    var nombre = fila.childNodes[0].innerHTML;
    var cuatrimestre = fila.childNodes[1].innerHTML;
    var fechaFinal = fila.childNodes[2].innerHTML;
    var turno = fila.childNodes[3].innerHTML;
    
    for (let i = 0; i < listaMaterias.length; i++) {
        if(listaMaterias[i].nombre == nombre && listaMaterias[i].cuatrimestre == cuatrimestre){
            idMateria = listaMaterias[i].id;
            break;
        }
    }
    
    let anio = fechaFinal.slice(6);
    let mes = fechaFinal.slice(3,5);
    let dia = fechaFinal.slice(0,2);

    var fechaCompleta = anio+'-'+mes+'-'+dia;
    $("nombre").value = nombre;
    $("fecha").value = fechaFinal;
    if(turno == "Mañana"){
        $("mañana").checked = true;
    }else if (turno == "Noche"){
        $("noche").checked = true;
    }

    addOptions("cuatrimestre", cuatrimestre);
}

window.addEventListener("load", () => {
    cargarUsuarios();
});

function modificarBoton()
{
    let flagNombre = true;
    let flagcuatrimestre = true;
    let flagturno = true;
    let flagfechaFinal = true;
    
    if($("nombre").value.length < 7)
    {
        
        $("nombre").style.borderColor="red";          
        flagNombre = false;

    }

    if($("fecha").value < Date.now()){
        flagfechaFinal = false;
    }

    if(!($("noche").checked || $("mañana").checked))
    {
        flagturno = false;
    }

    if(flagNombre && flagcuatrimestre && flagturno && flagfechaFinal)
    {
        var nombreInput= $("nombre").value;
        var cuatrimestreInput = $("cuatrimestre").value;
        var turnoInput;
        var fecha = $("fecha").value;

        if($("noche").checked)
        {
            turnoInput = "Mañana";
            $("mañana").checked = false;
        }else{
            turnoInput = "Noche";
            $("noche").checked = false;
        }

        var jsonMateria={"id":idMateria, "nombre":nombreInput,"cuatrimestre":cuatrimestreInput,"fechaFinal":fecha,"turno":turnoInput}

        var peticion = new XMLHttpRequest();
        peticion.onreadystatechange = function() 
        {
            
            if(peticion.status == 200 && peticion.readyState == 4)
            {
                $("spinner").hidden = true;
                
                fila.childNodes[0].innerHTML = nombreInput;
                fila.childNodes[1].innerHTML = cuatrimestreInput;           
            }
        }

        peticion.open("POST","http://localhost:3000/editar");
        peticion.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        peticion.send(JSON.stringify(jsonMateria));
        
        $("spinner").hidden = false;   
        window.location.reload(true);     
        //cargarUsuarios();
    }else{

    }
}

function eliminarBoton(){
    var jsonMateria = {"id":idMateria};
    var peticion = new XMLHttpRequest();
        peticion.onreadystatechange = function() 
        {
            
            if(peticion.status == 200 && peticion.readyState == 4)
            {
                $("spinner").hidden = true;
                window.location.reload(true);    
            }
        }

        peticion.open("POST","http://localhost:3000/eliminar");
        peticion.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        peticion.send(JSON.stringify(jsonMateria));
}

function addOptions(domElement,fechaFinal){
    var select = document.getElementsByName(domElement)[0];
    var option = document.createElement("option");
    option.className = "opcionn";
    option.text = fechaFinal;
    select.add(option);
}
