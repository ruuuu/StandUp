

export const displayClientInfo = (parent, data) => {

   parent.innerHTML = '';
   
   parent.innerHTML += `
      <p class="booking__client-item"> Имя: ${data.fullName} </p>
      <p class="booking__client-item"> Телефон: ${data.phone }</p>
      <p class="booking__client-item"> Номер билета: ${data.ticketNumber} </p>
   `;
};



export const displayBooking = (parent, clientData, comediansData) => {
   //список комиков: comediansData = [ {id: "2",  comedian: "ЮЛЯ АХМЕДОВА",  performances: [ {time: "13:00", hall: "Зал 1"} ] }, {}, {}  ]

   const bookingList = document.createElement('ul');
   bookingList.classList.add('booking__list');

   console.log('clientData.booking ', clientData.booking);
   console.log('comediansData ', comediansData);
   
   // перебираем clientData.booking = [{ comedian: '1', time: '23:00' }, {}, {}]  комединаты на котрй записался клиент
   const bookingComedians = clientData.booking.map((bookingComedian) => {  // список комиков на котрый записался клиент
      
      const comedian = comediansData.find((item) => item.id === bookingComedian.comedian); // { id, comedian, perfomances: { {time, hall} } }
      const perfomance = comedian.performances.find((item) => item.time === bookingComedian.time);  // { time, hall }

      return { comedian, perfomance };
   });

   bookingComedians.sort((a, b) => a.perfomance.time.localeCompare(b.perfomance.time)); // сортируем  элементы по времени

   console.log('bookingComedians ', bookingComedians);   // [ {comedian: {id, comedian, perfomances}, perfomance: {time, hall}},  {},  {} ]


   const bookingComediantElements = bookingComedians.map(( {comedian, perfomance} ) => {

      const comedianElement = document.createElement('li');
      comedianElement.classList.add('booking__item');
      comedianElement.innerHTML = `
         <h3> ${comedian.comedian} </h3>
         <p> Время: ${perfomance.time} </p>
         <button class="booking__hall" type="button" data-booking="${clientData.fullName} ${clientData.ticketNumber} ${comedian.comedian} ${perfomance.time} ${perfomance.hall}"> ${perfomance.hall} </button>
      `;

      return comedianElement;
   });

   console.log('bookingComediantElements ', bookingComediantElements);  // [li, li, li]

   bookingList.append(...bookingComediantElements);

   parent.append(bookingList);

};