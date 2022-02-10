import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import {InfoService} from './info.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  user_id: string;
  dynamic_content: any;
  dynamic_instructions: any;
  selectedRace = null;
  validateForm!: FormGroup;
  instructions: boolean = false;
  time_choice: boolean;
  movie_links: any;

  constructor(private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private infoservice: InfoService) {
    this.route.queryParams.subscribe(params => {
      this.user_id = params['user_id'];
      // this.movie_links = params['movie_links'];
      this.dynamic_content = JSON.parse(params['dynamic_content']);
      if (params['time_choice'] == "true"){
        this.time_choice = true;
      }
      else{ 
        this.time_choice = false;
      }
    });
  }
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if(this.validateForm.valid){
      var date = new Date();
      this.validateForm.value['user_id'] = this.user_id;
      this.validateForm.value['time_choice'] = this.time_choice;
      var form = {'user_id': this.user_id,
                'time_choice': this.time_choice,
                'user_entry_time': new Date().toISOString()};
      this.infoservice.postInfo(form).subscribe({
        next: data =>{
          this.infoservice.postUserInfo(this.validateForm.value).subscribe({
            next: data =>{}
          }); 
        }
      });
      this.confirm();
    }
    else{
      console.log(this.validateForm.value);
    }
  }

  confirm(): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "user_id":this.user_id,
        // "movie_links":this.movie_links
        "time_choice": this.time_choice,
        "dynamic_content": JSON.stringify(this.dynamic_content)
      },
      skipLocationChange: true,
    };
    this.router.navigate(['/preconnect'],navigationExtras);
  }

  ageRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {

    if (control.value !== undefined && (isNaN(control.value) || control.value < 18 || control.value > 80)) {
        return { 'ageRange': true };
    }
    return null;
  }
  ngOnInit(): void {
    window.scroll(0,0);
    this.validateForm = this.fb.group({
      age: [null, [this.ageRangeValidator]],
      race: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      study: [null, [Validators.required]],
      frequency: [null, [Validators.required]],
      genre: [null, [Validators.required]]
    });
  }

}
