class ModelRegistry {
  constructor() {
    this.registry = {};
  }

  registerModelClass = (id, model) => {
    this.registry[id] = model;
  };
}

const modelRegistry = new ModelRegistry();
export default modelRegistry;
