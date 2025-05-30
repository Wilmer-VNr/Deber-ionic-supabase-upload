// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { supabase } from 'src/app/supabase.client';
// import { CommonModule } from '@angular/common';
// import { IonicModule } from '@ionic/angular';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.page.html',
//   styleUrls: ['./home.page.scss'],
//   standalone: true,
//   imports: [CommonModule, IonicModule, FormsModule],  // <--- aquí va
// })
// export class HomePage implements OnInit {
//   user: any = null;
//   messages: any[] = [];
//   newMessage: string = '';

//   constructor(private router: Router) {}

//   async ngOnInit() {
//     const { data: { user } } = await supabase.auth.getUser();

//     if (!user) {
//       this.router.navigate(['/auth']);
//       return;
//     }

//     this.user = user;

//     await this.loadMessages();
//     this.listenForNewMessages();
//   }

//   async loadMessages() {
//     const { data, error } = await supabase
//       .from('messages')
//       .select('*')
//       .order('created_at', { ascending: true });

//     if (!error) {
//       this.messages = data || [];
//       this.scrollToBottom();
//     } else {
//       console.error(error);
//     }
//   }

//   listenForNewMessages() {
//     supabase
//       .channel('messages')
//       .on(
//         'postgres_changes',
//         { event: 'INSERT', schema: 'public', table: 'messages' },
//         (payload) => {
//           this.messages.push(payload.new);
//           this.scrollToBottom();
//         }
//       )
//       .subscribe();
//   }

//   async sendMessage() {
//     if (!this.newMessage.trim()) return;

//     const { error } = await supabase.from('messages').insert({
//       user_id: this.user.id,
//       user_email: this.user.email,
//       content: this.newMessage.trim()
//     });

//     if (error) {
//       console.error(error);
//     } else {
//       this.newMessage = '';
//     }
//   }

//   scrollToBottom() {
//     setTimeout(() => {
//       const content = document.querySelector('ion-content');
//       content?.scrollToBottom(300);
//     }, 100);
//   }

//   async logout() {
//     await supabase.auth.signOut();
//     this.router.navigate(['/auth']);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { supabase } from 'src/app/supabase.client';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
})
export class HomePage implements OnInit {
  user: any = null;
  messages: any[] = [];
  newMessage: string = '';

  constructor(private router: Router) {}

  async ngOnInit() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      this.router.navigate(['/auth']);
      return;
    }

    this.user = user;

    await this.loadMessages();
    this.listenForNewMessages();
  }

  async loadMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error) {
      this.messages = data || [];
      this.scrollToBottom();
    } else {
      console.error(error);
    }
  }

  listenForNewMessages() {
    supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          this.messages.push(payload.new);
          this.scrollToBottom();
        }
      )
      .subscribe();
  }

  async sendMessage() {
    if (!this.newMessage.trim()) return;

    const { error } = await supabase.from('messages').insert({
      user_id: this.user.id,
      user_email: this.user.email,
      content: this.newMessage.trim()
    });

    if (error) {
      console.error(error);
    } else {
      this.newMessage = '';
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      const content = document.querySelector('ion-content');
      content?.scrollToBottom(300);
    }, 100);
  }

  async logout() {
    await supabase.auth.signOut();
    this.router.navigate(['/auth']);
  }

  async uploadFile(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const filePath = `${this.user.email}/${Date.now()}_${file.name}`;


    const { data, error } = await supabase.storage
      .from('uploads') // Asegúrate de que este bucket exista
      .upload(filePath, file);

    if (error) {
      console.error('Error al subir archivo:', error.message);
    } else {
      console.log('Archivo subido con éxito:', data);

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      console.log('URL pública del archivo:', urlData.publicUrl);
    }
  }
}
