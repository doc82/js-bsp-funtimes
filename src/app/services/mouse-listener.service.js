class MouseListener {
  constructor() {
    this.wheelListeners = [];
    this.dragListeners = [];
    this.drag = false;
    this.mouseX = 0;
    this.mouseY = 0;
  }

  subscribe = (listeners) => {
    const { wheelListener, dragListener } = listeners;
    if (wheelListener) {
      this.wheelListeners.push(wheelListener);
    }
    if (dragListener) {
      this.dragListeners.push(dragListener);
    }
  };

  attachEvents = (canvas) => {
    canvas.onwheel = this.handleOnWheel;
    canvas.onmousedown = this.handleOnMouseDown;
    canvas.onmouseup = this.handleOnMouseUp;
    canvas.onmousemove = this.handleOnMouseMove;
  };

  handleOnWheel = (e) => {
    const { wheelListeners } = this;
    if (wheelListeners.length) {
      for (let i = 0; i < wheelListeners.length; i += 1) {
        wheelListeners[i](e);
      }
    }
  };

  handleOnMouseDown = (e = {}) => {
    const { clientX = 0, clientY = 0 } = e;
    this.mouseX = clientX;
    this.mouseY = clientY;
    this.drag = true;
  };

  handleOnMouseUp = () => {
    this.drag = false;
  };

  handleOnMouseMove = (e) => {
    if (this.drag) {
      const { mouseX, mouseY, dragListeners } = this;
      const { clientX, clientY } = e;
      const dX = mouseX - clientX;
      const dY = mouseY - clientY;

      //   Update x/y
      this.mouseX = clientX;
      this.mouseY = clientY;

      //   If we have listeners, udpate them!
      if (dragListeners.length) {
        for (let i = 0; i < dragListeners.length; i += 1) {
          dragListeners[i](dX, dY);
        }
      }
    }
  };
}

const mouseService = new MouseListener();
export default mouseService;
