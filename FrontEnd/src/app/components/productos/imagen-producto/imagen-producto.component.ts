import {Component, Inject, OnInit, AfterViewInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, FormBuilder,FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ServiciosGenerales} from '../../global/servicios';
import { NgControl } from '@angular/forms';
import {ProductoService} from '../productos.service';
import { FileHolder } from '../../../../../node_modules/angular2-image-upload';

@Component({
  selector: 'app-imagen-producto',
  templateUrl: './imagen-producto.component.html',
  styleUrls: ['./imagen-producto.component.css'],
  providers:[ServiciosGenerales, ProductoService]
})

// tslint:disable-next-line:component-class-suffix
export class ImagenProductoComponent {
  public selectedValue: string;
  public ClientesForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<ImagenProductoComponent>,
    private FormBuilder: FormBuilder,
    private Servicios: ServiciosGenerales,
    private ProductoServicios: ProductoService,
    ) {}

    ngOnInit() {
      }


      onUploadFinished(file: FileHolder) {

        if ( this.data) {
          // console.log(file);
          this.Servicios.RenameFile(file.serverResponse.response._body, 'PRODUCTO', this.data.id,"producto").subscribe( res => {
            console.log("res",res);
            if (res) {
                this.ProductoServicios.ActualizarFoto(this.data.id, res.mensaje).subscribe();
              }
          });
        }
        // console.log(file.serverResponse.response._body);
        // console.log(this.data);
        }

  onNoClick(): void {
    this.ventana.close();
  }

}
