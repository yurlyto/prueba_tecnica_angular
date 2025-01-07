import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Entidad } from '../../entidades/interfaces/entidad';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-contactos-form',
  standalone: true,
  imports: [CommonModule,
      CardModule,
      ButtonModule,
      TableModule,
      ToastModule,
      ToolbarModule,
      ReactiveFormsModule,
      DialogModule,
      InputSwitchModule,DropdownModule, FormsModule],
  templateUrl: './contactos-form.component.html',
  styleUrl: './contactos-form.component.css'
})
export class ContactosFormComponent {
  @Input() formGroup!: FormGroup;
  @Input() entidades: Entidad[] = [];
  @Output() onClose = new EventEmitter<void>();

  close() {
    this.onClose.emit();
  }
}
