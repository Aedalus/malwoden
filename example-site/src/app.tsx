import React from "react";

import HelloWorld from "./examples/hello-world";
import BasicWorld from "./examples/basic-world";
import CellGeneration from "./examples/basic-generation";
import FOV from "./examples/fov";
import { Example } from "./example";

const examples = [
  { name: "Hello World", ex: new HelloWorld() },
  { name: "Basic World", ex: new BasicWorld() },
  { name: "Generation", ex: new CellGeneration() },
  { name: "FOV", ex: new FOV() },
];

function App() {
  function mountNewExample(example: Example) {
    const previous = document.querySelectorAll("canvas");
    previous.forEach((x) => {
      if (x.parentElement) {
        x.parentElement.removeChild(x);
      }
    });
    example.Run();
  }
  return (
    <div className="App">
      <header className="App-header">
        {examples.map((x) => (
          <button onClick={() => mountNewExample(x.ex)}>{x.name}</button>
        ))}
      </header>
    </div>
  );
}

export default App;
