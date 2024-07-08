This is a project I built for a client to help Jet enthusiast customers rank and compare different features of commercial jets. I used the following tech stack for the project:

Frontend:
- React
- Typescript
- HTML
- Tailwind CSS
- TanStack Table for table framework

Backend:
- Prisma
- Next.js
- Next.js page router for REST endpoints
- MySQL

Below you'll find how to install the project, as well as an overview of the project, and insights into what could be improved in the future. The code itself is well documented with comments explaining areas of the codebase.

## Getting Started

First, set up your MySQL Database for Prisma. If you don't have a MySQL db, create one through the MySQL CLI or in MySQL Workshop.
1. In the .env file of the project, set the url field to your db connection URL.
ex: DATABASE_URL="mysql://johndoe:randompassword@localhost:3306/mydb"
The format is mysql://USER:PASSWORD@HOST:PORT/DATABASE
2. run
```bash
npx prisma migrate dev --name init
```
This will create the Jets table in your DB, and seed it with example jets for comparison using seed.ts under /prisma.
3. Add your OpenAI API key in jet-fullstack/src/pages/api/compare/index.ts, line 15 in the variable apiKey.


Second, run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Usage
On start, the page will load the main table with data from the 10 jets in the DB. The jets will be sorted descending based on their wingspan. Users can click the Wingspan header of the table to change the order to ascending, and again to show data as it is originally in the DB.

Users can select 3 options to compare Jets by: top speed, fuel efficiency, and maximum seating. After choosing an option in the drop-down selection, click "Compare Selected Jets". After a moment of ChatGPT generating rankings, the results will be displayed in the bottom table. The bottom table is not sorted by the frontend, and instead displays data as ChatGPT ranks it.

## Overview

Frontend

The frontend is located under /src/app/, mainly including page.tsx and results.tsx. I used the framework TanStack Table for all table-related functionality, as it provided a lightweight solution to providing scalable, readable code that provided features like row selection and sorting.

Tailwind is used to style the main page, using flexbox to provide a somewhat responsive interface. I aimed to emulate the design language of Jet.AI's main website in creating the page's UI elements.

Backend

The backend involves the use of Prisma, MySQL, and the Next.js page router for REST API routes, as well as ChatGPT for AI comparison of data.

There are 2 API routes, /compare and /jets. /jets is a GET request for retrieving all jet records from the db, returning them as a JSON for parsing in the frontend. /compare takes a JSON array of jet objects, as well as a string indicating which comparison function to use (top speed, fuel efficiency, or max seats). It generates a prompt for ChatGPT to return a JSON array as a string, and returns that string as part of a json response. The frontend then parses that string as a json for use in the results table.

Testing

This app was tested on Chrome, Firefox, and Safari web browsers, with all features working for each browser (Safari renders some UI differently though). Each aspect of the app was thoroughly manually tested as development progressed.

Known issues:
- Sometimes ChatGPT won't return a JSON object correctly formatted, and an error will appear in the bottom right. Try rerunning the comparison tool by clicking the compare button.
- The main page is responsive for desktop/laptop screens and tablets, but is not responsive for mobile devices

## Future Improvements

Ideally I'd want to implement these features as well to the comparison app:
- Third section where AI would go into detail on the differences between selected jets, and rationalize why it ranked jets as it did
- Select all checkbox in the top 10 table
- Loading indicator for showing that ChatGPT is generating results after clicking the compare button
- Research into improvements in prompt engineering for more accurate ranking results
- Further work on Tailwind CSS code for mobile responsive interface
- Unit tests for the backend

## Notes for the reviewer
Thank you for considering me for the Full Stack Developer position at Jet.AI. I hope this project serves to show my skills and ability to develop quality Full Stack projects. If you have any questions about the project, please don't hesitate to let me know.
