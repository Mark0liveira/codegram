import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

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
    const loading = await this.loadingController.create({message: 'Cadastrando'});
    loading.present();

    this.fbAuth.
      createUserWithEmailAndPassword(this.form.controls.email.value, this.form.controls.password.value)
      .then((data) => {
          this.showMessage('Seja bem-vindo!');
          loading.dismiss();
          this.navController.navigateRoot('login');
        })
      .catch(() => {
          this.showMessage('Algo inesperado aconteceu!');
          loading.dismiss();
        });
  }

  public async showMessage(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000
    });
    toast.present();
  }

  public cancel(): void {
    this.navController.navigateRoot('login');
  }

}
