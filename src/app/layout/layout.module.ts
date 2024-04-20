import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from '../shared/shared.module';
import { Router } from '@angular/router';
import { LayoutRoutingModule } from './layout.routing';
import { FooterComponent } from './footer/footer.component';
import { ShowHeaderComponent } from '../modules/launch-screen-app/Industrial-Service-Sector-Tours/show-header/show-header.component';
const COMPONENTS = [LayoutComponent, HeaderComponent, FooterComponent,ShowHeaderComponent];

@NgModule({
  declarations: [COMPONENTS],
  imports: [CommonModule, SharedModule, LayoutRoutingModule],
})
export class LayoutModule {}
