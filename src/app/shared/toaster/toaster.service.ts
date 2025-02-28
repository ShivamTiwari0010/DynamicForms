import { Injectable, TemplateRef } from '@angular/core';
export enum classColor  {
	success = 'success',
	error = 'error',
	warn = 'warn',
	info = 'info'
}

@Injectable({
  providedIn: 'root'
})

export class ToasterService {
  toasts: any[] = [];

  constructor() { }

  	showToaster(className:any, textOrTpl: string | TemplateRef<any>){
		const myClass = className === classColor.success ? 'bg-success' : className === classColor.error ?  'bg-danger' : className === classColor.warn ? 'bg-warning' : className === classColor.info ? 'bg-info' : 'bg-light'  
		const options:any = {classname: myClass}
			this.show(textOrTpl,options);

	}


	show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
		this.toasts.push({ textOrTpl, ...options });
	}

	remove(toast: any) {
		this.toasts = this.toasts.filter((t) => t !== toast);
	}

	clear() {
		this.toasts.splice(0, this.toasts.length);
	}
}
