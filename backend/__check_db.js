const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('CONNECTED');
    return mongoose.disconnect();
  })
  .catch((err) => {
    console.error('FAILED', err.message);
    process.exit(1);
  });
