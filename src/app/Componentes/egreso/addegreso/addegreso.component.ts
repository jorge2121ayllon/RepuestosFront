import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Egreso } from 'src/app/Models/Administration/egreso';
import { EgresoService } from 'src/app/Services/egreso.service';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Validators } from '@angular/forms';  

@Component({
  selector: 'app-addegreso',
  templateUrl: './addegreso.component.html',
  styleUrls: ['./addegreso.component.css']
})
export class AddegresoComponent {
 form: FormGroup;
  token = localStorage.getItem("token") || "";

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddegresoComponent>,
    private egresoService: EgresoService,
    @Inject(MAT_DIALOG_DATA) public data: Egreso | null
  ) {
    this.form = this.fb.group({
      id: [data?.id || 0],
      nombre: [data?.nombre || '', Validators.required],
      costo: [data?.costo || '', Validators.required],
      fecha: [data?.fecha || new Date(), Validators.required],
    });
  }

  guardar() {
    if (this.form.invalid) return;

    const egreso = this.form.value;

    if (egreso.id === 0) {
      this.egresoService.agregar(egreso, this.token).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.egresoService.actualizar(egreso, this.token).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  cerrar() {
    this.dialogRef.close();
  }
}
