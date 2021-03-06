import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HistorialSerieService } from './historial-serie.service';
import { HistorialSerieDataService } from './historial-serie.data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { merge, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import {saveAs} from 'file-saver';
import { ArchivosService } from 'src/app/core/servicios/archivos';

@Component({
  selector: 'app-historial-serie',
  templateUrl: './historial-serie.component.html',
  styleUrls: ['./historial-serie.component.css'],
  providers:[ HistorialSerieService]
})
export class HistorialSerieComponent implements OnInit {
  [x: string]: any;

  ListadoProductos: HistorialSerieDataService;
  Columnas: string[] = ['numero','serie', 'movimiento', 'producto', 'transaccion','tenedor', 'documento','fecha'];

  @ViewChild('InputserieProducto', { static: true }) FiltroProductos: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private AServicio : ArchivosService,
    private Servicio: HistorialSerieService,
    public DialogoProductos: MatDialog,
    public snackBar: MatSnackBar,
    public DialogFileUpload: MatDialog,

  ) { }

  ngOnInit() {
    this.ListadoProductos = new HistorialSerieDataService(this.Servicio);
    // tslint:disable-next-line:quotemark
    this.ListadoProductos.CargarProductos('', 1, 10);
  }

  ngAfterViewInit () {

    merge(
      this.paginator.page
    )
    .pipe(
      tap(() => this.CargarData())
    ).subscribe();
  
    merge(
     fromEvent(this.FiltroProductos.nativeElement, 'keyup')
    )
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
    this.ListadoProductos.CargarProductos(
      this.FiltroProductos.nativeElement.value,
      this.paginator.pageIndex + 1,
      this.paginator.pageSize
    );
  }

  ExportToExcel(){
    let nombre_archivo : string = "reporte_movimiento_series_" + new Date().getTime();

    this.Servicio.ListadoSerieUnlimited(
      nombre_archivo,
      this.FiltroProductos.nativeElement.value,
    ).subscribe(res=>{
      if(res){
        this.AbrirArchivo(nombre_archivo,res);
      }
    })
  }

  AbrirArchivo(nombre_archivo,path){
    this.AServicio.ObtenerArchivo(path).subscribe(res=>{
      saveAs(res, nombre_archivo+'.xlsx');
    })
  }

}