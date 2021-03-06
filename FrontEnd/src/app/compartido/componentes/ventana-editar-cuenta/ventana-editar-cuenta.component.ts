import { Component, OnInit, Inject } from '@angular/core';
import { ServiciosVentas } from 'src/app/core/servicios/ventas';
import { ClienteService } from '../../../modulo-clientes/clientes/clientes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BancosService } from 'src/app/modulo-maestro/bancos/bancos.service';

@Component({
  selector: 'app-ventana-editar-cuenta',
  templateUrl: './ventana-editar-cuenta.component.html',
  styleUrls: ['./ventana-editar-cuenta.component.css']
})
export class VentanaEditarCuentaComponent implements OnInit {

  public CuentasForm : FormGroup ;
  public Bancos : Array<any> ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any ,
    private ventana : MatDialogRef<VentanaEditarCuentaComponent> ,
    private _builder : FormBuilder ,
    private _clientes : ClienteService ,
    private _bancos : BancosService
  ) { }

  ngOnInit() {
    this.CrearFromulario() ;
    this.ListarBancos() ;

    if( this.data ) {
      this.CuentasForm.get('id_cuenta').setValue(this.data.cuenta.id) ;
      this.CuentasForm.get('banco').setValue(this.data.cuenta.id_banco) ;
      this.CuentasForm.get('cuenta').setValue(this.data.cuenta.cuenta_numero.replace('-','')) ;
      this.CuentasForm.get('cci').setValue(this.data.cuenta.cuenta_cci.replace(/-/g,'')) ;
    }
  }

  CrearFromulario(){
    this.CuentasForm = this._builder.group({
      id_cuenta: [null,[
        Validators.required,
      ]],
      banco: [null,[
        Validators.required,
      ]],
      cuenta:["",[
        Validators.required,
      ]],
      cci:["",[
        Validators.minLength(20),
        Validators.maxLength(20)
      ]]
    });
  }
 
  ListarBancos(){
    this._bancos.ListarBancos("",1,50).subscribe(res=>{
      this.Bancos=res['data'].bancos ;
    })
  }

  Guardar(){
    console.log( this.CuentasForm.value ) ;
    this._clientes.ActualizarCuenta(
      this.CuentasForm.get('id_cuenta').value ,
      this.CuentasForm.get('banco').value ,
      this.CuentasForm.get('cuenta').value ,
      this.CuentasForm.get('cci').value ,
    ).subscribe(res=>{
      this.ventana.close(res)
    }) ;
  }
}