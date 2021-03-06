import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InstitucionesService } from '../../instituciones.service';
import { BehaviorSubject } from 'rxjs';
import { ServiciosGenerales } from 'src/app/core/servicios/servicios';

@Component({
  selector: 'app-ventana-subsede',
  templateUrl: './ventana-subsede.component.html',
  styleUrls: ['./ventana-subsede.component.css']
})
export class VentanaSubsedeComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false);
  public InstitucionesForm : FormGroup ;
  public Instituciones : Array<any> = [];
  public Sedes : Array<any> = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any,
    private ventana : MatDialogRef<VentanaSubsedeComponent>,
    private Builder : FormBuilder,
    private _generales : ServiciosGenerales,
    private _instituciones : InstitucionesService
  ) { }

  ngOnInit() {
    this.ListarInstituciones();
    this.CrearFormulario();
    if(this.data){
      this.InstitucionesForm.get('id_subsede').setValue(this.data.id);
      this.InstitucionesForm.get('institucion').setValue(this.data.id_institucion);
      this.ListarSedes();
      this.InstitucionesForm.get('sede').setValue(this.data.id_sede);
      this.InstitucionesForm.get('subsede').setValue(this.data.nombre);
    } else {

    }
  }

  CrearFormulario(){
    this.InstitucionesForm = this.Builder.group({
      id_subsede : [null, [
        Validators.required
      ]],
      institucion : ["", [
        Validators.required
      ]],
      sede : ["", [
        Validators.required
      ]],
      subsede : ["", [
        Validators.required
      ]]
    })
  }

  ListarInstituciones(){
    this._generales.ListarInstitucion().subscribe( res => {
      this.Instituciones=res;
    });
  }

  ListarSedes(){
    this._generales.ListarSede(this.InstitucionesForm.value.institucion,"").subscribe( res => {
      this.Sedes=res;
    });
  }

  Guardar(){
    this.Cargando.next(true);
    if (!this.data) {
      this._instituciones.CrearSubsede(
        this.InstitucionesForm.value.sede,
        this.InstitucionesForm.value.subsede
      ).subscribe(res=>{
        this.Cargando.next(false);
        if(res['codigo']==0){
          this.ventana.close({resultado:true});
        } else {
          this.ventana.close({resultado:false});
        }
      })
    } else {
      this._instituciones.ActualizarSubsede(
        this.InstitucionesForm.value.id_subsede,
        this.InstitucionesForm.value.sede,
        this.InstitucionesForm.value.subsede
        ).subscribe(res=>{
          this.Cargando.next(false);
          if(res['codigo']==0){
            this.ventana.close({resultado:true});
          } else {
            this.ventana.close({resultado:false});
          }
      })
    }
  }
}