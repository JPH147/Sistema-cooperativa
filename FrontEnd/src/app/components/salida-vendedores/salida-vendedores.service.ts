import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from '../global/url';
import * as moment from 'moment';

@Injectable()

export class SalidaVendedoresService {

  public url: string = URL.url;

  constructor(private http: HttpClient) {}

  Agregar(
    pecosa: number,
    prsucursal: number,
    fecha: Date,
    destino:string,
    guia: string,
    movilidad:boolean,
    observacion:string
    ): Observable<any> {

    let TM:string, Fecha:string;

    if (movilidad) {
        TM = '1';
    } else {
        TM = '0';
    }

    if (fecha) {
      Fecha=moment(fecha).format("YYYY/MM/DD").toString()
    }else{
      Fecha=''
    }

    let params = new HttpParams()
   				.set('prpecosa', pecosa.toString())
   				.set('prsucursal', prsucursal.toString())
   				.set('prfecha', Fecha)
   				.set('prdestino', destino)
   				.set('prguia', guia)
   				.set('prmovilidad', TM)
          .set('observacion', observacion)

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'salidacabecera/create.php', params, {headers: headers});
  }

  AgregarMovilidad(
    cabecera: number,
    placa: string,
    dni: string,
    nombre:string
    ): Observable<any> {

    let params = new HttpParams()
           .set('prcabecera', cabecera.toString())
           .set('prvehiculo', placa)
           .set('prchoferdni', dni)
           .set('prchofernombre', nombre)

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'salidacabecera/create-movilidad.php', params, {headers: headers});
  }

  AgregarProducto(
    cabecera: number,
    serie: number,
    precio: number,
    cantidad:number
    ): Observable<any> {

    let params = new HttpParams()
           .set('prcabecera', cabecera.toString())
           .set('prserie', serie.toString())
           .set('prprecio', precio.toString())
           .set('prcantidad', cantidad.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'salidacabecera/create-producto.php', params, {headers: headers});
  }

  AgregarVendedor(
    cabecera: number,
    vendedor: number,
    comision: number
    ): Observable<any> {

    let params = new HttpParams()
           .set('prcabecera', cabecera.toString())
           .set('prvendedor', vendedor.toString())
           .set('prcomision', comision.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'salidacabecera/create-vendedor.php', params, {headers: headers});
  }
}
