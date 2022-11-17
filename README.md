# Secret Santa as a Service

Secret Santa is a popular holiday tradition for a gift exchange within a group of people. Each person's name is written on a piece of paper and randomly selected one at a time by every person in the group to determine the recipient of their Secret Santa gift. However, physically drawing names is not always successful, since it is possible that a person could draw their own name or the name of their significant other.

## Repo
https://github.com/impxd/ssaas - https://ssaas.iamm.mp/

## Main Technologies

- Angular (The modern web developer's platform)
- RxJS (A reactive programming library for JavaScript)
- NestJs for Back-end

## Development enviroment

- Node.js (tested on v14.3.0)
- NPM
- Angular CLI
- Prettier (auto format on save)

## Folder structure

- `api`: Server with the API with CORS support
- `shared`: Shared code like Interfaces between front-end and the back-end
- `webclient`: The Front-end Angular app
- `webclient/src` 
  - `styles:` Global styles
    - `app/shared:` JS files that contain shared logic
  - `app/app.component.*:` Main App Component
  - `app/app.interface.*:` App Component Interfaces

## Endpoints
- [POST] `secretsanta/create`: Starts a Secret santa exchange model, returns error or a Secret Santa entity.

### See api README
### See webclient README
