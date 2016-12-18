/* eslint-disable no-console */

import express from 'express';

const app = express();
app.use(express.static('dist'));

app.listen(3000, () => console.log('Listening on port 3000'));
