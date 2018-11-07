import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { AuthService } from 'app/core/services/auth.service';
import { OperatorService } from 'app/core/services/operator.service';

import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from 'app/base.component';
import { pageTransition, navItemAnim } from 'app/shared/animations';
import { MatDialog, MatSidenav } from '@angular/material';
import { ViewportService } from '../core/services/viewport.service';
import { MainMenuService } from '../core/services/main-menu.service';
import { User } from 'app/shared/models/users/user';
import { DataStoreService } from 'app/core/services/data-store.service';

@Component({
    selector: 'os-site',
    animations: [pageTransition, navItemAnim],
    templateUrl: './site.component.html',
    styleUrls: ['./site.component.scss']
})
export class SiteComponent extends BaseComponent implements OnInit {
    /**
     * HTML element of the side panel
     */
    @ViewChild('sideNav')
    public sideNav: MatSidenav;

    /**
     * Get the username from the operator (should be known already)
     */
    public username: string;

    /**
     * is the user logged in, or the anonymous is active.
     */
    public isLoggedIn: boolean;

    /**
     * Holds the coordinates where a swipe gesture was used
     */
    private swipeCoord?: [number, number];

    /**
     * Holds the time when the user was swiping
     */
    private swipeTime?: number;

    /**
     * Constructor
     *
     * @param authService
     * @param router
     * @param operator
     * @param vp
     * @param translate
     * @param dialog
     */
    public constructor(
        private authService: AuthService,
        private router: Router,
        private DS: DataStoreService,
        public operator: OperatorService,
        public vp: ViewportService,
        public translate: TranslateService,
        public dialog: MatDialog,
        public mainMenuService: MainMenuService // used in the component
    ) {
        super();

        this.operator.getObservable().subscribe(user => {
            if (user) {
                this.username = user.full_name;
            } else {
                this.username = translate.instant('Guest');
            }
            this.isLoggedIn = !!user;
        });
    }

    /**
     * Initialize the site component
     */
    public ngOnInit(): void {
        this.vp.checkForChange();

        // observe the mainMenuService to receive toggle-requests
        this.mainMenuService.toggleMenuSubject.subscribe((value: void) => this.toggleSideNav());

        // get a translation via code: use the translation service
        // this.translate.get('Motions').subscribe((res: string) => {
        //      console.log('translation of motions in the target language: ' + res);
        //  });

        this.router.events.subscribe(event => {
            // Scroll to top if accessing a page, not via browser history stack
            if (event instanceof NavigationEnd) {
                const contentContainer = document.querySelector('.mat-sidenav-content');
                contentContainer.scrollTo(0, 0);
            }
        });
    }

    /**
     * Closes the sidenav in mobile view
     */
    public toggleSideNav(): void {
        if (this.vp.isMobile) {
            this.sideNav.toggle();
        }
    }

    /**
     * Let the user change the language
     * @param lang the desired language (en, de, fr, ...)
     */
    public selectLang(selection: string): void {
        this.translate.use(selection).subscribe();
    }

    /**
     * Get the name of a Language by abbreviation.
     */
    public getLangName(abbreviation: string): string {
        if (abbreviation === 'en') {
            return this.translate.instant('English');
        } else if (abbreviation === 'de') {
            return this.translate.instant('German');
        } else if (abbreviation === 'fr') {
            return this.translate.instant('French');
        }
    }

    // TODO: Implement this
    public editProfile(): void {
        if (this.operator.user) {
            this.router.navigate([`./users/${this.operator.user.id}`]);
        }
    }

    // TODO: Implement this
    public changePassword(): void {}

    /**
     * Function to log out the current user
     */
    public logout(): void {
        this.authService.logout();
    }

    /**
     * Handle swipes and gestures
     */
    public swipe(e: TouchEvent, when: string): void {
        const coord: [number, number] = [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
        const time = new Date().getTime();

        if (when === 'start') {
            this.swipeCoord = coord;
            this.swipeTime = time;
        } else if (when === 'end') {
            const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
            const duration = time - this.swipeTime;

            // definition of a "swipe right" gesture to move in the navigation.
            // Required mobile view
            // works anywhere on the screen, but could be limited
            // to the left side of the screen easily if required)
            if (
                duration < 1000 &&
                Math.abs(direction[0]) > 30 && // swipe length to be detected
                Math.abs(direction[0]) > Math.abs(direction[1] * 3) && // 30° should be "horizontal enough"
                direction[0] > 0 // swipe left to right
            ) {
                this.toggleSideNav();
            }
        }
    }
}
