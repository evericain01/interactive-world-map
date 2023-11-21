import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorldComponent } from './world/world.component'; // Adjust the path as necessary

// This sets the default routing destination to the WorldComponent.
const routes: Routes = [
  { path: 'http://localhost:4200/', component: WorldComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

