import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {URL} from './url'
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators'

@Injectable()

export class ServiciosDirecciones{
	public url:string = URL.url;

	constructor(
		private http:HttpClient,
	){}

	/************************************************************************************************/
	/* Departamentos */
	ListarDepartamentos(
		nombre:string,
		pagina:number,
		total_pagina:number,
	):Observable<any>
	{
		return this.http.get(this.url+'direcciondepartamento/read.php',{
			params: new HttpParams()
			.set('prnombre', nombre)
			.set('prpagina',pagina.toString())
			.set('prtotalpagina',total_pagina.toString())
		})
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res=res
			}else{
				console.log('Error al importar los datos, revisar servicio')
			}
		}))
	}

	SeleccionarDepartamento(
		id:number
	):Observable<Departamento[]>
	{
		return this.http.get(this.url+'direcciondepartamento/readxId.php',{
			params: new HttpParams()
			.set('prid', id.toString())
		})
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res=res['data']
			}else{
				console.log('Error al importar los datos, revisar servicio')
			}
		}))
	}

	EliminarDepartamento(
		id:number
	):Observable<any>{
		let params = new HttpParams().set('prid',id.toString());
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
		return this.http.post(this.url + 'direcciondepartamento/delete.php', params, {headers: headers});
	}

	CrearDepartamento(
		nombre:string
	):Observable<any>{
		let params=new HttpParams()	.set('prnombre', nombre);
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this.http.post(this.url+'direcciondepartamento/create.php',params,{headers:headers});
	}

	ActualizarDepartamento(
		id:number,
		nombre:string
	):Observable<any>{
		let params=new HttpParams()
				   .set('prid', id.toString())
				   .set('prnombre', nombre);
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this.http.post(this.url+'direcciondepartamento/update.php',params,{headers:headers});
	}

	/************************************************************************************************/
	/* Provincias */

	ListarProvincias(
		departamento:string,
		provincia:string,
		pagina:number,
		total_pagina:number,
	):Observable<any>
	{
		return this.http.get(this.url+'direccionprovincia/read.php',{
			params: new HttpParams()
			.set('prdepartamento', departamento)
			.set('prprovincia', provincia)
			.set('prpagina',pagina.toString())
			.set('prtotalpagina',total_pagina.toString())
		})
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res=res
			}else{
				console.log('Error al importar los datos, revisar servicio')
			}
		}))
	}

	SeleccionarProvincia(
		id:number
	):Observable<Provincia[]>
	{
		return this.http.get(this.url+'direccionprovincia/readxId.php',{
			params: new HttpParams()
			.set('prid', id.toString())
		})
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res=res['data']
			}else{
				console.log('Error al importar los datos, revisar servicio')
			}
		}))
	}

	EliminarProvincia(
		id:number
	):Observable<any>{
		let params = new HttpParams().set('prid',id.toString());
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
		return this.http.post(this.url + 'direccionprovincia/delete.php', params, {headers: headers});
	}

	CrearProvincia(
		departamento:number,
		nombre:string
	):Observable<any>{
		let params=new HttpParams()
						.set('prnombre', nombre)
						.set('prdepartamento', departamento.toString());
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this.http.post(this.url+'direccionprovincia/create.php',params,{headers:headers});
	}

	ActualizarProvincia(
		id:number,
		departamento:number,
		nombre:string
	):Observable<any>{
		let params=new HttpParams()
				   .set('prid', id.toString())
				   .set ('prdepartamento', departamento.toString())
				   .set('prnombre', nombre);
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this.http.post(this.url+'direccionprovincia/update.php',params,{headers:headers});
	}

	/************************************************************************************************/
	/* Distritos */
	ListarDistritos(
		departamento:string,
		provincia:string,
		distrito:string,
		pagina:number,
		total_pagina:number,
	):Observable<any>
	{
		return this.http.get(this.url+'direcciondistrito/read.php',{
			params: new HttpParams()
			.set('prdepartamento', departamento)
			.set('prprovincia', provincia)
			.set('prdistrito',distrito)
			.set('prpagina',pagina.toString())
			.set('prtotalpagina',total_pagina.toString())
		})
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res=res
			}else{
				console.log('Error al importar los datos, revisar servicio')
			}
		}))
	}

	SeleccionarDistrito(
		id:number
	):Observable<Distrito[]>
	{
		return this.http.get(this.url+'direcciondistrito/readxId.php',{
			params: new HttpParams()
			.set('prid', id.toString())
		})
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res=res['data']
			}else{
				console.log('Error al importar los datos, revisar servicio')
			}
		}))
	}

	EliminarDistrito(
		id:number
	):Observable<any>{
		let params = new HttpParams().set('prid',id.toString());
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
		return this.http.post(this.url + 'direcciondistrito/delete.php', params, {headers: headers});
	}

	CrearDistrito(
		provincia:number,
		nombre:string
	):Observable<any>{
		let params=new HttpParams()
						.set('prnombre', nombre)
						.set('prprovincia', provincia.toString());
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this.http.post(this.url+'direcciondistrito/create.php',params,{headers:headers});
	}

	ActualizarDistrito(
		id:number,
		provincia:number,
		nombre:string
	):Observable<any>{
		let params=new HttpParams()
				   .set('prid', id.toString())
				   .set ('prprovincia', provincia.toString())
				   .set('prnombre', nombre);
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this.http.post(this.url+'direcciondistrito/update.php',params,{headers:headers});
	
	}
/************************************************************************************************/
	CrearDireccion(
		id: number,
		nombre: string,
		iddistrito: number,
		relevancia: number,
		observacion: string
	): Observable<any> {
		let params = new HttpParams()
		.set('id_cliente', id.toString())
		.set('drc_nombre', nombre)
		.set('pid_distrito', iddistrito.toString())
		.set('drc_relevancia', relevancia.toString())
		.set('drc_observacion', observacion);
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this.http.post(this.url + 'clientedireccion/create.php', params, {headers: headers});
		}

		ListarDireccion(
			id_cliente:string,
			drc_relevancia:string,
		// tslint:disable-next-line:no-unused-expression
		): Observable <any>
		{
			return this.http.get(this.url + 'clientedireccion/read.php',{
				params: new HttpParams()
				.set('id_cliente', id_cliente)
				.set('drc_relevancia', drc_relevancia)
			})
			.pipe(map(res=>{
				if(res['codigo'] === 0) {
					return res['data'].direcciones;
				} else {
					console.log('Error al importar los datos, revisar servicio');
				}
			}))
		}
}



export interface Departamento {
	numero:number,
	id:number,
	nombre: string
}

export interface Provincia {
	numero:number,
	id:number,
	departamento:string,
	nombre:string
}

export interface Distrito {
	numero:number,
	id:number,
	departamento:string,
	provincia:string,
	nombre:string
}

export interface Direccion {
	numero: number,
	idcliente: number,
	cliente: string,
	direccion: string,
	relevancia: number,
	observacion: string
}