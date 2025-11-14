const btn = document.querySelector(".button");
const promoBtn = document.querySelector(".popup__code");
const page = document.querySelector(".page");
let isSpinned = false;

const PROMOCODES = ["Taka", "Tekka", "Bpl", "BD25"];

const SEGMENTS = {
  BONUS_300: { start: 70, end: 80 },
  BONUS_20:  { start: 75, end: 85 }    
};

function getRandomPromoCode() {
  return PROMOCODES[Math.floor(Math.random() * PROMOCODES.length)];
}

function rollTheWheel() {
  if (isSpinned) return showPopup();

  const wheel = document.querySelector(".wheel__inner");
  btn.style.pointerEvents = "none";

  let target;

  const roll = Math.random();
  if (roll < 0.95) {
    target = SEGMENTS.BONUS_300;
    window.reward = "300 BDT Bonus";
  } else {
    target = SEGMENTS.BONUS_20;
    window.reward = "20% Bonus up to 30,000 BDT";
  }

  const stopAngle =
    Math.floor(Math.random() * (target.end - target.start)) + target.start;

  const spins = Math.floor(Math.random() * 6) + 3;
  const rotateDeg = spins * 360 + stopAngle;

  wheel.style.transition = "transform 3s ease-out";
  wheel.style.transform = `rotate(${rotateDeg}deg)`;

  wheel.addEventListener(
    "transitionend",
    () => {
      const normalized = rotateDeg % 360;
      wheel.style.transition = "none";
      wheel.style.transform = `rotate(${normalized}deg)`;
      showPopup();
    },
    { once: true }
  );
}

function showPopup() {
  const backdrop = document.createElement("div");
  backdrop.className = "backdrop";
  document.body.appendChild(backdrop);
  backdrop.addEventListener("click", hidePopup);

  const popup = document.querySelector(".popup");
  const code = document.querySelector(".popup__code");
  const title = document.querySelector(".title_popup");

  title.innerHTML = window.reward;
  code.textContent = getRandomPromoCode();

  popup.style.display = "flex";
  popup.style.visibility = "visible";
  btn.style.pointerEvents = "auto";

  promoBtn.addEventListener("click", copyToClipboard);
  isSpinned = true;

  setTimeout(() => {
    page.style.overflow = "hidden";
    backdrop.style.opacity = "1";
    popup.style.opacity = "1";
    popup.style.transform = "translateX(-50%) translateY(-50%)";
  }, 100);
}

function hidePopup() {
  const backdrop = document.querySelector(".backdrop");
  const popup = document.querySelector(".popup");

  backdrop.style.opacity = "0";
  popup.style.opacity = "0";
  popup.style.transform = "translateX(-50%) translateY(-40%)";

  setTimeout(() => {
    page.style.overflow = "auto";
    backdrop.remove();
    popup.style.display = "none";
    popup.style.visibility = "hidden";
  }, 200);
}

async function copyToClipboard(e) {
  try {
    const textToCopy = e.target.innerHTML;

    if (!navigator.clipboard) {
      const el = document.createElement("textarea");
      el.value = textToCopy;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      el.remove();
      showMessage();
    } else {
      await navigator.clipboard.writeText(textToCopy);
      showMessage();
    }
  } catch (err) {
    console.error("Failed to copy:", err);
  }
}

function showMessage() {
  const message = document.createElement("span");
  message.className = "msg";
  message.innerHTML = "copied";
  promoBtn.appendChild(message);

  setTimeout(() => {
    message.style.transform = "translateY(-150%) translateX(-50%)";
    message.style.opacity = 1;

    setTimeout(() => {
      message.style.opacity = 0;
      setTimeout(() => message.remove(), 300);
    }, 400);
  }, 10);
}

btn.addEventListener("click", rollTheWheel);
