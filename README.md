[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/twPj_hbU)
# YaDig: Review and Share your favourite Albums

YaDig is a social media application that allows users to connect through music taste

### How to run: 
#### in the back-end directory:
1. create a .env file:
```
APP_PORT=3030
DATABASE_URL={YOUR_POSGRES_URL}
JWT_EXPIRES_HOURS=6
JWT_SECRET=alsdjbqeiorbgq93g9o3yt2348t03utbv3-qtv1-034unt-29493t
```
2. run 
```
$ npm i
$ npx prisma generate
$ npx ts-node ./utils/seed.ts
$ npm start
```
#### in the front-end directory:
1. create a .env file:
```
NEXT_PUBLIC_API_URL=http://localhost:3030
NEXT_PUBLIC_LASTFM_API_KEY=78f1f6e5eaaf7d27216635ecedaaadc6
```
2. run 
```
$ npm i
$ npm start
```

### <Adam Benkhazzi> </Sadra Dezdar>
