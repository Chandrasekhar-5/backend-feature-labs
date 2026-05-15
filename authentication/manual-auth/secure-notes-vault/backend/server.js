import app from './src/app.js';
import config from './config/config.js';

app.listen(config.PORT, () => {
    console.log('Server is runnning...');
});