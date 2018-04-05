# Participation Reports

### Dev
* For mac make sure xcode is installed, it is required for the brunch sass compiler
* npm install
* npm start
* dev server runs at http://localhost:3333/${baseUrl}/    *baseUrl found in deployConfig

### Prod
* npm run build

# Docker instructions

Assuming docker is installed from:

https://www.docker.com/community-edition

Build docker image within this directory with with:

```
docker build -t particpation-reports .
```

Run docker container with:

```
docker run  -p "80:3333" particpation-reports
```

Browse to:

[http://localhost/participationreports/](http://localhost/participationreports/)

