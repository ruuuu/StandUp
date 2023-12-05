import { createComedianBlock } from "./comedians";



export const initChangeSection = (event, booking, eventButtonReserve, eventButtonEdit, bookingTitle, bookingForm, comedians, bookingComedianList ) => {

   eventButtonReserve.style.transition = 'transition: opacity 0.5s, visibility 0.5s';
   eventButtonEdit.style.transition = 'transition: opacity 0.5s, visibility 0.5s';

   eventButtonReserve.classList.remove('event__button--hidden');
   eventButtonEdit.classList.remove('event__button--hidden');
   

   const changeSection = () => {

      event.classList.toggle('event__hidden');
      booking.classList.toggle('booking__hidden');
      
      if(!booking.classList.contains('booking__hidden')){
         const comedianBlock = createComedianBlock(comedians, bookingComedianList); // li
         bookingComedianList.append(comedianBlock); 
      }
       
   };



   eventButtonReserve.addEventListener('click', () => {
      
      changeSection();
      bookingTitle.textContent = 'Забронируйте';
      bookingForm.method = 'POST';
   });


   
   eventButtonEdit.addEventListener('click', () => {

      changeSection();
      bookingTitle.textContent = 'Отредактируйте бронь';
      bookingForm.method = 'PATCH';
   });


   return changeSection;      // вернет функцию

}