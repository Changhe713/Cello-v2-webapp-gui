import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavbarComponentModule } from '../navbar/navbar.module';
import { SignupPageRoutingModule } from './signup-routing.module';
import { SignupPage } from './signup.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SignupPageRoutingModule,
        NavbarComponentModule,
        ReactiveFormsModule,
        FormsModule,
    ],
    declarations: [SignupPage]
})
export class SignupPageModule { }
