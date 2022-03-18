import { test, expect } from '@playwright/test'
import { TodoPage } from '../models/TodoPage'
import { data } from '../utils/data'

let todoPage, page

test.describe('Smoke tests for TodoMVC', () => {
    test.beforeEach(async ({ browser }) => {
        page = await browser.newPage()
        todoPage = new TodoPage(page)
        await todoPage.goto()
    })

    test.afterEach(async () =>{
        page.close()
    })

    test.afterAll(async ({ browser }) => {
        browser.close()
    })

    test('User should be able to create a todo', async () => {
        await todoPage.createTodo(data.myFirstTodo)
        await expect(todoPage.findTodo(data.myFirstTodo), 'todo should be visible').toBeVisible()
        await expect(todoPage.todoCount, 'left todo count should be 1').toHaveText('1 item left')
        await expect(todoPage.todoListItems).toHaveCount(1)
    })

    test('User should be able to create multiple todos', async () => {
        await todoPage.createTodo(data.myFirstTodo)
        await todoPage.createTodo(data.mySecondTodo)
        await expect(todoPage.todoCount, 'left todo count should be 2').toHaveText('2 items left')
        await expect(todoPage.todoListItems).toHaveCount(2)
    })

    test('User should be able to delete a todo', async () => {
        await todoPage.createTodo(data.myFirstTodo)
        await todoPage.deleteTodo(data.myFirstTodo)
        await expect(todoPage.findTodo(data.myEditedTodo), 'todo should not be visible').not.toBeVisible()
    })

    test('User should be able to edit a todo', async () => {
        await todoPage.createTodo(data.myFirstTodo)
        await todoPage.editTodo(data.myFirstTodo, data.myEditedTodo)
        await expect(todoPage.findTodo(data.myEditedTodo), 'todo should be visible').toBeVisible()
    })

    test('User should be able to toggle todo as completed', async () => {
        await todoPage.createTodo(data.myCompletedTodo)
        await todoPage.toggleTodo(data.myCompletedTodo)
        await expect(todoPage.findTodo(data.myCompletedTodo), 'li should have proper css').toHaveClass('completed')
        await expect(todoPage.todoCount, 'left todo count should be 0').toHaveText('0 items left')
    })
    test('User should be able to toggle todo as incompleted', async () => {
        await todoPage.createTodo(data.myCompletedTodo)
        await todoPage.toggleTodo(data.myCompletedTodo)
        await todoPage.toggleTodo(data.myCompletedTodo)
        await expect(todoPage.findTodo(data.myCompletedTodo), 'li should have proper css').not.toHaveClass('completed')
        await expect(todoPage.todoCount, 'left todo count should be 1').toHaveText('1 item left')
    })
})