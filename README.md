# Fastco IV

Series of MERN Full-Stack Questionnaire.

## Part 1

- create collection through mongodb

## Part 2

- get user list api
- upload user profile with multer
- custom mongodb migration feature

## Part 3

- fetch data from jsonplaceholder
- custom validation

## Part 4

- csv-parser to read csv file
- create collection through mongodb

## Part 5

- typesafe frontend and backend end to end api call
- nextauth to handle user session

## Tech Stack

### Frontend

- Nextjs
- Typescript
- Tailwind css
- DaisyUI
- Mantine UI
- Trpc
- React query

### Backend

- express
- Typescript
- Mongodb

### Devops

- Docker
- Docker compose

## Installation

Use the env.example file in each parts in the package directory to know which variable is needed. Need to have docker to run mongodb images.

```bash
cp .env.example .env
```

```bash
docker-compose up -d
```

```bash
yarn dev:part_5
```

App runs by default at http://localhost:3000

## Helpers

Install lazydocker on your system. This tool can help visualise container logs.

## License

[MIT](https://choosealicense.com/licenses/mit/)
