import { Page } from '@playwright/test';
import { PageModel } from './PageModel';
import { Locator } from 'playwright';

export class TodoPage extends PageModel {
  constructor(page: Page) {
    super(page);
  }

  get todoInputField(): Locator {
    return this.page.getByPlaceholder('What needs to be done?');
  }

  get todoListItems(): Locator {
    return this.page.getByTestId('todo-item');
  }

  get todoCount(): Locator {
    return this.page.getByTestId('todo-count');
  }

  get allTodosFilter(): Locator {
    return this.page.getByRole('link', { name: 'All' });
  }

  get activeTodosFilter(): Locator {
    return this.page.getByRole('link', { name: 'Active' });
  }

  get completedTodosFilter(): Locator {
    return this.page.getByRole('link', { name: 'Completed' });
  }

  get clearCompletedTodosButton(): Locator {
    return this.page.getByRole('button', { name: 'Clear completed' });
  }

  get markAllAsCompletedButton(): Locator {
    return this.page.getByLabel('Mark all as complete');
  }

  get deleteTodoButton(): Locator {
    return this.page.getByRole('button', { name: 'Delete' });
  }

  findTodo(text: string): Locator {
    return this.page.getByTestId('todo-item').filter({ hasText: text });
  }

  async createTodo(todoValue: string): Promise<void> {
    await this.todoInputField.click();
    await this.todoInputField.type(todoValue);
    await this.page.keyboard.press('Enter');
  }

  async deleteTodo(todoValue: string): Promise<void> {
    const todo = this.findTodo(todoValue);

    await todo.hover({ noWaitAfter: false });
    await this.deleteTodoButton.click();
  }

  async editTodo(todoValue: string, newTodoValue: string): Promise<void> {
    const todo = this.findTodo(todoValue);
    await todo.dblclick();
    const editTodoLabel = todo.getByLabel('Edit');
    await editTodoLabel.fill('');
    await editTodoLabel.type(newTodoValue);
    await editTodoLabel.press('Enter');
  }

  async editTodoWithSubstring(todoValue: string, remainingTodo: string, todoValueNewSubstring: string = '') {
    const todo = this.findTodo(todoValue);
    await todo.dblclick();
    const editTodoLabel = todo.getByLabel('Edit');

    do {
      await editTodoLabel.press('Backspace');
    } while ((await editTodoLabel.inputValue()) !== remainingTodo);

    await editTodoLabel.type(todoValueNewSubstring);
    await editTodoLabel.press('Enter');
  }

  async createMultipleTodos(todoList: string[]): Promise<void> {
    for (const todoValue of todoList) {
      await this.createTodo(todoValue);
    }
  }

  async toggleMultipleTodos(todoList: string[]): Promise<void> {
    for (const todoValue of todoList) {
      await this.toggleTodo(todoValue);
    }
  }

  async toggleTodo(todoValue: string): Promise<void> {
    const todo = this.findTodo(todoValue);
    const todoCheckbox = todo.getByRole('checkbox', { name: 'Toggle Todo' });
    await todoCheckbox.click();
  }

  async filterTodoListByOption(option: 'All' | 'Completed' | 'Active'): Promise<void> {
    const filters: Map<typeof option, Locator> = new Map([
      ['All', this.allTodosFilter],
      ['Completed', this.completedTodosFilter],
      ['Active', this.activeTodosFilter],
    ]);

    const selectedFilter = filters.get(option);

    await selectedFilter!.click();
  }

  async clearCompletedTodos(): Promise<void> {
    await this.clearCompletedTodosButton.click();
  }

  async markAllAsCompleted(clickCount?: number): Promise<void> {
    await this.markAllAsCompletedButton.click({
      clickCount: clickCount ? clickCount : 1,
    });
  }
}
