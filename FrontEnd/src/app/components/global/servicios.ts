import { TipoProductoModelo } from './servicios';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, } from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from './url';
import * as moment from 'moment';

@Injectable()

export class ServiciosGenerales {
  public url: string = URL.url;

  constructor(
    private http: HttpClient) { }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {}
 // F=moment(fecha).format('YYYY/MM/DD');
  ListarTipoProductos(
    nombre: string,
    unidad_medida: string
  ): Observable<TipoProductoModelo> {
  return this.http.get(this.url + 'productotipo/read.php?prnombre=' + nombre + '&prum' + unidad_medida)
  .pipe(map(res => {
      if (res['codigo'] === 0 ) {
        return res['data'].tipo_productos;
    } else {
        console.log('Error al importar los datos, revisar servicio');
    }
  }));
  }

  ListarMarca(
    id_tipo: string,
    nombre: string
  ): Observable<MarcaModelo> {
       return this.http.get(this.url + 'productomarca/read.php?prtipo=' + id_tipo + '&prmarca' + nombre)
      .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res['data'].marca;
      } else {
          console.log('Error al importar los datos, revisar servicio');
      }
  }));
  }

  ListarModelo(
    id_marca: string,
    nombre: string
  ): Observable<ModeloModelo> {
      return this.http.get(this.url + 'productomodelo/read.php?prmarca=' + id_marca + '&prnombre' + nombre)
      .pipe(map(res => {
      if (res['codigo'] === 0 ) {
          return res['data'].modelo;
      } else {
        console.log('Error al importar los datos, revisar servicio');
      }
    }));
}

  ListarInstitucion(
  ):  Observable<Institucion> {
      return this.http.get(this.url + 'institucion/read.php')
      .pipe(map(res => {
      if (res['codigo'] === 0 ) {
        return res['data'].institucion;
      } else {
        console.log('Error al importar los datos, revisar servicio');
      }
    }));
  }

  ListarSede(
    id_institucion: number,
    sd_nombre: string
  ): Observable<Sede>	{
      return this.http.get(this.url + 'sede/read.php?id_institucion=' + id_institucion + '&sd_nombre' + sd_nombre)
      .pipe(map(res => {
      if (res['codigo'] === 0 ) {
        return res['data'].sede;
    } else {
       console.log('Error al importar los datos, revisar servicio');
    }
  }));
  }

  ListarSubsede(
  id_sede: number,
  ssd_nombre: string
    ): Observable<Sede> {
      return this.http.get(this.url + 'subsede/read.php?id_sede=' + id_sede + '&ssd_nombre' + ssd_nombre)
      .pipe(map(res => {
      if (res['codigo'] === 0 ) {
          return res['data'].subsede;
      } else {
          console.log('Error al importar los datos, revisar servicio');
        }
    }));
  }

  ListarAlmacen(
  ): Observable<Almacen[]> {
    return this.http.get(this.url + 'almacen/read.php')
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res['data'].almacenes;
      } else {
        console.log('Error al importar los datos, revisar servicio');
        }
    }));
  }

  ListarTransaccionTipo (
    ): Observable <any> {
      return this.http.get(this.url + 'transacciontipo/read.php', {
        params: new HttpParams()
        .set('prid', '1')
      })

      .pipe(map(res => {
        if (res['codigo'] === 0) {
            return res['data'].tipos;
        } else {
            console.log('Error al importar los datos, revisar servicio');
          }
      }));
    }

  ListarProveedor(
    nombre: string
    ): Observable <any> {
      return this.http.get(this.url + 'proveedor/read.php', {
        params: new  HttpParams()
        .set('prnombre', nombre)
      })
      .pipe(map(res => {
          if (res['codigo'] === 0) {
            return res['data'].proveedor;
          } else {
              console.log ('Error al importar los datos, revisar servicio');
          }
      }));
      }
<<<<<<< HEAD

  ListarSucursal(
      id:number,
      nombre:string
    ):Observable<any>{

      let ID:string;

      if( id==null ){
        ID=""
      }else{
        ID=id.toString()
      }

      return this.http.get(this.url + 'sucursal/read.php', {
        params: new HttpParams()
        .set('prid', ID)
        .set('prnombre',nombre)
      })

      .pipe(map(res => {
        if (res['codigo'] === 0) {
            return res['data'].sucursal;
        } else {
            console.log('Error al importar los datos, revisar servicio');
          }
      }));
    }
  }
=======
>>>>>>> 66add31e83f28dfe0f5b920f76250161cf44118a

  }

export interface TipoTransaccion {
  numero: number;
  id: number;
  nombre: string;

}

export interface Almacen {
  numero: number;
  id_almacen: number;
  Alm_nombre: string;
}

export interface TipoProductoModelo {
  numero: number;
  id: number;
  nombre: string;
  unidad_medida: string;
}

export interface MarcaModelo {
  numero: number;
  id: number;
  tipo: string;
  nombre: string;
}

export interface ModeloModelo {
  numero: number;
  id: number;
  tipo: string;
  marca: string;
  modelo: string;
}

export interface Subsede {
  numero: number;
  id: number;
  nombre: string;
}

export interface Sede {
  numero: number;
  id: number;
  nombre: string;
}
export interface Institucion {
  numero: number;
id: number;
nombre: string;
}
