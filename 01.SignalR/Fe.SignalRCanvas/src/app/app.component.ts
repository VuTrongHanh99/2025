import { locale as enLang } from './_core/i18n/vocabs/en';
import { locale as chLang } from './_core/i18n/vocabs/en';
import { locale as esLang } from './_core/i18n/vocabs/en';
import { locale as jpLang } from './_core/i18n/vocabs/en';
import { locale as deLang } from './_core/i18n/vocabs/en';
import { locale as frLang } from './_core/i18n/vocabs/en';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslationService } from './_core/i18n/translation.service';
import { SpinnerHandlerService } from './spinner-handler.service';

@Component({
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'desktop-simulator';
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  spinnerActive: boolean = true;
  constructor(
    private translationService: TranslationService,
    public router: Router,
    public spinnerHandler: SpinnerHandlerService
  ) {
    this.spinnerHandler.showSpinner.subscribe(this.showSpinner.bind(this));
    // register translations
    this.translationService.loadTranslations(
      enLang,
      chLang,
      esLang,
      jpLang,
      deLang,
      frLang
    );
  }
  ngOnInit() {
    // this.signalRService.startConnection();
    // this.signalRService.addTransferChartDataListener();
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // clear filtration paginations and others
        // this.tableService.setDefaults();
        // hide splash screen
        //this.spinnerHandler.handleRequest();
        //this.spinnerHandler.numberOfRequests = 0;
        //this.spinnerHandler.showSpinner.next(false);
        // scroll to top on every route change
        window.scrollTo(0, 0);

        // to display back the body content
        setTimeout(() => {
          document.body.classList.add('page-loaded');
        }, 500);
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  showSpinner = (state: boolean): void => {
    this.spinnerActive = state;
  };
}
