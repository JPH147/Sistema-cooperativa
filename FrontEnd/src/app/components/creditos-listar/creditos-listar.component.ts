import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSelect, MatPaginator, MatSort } from '@angular/material'
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CreditosService } from '../creditos/creditos.service';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';

@Component({
  selector: 'app-creditos-listar',
  templateUrl: './creditos-listar.component.html',
  styleUrls: ['./creditos-listar.component.css'],
  providers: [CreditosService]
})
export class CreditosListarComponent implements OnInit {

  public fecha_inicio: Date;
  public fecha_fin: Date;

  public ListadoCreditos: CreditosDataSource;
  public Columnas: string[] = ['numero', 'codigo', 'cliente_nombre', 'tipo_credito', 'monto_total', 'fecha', 'opciones'];

  @ViewChild('InputCliente') FiltroCliente: ElementRef;
  @ViewChild('InputTipo') FiltroTipo: MatSelect;
  @ViewChild('InputEstado') FiltroEstado: MatSelect;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private Servicio: CreditosService
  ) { }

  ngOnInit() {

    this.fecha_inicio= new Date((new Date()).valueOf() - 1000*60*60*24*120)
    this.fecha_fin=new Date()

    this.ListadoCreditos = new CreditosDataSource(this.Servicio);
    this.ListadoCreditos.CargarCreditos("",0,this.fecha_inicio,this.fecha_fin,1,1,10,"codigo desc");
  }

  ngAfterViewInit () {

    this.sort.sortChange.subscribe(res => {
      this.paginator.pageIndex = 0;
    });

    merge(
      this.paginator.page,
      this.sort.sortChange
    ).pipe(
      tap(() => this.CargarData())
    ).subscribe();

    fromEvent(this.FiltroCliente.nativeElement, 'keyup')
    .pipe(
       debounceTime(200),
       distinctUntilChanged(),
       tap(() => {
         this.paginator.pageIndex = 0;
         this.CargarData();
       })
    ).subscribe();
  }

  CargarData() {
    this.ListadoCreditos.CargarCreditos(
      this.FiltroCliente.nativeElement.value,
      this.FiltroTipo.value,
      this.fecha_inicio,
      this.fecha_fin,
      this.FiltroEstado.value,
      this.paginator.pageIndex+1,
      this.paginator.pageSize,
      this.sort.active +" " + this.sort.direction
    );
  }

  CambioFiltro(){
    this.paginator.pageIndex = 0;
    this.CargarData()
  }

  // AnularVenta(venta){
    
  //   let Transacciones: Array<any>;
    
  //   // Se listan las transacciones que pertenecen a esa venta
  //   this.VServicio.ListarVentaTransacciones(venta.id).subscribe(res=>{
  //     Transacciones=res.transaccion
  //   });

  //   let Dialogo = this.Dialogo.open(VentanaConfirmarComponent,{
  //     data: {objeto: "la venta", valor: venta.contrato, venta:true}
  //   })

  //   Dialogo.afterClosed().subscribe(res=>{
  //     if (res) {
  //       if (res.respuesta) {
  //         this.VServicio.EliminarVenta(venta.id, res.comentarios, res.monto).subscribe(respuesta=>{
            
  //           console.log(respuesta);
  //           Transacciones.forEach((item)=>{
  //             this.VServicio.CrearCanjeTransaccion(item.id,new Date(),"AJUSTE POR ANULACION").subscribe()
  //           })

  //           if (res.monto>0) {
  //             this.VServicio.CrearVentaCronograma(venta.id,res.monto,new Date(), 1).subscribe()
  //           }

  //           this.CargarData()

  //         });
  //       }
  //     }
  //   })

  // }

}

export class CreditosDataSource implements DataSource<any> {

  private InformacionCreditos = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(
    private Servicio: CreditosService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
  return this.InformacionCreditos.asObservable();
  }

  disconnect() {
  this.InformacionCreditos.complete();
  this.CargandoInformacion.complete();
  }

  CargarCreditos(
    cliente:string,
    tipo_credito:number,
    fecha_inicio:Date,
    fecha_fin:Date,
    estado:number,
    pagina_inicio:number,
    pagina_final:number,
    orden:string
  ) {
  this.CargandoInformacion.next(true);

  this.Servicio.Listar( cliente, tipo_credito, fecha_inicio, fecha_fin, estado, pagina_inicio, pagina_final, orden )
  .pipe(
    catchError(() => of([])),
    finalize(() => this.CargandoInformacion.next(false))
  )
  .subscribe(res => {
    this.TotalResultados.next(res['mensaje']);
    this.InformacionCreditos.next(res['data'].creditos);
  });
  }

}