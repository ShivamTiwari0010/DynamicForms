import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ConfirmationConfig } from './confirmation.types';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private readonly _defaultConfig: ConfirmationConfig = {
    title: 'Confirm action',
    message: 'Are you sure you want to confirm this action?',
    backdrop: false,
    size:'',
    icon: {
      show: true,
      name: 'icons-solid:exclamation',
      color: 'warn',
    },
    actions: {
      confirm: {
        show: true,
        label: 'Confirm',
        color: 'warn',
      },
      showNext: {
        show: false,
        label: 'Confirm',
        color: 'warn',
      },
      cancel: {
        show: true,
        label: 'Cancel',
      },
    },
    dismissible: true,
  };

  private readonly modalOptions: NgbModalOptions = {
    backdrop: 'static',
    centered: true,
    keyboard:true,
    scrollable:false,
    fullscreen:'',
    size:'',
    windowClass:'',
    modalDialogClass:'',
    backdropClass:''
  }



  constructor(private readonly modalService: NgbModal) { }

  open(config: ConfirmationConfig = {}, options?: NgbModalOptions):Promise<string> {
    return new Promise((resolve, reject) => {

    const _defaultConfig = this._defaultConfig;

    const mergedConfig = {
      ..._defaultConfig,
      ...config,
      icon: {
        ..._defaultConfig.icon,
        ...config.icon,
      },
      actions: {
        ..._defaultConfig.actions,
        ...config.actions,
        confirm: { ..._defaultConfig.actions?.confirm, ...config.actions?.confirm },
        showNext: { ..._defaultConfig.actions?.showNext, ...config.actions?.showNext },
        cancel: { ..._defaultConfig.actions?.cancel, ...config.actions?.cancel },
      },
      dismissible: config.dismissible ?? _defaultConfig.dismissible,
    };


    this.modalOptions.backdrop = mergedConfig.dismissible;
    this.modalOptions.keyboard = mergedConfig.dismissible;
    this.modalOptions.size = mergedConfig.size;
    this.modalOptions.backdrop = mergedConfig.dismissible ? 'static' : false;


		const modalRef = this.modalService.open(ConfirmationDialogComponent,this.modalOptions);
    modalRef.componentInstance.data =  mergedConfig;
    modalRef.result.then((result) => {
      resolve(result);
      }).catch((error) => {
        resolve('cancelled');
      });
	}
    )};
}
