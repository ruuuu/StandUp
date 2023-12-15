

export const displayClientInfo = (parent, data) => {
   parent.innerHTML = '';
   
   parent.innerHTML += `
      <p class="booking__client-item"> Имя: ${data.fullName} </p>
      <p class="booking__client-item"> Телефон: ${data.phone }</p>
      <p class="booking__client-item"> Номер билета: ${data.ticketNumber} </p>
   `;
};



export const displayBooking = (perfomance, clientData, comediansData) => {

};