import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { EntidadesService } from '../services/entidades.service';
import { Entidad } from '../interfaces/entidad';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-entidades-form',
  standalone: true,
  imports: [CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    ReactiveFormsModule,
    DialogModule,
    InputSwitchModule,DropdownModule
],
  templateUrl: './entidades-form.component.html',
  styleUrl: './entidades-form.component.css'
})
export class EntidadesFormComponent  {
  @Input() entidadForm!: FormGroup;
  @Output() onClose = new EventEmitter<void>();
  public entidadesService = inject(EntidadesService);
  private fb = inject(FormBuilder);
  
  total = computed(() => this.entidadesService.entidades().length);
  selectedEntidades: Entidad[] = [];
  entidadDialog: boolean = false;
  submitted: boolean = false;
  
  // entidadForm: FormGroup = this.fb.group({
  //   id: [''],
  //   nombre: ['', Validators.required],
  //   nit: ['', Validators.required],
  //   telefono: ['', Validators.required],
  //   direccion: ['', Validators.required],
  //   email: ['', Validators.required],
  // });



  edit(entidad: Entidad) {
    this.entidadForm.patchValue(entidad);
    this.entidadDialog = true;
  }

  hideDialog() {
    this.entidadDialog = false;
    this.submitted = false;
    this.entidadForm.reset();
  }

  

  closeModal() {
    this.onClose.emit();
  }

  saveEntidad() {
    this.submitted = true;

    if (this.entidadForm.invalid) {
      return;
    }

    const entidad = this.entidadForm.value;
    
    if (entidad.id) {
      // Update existing entidad
      this.entidadesService.updateEntidad(entidad);
    } else {
      // Create new entidad
      this.entidadesService.addEntidad(entidad);
    }

    this.hideDialog();
  }

}
