<?php 

class Tipo_Producto{
	private $conn;
	private $table_name = "tipo_producto";

	public $id_tipo_producto;
	public $tprd_nombre;
	public $und_nombre;

	public function __construct($db){
		$this->conn = $db;
	}

	function read(){
		$query = "CALL sp_listartipoproducto(?,?)";

		$result = $this->conn->prepare($query);

		$result->bindParam(1, $this->tprd_nombre);
		$result->bindParam(2, $this->und_nombre);

		$result->execute();

		$tipo_producto_list=array();
		$tipo_producto_list["tipo_productos"]=array();

		$contador = 0;

		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			$contador = $contador+1;
			$tipo_producto_fila = array(
				"numero"=>$contador,
				"id"=>$id_tipo_producto,
				"nombre"=>$tprd_nombre,
				"unidad_medida"=>$und_nombre
			);
			array_push($tipo_producto_list["tipo_productos"],$tipo_producto_fila);
		}

		return $tipo_producto_list;
	}

	
}

?>