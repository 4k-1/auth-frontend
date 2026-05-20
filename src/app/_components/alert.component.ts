import { ChangeDetectorRef, Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';

import { Alert, AlertType } from '@app/_models';
import { AlertService } from '@app/_services';

@Component({
  selector: 'alert',
  templateUrl: './alert.component.html',
  standalone: false
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() id = 'default-alert';
  @Input() fade = true;

  alerts: Alert[] = [];

  private alertSubscription!: Subscription;
  private routeSubscription!: Subscription;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // subscribe to new alert notifications
    this.alertSubscription = this.alertService.onAlert(this.id)
      .subscribe(alert => {
        // clear alerts when an empty alert is received
        if (!alert.message) {
          this.alerts = this.alerts.filter(x => x.keepAfterRouteChange);
          this.alerts.forEach(x => delete x.keepAfterRouteChange);
          this.scheduleDetectChanges();
          return;
        }

        // add alert to array
        this.alerts.push(alert);
        this.scheduleDetectChanges();

        // auto close if specified
        if (alert.autoClose) {
          setTimeout(() => this.removeAlert(alert), 3000);
        }
      });

    // clear alerts on location change
    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.alertService.clear(this.id);
        this.scheduleDetectChanges();
      }
    });
  }

  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    this.alertSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  removeAlert(alert: Alert) {
    // check if already removed to prevent error on auto close
    if (!this.alerts.includes(alert)) return;

    if (this.fade) {
      // fade out alert
      alert.fade = true;
      this.scheduleDetectChanges();

      // remove alert after fade out
      setTimeout(() => {
        this.alerts = this.alerts.filter(x => x !== alert);
        this.scheduleDetectChanges();
      }, 250);
    } else {
      // remove immediately
      this.alerts = this.alerts.filter(x => x !== alert);
      this.scheduleDetectChanges();
    }
  }
  cssClasses(alert: Alert): string {
    if (!alert) return '';

    const classes = ['alert', 'alert-dismissible', 'mt-4', 'container'];

    const alertTypeClassMap: Record<AlertType, string> = {
        [AlertType.Success]: 'alert-success',
        [AlertType.Error]: 'alert-danger',
        [AlertType.Info]: 'alert-info',
        [AlertType.Warning]: 'alert-warning'
    };

    if (alert.type !== undefined) {
        classes.push(alertTypeClassMap[alert.type]);
    }

    if (this.fade && alert.fade) {
        classes.push('fade', 'show');
    } else if (this.fade) {
        classes.push('fade', 'show');
    }

    return classes.join(' ');
}
