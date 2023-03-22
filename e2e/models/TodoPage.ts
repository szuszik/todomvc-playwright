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
    return this.page.locator('ul.todo-list > li');
  }

  get todoCount(): Locator {
    return this.page.locator('.todo-count');
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

  findTodo(text: string): Locator {
    return this.page.locator('li', { hasText: text });
  }

  async createTodo(todoValue: string): Promise<void> {
    await this.todoInputField.click();
    await this.todoInputField.type(todoValue);
    await this.page.keyboard.press('Enter');
  }

  async deleteTodo(todoValue: string): Promise<void> {
    const todo = this.findTodo(todoValue);
    const deleteTodoButton = todo.locator('button.destroy');
    await todo.hover();
    await deleteTodoButton.click();
  }

  async editTodo(todoValue: string, newTodoValue: string): Promise<void> {
    const todo = this.findTodo(todoValue);
    const label = todo.locator('label');
    await label.dblclick();
    const editTodoLabel = todo.locator('.edit');
    await editTodoLabel.fill('');
    await editTodoLabel.type(newTodoValue);
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
    const todoCheckbox = todo.locator('input[type="checkbox"]');
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
}
