import { Observable, Subscription, Subject } from 'rxjs'

interface BoundData {
    subscription: Subscription
    fakeSubscription: Subject<any>
}

const observableMap = new Map<string, BoundData>()

export function bindObservable<T>(name: string, observable: Observable<T>): Observable<T> {

    const existing = observableMap.get(name)
    if (existing) {
        existing.subscription.unsubscribe()
        existing.fakeSubscription.complete()
    }

    const fs = new Subject<T>()
    const obj: BoundData = {
        subscription: observable.subscribe(data =>
            fs.next(data),
            e => {
                observableMap.delete(name)
                fs.error(e)
            },
            () => {
                observableMap.delete(name)
                fs.complete()
            }
        ),
        fakeSubscription: fs
    }
    observableMap.set(name, obj)

    return fs.asObservable()
}

export function unbindAllObservables() {
    observableMap.forEach(v => {
        v.subscription.unsubscribe()
        v.fakeSubscription.complete()
    })

    observableMap.clear()
}

export function unbindObservable(...names: string[]) {
    names.forEach(name => {
        const bound = observableMap.get(name)
        bound?.subscription.unsubscribe()
        bound?.fakeSubscription.complete()
        observableMap.delete(name)
    })
}

export function __getObservableNames() {
    return Array.from(observableMap.keys())
}