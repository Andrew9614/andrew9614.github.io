const fileInput = document.querySelector('.file-input'),
  filterOptions = document.querySelectorAll('.filter button'),
  filterName = document.querySelector('.filter-info .name'),
  filterValue = document.querySelector('.filter-info .value'),
  filterSlider = document.querySelector('.slider input'),
  rotateOptions = document.querySelectorAll('.rotate button'),
  previewImg = document.querySelector('.target-img'),
  frameImg = document.querySelector('.frame-img'),
  resetFilterBtn = document.querySelector('.reset-filter'),
  chooseImgBtn = document.querySelector('.choose-img'),
  saveImgBtn = document.querySelector('.save-img');

let isDragging = false,
  currentX,
  currentY,
  initialX,
  initialY,
  xOffset = 0,
  yOffset = 0;

previewImg.style.top = 500 / 2 - previewImg.height / 2 + 'px';

let scale = 100,
  rotate = 0;
const loadImage = () => {
  let file = fileInput.files[0];
  if (!file) return;
  previewImg.src = URL.createObjectURL(file);
  previewImg.addEventListener('load', () => {
    resetFilterBtn.click();
    document.querySelector('.container').classList.remove('disable');
  });
};

const applyFilter = () => {
  previewImg.style.transform = `rotate(${rotate}deg) scale(${scale / 100})`;
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

rotateOptions.forEach((option) => {
  option.addEventListener('click', () => {
    if (option.id === 'left') {
      rotate -= 90;
    } else if (option.id === 'right') {
      rotate += 90;
    } else if (option.id === 'horizontal') {
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else {
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilter();
  });
});

const resetFilter = () => {
  rotate = 0;
  scale = 100;
  setTranslate(0, 0, previewImg);
  xOffset = 0;
  yOffset = 0;
  filterOptions[0].click();
  applyFilter();
};

const saveImage = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 333;
  canvas.height = 500;
  ctx.fillStyle = 'green';
  ctx.fillRect(0, 0, 1000, 1000);
  if (rotate !== 0) {
    ctx.rotate((rotate * Math.PI) / 180);
  }
  //ctx.scale(scale / 100, scale / 100);
  console.log(previewImg.offsetTop);
  ctx.drawImage(
    previewImg,
    parseInt(previewImg.style.left),
    parseInt(previewImg.style.top),
    (previewImg.width * scale) / 100,
    (previewImg.height * scale) / 100
  );
  ctx.drawImage(
     frameImg,
     0,
     0,
     frameImg.width,
     frameImg.height
   );

  const link = document.createElement('a');
  link.download = 'image.jpg';
  link.href = canvas.toDataURL();
  link.click();
};

filterSlider.addEventListener('input', updateFilter);
resetFilterBtn.addEventListener('click', resetFilter);
saveImgBtn.addEventListener('click', saveImage);
fileInput.addEventListener('change', loadImage);
chooseImgBtn.addEventListener('click', () => fileInput.click());

previewImg.addEventListener('pointerdown', dragStart);
document.addEventListener('pointerup', dragEnd);
document.addEventListener('pointerleave', dragEnd);
document.addEventListener('pointermove', drag);

function dragStart(e) {
  e.preventDefault();
  initialX = e.clientX - xOffset;
  initialY = e.clientY - yOffset;

  isDragging = true;
}

function dragEnd(e) {
  isDragging = false;
}

function drag(e) {
  if (isDragging) {
    e.preventDefault();
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;
		console.log(previewImg.offsetTop)
    xOffset = currentX;
    yOffset = currentY;

    setTranslate(currentX, currentY, previewImg);
  }
}

function setTranslate(xPos, yPos, el) {
  el.style.left = xPos + 'px';
  el.style.top = yPos + 'px';
}
