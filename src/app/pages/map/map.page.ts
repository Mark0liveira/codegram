import { Post } from './../../models/post.model';
import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements AfterViewInit {

  public post: Post = new Post('', '', null);

  constructor() {
    const data = localStorage.getItem('codegram.post');
    if (data) {
      this.post = JSON.parse(data);
    }
  }

  ngAfterViewInit() {
    const html = '<iframe style="height: 100vh;" width="100%" height="99%" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyDspoEN2SlY9WZGEmSSEHGcuAzzK6ORuOU&origin=' + this.post.location + '&destination=' + this.post.location + '" allowfullscreen></iframe>';
    document.getElementById('map').innerHTML = html;
  }

}
