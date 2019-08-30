import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CytoscapeComponent } from './components/cytoscape/cytoscape.component';
import {RouterModule, Routes} from '@angular/router';
import {TestComponent} from './components/test/map.component';

const appRoutes: Routes = [
  { path: 'map', component: TestComponent },
  { path: 'cyto',      component: CytoscapeComponent },
  { path: '**', component: TestComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    CytoscapeComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
