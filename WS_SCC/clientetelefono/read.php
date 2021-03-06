<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/clientetelefono.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $clientetelefono = new ClienteTelefono($db);

        $clientetelefono->id_cliente = !empty($_GET['id_cliente']) ? trim($_GET['id_cliente']) : null;
        $clientetelefono->drc_relevancia = !empty($_GET['tlf_relevancia']) ? trim($_GET['tlf_relevancia']) : null;
        $clientetelefono->prpagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $clientetelefono->prtotalpagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 5;

        $telefono_list = $clientetelefono->read();
        $total_telefono = $clientetelefono->contar();

        if (count(array_filter($telefono_list))>0)
        { 
            print_json("0000", $total_telefono, $telefono_list);
         }
        else
        { print_json("0001", 0, null); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>