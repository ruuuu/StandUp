import Inputmask from "inputmask";  // для валидации полей формы  https://github.com/RobinHerbots/Inputmask
import JustValidate from 'just-validate';  // для валидации полей формы https://just-validate.dev/docs/intro
import { Notification } from "./notification";
import { sendData } from "./api";



export const intiForm = (bookingForm, bookingInputFullname, bookingInputPhone, bookingInputTicket, changeSection, bookingComedianList) => {
   

      // для валидации используем библиотеку just-validate:
      const validate = new JustValidate(bookingForm, {
         errorFieldCssClass: 'booking__input--invalid',  // наши классы указываем из booking.css
         successFieldCssClass: 'booking__input--valid',
      });

      new Inputmask('+7(999)-999-9999').mask(bookingInputPhone);  // устанавливам маску на поле
      new Inputmask('99999999').mask(bookingInputTicket);

      validate      
            .addField(bookingInputFullname, [
                  {
                        rule: 'required',
                        errorMessage: 'Имя обязательно для заполнения'
                  },
                  {
                        validator(value) {
                            return  value === '20' ? false : true 
                        }   
                  },
                  
            ])
            .addField(bookingInputPhone, [
                  {
                        rule: 'required',
                        errorMessage: 'Телефон обязательно для заполнения'
                  },
                  {
                        validator() {
                              const phone = bookingInputPhone.inputmask.unmaskedvalue();
                              return phone.length === 10 && Boolean(Number(phone)); // проверяем что поле состит из 10 символов и является числом
                          } ,
                        errorMessage: 'Некорректный телефон'
                  },
            ])
            .addField(bookingInputTicket, [
                  {
                        rule: 'required',
                        errorMessage: 'Номер билета  обязательно для заполнения'
                  },
                  {
                        validator() {
                            const ticket = bookingInputTicket.inputmask.unmaskedvalue();
                            return ticket.length === 8 && Boolean(Number(ticket)); // проверяем что поле состит из 8 символов и является числом
                        },
                        errorMessage: 'Неверный номер билета'
                  },
            ])
            .onFail((fields) => {                            // если хотя бы какотйо поле невадилно, то вызовется переданныя фукнция, fields =  {2: {elem: input.booking__input.booking__input--phone.booking__input--invalid, rules: Array(2), isValid: false, touched: false, config: undefined, …}, 3:{}, {}}
                  
                  let errorMessage = '';
                  console.log('fileds ', fields)
                  
                  for (const key in fields) {
                        if (!Object.hasOwnProperty.call(fields, key)) {              // провереям что поле относится к этому объекту
                              continue;
                        }

                        const element = fields[key];
                        
                        if(!element.isValid){ // если не валидно
                              errorMessage += `${element.errorMessage}, `; 
                        }
                  }

                  Notification.getInstance().show(errorMessage.slice(0, -2), false);  // отрезаем полсдение два символа(запятая и пробел)
      });



      // отправка данных формы:
      bookingForm.addEventListener('submit', async(evt) => {  
         
         evt.preventDefault();               // чтобы полсе отправки формы, страница не перезагружалась
         
         if(!validate.isValid){  // если форма невалдина
            return;   // выход из обработчика
         }
         
         const data = {   // данные котрые потом отправим на сервер
            booking: []    // нач значение, потом будет ["fullName": "Rufina",  "phone": "7654",  "ticketNumber": "8888888",  "booking": [{comedoan: "10", time: "10:45"},{},{}]} ]
         };      

         const times = new Set();  // Коллекция (хранит уникальные значения)

         //new FormData(bookingForm) // считыывает данные полей, хранит ввиде объекта
         new FormData(bookingForm).forEach((value, field) => {  
               //console.log(value, field);
               if(field === 'booking'){                        // на сервер отправляем метдов POST {"fullName": "Rufina",  "phone": "7654",  "ticketNumber": "8888888",  "booking": [{comedoan: "10", time: "10:45"},{},{}]} 
                     //comedian, time это значения атрибутов name у <select>
                     const [comedian, time] = value.split(",");                        // value = 3,11:45, это строка, метод split() возвращает массив элементов
                     if(comedian && time){
                        data.booking.push({ comedian, time });
                        times.add(time);                                            // добавляем значение в коллекцию
                     }
               }
               else{
                  data[field] = value;  
               } 
         });


         if(times.size !== data.booking.length){  // если в одно время на двух комиков запсиываемся
            Notification.getInstance().show('нельзя в одно время записаться на двух комиков', false);   
            return;  // выход из обработчика
         }

         if(!times.size){
            Notification.getInstance().show('выберите время', false); 
            return;  // выход из обработчика
         }




         const method = bookingForm.getAttribute('method');             // получение значения атрибута method

         let isSend = false;
         
         if(method === "PATCH"){
           isSend = await sendData(method, data, data.ticketNumber);   //  await  тк отправка на сервер идет
         }
         else{
            isSend = await sendData(method, data); 
         }

         if(isSend){
            console.log('isSend ', isSend)
            Notification.getInstance().show('Бронь принята', true);
            changeSection();
            bookingForm.reset();  // очищвем форму
            bookingComedianList.textContent = "";  
         }
         

         console.log('data ', data);   // data = [{"fullName": "Rufina",  "phone": "7654",  "ticketNumber": "8888888",  "booking": [{comedoan: "10", time: "10:45"},{},{}]} ] - тело мтеода POSTT
   });


};