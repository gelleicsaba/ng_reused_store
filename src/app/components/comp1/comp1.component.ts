import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { AppStore } from '../../../store/app.store'
import { StateEventListener } from '../../../store/app.store'
import { stat } from 'fs';

const aesKey = "abc123"

@Component({
  selector: 'app-comp1',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './comp1.component.html'
})
export class Comp1Component implements OnInit {
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

  setMessage(event: Event) {
    console.log("setMessage")
    if(event) {
        this.appStore.setStateElement("userName", this.userName)
        this.appStore.storeStateToLocalStorage("app-state", aesKey)
        this.stateEvent.emit(null)
    }
  }

}
