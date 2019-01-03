import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from '../global/url';
import * as moment from 'moment';

@Injectable()

export class VentaService {

  public url: string = URL.url;

  constructor(private http: HttpClient) {}

  CrearVenta(
    fecha:Date,
    sucursal:number,
    talonario:number,
    cliente:number,
    lugar:string,
    vendedor:number,
    tipo_venta:number,
    tipo_documento:number,
    tipo_pago:number,
    inicial:number,
    cuotas:number,
    total:number,
    fechainicio:Date,
    pdfcontrato:string,
    pdfdni:string,
    pdfcip:string,
    pdfplanilla:string,
    pdfletra:string,
    pdfvoucher:string,
    pdfautorizacion:string,
    observaciones:string,
  ): Observable<any> {

    let params = new HttpParams()
    .set('prfecha',moment(fecha).format("YYYY-MM-DD"))
    .set('prsucursal',sucursal.toString())
    .set('prtalonario',talonario.toString())
    .set('prcliente',cliente.toString())
    .set('prlugar',lugar)
    .set('prvendedor',vendedor.toString())
    .set('prtipoventa',tipo_venta.toString())
    .set('prtipodocumento',tipo_documento.toString())
    .set('prtipopago',tipo_pago.toString())
    .set('prinicial',inicial.toString())
    .set('prcuotas',cuotas.toString())
    .set('prtotal',total.toString())
    .set('prfechainicio',moment(fechainicio).format("YYYY-MM-DD"))
    .set('prpdfcontrato',pdfcontrato)
    .set('prpdfdni',pdfdni)
    .set('prpdfcip',pdfcip)
    .set('prpdfplanilla',pdfplanilla)
    .set('prpdfletra',pdfletra)
    .set('prpdfvoucher',pdfvoucher)
    .set('prpdfautorizacion',pdfautorizacion)
    .set('probservaciones',observaciones)

    console.log(params);

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'venta/create.php', params, {headers: headers});
  }

  CrearVentaCronograma(
    venta:number,
    monto:number,
    vencimiento:Date,
  ): Observable<any> {

    let params = new HttpParams()
    .set('prventa',venta.toString())
    .set('prmonto',monto.toString())
    .set('prvencimiento',moment(vencimiento).format("YYYY-MM-DD"))

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'venta/create-cronograma.php', params, {headers: headers});
  }

  CrearVentaProductos(
    venta:number,
    producto_serie:number,
    precio:number,
  ): Observable<any> {

    let params = new HttpParams()
    .set('prventa',venta.toString())
    .set('prproductoserie',producto_serie.toString())
    .set('prprecio',precio.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'venta/create-productos.php', params, {headers: headers});
  }

  SeleccionarVenta(
    id_venta:number
  ): Observable<any>{

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.get(this.url + 'venta/readxId.php', {
      params: new HttpParams()
      .set('prid',id_venta.toString())
    }).pipe(map(res=>{
      if (res['codigo'] === 0) {
        return res['data'];
      }  else {
        console.log('Error al importar los datos, revisar servicio');
      }
    }))

  }

}
