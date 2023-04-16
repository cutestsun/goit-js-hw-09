// Описаний в документації
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  dateInput: document.querySelector('#datetime-picker'),
  btnStart: document.querySelector('[data-start]'),
  daysValue: document.querySelector('[data-days]'),
  hoursValue: document.querySelector('[data-hours]'),
  minutesValue: document.querySelector('[data-minutes]'),
  secondsValue: document.querySelector('[data-seconds]'),
};

refs.btnStart.disabled = true;
let countdownValue = 0;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0].getTime() < Date.now()) {
      return Notify.failure('Please choose a date in the future');
    }

    refs.btnStart.disabled = false;
  },
};

const fp = flatpickr(refs.dateInput, options);

refs.btnStart.addEventListener('click', onBtnStartClick);

function onBtnStartClick() {
  refs.btnStart.disabled = true;
  refs.dateInput.disabled = true;
  const intervalId = setInterval(() => {
    countdownValue = fp.selectedDates[0].getTime() - Date.now();
    const resObj = convertMs(countdownValue);

    return updateValue(resObj, intervalId);
  }, 1000);
}

function updateValue({ seconds, minutes, hours, days }, intervalId) {
  if (countdownValue <= 0) {
    Notify.success('Time is up!');

    return clearInterval(intervalId);
  }

  refs.secondsValue.textContent = addLeadingZero(seconds);
  refs.minutesValue.textContent = addLeadingZero(minutes);
  refs.hoursValue.textContent = addLeadingZero(hours);
  refs.daysValue.textContent = addLeadingZero(days);
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
