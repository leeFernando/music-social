function toggleAudio(type) {
  const audioElement = document.getElementById(type);
  const buttonElement = document.getElementById(type + 'Button');
  const iconElement = buttonElement.querySelector('.icon');

  if (audioElement.paused) {
      audioElement.play();
      iconElement.textContent = '⏸';
  } else {
      audioElement.pause();
      iconElement.textContent = '▶';
  }

  audioElement.onended = () => {
      iconElement.textContent = '▶';
  };
}

