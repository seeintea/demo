const init = (width = 400, height = 400) => {
  const app = document.getElementById("app") as HTMLDivElement;
  const canvas = document.createElement("canvas");
  canvas.style.border = "1px solid red";
  canvas.width = width;
  canvas.height = height;
  app.appendChild(canvas);
  return canvas;
};

export { init };
