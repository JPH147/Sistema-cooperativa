<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/direcciondistrito.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $distrito = new Distrito($db);
        $data = json_decode(file_get_contents('php://input'),true);

        if(($_POST["prid"])!=null)
        {
            $distrito->id_distrito = $_POST["prid"];
            $distrito->id_provincia = trim($_POST["prprovincia"]);
            $distrito->dst_nombre = trim($_POST["prnombre"]);


            if($distrito->update())
            {
                    print_json("0000", "Se actualizó el distrito satisfactoriamente.", "");
            }
            else
            {
                    print_json("9999", "Ocurrió un error al actualizar el distrito.", "");
            }
        }
        else
        {
                print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al actualizar el distrito.", $exception->getMessage());
    }

?>