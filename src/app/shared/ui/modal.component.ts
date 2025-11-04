import { Dialog } from "@angular/cdk/dialog";
import { Component, contentChild, effect, inject, input, output, TemplateRef } from "@angular/core";
import { take } from "rxjs";

@Component({
  selector: 'modal',
  template: `<div></div>`,
})
export class ModalComponent {
  private dialog = inject(Dialog);
  isOpen = input.required<boolean>();
  close = output();
  template = contentChild.required(TemplateRef);

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        const dialogRef = this.dialog.open(this.template(), {
          panelClass: 'dialog-container',
        })

        dialogRef.closed.pipe(take(1)).subscribe(() =>
          this.close.emit()
        );

      } else {
        this.dialog.closeAll();
      }
    });
  }
}
