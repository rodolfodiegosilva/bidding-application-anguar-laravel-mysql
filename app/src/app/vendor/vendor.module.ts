import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';

import { VendorGuard } from './vendor.guard';
import { VendorRoutingModule } from './vendor.routing.module';
import { VendorComponent } from './vendor.component';
import { ClassificadosComponent } from './classificados/classificados.component';
import { ApproveComponent } from './approve/approve.component';


@NgModule({
    imports:[
        CommonModule,
        ReactiveFormsModule,
        VendorRoutingModule,
        FormsModule,
        NgxMaskModule.forChild()
    ],
    declarations: [
        VendorComponent,
        ClassificadosComponent,
        ApproveComponent
    ],
    exports:[],
    providers:[VendorGuard]
})

export class VendorModule {}
