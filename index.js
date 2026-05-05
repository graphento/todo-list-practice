function createElement(tag, attributes, children, callbacks) {
  const element = document.createElement(tag);

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key]);
    });
  }

  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      }
    });
  } else if (typeof children === "string") {
    element.appendChild(document.createTextNode(children));
  } else if (children instanceof HTMLElement) {
    element.appendChild(children);
  }

  if (callbacks) {
    for (const [event, callback] of Object.entries(callbacks)) {
      element.addEventListener(event, callback);
    }
  }

  return element;
}

class Component {
  constructor() {}

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }

  update() {
    const node = this.render();
    this._domNode.replaceWith(node);
    this._domNode = node;
  }
}

class AddTask extends Component {
  constructor(state, onAddTask, onAddInputChange) {
    super();
    this.state = state;
    this._onAddTask = onAddTask;
    this._onAddInputChange = onAddInputChange;
  }

  render() {
    return createElement("div", { class: "add-todo" }, [
      createElement(
        "input",
        {
          id: "new-todo",
          type: "text",
          placeholder: "Задание",
          value: this.state.input,
        },
        null,
        { input: (event) => this._onAddInputChange(event.target.value) },
      ),
      createElement("button", { id: "add-btn" }, "+", {
        click: () => this._onAddTask(),
      }),
    ]);
  }
}

class Task extends Component {
  constructor(state, onToggleTask, onDeleteTask) {
    super();
    this.state = state;
    this._onToggleTask = onToggleTask;
    this._onDeleteTask = onDeleteTask;
  }

  onDeleteTask() {
    if (this.state.wannaDelete) {
      this.state.wannaDelete = false;
      this._onDeleteTask();
    } else {
      this.state.wannaDelete = true;
      setTimeout(() => {
        if (this.state.wannaDelete) {
          this.state.wannaDelete = false;
          this.update();
        }
      }, 1000);
      this.update();
    }
  }

  render() {
    return createElement("li", {}, [
      createElement(
        "input",
        { type: "checkbox", ...(this.state.checked && { checked: true }) },
        null,
        {
          change: (event) => this._onToggleTask(event.target.checked),
        },
      ),
      createElement("label", {}, this.state.label),
      createElement(
        "button",
        {
          class: this.state.wannaDelete ? "wanna-delete" : "",
        },
        "🗑️",
        {
          click: () => this.onDeleteTask(),
        },
      ),
    ]);
  }
}

class TodoList extends Component {
  constructor(state) {
    super();
    this.state = state;
  }

  onAddTask() {
    this.state.tasks.push(this.state.addInput);
    this.state.addInput = "";
    this.update();
  }

  onAddInputChange(value) {
    this.state.addInput = value;
  }

  onToggleTask(index, value) {
    this.state.tasks[index].checked = value;
    this.update();
  }

  onDeleteTask(index) {
    this.state.tasks.splice(index, 1);
    this.update();
  }

  render() {
    return createElement("div", { class: "todo-list" }, [
      createElement("h1", {}, "TODO List"),
      new AddTask(
        {
          input: this.state.addInput,
        },
        () => this.onAddTask(),
        (value) => this.onAddInputChange(value),
      ).getDomNode(),
      createElement(
        "ul",
        { id: "todos" },
        this.state.tasks.map((task, index) =>
          new Task(
            { label: task.label, checked: task.checked },
            (checked) => this.onToggleTask(index, checked),
            () => this.onDeleteTask(index),
          ).getDomNode(),
        ),
      ),
    ]);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(
    new TodoList({
      addInput: "",
      tasks: [
        {
          label: "Сделать домашку",
          checked: true,
        },
        {
          label: "Сделать практику",
          checked: false,
        },
        {
          label: "Пойти домой",
          checked: false,
        },
      ],
    }).getDomNode(),
  );
});
