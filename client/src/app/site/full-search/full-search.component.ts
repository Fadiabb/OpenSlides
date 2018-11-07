import { Component, OnInit } from '@angular/core';
import { DataStoreService } from 'app/core/services/data-store.service';
import { User } from 'app/shared/models/users/user';
import { ActivatedRoute, Router } from '@angular/router';
import { Motion } from 'app/shared/models/motions/motion';
import { Item } from 'app/shared/models/agenda/item';
import { Assignment } from 'app/shared/models/assignments/assignment';

@Component({
    selector: 'os-full-search',
    templateUrl: './full-search.component.html',
    styleUrls: ['./full-search.component.scss']
})
export class FullSearchComponent implements OnInit {
    public searchQuery: string;
    public user: User[];
    public motion: Motion[];
    public agenda: Item[];
    public assigment: Assignment[];
    public userCheckbox: true;
    public motionCheckbox: true;
    public userCheck = true;
    public motionCheck = true;
    public agendaCheck = true;
    public assigmentCheck = true;
    public term: string;

    public constructor(private DS: DataStoreService, private route: ActivatedRoute, private router: Router) {}

    public search(): void {
        // search in user
        this.user = this.DS.filter<User>(User, user => {
            return this.searchInModel<User>(user, 'default_password');
            /* return user.some(this.searchInModel()) */
        });

        // search in motion
        this.motion = this.DS.filter(Motion, motion => {
            return this.searchInModel<Motion>(motion);
        });

        // search in Agenda
        this.agenda = this.DS.filter<Item>(Item, item => {
            return this.searchInModel<Item>(item);
        });

        // search in assigment
        this.assigment = this.DS.filter<Assignment>(Assignment, assigment => {
            return this.searchInModel<Assignment>(assigment);
        });
    }

    private searchInModel<T>(model: T, excludeSearch?: string): boolean {
        let found = false;
        const keys = Object.keys(model);
        keys.forEach(key => {
            if (model[key] && typeof model[key] === 'string' && !found && key !== excludeSearch) {
                found = model[key].includes(this.searchQuery);
            }
        });
        return found;
    }
    public quickSearch(term: string): void {
        this.searchQuery = term;
        this.search();
        console.log('quick search for ', this.searchQuery);
    }

    public ngOnInit(): void {
        console.log('snapshot: ', this.route.snapshot);
        this.route.url.subscribe(url => {
            console.log('new url', url);
            this.searchQuery = url[1].path;
            this.search();
        });
    }
}
