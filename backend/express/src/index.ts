import express from 'express';
import cpra from './routes/cpra.js';

/**
 * Minimal Express entry point that mounts the CPRA routes under `/api`.
 */
const app = express();
app.use(express.json());
app.use('/api', cpra);

app.listen(8080, () => console.log('Express on 8080'));