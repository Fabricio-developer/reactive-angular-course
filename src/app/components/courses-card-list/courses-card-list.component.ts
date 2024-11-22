import { Component, EventEmitter, inject, Input, Output, output } from '@angular/core';
import { Course } from '../../model/course';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CourseDialogComponent } from '../../course-dialog/course-dialog.component';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'courses-card-list',
  standalone: false,
  templateUrl: './courses-card-list.component.html',
  styleUrl: './courses-card-list.component.scss'
})
export class CoursesCardListComponent {

  private dialog = inject(MatDialog);

  @Input()
  courses: Course[] = [];

  @Output()
  private coursesChanged = new EventEmitter();

  editCourse(course: Course) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";

    dialogConfig.data = course;

    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);

    dialogRef.afterClosed().pipe(
      filter(val => !!val),
      // Make side effects
      tap(() => this.coursesChanged.emit())
    ).subscribe()
  }
}
