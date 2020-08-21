import { User } from './../../models/user.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public form: FormGroup;

  constructor(private fb: FormBuilder,
              private loadingController: LoadingController,
              private navController: NavController,
              private toastController: ToastController,
              private fbAuth: AngularFireAuth) {
    this.form = this.fb.group({
      email: ['', Validators.compose([
        Validators.required
      ])],
      password: ['', Validators.compose([
        Validators.required
      ])]
    });
  }

  ngOnInit() {
  }

  public async submit() {
    const loading = await this.toastController.create({
      message: 'Carregando...'
    });
    loading.present();

    this.fbAuth.signInWithEmailAndPassword(
      this.form.controls.email.value,
      this.form.controls.password.value
    ).then((data) => {
        loading.dismiss();
        localStorage.setItem('codegram.user', JSON.stringify(new User('', data.user.email, '')));
        this.navController.navigateRoot('home');
        this.showMessage('Login efetuado com sucesso!');
      }
    ).catch(() => {
        loading.dismiss();
        this.showMessage('Algo inesperado ocorreu!');
    });
  }

  public async showMessage(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000
    });
    toast.present();
  }

  public signInWithGoogle() {
    this.fbAuth.signInWithPopup(new auth.GoogleAuthProvider())
      .then((data) => {
        console.log(data);
        this.navController.navigateRoot('home');
        localStorage.setItem('codegram.user', JSON.stringify(new User
          (data.user.displayName, data.user.email, data.user.photoURL)
        ));
      }).catch((err) => {
        console.log(err);
        this.showMessage('Algo inesperado ocorreu!');
      });
  }

  public goToSignup() {
    this.navController.navigateForward('signup');
  }


}
