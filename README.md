# Client Gateway

## Dev

1. Clonar el repositorio
2. Instalar dependencias
3. Crear archivo `.env` basado en `env.template`
4. Levantar el servidor de NATS

```
docker run -d --name nats-main -p 4222:4222 -p 6222:6222 -p 8222:8222 nats
```

5. Tener levantados lo microservicios a construir
6. Ejecutar `npm run start:dev`

## Nats

```
docker run -d --name nats-main -p 4222:4222 -p 6222:6222 -p 8222:8222 nats
```

## Prod

Ejecutar

```
docker build -f dockerfile.prod -t client-gateway .
```
