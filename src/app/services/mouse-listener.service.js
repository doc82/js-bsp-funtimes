export class MouseListener {
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

  attachEvents = (gl) => {
    gl.canvas.onwheel = this.handleOnWheel;
    gl.canvas.onmousedown = this.handleOnMouseDown;
    gl.canvas.onmouseup = this.handleOnMouseUp;
    gl.canvas.onmousemove = this.handleOnMouseMove;
  };

  handleOnWheel = (e) => {
    const { wheelListeners } = this;
    if (wheelListeners.length) {
      for (let i = 0; i < wheelListeners.length; i += 1) {
        wheelListeners[i].onWheel(e);
      }
    }
  };

  handleOnMouseDown = (e = {}) => {
    const { clientX = 0, clientY = 0 } = e;
    this.mouseX = clientX;
    this.mouseY = clientY;
    drag = true;
  };

  handleOnMouseUp = () => {
    this.drag = false;
  };

  handleOnMouseMove = () => {
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
          dragListeners[i].onDrag(dX, dY);
        }
      }
    }
  };
}