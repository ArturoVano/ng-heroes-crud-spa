import { Dialog } from "@angular/cdk/dialog";
import { Component, contentChild, effect, inject, input, TemplateRef } from "@angular/core";

@Component({
  selector: 'modal',
  template: `<div></div>`,
})
export class ModalComponent {
  private dialog = inject(Dialog);
  isOpen = input.required<boolean>();
  template = contentChild.required(TemplateRef);

   constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.dialog.open(this.template(), {
          panelClass: 'dialog-container',
          hasBackdrop: false,
        });
      } else {
        this.dialog.closeAll();
      }
    });
  }
}
