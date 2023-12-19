// вывод qr  кода:
import QRCode from 'qrcode';

// открытие мод окна
const dislayQrCode = (data) => {

   const modal = document.querySelector('.modal');
   const canvas = document.querySelector('.qrCanvas');
   const closeButton = document.querySelector('.modal__close');

};


export const showQrController = (bookingPerfomances) => {

   bookingPerfomances.addEventListener('click', ({target}) => {  // деструткрируем evt.target
     
     if (target.closest('.booking__hall')) {  // если нажали на элемент с классом booking__hall
         const bookingData = target.dataset.booking;    // значение дата-атрибута
         dislayQrCode(bookingData);
     }
     

   });


};
