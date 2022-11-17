import { Injectable } from '@nestjs/common'
import { SecretSanta } from '@shared/interfaces'

@Injectable()
export class AppService {
  private secretSantas: SecretSanta[] = []

  find(id: number) {
    return this.secretSantas.find((item) => item?.id)
  }

  create(requestData) {
    const secretSanta = {
      ...requestData,
      id: this.secretSantas.length + 1,
    }

    this.secretSantas.push(secretSanta)

    return secretSanta
  }

  update(id: number, requestData) {
    const secretSantaIndex = this.secretSantas.findIndex((item) => item?.id)

    this.secretSantas[secretSantaIndex] = {
      ...requestData,
    }

    return this.secretSantas[secretSantaIndex]
  }
}
