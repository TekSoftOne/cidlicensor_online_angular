import { NgForm } from '@angular/forms';

export function isFormValid(form: NgForm): boolean {
  return form.invalid && (form.dirty || form.touched || form.submitted);
}

export function isControlValid(form: NgForm, control: any): boolean {
  return (
    control &&
    control.invalid &&
    (control.dirty || control.touched || form.submitted)
  );
}

export function createGoogleMapsScript(): void {
  if (document.getElementById('google-apis')) {
    return;
  }
  const script = document.createElement('script');
  script.src =
    'https://maps.googleapis.com/maps/api/js?sensor=false&key=AIzaSyBHpAmimxTn6JfSP_-1PavnZ9WvAE6eCtc&libraries=places&callback=initAutocomplete';
  script.async = true;
  script.defer = true;
  script.id = 'google-apis';
  document.body.insertAdjacentElement('beforeend', script);
}
