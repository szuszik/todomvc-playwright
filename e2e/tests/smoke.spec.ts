import { expect } from '@playwright/test';
import { test } from '../extended-test';
import { data } from '../utils/data';

const todoArray = [data.myFirstTodo, data.mySecondTodo, data.myThirdTodo];

test.describe('TodoMVC tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/todomvc');
  });

  test('user should be able to create a todo', async ({ todoPage }) => {
    await todoPage.createTodo(data.myFirstTodo);
    await expect(todoPage.findTodo(data.myFirstTodo), 'todo should be visible').toBeVisible();
    await expect(todoPage.todoCount, 'left todo count should be 1').toHaveText('1 item left');
    await expect(todoPage.todoListItems).toHaveCount(1);
  });

  test('text field should be cleared after adding todo', async ({ todoPage }) => {
    await todoPage.createTodo(data.myFirstTodo);
    await expect(todoPage.todoInputField).toBeEmpty();
  });

  test('user should be able to create multiple todos', async ({ todoPage }) => {
    await todoPage.createMultipleTodos([data.myFirstTodo, data.mySecondTodo]);
    await expect(todoPage.todoCount, 'left todo count should be 2').toHaveText('2 items left');
    await expect(todoPage.todoListItems).toHaveCount(2);
  });

  test('user should be able to delete a todo', async ({ todoPage }) => {
    await todoPage.createMultipleTodos([data.myFirstTodo, data.mySecondTodo]);
    await todoPage.deleteTodo(data.myFirstTodo);
    await expect(todoPage.findTodo(data.myFirstTodo), 'todo should not be visible').not.toBeVisible();
  });

  test('user should be able to edit a todo', async ({ todoPage }) => {
    await todoPage.createTodo(data.myFirstTodo);
    await todoPage.editTodo(data.myFirstTodo, data.myEditedTodo);
    await expect(todoPage.findTodo(data.myEditedTodo), 'todo should be visible').toBeVisible();
  });

  test('user should be able to edit a todo with desired substring', async ({ todoPage }) => {
    const [todoValue, remainingTodo, todoEditedSubstring, expectedTodo] = [
      'My initial todo, nothing special.',
      'My initial todo',
      ', this part has been edited.',
      'My initial todo, this part has been edited.',
    ];

    await todoPage.createTodo(todoValue);
    await todoPage.editTodoWithSubstring(todoValue, remainingTodo, todoEditedSubstring);

    await expect(todoPage.todoListItems.nth(0)).toHaveText(expectedTodo);
  });

  test('user should be able to toggle todo as completed', async ({ todoPage }) => {
    await todoPage.createTodo(data.myCompletedTodo);
    await todoPage.toggleTodo(data.myCompletedTodo);
    await expect(todoPage.findTodo(data.myCompletedTodo), 'li should have proper css').toHaveClass('completed');
    await expect(todoPage.todoCount, 'left todo count should be 0').toHaveText('0 items left');
  });

  test('user should be able to toggle todo as incompleted', async ({ todoPage }) => {
    await todoPage.createTodo(data.myCompletedTodo);
    await todoPage.toggleTodo(data.myCompletedTodo);
    await todoPage.toggleTodo(data.myCompletedTodo);
    await expect(todoPage.findTodo(data.myCompletedTodo), 'li should have proper css').not.toHaveClass('completed');
    await expect(todoPage.todoCount, 'left todo count should be 1').toHaveText('1 item left');
  });

  test('user should be able to mark all todos as completed', async ({ todoPage }) => {
    await todoPage.createMultipleTodos(todoArray);
    await todoPage.markAllAsCompleted();

    for (const todo of await todoPage.todoListItems.all()) {
      await expect(todo).toHaveClass('completed');
    }
  });

  test('user should be able to mark all todos as incompleted', async ({ todoPage }) => {
    await todoPage.createMultipleTodos(todoArray);
    await todoPage.markAllAsCompleted(2);

    for (const todo of await todoPage.todoListItems.all()) {
      await expect(todo).not.toHaveClass('completed');
    }
  });

  test('filter "All" should be selected by default', async ({ todoPage }) => {
    await todoPage.createTodo(data.myFirstTodo);
    await expect(todoPage.allTodosFilter).toHaveClass('selected');
  });

  test('user should be able to filter todos by active todos', async ({ page, todoPage }) => {
    await todoPage.createMultipleTodos(todoArray);
    await todoPage.toggleTodo(todoArray[0]);
    await todoPage.filterTodoListByOption('Active');

    await expect.soft(todoPage.findTodo(todoArray[0]), 'first todo should not be visible').not.toBeVisible();
    await expect.soft(todoPage.activeTodosFilter).toHaveClass('selected');
    await expect.soft(todoPage.todoListItems).toHaveCount(2);
    await expect(page.url()).toContain('/active');
  });

  test('user should be able to filter todos by completed todos', async ({ page, todoPage }) => {
    await todoPage.createMultipleTodos(todoArray);
    await todoPage.toggleTodo(todoArray[0]);
    await todoPage.toggleTodo(todoArray[1]);
    await todoPage.filterTodoListByOption('Completed');

    await expect.soft(todoPage.findTodo(todoArray[2]), 'third todo should not be visible').not.toBeVisible();
    await expect.soft(todoPage.completedTodosFilter).toHaveClass('selected');
    await expect.soft(todoPage.todoListItems).toHaveCount(2);
    await expect(page.url()).toContain('/completed');
  });

  test('user should be able to clear completed todos by clicking "Clear completed" button', async ({ todoPage }) => {
    await todoPage.createMultipleTodos(todoArray);
    await todoPage.toggleMultipleTodos([todoArray[0], todoArray[1]]);

    await expect(todoPage.clearCompletedTodosButton).toBeVisible();
    await todoPage.clearCompletedTodos();

    await expect.soft(todoPage.findTodo(todoArray[0]), 'first todo should not be visible').not.toBeVisible();
    await expect.soft(todoPage.findTodo(todoArray[1]), 'second todo should not be visible').not.toBeVisible();
    await expect.soft(todoPage.todoListItems).toHaveCount(1);
  });
});
