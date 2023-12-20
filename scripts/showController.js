// вывод qr  кода:
import QRCode from 'qrcode';
import { Notification } from './notification';


// открытие мод окна
const dislayQrCode = (data) => {

   let error = false;
   const modal = document.querySelector('.modal');
   const canvas = document.getElementById('qrCanvas');
   const closeButton = document.querySelector('.modal__close');

   QRCode.toCanvas(canvas, data, (err) => {  // рисует qrCode, при считывании его будет инфа data
      if(err){
         error = true;
         console.error(err);
         return;  // выход из метода
      }

      console.log('QRcode содан')
   });

   if(error){
      Notification.getInstance().show('Что-то пошло не так')
      return;
   }

   modal.classList.add('modal__show');

   window.addEventListener('click', ({ target }) => {   // делегирование, не на кнопку closeButton повеисли, а на его родителя, evt деструткрровали
      console.log('target ', target)
      
      if(target === closeButton || target === modal){
         modal.classList.remove('modal__show');
         canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)  // очищем все что в canvas
      }
   });

};




export const showQrController = (bookingPerfomances) => {

   bookingPerfomances.addEventListener('click', ({target}) => {  // деструткрируем evt.target
     
     if (target.closest('.booking__hall')) {  // если нажали на элемент с классом booking__hall  или его родителя
         const bookingData = target.dataset.booking;    // значение дата-атрибута
         dislayQrCode(bookingData);
     }
   });

};
