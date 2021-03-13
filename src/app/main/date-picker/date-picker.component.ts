import { DatePipe, formatDate } from '@angular/common';
import { Component, EventEmitter, Inject, Injectable, Input, LOCALE_ID, OnInit, Output } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDateStruct, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
 @Injectable()
 export class CustomAdapter extends NgbDateAdapter<string> {
   readonly DELIMITER = '-';

   constructor(@Inject(LOCALE_ID) private locale: string) {
    super();
  }
 
   fromModel(value: string | null): NgbDateStruct | null {
     if (value) {
       let date = value.split(this.DELIMITER);
       return {
         day : parseInt(date[0], 10),
         month : parseInt(date[1], 10),
         year : parseInt(date[2], 10)
       };
     }
     return null;
   }
 
   toModel(date: NgbDateStruct | null): string | null {
     return date ? formatDate(new Date( date.year, date.month - 1,date.day), 'shortDate', this.locale) : null;
   }
 }
 
 /**
  * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
  */
 @Injectable()
 export class CustomDateParserFormatter extends NgbDateParserFormatter {
 
   readonly DELIMITER = '/';

   constructor(@Inject(LOCALE_ID) private locale: string) {
     super();
   }
 
   parse(value: string): NgbDateStruct | null {
     if (value) {
       let date = value.split(this.DELIMITER);
       return {
         day : parseInt(date[0], 10),
         month : parseInt(date[1], 10),
         year : parseInt(date[2], 10)
       };
     }
     return null;
   }
 
   format(date: NgbDateStruct | null): string {
    return date ? formatDate(new Date( date.year, date.month - 1,date.day), 'shortDate', this.locale) : null;
   }
 }
 

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class DatePickerComponent implements OnInit {
  @Input() dates: { from: Date; to: Date; };
  @Output() datesChange = new EventEmitter<{ from: Date; to: Date; }>();
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) { }

  ngOnInit() {
    console.log(this.dates);
    
    this.fromDate = new NgbDate(this.dates.from.getFullYear(),  this.dates.from.getMonth() + 1, this.dates.from.getDate());
    this.toDate = new NgbDate(this.dates.to.getFullYear(),  this.dates.to.getMonth() + 1, this.dates.to.getDate());
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && !date.before(this.fromDate)) {
      this.toDate = date;
      this.datesChange.emit({ 
        from: new Date(this.fromDate.year, this.fromDate.month -1, this.fromDate.day),
        to: new Date(this.toDate.year, this.toDate.month -1, this.toDate.day, 23, 59, 59),
      })
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
}
