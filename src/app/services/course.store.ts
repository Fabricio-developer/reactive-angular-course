import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { CoursesService } from "./courses.service";
import { HttpClient } from "@angular/common/http";
import { MessagesService } from "../messages/messages.service";
import { LoadingService } from "../loading/loading.service";

@Injectable({
  providedIn: "root",
})
export class CoursesStore {
  private courseSubject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.courseSubject.asObservable();

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private messagesService: MessagesService
  ) {
    this.loadAllCourses();
  }

  private loadAllCourses() {
    const loadCourses$ = this.http.get<Course[]>("api/courses").pipe(
      map((res) => res["payload"]),
      shareReplay(),
      catchError((err) => {
        const message = "Could not load courses";
        this.messagesService.showErrors(message);
        return throwError(err);
      }),
      tap((courses) => this.courseSubject.next(courses))
    );

    this.loadingService.showLoaderUntilCompleted(loadCourses$).subscribe();
  }

  public saveCourse(
    courseId: string,
    changes: Partial<Course>
  ): Observable<any> {
    const courses = this.courseSubject.getValue();
    const index = courses.findIndex((c) => c.id === courseId);

    const newCourse: Course = {
      ...courses[index],
      ...changes,
    };

    const newCourses: Course[] = courses.slice(0);

    newCourses[index] = newCourse;

    this.courseSubject.next(newCourses);

    return this.http.put(`api/courses/${courseId}`, changes).pipe(
      shareReplay(),
      catchError((err) => {
        const message = "Course not saved";
        this.messagesService.showErrors(message);
        return throwError(err);
      })
    );
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map((courses) =>
        courses
          .filter((course) => course.category === category)
          .sort(sortCoursesBySeqNo)
      )
    );
  }
}
