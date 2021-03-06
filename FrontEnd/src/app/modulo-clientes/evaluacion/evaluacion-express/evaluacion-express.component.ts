import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { EvaluacionCoutasDataSource } from '../evaluacion-cuotas/evaluacion-cuotas.component';
import { merge, fromEvent, BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { EvaluacionService } from '../evaluacion.service';
import * as moment from 'moment';
import { ServiciosGenerales } from 'src/app/core/servicios/servicios';
import {saveAs} from 'file-saver';
import { ClienteService } from '../../clientes/clientes.service';
import { ServiciosDirecciones } from 'src/app/core/servicios/direcciones';
import { ServiciosTelefonos } from 'src/app/core/servicios/telefonos';
import { Notificaciones } from 'src/app/core/servicios/notificacion';
import { MatDialog } from '@angular/material/dialog';
import { VentanaProductosComponent } from '../../../modulo-ventas/ventas/ventana-productos/ventana-productos.component';

import {default as _rollupMoment, Moment} from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-evaluacion-express',
  templateUrl: './evaluacion-express.component.html',
  styleUrls: ['./evaluacion-express.component.scss'],
  providers: [ClienteService, ServiciosDirecciones, ServiciosTelefonos]
})

export class EvaluacionExpressComponent implements OnInit {

  public HacerReseteo = new BehaviorSubject<boolean>(false) ;

  @ViewChild('InputCapital', { static: true }) FiltroCapital : ElementRef ;
  @ViewChild('InputCuotas', { static: true }) FiltroCuotas : ElementRef ;
  @ViewChild('InputInteres', { static: true }) FiltroInteres : ElementRef ;
  @ViewChild('InputAporte', { static: true }) FiltroAporte : ElementRef ;
  @ViewChild('InputVendedor', { static: true }) VendedorAutoComplete : ElementRef;

  public Hoy : Date = new Date() ;
  public tipo : number = 1 ;
  public capital : number ;
  public cuotas : number ;
  public interes : number ;
  public aporte : number ;
  public prestamo : number ;
  public fecha_prestamo : Date ;
  public interes_por_dia : boolean ;
  public interes_diario : number ;
  public cronograma : Array<any> = [];
  public Columnas: string[] = ['numero','fecha','monto','aporte','total'] ;
  public ListadoCronograma : EvaluacionCoutasDataSource ;
  public correcto : boolean = false ;
  public InformacionForm : FormGroup ;
  public ddjj : string ;
  public autorizacion : string ;
  public compromiso : string ;
  public transaccion : string ;
  public tarjeta : string ;
  public generados : boolean ;
  public ExpressForm : FormGroup;
  public ListadoVendedores : Array<any>;
  public numero_cuotas_estandar : number ;
  public cuota_estandar : number ;
  public cuota_mensual_estandar : number ;
  public nueva_infomacion : boolean = false ;

  public informacion_cooperativa : any;
  public cooperativa_nombre : string ;
  public penalidad_porcentaje : number ;
  public penalidad_maxima_cuota : number ;
  public contrato_dias_premura : number ;
  public cooperativa_cuenta_banco : string ;
  public cooperativa_cuenta_numero : string ;
  public cooperativa_contacto : string ;
  public cooperativa_direccion : string ;
  public cooperativa_direccion_1 : string ;
  public cooperativa_direccion_2 : string ;
  public cooperativa_direccion_3 : string ;
  public cooperativa_direccion_4 : string ;
  public dias_contrato_premura : number ;
  public presidente_nombre : string ;
  public presidente_dni : string ;
  public presidente_direccion : string ;
  public interes_diario_deshabilitado : boolean = false ;

  public Series : Array<number> = [] ;
  public productos: FormArray;

  constructor(
    private Builder : FormBuilder ,
    private Dialogo : MatDialog ,
    private ServiciosGenerales : ServiciosGenerales,
    private ClienteServicios: ClienteService,
    private ServicioDireccion: ServiciosDirecciones,
    private ServicioTelefono: ServiciosTelefonos,
    private Servicios : EvaluacionService,
    private Notificacion: Notificaciones ,
  ) { }

  ngOnInit() {
    this.ListadoCronograma = new EvaluacionCoutasDataSource;
    this.CrearFormularios();
    this.ObtenerDatosCooperativa();
    this.ListarVendedor("");
    
    this.capital = 0;
    this.cuotas = 0;
    this.interes = 15;
    this.aporte = 20;
    this.prestamo = 0;
    this.interes_por_dia=false;
    this.interes_diario=0;
    this.fecha_prestamo=new Date();
    this.CorregirFecha();

    this.InformacionForm = this.Builder.group({});
  }

