import { ReadVarExpr } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { CameraPhoto, CameraResultType, CameraSource, Capacitor, FilesystemDirectory, Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';

const {Camera, Filesystem, Storage} = Plugins;

@Injectable({
  providedIn: 'root'
})
export class FotoService {

  public dataPhoto : Photo[] = [];
  public pathcoll : string[] = [];

  private keyphoto : string = "foto"
  private platform :Platform
  constructor(platform : Platform) {
      this.platform = platform;
   }

  public async tambahFoto(){
    const Foto = await Camera.getPhoto({
      resultType : CameraResultType.Uri,
      source : CameraSource.Camera,
      quality:100
    });
    console.log(Foto)

    const fileFoto = await this.simpan(Foto)

    this.dataPhoto.unshift(fileFoto)


   Storage.set({
      key:this.keyphoto,
      value: JSON.stringify(this.dataPhoto)
    })
    this.simpan(Foto)
  
  }

  public async simpanPath(path : string){
    this.pathcoll.push(path);
  }
  public async simpan(foto : CameraPhoto)
  {
    const base64Data = await this.readAsBase64(foto)

    const nama = new Date().getTime()+'.png';
    const simpanFile = await Filesystem.writeFile({
      path : nama,
      data : base64Data,
      directory : FilesystemDirectory.Data
    });

    const response = await fetch(foto.webPath);
    const blob = await response.blob();
    const dataFoto = new File([blob], foto.path, {
      type: "image/png"
    })

  
    if (this.platform.is('hybrid')){
      return {
        filePath:simpanFile.uri,
        webViewPath:Capacitor.convertFileSrc(simpanFile.uri),
        dataImage : dataFoto
      }
    }else{
    return{
      filePath : nama,
      webViewPath : foto.webPath,
      dataImage : dataFoto
    }
  }

  }

  private async readAsBase64(foto : CameraPhoto)
  {
    if (this.platform.is('hybrid')){
      const file  = await Filesystem.readFile({
        path : foto.path
      })
      return file.data
    }else{
    const response = await fetch(foto.webPath)
    const blob = await response.blob()

    return await this.converBlobToBase64(blob) as string;
    }
  }

  converBlobToBase64 = (blob:Blob) => new Promise((resolve,reject) =>
    {const reader = new FileReader;
      reader.onerror  = reject;
      reader.onload = () =>{
        resolve(reader.result);
      };
      reader.readAsDataURL(blob)
    });

    public async loadFoto(){
      const listPhoto = await Storage.get({key:this.keyphoto});
      this.dataPhoto = JSON.parse(listPhoto.value) || [];
      if (!this.platform.is('hybrid')){
      for (let foto of this.dataPhoto)
      {
        const readFile  = await Filesystem.readFile({
          path : foto.filePath,
          directory : FilesystemDirectory.Data
        });
        foto.webViewPath = 'data:image/png;base64,${readFile.data}';
      }
    }
  }
}

export interface Photo{
filePath:string;
webViewPath : string;
dataImage : File;
}