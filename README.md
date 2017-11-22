# Compas

Web application which allows local managers do flexible plannig for their subordinates, to create, evaluate and track plans of subordinates and help them with the achievment of their goals.

In [Documentation](https://github.com/mpenaz/compas/tree/master/documentation) section you can find UserStories, Entity Diagram, basic idea of system architecture, Use Case diagram and [Swagger](http://editor.swagger.io/#/) Rest Api documentation

[Ninjamock](https://ninjamock.com/s/VQBTZ) UX mockups of the client.

## Getting started
### Prerequisities
#### Rails application
1) Install Ruby >= 2.4.0
2) Install Rails >= 5.0.2

#### Angular application
1) Install node.js and npm

#### Keycloak
http://www.keycloak.org/downloads
1) Download and install keycloak

### Setup development environment

#### Rails application
To start rails application, install bundles, get most recent migration, seed database and start server

starts on: localhost:3000
```
bundle install
rails db:migrate
rake db:seed
rails s
```

#### Angular application
To start angular application, install npm modules, then start server

starts on: localhost:8091
```
npm start
```

#### Setup Keycloak
Keycloak is used for authentication into application

Run keycloak startup script
```
unix:
..pathToKeycloak/bin/standalone.sh
win:
..pathToKeycloak/bin/standalone.bat
```
default starts on: localhost:8080

import realm and user information from [keycloak/configuration](https://github.com/mpenaz/compas/tree/master/keycloak-configuration)

you can login with:
```
user: johnDoe
password: john

John Doe is manager of Josh, Villa, Adam

user: joshBrown
password: josh

user: villaSye
password: villa

user: adamNew
password: adam
```
