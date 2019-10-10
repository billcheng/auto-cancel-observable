import { test } from 'jasmine-gherkin'
import { Subscription, Subject } from 'rxjs'
import * as binder from './bind-observable'
import { BindObservable } from './decorator-bind-observable'

class Test {

    subject = new Subject<number>()

    @BindObservable()
    observable() {
        return this.subject
    }
}

let testObj: Test
let array: number[]
let sub: Subscription

test('AC# BindObservable by method')
    .given('I have an observable', () => {
        testObj = new Test()
        array = []
    })
    .and('it has been bound with @BindObservable')
    .when('I subscribe to the observable', () => {
        spyOn(binder, 'bindObservable')
            .and
            .callThrough()

        sub = testObj.observable().subscribe(x => array.push(x))

        testObj.subject.next(123)
    }, () => {
        sub.unsubscribe()
    })
    .then('it should pass through "bindObservable"', () => {
        expect(binder.bindObservable).toHaveBeenCalled()
    })
    .then('it should stream 123 after binding', () => {
        expect(array).toEqual([123])
    })
    .run()
