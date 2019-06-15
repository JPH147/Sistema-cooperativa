import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, AfterViewInit, Optional } from '@angular/core';
import { CreditosService } from './creditos.service';
import {FormArray, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { MatDialog, MatSort } from '@angular/material';
import {ServiciosTipoPago} from '../global/tipopago';
import {ClienteService } from '../clientes/clientes.service';
import { forkJoin,fromEvent, merge, BehaviorSubject} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import {ServiciosTelefonos} from '../global/telefonos';
import {ServiciosDirecciones,} from '../global/direcciones';
import {ServiciosGenerales} from '../global/servicios';
import * as moment from 'moment';
import {Location} from '@angular/common';
import {Notificaciones} from '../global/notificacion';
import {URLIMAGENES} from '../global/url'
import {SeleccionarClienteComponent} from '../retorno-vendedores/seleccionar-cliente/seleccionar-cliente.component';
import { VentanaEmergenteContacto} from '../clientes/ventana-emergentecontacto/ventanaemergentecontacto';
import { ReglasEvaluacionService } from '../tablas-maestras/reglas-evaluacion/reglas-evaluacion.service';

@Component({
  selector: 'app-creditos',
  templateUrl: './creditos.component.html',
  styleUrls: ['./creditos.component.scss'],
  providers: [CreditosService, ClienteService, ServiciosDirecciones, ServiciosTelefonos, ServiciosGenerales, ServiciosTipoPago, ReglasEvaluacionService]
})
export class CreditosComponent implements OnInit, AfterViewInit {

  public Cargando = new BehaviorSubject<boolean>(false);
  public CreditosForm: FormGroup
  public id_credito: number;
  public id_credito_editar: number;
  public id_cliente: number;
  public id_tipo : number;
  public garantes: FormArray;
  public editar_cronograma:number;
  public Reglas : Array<any>;
  public ruta: string;
  public numero_afiliacion : number;
  public cliente_afiliado : boolean;
  public numero_cuotas: number;
  public monto_cuota: number;
  public total_cronograma : number; // No necesariamente es el mismo que el total del formulario por los intereses diarios

  public ListadoCronograma: CronogramaDataSource;
  public ColumnasCronograma: Array<string>;
  public Cronograma: Array<any> = [];
  public total_cronograma_editado: number;
  public diferencia: number;

  public foto : string = "";
  public dni : string = "";
  public cip : string = "";
  public planilla : string = "";
  public voucher : string = "";
  public recibo : string = "";
  public casilla : string = "";
  public transaccion : string = "";
  public autorizacion : string = "";
  public tarjeta : string = "";
  public compromiso : string = "";
  public letra : string = "";
  public ddjj : string = "";

  public foto_antiguo : string = "";
  public dni_antiguo : string = "";
  public cip_antiguo : string = "";
  public planilla_antiguo : string = "";
  public voucher_antiguo : string = "";
  public recibo_antiguo : string = "";
  public casilla_antiguo : string = "";
  public transaccion_antiguo : string = "";
  public autorizacion_antiguo : string = "";
  public tarjeta_antiguo : string = "";
  public compromiso_antiguo : string = "";
  public letra_antiguo : string = "";
  public ddjj_antiguo : string = "";

  public foto_nuevo : string = "";
  public dni_nuevo : string = "";
  public cip_nuevo : string = "";
  public planilla_nuevo : string = "";
  public voucher_nuevo : string = "";
  public recibo_nuevo : string = "";
  public casilla_nuevo : string = "";
  public transaccion_nuevo : string = "";
  public autorizacion_nuevo : string = "";
  public tarjeta_nuevo : string = "";
  public compromiso_nuevo : string = "";
  public letra_nuevo : string = "";
  public ddjj_nuevo : string = "";

  public foto_editar : boolean = false;
  public dni_editar : boolean = false;
  public cip_editar : boolean = false;
  public planilla_editar : boolean = false;
  public voucher_editar : boolean = false;
  public recibo_editar : boolean = false;
  public casilla_editar : boolean = false;
  public transaccion_editar : boolean = false;
  public autorizacion_editar : boolean = false;
  public tarjeta_editar : boolean = false;
  public compromiso_editar : boolean = false;
  public letra_editar : boolean = false;
  public ddjj_editar : boolean = false;

  @ViewChild('InputCapital') FiltroCapital: ElementRef;
  @ViewChild('InputCuota') FiltroCuota: ElementRef;
  @ViewChild('Vendedor') VendedorAutoComplete: ElementRef;
  @ViewChild('Autorizador') AutorizadorAutoComplete: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

  public ListadoVendedores: Array<any>;
  public ListadoAudorizadores: Array<any>;
  public ListadoSucursales: Array<any>;
  public ListadoTipoPago: Array<any>;

  constructor(
    private Servicio: CreditosService,
    private ClienteServicio: ClienteService,
    private DireccionServicio: ServiciosDirecciones,
    private TelefonoServicio: ServiciosTelefonos,
    private ServiciosGenerales: ServiciosGenerales,
    private ServicioTipoPago: ServiciosTipoPago,
    private RServicio: ReglasEvaluacionService,
    private location: Location,
    private Builder: FormBuilder,
    private Dialogo: MatDialog,
    private route : ActivatedRoute,
    private Notificacion: Notificaciones,
    private router: Router
  ) { }

  ngOnInit() {

    this.CrearFormulario();

    // Se cargan los arrays del inicio
    this.ListarVendedor("");
    this.ListarAutorizador("");
    this.ListarTipoPago();
    this.ListarSucursales();
    this.ListarReglas();    

    this.ruta=URLIMAGENES.urlimages;

    this.editar_cronograma = 3;
    this.ListadoCronograma = new CronogramaDataSource();

    this.cliente_afiliado = true;
    this.numero_cuotas = 60;
    this.monto_cuota = 20;

    this.route.params.subscribe(params => {
      // Verifica si 'params' tiene datos
      if(Object.keys(params).length>0){

        this.Cargando.next(true);

        if(params['idcredito']){
          this.id_credito=params['idcredito'];
          // this.id_credito=13;
          this.SeleccionarCredito(this.id_credito);
        }

        if(params['idcreditoeditar']){
          this.id_credito_editar=params['idcreditoeditar'];
          // this.id_credito_editar=14;
          this.SeleccionarCredito(this.id_credito_editar);
        }

      }else{
       this.NuevoCredito();
      }
    })

  }

  ngAfterViewInit(): void {

    if (this.id_credito) {
      this.sort.sortChange
      .pipe(
        tap(() =>{
          this.ObtenerCronograma(this.id_credito, this.sort.active + " " + this.sort.direction)
        })
      ).subscribe();
    }

    if(!this.id_credito){

      if(this.id_tipo==2){
        fromEvent(this.VendedorAutoComplete.nativeElement, 'keyup')
        .pipe(
          debounceTime(10),
          distinctUntilChanged(),
          tap(() => {
            this.ListarVendedor(this.CreditosForm.value.vendedor);
          })
         ).subscribe();
    
         fromEvent(this.AutorizadorAutoComplete.nativeElement, 'keyup')
        .pipe(
          debounceTime(10),
          distinctUntilChanged(),
          tap(() => {
            this.ListarAutorizador(this.CreditosForm.value.autorizador);
          })
         ).subscribe();
      }
  
       merge(
        fromEvent(this.FiltroCuota.nativeElement,'keyup'),
        fromEvent(this.FiltroCapital.nativeElement,'keyup')
      ).pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(()=>{
          if (
            this.FiltroCapital.nativeElement.value &&
            this.FiltroCuota.nativeElement.value &&
            this.CreditosForm.value.fecha_pago
          ) {
            this.CrearCronograma()
          }
        })
      ).subscribe()
    }

  }

  CrearFormulario(){
    this.CreditosForm = this.Builder.group({
      id_cliente :[{value: null, disabled: false},[
        Validators.required
      ]],
      cliente :[{value: null, disabled: false},[
      ]],
      cargo :[{value: null, disabled: false},[
        Validators.required
      ]],
      trabajo :[{value: null, disabled: false},[
        Validators.required
      ]],
      direccion :[{value: null, disabled: false},[
        Validators.required
      ]],
      telefono :[{value: null, disabled: false},[
        Validators.required
      ]],
      // Sobre la afiliación
      afiliacion_tiempo :[{value: null, disabled: false},[
      ]],
      afiliacion_monto :[{value: null, disabled: false},[
        Validators.pattern ('[0-9- ]+')
      ]],
      afiliacion_tipo_pago :[{value: 1, disabled: false},[
      ]],
      afiliacion_fecha_vencimiento :[{value: moment(new Date()).add(1, 'months').endOf('month').toDate(), disabled: false},[
      ]],
      /////////////////////////////////////////////////////////////// 
      garante :[{value: false, disabled: false},[
      ]],
      fecha_credito: [{value: new Date(), disabled: false},[
        Validators.required
      ]],
      sucursal: [{value: null, disabled: false},[
        Validators.required
      ]],
      codigo: [{value: null, disabled: false},[ // Es lo que se muestra en la vista {{numero_afiliacion + numero_credito}}
        Validators.required
      ]],
      numero: [{value: null, disabled: false},[ // Es el número del crédito
      ]],
      interes_diario: [{value: false, disabled: false},[
      ]],
      fecha_pago: [{value: moment(new Date()).add(1, 'months').toDate(), disabled: false},[
        Validators.required,
      ]],
      ////////
      tipo_pago: [{value: null, disabled: false},[
        Validators.required
      ]],
      interes: [{value: 0, disabled: false},[
        Validators.required,
        Validators.min(0)
      ]],
      capital: [{value: null, disabled: false},[
        Validators.required
      ]],
      cuotas: [{value: null, disabled: false},[
        Validators.required,
        Validators.min(0),
        Validators.max(100)
      ]],
      total: [{value: null, disabled: false},[
        Validators.required
      ]],
      id_vendedor: [{value: null, disabled: false},[
        Validators.required
      ]],
      vendedor: [{value: null, disabled: false},[
      ]],
      id_autorizador: [{value: null, disabled: false},[
        // Validators.required
      ]],
      autorizador: [{value: null, disabled: false},[
      ]],
      observaciones: [{value: "", disabled: false},[
      ]],
      garantes: this.Builder.array([])
    })
  }

  NuevoCredito(){
    this.id_tipo=2;
    this.ColumnasCronograma= ['numero', 'fecha_vencimiento_ver', 'monto_cuota_ver'];
    this.VerificarCondicionesAfiliacion();
  }

  ObtenerNumero(cliente:number){
    this.Servicio.Proximo(cliente).subscribe(res=>{

      this.CreditosForm.get('numero').setValue(res)

      let codigo_string: string = res.toString();
      let codigo_string_length: number = res.toString().length;

      for( let i = codigo_string_length ; i < 3 ; i++ ){
        codigo_string = "0" + codigo_string;
      }

      this.CreditosForm.get('codigo').setValue(this.numero_afiliacion + "-" + codigo_string);
    })
  }

  SeleccionarCredito(id_credito){
    
    let observacion_corregida : string;
    let codigo_string : string;
    let codigo_largo : number;

    this.Servicio.Seleccionar(id_credito).subscribe(res=>{
      this.Cargando.next(false);
      
      /////////////////////////////////////////////////////////
      // Se da el formato al código
      codigo_string=res.numero.toString();
      codigo_largo=codigo_string.length;

      for(let i = codigo_largo; i < 3; i++){
        codigo_string = "0" + codigo_string;
      }
      
      this.id_tipo=res.id_tipo;
      console.log(res.id_tipo)

      if(this.id_tipo==1){
        this.CreditosForm.get('codigo').setValue(res.codigo)
      }else{
        this.CreditosForm.get('codigo').setValue(res.codigo + "-" +codigo_string)
      }
      ////////////////////////////

      this.CreditosForm.get('id_cliente').setValue(res.id_cliente);
      this.CreditosForm.get('fecha_credito').setValue(res.fecha);
      this.CreditosForm.get('cliente').setValue(res.cliente);
      this.CreditosForm.get('cargo').setValue(res.cliente_cargo);
      this.CreditosForm.get('trabajo').setValue(res.cliente_trabajo);
      this.CreditosForm.get('direccion').setValue(res.cliente_direccion);
      this.CreditosForm.get('telefono').setValue(res.cliente_telefono);
      this.CreditosForm.get('fecha_pago').setValue(res.fecha_pago);
      this.CreditosForm.get('interes').setValue(res.interes);
      this.CreditosForm.get('capital').setValue(res.capital);
      this.CreditosForm.get('cuotas').setValue(res.numero_cuotas);
      this.CreditosForm.get('total').setValue(res.total);
      
      this.CreditosForm.get('vendedor').setValue(res.vendedor);
      this.CreditosForm.get('id_vendedor').setValue(res.id_vendedor);
      this.CreditosForm.get('autorizador').setValue(res.autorizador);
      this.CreditosForm.get('id_autorizador').setValue(res.id_autorizador);

      observacion_corregida = res.observaciones == "" ? "No hay observaciones" : res.observaciones;

      res.pdf_foto!="" ? this.foto=URLIMAGENES.carpeta+'credito/'+res.pdf_foto : null;
      res.pdf_dni!="" ? this.dni=URLIMAGENES.carpeta+'credito/'+res.pdf_dni : null;
      res.pdf_cip!="" ? this.cip=URLIMAGENES.carpeta+'credito/'+res.pdf_cip : null;
      res.pdf_planilla!="" ? this.planilla=URLIMAGENES.carpeta+'credito/'+res.pdf_planilla : null;
      res.pdf_voucher!="" ? this.voucher=URLIMAGENES.carpeta+'credito/'+res.pdf_voucher : null;
      res.pdf_recibo!="" ? this.recibo=URLIMAGENES.carpeta+'credito/'+res.pdf_recibo : null;
      res.pdf_casilla!="" ? this.casilla=URLIMAGENES.carpeta+'credito/'+res.pdf_casilla : null;
      res.pdf_transaccion!="" ? this.transaccion=URLIMAGENES.carpeta+'credito/'+res.pdf_transaccion : null;
      res.pdf_autorizacion!="" ? this.autorizacion=URLIMAGENES.carpeta+'credito/'+res.pdf_autorizacion : null;
      res.pdf_tarjeta!="" ? this.tarjeta=URLIMAGENES.carpeta+'credito/'+res.pdf_tarjeta : null;
      res.pdf_compromiso!="" ? this.compromiso=URLIMAGENES.carpeta+'credito/'+res.pdf_compromiso : null;
      res.pdf_letra!="" ? this.letra=URLIMAGENES.carpeta+'credito/'+res.pdf_letra : null;
      res.pdf_ddjj!="" ? this.ddjj=URLIMAGENES.carpeta+'credito/'+res.pdf_ddjj : null;


      if(res['garantes'].garantes.length>0){
        this.CreditosForm.get('garante').setValue(true);
        res['garantes'].garantes.forEach((item,index)=>{
          this.AgregarGarante(false);
          this.CreditosForm['controls'].garantes['controls'][index].get('id_cliente').setValue(item.id_cliente);
          this.CreditosForm['controls'].garantes['controls'][index].get('nombre').setValue(item.cliente_nombre);
          this.CreditosForm['controls'].garantes['controls'][index].get('direccion').setValue(item.cliente_direccion);
          this.CreditosForm['controls'].garantes['controls'][index].get('telefono').setValue(item.cliente_telefono);
        })
      }

      if( this.id_credito ) {

        this.CreditosForm.get('sucursal').setValue(res.sucursal);
        this.CreditosForm.get('tipo_pago').setValue(res.tipo_pago);
        this.CreditosForm.get('observaciones').setValue(observacion_corregida);

        this.ColumnasCronograma= ['numero', 'monto_cuota','fecha_vencimiento', 'monto_interes','monto_pagado', 'fecha_cancelacion', 'monto_pendiente','estado', 'opciones'];
        this.ObtenerCronograma(this.id_credito, "fecha_vencimiento asc");

        if(res['garantes'].garantes.length>0){
          res['garantes'].garantes.forEach((item,index)=>{
            let dni = item.dni_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.dni_pdf : null ;
            let cip = item.cip_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.cip_pdf : null ;
            let planilla = item.planilla_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.planilla_pdf : null ;

            this.CreditosForm['controls'].garantes['controls'][index].get('dni_pdf').setValue(dni);
            this.CreditosForm['controls'].garantes['controls'][index].get('cip_pdf').setValue(cip);
            this.CreditosForm['controls'].garantes['controls'][index].get('planilla_pdf').setValue(planilla);
          })
        }

      }

      if ( this.id_credito_editar ) {

        this.CreditosForm.get('codigo').disable();

        if(this.id_tipo==1){
          this.CreditosForm.get('vendedor').clearValidators();
          this.CreditosForm.get('id_vendedor').clearValidators();
          this.CreditosForm.get('autorizador').clearValidators();
          this.CreditosForm.get('id_autorizador').clearValidators();
        }

        this.CreditosForm.get('sucursal').setValue(res.id_sucursal);
        this.CreditosForm.get('tipo_pago').setValue(res.id_tipo_pago);
        this.CreditosForm.get('observaciones').setValue(res.observaciones);

        this.ColumnasCronograma= ['numero', 'fecha_vencimiento_ver', 'monto_cuota_ver'];
        this.Cronograma = res.cronograma;
        this.ListadoCronograma.AsignarInformacion(this.Cronograma);

        this.foto_antiguo=res.pdf_foto;
        this.dni_antiguo=res.pdf_dni;
        this.cip_antiguo=res.pdf_cip;
        this.planilla_antiguo=res.pdf_planilla;
        this.voucher_antiguo=res.pdf_voucher;
        this.recibo_antiguo=res.pdf_recibo;
        this.casilla_antiguo=res.pdf_casilla;
        this.transaccion_antiguo=res.pdf_transaccion;
        this.autorizacion_antiguo=res.pdf_autorizacion;
        this.tarjeta_antiguo=res.pdf_tarjeta;
        this.compromiso_antiguo=res.pdf_compromiso;
        this.letra_antiguo=res.pdf_letra;
        this.ddjj_antiguo=res.pdf_ddjj;

        res.pdf_foto!="" ? this.foto_editar=false : this.foto_editar=true;
        res.pdf_dni!="" ? this.dni_editar=false : this.dni_editar=true;
        res.pdf_cip!="" ? this.cip_editar=false : this.cip_editar=true;
        res.pdf_planilla!="" ? this.planilla_editar=false : this.planilla_editar=true;
        res.pdf_voucher!="" ? this.voucher_editar=false : this.voucher_editar=true;
        res.pdf_recibo!="" ? this.recibo_editar=false : this.recibo_editar=true;
        res.pdf_casilla!="" ? this.casilla_editar=false : this.casilla_editar=true;
        res.pdf_transaccion!="" ? this.transaccion_editar=false : this.transaccion_editar=true;
        res.pdf_autorizacion!="" ? this.autorizacion_editar=false : this.autorizacion_editar=true;
        res.pdf_tarjeta!="" ? this.tarjeta_editar=false : this.tarjeta_editar=true;
        res.pdf_compromiso!="" ? this.compromiso_editar=false : this.compromiso_editar=true;
        res.pdf_letra!="" ? this.letra_editar=false : this.letra_editar=true;
        res.pdf_ddjj!="" ? this.ddjj_editar=false : this.ddjj_editar=true;

        if(res['garantes'].garantes.length>0){
          res['garantes'].garantes.forEach((item,index)=>{
            this.CreditosForm['controls'].garantes['controls'][index].get('dni_pdf_antiguo').setValue(item.dni_pdf);
            this.CreditosForm['controls'].garantes['controls'][index].get('cip_pdf_antiguo').setValue(item.cip_pdf);
            this.CreditosForm['controls'].garantes['controls'][index].get('planilla_pdf_antiguo').setValue(item.planilla_pdf);

            let dni_editar = item.dni_pdf == "" ? true : false;
            let cip_editar = item.cip_pdf == "" ? true : false;
            let planilla_editar = item.planilla_pdf == "" ? true : false;

            this.CreditosForm['controls'].garantes['controls'][index].get('dni_editar').setValue(dni_editar);
            this.CreditosForm['controls'].garantes['controls'][index].get('cip_editar').setValue(cip_editar);
            this.CreditosForm['controls'].garantes['controls'][index].get('planilla_editar').setValue(planilla_editar);

            let dni = item.dni_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.dni_pdf : null ;
            let cip = item.cip_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.cip_pdf : null ;
            let planilla = item.planilla_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.planilla_pdf : null ;

            this.CreditosForm['controls'].garantes['controls'][index].get('dni_pdf').setValue(dni);
            this.CreditosForm['controls'].garantes['controls'][index].get('cip_pdf').setValue(cip);
            this.CreditosForm['controls'].garantes['controls'][index].get('planilla_pdf').setValue(planilla);
          })
        }
      }

    })

  }

  ObtenerCronograma(id_credito, orden){
    this.Servicio.ObtenerCrongrama(id_credito, orden).subscribe(res=>{
      this.Cronograma = res.creditos;
      this.ListadoCronograma.AsignarInformacion(this.Cronograma);
    })
  }

  ListarReglas(){
    this.RServicio.ListarReglas().subscribe(res=>{
      this.Reglas=res;
    })
  }

  SeleccionarCliente(){
    let Ventana = this.Dialogo.open(SeleccionarClienteComponent,{
      width: "1200px"
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        // console.log(res)
        this.CreditosForm.get('id_cliente').setValue(res.id);
        this.ObtenerClientexId(res.id);
        this.ObtenerDireccion(res.id);
        this.ObtenerTelefono(res.id);
        this.VerificarAfiliacion(res.id);
      }
    })
  }

  VerificarAfiliacion(id_cliente){
    this.Servicio.Verificar_Afiliacion(id_cliente).subscribe(res=>{
      if(res['codigo_afiliacion']){
        this.numero_afiliacion=res['codigo_afiliacion'];
        this.VerificarInteres(res['total_pagado']);
        this.cliente_afiliado=true;
      }else{
        this.VerificarInteres(0);
        this.cliente_afiliado=false;
      }
    })
  }

  VerificarInteres(monto){
    this.Servicio.Verificar_Interes(monto).subscribe(res=>{
      // console.log(res);
      this.CreditosForm.get('interes').setValue(res);
    })
  }

  VerificarCondicionesAfiliacion(){
    this.Servicio.SeleccionarParametros().subscribe(res=>{
      this.numero_afiliacion = res.numero;
      this.CreditosForm.get('afiliacion_tiempo').setValue(res.tiempo)
      this.numero_cuotas = +res.tiempo*12;
      this.CreditosForm.get('afiliacion_monto').setValue(res.monto)
    })
  }

  ObtenerClientexId(id_cliente) {

    // El número del crédito
    this.ObtenerNumero(id_cliente);

    this.ClienteServicio.Seleccionar(id_cliente).subscribe(res => {
      if (res) {
        // console.log(res)
        this.CreditosForm.get('cliente').setValue(res.nombre);
        this.CreditosForm.get('cargo').setValue(res.cargo);
        this.CreditosForm.get('trabajo').setValue(res.trabajo);
        this.Cargando.next(false);
      }
    });
  }

  ObtenerDireccion(id_cliente) {
    this.DireccionServicio.ListarDireccion( id_cliente, '1',1,20).subscribe(res => {
      if (res['data']) {
        this.CreditosForm.get('direccion').setValue(res['data'].direcciones[0].direccioncompleta);
      }
    });
  }

  ObtenerTelefono(id_cliente) {
    this.TelefonoServicio.ListarTelefono( id_cliente , '1',1,20).subscribe(res => {
      if (res['data']) {
        this.CreditosForm.get('telefono').setValue(res['data'].telefonos[0].tlf_numero);
      }
    });
  }

  RemoverCliente(){
    this.CreditosForm.get('id_cliente').setValue(null);
    this.CreditosForm.get('cargo').setValue("");
    this.CreditosForm.get('trabajo').setValue("");
    this.CreditosForm.get('direccion').setValue("");
    this.CreditosForm.get('telefono').setValue("");

    this.CreditosForm.get('numero').setValue(null)
    this.CreditosForm.get('codigo').setValue(null);
    this.cliente_afiliado=true;
  }
  
  EditarContactoCliente(){

    let id_cliente = this.CreditosForm.value.id_cliente ? this.CreditosForm.value.id_cliente : this.id_cliente;

    let VentanaContacto = this.Dialogo.open(VentanaEmergenteContacto, {
      width: '1200px',
      data: id_cliente
    });

    VentanaContacto.afterClosed().subscribe(res=>{
      this.ObtenerDireccion(id_cliente);
      this.ObtenerTelefono(id_cliente);
    })
  }

  HayGarante(evento){
    if(evento.checked){
      if(this.id_credito_editar){
        this.AgregarGarante(true)
      }else{
        this.AgregarGarante(false)
      }
    }else{
      if(this.CreditosForm['controls'].garantes['controls'].length>1){
        this.EliminarGarante(1);
        this.EliminarGarante(0);
      }else{
        this.EliminarGarante(0);
      }
      // this.CreditosForm['controls'].garantes['controls'].forEach((item,index)=>{
      //   this.EliminarGarante(index)
      // })
    }
  }

  CrearGarante(bool): FormGroup{
    return this.Builder.group({
      'id_cliente': [{value: null, disabled: false}, [
        Validators.required
      ]],
      'nombre': [{value: null, disabled: false}, [
        Validators.required
      ]],
      'direccion': [{value: null, disabled: false}, [
        Validators.required
      ]],
      'telefono': [{value: null, disabled: false}, [
        Validators.required
      ]],
      'dni_pdf': [{value: null, disabled: false}, [
      ]],
      'cip_pdf': [{value: null, disabled: false}, [
      ]],
      'planilla_pdf': [{value:null, disabled: false}, [
      ]],
      'dni_editar': [{value: bool, disabled: false}, [
      ]],
      'cip_editar': [{value: bool, disabled: false}, [
      ]],
      'planilla_editar': [{value:bool, disabled: false}, [
      ]],
      'dni_pdf_antiguo': [{value: null, disabled: false}, [
      ]],
      'cip_pdf_antiguo': [{value: null, disabled: false}, [
      ]],
      'planilla_pdf_antiguo': [{value:null, disabled: false}, [
      ]],
      'dni_pdf_nuevo': [{value: null, disabled: false}, [
      ]],
      'cip_pdf_nuevo': [{value: null, disabled: false}, [
      ]],
      'planilla_pdf_nuevo': [{value:null, disabled: false}, [
      ]],
      'estado': [{value:1, disabled: false}, [
      ]],
    })
  }

  SeleccionarGarante(index){
    let Ventana = this.Dialogo.open(SeleccionarClienteComponent,{
      width: "1200px",
      data: { cliente : this.CreditosForm.value.id_cliente }
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        this.CreditosForm['controls'].garantes['controls'][index].get('id_cliente').setValue(res.id)
        this.CreditosForm['controls'].garantes['controls'][index].get('nombre').setValue(res.nombre)
        this.ObtenerDireccionGarante(res.id,index);
        this.ObtenerTelefonoGarante(res.id,index);
      }
    })
  }

  ObtenerDireccionGarante(id_cliente, index) {
    this.DireccionServicio.ListarDireccion( id_cliente, '1',1,20).subscribe(res => {
      if (res['data']) {
        this.CreditosForm['controls'].garantes['controls'][index].get('direccion').setValue(res['data'].direcciones[0].direccioncompleta)
      }
    });
  }

  ObtenerTelefonoGarante(id_cliente, index) {
    this.TelefonoServicio.ListarTelefono( id_cliente , '1',1,20).subscribe(res => {
      if (res['data']) {
        this.CreditosForm['controls'].garantes['controls'][index].get('telefono').setValue(res['data'].telefonos[0].tlf_numero)
      }
    });
  }

  AgregarGarante(bool):void{
    this.garantes = this.CreditosForm.get('garantes') as FormArray;
    this.garantes.push(this.CrearGarante(bool));
  };

  EliminarGarante(index){
    this.garantes.removeAt(index);
  }

  ListarSucursales(){
    this.ServiciosGenerales.ListarSucursal(null,"").subscribe(res=>{
      this.ListadoSucursales=res
    })
  }

  ListarTipoPago() {
    this.ServicioTipoPago.ListarTipoPago(1).subscribe( res => {
      this.ListadoTipoPago = res;
    });
  }

  ListarVendedor(nombre: string) {
    this.ServiciosGenerales.ListarVendedor("",nombre,"",1,5).subscribe( res => {
      this.ListadoVendedores=res;
    });
  }

  VendedorSeleccionado(){
    let nombre_vendedor= this.CreditosForm.value.vendedor.nombre;
    this.CreditosForm.get('id_vendedor').setValue(this.CreditosForm.value.vendedor.id);
    this.CreditosForm.get('vendedor').setValue(nombre_vendedor);
  }
  
  RemoverVendedor(){
    this.CreditosForm.get('id_vendedor').setValue(null);
    this.CreditosForm.get('vendedor').setValue("");
  }

  ListarAutorizador(nombre: string) {
    this.ServiciosGenerales.ListarVendedor("",nombre,"",1,5).subscribe( res => {
      this.ListadoAudorizadores=res;
    });
  }

  AutorizadorSeleccionado(){
    let nombre_auorizador= this.CreditosForm.value.autorizador.nombre;
    this.CreditosForm.get('id_autorizador').setValue(this.CreditosForm.value.autorizador.id);
    this.CreditosForm.get('autorizador').setValue(nombre_auorizador);
  }

  RemoverAutorizador(){
    this.CreditosForm.get('id_autorizador').setValue(null);
    this.CreditosForm.get('autorizador').setValue("");
  }

  SubirArchivo(evento, orden){

    if(this.id_credito_editar){
      if ( orden == 1 ) this.foto_nuevo = evento.serverResponse.response.body.data;
      if ( orden == 2 ) this.dni_nuevo = evento.serverResponse.response.body.data;
      if ( orden == 3 ) this.cip_nuevo = evento.serverResponse.response.body.data;
      if ( orden == 4 ) this.planilla_nuevo = evento.serverResponse.response.body.data;
      if ( orden == 5 ) this.voucher_nuevo = evento.serverResponse.response.body.data;
      if ( orden == 6 ) this.recibo_nuevo = evento.serverResponse.response.body.data;
      if ( orden == 7 ) this.casilla_nuevo = evento.serverResponse.response.body.data;
      if ( orden == 8 ) this.transaccion_nuevo = evento.serverResponse.response.body.data;
      if ( orden == 9 ) this.autorizacion_nuevo = evento.serverResponse.response.body.data;
      if ( orden == 10 ) this.tarjeta_nuevo = evento.serverResponse.response.body.data;
      if ( orden == 11 ) this.compromiso_nuevo = evento.serverResponse.response.body.data;
      if ( orden == 12 ) this.letra_nuevo = evento.serverResponse.response.body.data;
      if ( orden == 13 ) this.ddjj_nuevo = evento.serverResponse.response.body.data;
    }else{
      if ( orden == 1 ) this.foto = evento.serverResponse.response.body.data;
      if ( orden == 2 ) this.dni = evento.serverResponse.response.body.data;
      if ( orden == 3 ) this.cip = evento.serverResponse.response.body.data;
      if ( orden == 4 ) this.planilla = evento.serverResponse.response.body.data;
      if ( orden == 5 ) this.voucher = evento.serverResponse.response.body.data;
      if ( orden == 6 ) this.recibo = evento.serverResponse.response.body.data;
      if ( orden == 7 ) this.casilla = evento.serverResponse.response.body.data;
      if ( orden == 8 ) this.transaccion = evento.serverResponse.response.body.data;
      if ( orden == 9 ) this.autorizacion = evento.serverResponse.response.body.data;
      if ( orden == 10 ) this.tarjeta = evento.serverResponse.response.body.data;
      if ( orden == 11 ) this.compromiso = evento.serverResponse.response.body.data;
      if ( orden == 12 ) this.letra = evento.serverResponse.response.body.data;
      if ( orden == 13 ) this.ddjj = evento.serverResponse.response.body.data;
    }
  }

  SubirArchivoAval(evento, index, orden){
    if (!this.id_credito_editar) {
      if(orden==1) this.CreditosForm['controls'].garantes['controls'][index].get('dni_pdf').setValue(evento.serverResponse.response.body.data);
      if(orden==2) this.CreditosForm['controls'].garantes['controls'][index].get('cip_pdf').setValue(evento.serverResponse.response.body.data);
      if(orden==3) this.CreditosForm['controls'].garantes['controls'][index].get('planilla_pdf').setValue(evento.serverResponse.response.body.data);
    } else {
      if(orden==1) this.CreditosForm['controls'].garantes['controls'][index].get('dni_pdf_nuevo').setValue(evento.serverResponse.response.body.data);
      if(orden==2) this.CreditosForm['controls'].garantes['controls'][index].get('cip_pdf_nuevo').setValue(evento.serverResponse.response.body.data);
      if(orden==3) this.CreditosForm['controls'].garantes['controls'][index].get('planilla_pdf_nuevo').setValue(evento.serverResponse.response.body.data);
    }
  }

  /*Cronograma */
  CrearCronograma(){

    if(this.CreditosForm.get('cuotas').valid && this.CreditosForm.value.interes>0){
      
      this.Cronograma=[];
      let i = 1;

      //Se calcula el monto total y el interés
      let interes : number =  Math.round(+this.CreditosForm.value.capital * (this.CreditosForm.value.interes /100 ) *100 ) / 100;
      let total : number = Math.round(+this.CreditosForm.value.capital * ( 1 + +this.CreditosForm.value.cuotas * this.CreditosForm.value.interes / 100 ) *100 ) / 100
      // this.CreditosForm.get('total').setValue( total );

      // Se calculan las fechas de las cuotas
      let ano_pago = moment(this.CreditosForm.value.fecha_pago).year();
      let mes_pago = moment(this.CreditosForm.value.fecha_pago).month();
      let dia_pago = moment(this.CreditosForm.value.fecha_pago).date();
      let fecha_corregida : Date = new Date(ano_pago, mes_pago, dia_pago);
      let fecha : Date;

      // Se evalúa si el crédito se da antes o después de quincena
      let dia_credito :number = moment(this.CreditosForm.value.fecha_credito).date();
      let mes_credito :number = moment(this.CreditosForm.value.fecha_credito).month();
      let ano_credito :number = moment(this.CreditosForm.value.fecha_credito).year();
      let dias_mes : number = moment(this.CreditosForm.value.fecha_credito).daysInMonth();
      let interes_truncado = Math.round( ((dias_mes - dia_credito) / dias_mes) * interes * 100 ) / 100;

      // Si el crédito es antes de quincena, se paga a fin de mes los intereses truncados
      if( dia_credito <= 15 ){
        this.Cronograma.push({
          numero: 0,
          fecha_vencimiento: moment(this.CreditosForm.value.fecha_credito).endOf('month'),
          monto_cuota: interes_truncado
        })
      }

      // Se pagan los intereses mientras no se cancele el crédito
      if( mes_pago - mes_credito > 1){
        for( i; i<mes_pago - mes_credito; i++){
          fecha=moment(new Date(ano_credito, mes_credito, dia_pago)).add(i, 'months').toDate();
          this.Cronograma.push({
            numero: i,
            fecha_vencimiento: fecha,
            monto_cuota: interes
          })
        }
      };

      // Se calcula el monto de las cuotas normales
      let monto=Math.round((total)*100/this.FiltroCuota.nativeElement.value)/100
  
      for (let j = 1; j<=this.FiltroCuota.nativeElement.value; j++) {
        fecha=moment(fecha_corregida).add(j-1, 'months').toDate();
        this.Cronograma.push({
          numero: i+j-1,
          fecha_vencimiento: fecha,
          monto_cuota: monto
        })
      }
  
      this.CreditosForm.get('total').setValue(
        this.Cronograma.reduce( (acumulador, item)=>{
          return Math.round( ( acumulador + item.monto_cuota ) * 100 ) / 100
        },0 )
      );

      this.CalcularTotalCronograma();
      this.ListadoCronograma.AsignarInformacion(this.Cronograma);
    }

  }

  CalcularTotalCronograma(){
    
    this.total_cronograma_editado=0;
    
    this.Cronograma.forEach((item)=>{
      this.total_cronograma_editado=this.total_cronograma_editado+item.monto_cuota*1;
    })

    // console.log(this.diferencia);
    this.diferencia= Math.abs(Math.round((this.CreditosForm.value.total-this.total_cronograma_editado)*100)/100);

  }

  EditarCronograma(estado){
    this.editar_cronograma=estado;
    this.CalcularTotalCronograma();
  }

  AbrirDocumento(url){
    if(url){
      window.open(url, "_blank");
    }
  }

  Atras(){
    this.location.back()
  }

  Guardar(){
    if(this.id_credito_editar){
      if(this.id_tipo==1){
        this.ActualizarAfiliacion()
      } else {
        this.ActualizarCredito();
      }
    }else{

      // Se verifican que los datos del nuevo cliente estén actualizados
      this.VerificarAfiliacion(this.CreditosForm.value.id_cliente);
      this.VerificarCondicionesAfiliacion();
      this.ObtenerNumero(this.CreditosForm.value.id_cliente);

      this.CrearCredito();
    }
  }

  CrearAfiliacion( tarjeta: string){

    this.Servicio.Crear(
      1,
      this.CreditosForm.value.sucursal,
      this.CreditosForm.value.fecha_credito,
      this.numero_afiliacion,
      0,
      0,
      0,
      this.CreditosForm.value.id_cliente,
      this.CreditosForm.value.direccion,
      this.CreditosForm.value.telefono,
      this.CreditosForm.value.cargo,
      this.CreditosForm.value.trabajo,
      this.CreditosForm.value.tipo_pago,
      this.CreditosForm.value.fecha_credito,
      0,
      this.CreditosForm.value.afiliacion_monto,
      this.numero_cuotas,
      +this.CreditosForm.value.afiliacion_monto * +this.CreditosForm.value.afiliacion_monto,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      tarjeta,
      "",
      "",
      "",
      ""
    ).subscribe(res=>{

      this.Servicio.CrearCronogramaAfiliacion(
        res['data'],
        this.CreditosForm.value.afiliacion_monto,
        this.numero_cuotas,
        this.CreditosForm.value.fecha_credito
      ).subscribe()

    })
  }

  ActualizarAfiliacion(){

    let random=(new Date()).getTime()

    return forkJoin(
      this.ServiciosGenerales.RenameFile(this.tarjeta_nuevo,'TARJETA',random.toString(),"credito")
    ).subscribe(resultado=>{

      // console.log(resultado)

      this.Servicio.Actualizar(
        this.id_credito_editar,
        this.CreditosForm.value.sucursal,
        this.CreditosForm.value.fecha_credito,
        0,
        0,
        this.CreditosForm.value.id_cliente,
        this.CreditosForm.value.direccion,
        this.CreditosForm.value.telefono,
        this.CreditosForm.value.cargo,
        this.CreditosForm.value.trabajo,
        this.CreditosForm.value.tipo_pago,
        this.CreditosForm.value.fecha_pago,
        this.CreditosForm.value.interes,
        this.CreditosForm.value.capital,
        this.CreditosForm.value.cuotas,
        this.CreditosForm.value.total,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        this.tarjeta_editar ? resultado[9].mensaje : this.tarjeta_antiguo,
        "",
        "",
        "",
        this.CreditosForm.value.observaciones
      ).subscribe(res=>{
        // console.log(res)
  
        this.Cronograma.forEach((item)=>{
          this.Servicio.CrearCronograma(
            res['data'],
            item.monto_cuota,
            item.fecha_vencimiento
          ).subscribe()
        })
  
        setTimeout(()=>{
          this.router.navigate(['/creditos']);
          if(res['codigo']==0){
            this.Notificacion.Snack("Se actualizó la afiliación con éxito!","");
          }else{
            this.Notificacion.Snack("Ocurrió un error al actualizar la afiliación","");
          }
        }, 300)

      })
    })
  }

  CrearCredito(){

    let random=(new Date()).getTime()

    return forkJoin(
      this.ServiciosGenerales.RenameFile(this.foto,'FOTO',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.dni,'DNI',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.cip,'CIP',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.planilla,'PLANILLA',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.voucher,'VOUCHER',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.recibo,'RECIBO',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.casilla,'CASILLA',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.transaccion,'TRANSACCION',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.autorizacion,'AUTORIAZACION',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.tarjeta,'TARJETA',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.compromiso,'COMPROMISO',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.letra,'LETRA',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.ddjj,'DDJJ',random.toString(),"credito"),
    ).subscribe(resultado=>{

      if( this.cliente_afiliado === false ){
        this.CrearAfiliacion(
          resultado[9].mensaje
        )
      }

      this.Servicio.Crear(
        2,
        this.CreditosForm.value.sucursal,
        this.CreditosForm.value.fecha_credito,
        this.numero_afiliacion,
        this.CreditosForm.value.numero,
        this.CreditosForm.value.id_autorizador,
        this.CreditosForm.value.id_vendedor,
        this.CreditosForm.value.id_cliente,
        this.CreditosForm.value.direccion,
        this.CreditosForm.value.telefono,
        this.CreditosForm.value.cargo,
        this.CreditosForm.value.trabajo,
        this.CreditosForm.value.tipo_pago,
        this.CreditosForm.value.fecha_pago,
        this.CreditosForm.value.interes,
        this.CreditosForm.value.capital,
        this.CreditosForm.value.cuotas,
        this.CreditosForm.value.total,
        resultado[0].mensaje,
        resultado[1].mensaje,
        resultado[2].mensaje,
        resultado[3].mensaje,
        resultado[4].mensaje,
        resultado[5].mensaje,
        resultado[6].mensaje,
        resultado[7].mensaje,
        resultado[8].mensaje,
        resultado[9].mensaje,
        resultado[10].mensaje,
        resultado[11].mensaje,
        resultado[12].mensaje,
        this.CreditosForm.value.observaciones
      ).subscribe(res=>{
        // Se agrega el cronograma
        this.Cronograma.forEach((item)=>{
          this.Servicio.CrearCronograma(
            res['data'],
            item.monto_cuota,
            item.fecha_vencimiento
          ).subscribe()
        })

        // Si el crédito tiene garante, se los agrega
        if( this.CreditosForm.value.garante ){
          this.CreditosForm['controls'].garantes['controls'].forEach((item, index)=>{
            return forkJoin(
              this.ServiciosGenerales.RenameFile(item.value.dni_pdf,`DNI_GARANTE_+${index+1}`,random.toString(),"credito"),
              this.ServiciosGenerales.RenameFile(item.value.cip_pdf,`CIP_GARANTE_+${index+1}`,random.toString(),"credito"),
              this.ServiciosGenerales.RenameFile(item.value.planilla_pdf,`PLANILLA_GARANTE_+${index+1}`,random.toString(),"credito"),
            ).subscribe(response=>{
              this.Servicio.CrearGarante(
                res['data'],
                item.value.id_cliente,
                item.value.direccion,
                item.value.telefono,
                response[0].mensaje,
                response[1].mensaje,
                response[2].mensaje,
              ).subscribe(res=>console.log(res))
            })
          })
        }

        setTimeout(()=>{
          this.router.navigate(['/creditos']);
          if(res['codigo']==0){
            this.Notificacion.Snack("Se creó el crédito con éxito!","");
          }else{
            this.Notificacion.Snack("Ocurrió un error al crear el crédito","");
          }
        }, 300)

      })

    })

  }

  ActualizarCredito(){

    // this.ObtenerNumero();

    let random=(new Date()).getTime()

    return forkJoin(
      this.ServiciosGenerales.RenameFile(this.foto_nuevo,'FOTO',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.dni_nuevo,'DNI',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.cip_nuevo,'CIP',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.planilla_nuevo,'PLANILLA',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.voucher_nuevo,'VOUCHER',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.recibo_nuevo,'RECIBO',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.casilla_nuevo,'CASILLA',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.transaccion_nuevo,'TRANSACCION',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.autorizacion_nuevo,'AUTORIAZACION',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.tarjeta_nuevo,'TARJETA',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.compromiso_nuevo,'COMPROMISO',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.letra_nuevo,'LETRA',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.ddjj_nuevo,'DDJJ',random.toString(),"credito"),
    ).subscribe(resultado=>{

      // console.log(resultado)

      this.Servicio.Actualizar(
        this.id_credito_editar,
        this.CreditosForm.value.sucursal,
        this.CreditosForm.value.fecha_credito,
        this.CreditosForm.value.id_autorizador,
        this.CreditosForm.value.id_vendedor,
        this.CreditosForm.value.id_cliente,
        this.CreditosForm.value.direccion,
        this.CreditosForm.value.telefono,
        this.CreditosForm.value.cargo,
        this.CreditosForm.value.trabajo,
        this.CreditosForm.value.tipo_pago,
        this.CreditosForm.value.fecha_pago,
        this.CreditosForm.value.interes,
        this.CreditosForm.value.capital,
        this.CreditosForm.value.cuotas,
        this.CreditosForm.value.total,
        this.foto_editar ? resultado[0].mensaje : this.foto_antiguo,
        this.dni_editar ? resultado[1].mensaje : this.dni_antiguo,
        this.cip_editar ? resultado[2].mensaje : this.cip_antiguo,
        this.planilla_editar ? resultado[3].mensaje : this.planilla_antiguo,
        this.voucher_editar ? resultado[4].mensaje : this.voucher_antiguo,
        this.recibo_editar ? resultado[5].mensaje : this.recibo_antiguo,
        this.casilla_editar ? resultado[6].mensaje : this.casilla_antiguo,
        this.transaccion_editar ? resultado[7].mensaje : this.transaccion_antiguo,
        this.autorizacion_editar ? resultado[8].mensaje : this.autorizacion_antiguo,
        this.tarjeta_editar ? resultado[9].mensaje : this.tarjeta_antiguo,
        this.compromiso_editar ? resultado[10].mensaje : this.compromiso_antiguo,
        this.letra_editar ? resultado[11].mensaje : this.letra_antiguo,
        this.ddjj_editar ? resultado[12].mensaje : this.ddjj_antiguo,
        this.CreditosForm.value.observaciones
      ).subscribe(res=>{
        // console.log(res)
  
        this.Cronograma.forEach((item)=>{
          this.Servicio.CrearCronograma(
            res['data'],
            item.monto_cuota,
            item.fecha_vencimiento
          ).subscribe()
        })
  
        setTimeout(()=>{
          this.router.navigate(['/creditos']);
          if(res['codigo']==0){
            this.Notificacion.Snack("Se actualizó el crédito con éxito!","");
          }else{
            this.Notificacion.Snack("Ocurrió un error al actualizar el crédito","");
          }
        }, 300)

        // Si el crédito tiene garante, se los agrega
        if( this.CreditosForm.value.garante ){
          this.CreditosForm['controls'].garantes['controls'].forEach((item, index)=>{
            return forkJoin(
              this.ServiciosGenerales.RenameFile(item.value.dni_pdf_nuevo,`DNI_GARANTE_+${index+1}`,random.toString(),"credito"),
              this.ServiciosGenerales.RenameFile(item.value.cip_pdf_nuevo,`CIP_GARANTE_+${index+1}`,random.toString(),"credito"),
              this.ServiciosGenerales.RenameFile(item.value.planilla_pdf_nuevo,`PLANILLA_GARANTE_+${index+1}`,random.toString(),"credito"),
            ).subscribe(response=>{
              this.Servicio.CrearGarante(
                res['data'],
                item.value.id_cliente,
                item.value.direccion,
                item.value.telefono,
                item.value.dni_editar ? response[0].mensaje : item.value.dni_pdf_antiguo,
                item.value.cip_editar ? response[1].mensaje : item.value.cip_pdf_antiguo,
                item.value.planilla_editar ? response[2].mensaje : item.value.planilla_pdf_antiguo,
              ).subscribe(res=>console.log(res))
            })
          })
        }

      })
    })

  }

  Imprimir(){
    console.log(this.CreditosForm)
  }

}

export class CronogramaDataSource implements DataSource<any>{

  private Informacion = new BehaviorSubject<any>([])

  constructor(
  ){ }

  connect(collectionViewer: CollectionViewer){
    return this.Informacion.asObservable()
  }

  disconnect(){
    this.Informacion.complete()
  }

  AsignarInformacion(array){
    this.Informacion.next(array);
  }

}