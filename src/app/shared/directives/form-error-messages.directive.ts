import { DOCUMENT } from '@angular/common';
import { Attribute, Directive, ElementRef, Inject, Optional, Renderer2 } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appFormErrorMessages]',
  
})
export class FormErrorMessagesDirective {
  private errorElement: ElementRef;
  private textElement: any;
  private subscription: Subscription;
  private parentSubscription: Subscription;
  private dirty: boolean;
  private valid: boolean;
  private errorKey: string;
  private errorValue: any;
  private control: AbstractControl;
  constructor(@Attribute("name") private feildName:string,private el: ElementRef, @Optional() private ncontrol: NgControl, private renderer: Renderer2, @Inject(DOCUMENT) private document) {
  }

  ngAfterViewInit(){
      this.feildName = this.el.nativeElement.name?  this.el.nativeElement.name : this.el.nativeElement.id
      if (this.ncontrol && this.ncontrol.control) {
          this.control = this.ncontrol.control;
      } else {
          let p: any;
          p = this.ncontrol;
          this.control = (p as AbstractControl);
      }
      const oldValue = this.control.value;
      this.doupdate();
      if (this.control) {
          this.control.valueChanges.subscribe((value) => {
              // console.log(this.parentForm.get('question1').value);
              if (oldValue !== value && oldValue) {
                  this.renderer.setStyle(
                      this.el.nativeElement,
                      'font-weight',
                      'bold'
                  );
              } else if (oldValue === value && Object.values(this.el.nativeElement.style).includes('font-weight')) {
                  this.renderer.removeStyle(this.el.nativeElement, 'font-weight');
              }
          });
      }
  }

  ngOnInit(): void {
    this.feildName = this.el.nativeElement.name?  this.el.nativeElement.name : this.el.nativeElement.id
      if (this.ncontrol && this.ncontrol.control) {
          this.control = this.ncontrol.control;
      } else {
          let p: any;
          p = this.ncontrol;
          this.control = (p as AbstractControl);
      }
      const oldValue = this.control.value;
      this.doupdate();
      if (this.control) {
          this.control.valueChanges.subscribe((value) => {
              if (oldValue !== value && oldValue) {
                  this.renderer.setStyle(
                      this.el.nativeElement,
                      'font-weight',
                      'bold'
                  );
              } else if (oldValue === value && Object.values(this.el.nativeElement.style).includes('font-weight')) {
                  this.renderer.removeStyle(this.el.nativeElement, 'font-weight');
              }

              if (this.dirty !== this.control.dirty || this.valid !== this.control.valid) {
                this.dirty = this.control.dirty;
                this.valid = this.control.valid;
                this.errorKey = '';
                this.errorValue = null;
                this.updateErrorMessage();
            } else if (this.control.dirty && this.control.invalid && this.control.touched ) {
                const errors = this.control.errors;
                if (this.errorKey !== Object.keys(errors)[0] || this.errorValue !== errors[this.errorKey]) {
                    this.updateErrorMessage();
                    this.errorValue = errors[this.errorKey];
                }
            }
          });
      }
  }
  ngOnDestroy(): void {
      if (this.textElement) {
          this.renderer.removeChild(this.errorElement, this.textElement);
          this.textElement = null;
      }
      this.removeErrorElement();
      if (this.subscription) {
          this.subscription.unsubscribe();
          this.subscription = null;
      }
      if (this.parentSubscription) {
          this.parentSubscription.unsubscribe();
          this.parentSubscription = null;
      }
  }
  createErrorElement() {
    if (!this.errorElement) {
       const divelev= this.renderer.createElement("small");
       this.renderer.addClass(divelev, 'ng-tns-c138-3');

       const divelev2= this.renderer.createElement("div");
       this.renderer.appendChild(divelev,divelev2)

        const element = this.renderer.createElement('small');
        this.errorElement = element;
        this.renderer.addClass(element, 'p-error');
        this.renderer.addClass(element, 'text-danger');

        this.renderer.appendChild(divelev2,this.errorElement)
        const parentNode = this.renderer.parentNode(this.el.nativeElement.parentNode);
        const nextSibling = this.renderer.nextSibling(this.el.nativeElement);
       // if (nextSibling) {
         //   this.renderer.insertBefore(parentNode,divelev,nextSibling);
       // } else {
            this.renderer.appendChild(parentNode, divelev);
       // }
    } else {
        if (this.textElement) {
            this.renderer.removeChild(this.errorElement, this.textElement);
        }
    }
    this.textElement = null;
}
  removeErrorElement() {
      if (this.errorElement) {
          if (this.textElement) {
              this.renderer.removeChild(this.errorElement, this.textElement);
          }
          const parentNode = this.renderer.parentNode(this.el.nativeElement);
          this.renderer.removeChild(parentNode, this.errorElement);
          this.errorElement = null;
          this.textElement = null;
      }
  }
  updateErrorMessage() {
      let message = '';
      if (this.control.valid || !this.control.dirty) {
      } else {
          const errors = this.control.errors;
          if(!errors) return;
          this.errorKey = Object.keys(errors)[0];
          switch (Object.keys(errors)[0]) {
              case 'minlength':
                  message = `Required minimum length of ${errors.minlength.requiredLength} while it is ${errors.minlength.actualLength}`;
                  break;
              case 'maxlength':
                  message = `Field exceeds maximum length of ${errors.maxlength.requiredLength}.
                      It is ${errors.maxlength.actualLength}`;
                  break;
              case 'required':   
                    message = `${this.feildName} is required`;
                  break;
              case 'min':
                  message = `Field value should be more than ${errors.min.min}`;
                  break;
              case 'max':
                  message = `Field value should be less than ${errors.max.max}`;
                  break;
              case 'email':
                  message = `Field value should be a valid email`;
                  break;
              case 'enum':
                  message = `Field value should be one of ${errors.enum.values.join()}`;
                  break;
              case 'reserved_word':
                  message = `Field value cannot be a reserved word.`;
                  break;
              case 'pattern':
                  message = `Invalid ${this.feildName}`;
                  break;
              case 'duplicate':
                  message = errors.duplicate.message;
                  break;
              case 'not_found':
                  message = errors.not_found.message;
                  break;
              case 'MatchFields':
                  message = `Confirm password doesn't match password`;
                  break;

              case 'DatesFields':
                  message = `aaaa password doesn't match bbbbb`;
                  break;

              case 'Password':
                  message = 'Password is not strong enough';
                  break;

              default:
                  message = 'Unknown error ' + Object.keys(errors)[0];
          }
      }
      if (message) {
          this.createErrorElement();
          this.textElement = this.renderer.createText(message);
          this.renderer.appendChild(this.errorElement, this.textElement);
      } else {
          this.removeErrorElement();
      }
  }
  
  doupdate(): void {
      if (!this.control) {
          console.error('No control bound. appFormErrorMessages directive');
          return;
      }

      if (this.dirty !== this.control.dirty || this.valid !== this.control.valid) {
          this.dirty = this.control.dirty;
          this.valid = this.control.valid;
          this.errorKey = '';
          this.errorValue = null;
          this.updateErrorMessage();
      } else if (this.control.dirty && this.control.invalid && this.control.touched ) {
          const errors = this.control.errors;

          if (this.errorKey !== Object.keys(errors)[0] || this.errorValue !== errors[this.errorKey]) {
              this.updateErrorMessage();
              this.errorValue = errors[this.errorKey];
          }
      }
  }
}
