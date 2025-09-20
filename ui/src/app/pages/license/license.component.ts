//
// [yo-log]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sp-license',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './license.component.html',
  styleUrl: './license.component.sass'
})
export class LicenseComponent {
  private readonly router = inject(Router);

  public goHome(): void {
    this.router.navigate(['/home']);
  }
}
