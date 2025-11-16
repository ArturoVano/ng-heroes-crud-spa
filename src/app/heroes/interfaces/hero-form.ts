import { FormControl, FormGroup } from "@angular/forms";

export interface HeroFormModel {
  name: FormControl<string>;
  biography: FormGroup<{
    fullName: FormControl<string>;
    alterEgos: FormControl<string>;
    firstAppearance: FormControl<string>;
    publisher: FormControl<string>;
    alignment: FormControl<string>;
  }>;
  image: FormGroup<{
    url: FormControl<string>;
  }>;
}
