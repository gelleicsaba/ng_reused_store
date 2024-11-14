import { Component, OnInit, OnDestroy } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { AppStore, StateEventListener } from '../store/app.store'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  userName = ""
  eventSubscription?: Subscription

  constructor(
    private appStore: AppStore,
    private stateEvent :StateEventListener<any>
  ) {

  }

  ngOnInit(): void {
    this.userName = this.appStore.state.getStateElement("userName", "")

    this.eventSubscription = this.stateEvent.subscribe((data?: any) => {
      this.userName = this.appStore.state.getStateElement("userName", "")
    } )

  }

  ngOnDestroy(): void {
    if (this.eventSubscription !== undefined) {
      this.eventSubscription.unsubscribe()
    }
  }


}
