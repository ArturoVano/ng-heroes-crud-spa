import { Dialog } from "@angular/cdk/dialog";
import { Component, contentChild, effect, inject, input, output, TemplateRef } from "@angular/core";

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
          // hasBackdrop: true,
        });

        dialogRef.backdropClick.subscribe(() => {
          console.log("helloooooo")
          this.close.emit();
      });
      } else {
        this.dialog.closeAll();
      }
    });
  }
}
