import { getClient, getComedians } from "./api";
import { Notification } from "./notification";
import { displayClientInfo, displayBooking } from "./display";
import { showQrController } from "./showController";


const getTicketNumber = () => {
   // открыть страаничку по урл http://localhost:5173/qr.html?t=43212121

   const queryString = window.location.search;  // получим ?t=45456545
   
   const urlParams = new URLSearchParams(queryString);
   console.log('urlParams ', urlParams)

   return urlParams.get('t');     // значение search-параметра t
};



export const initQrPage = async() => {  // формировнаие куар кода
   
   const clientInfo = document.querySelector('.booking__client-info');
   const bookingPerfomances = document.querySelector('.booking__perfomance');

   const ticketNumber = getTicketNumber();

   if(ticketNumber){
      const clientData = await getClient(ticketNumber);
      console.log('clienData  ', clientData);          // { booking: [{ comedian: '1', time: '23:00' }, {}],  fullName: 'роман',  phone: '+7(876)-543-2134',  ticketNumber: '45456545' }
      
      displayClientInfo(clientInfo, clientData); 

      const comediansData = await getComedians();  // ticketNumber
      console.log('comediansData ', comediansData);  // список комиков 

      displayBooking(bookingPerfomances, clientData,  comediansData);

      showQrController(bookingPerfomances);
   }else{
      Notification.getInstance().show('Произошла ошибка, проверьте ссылку на корректность')
   }
}


