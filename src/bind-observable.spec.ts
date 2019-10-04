import { test } from 'jasmine-gherkin'
import { bindObservable, unbindAllObservables, unbindObservable, __getObservableNames } from './bind-observable'
import { Subject, Subscription } from 'rxjs'

describe('bind-observable', () => {

    let sub: Subject<number>
    let sub0: Subject<number>
    let numbers: number[]
    let bindResult: Subscription
    let bindResult0: Subscription
    let error: any
    let complete: boolean
    let result: any

    beforeEach(() => {
        unbindAllObservables()
        sub = new Subject<number>()
        sub0 = new Subject<number>()
        numbers = []
        error = null
        complete = false
        result = null
    })

    const completeFunc = () => complete = true

    function bindToASubject(name: string, subject: Subject<number>, completeFn: ((() => void) | null) = completeFunc) {
        return bindObservable(name, subject)
            .subscribe(
                p => numbers.push(p),
                e => error = e,
                () => {
                    if (completeFn)
                        completeFn()
                }
            )
    }

    test('AC#1 Subscribe to the observable')
        .given('I have never bound any observable')
        .and('I bind an observable', () => {
            bindResult = bindToASubject('a', sub)
        }, () => {
            bindResult.unsubscribe()
        })
        .when('the observable streams values', () => {
            sub.next(10)
            sub.next(20)
            sub.complete()
        })
        .then('it should get the same values', () => {
            expect(numbers).toEqual([10, 20])
        })
        .then('it should register that it has completed', () => {
            expect(complete).toBeTruthy()
        })
        .when('the observable error out', () => {
            sub.error('error')
        })
        .then('it should register an error', () => {
            expect(error).toEqual('error')
        })
        .then('it shouldn`t capture any stream', () => {
            expect(numbers).toEqual([])
        })
        .then('it shouldn`t register a complete', () => {
            expect(complete).toBeFalsy()
        })
        .run()


    test('AC#2 Subscribe to the new observable')
        .given('I already have bound an observable', () => {
            bindResult0 = bindToASubject('a', sub0, null)
        }, () => {
            bindResult0.unsubscribe()
        })
        .and('I bind a new observable', () => {
            bindResult = bindToASubject('a', sub)
        }, () => {
            bindResult.unsubscribe()
        })
        .when('the new observable streams values', () => {
            sub0.next(5)
            sub.next(10)
            sub0.next(15)
            sub.next(20)
            sub0.complete()
        })
        .then('it should get the same values', () => {
            expect(numbers).toEqual([10, 20])
        })
        .then('it should register that it is not complete', () => {
            expect(complete).toBeFalsy()
        })
        .run()

    test('AC#3 Unsubscribe based on names')
        .given('I already have some observable bound', () => {
            bindResult = bindToASubject('a', sub)
            bindResult0 = bindToASubject('b', sub0)
        }, () => {
            bindResult.unsubscribe()
            bindResult0.unsubscribe()
        })
        .when('I unbind "a" and "b"', () => {
            try {
                unbindObservable('a', 'b')
            } catch (e) {
                result = e
            }
        })
        .then('it should unsubscribe from "a" and "b"', () => {
            expect(__getObservableNames()).toEqual([])
        })
        .then('it should not error out', () => {
            expect(result).toBeNull()
        })
        .run()

})