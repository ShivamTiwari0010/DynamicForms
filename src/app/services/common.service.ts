import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToasterService } from '../shared/toaster/toaster.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public isLoading = new BehaviorSubject(false);
  public alertCount = new BehaviorSubject(0);

  constructor(
    private readonly toasterService: ToasterService
    ) { }

  getSelectedValuesString(filters:any[], key:string = 'value') {
    const selectedValues = filters.reduce((result, filter) => {
      filter.list.forEach((item:any) => {
        if (item.isSelected) {
          result.push(item[key]);
        }
      });
      return result;
    }, []);

    return selectedValues.join(', ');
  }
}
