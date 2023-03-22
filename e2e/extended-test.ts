import { test as base } from '@playwright/test';
import { TodoPage } from './models/TodoPage';

type MyFixtures = {
  todoPage: TodoPage;
};

export const test = base.extend<MyFixtures>({
  todoPage: async ({ page }, use) => {
    await use(new TodoPage(page));
  },
});
