import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ContactProvider } from './../../providers/contact/contact';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {
  title: string;
  form: FormGroup;
  contact: any;

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder, private provider: ContactProvider,
    private toast: ToastController) {

    // maneira 1
    //this.contact = this.navParams.data.contact || {}; //se veio um contact pega ele, senão veio cria um novo objeto 
    //this.createForm();
  
    // maneira 2
    this.contact = {};
    this.createForm();

    if (this.navParams.data.key) {
      const subcribe = this.provider.get(this.navParams.data.key)
        .subscribe((c: any) => {
          subcribe.unsubscribe();

          this.contact = c;
          this.createForm();
        })
    } 

    this.setupPageTitle();
}

  private setupPageTitle() {
    this.title = this.navParams.data.contact ? 'Alterando contato' : 'Novo contato';
  }

  createForm() {
    this.form = this.formBuilder.group({
      key: [this.contact.key],
      name: [this.contact.name, Validators.required],
      tel: [this.contact.tel, Validators.required],
    });
  }

  onSubmit() {
    if(this.form.valid) {
      this.provider.save(this.form.value)
      .then(() => {
        this.toast.create({ message: 'Contato salvo com sucesso.', duration: 3000}).present();
        this.navCtrl.pop();
     })
      .catch((e)=> {
        this.toast.create({ message: 'Erro ao salvar o sucesso.', duration: 3000}).present();
        console.error(e);
      })
    }
  }

}
