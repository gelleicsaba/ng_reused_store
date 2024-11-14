import { Injectable, Inject } from '@angular/core'
import { Observable, BehaviorSubject, Subscription } from 'rxjs'
import { EventEmitter } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import CryptoAES from 'crypto-js/aes'
import CryptoENC from 'crypto-js/enc-utf8'


/**
 * This is your state object class with your storage elements
 */
export class State {
  state: any

  constructor (@Inject(DOCUMENT) private document: Document) {
    this.state = {}
  }
  private localStorage () : Storage|undefined {
    return this.document.defaultView?.localStorage;
  }

  /**
   * Set state element by name
   * @param elementName
   * @param elementValue
   */
  public setStateElement(elementName: string, elementValue: any) {
    this.state[elementName] = elementValue
  }
  /**
   * Get state element by name
   * @param elementName
   * @returns
   */
  public getStateElement(elementName: string, defaultValue: any): any {
    const tmp = this.state[elementName]
    return tmp ? tmp : defaultValue
  }
  /**
   * Save the state object to local storage
   * @param localStorageName
   * @param aesKey
   */
  public storeStateToLocalStorage(localStorageName: string, aesKey: string) {
    const aesText = CryptoAES.encrypt(JSON.stringify(this.state), aesKey).toString()
    this.localStorage()?.setItem(localStorageName, aesText)

  }
  /**
   * Load into the state from local storage
   * If local storage does'nt exists, the specified defaultstate will be created
   * @param localStorageName
   * @param aesKey
   * @param initialState
   */
  public storeStateFromLocalStorage(localStorageName: string, aesKey: string, defaultState: any) {
    const aesText = this.localStorage()?.getItem(localStorageName)
    this.state = aesText ? JSON.parse( CryptoAES.decrypt(aesText, aesKey).toString(CryptoENC) ) : defaultState
  }
}

/**
 * This is the event listener class
 */
@Injectable({ providedIn: 'root'})
export class StateEventListener<T> {
    private listener = new EventEmitter<T>()

    constructor() {}

    public emit(data?: T) : void {
      this.listener.emit(data);
    }

    public subscribe(callback: Function) : Subscription {
        return this.listener.subscribe(callback)
    }
}

/**
 * This is an observable store generic class
 */
export class Store<T> {
  state$: Observable<T>
  private _state$: BehaviorSubject<T>

  protected constructor (initialState: T) {
      this._state$ = new BehaviorSubject(initialState)
      this.state$ = this._state$.asObservable()
  }

  get state (): T {
      return this._state$.getValue()
  }

  setState (nextState: T): void {
      this._state$.next(nextState)
  }
}

/**
 * This is the final observable store class with the state methods
 */
@Injectable({ providedIn: 'root'})
export class AppStore extends Store<State> {
    constructor(@Inject(DOCUMENT) private document: Document){
      super(new State(document))
    }

    setStateElement(elementName: string, elementValue: any): void {
      this.state.setStateElement(elementName, elementValue)
    }
    public getStateElement(elementName: string, defaultValue: any): any {
      return this.state.getStateElement(elementName, defaultValue)
    }
    public storeStateToLocalStorage(localStorageName: string, aesKey: string) {
      this.state.storeStateToLocalStorage(localStorageName, aesKey)
    }
    public storeStateFromLocalStorage(localStorageName: string, aesKey: string, defaultState: any) {
      this.state.storeStateFromLocalStorage(localStorageName, aesKey, defaultState)
    }
}
