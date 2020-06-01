import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConferencePage } from './conference.page';

const routes: Routes = [
  {
    path: '',
    component: ConferencePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConferencePageRoutingModule {}
