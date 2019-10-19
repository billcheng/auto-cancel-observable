# Auto Cancel Observable
Automatically cancel subscription

# Install
```bash
npm i auto-cancel-observable
```
or
```bash
yarn auto-cancel-observable
```

# Example
```typescript
import { AutoCancelObservable } from 'auto-cancel-observable'

@AutoCancelObservable()
methodName(param1, param2) {
    return this.http.get(`${url}?param1=${param1}&param2=${param2}`)
}

...

this.methodName('X','Y')
    .subscribe(data => ...) // do something with the data
```

Invoking methodName multiple times will cancel the previous http calls and only the last or latest http data will be streamed to the subscription.