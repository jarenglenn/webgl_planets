let Point = function (x, y, z) {
  if (x !== undefined && y !== undefined && z !== undefined) {
    this.x = x.toFixed(3);
    this.y = y.toFixed(3);
    this.z = z.toFixed(3);
  }

  this.faces = [];
};

Point.prototype.subdivide = function (point, count, checkPoint) {
  let segments = [];
  segments.push(this);

  for (let i = 1; i < count; i++) {
    let np = new Point(
      this.x * (1 - i / count) + point.x * (i / count),
      this.y * (1 - i / count) + point.y * (i / count),
      this.z * (1 - i / count) + point.z * (i / count)
    );
    np = checkPoint(np);
    segments.push(np);
  }

  segments.push(point);

  return segments;
};

Point.prototype.segment = function (point, percent) {
  percent = Math.max(0.01, Math.min(1, percent));

  let x = point.x * (1 - percent) + this.x * percent;
  let y = point.y * (1 - percent) + this.y * percent;
  let z = point.z * (1 - percent) + this.z * percent;

  let newPoint = new Point(x, y, z);
  return newPoint;
};

Point.prototype.midpoint = function (point, location) {
  return this.segment(point, 0.5);
};

Point.prototype.project = function (radius, percent) {
  if (percent === undefined) {
    percent = 1.0;
  }

  percent = Math.max(0, Math.min(1, percent));

  let mag = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
  let ratio = radius / mag;

  this.x = this.x * ratio * percent;
  this.y = this.y * ratio * percent;
  this.z = this.z * ratio * percent;
  return this;
};

Point.prototype.registerFace = function (face) {
  this.faces.push(face);
};

Point.prototype.getOrderedFaces = function () {
  let workingArray = this.faces.slice();
  let ret = [];

  let i = 0;
  while (i < this.faces.length) {
    if (i === 0) {
      ret.push(workingArray[i]);
      workingArray.splice(i, 1);
    } else {
      let hit = false;
      let j = 0;
      while (j < workingArray.length && !hit) {
        if (workingArray[j].isAdjacentTo(ret[i - 1])) {
          hit = true;
          ret.push(workingArray[j]);
          workingArray.splice(j, 1);
        }
        j++;
      }
    }
    i++;
  }

  return ret;
};

Point.prototype.findCommonFace = function (other, notThisFace) {
  for (let i = 0; i < this.faces.length; i++) {
    for (let j = 0; j < other.faces.length; j++) {
      if (this.faces[i].id === other.faces[j].id && this.faces[i].id !== notThisFace.id) {
        return this.faces[i];
      }
    }
  }

  return null;
};

Point.prototype.toJson = function () {
  return {
    x: this.x,
    y: this.y,
    z: this.z,
  };
};

Point.prototype.toString = function () {
  return "" + this.x + "," + this.y + "," + this.z;
};

module.exports = Point;
