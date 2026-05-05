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
}

class TodoList extends Component {
  constructor(state) {
    super();
    this.state = state;
  }

  onAddTask() {
    this.state.tasks.push(this.state.addInput);
    this.state.addInput = "";
  }

  onAddInputChange(value) {
    this.state.addInput = value;
  }

  render() {
    return createElement("div", { class: "todo-list" }, [
      createElement("h1", {}, "TODO List"),
      createElement("div", { class: "add-todo" }, [
        createElement(
          "input",
          {
            id: "new-todo",
            type: "text",
            placeholder: "Задание",
          },
          null,
          { input: (event) => this.onAddInputChange(event.target.value) },
        ),
        createElement("button", { id: "add-btn" }, "+", {
          click: () => this.onAddTask(),
        }),
      ]),
      createElement(
        "ul",
        { id: "todos" },
        this.state.tasks.map((task) =>
          createElement("li", {}, [
            createElement("input", { type: "checkbox" }),
            createElement("label", {}, task),
            createElement("button", {}, "🗑️"),
          ]),
        ),
      ),
    ]);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(
    new TodoList({
      addInput: "",
      tasks: ["Сделать домашку", "Сделать практику", "Пойти домой"],
    }).getDomNode(),
  );
});
