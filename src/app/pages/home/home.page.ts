import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { ToastController, NavController, ActionSheetController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public user: User = new User('', '', 'https://placehold.it/80');

  public posts: Observable<any[]>;

  constructor(private toastCtrl: ToastController,
              private navCtrl: NavController,
              private db: AngularFirestore,
              private actionSheetCtrl: ActionSheetController) {
                this.posts = db.collection('posts').valueChanges();
              }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('codegram.user'));

    const img = localStorage.getItem('codegram.post');
    if (img) {
      this.showMessage('Você tem uma publicação não salva');
    }
  }

  async showMessage(message: string) {
    const toast = await this.toastCtrl.create({
      message, duration: 3000, buttons: [
        {
          icon: 'send',
          handler: () => {
            this.navCtrl.navigateForward('/post');
          }
        }
      ]
    });
    toast.present();
  }

  async showOptions() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opções',
      buttons: [{
        text: 'Logout',
        role: 'destructive',
        icon: 'power',
        handler: () => {
          localStorage.removeItem('codegram.user');
          this.navCtrl.navigateRoot('/login');
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
      }]
    });
    await actionSheet.present();
  }

}
