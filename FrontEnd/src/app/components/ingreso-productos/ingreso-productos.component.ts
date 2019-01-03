import { Component, OnInit, ViewChild,ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { Cliente } from './../clientes/clientes.service';
import { IngresoProductoService } from './ingreso-productos.service';
import {ServiciosProductoSerie} from '../global/productoserie';
import { ServiciosGenerales, Almacen, ListarCliente, ListarVendedor } from './../global/servicios';
import { ventanaseries } from './ventana-series/ventanaseries';
import { VentanaFecha } from './ventana-fecha/ventanafecha';
import { VentanaDetalle } from './ventana-detalle/ventanadetalle';
import { FormControl, FormBuilder, FormGroup, Validators, PatternValidator,FormArray, FormControlName } from '@angular/forms';
import {Observable, fromEvent} from 'rxjs';
import { MatDialog,MatSnackBar } from '@angular/material';
import {debounceTime, distinctUntilChanged, tap, delay, map} from 'rxjs/operators';
import {ProductoService} from '../productos/productos.service';
import {ServiciosDocumentos} from '../global/documentos';
import { HistorialMovimientosService } from '../historial-movimientos/historial-movimientos.service';

@Component({
  selector: 'app-ingreso-productos',
  templateUrl: './ingreso-productos.component.html',
  styleUrls: ['./ingreso-productos.component.css'],
  providers: [
    ServiciosGenerales,
    IngresoProductoService,
    ProductoService,
    ServiciosProductoSerie,
    ServiciosDocumentos,
    HistorialMovimientosService
  ]
})
  export class IngresoProductosComponent implements OnInit {

    @ViewChild('Proveedor') FiltroProveedor: ElementRef;
    @ViewChild('Cliente') FiltroCliente: ElementRef;
    @ViewChild('Vendedor') FiltroVendedor: ElementRef;
    @ViewChild('docRefencia') FiltroReferencia: ElementRef;

    public IngresoProductoForm: FormGroup;
    public contador: number;
    public almacenes: Array<any> = [];
    public TipoIngresos: Array<any> = [];
    public proveedores: Array<any> = [];
    public clientes: Array<any> = [];
    public Vendedores: Array<any> = [];
    public Sucursales: Array<any> = [];
    public almacen_origen: Array<any> = [];
    public almacen_destino: Array<any> = [];
    public seriventana: string;
    public tipoIngreso: string;      // Tipo de Ingreso Almacen
    public docReferencia: string; // documento referencia de ingreso almncen
    public proveedor: string;
    public cliente: string;
    public vendedor: string;
    public nombre: string;
    public fecingreso: Date;      // fecha de ingreso a almcen
    public data;
    public documento_serie:string;
    public documento_numero:number;
    public detalle_transacciones:Array<any>;
    public obsentrega:Array<any>;
    public id_almacen_referencia:number;
    public enviado:boolean;
    public Hoy: Date= new Date();
    public nuevo_documento: boolean;
    public fecha_inicio:Date;
	  public fecha_fin:Date;

    @ViewChildren('InputProducto') FiltroProducto: QueryList<any>;
    public productos: FormArray;
    public Series: any[] = [];
    public Producto: Array<any>;

    selected = 'option2';
    myControl = new FormControl();
    filteredOptions: Observable<string[]>;

    // ListadoMovimientos: HistorialMovimientosDataService;

    Columnas: string[] = ['numero', 'movimiento','tipo','almacen', 'referencia', 'referente', 'documento', 'fecha', 'opciones'];
    
  
    constructor(
      public DialogoSerie: MatDialog,
      private FormBuilder: FormBuilder,
      public snackBar: MatSnackBar,
      private Servicios: ServiciosGenerales,
      private IngresoProductoservicios: IngresoProductoService,
      private Articulos: ProductoService,
      private SSeries: ServiciosProductoSerie,
      private SDocumentos: ServiciosDocumentos,
      private SMovimineto: HistorialMovimientosService,
    ) {}

    ngOnInit() {

      this.documento_serie="";
      this.documento_numero=null;
      this.enviado=false;

      this.ListarAlmacen();
      this.ListarTransaccionTipo();
      this.ListarProveedor('');
      this.ListarCliente('');
      this.ListarVendedor('');

      this.IngresoProductoForm = this.FormBuilder.group({
          'almacen': [null, [Validators.required] ],
          'almacen1': [{value:null,disabled:true} ],
          'tipoIngreso': [null, [Validators.required]],
          'docReferencia': [null, [Validators.required]],
          'proveedor': [{value:null,disabled:false}, [Validators.required] ],
          // 'cliente': [null, [Validators.required]],
          // 'vendedor': [null, [Validators.required]],
          // 'sucursal': [null, [Validators.required]],
          // 'documento': [null, [Validators.required]],
          'fecingreso': [{value:this.Hoy,disabled:false}, [Validators.required]],
          // 'producto': [null, [Validators.required]],
          // 'cantidad': [null, [Validators.required]],
          // 'precioUnitario': [null, [Validators.required]],
          productos: this.FormBuilder.array([this.CrearProducto()]),
          // observacion: this.FormBuilder.array([this.CrearObservacion()]),
      });
      
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit() {

      fromEvent(this.FiltroProveedor.nativeElement, 'keyup')
      .pipe(
        debounceTime(10),
        distinctUntilChanged(),
        tap(() => {
          this.ListarProveedor(this.FiltroProveedor.nativeElement.value);
        })
       ).subscribe();

      this.FiltroProducto.changes.subscribe(res => {
        for (let i in this.FiltroProducto['_results']) {
          fromEvent(this.FiltroProducto['_results'][i].nativeElement,'keyup')
          .pipe(
              debounceTime(200),
              distinctUntilChanged(),
              tap(()=>{
                if (this.FiltroProducto['_results'][i].nativeElement.value) {
                  this.FiltrarProductos(this.FiltroProducto['_results'][i].nativeElement.value)
                }
              })
            ).subscribe()
        }
      })

      fromEvent(this.FiltroReferencia.nativeElement, 'keyup')
      .pipe(
        debounceTime(10),
        distinctUntilChanged(),
        tap(() => {
          if (this.IngresoProductoForm.value.tipoIngreso==7 && this.IngresoProductoForm.value.almacen) {
            // this.SeleccionarCabecera(this.IngresoProductoForm.value.almacen.id, this.FiltroReferencia.nativeElement.value.trim());
          }
          this.ValidarDocumento();
        })
       ).subscribe();
    }


    ValidarDocumento(){
      // console.log("a")
      if (this.IngresoProductoForm.value.tipoIngreso == 1 && this.IngresoProductoForm.value.docReferencia && this.IngresoProductoForm.value.proveedor) {
        this.SDocumentos.ValidarDocumento(1,this.IngresoProductoForm.value.proveedor.id,this.IngresoProductoForm.value.docReferencia).subscribe(res=>{
          // console.log("b",res)
          if (res.total==0) {
            this.nuevo_documento = true
            
          }else{
            this.nuevo_documento = false
          }
        })
      }
      if (this.IngresoProductoForm.value.tipoIngreso == 7 && this.IngresoProductoForm.value.docReferencia && this.id_almacen_referencia) {
        this.SDocumentos.ValidarDocumento(7,this.id_almacen_referencia,this.IngresoProductoForm.value.docReferencia).subscribe(res=>{
          // console.log("c",res)
          if (res.total==0) {
            this.nuevo_documento = true
          }else{
            this.nuevo_documento = false
          }
        })
      }
    }

    ProveedorSeleccionado(){
      this.ValidarDocumento()
    }

    ActualizarTipoIngreso(evento){

      if (evento.value==1) {
        this.CrearProducto()
        this.ResetearFormArray(this.productos);
        this.IngresoProductoForm.get('proveedor').enable()
        this.IngresoProductoForm.get('productos')['controls'][0].get('descripcion').enable()
        this.IngresoProductoForm.get('productos')['controls'][0].get('producto').enable()
        this.IngresoProductoForm.get('productos')['controls'][0].get('precioUnitario').enable()
      }
      if (evento.value==7) {
        this.ListarTransferenciasPendientes();
        this.IngresoProductoForm.get('proveedor').disable()
        this.IngresoProductoForm.get('productos')['controls'][0].get('descripcion').disable()
        this.IngresoProductoForm.get('productos')['controls'][0].get('producto').disable()
        this.IngresoProductoForm.get('productos')['controls'][0].get('precioUnitario').disable()
      }
      // if (this.IngresoProductoForm.value.almacen) {
        // this.SeleccionarCabecera(this.IngresoProductoForm.value.almacen.id,this.IngresoProductoForm.value.docReferencia);
      // }

      this.IngresoProductoForm.get('productos')['controls'][0].get('cantidad').disable();
      this.ValidarDocumento()
    }

    /*********************************************/
    CrearProducto(): FormGroup{
      return this.FormBuilder.group({
        'descripcion': [{value: null, disabled: false}, [
          Validators.required
        ]],
        'producto': [{value: null, disabled: false}, [
          Validators.required
        ]],
        'cantidad': [{value: null, disabled: true}, [ ]],
        'precioUnitario': [{value:null, disabled: false}, [
          Validators.required,
          Validators.min(1),
          Validators.pattern ('[0-9- ]+')
        ]],
      })
    }

    AgregarProducto():void{
      this.productos = this.IngresoProductoForm.get('productos') as FormArray;
      this.productos.push(this.CrearProducto());
    };

    ResetearForm(event) {
      // this.SeleccionarCabecera(this.IngresoProductoForm.value.almacen.id,this.IngresoProductoForm.value.docReferencia);
      this.ResetearFormArray(this.productos);
      this.Series = [];
      this.Articulos.Listado('', '', '', '', null,null,1, 10, 'descripcion', 'asc',1).subscribe(res => {
        this.Producto = res['data'].productos
      });
      this.almacen_destino=this.almacenes;
      this.almacen_destino=this.almacen_destino.filter(e=>e.id!=event.value.id);

      if (event.value==7) {
        // this.IngresoProductoForm.get('productos')['controls'][0].get('precioUnitario').disable()
      }else{
        // this.IngresoProductoForm.get('productos')['controls'][0].get('precioUnitario').enable()
      }

      this.ObtenerNumeroDocumento(event.value.id);

    }


    Reset(){
      // console.log(this.IngresoProductoForm);
      this.enviado=false;
      this.IngresoProductoForm.reset();
      this.ResetearFormArray(this.productos);
    }

    ResetearFormArray = (formArray: FormArray) => {
      if (formArray) {
        formArray.reset();
        while (formArray.length !== 1) {
          formArray.removeAt(0);
        }
      }
      this.IngresoProductoForm.get('productos')['controls'][0].get('descripcion').enable();
      this.IngresoProductoForm.get('productos')['controls'][0].get('descripcion').setValue("");
      this.IngresoProductoForm.get('productos')['controls'][0].get('cantidad').setValue(0);
      this.IngresoProductoForm.get('productos')['controls'][0].get('precioUnitario').enable();
      this.IngresoProductoForm.get('productos')['controls'][0].get('precioUnitario').setValue(0);
    }

    EliminarProducto(producto, i) {
      this.productos.removeAt(i);
      if (producto) {
        this.EliminarElemento2(this.Series,producto.id);
      }
      
      console.log(producto)
    };

    EliminarElemento(array:Array<any>,value) {
      array.forEach((item, index)=>{
        if (item.id==value) {
          array.splice(index,1)
        }
      })
    }

    EliminarElemento2(array,value){
      array.forEach((item,index)=>{
        if (item.id_producto==value) {
          array.splice(index,1)
        }
      })
    }

    FiltrarProductos(filtro){
      this.Articulos.Listado('','','',filtro,null,null,1,10,'descripcion','asc',1).subscribe(res=>{
        this.Producto=res['data'].productos;
      })
    }

    ProductoSeleccionado(index){

      this.IngresoProductoForm.get('productos')['controls'][index].get('cantidad').setValue(0);
      this.IngresoProductoForm.get('productos')['controls'][index].get('producto').setValue(this.IngresoProductoForm.get('productos')['controls'][index].value.descripcion);
      this.IngresoProductoForm.get('productos')['controls'][index].get('descripcion').disable()

      this.Producto=[];
      this.Articulos.Listado('', '', '', '', null,null,1, 10, 'descripcion', 'asc',1).subscribe(res => {
        this.Producto = res['data'].productos;
        for (let i of this.IngresoProductoForm['controls'].productos.value) {
          if (i.producto) {
            // console.log(i);
            this.EliminarElemento(this.Producto, i.producto.id);
          }
        }
      });
    }

    displayFn2(producto) {
      if (producto) {
        return producto.descripcion;
      } else {
        return '';
      }
    }
    /*********************************************/

    displayCliente(cliente?: any): string | undefined {
      return cliente ? cliente.nombre : undefined;
    }

    displayProveedor(proveedor?: any): string | undefined {
      return proveedor ? proveedor.nombre : undefined;
    }

    displayVendedor(vendedor?: any): string | undefined {
      return vendedor ? vendedor.nombre : undefined;
    }


    // Selector Proveedores activos
    ListarProveedor(nombre: string) {
      this.Servicios.ListarProveedor(nombre).subscribe( res => {
        this.proveedores = [];
       // console.log(res);
        // tslint:disable-next-line:forin
        for (let i in res) {
          this.proveedores.push(res[i]);
        }
      });
    }

    // Selector tipo de ingresos
    ListarTransaccionTipo() {
      this.Servicios.ListarTransaccionTipo('1').subscribe( res => {
        this.TipoIngresos=res;
        this.TipoIngresos = this.TipoIngresos.filter(e=>e.id!=2);
        this.TipoIngresos = this.TipoIngresos.filter(e=>e.id!=6);
        this.IngresoProductoForm.get('tipoIngreso').setValue(1);
      });
    }

    ListarCliente(nombre: string) {
      this.Servicios.ListarCliente(nombre).subscribe( res => {
        this.clientes = [];
        // tslint:disable-next-line:forin
        for (let i in res) {

            this.clientes.push(res[i]);
            // console.log(res[i]);
        }
      });
    }

    ListarVendedor(nombre: string) {
      this.Servicios.ListarVendedor(nombre).subscribe( res => {
        this.Vendedores = [];

        // tslint:disable-next-line:forin
        for (let i in res) {
            this.Vendedores.push(res[i]);

        }
      });
    }

  ObtenerNumeroDocumento(id_almacen){
    // this.MovimientoIngresoForm.value.almacen
    
    this.IngresoProductoservicios.ObtenerNumeroDocumento(id_almacen,1).subscribe(res=>{
      if(res)
      {
        this.documento_serie=res['data'].serie;
        this.documento_numero=res['data'].numero;
      }
    })
  }

  ListarTransferenciasPendientes() {
    if(this.IngresoProductoForm.value.tipoIngreso==7 && this.IngresoProductoForm.value.almacen){
      this.SMovimineto.ListarMovimientos(
        "",
        5,
        1,
        this.IngresoProductoForm.value.almacen.nombre,
        new Date("2018/01/01"),
        new Date(),
        "",
        1,
        20,
        "fecha asc"
      ).subscribe(res=>{
        // console.log(res['data'].transacciones);
        this.detalle_transacciones=res['data'].transacciones;
      })
    }
  }

  VerDetalle(detalle){
    this.IngresoProductoservicios.ObtenerDetalle(detalle.id).subscribe(res=>{
      let detalle_ventana = this.DialogoSerie.open(VentanaDetalle, {
        width: '800px',
        data: res
      });
    })

  }

  AgregarIngreso(transaccion){

    let contador=0

    let ingreso_ventana = this.DialogoSerie.open(VentanaFecha,{
      width: '800px'
    })

    ingreso_ventana.afterClosed().subscribe(res=>{
      if(res){
        this.IngresoProductoservicios.AgregarTransferenciaSucursal(
          this.IngresoProductoForm.value.almacen.id,
          7,
          4,
          transaccion.id_almacen,
          res,
          transaccion.documento,
          this.documento_numero
        ).subscribe (res => {
            let id_cabecera = res['data'];
            for(let i of transaccion.detalle) {
              this.IngresoProductoservicios.CrearTransaccionDetalle(id_cabecera,i.id_serie,i.cantidad*(-1),i.precio,"").subscribe()
              contador++
            }
            if(contador==transaccion.detalle.length){
              this.IngresoProductoForm.reset();
              this.enviado=false;
              this.Series = [];
              this.detalle_transacciones=[];
              this.ResetearFormArray(this.productos);
              this.snackBar.open('El ingreso se guardó satisfactoriamente', '', {
                duration: 2000,
              });
            }
        })
      }
    })
  }

  // Selector Almacenes Activos
  ListarAlmacen() {
    this.Servicios.ListarAlmacen().subscribe( res => {
      this.almacenes=res;
      this.almacen_origen=res;
      this.almacen_destino=res;
    })
  }

  AlmacenSeleccionado(evento){
    this.almacen_origen=this.almacenes;
    this.almacen_origen=this.almacen_origen.filter(e=>e.id!=evento.value);
  }


  AgregarSerie(producto,index) {

    const serieventana = this.DialogoSerie.open(ventanaseries, {
      width: '1200px',
      data: {producto: producto.get('producto').value.id, series:this.Series}
    });

    serieventana.afterClosed().subscribe(res=>{

      if (res) {

        let contador=0;

        for (let i of res) {
          this.EliminarElemento2(this.Series,i.producto);
        }

        for (let i of res) {
          if (i.serie != '') {
            this.Series.push({id_producto: producto.get('producto').value.id, serie: i.serie, color:i.color, almacenamiento: i.almacenamiento, observacion:i.observacion});
            contador++
          }
        }
        this.IngresoProductoForm.get('productos')['controls'][index].get('cantidad').setValue(contador)
      }
    })
  }



  Guardar(formulario) {

    let tipoingreso = formulario.value.tipoIngreso;
    this.enviado=true;

    // console.log(this.Series)

    if (tipoingreso == 1) {

      this.SDocumentos.ValidarDocumento(1,this.IngresoProductoForm.value.proveedor.id,this.IngresoProductoForm.value.docReferencia).subscribe(resultado=>{
        // Se valida que el documento no se haya registrado antes
        if (resultado['total']==0) {

          let contador, duplicados:number;
          contador=0;
          duplicados=0;
          // Se valida que las series no se hayan registrado antes
          this.Series.forEach((item, index)=>{
            this.SSeries.ValidarSerie(item.serie).subscribe(res=>{
              console.log(res)
              if (res==0) {
                contador++;
              }else{
                contador++;
                duplicados++;
              }
              if (contador==this.Series.length) {
                if (duplicados>0) {
                  this.snackBar.open('No se puede guardar porque hay series duplicadas', '', {
                    duration: 2000,
                  });
                  this.SSeries.Validacion.next(null)
                  this.enviado=false;
                }else{
                  this.IngresoProductoservicios.AgregarCompraMercaderia(
                    formulario.value.almacen.id,
                    1,
                    1,
                    formulario.value.proveedor.id,
                    formulario.value.fecingreso,
                    formulario.value.docReferencia,
                    this.documento_numero
                  ).subscribe (res => {
                    let id_cabecera = res['data'];
                    for (let i of formulario.value.productos) {
                      for (let is of this.Series) {
                        if (i.producto.id === is.id_producto) {
                          this.SSeries.CrearProductoSerie(i.producto.id,is.serie, is.color, is.almacenamiento, i.precioUnitario).subscribe(response => {
                            this.IngresoProductoservicios.CrearTransaccionDetalle(id_cabecera, response['data'], 1, i.precioUnitario, is.observacion).subscribe();
                          });
                        }
                      }
                    }
                    this.IngresoProductoForm.reset();
                    this.enviado=false;
                    this.Series = [];
                    this.ResetearFormArray(this.productos);
                    this.snackBar.open('El ingreso se guardó satisfactoriamente', '', {
                      duration: 2000,
                    });
                  });
                }
              }
            })
          })
        }else{
          this.snackBar.open('Ya se ha registrado este documento', '', {
            duration: 2000,
          });
          this.enviado=false;
        }
      })
    }

    // if (tipoingreso == 7) {

    //   this.SDocumentos.ValidarDocumento(7,this.id_almacen_referencia,this.IngresoProductoForm.value.docReferencia).subscribe(resultado=>{
    //     if (resultado['total']==0) {
    //       this.IngresoProductoservicios.AgregarTransferenciaSucursal(
    //         formulario.value.almacen.id,
    //         7,
    //         4,
    //         this.id_almacen_referencia,
    //         formulario.value.fecingreso,
    //         formulario.value.docReferencia,
    //         this.documento_numero
    //       ).subscribe (res => {
    //           let id_cabecera = res['data'];
    //           for(let i of this.detalle) {
    //             this.IngresoProductoservicios.CrearTransaccionDetalle(id_cabecera,i.id_serie,i.cantidad*(-1),i.precio,"").subscribe()
    //           }
    //       })
    //       this.IngresoProductoForm.reset();
    //       this.enviado=false;
    //       this.Series = [];
    //       this.ResetearFormArray(this.productos);
    //       this.snackBar.open('El ingreso se guardó satisfactoriamente', '', {
    //         duration: 2000,
    //       });
    //     }else{
    //       this.snackBar.open('Ya se ha registrado este documento', '', {
    //         duration: 2000,
    //       });
    //     }
    //   })
    // }
  }

}