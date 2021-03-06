<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/productoserie.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $productoserie = new ProductoSerie($db);
        $data = json_decode(file_get_contents('php://input'), true);

        if ($_POST["prserie"]!=null)
        {
            $productoserie->id_producto = trim($_POST["prproducto"]);
            $productoserie->serie = trim($_POST["prserie"]);
            $productoserie->color = trim($_POST["prcolor"]);
            $productoserie->almacenamiento = trim($_POST["pralmacenamiento"]);
            $productoserie->precio_compra = trim($_POST["prprecio"]);
            
            if($productoserie->create())
            {
                print_json("0000", "Se creó el producto satisfactoriamente.", $productoserie->id);
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear el producto.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al eliminar el producto.", $exception->getMessage());
    }

?>