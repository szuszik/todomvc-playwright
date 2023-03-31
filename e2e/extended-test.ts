import { test as base } from '@playwright/test';
import { TodoPage } from './models/TodoPage';
import { todoList } from './utils/todoList';

type todoListKeys = keyof typeof todoList;

type MyFixtures = {
  todoPage: TodoPage;
  todoList: typeof todoList;
  todoArray: (typeof todoList)[todoListKeys][];
};

export const test = base.extend<MyFixtures>({
  todoPage: async ({ page }, use) => {
    await use(new TodoPage(page));
  },
  todoList: [todoList, { option: true }],
  todoArray: [[...Object.values(todoList)], { option: true }],
});
