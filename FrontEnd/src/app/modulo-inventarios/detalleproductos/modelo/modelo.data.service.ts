import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {ServiciosGenerales} from 'src/app/core/servicios/servicios';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';

export class ModeloDataSource implements DataSource<any> {

  private InformacionModelo = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

constructor(private Servicio: ServiciosGenerales) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
  return this.InformacionModelo.asObservable();
  }

  disconnect() {
  this.InformacionModelo.complete();
  this.CargandoInformacion.complete();
  }


  CargarModelo(
    tipo: string,
    marca: string,
    nombre: string,
    prpagina: number,
    prtotalpagina: number
  // tslint:disable-next-line:one-line
  ){
  this.CargandoInformacion.next(true);

  this.Servicio.ListarModelo2(tipo,marca, nombre , prpagina, prtotalpagina)
  .pipe(catchError(() => of([])),
  finalize(() => this.CargandoInformacion.next(false))
  )
  .subscribe(res => {
      this.TotalResultados.next(res['mensaje']);
      this.InformacionModelo.next(res['data'].modelo);
    });
  }

}
