<?php

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: access");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Allow-Credentials: true");
    header('Content-Type: application/json');

    include_once '../config/database.php';
    include_once '../entities/credito.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();
    $credito = new Creditos($db);

    try{

        $credito->id_credito = isset($_GET['prcredito']) ? trim($_GET['prcredito']) : die();

        $credito->readxId();

	    $credito_list = array(
            "id" => $credito->id_credito,
            "id_acreedor" => $credito->id_acreedor,
            "id_tipo" => $credito->id_tipo,
            "tipo" => $credito->tipo,
            "id_sucursal" => $credito->id_sucursal,
            "sucursal" => $credito->sucursal,
            "fecha" => $credito->fecha,
            "codigo" => $credito->codigo,
            "numero" => $credito->numero,
            "codigo_credito" => $credito->codigo_credito,
            "id_autorizador" => $credito->id_autorizador,
            "autorizador" => $credito->autorizador,
            "id_vendedor" => $credito->id_vendedor,
            "vendedor" => $credito->vendedor,
            "id_cliente" => $credito->id_cliente,
            "cliente" => $credito->cliente,
            "cliente_dni"=>$credito->cliente_dni,
            "cliente_direccion" => $credito->cliente_direccion,
            "cliente_telefono" => $credito->cliente_telefono,
            "cliente_cargo" => $credito->cliente_cargo,
            "cliente_trabajo" => $credito->cliente_trabajo,
            "id_tipo_pago" => $credito->id_tipo_pago,
            "tipo_pago" => $credito->tipo_pago,
            "fecha_pago" => $credito->fecha_pago,
            "interes_diario" => $credito->interes_diario,
            "interes" => $credito->interes,
            "capital" => $credito->capital,
            "numero_cuotas" => $credito->numero_cuotas,
            "total" => $credito->total,
            "pdf_foto" => $credito->pdf_foto,
            "pdf_dni" => $credito->pdf_dni,
            "pdf_cip" => $credito->pdf_cip,
            "pdf_planilla" => $credito->pdf_planilla,
            "pdf_voucher" => $credito->pdf_voucher,
            "pdf_recibo" => $credito->pdf_recibo,
            "pdf_casilla" => $credito->pdf_casilla,
            "pdf_transaccion" => $credito->pdf_transaccion,
            "pdf_autorizacion" => $credito->pdf_autorizacion,
            "pdf_tarjeta" => $credito->pdf_tarjeta,
            "pdf_compromiso" => $credito->pdf_compromiso,
            "pdf_letra" => $credito->pdf_letra,
            "pdf_ddjj" => $credito->pdf_ddjj,
            "pdf_oficio" => $credito->pdf_oficio,
            "pdf_otros" => $credito->pdf_otros,
            "observaciones" => $credito->observaciones,
            "id_credito_refinanciado" => $credito->id_credito_refinanciado,
            "credito_refinanciado" => $credito->credito_refinanciado,
            "monto_total" => $credito->monto_total,
            "interes_generado" => $credito->interes_generado,
            "monto_pagado" => $credito->monto_pagado,
            "monto_pendiente" => $credito->monto_pendiente,
            "total_cuotas" => $credito->total_cuotas,
            "total_pendiente" => $credito->total_pendiente,
            "total_pagadas" => $credito->total_pagadas,
            "cuota_estandar" => $credito->cuota_estandar ,
            "monto_pendiente_hasta_hoy" => $credito->monto_pendiente_hasta_hoy ,
            "cumple_penalidad" => $credito->cumple_penalidad ,
            "id_estado" => $credito->id_estado,
            "estado" => $credito->estado,
            "cuotas_penalidad" => $credito->cuotas_penalidad,
            "cuotas_interes" => $credito->cuotas_interes,
            "deuda_hasta_hoy" => $credito->deuda_hasta_hoy ,
            "monto_limite_penalidad" => $credito->monto_limite_penalidad ,
            "monto_penalidad" => $credito->monto_penalidad ,
            "adicional_penalidad" => $credito->adicional_penalidad ,
            "pagado_interes" => $credito->pagado_interes ,
            "estado_penalidad" => $credito->estado_penalidad ,
            "estado_interes" => $credito->estado_interes ,
            "id_liquidacion" => $credito->id_liquidacion ,
            "pagado" => $credito->pagado ,
            "courier" => $credito->courier,
            "garantes" => $credito->garante,
            // "cronograma" => $credito->cronograma,
	    );

        if ((trim($credito->id_credito)!= ''))
        { 
            print_json("0000", 0, $credito_list);
        }
        else
        { print_json("0001", "No se encuentra el crédito registrado con el id " . $credito->id_credito , null); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>