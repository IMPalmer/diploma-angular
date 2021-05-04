import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarResponseService {
  constructor( private snackBar: MatSnackBar, private zone: NgZone) {
  }

  public showSnackBar(message: string, action: string, duration = 5000): void {
    this.zone.run(() => {
      this.snackBar.open(message, action, { duration});
    });
  }
}
