<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/cliente.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $cliente = new Cliente($db);

        $cliente->inst_nombre = !empty($_GET['pinst_nombre']) ? $_GET['pinst_nombre'] : null;
        $cliente->clt_dni = !empty($_GET['pclt_dni']) ? $_GET['pclt_dni'] : null;
        $cliente->clt_nombre = !empty($_GET['pclt_nombre']) ? $_GET['pclt_nombre'] : null;
        $cliente->clt_apellido = !empty($_GET['pclt_apellido']) ? $_GET['pclt_apellido'] : null;
        $cliente->clt_aporteinicio = !empty($_GET['pclt_aporteinicio']) ? $_GET['pclt_aporteinicio'] : null;
        $cliente->clt_aportefin = !empty($_GET['pclt_aportefin']) ? $_GET['pclt_aportefin'] : null;

        $cliente_list = $cliente->read();

        if (count(array_filter($cliente_list))>0)
        { 
            print_json("0000", "OK", $cliente_list);
         }
        else
        { print_json("0001", "No existen clientes registrados", null); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>