import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {ThanksService} from './thanks.service';

@Component({
  selector: 'app-thanks',
  templateUrl: './thanks.component.html',
  styleUrls: ['./thanks.component.css'],
  providers: [NzNotificationService]
})
export class ThanksComponent implements OnInit {
  user_id: string;
  code: string;
  final_movie: any;
  movie_flag: boolean = false;
  constructor(private notification: NzNotificationService,
              private thanks_service: ThanksService,
              private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.user_id = params['user_id'];
      var movie_links = params['movie_links'];
      if (movie_links.length == 1) {
        this.movie_flag = true;
        this.final_movie = movie_links[0];
      }
      else if (movie_links.length >= 2) {
        this.movie_flag = true;
        var rand = Math.floor(Math.random() * movie_links.length);
        this.final_movie = movie_links[rand];
      }
    });
  }

  movie(): void {
    this.thanks_service.postMovieLink({"user_id": this.user_id}).subscribe({
      next: data =>{}
    }); 
  }

  ngOnInit(): void {
    this.thanks_service.getDynamics().subscribe({
      next: data => {
        this.code = data['thankyou_code'];
      }
    })
  }
  copyText(){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.code;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.notification.create('success','Code Copied!','',{ nzDuration: 2000 });
  }

}
