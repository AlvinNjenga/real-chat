import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../models/api-response';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  email!: string;
  userName!: string;
  fullName!: string;
  password!: string;
  profilePicture: string = "https://randomuser.me/api/portraits/lego/5.jpg";
  profileImage: File | null = null;

  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);
  router = inject(Router);

  hide = signal(false);

  togglePassword(event: MouseEvent) {
    this.hide.set(!this.hide())
  }

  register() {
    let formData = new FormData();
    formData.append('email', this.email);
    formData.append('userName', this.userName);
    formData.append('password', this.password);
    formData.append('fullName', this.fullName);
    formData.append('profileImage', this.profileImage!);

    this.authService.register(formData).subscribe({
      next: () => {
        this.snackBar.open('User registered successfully', 'Close', { duration: 1000 });
      },
      error: (error: HttpErrorResponse) => {
        let err = error.error as ApiResponse<string>;
        this.snackBar.open(err.error, 'Close'); 
      },
      complete: () => {
        this.router.navigate(['/']);
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.profileImage = file;

    const reader = new FileReader();
    reader.onload=(e) => {
      this.profilePicture = e.target!.result as string;
      console.log("The result" + e.target?.result);
    }

    reader.readAsDataURL(file);
    console.log(this.profilePicture);
  }
}
