import { AfterViewInit, Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-take-photo',
  templateUrl: './take-photo.page.html',
  styleUrls: ['./take-photo.page.scss'],
})
export class TakePhotoPage implements AfterViewInit {

  constructor(
    private navCtrl: NavController,
  ) {
  }

  ngAfterViewInit() {
    const video = document.getElementById('video') as any;

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { aspectRatio: 1 } })
        .then((stream) => {
          video.srcObject = stream;
        })
        .catch((err) => {
          console.log('Não rolou carregar o vídeo');
        });
    }
  }

  takePicture() {
    const video = document.getElementById('video') as any;
    const canvas = document.getElementById('canvas') as any;
    const context = canvas.getContext('2d');

    context.drawImage(video, 0, 0, 1000, 1000);
    localStorage.setItem('codegram.post', JSON.stringify(new Post(canvas.toDataURL(), '', '')));

    video.classList.add('animated');
    video.classList.add('flash');

    setTimeout(() => {
      this.navCtrl.navigateForward('/post');
    }, 1000);
  }

}
