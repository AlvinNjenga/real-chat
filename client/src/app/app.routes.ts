import { Routes } from '@angular/router';
import { Login } from './login/login';
import { loginGuard } from './guards/login-guard';

export const routes: Routes = [
    {
        path: "register",
        loadComponent: () => import('./register/register').then((x) => x.Register),
        canActivate: [loginGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./login/login').then((x) => Login),
        canActivate: [loginGuard]
    }
];
