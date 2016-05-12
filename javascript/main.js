import 'babel-polyfill';

import {showAboutWindow, closeAboutWindow} from './about';

import {
  findVertices,
  Vector,
  calculateAreaOfParallelogram,
  calculateCircleRadius,
  findCenterOfParallelogram,
  findMovingCircle
} from './math';

import {
  renderCircle,
  renderFugire,
  CIRCLE_RADIUS,
  renderInformation
} from './utils';

const initialState = {
  movingCircle: null,
  vertices: [],
  parallelograms: [],
  choosedParallelogram: 0,
  areaOfChoosedParallelogram: null,
  yellowCircleRadius: null,
  yellowCircleCenter: null
};

const verticeNames = ['Vertex A', 'Vertex B', 'Vertex C'];

class Application {
  constructor(canvas) {
    this.canvas = canvas;
    this.context2D = canvas.getContext('2d');

    this.state = {...initialState};

    const switchButton = document.querySelector('.switch');
    const resetButton = document.querySelector('.reset');

    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));

    switchButton.addEventListener('click', this.switchParallelogram.bind(this));
    resetButton.addEventListener('click', this.reset.bind(this));

    this.render = this._render.bind(this);
  }

  _render() {
    this.clear();
    this.update();
    this.draw();
    this.queue();
  }

  clear() {
    this.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  update() {
    if (this.state.vertices.length === 3) {
      const parallelograms = findVertices(this.state.vertices);
      const parallelogram = parallelograms[this.state.choosedParallelogram];

      const areaOfChoosedParallelogram =
        calculateAreaOfParallelogram(parallelogram);
      const yellowCircleCenter =
        findCenterOfParallelogram(parallelogram);
      const yellowCircleRadius =
        calculateCircleRadius(areaOfChoosedParallelogram);

      this.state = {
        ...this.state,
        parallelograms,
        areaOfChoosedParallelogram,
        yellowCircleCenter,
        yellowCircleRadius
      };
    }
  }

  draw() {
    this.state.vertices.forEach((vertice, index) => {
      renderCircle(
        vertice,
        {radius: CIRCLE_RADIUS, text: verticeNames[index]},
        this.context2D
      );
    });

    if (this.state.vertices.length === 3) {
      renderFugire(
        this.state.parallelograms[this.state.choosedParallelogram],
        'blue',
        this.context2D
      );

      renderCircle(
        this.state.yellowCircleCenter,
        {radius: this.state.yellowCircleRadius, color: '#FFF380'},
        this.context2D
      );

      renderCircle(
        this.state.yellowCircleCenter,
        {radius: 1, text: 'Centre of mass'},
        this.context2D
      );
    }

    renderInformation(this.state);
  }

  queue() {
    window.requestAnimationFrame(this.render);
  }

  handleMouseDown({clientX, clientY}) {
    const movingCircle = findMovingCircle(
      this.state.vertices,
      {x: clientX, y: clientY}
    );

    if (movingCircle) {
      this.state = {
        ...this.state,
        movingCircle
      };
    }
  }

  handleMouseMove({clientX, clientY}) {
    if (!this.state.movingCircle) {
      return;
    }
    this.state.movingCircle.set(clientX, clientY);
  }

  handleMouseUp({clientX, clientY}) {
    if (this.state.movingCircle) {
      this.state = {
        ...this.state,
        movingCircle: null
      };
      return;
    }

    this.state = {
      ...this.state,
      vertices: this.state.vertices
        .slice(-2)
        .concat(new Vector(clientX, clientY))
    };
  }

  switchParallelogram() {
    const index = this.state.choosedParallelogram;
    this.state = {
      ...this.state,
      choosedParallelogram: index === 2 ? 0 : index + 1
    };
  }

  reset() {
    this.state = {...initialState};
  }
}

const {innerHeight: h, innerWidth: w} = window;
const canvas = document.getElementById('canvas');
canvas.width = w;
canvas.height = h;

const application = new Application(canvas);

application.render();

const aboutButton = document.querySelector('.about');
const closeModalButton = document.querySelector('.close');
aboutButton.addEventListener('click', showAboutWindow);
closeModalButton.addEventListener('click', closeAboutWindow);
