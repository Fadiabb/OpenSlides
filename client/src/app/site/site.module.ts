import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'app/shared/shared.module';

import { SiteComponent } from './site.component';
import { SiteRoutingModule } from './site-routing.module';
import { FullSearchComponent } from './full-search/full-search.component';

@NgModule({
    imports: [CommonModule, SharedModule, SiteRoutingModule],
    declarations: [SiteComponent, FullSearchComponent]
})
export class SiteModule {}
