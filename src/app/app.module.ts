import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './modules/routing/app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material.module';
import { LayoutComponent } from '@components/layout/layout.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HeaderComponent } from '@components/navigation/header/header.component';
import { SidenavListComponent } from '@components/navigation/sidenav-list/sidenav-list.component';
import { HomeComponent } from '@components/home/home.component';
import { SignInComponent } from '@components/sign-in/sign-in.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from '@components/sign-up/sign-up.component';
import { TokenInterceptor } from '@interceptors/token.interceptor';
import { FooterComponent } from '@components/navigation/footer/footer.component';
import { DocAuthorsCertificateComponent } from '@components/documents/doc-authors-certificate/doc-authors-certificate.component';
import { DegreeComponent } from '@components/data-manipulation/degree/degree.component';
import { DataManipulationModule } from './modules/data-manipulation.module';
import { PublishingHouseComponent } from './components/data-manipulation/publishing-house/publishing-house.component';
import { UniversityDepartmentComponent } from './components/data-manipulation/university-department/university-department.component';
import { ScientistComponent } from './components/data-manipulation/scientist/scientist.component';
import { DocExpertiseActComponent } from './components/documents/doc-expertise-act/doc-expertise-act.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    SidenavListComponent,
    HomeComponent,
    SignInComponent,
    SignUpComponent,
    FooterComponent,
    DocAuthorsCertificateComponent,
    DegreeComponent,
    PublishingHouseComponent,
    UniversityDepartmentComponent,
    ScientistComponent,
    DocExpertiseActComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DataManipulationModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
