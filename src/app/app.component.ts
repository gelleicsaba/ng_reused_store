import { Component, OnInit, OnDestroy } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { AppStore, StateEventListener } from '../store/app.store'
import { Subscription } from 'rxjs'
import { aesKey } from './config/aesKey'

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
    this.appStore.storeStateFromLocalStorage("app-state", aesKey, {"userName": ""})
    this.userName = this.appStore.getStateElement("userName", "")
  }

  ngOnInit(): void {
    this.userName = this.appStore.state.getStateElement("userName", "")
    this.eventSubscription = this.stateEvent.subscribe((data?: any) => {
      this.userName = this.appStore.state.getStateElement("userName", "")
    } )

  }

  ngOnDestroy(): void {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe()
    }
  }


}
