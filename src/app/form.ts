import { NgForm } from '@angular/forms';

export function isFormValid(form: NgForm): boolean {
  return form.invalid && (form.dirty || form.touched || form.submitted);
}
