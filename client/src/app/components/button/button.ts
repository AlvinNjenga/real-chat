import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
  isDisabled = input<boolean>();
  isLoading = input<boolean>();
  action = output<void>();
  text = input.required<string>();

  clickHandler() {
    this.action.emit();
  }
}
