import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { environment } from '../environments/environment';
import { fakeBackendProvider } from './_helpers/fake-backend';
import { AlertComponent } from './_components';
import { HomeComponent } from './home';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    HomeComponent
    // ✅ REMOVED LoginComponent and RegisterComponent from here
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
    // ✅ NOT importing AccountModule here (it's lazy loaded)
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ...(environment.useFakeBackend ? [fakeBackendProvider] : [])
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }