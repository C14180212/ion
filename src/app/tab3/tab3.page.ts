import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FotoService } from '../services/foto.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  urlImageStorage : string[] = []
  constructor(public fotoSer : FotoService, private afStorage : AngularFireStorage) {
 
    for( var index in this.fotoSer.dataPhoto){
    const imgFilep = this.fotoSer.pathcoll[index];
    this.afStorage.storage.ref().child(imgFilep).getDownloadURL().then((url) =>
    {
      this.urlImageStorage.unshift(url);
      console.log(url)
    });
  }
  
  }

}
