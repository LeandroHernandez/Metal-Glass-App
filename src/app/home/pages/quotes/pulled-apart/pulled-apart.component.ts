import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-pulled-apart',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <!-- <p>pulled-apart works!</p>  -->
    <router-outlet></router-outlet>
  `,
  styles: [``],
})
export class PulledApartComponent {}
