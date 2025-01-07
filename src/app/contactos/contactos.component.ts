import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ContactosService } from './services/contactos.service';
import { EntidadesService } from '../entidades/services/entidades.service';
import { MessageService } from 'primeng/api';
import { Contacto } from './interfaces/contacto';
import { Entidad } from '../entidades/interfaces/entidad';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { EntidadesFormComponent } from '../entidades/entidades-form/entidades-form.component';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ContactosFormComponent } from './contactos-form/contactos-form.component';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-contactos',
  standalone: true,
  imports: [CommonModule,
      CardModule,
      ButtonModule,
      TableModule,
      ToastModule,
      ToolbarModule,
      ContactosFormComponent,
    DialogModule, InputSwitchModule,DropdownModule, FormsModule ],
    providers: [MessageService],
  templateUrl: './contactos.component.html',
  styleUrl: './contactos.component.css'
})
export class ContactosComponent {
  private fb = inject(FormBuilder);
  public contactosService = inject(ContactosService);
  private entidadesService = inject(EntidadesService);

  private messageService = inject(MessageService);

  contactos: Contacto[] = [];
  entidades: Entidad[] = [];
  selectedContactos: Contacto[] = [];
  contactoDialog: boolean = false;
  submitted: boolean = false;

  contactoForm: FormGroup = this.fb.group({
    id: [''],
    nombre: ['', Validators.required],
    email: ['', Validators.required],
    telefono: ['', Validators.required],
    entidad_id: ['', Validators.required],
    identificacion: ['', Validators.required],
  });

  constructor() {
    this.loadContactos();
  }

  loadContactos() {
    this.contactosService.getContactos().subscribe(contactos => this.contactos = contactos);
  }

  loadEntidades() {
     this.entidadesService.get().subscribe(entidades => this.entidades = entidades);
  }

  openNew() {
    this.loadEntidades();
    this.submitted = false;
    this.contactoDialog = true;
    this.contactoForm.reset();
  }

  hideDialog() {
    this.contactoDialog = false;
    this.submitted = false;
    this.contactoForm.reset();
  }

  saveContacto() {
    this.submitted = true;

    if (this.contactoForm.invalid) {
      return;
    }

    const contacto = this.contactoForm.value;

    if (contacto.id) {
      this.contactosService.updateContacto(contacto).subscribe(() => {
        this.loadContactos();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Contacto actualizado', life: 3000 });
      });
    } else {
      this.contactosService.addContacto(contacto).subscribe(() => {
        this.loadContactos();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Contacto creado', life: 3000 });
      });
    }

    this.hideDialog();
  }

  editContacto(contacto: Contacto) {
    this.contactoForm.patchValue(contacto);
    this.contactoDialog = true;
  }

  deleteSelectedContactos() {

    if(confirm('¿Está seguro de que desea eliminar las entidades seleccionadas?')){
      this.contactosService.deleteContactos(this.selectedContactos).subscribe(() => {
        this.selectedContactos = [];
    });}
  }
}
