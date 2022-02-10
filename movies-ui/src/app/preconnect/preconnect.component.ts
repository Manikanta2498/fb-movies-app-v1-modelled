import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { InfoService } from '../info/info.service';
import { PreconnectService } from './preconnect.service';

@Component({
  selector: 'app-preconnect',
  templateUrl: './preconnect.component.html',
  styleUrls: ['./preconnect.component.css']
})
export class PreconnectComponent implements OnInit {

  dynamic_content: any;
  preconnect1: any;
  preconnect2: any;
  user_id: string;
  time_choice: boolean;
  instructions: boolean = true;
  dynamic_instructions: any;
  constructor(private router: Router,
            private route: ActivatedRoute,
            private preconnectService: PreconnectService) {
    this.route.queryParams.subscribe(params => {
      this.user_id = params['user_id'];
      if (params['time_choice'] == "true"){
        this.time_choice = true;
      }
      else{ 
        this.time_choice = false;
      }
      this.dynamic_content = JSON.parse(params['dynamic_content']);
      this.dynamic_instructions = this.dynamic_content['instructions'];
      this.preconnect1 = this.dynamic_content['preconnect1'];
      this.preconnect2 = this.dynamic_content['preconnect2'];
    });
  }

  instructions_done(): void {
    this.instructions = false;
  }
  confirm(): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "user_id":this.user_id,
        "time_choice":this.time_choice,
      },
      skipLocationChange: true,
    };
    this.router.navigate(['/survey'],navigationExtras);
  }

  ngOnInit(): void {
  }

}
