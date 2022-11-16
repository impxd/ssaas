import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core'
import { timer, take, pluck, map } from 'rxjs'
import { environment } from 'src/environments/environment'
import { HttpClient } from '@angular/common/http'
import { reactiveComponent } from 'src/app/shared/decorators/reactive-component'

interface HelloResponse {
  hello: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private readonly URL_BASE = environment.URL_BASE

  private readonly $rx = reactiveComponent(this)

  vm!: {
    hello?: string
  }

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const hello$ = this.http
      .get<HelloResponse>(this.URL_BASE)
      .pipe(pluck('hello'))

    this.vm = this.$rx.connect({
      hello: hello$,
    })
  }
}
