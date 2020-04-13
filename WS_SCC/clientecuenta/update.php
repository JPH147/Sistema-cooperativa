<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/clientecuenta.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $clientecuenta = new ClienteCuenta($db);
        $data = json_decode(file_get_contents('php://input'), true);

        if (($_POST["prid"])!=null)
        {
            $clientecuenta->id_cuenta = trim($_POST["prid"]);
            $clientecuenta->banco = trim($_POST["prbanco"]);
            $clientecuenta->cuenta = trim($_POST["prcuenta"]);
            $clientecuenta->cci = trim($_POST["prcci"]);

            if($clientecuenta->update())
            {
                print_json("0000", "Se creó la cuenta satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear la cuenta.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al eliminar la cuenta.", $exception->getMessage());
    }

?>