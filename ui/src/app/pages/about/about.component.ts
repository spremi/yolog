//
// [yo-log]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: 'sp-about',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.sass'
})
export class AboutComponent {
  private readonly router = inject(Router);

  public goHome(): void {
    this.router.navigate(['/home']);
  }
}
