# NG-store-reused

# Intro
In this NG project I try to combine & reuse the mem storage, observable & local storage.
The example is very simple:

![example](https://raw.githubusercontent.com/gelleicsaba/ng_reused_store/refs/heads/main/public/screenshot1.png)

There are a main component and another component with specific route.\
There is a state where (to be a very simple) I have only one state value.\
Firstly, I want to load from local storage to the state (with eas encryption).\
Secondly I want to store the state in a memory storage.\
Finally I want to show the state in every component (in that case in main component)\
And I want to reuse the storage to read any value by key.

## read write & save
### Read state data from local storage, and apply in components
```
  constructor(
      private appStore: AppStore,
      private stateEvent :StateEventListener<any>
  ) {
    this.appStore.storeStateFromLocalStorage("app-state", aesKey, {"userName": ""})
    this.userName = this.appStore.getStateElement("userName", "")
    this.stateEvent.emit(null)
  }
```

### Write state data to mem storage, and apply in components
```
  setUserName(event: Event) {
    if(event) {
        this.appStore.setStateElement("userName", this.userName)
        this.stateEvent.emit(null)
    }
  }
```

### Save into local storage, in onDestroy event
```
  ngOnDestroy(): void {
    this.appStore.storeStateToLocalStorage("app-state", aesKey)
  }
```


## All in one in the store/app.store.ts

```
Storage classes:
   AppStore <-- Store <-- State

Listener generic class:
   StateEventListener<T>

```

### Listener component(s)

Subcription & dependencies
```
  eventSubscription?: Subscription

  constructor(
    private appStore: AppStore,
    private stateEvent :StateEventListener<any>
  ) {
    this.appStore.storeStateFromLocalStorage("app-state", aesKey, {"userName": ""})
    this.userName = this.appStore.getStateElement("userName", "")
  }
```

Subscribe & Unsubscribe
```
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
```

