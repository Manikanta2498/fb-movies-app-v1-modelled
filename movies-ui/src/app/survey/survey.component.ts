import { Component, NgZone, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, NavigationExtras, Params, Router } from '@angular/router';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzModalService } from 'ng-zorro-antd/modal';
import {SurveyService} from './survey.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

  deadline: any; 
  target_movie_count: number;         //Number of movies user is required to select
  load_button_text: string;
  isLoading: boolean = false;
  time_choice: boolean = true;        //Show milliseconds if true
  movies: any[];                      //Movies fetched from Backend
  titles: any[] = [];                 //Titles of movies fetched
  names: any[];                       //Names fetched from Backend
  faces: any[];                       //Faces fetched from Backend
  size: NzButtonSize = 'large';       //Submit button size
  isVisible: boolean = false;         //Review modal flag
  review_index: number;               //Which movie review is clicked
  review_heading: string;             //Heading when Read review is clicked
  movies_selected: any = {};          //Flag for add or remove 
  movies_count: number = 0;           //Count of how many movies are selected
  movies_order: any[] = [];           //Order in which movies are fetched
  movies_index: number = 0;           //From which index to fetch next 3 movies
  total_movies: number = 0;           //Total movies available in Database
  names_order: any[] = [];           //Order in which names are fetched
  names_index: number = 0;           //From which index to fetch next 3 names
  faces_index: number = 0;           //From which index to fetch next 3 faces
  total_names: number = 0;           //Total first names available in Database
  movies_reviewed: any = {};         //Number of times a movie review is read
  user_id: string;
  temp_rating: number = 9;
  images: any[] = [];                 //Images of faces fetched from Backend
  temp_img: any;
  img_fetched: boolean = false;

  review(i): void {
    if (this.movies_reviewed[i] != null) {
      this.movies_reviewed[i] = this.movies_reviewed[i]+1;
    }
    else{
      this.movies_reviewed[i] = 1;
    }
    this.isVisible = true;
    this.review_index = i;
    this.review_heading = this.names[this.review_index]['fname']+' '+this.names[this.review_index]['lname']+"'s review of "+this.movies[this.review_index]['title'];
  }
  add(i): void {
    if (this.movies_count == this.target_movie_count){
      const modal = this.modalService.warning({
        nzTitle: 'You have already selected '+this.target_movie_count+' movies, remove a selection or Submit',
        nzContent: ''
      });
    }
    else{
      this.movies_selected[i] = !this.movies_selected[i];
      this.movies_count++;
    }
  }
  remove(i): void {
    this.movies_selected[i] = !this.movies_selected[i];
    this.movies_count--;
  }

  handleOk(): void {
    this.isVisible = false;
  }
  
  constructor(private router: Router,
              private route: ActivatedRoute,
              private modalService: NzModalService,
              private surveyService: SurveyService,
              private sanitizer: DomSanitizer,
              private zone: NgZone) { 
    this.route.queryParams.subscribe(params => {
      this.user_id = params['user_id'];
      if (params['time_choice'] == "true"){
        this.time_choice = true;
      }
      else{ 
        this.time_choice = false;
      }
    });
  }

  timeup() {
    var survey_data: any = {};
      survey_data['user_id'] = this.user_id;
      survey_data['movie_data'] = this.movies.slice(0, this.movies_index);
      survey_data['movies_reviewed'] = this.movies_reviewed;
      survey_data['time_choice'] = this.time_choice;
      survey_data['name_data'] = this.names.slice(0, this.names_index);
      survey_data['movies_selected'] = this.movies_selected;
      var date = new Date();
      survey_data['timestamp'] = date.toISOString();
    this.surveyService.postSurveyData(survey_data).subscribe({
      next: data =>{}
    }); 
    var movie_links = [];
    for(var i in this.movies_selected){
      if (this.movies_selected[i] == true){
        movie_links.push(this.movies[parseInt(i)]['link']);
      }
    }
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "user_id":this.user_id,
        // "time_choice": this.time_choice,
        "movie_links": movie_links
      },
      skipLocationChange: true,
    };
    const modal = this.modalService.info({
      nzTitle: 'Time Up',
      nzContent: ''
    });
    this.zone.run(() => {
      this.router.navigate(['/feedback'],navigationExtras);
    });
  }

  movies_left: boolean = true;
  loadMore(){
    this.load_button_text = 'Loading'
    this.isLoading = true;
    // this.img_fetched = false;
    for (var movie in this.movies){
      this.titles.push(this.movies[movie]['title']);
    }
    var ind = this.movies_index;
    this.surveyService.getMovies(this.user_id).subscribe({
      next: data =>{
        if (data.length == 0){
          this.movies_left = false;
        }
        else{
          for(var i=0;i<3;i++){
            this.movies.push(data[i]);
           }
        }
      }
    }); 
    this.surveyService.getNames(this.user_id).subscribe({
      next: data =>{
       for(var i=0;i<3;i++){
        this.names.push(data[i]);
       }
       this.names_index += 3;
      //  this.surveyService.getFaces(this.user_id).subscribe({
      //   next: data =>{
      //     for(var i=0;i<3;i++){
      //       this.faces.push(data[i]);
      //     }
      //     this.fetchAll(this.names_index);
      //     this.names_index += 3;
      //     }
      //   }); 
      }
    }); 
    this.movies_index += 3;
    this.isLoading = false;
    this.load_button_text = 'Load More';
  }
  submit() {
    console.log(this.movies_selected);
    if (this.time_choice == true){
      // if (this.movies_count < 1){
      //   const modal = this.modalService.warning({
      //     nzTitle: 'You have not selected any movies, please select atleast 1 movie to Submit',
      //     nzContent: ''
      //   });
      // }
      if (this.movies_count < this.target_movie_count){
        const modal = this.modalService.warning({
          nzTitle: 'You have not selected '+this.target_movie_count+' movies, please select '+this.target_movie_count+' movies to Submit',
          nzContent: ''
        });
      }
      else{
        var survey_data: any = {};
        survey_data['user_id'] = this.user_id;
        survey_data['movie_data'] = this.movies.slice(0, this.movies_index);
        survey_data['movies_reviewed'] = this.movies_reviewed;
        survey_data['time_choice'] = this.time_choice;
        survey_data['name_data'] = this.names.slice(0, this.names_index);
        survey_data['movies_selected'] = this.movies_selected;
        var date = new Date();
        survey_data['timestamp'] = date.toISOString();
        this.surveyService.postSurveyData(survey_data).subscribe({
          next: data =>{}
        }); 
        var movie_links = [];
        for(var i in this.movies_selected){
            if (this.movies_selected[i] == true){
                movie_links.push(this.movies[parseInt(i)]['link']);
            }
        }
        let navigationExtras: NavigationExtras = {
          queryParams: {
            // "time_choice":this.time_choice,
            "user_id":this.user_id,
            "movie_links":movie_links,
          },
          skipLocationChange: true,
        };
        this.router.navigate(['/feedback'],navigationExtras);
      }
    }
    else{
      if (this.movies_count < this.target_movie_count){
        const modal = this.modalService.warning({
          nzTitle: 'You have not selected '+this.target_movie_count+' movies, please select '+this.target_movie_count+' movies to Submit',
          nzContent: ''
        });
      }
      else{
        var survey_data: any = {};
        survey_data['user_id'] = this.user_id;
        survey_data['movie_data'] = this.movies.slice(0, this.movies_index);
        survey_data['movies_reviewed'] = this.movies_reviewed;
        survey_data['time_choice'] = this.time_choice;
        survey_data['name_data'] = this.names.slice(0, this.names_index);
        survey_data['movies_selected'] = this.movies_selected;
        var date = new Date();
        survey_data['timestamp'] = date.toISOString();
        this.surveyService.postSurveyData(survey_data).subscribe({
          next: data =>{}
        }); 
        var movie_links = [];
        for(var i in this.movies_selected){
            if (this.movies_selected[i] == true){
                movie_links.push(this.movies[parseInt(i)]['link']);
            }
        }
        let navigationExtras: NavigationExtras = {
          queryParams: {
            // "time_choice":this.time_choice,
            "user_id":this.user_id,
            "movie_links":movie_links,
          },
          skipLocationChange: true,
        };
        this.router.navigate(['/feedback'],navigationExtras);
      }
    }
  }
  fetchImg(data) {
    const mediaType = 'application/image';
    const blob = new Blob([data], { type: mediaType });
    const unsafeImg = URL.createObjectURL(blob);
    return this.sanitizer.bypassSecurityTrustUrl(unsafeImg)
  }
  async fetchAll (ind){
    console.log(ind);
    for(var i = ind; i <ind+3; i++){
      var j = this.faces[i];
      var data = await this.surveyService.getImage(this.names[i]['fname']+','+j.toString());
      this.images[i] = this.fetchImg(data);
    }
    this.img_fetched = true;
  }
  ngOnInit(): void {
    this.surveyService.getDynamics().subscribe({
      next: data =>{
        if(this.time_choice) {
          this.deadline = Date.now() + 1000 * data['survey_time'] + 5000;
          this.load_button_text = data['load_more_time_1'];
        }
        else{
          this.deadline = Date.now() + 1000 * data['survey_time_2'] + 5000;
          this.load_button_text = data['load_more_time_2'];
        }
        this.target_movie_count = data['movies_select_count'];
      }
    }); 
    setTimeout(() => 
      {
        this.surveyService.getMovies(this.user_id).subscribe({
          next: data =>{
            this.movies = data;
            this.movies_index += 3;
            console.log(this.movies);
          }
        }); 
        this.surveyService.getNames(this.user_id).subscribe({
          next: data =>{
            this.names = data;
            this.names_index += 3;
            // this.surveyService.getFaces(this.user_id).subscribe({
            //   next: data =>{
            //     this.faces = data;
            //     this.fetchAll(0);
            //   }
            // }); 
          }
        }); 
      },
      5000);
  }
}
