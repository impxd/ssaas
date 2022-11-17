import { SecretSanta } from '@shared/interfaces'
import { Observable, throwError } from 'rxjs'
import { getRandomInt } from './utils'

// Brute force algorithm that schedule work so we don't block the event loop
export const bruteforce = (
  secretSanta: SecretSanta
): Observable<Map<string, string>> => {
  return Observable.create((observer) => {
    let pending = secretSanta.participants.map(({ name }) => name)

    const possible = new Map(
      secretSanta.participants.map(({ name, excludes = [] }) => {
        const set = new Set(pending)

        set.delete(name)
        excludes.forEach((exclude) => set.delete(name))

        return [name, set]
      })
    )

    const solution = new Map()

    let id,
      maxExecutionTimes = 400
    const loop = () => {
      const [giver] = pending

      const receivers = possible.get(giver)

      if (receivers && receivers.size > 0) {
        const index =
          receivers.size === 1 ? 0 : getRandomInt(0, receivers.size - 1)
        const receiver = [...receivers][index]

        // console.log('loop', maxExecutionTimes, ' - ', index, giver, receiver)

        // Avoid circle reference
        if (
          solution.get(receiver) !== giver ||
          (solution.get(receiver) === giver && pending.length === 1)
        ) {
          solution.set(giver, receiver)

          // Remove giver & receiver
          possible.delete(giver)
          possible.forEach((set) => set.delete(receiver))
          pending.shift()
        }
      }

      // Loop until no pending participants or max execution times
      if (pending.length === 0) {
        observer.next(solution)
        observer.complete()
        return
      }

      if (maxExecutionTimes-- === 0) {
        observer.error(Error('This solution takes too much time!'))
        return
      }

      id = setImmediate(loop)
    }

    loop()

    return () => clearImmediate(id)
  })
}

// TODO: finish this algorithm
export const dreamAlgorithm = (secretSanta: SecretSanta) => {
  return throwError('pending algorithm :(')
}
