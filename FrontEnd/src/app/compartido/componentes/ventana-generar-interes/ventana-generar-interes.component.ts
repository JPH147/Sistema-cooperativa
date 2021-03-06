import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CreditosService } from 'src/app/modulo-creditos/creditos/creditos.service';
import { VentaService } from 'src/app/modulo-ventas/ventas/ventas.service';

@Component({
  selector: 'app-ventana-generar-interes',
  templateUrl: './ventana-generar-interes.component.html',
  styleUrls: ['./ventana-generar-interes.component.css']
})
export class VentanaGenerarInteresComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false) ;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data : any ,
    private ventana : MatDialogRef<VentanaGenerarInteresComponent> ,
    private _creditos : CreditosService ,
    private _ventas : VentaService ,
  ) { }

  ngOnInit(): void {
  }

  public Guardar() {
    this.Cargando.next(true) ;
    if ( this.data.id_credito ) {
      this._creditos.GenerarInteres(this.data.id_credito)
      .pipe(
        finalize(()=>{
          this.Cargando.next(false) ;
        })
      )
      .subscribe( res => {
        this.ventana.close(res) ;
      })
    }
    if ( this.data.id_venta ) {
      this._ventas.GenerarInteres(this.data.id_venta)
      .pipe(
        finalize(()=>{
          this.Cargando.next(false) ;
        })
      )
      .subscribe( res => {
        this.ventana.close(res) ;
      })
    }
  }
}
