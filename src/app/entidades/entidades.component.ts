import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, Output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { EntidadesService } from './services/entidades.service';
import { Entidad } from './interfaces/entidad';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { EntidadesFormComponent } from './entidades-form/entidades-form.component';
import { ConfirmationService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-entidades',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    EntidadesFormComponent,
  DialogModule, InputSwitchModule ],
  templateUrl: './entidades.component.html',
  styleUrl: './entidades.component.css',
  providers: [MessageService, ConfirmationService]
})
export default class EntidadesComponent {
  private fb = inject(FormBuilder);
  public entidadesService = inject(EntidadesService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  total = computed(() => this.entidadesService.entidades().length);
  selectedEntidades: Entidad[]=[];
  displayModal: boolean = false;

  entidadForm: FormGroup = this.fb.group({
    id: [''],
    nombre: ['', Validators.required],
    email: ['', Validators.required],
    nit: ['', Validators.required],
    telefono: ['', Validators.required],
    direccion: ['', Validators.required],
  });
  
  constructor(){
  }
  openNew() {
    this.displayModal = true;
    this.entidadForm.reset();
    this.entidadForm.patchValue({estado: true});
  }
 
  edit(entidad:Entidad){
    this.entidadForm.patchValue(entidad);
    this.displayModal = true;
  }

  deleteSelectedEntidades() {
    if(confirm('¿Está seguro de que desea eliminar las entidades seleccionadas?')){
      this.entidadesService.deleteEntidades(this.selectedEntidades).subscribe(() => {
        this.selectedEntidades = [];
    });}
  }

}
