import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import moment from "moment";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { CoursesService } from "../services/courses.service";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { CoursesStore } from "../services/course.store";

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
  providers: [LoadingService, MessagesService],
})
export class CourseDialogComponent implements AfterViewInit {
  protected form: FormGroup;
  protected course: Course;

  private messagesService = inject(MessagesService);
  private courseStore = inject(CoursesStore);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course
  ) {
    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required],
    });
  }

  ngAfterViewInit() {}

  save() {
    const changes = this.form.value;

    this.courseStore.saveCourse(this.course.id, changes).subscribe();

    this.dialogRef.close(changes);

    //     const changes = this.form.value;

    // const saveCourses$ = this.coursesService.saveCourse(this.course.id, changes).pipe(
    //   catchError((err)=> {
    //     const message = "Course not saved"
    //     this.messagesService.showErrors(message);
    //     return throwError(err);
    //   }

    //   )
    // )

    // this.loadingService.showLoaderUntilCompleted(saveCourses$).subscribe(
    //   (value) => this.dialogRef.close(value),
    //   error => throwError(error)
    // );
  }

  close() {
    this.dialogRef.close();
  }
}
