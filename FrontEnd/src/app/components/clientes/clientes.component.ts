import { VentanaEmergenteClientes } from './ventana-emergente/ventanaemergente';
import {Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {ClienteService} from './clientes.service';
import {ClienteDataSource} from './clientes.dataservice';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap, delay} from 'rxjs/operators';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  providers: [ClienteService]
})

export class ClientesComponent implements OnInit {

  ListadoCliente: ClienteDataSource;
  Columnas: string[] = ['numero', 'institucion', 'codigo', 'dni', 'nombrecliente', 'apellidocliente', 'opciones'];
  public maestro;

  @ViewChild('InputNombreInst') FiltroInst: ElementRef;
  @ViewChild('InputDNI') FiltroDni: ElementRef;
  @ViewChild('InputNombreCliente') FiltroNombre: ElementRef;
  @ViewChild('InputApellido') FiltroApellido: ElementRef;
  @ViewChild('InputAporteMin') FiltroAporteMin: ElementRef;
  @ViewChild('InputAporteMax') FiltroAporteMax: ElementRef;

  constructor(
    private Servicio: ClienteService,
    public DialogoClientes: MatDialog
  ) {}

  ngOnInit() {
   this.ListadoCliente = new ClienteDataSource(this.Servicio);
   this.ListadoCliente.CargarClientes('', '', '', '');
 }

 // tslint:disable-next-line:use-life-cycle-interface
 ngAfterViewInit() {
   fromEvent(this.FiltroInst.nativeElement, 'keyup')
   .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.CargarData();
     })
    ).subscribe();

   fromEvent(this.FiltroDni.nativeElement, 'keyup')
   .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.CargarData();
     })
    ).subscribe();

    fromEvent(this.FiltroNombre.nativeElement, 'keyup')
   .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.CargarData();
     })
    ).subscribe();

   fromEvent(this.FiltroApellido.nativeElement, 'keyup')
   .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.CargarData();
     })
    ).subscribe();

 }

 CargarData() {
   this.ListadoCliente.CargarClientes(this.FiltroInst.nativeElement.value,
   this.FiltroDni.nativeElement.value,
   this.FiltroNombre.nativeElement.value,
   this.FiltroApellido.nativeElement.value);
 }

 Agregar() {
   // tslint:disable-next-line:prefer-const
   let VentanaClientes = this.DialogoClientes.open(VentanaEmergenteClientes, {
     width: '800px'
   });

   VentanaClientes.afterClosed().subscribe(res => {
    this.CargarData();
  });
 }

 Eliminar(id) {
   this.Servicio.Eliminar(id).subscribe(res => {
     this.CargarData();
   });
 }

 Editar(id) {
  this.Servicio.Seleccionar(id).subscribe(res => {
    // tslint:disable-next-line:prefer-const
    let VentanaClientes = this.DialogoClientes.open(VentanaEmergenteClientes, {
      width: '800px',
      data: res
    });
    // tslint:disable-next-line:no-shadowed-variable
    VentanaClientes.afterClosed().subscribe (res => {
      this.CargarData();
    });
  });
}

}
