import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConferencePageRoutingModule } from './conference-routing.module';

import { ConferencePage } from './conference.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConferencePageRoutingModule
  ],
  declarations: [ConferencePage]
})
export class ConferencePageModule {}
