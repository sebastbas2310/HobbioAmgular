import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ingredients-form',
  imports: [ MaterialModule, ReactiveFormsModule, CommonModule ],
  templateUrl: './ingredients-form.component.html',
  styleUrl: './ingredients-form.component.scss'
})
export class IngredientsFormComponent {

  
    

}
