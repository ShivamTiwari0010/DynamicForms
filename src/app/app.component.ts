import { Component } from '@angular/core';
import { ConfirmationService } from './shared/confirmation/confirmation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'testApp';

  constructor( 
    private readonly confService: ConfirmationService
  ){}


  showSuccess() {
    this.confService.open({
      title: 'warn Save',
      message: 'Are you sure you want to confirm this action?',
      actions: {
          confirm: {
              label: 'Yes',
              color: 'primary',
          },
          cancel: {
              label: 'No',
          },
      }
    }).then((result:any) =>{
      console.log(result)
    })
	}
}
