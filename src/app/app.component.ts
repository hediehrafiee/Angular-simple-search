import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { observable, Observable, Subject } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';
import { User } from './shared/interfaces/user-interface';
import { UsersService } from './shared/services/users/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public title = 'raadwin-test';
  public users: User[] = [];
  public usersClone: User[] = [];
  results$ = new Observable();
  subject = new Subject();

  constructor(
    public translate: TranslateService,
    private readonly usersService: UsersService
  ) {
    translate.addLangs(['en', 'fa']);
    translate.setDefaultLang('en');
  }

  public ngOnInit(): void {
    this.usersService.getUsers().subscribe((data: any): void => {
      this.users = data;
      this.usersClone = data;
    });

    (this.results$ = this.subject.pipe(debounceTime(1000))),
      map(map((event: any) => event.code));

    this.results$.subscribe((code) => {
      this.users = this.usersClone.filter((user: User) => {
        if (
          user.name
            .toLocaleLowerCase()
            .includes((code as string).toString().toLocaleLowerCase())
        ) {
          return user;
        } else {
          return null;
        }
      });
    });
  }

  search(evt: any) {
    const searchText = evt.target.value;
    if (searchText.length === 0) this.users = this.usersClone;

    this.subject.next(searchText);
  }
}
