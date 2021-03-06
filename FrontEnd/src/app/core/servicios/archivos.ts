import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { URL, URLIMAGENES } from 'src/app/core/servicios/url';

@Injectable({
  providedIn: 'root'
})
export class ArchivosService {

  public url: string = URL.url;
  public url_imagenes: string = URLIMAGENES.urlimages;

  constructor(
    private http: HttpClient
  ) { }

  ObtenerArchivo(
    nombre:string
  ): Observable<Blob>{

    let params = new HttpParams()
    .set('prarchivo', nombre)

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')

    return this.http.post(this.url + 'global/enviar-archivo.php', params, {
      responseType: "blob"
    });
  }

}