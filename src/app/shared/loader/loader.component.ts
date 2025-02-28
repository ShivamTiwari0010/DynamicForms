import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  isLoading: Subject<boolean> = this.commomService.isLoading;

  constructor(private readonly commomService: CommonService ){

  }

}
