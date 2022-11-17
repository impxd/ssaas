import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpException,
} from '@nestjs/common'
import {
  timer,
  mapTo,
  delay,
  firstValueFrom,
  asyncScheduler,
  observeOn,
  of,
  take,
  map,
  catchError,
} from 'rxjs'
import { AppService } from './app.service'
import { getRandomInt, unique } from './utils'
import { bruteforce } from './app.core'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('secretsanta/find/:id')
  async secretSanta(@Param('id') id: string) {
    // simulate delay
    await firstValueFrom(timer(getRandomInt(100, 800)))

    const secretSanta = this.appService.find(+id)

    return secretSanta
  }

  @Post('secretsanta/create')
  async secretSantaCreate(@Body() requestData) {
    // simulate delay
    await firstValueFrom(timer(getRandomInt(100, 800)))

    // console.log('secretSantaCreate', requestData)

    // Validate input
    if (requestData.participants.length < 3)
      throw new HttpException('You need at least 3 participants', 400)

    if (!requestData.participants.every((participant) => participant.name))
      throw new HttpException('All participants need a name', 400)

    if (
      requestData.participants.length >
      unique(requestData.participants.map((participant) => participant.name))
        .length
    )
      throw new HttpException("Participants shouldn't be repeated", 400)

    return bruteforce(requestData).pipe(
      map((solution) => {
        // console.log('final solution', solution)

        requestData.participants = requestData.participants.map(
          (participant) => ({
            ...participant,
            to: solution.get(participant.name),
          })
        )

        const secretSanta = this.appService.create(requestData)

        return secretSanta
      }),
      catchError((error) => {
        throw new HttpException(error.message, 400)
      })
    )
  }

  @Post('secretsanta/update')
  async secretSantaUpdate(@Body() requestData) {
    // simulate delay
    await firstValueFrom(timer(getRandomInt(100, 800)))

    const id = requestData.id
    const secretSanta = this.appService.update(id, requestData)

    return secretSanta
  }

  @Get()
  getHello() {
    return {
      hello: 'hello world!',
    }
  }
}
