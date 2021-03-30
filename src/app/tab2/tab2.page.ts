import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FotoService } from '../services/foto.service';


export interface fileFoto {
  name : string;
  path : string;
}
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  constructor(public fotoSer : FotoService, private afStorage : AngularFireStorage) {

  }


  async ngOnInit(){
    await this.fotoSer.loadFoto();
  }
  TambahFoto(){
    this.fotoSer.tambahFoto();
  }
  uploadFoto(){
    for (var index in this.fotoSer.dataPhoto)
    {
      const imgFilep =  `imgStorage/${this.fotoSer.dataPhoto[index].filePath}`;
      this.afStorage.upload(imgFilep, this.fotoSer.dataPhoto[index].dataImage)
      this.fotoSer.simpanPath(imgFilep)
    }
    console.log("uploadberhasil")
  }
}
