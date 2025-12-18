import { Routes } from '@angular/router';
import { Login } from './login/login';

export const routes: Routes = [
    {
        path: "register",
        loadComponent: () => import('./register/register').then((x) => x.Register),
    },
    {
        path: 'login',
        loadComponent: () => import('./login/login').then((x) => Login),
    }
];
