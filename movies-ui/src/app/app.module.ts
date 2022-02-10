import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';

import { NzMessageService } from 'ng-zorro-antd/message';
import { HomeComponent } from './home/home.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { InfoComponent } from './info/info.component';
import { ExitComponent } from './exit/exit.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { PreconnectComponent } from './preconnect/preconnect.component';
import { SurveyComponent } from './survey/survey.component';
import { ThanksComponent } from './thanks/thanks.component';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])
registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InfoComponent,
    ExitComponent,
    FeedbackComponent,
    PreconnectComponent,
    SurveyComponent,
    ThanksComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzLayoutModule,
    NzMenuModule,
    NzPageHeaderModule,
    NzCardModule,
    NzGridModule,
    NzButtonModule,
    NzIconModule,
    NzSpinModule,
    NzResultModule,
    NzFormModule,
    NzModalModule,
    NzStatisticModule,
    NzInputModule,
    NzSelectModule,
    NzTableModule,
    NzCheckboxModule,
    NzRateModule,
    NzPopconfirmModule,
    NzPopoverModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US },{ provide: NZ_ICONS, useValue: icons },NzMessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
