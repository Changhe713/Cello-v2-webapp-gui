import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NavbarComponentModule } from '../navbar/navbar.module';
import { ProjectsPageRoutingModule } from './projects-routing.module';
import { ProjectsPage } from './projects.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProjectsPageRoutingModule,
        NavbarComponentModule,
        NgxDatatableModule,
    ],
    declarations: [ProjectsPage]
})
export class ProjectsPageModule { }
