import { Component, OnInit } from '@angular/core';
import { v4 } from 'uuid';
import { DatabaseService } from '../database.service';
import { Todo } from '../todo';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {
  todos: Todo[] = [];

  constructor(private databaseService: DatabaseService) {
    this.update();
  }

  public add(title: string): void {
    this.databaseService.todos.add({
      done: false,
      title,
      id: v4()
    });
    this.update();
  }

  async update(): Promise<any> {
    this.todos = await this.databaseService.todos.toArray();
  }

  async sync(): Promise<any> {
    const todos = await this.databaseService.todos.toArray();
    const response = await fetch('http://localhost:3030/sync', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(todos)
    });
    const serverTodos: Todo[] = await response.json();
    serverTodos.forEach(todo => this.databaseService.todos.put(todo));
  }

  ngOnInit(): void {
  }

}
