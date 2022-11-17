import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core'
import {
  Observable,
  timer,
  take,
  pluck,
  map,
  of,
  Subject,
  merge,
  pipe,
  filter,
  tap,
  repeatWhen,
  observeOn,
  asapScheduler,
  exhaustMap,
  mapTo,
  share,
  noop,
  catchError,
  switchMap,
  delay,
  retry,
  from,
} from 'rxjs'
import { environment } from 'src/environments/environment'
import { HttpClient } from '@angular/common/http'
import { reactiveComponent } from 'src/app/shared/decorators'
import { SecretSanta } from './../../../shared/interfaces'
import { Action, FormSubmitAction } from './app.interface'

const notNull = (val: unknown) => val != void 0

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  // Consts
  private readonly URL_BASE = environment.URL_BASE

  private readonly $rx = reactiveComponent(this)

  // Actions
  formEmitter = new Subject<Action>()

  instructions = [
    'List your participants',
    'Select gift restrictions',
    'Generate',
  ]

  vm!: {
    form: SecretSanta
    actions?: unknown
    formLoading?: boolean
    formError?: Error
    formSuccess?: boolean
  }

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Data fetching
    const form$ = merge(
      this.createForm(),
      this.formEmitter.pipe(
        filter((action) => action.type === 'reset'),
        switchMap(() => this.createForm())
      ),
      this.formEmitter.pipe(
        filter((action) => action.type === 'formdata:set'),
        pluck('form')
      ) as Observable<SecretSanta>
    )

    // UI
    const addParticipantAction$ = this.formEmitter.pipe(
      filter((action) => action.type === 'add:participant'),
      map(() => () => {
        this.vm.form.participants = [
          ...this.vm.form.participants,
          this.emptyParticipant(),
        ]
      })
    )

    // Form submit
    const formSubmitAction$ = this.formEmitter.pipe(
      filter((action) => action.type === 'submit')
    ) as Observable<FormSubmitAction>

    const request$ = formSubmitAction$.pipe(
      exhaustMap((action) =>
        this.submitForm(action).pipe(catchError((error) => of(error.error)))
      ),
      share()
    )

    const formLoading$ = merge(
      of(false).pipe(observeOn(asapScheduler)),
      formSubmitAction$.pipe(mapTo(true)),
      request$.pipe(mapTo(false))
    )

    const formData$ = merge(
      formSubmitAction$.pipe(mapTo(void 0)),
      request$.pipe(
        filter((requestData) => !requestData.message),
        // After request success
        tap((form) => this.formEmitter.next({ type: 'formdata:set', form }))
      )
    ).pipe(share())

    const formError$ = merge(
      formSubmitAction$.pipe(mapTo(void 0)),
      request$.pipe(
        filter((requestData) => requestData.message),
        // After request error
        tap(noop)
      )
    ).pipe(share())

    const formSuccess$ = formSubmitAction$.pipe(
      switchMap(() =>
        merge(
          of(void 0),
          formData$.pipe(filter(notNull), mapTo(true)),
          formData$.pipe(
            filter(notNull),
            delay(1800),
            // After success delay
            tap(noop),
            mapTo(void 0)
          ),
          formError$.pipe(filter(notNull), mapTo(false)),
          formError$.pipe(
            filter(notNull),
            // After error delay
            delay(1800),
            mapTo(void 0)
          )
        )
      )
    )

    // Actions
    const actions$ = merge(addParticipantAction$).pipe(
      tap((action: Function) => action())
    )

    this.vm = this.$rx.connect({
      form: form$,
      actions: actions$,
      formLoading: formLoading$,
      formError: formError$,
      formSuccess: formSuccess$,
    })
  }

  // API calls
  createForm() {
    return of(this.emptyForm()).pipe(observeOn(asapScheduler))
  }

  fetchForm(id: number) {
    return this.http.get<SecretSanta>(this.URL_BASE + 'secretsanta/find/' + id)
  }

  submitForm(action: FormSubmitAction) {
    // console.log(action.form)

    return this.http.post<SecretSanta>(
      this.URL_BASE + 'secretsanta/create',
      action.form
    )
  }

  // Model utils
  emptyParticipant() {
    return { name: '', excludes: [] }
  }

  emptyForm() {
    return {
      participants: [
        this.emptyParticipant(),
        this.emptyParticipant(),
        this.emptyParticipant(),
      ],
    }
  }

  // Utils
  log = console.log
}
