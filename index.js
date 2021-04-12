const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const app = express();

// app.use(graphqlHTTP({

// }))


app.listen(8000, () => {
    console.log('https://localhost:8000');
})