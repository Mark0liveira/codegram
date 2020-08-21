import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AlertController, NavController, ToastController, IonSlides } from '@ionic/angular';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {

  public post: Post = new Post('', '', null);
  public filters: string[] = [];

  public task: AngularFireUploadTask;
  public progress: any;

  @ViewChild('slider', { static: true }) slidefromHtml: IonSlides;


  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
  ) {
    const data = localStorage.getItem('codegram.post');
    if (data) {
      this.post = JSON.parse(data);
    }

    this.filters.push('filter-normal');
    this.filters.push('filter-1977');
    this.filters.push('filter-aden');
    this.filters.push('filter-gingham');
    this.filters.push('filter-ginza');
    this.filters.push('filter-moon');
    this.filters.push('filter-reyes');
    this.filters.push('filter-willow');
  }

  ngOnInit() {
  }

  getLocation() {
    // https://www.google.com/maps/{{ this.post.location }}
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.post.location = `${position.coords.latitude},${position.coords.longitude}`;
        localStorage.setItem('codegram.post', JSON.stringify(this.post));
      });
    } else {
      this.showMessage('Não foi possível obter sua localização');
    }
  }


  async showMessage(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
    });
    toast.present();
  }

  async showCloseOptions() {
    const alert = await this.alertCtrl.create({
      header: 'Descartar Postagem?',
      message: 'Deseja descartar esta <strong>postagem</strong>?',
      buttons: [
        {
          text: 'Descartar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            localStorage.removeItem('codegram.post');
            this.close();
          }
        }, {
          text: 'Manter',
          handler: () => {
            this.close();
          }
        }
      ]
    });

    await alert.present();
  }

  close() {
    this.navCtrl.navigateBack('/home');
  }

  saveLocal() {
    localStorage.setItem('codegram.post', JSON.stringify(this.post));
  }

  async submit() {
    // this.storage.upload('/post-images', this.post.image);
    const filePath = `post_${new Date().getTime()}.jpg`;
    this.task = this.storage.ref(filePath).putString(this.post.image, 'data_url');
    this.progress = this.task.percentageChanges();

    this.task.then((data) => {
      const ref = this.storage.ref(data.metadata.fullPath);
      ref.getDownloadURL().subscribe((imgUrl) => {
        this.post.image = imgUrl;
        this.db.collection('posts').add(this.post);
        localStorage.removeItem('codegram.post');
        this.navCtrl.navigateBack('/home');
      });
    });
  }

  showMap() {
    this.navCtrl.navigateForward('/map');
  }

  getFilterImage() {
    this.slidefromHtml.getActiveIndex()
      .then(index => {
        const filter = this.filters[index];
        this.post.filter = filter;
      });
  }

}
