import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import {FeedbackService} from './feedback.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  tooltips = ['terrible', 'very bad', 'bad', 'normal', 'good', 'very good' ,'wonderful'];
  validateForm!: FormGroup;
  user_id: string;
  movie_links: any[];
  constructor(private fb: FormBuilder,
              private feedbackservice: FeedbackService,
              private router: Router,
              private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.user_id = params['user_id'];
      this.movie_links = params['movie_links'];
    });
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      var date = new Date();
      this.validateForm.value['user_id'] = this.user_id;
      this.validateForm.value['user_exit_time'] = date.toISOString();
      this.feedbackservice.postFeedbackData(this.validateForm.value).subscribe({
        next: data =>{}
      }); 
      console.log(this.validateForm.value);
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "user_id":this.user_id,
          "movie_links":this.movie_links,
        },
        skipLocationChange: true,
      };
      this.router.navigate(['/thanks'],navigationExtras);
    }
  }
  
  ngOnInit(): void {
    window.scroll(0,0);
    this.validateForm = this.fb.group({ 
      rate: [null, [Validators.required]],
      satisfied: [null, [Validators.required]],
      rely: [null, [Validators.required]],
      likely: [null, [Validators.required]],
      study: [null, [Validators.required]],
      share: [null, [Validators.required]]
    });
  }
}
