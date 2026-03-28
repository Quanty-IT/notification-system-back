import { Router } from 'express';
import { TemplateController } from './template.controller';

const templateRouter = Router();
const templateController = new TemplateController();

// O navegador tenta acessar via GET, então esta rota deve existir:
templateRouter.get('/', (req, res) => templateController.listAll(req, res));
templateRouter.post('/', (req, res) => templateController.create(req, res));
templateRouter.get('/:id', (req, res) => templateController.findById(req, res));
templateRouter.put('/:id', (req, res) => templateController.update(req, res));
templateRouter.delete('/:id', (req, res) => templateController.delete(req, res));

export { templateRouter };