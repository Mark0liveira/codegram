import { NavController } from '@ionic/angular';
import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private navController: NavController) {
    }

    public canActivate() {
        const user = localStorage.getItem('codegram.user');
        if (!user) {
            this.navController.navigateRoot('login');
            return false;
        }

        return true;
    }
}
