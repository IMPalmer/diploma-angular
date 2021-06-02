import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import {SpinnerComponent} from '@components/navigation/spinner/spinner.component';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private overlayRef: OverlayRef = undefined;

  constructor(private overlay: Overlay) {}

  public show(): void {
    Promise.resolve(null).then(() => {
      this.overlayRef = this.overlay.create({
        positionStrategy: this.overlay
          .position()
          .global()
          .centerHorizontally()
          .centerVertically(),
        hasBackdrop: true,
      });
      this.overlayRef.attach(new ComponentPortal(SpinnerComponent));
    });
  }

  public hide(): void {
    this.overlayRef.detach();
    this.overlayRef = undefined;
  }
}
