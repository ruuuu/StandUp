import './style.css';
import { Notification } from './scripts/notification';
import { createComedianBlock } from './scripts/comedians';
import { intiForm } from './scripts/form';
import { getComedians } from './scripts/api';
import { initChangeSection } from './scripts/changeSection';




const init = async() => {

      const bookingInputFullname = document.querySelector('.booking__input--fullname');
      const bookingInputPhone = document.querySelector('.booking__input--phone');
      const bookingInputTicket = document.querySelector('.booking__input--ticket');
      const bookingComedianList = document.querySelector('.booking__comedian-list');
      const bookingForm = document.querySelector('.booking__form');

      const event = document.querySelector('.event');
      const booking = document.querySelector('.booking');
      const eventButtonReserve = document.querySelector('.event__button--reserve');
      const eventButtonEdit = document.querySelector('.event__button--edit');
      const bookingTitle = document.querySelector('.booking__title');
      const countComedians = document.querySelector('.event__info-item--comedians .event__info-number');
 

      const comedians = await getComedians();  // await  тк решаем когда разрешится промис
      
      if(comedians){
            console.log('comedians ', comedians);
      
            countComedians.textContent = comedians.length;
      
            const changeSection = initChangeSection(event, booking, eventButtonReserve, eventButtonEdit, bookingTitle, bookingForm, comedians, bookingComedianList ); // вернет фукнуию

            console.log('changeSection ', changeSection)
            intiForm(bookingForm, bookingInputFullname, bookingInputPhone, bookingInputTicket, changeSection, bookingComedianList); // отправка данных формы
      }
      
};



init();
