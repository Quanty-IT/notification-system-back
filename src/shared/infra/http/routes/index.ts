import express from 'express';
import { routes } from './shared/infra/http/routes'; // caminho para o arquivo que você postou

const app = express();
app.use(express.json());

// Sem essa linha abaixo, o arquivo que você postou nunca é lido
app.use(routes);

app.listen(3000, () => console.log("Server is running!"));