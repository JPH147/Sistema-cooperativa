<?php

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: access");
	header("Access-Control-Allow-Methods: GET");
	header("Access-Control-Allow-Credentials: true");
	header('Content-Type: application/json');

	include_once '../config/database.php';
    include_once '../entities/productoserie.php';
	include_once '../shared/utilities.php';
	 
	$database = new Database();
	$db = $database->getConnection();
    $productoserie = new ProductoSerie($db);

	try
	{
	    $productoserie->id_producto_serie = isset($_GET['prid']) ? trim($_GET['prid']) : die();
	    
	    $productoserie->readxproducto();

	    $producto_serie_list = array(
	        "id"=>$productoserie->id_producto_serie,
            "id_producto"=>$productoserie->id_producto,
            "serie"=>$productoserie->serie,
            "estado"=>$productoserie->estado
	    );

	    if(trim($productoserie->id_producto_serie)!= ''){
	        print_json("0000", "OK", $producto_serie_list);
	    }
	    else{
	        print_json("0001", "No se encuentra el producto registrado con el id " . $productoserie->id_producto_serie , null);

	    }

	}
	catch(Exception $exception){
	    print_json("9999", "Ocurrió un error.", $exception->getMessage());
	}
?>