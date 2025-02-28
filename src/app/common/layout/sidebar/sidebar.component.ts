import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  toggleSideMenu(){
    const element = document.getElementsByTagName('body')[0];
    if(element){
      if(element.classList.contains('side-bar-hide') ){
        element.classList.remove('side-bar-hide')
      }else{
        element.classList.add('side-bar-hide')

      }
    }
  }

}
