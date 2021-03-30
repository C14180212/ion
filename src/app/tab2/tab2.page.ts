import { Component } from '@angular/core';
import { FotoService } from '../services/foto.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  constructor(public fotoSer : FotoService) {}


  async ngOnInit(){
    await this.fotoSer.loadFoto();
  }
  TambahFoto(){
    this.fotoSer.tambahFoto();
  }

}
