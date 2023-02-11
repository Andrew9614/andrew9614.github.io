const fileInput = document.querySelector('.file-input'),
  filterOptions = document.querySelectorAll('.filter button'),
  filterName = document.querySelector('.filter-info .name'),
  filterValue = document.querySelector('.filter-info .value'),
  filterSlider = document.querySelector('.slider input'),
  targetImg = document.querySelector('.target-img'),
  frameImg = document.querySelector('.frame-img'),
  resetFilterBtn = document.querySelector('.reset-filter'),
  chooseImgBtn = document.querySelector('.choose-img'),
  saveImgBtn = document.querySelector('.save-img'),
  textInput = document.querySelector('.text-input'),
  renderText = document.querySelector('.render-text'),
  container = document.querySelector('.preview-img').getBoundingClientRect();

let frameImgRec = frameImg.getBoundingClientRect(),
  isDragging = false,
  currentX,
  currentY,
  initialX,
  initialY,
  scale = 100,
  rotate = 0,
  textSize = frameImgRec.height * 0.04,
  textLeft = frameImgRec.width * 0.1,
  textTop = frameImgRec.height * 0.8;

const loadImage = () => {
  let file = fileInput.files[0];
  if (!file) return;
  targetImg.src = URL.createObjectURL(file);
  targetImg.addEventListener('load', () => {
    resetFilterBtn.click();
    document.querySelector('.container').classList.remove('disable');
  });
};

const applyFilter = () => {
  targetImg.style.transform = `rotate(${rotate}deg) scale(${scale / 100})`;
};

const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`;
  const selectedFilter = document.querySelector('.filter .active');

  if (selectedFilter.id === 'scale') {
    scale = filterSlider.value;
  } else if (selectedFilter.id === 'rotate') {
    rotate = filterSlider.value;
  } else if (selectedFilter.id === 'inversion') {
    inversion = filterSlider.value;
  } else {
    grayscale = filterSlider.value;
  }
  applyFilter();
};

const resetFilter = () => {
  rotate = 0;
  scale = 100;
  setTranslate(0, frameImg.height / 2 - targetImg.height / 2, targetImg);
  xOffset = 0;
  yOffset = frameImg.height / 2 - targetImg.height / 2;
  filterOptions[0].click();
  textInput.value = '';
  renderText.innerHTML = '';
  applyFilter();
};

const saveImage = () => {
  console.log(frameImg.naturalWidth);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let upscale = frameImg.naturalWidth/frameImg.width;
  canvas.width = container.width * upscale;
  canvas.height = container.height * upscale;
  let targetLeft = targetImg.offsetLeft * upscale;
  let targetTop = targetImg.offsetTop * upscale;
  let targetWidth = (targetImg.width * scale * upscale) / 100;
  let targetHeight = (targetImg.height * scale * upscale) / 100;
  let targetCenterX = targetLeft + (targetImg.width * upscale) / 2;
  let targetCenterY = targetTop + (targetImg.height * upscale) / 2;

  if (scale / 100 !== 1) {
    targetLeft = targetLeft - (targetWidth - targetImg.width) / 2;
    targetTop = targetTop - (targetHeight - targetImg.height) / 2;
  }

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(targetCenterX, targetCenterY);
  if (rotate !== 0) ctx.rotate((rotate * Math.PI) / 180);
  ctx.drawImage(
    targetImg,
    -targetWidth / 2,
    -targetHeight / 2,
    targetWidth,
    targetHeight
  );
  ctx.restore();
  ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
  ctx.font = `${textSize * upscale}px SansSerif`;
  ctx.fillStyle = 'black';
  ctx.fillText(
    renderText.innerHTML,
    textLeft * upscale,
    (textTop + textSize) * upscale
  );
  // document.querySelector('.container').append(canvas);
  const link = document.createElement('a');
  link.download = 'image.jpg';
  link.href = canvas.toDataURL();
  link.click();
};

const frameResize = () => {
  frameImgRec = frameImg.getBoundingClientRect();
  textSize = frameImgRec.height * 0.04;
  textLeft = frameImgRec.width * 0.1;
  textTop = frameImgRec.height * 0.8;
  renderText.style.fontSize = textSize + 'px';
  renderText.style.top = textTop + 'px';
  renderText.style.left = textLeft + 'px';
};

const handleInputChange = (e) => {
  renderText.innerHTML = e.target.value ? `...${e.target.value}` : '';
};

const dragStart = (e) => {
  e.preventDefault();
  initialX = e.clientX - e.target.offsetLeft;
  initialY = e.clientY - e.target.offsetTop;
  isDragging = true;
};

const dragEnd = () => {
  isDragging = false;
};

const drag = (e) => {
  if (e.target !== targetImg) return;
  if (isDragging) {
    e.preventDefault();
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;

    setTranslate(currentX, currentY, targetImg);
  }
};

const setTranslate = (xPos, yPos, el) => {
  el.style.left = xPos + 'px';
  el.style.top = yPos + 'px';
};

filterOptions.forEach((option) => {
  option.addEventListener('click', () => {
    document.querySelector('.active').classList.remove('active');
    option.classList.add('active');

    if (option.id === 'scale') {
      filterSlider.max = '400';
      filterSlider.min = '1';
      filterSlider.value = scale;
      filterValue.innerText = `${scale}%`;
    } else if (option.id === 'rotate') {
      filterSlider.max = '180';
      filterSlider.min = '-180';
      filterSlider.value = rotate;
      filterValue.innerText = `${rotate}%`;
    }
  });
});

filterSlider.addEventListener('input', updateFilter);
resetFilterBtn.addEventListener('click', resetFilter);
saveImgBtn.addEventListener('click', saveImage);
fileInput.addEventListener('change', loadImage);
chooseImgBtn.addEventListener('click', () => fileInput.click());
textInput.addEventListener('input', handleInputChange);
targetImg.addEventListener('pointerdown', dragStart);
document.addEventListener('pointerup', dragEnd);
document.addEventListener('pointerleave', dragEnd);
document.addEventListener('pointermove', drag);
new ResizeObserver(frameResize).observe(frameImg);
document.addEventListener('DOMContentLoaded', () => {
  renderText.style.fontSize = textSize + 'px';
  renderText.style.top = textTop + 'px';
  renderText.style.left = textLeft + 'px';
  setTranslate(0, frameImg.height / 2 - targetImg.height / 2, targetImg);
});
