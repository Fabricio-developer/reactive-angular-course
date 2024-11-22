import { Component, Inject, OnInit } from "@angular/core";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { Observable, throwError } from "rxjs";
import { catchError, finalize, map, tap } from "rxjs/operators";
import { CoursesService } from "../services/courses.service";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { CoursesStore } from "../services/course.store";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;

  constructor(
    private coursesStore: CoursesStore
  ) {}

  ngOnInit() {
    this.reloadCourses();
    // a complete example of retrying failed requests
    // courses$.pipe(
    //   tap(courses => console.log('Received courses:', courses)),
    //   retryWhen(err => interval(1000).pipe(
    //     take(5),
    //     map(() => err),
    //     tap(err => console.error('Error occurred:', err)),
    //     delay(1000),
    //     tap(() => console.log('Retrying...')),
    //     finalize(() => console.log('Retrying completed'))
    //   )),
    //   catchError(err => throwError(err)),
    //   map(courses => courses.sort(sortCoursesBySeqNo)),
    //   shareReplay(1)
    // ).subscribe(courses => {
    //   this.beginnerCourses = courses.filter(c => c.category === 'BEGINNER');
    //   this.advancedCourses = courses.filter(c => c.category === 'ADVANCED');
    // });
  }

  reloadCourses() {
    // this.loadingService.loadingOn();

    // const courses$ = this.coursesService.loadAllCourses().pipe(
    //   map((courses) => courses.sort(sortCoursesBySeqNo)),
    //   catchError((err) => {
    //     const  message = "Could not load courses";
    //     this.messagesService.showErrors(message);
    //     console.log("🚀 ~ HomeComponent ~ catchError ~ message, err:", message, err)
    //     return throwError(err);

    //   })
    // );

    this.beginnerCourses$ = this.coursesStore.filterByCategory("BEGINNER");

    this.advancedCourses$ = this.coursesStore.filterByCategory("ADVANCED");
  }
}
