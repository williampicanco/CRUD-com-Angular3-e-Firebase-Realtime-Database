import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class ContactProvider {
  private PATH = 'contacts/';
  constructor(private db: AngularFireDatabase) { }

  getAll() {
    return this.db.list(this.PATH, ref => ref.orderByChild('name'))
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      })
  }

  get(key: string) {
    return this.db.object(this.PATH + key)
      .snapshotChanges()
      .map(c => {
        return { key: c.key, ...c.payload.val() };
      })
  }

  save(contact: any) {
    return new Promise((resolve, reject) => {
      //Se o obj. contant tem key, significa que ele tem alteração, senão é inclusão
      //maneira 1: atualizando pela lista, pelo Update
      if (contact.key){
        this.db.list(this.PATH)
          .update(contact.key, { name: contact.name, tel: contact.tel })
          .then(() => resolve())
          .catch((e) => reject(e));

        //maneira 2: seria acessando o objeto direto
        /*this.db.object(this.PATH + contact.key)
          .update({ name: contact.name, tel: contact.tel })
          .then(() => resolve())
          .catch((e) => reject(e));
        */

      } else {
        this.db.list(this.PATH)
          .push({ name: contact.name, tel: contact.tel })
          .then(() => resolve());
      }
    });
  }

  remove(key: string) {
    return this.db.list(this.PATH).remove(key);
  }

}
