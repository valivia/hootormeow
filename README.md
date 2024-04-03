## Running the app in prod

1. `npm i`

2. `npx prisma db push`

3. `docker compose build`

4. `docker compose up -d`

## Running the app in dev

1. `npm i`

2. `npx prisma db push`

3. `mkdir static/media`

4. make `.env` file with the desired content.

5. `npm run dev`

## notes 
Make sure to configure the **exact** redirect URI in the discord oauth panel as well.