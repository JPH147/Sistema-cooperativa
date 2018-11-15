import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from './url';


@Injectable()

export class ServiciosProductoSerie {
  public url: string = URL.url;

  constructor(
  private http: HttpClient,
  ) {}

  Listado(
    almacen: string,
    producto:number,
    pagina: number,
    total_pagina: number
    ): Observable <any> {

      let Producto:string="";

      if(producto>0){
        Producto=producto.toString()
      }

      return this.http.get(this.url + 'productoserie/read.php', {
        params: new HttpParams()
          .set('pralmacen', almacen)
          .set('prproducto',Producto)
          .set('prpagina', pagina.toString())
          .set('prtotalpagina',total_pagina.toString())
      })
      .pipe (map(res => {
        if (res['codigo'] === 0) {
          return res;
        } else {
          console.log('Error al importar los datos, revisar servicio');
          return res;
        }
      }));
    }

  CrearProductoSerie(
    id_producto: number,
    serie:string,
    color:string,
    almacenamiento:string
  ): Observable<any> {

    let params = new HttpParams()
    .set('prproducto',id_producto.toString())
    .set('prserie',serie)
    .set('prcolor',color)
    .set('pralmacenamiento',almacenamiento)

    console.log(params)

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'productoserie/create.php', params, {headers: headers});
  }

  Seleccionar(
    id:number
  ): Observable<any>{

    return this.http.get(this.url + 'productoserie/readxId.php', {
      params: new HttpParams()
      .set('prid', id.toString())
    })
    .pipe (map(res => {
      if (res['codigo'] === 0) {
        return res['data'];
      } else {
        console.log('Error al importar los datos, revisar servicio');
        return res;
      }
    }));
  }

  Actualizar(
    id: number,
    id_producto: number,
    serie: string,
    color: string,
    almacenamiento:string
    ): Observable<any> {

    let params = new HttpParams()
      .set('prid', id.toString())
      .set('prproducto', id_producto.toString())
      .set('prserie', serie)
      .set('prcolor', color)
      .set('pralmacenamiento', almacenamiento)

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'productoserie/update.php', params, {headers: headers});
  }

  RegistrarProductoOUT(
    serie:number
  ){
    let params = new HttpParams()
    .set('prid',serie.toString())
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url+'productoserie/updateout.php', params, {headers:headers})
  }

  ListarColor(
  nombre: string
  ): Observable <any> {
    return this.http.get(this.url + 'colores/read.php', {
      params: new  HttpParams()
      .set('prnombre', nombre)
    })
    .pipe(map(res => {
        if (res['codigo'] === 0) {
          return res['data'].colores;
        } else {
          console.log ('Error al importar los datos, revisar servicio');
        }
    }));
  }

  ValidarSerie(
    serie:string
  ):Observable<any>{
    return this.http.get(this.url+'productoserie/validar.php', {
      params: new HttpParams()
      .set('prserie', serie)
    })
    .pipe(map(res=>{
        if (res['codigo'] === 0) {
          return res['data'];
        } else {
          console.log ('Error al importar los datos, revisar servicio');
        }
    }))
  }

}
