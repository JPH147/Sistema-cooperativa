<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/venta.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $venta = new Venta($db);
        $data = json_decode(file_get_contents('php://input'), true);

        if (($_POST["prventanueva"])!=null)
        {

            $venta->venta_nueva=trim($_POST["prventanueva"]);
            $venta->venta_anterior=trim($_POST["prventaanterior"]);

            if($venta->create_canje())
            {
                print_json("0000", "Se creó el canje satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear el canje.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al eliminar el canje.", $exception->getMessage());
    }

?>