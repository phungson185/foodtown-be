const express = require('express');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const blogRouter = require('./routes/blog');
const sponsorRouter = require('./routes/sponsor');
const cors = require('cors');
require('./db/mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({credentials: true, origin: 'http://localhost:3001'}));
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/blogs', blogRouter);
app.use('/sponsors', sponsorRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})