  ngAfterViewInit(): void {
    merge(
      fromEvent(this.FiltroCapital.nativeElement,'keyup'),
      fromEvent(this.FiltroCuotas.nativeElement,'keyup'),
      fromEvent(this.FiltroInteres.nativeElement,'keyup'),
      fromEvent(this.FiltroAporte.nativeElement,'keyup'),
    ).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        if ( Number.isInteger(this.capital) && Number.isInteger(this.cuotas) ) {
          this.correcto=true;
          this.CalcularPagos();
        }else{
          this.correcto=false;
        }
      })
    ).subscribe();

    merge(
      fromEvent(this.FiltroInteres.nativeElement, 'keyup'),
      fromEvent(this.FiltroAporte.nativeElement, 'keyup')
    )
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        this.CalcularPagos();
      })
    ).subscribe();
    
    fromEvent(this.VendedorAutoComplete.nativeElement, 'keyup')
    .pipe(
      debounceTime(10),
      distinctUntilChanged(),
      tap(() => {
        this.ListarVendedor(this.VendedorAutoComplete.nativeElement.value);
      })
    ).subscribe();

  }
  
  CorregirFecha(){
    let fecha_inicio ;
    if ( moment(this.ExpressForm.value.fecha_letras).date() > 15 ) {
      fecha_inicio = moment(this.ExpressForm.value.fecha_letras).add(1,'month').endOf('month').toDate() ;
    } else {
      fecha_inicio = moment(this.ExpressForm.value.fecha_letras).endOf('month').toDate() ;
    }
    this.ExpressForm.get('fecha_pago').setValue(fecha_inicio) ;
  }

  CrearFormularios(){
    this.ExpressForm = this.Builder.group({
      lugar : [ "Ate Vitarte",[Validators.required] ],
      id_vendedor : [ null,[Validators.required] ],
      vendedor_dni : [ "",[] ],
      vendedor : [ "",[] ],
      fin_mes : [ true ],
      fecha_pago : [ new Date(),[Validators.required] ],
      fecha_letras : [ new Date(),[Validators.required] ],
      productos: this.Builder.array([]),
    }) ;

    this.productos = this.ExpressForm.get('productos') as FormArray;
  }

  ObtenerDatosCooperativa(){
    let i = 0;
    this.Servicios.ObtenerInformacion().subscribe(res=>{
      this.informacion_cooperativa=res;
      this.cooperativa_nombre=this.informacion_cooperativa['cooperativa'].find(e => e.parametro=="nombre").valor;
      this.penalidad_porcentaje=this.informacion_cooperativa['cooperativa_configuracion'].find(e => e.parametro=="penalidad_credito_porcentaje").valor;
      this.penalidad_maxima_cuota=this.informacion_cooperativa['cooperativa_configuracion'].find(e => e.parametro=="penalidad_credito_cuota_maxima").valor;
      this.contrato_dias_premura=this.informacion_cooperativa['cooperativa_configuracion'].find(e => e.parametro=="transaccion_contrato_dias_premura").valor;
      this.dias_contrato_premura = this.informacion_cooperativa['cooperativa_configuracion'].find(e => e.parametro=="transaccion_contrato_dias_premura").valor;
      this.cooperativa_cuenta_banco=this.informacion_cooperativa['cuenta'].banco;
      this.cooperativa_cuenta_numero=this.informacion_cooperativa['cuenta'].cuenta;
      this.cooperativa_contacto=this.informacion_cooperativa['contacto'];

      this.cooperativa_direccion_1=this.informacion_cooperativa['direccion_transaccion'].filter(e=>e.numero_orden==1)[0].direccion;
      this.cooperativa_direccion_2=this.informacion_cooperativa['direccion_transaccion'].filter(e=>e.numero_orden==2)[0].direccion;
      this.cooperativa_direccion_3=this.informacion_cooperativa['direccion_transaccion'].filter(e=>e.numero_orden==3)[0].direccion;
      this.cooperativa_direccion_4=this.informacion_cooperativa['direccion_transaccion'].filter(e=>e.numero_orden==4)[0].direccion;

      this.informacion_cooperativa['direccion_transaccion'].forEach((item,index)=>{
        if(item.id_tipo=1) {
          this.cooperativa_direccion=item.direccion;
        }
      });

      this.presidente_nombre = this.informacion_cooperativa['presidente'].nombre;
      this.presidente_dni = this.informacion_cooperativa['presidente'].documento;
      this.presidente_direccion = this.informacion_cooperativa['presidente'].direccion;
    })
  }

  CambioInteresDiario(evento){
    this.interes_por_dia=evento.checked;
    if (this.interes_por_dia) {
      this.CalcularInteresDiario();
    }else{
      this.interes_diario=0;
    }
    this.CalcularPagos()
  }

  CalcularInteresDiario(){
    let fecha_prestamo = this.ExpressForm.value.fecha_letras ;
    if (this.interes_por_dia) {
      let interes = this.capital*this.interes/100;
      this.interes_diario=Math.round( interes * (1-(moment(fecha_prestamo).date()/moment(fecha_prestamo).daysInMonth()) )*10)/10;
    } else {
      this.interes_diario=0;
    }
  }

  ObtenerCliente(evento){
    this.nueva_infomacion = true ;
    this.InformacionForm = evento.formulario;
    if(evento.reset) {
      this.ExpressForm.reset();
      this.capital = 0 ;
      this.cuotas = 0 ;
      this.prestamo = 0 ;
      this.tipo = 1 ;
      this.interes = 15 ;
      this.aporte = 20 ;
      this.interes_por_dia = false ;
      // this.fecha_inicio=moment(new Date()).add(1,'month').endOf('month').toDate();
      this.CorregirFecha();
      this.ExpressForm.get('lugar').setValue("Ate Vitarte")
      this.ExpressForm.get('fecha_letras').setValue(new Date()) ;
      this.EstablecerFechaInicio() ;
    }
  }

  EstablecerFechaInicio() {
    let fecha_inicio ;
    if ( moment(this.ExpressForm.value.fecha_letras).date() > 15 ) {
      fecha_inicio = moment(this.ExpressForm.value.fecha_letras).add(1,'month').endOf('month').toDate() ;
    } else {
      fecha_inicio = moment(this.ExpressForm.value.fecha_letras).endOf('month').toDate() ;
    }
    this.ExpressForm.get('fecha_pago').setValue(fecha_inicio) ;
  }

  AnoElegido(ano_normalizado: Moment) {
    let ano_seleccionado : moment.Moment ;
    // Se colocó este 'if' para que cuando el valor inicial de 'fecha_fin' sea null, no haya errores en consola
    if( this.ExpressForm.value.fecha_pago ) {
      ano_seleccionado = moment(this.ExpressForm.value.fecha_pago) ;
    } else {
      ano_seleccionado = moment() ;
    }
    ano_seleccionado.year(ano_normalizado.year());
    this.ExpressForm.get('fecha_pago').setValue(ano_seleccionado);
  }

  MesElegido(mes_normalizado: Moment, datepicker: MatDatepicker<Moment>) {
    let mes_seleccionado : moment.Moment ;
    // Se colocó este 'if' para que cuando el valor inicial de 'fecha_fin' sea null, no haya errores en consola
    if( this.ExpressForm.value.fecha_pago ) {
      mes_seleccionado = moment(this.ExpressForm.value.fecha_pago) ;
    } else {
      mes_seleccionado = moment() ;
    }

    mes_seleccionado.year(mes_normalizado.year()) ;
    mes_seleccionado.month(mes_normalizado.month());
    
    this.ExpressForm.get('fecha_pago').setValue(moment(mes_seleccionado).endOf('month').toDate());
    datepicker.close();
    this.CambioFechaInicio() ;
  }

  CambioFechaInicio(){
    let fecha_letras = this.ExpressForm.value.fecha_letras ;
    let fecha_inicio = this.ExpressForm.value.fecha_pago ;
    if( fecha_inicio < fecha_letras ) {
      this.ExpressForm.get('fecha_letras').setValue( fecha_inicio ) ;
    }
    this.CambioFechaLetras();
  }

  CambioFechaLetras(){
    let fecha_inicio = this.ExpressForm.value.fecha_pago ;
    let mes_inicio_pagos = moment(fecha_inicio).month() ;
    let mes_firma = moment(this.ExpressForm.value.fecha_letras).month() ;
    if( mes_inicio_pagos == mes_firma ) {
      this.interes_diario_deshabilitado = true ;
      this.interes_por_dia = false ;
      this.CalcularInteresDiario() ;
    } else {
      this.interes_diario_deshabilitado = false ;
    }
    this.CalcularPagos();
  }

  CalcularPagos(){

    // this.EvaluarRegla();
    // this.CalcularInteresDiario();
    // this.CambioModoPago()
    let aporte : number ;
    if(this.interes==0) {
      aporte = 0;
    } else {
      aporte = this.aporte;
    }

    this.cronograma=[];
    let i = 1;

    //Se calcula el monto total y el interés
    let interes : number =  Math.round(+this.capital * (this.interes /100 ) *100 ) / 100;
    let total : number = Math.round(+this.capital * ( 1 + +this.cuotas * this.interes / 100 ) *100 ) / 100

    // Se considera la fecha de inicio la fecha de firma del préstamo
    this.fecha_prestamo = this.ExpressForm.value.fecha_letras ;

    let fecha_inicio = this.ExpressForm.value.fecha_pago ;

    // Se calculan las fechas de las cuotas
    let ano_pago = moment(fecha_inicio).year();
    let mes_pago = moment(fecha_inicio).month();
    let dia_pago = moment(fecha_inicio).date();
    let fecha_corregida : Date = new Date(ano_pago, mes_pago, dia_pago);
    let fecha : Date;

    // Se evalúa si el crédito se da antes o después de quincena
    let dia_credito :number = moment(this.fecha_prestamo).date();
    let mes_credito :number = moment(this.fecha_prestamo).month();
    let ano_credito :number = moment(this.fecha_prestamo).year();
    let dias_mes : number = moment(this.fecha_prestamo).daysInMonth();
    let interes_truncado = Math.round( ((dias_mes - dia_credito) / dias_mes) * interes * 100 ) / 100;

    let numero_cuotas = +moment(fecha_inicio).diff(moment(this.fecha_prestamo), 'months') ;

    this.numero_cuotas_estandar = +this.cuotas ;
    this.cuota_estandar = total/+this.cuotas ;

    // console.log(total, numero_cuotas , this.cuota_estandar, this.numero_cuotas_estandar)
    // Se reemplazó numero_cuotas por (mes_pago - mes_credito)

    // Si el crédito es antes de quincena, se paga a fin de mes los intereses truncados
    if( this.interes_por_dia ){
      let fecha_1 = moment(this.fecha_prestamo).endOf('month');
      this.cronograma.push({
        numero: 0,
        fecha: fecha_1,
        fecha_formato: moment(fecha_1).locale('es').format('LL'),
        monto: interes_truncado,
        capital : 0,
        interes : interes_truncado,
        aporte: aporte,
        total: interes_truncado+aporte ,
        total_acumulado : interes_truncado + aporte
      })
    }

    // Se pagan los intereses mientras no se cancele el crédito
    if( numero_cuotas > 1){
      for( i; i<numero_cuotas; i++){
        fecha=moment(new Date(ano_credito, mes_credito, dia_pago)).add(i, 'months').toDate();
        this.cronograma.push({
          numero: i,
          fecha: fecha,
          fecha_formato: moment(fecha).locale('es').format('LL'),
          monto: interes,
          capital : 0,
          interes : interes,
          aporte: aporte,
          total: interes + aporte,
          total_acumulado : interes + aporte
        })
      }
    };

    let monto_acumulado : number = 0;
    // Se calcula el monto de las cuotas normales
    let monto : number = ( (total)/this.cuotas ) ;

    for (let j = 1; j<=this.cuotas; j++) {
      // Se le da valor para tener la cuota mensual
      this.cuota_mensual_estandar = monto+ aporte ;

      fecha=moment(fecha_corregida).add(j-1, 'months').toDate();
      this.cronograma.push({
        numero: i+j-1,
        fecha: fecha,
        fecha_formato: moment(fecha).locale('es').format('LL'),
        monto: monto,
        capital : monto-interes,
        interes : interes,
        aporte: aporte,
        total: monto+ aporte,
        total_acumulado : monto + aporte
      })
    }

    this.prestamo = Math.round(
      +this.cronograma.reduce( (acumulador, item)=>{
        return ( acumulador + item.monto ) ;
      },0 )
    * 100 ) / 100;

    this.ListadoCronograma.CargarInformacion(this.cronograma);
    // console.log(this.cronograma);

  }

  ListarVendedor(nombre: string) {
    this.ServiciosGenerales.ListarVendedor("",nombre,"",1,5).subscribe( res => {
      this.ListadoVendedores=res;
    });
  }

  VendedorSeleccionado(){
    let nombre_vendedor= this.ExpressForm.value.vendedor.nombre;
    this.ExpressForm.get('id_vendedor').setValue(this.ExpressForm.value.vendedor.id);
    this.ExpressForm.get('vendedor_dni').setValue(this.ExpressForm.value.vendedor.dni);
    this.ExpressForm.get('vendedor').setValue(nombre_vendedor);
  }
  
  RemoverVendedor(){
    this.ExpressForm.get('id_vendedor').setValue(null);
    this.ExpressForm.get('vendedor').setValue("");
    this.ExpressForm.get('vendedor_dni').setValue("");
    this.ListarVendedor("");
  }

  // Se debe utilizar cuando se escribe la dirección en el formulario.
  // Esto no se debe ejecutar cuando la dirección viene de la BBDD.
  CrearDireccionCompleta() : string {
    let direccion :string = this.InformacionForm.value.direccion_nombre ;
    // Transforma dirección a Capitalize
    direccion = direccion.toLowerCase().replace(/\b[a-z]/g, function(letra) {
      return letra.toUpperCase();
    });
    // // direccion = direccion.replace("ñ","n") ;
    // // direccion = direccion[0].toUpperCase() + direccion.slice(1);
    
    let distrito : string = this.InformacionForm.value.direccion_distrito_nombre ;
    // distrito = distrito.toLowerCase().replace(/\b[a-z]/g, function(letra) {
    //   return letra.toUpperCase();
    // });
    // // distrito = distrito.replace("ñ","n") ;
    // distrito = distrito.replace(/^(.)|\s+(.)/g, function ($1) {
    //   return $1.toUpperCase()
    // })

    let provincia : string = this.InformacionForm.value.direccion_provincia ;
    // provincia = provincia.toLowerCase().replace(/\b[a-z]/g, function(letra) {
    //   return letra.toUpperCase();
    // });
    // // provincia = provincia.replace("ñ","n") ;
    // provincia = provincia.replace(/^(.)|\s+(.)/g, function ($1) {
    //   return $1.toUpperCase()
    // })

    let departamento : string = this.InformacionForm.value.direccion_departamento ;
    // departamento = departamento.toLowerCase().replace(/\b[a-z]/g, function(letra) {
    //   return letra.toUpperCase();
    // });
    // departamento = departamento.replace(/^(.)|\s+(.)/g, function ($1) {
    //   return $1.toUpperCase()
    // })

    departamento = departamento.replace("ñ","n") ;
    // console.log(departamento, provincia, distrito)

    let direccion_completa : string = direccion + ", distrito de " + distrito + ", provincia de " + provincia + " del departamento de " + departamento ;
    return direccion_completa ;
  }

  CambioTipoVenta(){
    if(this.tipo==1){
      this.aporte = 20 ;
      this.interes = 15 ;
    } else {
      this.aporte = 0 ;
      this.interes = 0 ;
    }
    this.CalcularInteresDiario();
  }

  Print(){
    console.log("Express",this.ExpressForm);
    console.log("Informacion",this.InformacionForm);
  }
  
  CrearProducto(): FormGroup{
    return this.Builder.group({
      'id_producto': [{value: null, disabled: false}, [
        Validators.required
      ]],
      'nombre': [{value: "", disabled: false}, [
      ]],
      'descripcion': [{value: "", disabled: false}, [
      ]],
      'id_serie': [{value: null, disabled: false}, [
        Validators.required
      ]],
      'serie': [{value: null, disabled: false}, [
      ]],
      'precio': [{value:null, disabled: false}, [
      ]],
      'estado': [{value:1, disabled: false}, [
      ]],
    })
  }

  AgregarProducto():void{
    this.productos.push(this.CrearProducto());
  };

  EliminarProductos(index,producto){
    if (producto.value.estado==1) {
      this.productos.removeAt(index);
      this.Series.splice( this.Series.indexOf(producto.value.id_serie), 1 );
    }
    if (producto.value.estado==2) {
      this.productos['controls'][index].get('descripcion').disable()
      this.productos['controls'][index].get('serie').disable()
      this.productos['controls'][index].get('precio').disable()
      this.productos['controls'][index].get('estado').setValue(3);
    }
  }

  ResetearProductosFormArray(){
    if (this.productos) {
      let productos = this.productos.value ;
      
      productos = productos.filter(elemento => elemento.estado==2 || elemento.estado==3)

      if( productos.length > 0 ) {
        this.productos.setValue(productos) ;
      } else {
        this.productos.reset() ;
        while (this.productos.length !== 0) {
          this.productos.removeAt(0)
        }
      }
    }
  }

  SeleccionarSeries(){
    let Ventana = this.Dialogo.open(VentanaProductosComponent,{
      width: '1200px',
      data: {sucursal: 1, series: this.Series, productos : this.ExpressForm['controls'].productos.value }
    })

    Ventana.afterClosed().subscribe(res=>{
      if (res) {
        this.Series = [] ;
        this.ResetearProductosFormArray() ;
        res.map( (producto, index) => {
          if ( producto.estado != 2 ) {
            this.AgregarProducto() ;
            this.ExpressForm['controls'].productos['controls'][index].get('id_producto').setValue( producto.id_producto );
            this.ExpressForm['controls'].productos['controls'][index].get('nombre').setValue( producto.producto );
            this.ExpressForm['controls'].productos['controls'][index].get('descripcion').setValue( producto.producto );
            this.ExpressForm['controls'].productos['controls'][index].get('id_serie').setValue( producto.id_serie );
            this.ExpressForm['controls'].productos['controls'][index].get('serie').setValue( producto.serie );
            this.ExpressForm['controls'].productos['controls'][index].get('precio').setValue( producto.precio );
  
            this.Series.push(producto.id_serie) ;
            return producto ;
          }
        }) ;
      }
    })
  }

  GenerarEmail() : string {
    // if( !this.ClientesForm.value.email ){
      let apellido : string, nombres : string, primer_nombre : string ;
      let nombre : string = this.InformacionForm.value.nombre.toLowerCase() ;
      let email : string ;
      if( nombre && nombre.includes(',') ) {
        apellido = nombre.substring(0,nombre.search(" ") ) ;
        apellido = apellido.trim() ;
        nombres = nombre.substring(nombre.search(",")+1,nombre.length ) ;
        nombres = nombres.trim() ;
        if( nombres.includes(" ") ){
          primer_nombre = nombres.substring(0,nombres.search(" ") ) ;
        } else {
          primer_nombre = nombres.substring(0,nombres.length ) ;
        }
        primer_nombre = primer_nombre.trim() ;
        email = primer_nombre + apellido + "@gmail.com" ;
        // // this.InformacionForm.get("email").setValue(email) ;
        // console.log(email)
        email = email.replace("ñ","n") ;
        // console.log(email);
        return email;
      }
    // }
  }

  GenerarArchivos(){
    let ahora = (new Date()).getTime();
    this.generados = false ;

    this.ddjj = "" ;
    this.autorizacion = "" ;
    this.compromiso = "" ;
    this.transaccion = "" ;
    this.tarjeta = "" ;

    if( this.nueva_infomacion && this.InformacionForm.value.cliente_nuevo ){
      this.CrearCliente(this.InformacionForm);
      this.nueva_infomacion = false ;
    } else {
      this.ActualizarCliente() ;
    }

    this.GenerarDDJJ("DDJJ_"+ahora);
    this.GenerarCompromiso("Compromiso_"+ahora);
    this.GenerarAutorizacion("Autorizacion_"+ahora);
    this.GenerarTarjeta("Tarjeta_"+ahora);
    this.GenerarTransaccion("Transaccion_"+ahora);
  }

  GenerarDDJJ(nombre_archivo){
    let direccion_completa : string ;

    direccion_completa = this.CrearDireccionCompleta();

    this.Servicios.GenerarDDJJ(
      this.InformacionForm.value.plantilla_ddjj,
      nombre_archivo,
      this.InformacionForm.value.nombre,
      this.InformacionForm.value.dni,
      this.InformacionForm.value.direccion_distrito_nombre,
      this.InformacionForm.value.direccion_completa ? this.InformacionForm.value.direccion_completa : direccion_completa,
      this.ExpressForm.value.lugar,
      this.ExpressForm.value.fecha_letras
    ).subscribe(res=>{
      if(res['codigo']==0){
        this.generados=true;
        this.ddjj=res['data'];
      }
    })
  }

  GenerarAutorizacion(nombre_archivo){
    let direccion_completa : string ;

    direccion_completa = this.CrearDireccionCompleta();

    this.Servicios.GenerarAutorizacion(
      this.InformacionForm.value.plantilla_autorizacion,
      nombre_archivo,
      this.cooperativa_nombre,
      "2",
      this.InformacionForm.value.nombre,
      this.InformacionForm.value.cargo_estado_nombre,
      this.InformacionForm.value.dni,
      this.InformacionForm.value.cip,
      this.InformacionForm.value.codigo,
      this.InformacionForm.value.direccion_completa ? this.InformacionForm.value.direccion_completa : direccion_completa,
      this.InformacionForm.value.telefono_tipo_nombre,
      this.InformacionForm.value.telefono_numero,
      this.InformacionForm.value.email ? this.InformacionForm.value.email : this.GenerarEmail(),
      this.InformacionForm.value.subsede_nombre,
      this.aporte,
      +this.cuota_mensual_estandar,
      this.cuotas,
      this.ExpressForm.value.lugar,
      this.ExpressForm.value.fecha_letras,
      this.InformacionForm.value.parametro_autorizacion_1 ,
      this.InformacionForm.value.parametro_autorizacion_2 ,
    ).subscribe(res=>{
      if(res['codigo']==0){
        this.generados=true;
        this.autorizacion=res['data'];
      }
    })
  }

  GenerarTransaccion(nombre_archivo){
    let direccion_completa : string ;

    // console.log(this.cronograma) ;
    
    direccion_completa = this.CrearDireccionCompleta();

    this.Servicios.GenerarTransaccion(
      this.InformacionForm.value.plantilla_transaccion,
      nombre_archivo,
      this.InformacionForm.value.parametro_condicion ,
      this.InformacionForm.value.parametro_domicilio_laboral ,
      this.InformacionForm.value.parametro_autorizacion_1 ,
      this.InformacionForm.value.parametro_autorizacion_2 ,
      this.cooperativa_nombre,
      this.cooperativa_direccion,
      this.cooperativa_direccion_1,
      this.cooperativa_direccion_2,
      this.cooperativa_direccion_3,
      this.cooperativa_direccion_4,
      this.cooperativa_cuenta_banco,
      this.cooperativa_cuenta_numero,
      this.presidente_nombre,
      this.presidente_dni,
      this.presidente_direccion,
      this.InformacionForm.value.nombre,
      this.InformacionForm.value.cargo_estado_nombre, 
      this.InformacionForm.value.dni,
      this.InformacionForm.value.cip,
      true,
      this.InformacionForm.value.direccion_completa ? this.InformacionForm.value.direccion_completa : direccion_completa,
      this.InformacionForm.value.casilla ,
      this.InformacionForm.value.subsede_nombre,
      this.ExpressForm.value.fecha_letras,
      this.dias_contrato_premura,
      Math.round(this.prestamo*100)/100,
      Math.round(this.cuota_estandar*100)/100,
      this.cuotas,
      this.penalidad_porcentaje,
      this.penalidad_maxima_cuota,
      this.InformacionForm.value.cuenta_banco_nombre,
      this.InformacionForm.value.cuenta_numero,
      this.InformacionForm.value.email ? this.InformacionForm.value.email : this.GenerarEmail(),
      this.InformacionForm.value.telefono_numero,
      this.ExpressForm.value.lugar,
      this.ExpressForm.value.vendedor,
      this.ExpressForm.value.vendedor_dni,
      this.cronograma,
      this.tipo,
      this.productos.value ,
      (this.InformacionForm.value.hay_garante && this.InformacionForm.value.dni_garante)? this.InformacionForm.value.nombre_garante : "0",
      (this.InformacionForm.value.hay_garante && this.InformacionForm.value.dni_garante) ? this.InformacionForm.value.dni_garante : "0",
    ).subscribe(res=>{
      this.generados=true;
      this.transaccion=res['data'];
    })
  }

  GenerarCompromiso(nombre_archivo){
    this.Servicios.GenerarCompromiso(
      this.InformacionForm.value.plantilla_compromiso,
      nombre_archivo,
      this.cooperativa_nombre,
      this.InformacionForm.value.nombre,
      this.InformacionForm.value.dni,
      this.InformacionForm.value.cip,
      this.cooperativa_cuenta_banco,
      this.cooperativa_cuenta_numero,
      this.cooperativa_contacto,
      this.InformacionForm.value.fecha_letras
    ).subscribe(res=>{
      // console.log(res)
      if(res['codigo']==0){
        this.generados=true;
        this.compromiso=res['data'];
      }
    })
  }

  GenerarTarjeta(nombre_archivo){
    let direccion_completa : string ;

    direccion_completa = this.CrearDireccionCompleta();
    
    this.Servicios.GenerarTarjeta(
      this.InformacionForm.value.plantilla_tarjeta,
      nombre_archivo,
      this.InformacionForm.value.nombre,
      this.InformacionForm.value.dni,
      this.InformacionForm.value.cip,
      this.InformacionForm.value.codigo,
      this.InformacionForm.value.cargo_estado_nombre,
      this.InformacionForm.value.direccion_nombre,
      this.InformacionForm.value.direccion_distrito_nombre,
      this.InformacionForm.value.direccion_provincia,
      this.InformacionForm.value.direccion_departamento,
      this.InformacionForm.value.telefono_numero,
      this.InformacionForm.value.cuenta_banco_nombre,
      this.InformacionForm.value.cuenta_numero,
      this.ExpressForm.value.fecha_letras,
      this.InformacionForm.value.parametro_autorizacion_1 ,
      this.InformacionForm.value.parametro_autorizacion_2 ,
      this.prestamo ,
      this.cuotas ,
      this.cuota_mensual_estandar ,
      this.InformacionForm.get('fecha_afiliacion').value ? this.InformacionForm.get('fecha_afiliacion').value : this.ExpressForm.value.fecha_letras
    ).subscribe(res=>{
      if(res['codigo']==0){
        this.generados=true;
        this.tarjeta=res['data'];
      }
    })
  }

  AbrirArchivo(nombre_archivo){
    this.Servicios.ObtenerArchivo(nombre_archivo).subscribe(res=>{
      saveAs(res, nombre_archivo+'.docx');
    })
  }

  CrearCliente(formulario) {
    //console.log(formulario.value.subsede);
    this.ClienteServicios.Agregar(
      formulario.value.subsede,
      formulario.value.cargo,
      formulario.value.cargo_estado,
      formulario.value.codigo,
      formulario.value.dni,
      formulario.value.nombre,
      formulario.value.cip,
      formulario.value.email,
      formulario.value.casilla,
      0,
      "",
      0,
      0,
      "",
      20,
      5,
      0
    ).subscribe(res =>{
      console.log(res)

      if(res['codigo']==0){
        this.Notificacion.Snack("Se creó el cliente satisfactoriamente.","")
      } else {
        this.Notificacion.Snack("Ocurrió un error al crear al cliente.","")
      }

      if(this.InformacionForm.value.cuenta_numero){
        this.ClienteServicios.CrearCuenta(res['data'], this.InformacionForm.value.cuenta_banco, this.InformacionForm.value.cuenta_numero, "").subscribe(resultado=>{
          console.log(resultado)
        })
      }

      this.ServicioTelefono.CrearTelefono(res['data'], this.InformacionForm.value.telefono_numero, this.InformacionForm.value.telefono_tipo).subscribe(resultado=>{
        console.log(resultado)
      })

      this.ServicioDireccion.CrearDireccion(res['data'], this.InformacionForm.value.direccion_nombre, this.InformacionForm.value.direccion_distrito).subscribe(resultado=>{
        console.log(resultado)
      })
    });
  }

  ActualizarCliente(){

    let email : string, casilla : string ;
    // Si el email y casilla ya estaban registrados, se actualizan
    // Si son nuevos, se compara con los autogenerados. Si son diferentes, se actualizan
    if ( this.InformacionForm.value.casilla_real === 0) {
      if( this.InformacionForm.value.casilla==this.InformacionForm.value.casilla_consulta ) {
        casilla = ""
      } else {
        casilla = this.InformacionForm.value.casilla
      }
    } else {
      casilla = this.InformacionForm.value.casilla
    }

    if ( this.InformacionForm.value.email_real === 0 ) {
      if( this.InformacionForm.value.email==this.InformacionForm.value.email_consulta ) {
        email = "" ;
      } else {
        email = this.InformacionForm.value.email ;
      }
    } else {
      email = this.InformacionForm.value.email ;
    }

    this.ClienteServicios.ActualizarParcial(
      this.InformacionForm.value.id_cliente,
      this.InformacionForm.value.subsede,
      this.InformacionForm.value.cargo,
      this.InformacionForm.value.cargo_estado,
      this.InformacionForm.value.codigo,
      this.InformacionForm.value.dni,
      this.InformacionForm.value.nombre,
      this.InformacionForm.value.cip,
      email ,
      casilla
    ).subscribe(res=>{
      // console.log(res) ;
      this.ActualizarDireccion() ;
      this.ActualizarTelefono() ;
      this.ActualizarCuenta() ;
    }) ;
  }
  
  ActualizarDireccion() {
    // Si se ha escrito la dirección, se actualiza o guarda
    if( this.InformacionForm.value.direccion_completa ) {
      if( !this.InformacionForm.value.id_direccion ) {
        this.ServicioDireccion.CrearDireccion(
          this.InformacionForm.value.id_cliente,
          this.InformacionForm.value.direccion_nombre,
          this.InformacionForm.value.direccion_distrito
        ).subscribe(res=>{
        })
      } else {
        this.ServicioDireccion.ActualizarDireccion(
          this.InformacionForm.value.id_direccion,
          this.InformacionForm.value.direccion_nombre,
          this.InformacionForm.value.direccion_distrito
        ).subscribe(res=>{
        })
      }
    }
  }

  ActualizarTelefono() {
    // Si hay teléfono, se actualiza o guarda
    if( !this.InformacionForm.value.id_telefono ) {
      this.ServicioTelefono.CrearTelefono(
        this.InformacionForm.value.id_cliente,
        this.InformacionForm.value.telefono_numero,
        this.InformacionForm.value.telefono_tipo
      ).subscribe(res=>{
      })
    } else {
      this.ServicioTelefono.ActualizarTelefono(
        this.InformacionForm.value.id_telefono,
        this.InformacionForm.value.telefono_numero,
        this.InformacionForm.value.telefono_tipo
      ).subscribe(res=>{
      })
    }
  }

  ActualizarCuenta() {
    // Si hay cuenta, se actualiza o guarda
    if( !this.InformacionForm.value.id_cuenta ) {
      this.ClienteServicios.CrearCuenta(
        this.InformacionForm.value.id_cliente,
        this.InformacionForm.value.cuenta_banco,
        this.InformacionForm.value.cuenta_numero,
        ""
      ).subscribe(res=>{
      })
    } else {
      this.ClienteServicios.ActualizarCuenta(
        this.InformacionForm.value.id_cuenta,
        this.InformacionForm.value.cuenta_banco,
        this.InformacionForm.value.cuenta_numero,
        ""
      ).subscribe(res=>{
        // console.log(res)
      })
    }
  }

  ResetearFormularios() {
    this.HacerReseteo.next(true) ;
  }

}

