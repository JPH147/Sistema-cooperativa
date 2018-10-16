import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from '../global/url';
import * as moment from 'moment';

@Injectable()

export class  HistorialMovimientosService {
  public url: string = URL.url;

  constructor(private http: HttpClient) {}

  ListarMovimientos(
    almacen:string,
    tipo:string,
    referente:string,
    fecha_inicio: Date,
    fecha_fin: Date,
    documento:string,
    pagina_inicio: number,
    total_pagina: number,
    orden:string,
  ): Observable<any> {
    return this.http.get(this.url + 'transaccioncabecera/read.php', {
      params: new HttpParams()
        .set('pralmacen', almacen)
        .set('prtipo', tipo)
        .set('prreferente', referente)
        .set('prfechainicio', moment(fecha_inicio).format("YYYY/MM/DD"))
        .set('prfechafin', moment(fecha_fin).format("YYYY/MM/DD"))
        .set('prdocumento', documento)
        .set('prpagina', pagina_inicio.toString())
        .set('prtotalpagina', total_pagina.toString())
        .set('orden', orden)
      }).pipe(map(res => {

      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('Error al importar los datos, revisar servicio');
        return res;
    }
    }));
  }
}
