import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SiteComponent } from './site.component';

import { AuthGuard } from '../core/services/auth-guard.service';
import { FullSearchComponent } from './full-search/full-search.component';

/**
 * Routung to all OpenSlides apps
 *
 * TODO: Plugins will have to append to the Routes-Array
 */
const routes: Routes = [
    {
        path: '',
        component: SiteComponent,
        children: [
            {
                path: '',
                loadChildren: './common/common.module#CommonModule'
            },
            {
                path: 'agenda',
                loadChildren: './agenda/agenda.module#AgendaModule'
            },
            {
                path: 'assignments',
                loadChildren: './assignments/assignments.module#AssignmentsModule'
            },
            {
                path: 'mediafiles',
                loadChildren: './mediafiles/mediafiles.module#MediafilesModule'
            },
            {
                path: 'motions',
                loadChildren: './motions/motions.module#MotionsModule'
            },
            {
                path: 'settings',
                loadChildren: './config/config.module#ConfigModule'
            },
            {
                path: 'users',
                loadChildren: './users/users.module#UsersModule'
            },
            {
                path: 'tags',
                loadChildren: './tags/tag.module#TagModule'
            },
            {
                path: 'search/:str',
                component: FullSearchComponent
            }

        ],
        canActivateChild: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SiteRoutingModule {}
