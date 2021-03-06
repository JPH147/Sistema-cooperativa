<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/cobranza.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $cobranza = new Cobranzas($db);

        if (($_POST["prcliente"])!=null)
        {
            $cobranza->fecha=trim($_POST["prfecha"]);
            $cobranza->cliente=trim($_POST["prcliente"]);
            $cobranza->cuenta=trim($_POST["prcuenta"]);
            $cobranza->operacion=trim($_POST["properacion"]);
            $cobranza->referente=trim($_POST["prreferente"]);
            $cobranza->monto=trim($_POST["prmonto"]);
            $cobranza->tipo_transaccion=trim($_POST["prtipotransaccion"]);
            $cobranza->transaccion=trim($_POST["prtransaccion"]);
            $cobranza->observaciones=trim($_POST["probservaciones"]);

            $cobranza->usuario_alvis=trim($_POST["usuario_alvis"]);
            
            if($cobranza->create_directa_masivo())
            {
                print_json("0000", "Se creó la cobranza satisfactoriamente.", true);
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear la cobranza.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al crear la cobranza.", $exception->getMessage());
    }

?>