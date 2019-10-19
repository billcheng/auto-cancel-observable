import { bindObservable } from './bind-observable'

export function AutoCancelObservable(presetBindName?: string): MethodDecorator {
    return function (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
        const functionName = presetBindName ?? propertyKey.toString()
        const original = descriptor.value
        descriptor.value = function () {
            return bindObservable(functionName, original.apply(this, arguments))
        }

        return descriptor
    }
}
