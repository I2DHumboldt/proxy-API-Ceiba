# proxy-API-Ceiba

Proxy user data access for the Ceiba's data-portal API. It includes a login app based on the list of users provided by the Ceiba's IPT.

Proxy para el control de acceso a la información para el API-Ceiba. Esta aplicación es un servicio web que usa *express* y provee un servicio básico de autenticación de usuarios basado en una lista de usuarios-contraseñas-roles del IPT de Ceiba.

## Setup
```
  git clone https://github.com/I2DHumboldt/proxy-API-Ceiba.git
  cd proxy-API-Ceiba
  npm install
  nmp start
 ```
 
## Run with pm2
 ```
  git clone https://github.com/I2DHumboldt/proxy-API-Ceiba.git
  cd proxy-API-Ceiba
  npm install
  pm2 run proxy-api-ceiba.json
  
 ```
 
## Configuración
 
 La configuración de la aplicación se encuentra en el archivo `src/config.json`. En este archivo se especifica el puerto en el cual debe correr el proxy-api-ceiba (`port`), el host del API que debe contactar (`api_server`), la página de login que debe mostrar la aplicación (`login`), la página sobre la que debe redireccionar una vez que se autentique (`login_redirect`) y la ruta al archivo con los datos para la autenticación (`login_users`).

Ejemplo: 

 ```
 {
  "port": 3000,
  "api_server": "http://localhost:5000",
  "login": "login.html",
  "login_redirect": "index.html",
  "login_users": "./data/users.xml"
}
```
