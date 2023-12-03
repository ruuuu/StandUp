import './style.css';
import { Notification } from './scripts/notification';
import { createComedianBlock } from './scripts/comedians';
import { intiForm } from './scripts/form';
import { getComedians } from './scripts/api';





// const notification =  Notification.getInstance();



const init = async() => {

      const bookingInputFullname = document.querySelector('.booking__input--fullname');
      const bookingInputPhone = document.querySelector('.booking__input--phone');
      const bookingInputTicket = document.querySelector('.booking__input--ticket');
      const bookingComedianList = document.querySelector('.booking__comedian-list');
      const bookingForm = document.querySelector('.booking__form');

 
      intiForm(bookingForm, bookingInputFullname, bookingInputPhone, bookingInputTicket); // отправка данных формы

      const comedians = await getComedians();  // await  тк решаем когда разрешится промис
      
      if(!comedians){
            return;  // выход из метода
      }
      console.log('comedians ', comedians);
      
      const countComedians = document.querySelector('.event__info-item--comedians .event__info-number');
      countComedians.textContent = comedians.length;

      const comedianBlock = createComedianBlock(comedians, bookingComedianList); // li
      bookingComedianList.append(comedianBlock);     
};



init();
