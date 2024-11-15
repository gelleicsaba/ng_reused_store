import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { AppStore } from '../../../store/app.store'
import { StateEventListener } from '../../../store/app.store'
import { aesKey } from '../../config/aesKey'

@Component({
  selector: 'app-comp1',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './comp1.component.html'
})
export class Comp1Component implements OnInit, OnDestroy {
  userName = ""

  constructor(
      private appStore: AppStore,
      private stateEvent :StateEventListener<any>
  ) {
    this.appStore.storeStateFromLocalStorage("app-state", aesKey, {"userName": ""})
    this.userName = this.appStore.getStateElement("userName", "")
    this.stateEvent.emit(null)
  }

  ngOnInit(): void {
  }

  setUserName(event: Event) {
    if(event) {
        this.appStore.setStateElement("userName", this.userName)
        this.appStore.storeStateToLocalStorage("app-state", aesKey)
        this.stateEvent.emit(null)
    }
  }

  ngOnDestroy(): void {
    console.log("OnDestroy")
  }

}
