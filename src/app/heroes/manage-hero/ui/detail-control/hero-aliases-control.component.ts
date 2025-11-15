import { Component, computed, input, output } from "@angular/core";
import { ControlContainer, FormControl, FormGroupDirective, ReactiveFormsModule, Validators } from "@angular/forms";
import { LucideAngularModule } from "lucide-angular";
import { HeroFormModel } from "../../../interfaces/hero-form";


@Component({
  selector: 'hero-aliases-control',
  template: `
    <div class="form-field">
      <div class="form-field">
      <label for="aliases">Aliases</label>
      <div class="aliases-input">
        <input
          id="aliases"
          type="text"
          [formControl]="aliasInput"
          placeholder="Add any alias as you want..."
          (keydown)="onAliasInputKeydown($event)"
        />
        <button class="btn" (click)="addAlias()">
          <lucide-icon name="plus"/>
        </button>
      </div>
      <div class="aliases-list">
        @for (alias of aliasesWithId(); track alias.id) {
          <div class="chip">
            {{ alias.name }}
            <button (click)="removeAlias($index)">
              <lucide-icon name="x"></lucide-icon>
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styleUrl: 'hero-aliases-control.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  imports: [LucideAngularModule, ReactiveFormsModule]
})
export class AliasesControlComponent {
  // aliasesControl = input.required<FormControl<string[]>>();
  aliases = input.required<string[]>();
  outputValue = output<string[]>();

  aliasesWithId = computed(() => 
    this.aliases().map((alias) => ({ name: alias, id: this.getSlungId(alias) }))
  );

  // Temporary input for adding new aliases
  aliasInput = new FormControl('', {
    validators: [Validators.minLength(3)],
    nonNullable: true
  });

  addAlias() {
    this.aliasInput.markAsTouched();
    this.aliasInput.updateValueAndValidity();

    if (this.aliasInput.invalid) {
      return;
    }

    const newAlias = this.aliasInput.value.trim();
    
    if (this.aliases().includes(newAlias)) {
      // Duplicated
      return;
    }

    this.outputValue.emit([...this.aliases(), newAlias]);
    this.aliasInput.reset();
  }

  onAliasInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addAlias();
    }
  }

  removeAlias(index: number) {
    this.outputValue.emit([
      ...this.aliases().filter((_, i) => i !== index),
    ]);
  }

  private getSlungId(alias: string) {
    const date = new Date().toString();
    return `${alias}-${date}`;
  }
}