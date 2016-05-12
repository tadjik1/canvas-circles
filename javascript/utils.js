export const CIRCLE_RADIUS = 11;

export const renderCircle = ({x, y}, {radius, color = 'red', text}, ctx) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.lineWidth = 1;
  ctx.strokeStyle = color;
  if (text) {
    ctx.font = "12px 'Open Sans'";
    ctx.fillText(text, x - 20, y - 20);
  }
  ctx.stroke();
};

export const renderFugire = ([a, b, c, d], color, ctx) => {
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.lineTo(c.x, c.y);
  ctx.lineTo(d.x, d.y);
  ctx.lineWidth = 1;
  ctx.strokeStyle = color;
  ctx.closePath();
  ctx.stroke();
};

const findRow = className => document.querySelector(`.${className}`);
const findCell = (row, index) => row.querySelector(`td:nth-child(${index})`);
const mapKeyToDOMNode = {
  vertexA: findRow('vertexA'),
  vertexB: findRow('vertexB'),
  vertexC: findRow('vertexC'),
  parallelogram: findRow('parallelogram'),
  circle: findRow('circle')
};

const renderRowInfo = (key, info) => {
  const row = mapKeyToDOMNode[key];

  findCell(row, 2).textContent = info.x;
  findCell(row, 3).textContent = info.y;

  if (info.additional) {
    findCell(row, 4).textContent = Number(info.additional).toFixed(2);
  } else {
    findCell(row, 4).textContent = '-';
  }
};

export const renderInformation = state => {
  const centerOfParallelogram = state.yellowCircleCenter;
  const circleRadius = state.yellowCircleRadius;
  const areaOfParallelogram = state.areaOfChoosedParallelogram;

  const keys = {
    vertexA: state.vertices[0],
    vertexB: state.vertices[1],
    vertexC: state.vertices[2],

    parallelogram: {...centerOfParallelogram, additional: areaOfParallelogram},
    circle: {...centerOfParallelogram, additional: circleRadius}
  };

  Object.keys(keys).forEach(key => {
    if (keys[key] && keys[key].x && keys[key].y) {
      renderRowInfo(key, keys[key]);
    }
  });
};
