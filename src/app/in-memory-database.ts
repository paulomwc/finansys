import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Category } from './pages/categories/shared/category.model';
import { Entry } from '../app/pages/entries/shared/entry.model';

export class InMemoryDatabase implements InMemoryDbService {
  createDb() {
    const categories: Category[] = [
      { id: 1, name: 'Moradia', description: 'Pagamentos de Contas da Casa' },
      { id: 2, name: 'Saúde', description: 'Plano de Saúde e Remédios' },
      { id: 3, name: 'Lazer', description: 'Cinema, parque, praia, etc' },
      { id: 4, name: 'Salário', description: 'Recebimento de Salário' },
      { id: 5, name: 'Freelas', description: 'Trabalhos como freelancer' }
    ];

    const entries: Entry[] = [
      {
        id: 1,
        name: 'Gas de Cozinha',
        categoryId: categories[0].id,
        category: categories[0],
        paid: true,
        date: '14/10/2018',
        amount: '70,00',
        type: 'expense',
        description: 'Conta de gas'
      } as Entry,
      {
        id: 2,
        name: 'Suplementos',
        categoryId: categories[1].id,
        category: categories[1],
        paid: false,
        date: '14/10/2018',
        amount: '15,00',
        type: 'expense',
        description: 'Whey'
      } as Entry,
      {
        id: 3,
        name: 'Uber',
        categoryId: categories[2].id,
        category: categories[2],
        paid: true,
        date: '23/05/2019',
        amount: '30,00',
        type: 'expense',
        description: 'Saidinha com a Tammy'
      } as Entry,
      {
        id: 4,
        name: 'Aluguel de filme',
        categoryId: categories[2].id,
        category: categories[2],
        paid: true,
        date: '14/10/2018',
        amount: '15,00',
        type: 'revenue',
        description: 'John Wick 3'
      } as Entry
    ];

    return { categories, entries };
  }
}
