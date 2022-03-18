import { Page } from "@playwright/test"

export class TodoPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    get todoInputField() { return this.page.locator('input[placeholder="What needs to be done?"]') }
    
    get todoListItems () { return this.page.locator('ul.todo-list > li') }

    get todoCount () { return this.page.locator('.todo-count') }

    async goto() {
        await this.page.goto('https://todomvc.com/examples/typescript-react/')
    }

    findTodo(text: string) {
        return this.page.locator('li', { hasText: text })
    }

    async createTodo(text: string) {
        await this.todoInputField.click()
        await this.todoInputField.type(text)
        await this.page.keyboard.press('Enter')
    }

    async deleteTodo(text: string) {
        const todo = this.findTodo(text)
        const delTodo = todo.locator('button.destroy')
        await todo.hover()
        await delTodo.click()
    }

    async editTodo(text: string, newText: string) {
        const todo = this.findTodo(text)
        const label = todo.locator('label')
        await label.dblclick()
        const editLabel = todo.locator('.edit')
        await editLabel.fill('')
        await editLabel.type(newText)
        await editLabel.press('Enter')
    }
    
    async toggleTodo(text: string) {
        const todo = this.findTodo(text)
        const checkbox = todo.locator('input[type="checkbox"]')
        await checkbox.click()
    }
}