import './style.css';
import TomSelect from 'tom-select';
import { Notification } from './scripts/notification';
import Inputmask from "inputmask";  // для валидации полей формы  https://github.com/RobinHerbots/Inputmask
import JustValidate from 'just-validate';  // для валидации полей формы https://just-validate.dev/docs/intro




const MAX_COMEDIANS = 6;


const notification =  Notification.getInstance();


const bookingComedianList = document.querySelector('.booking__comedian-list');
const bookingForm = document.querySelector('.booking__form');



const createComedianBlock = (comedians) => {    // comedians = [{},{},{}]

      const bookingComedian = document.createElement('li');  // li
      bookingComedian.classList.add('booking__comedian');

      const bookingSelectComedian = document.createElement('select');
      bookingSelectComedian.classList.add('booking__select', 'booking__select--comedian');

      const bookingSelectTime = document.createElement('select');
      bookingSelectTime.classList.add('booking__select', 'booking__select--time');
     
      const inputHidden = document.createElement('input');    // для qr  нужно будет это поле
      inputHidden.type = 'hidden';
      inputHidden.name = 'booking';

      const bookingHall = document.createElement('button');   
      bookingHall.classList.add('booking__hall');
      bookingHall.type = 'button';         // чтобы не был type='submit


      bookingComedian.append(bookingSelectComedian, bookingSelectTime, inputHidden);  

      const bookingTomSelectComedian = new TomSelect(bookingSelectComedian, {
            hideSelected: true,      //  скрывает в спсике  уже выбранные элементы
            placeholder: 'Выбрать комика',
            options: comedians.map((item) => {              // [ {value, text}, {value, text} ]
                  return { value: item.id, text: item.comedian }
            })
      });
      
      const bookingTomSelectTime = new TomSelect(bookingSelectTime, {
            hideSelected: true,      //  скрывает уже выбарнные элементы
            placeholder: 'Выбрать время',
      });

      bookingTomSelectTime.disable();  // сперва дизейблим


      //                                  id comedian
      bookingTomSelectComedian.on('change', (id) => {  // навешиваем событие на первsй select Комедиантов, когда выбираем элемнет из списка, вызовется коллбэк
            
            bookingTomSelectTime.enable(); // метод Tomselet, делаем активным
            bookingTomSelectComedian.blur(); // метод Tomselet,блюрит
            bookingTomSelectTime.blur();
            
            const { performances } = comedians.find((item) => item.id === id);  // find вернет { id, comedian, perfomanse: [{time, hall}, {time, hall}] } и вытащит из него свойсов perfomanse(деструктризация)

            bookingTomSelectTime.clear();  // метод Tomselet, очищаем выбранное значение на преддущем шаге
            bookingTomSelectTime.clearOptions(); // метод Tomselet,очищает опции от предыдущего значения
            
            bookingTomSelectTime.addOptions(  // метод Tomselet
                  performances.map((item) => {   // [{value, item}, {value, item}]
                        return { value: item.time, text: item.time }
                  })
            );

            bookingHall.remove();  // удаляем элемент
       });


//                                  time comedian
      bookingTomSelectTime.on('change', (time) => {  // когад выбирем время из списка Времен, вызовется коллбэк
            
            if(!time){
                  return;  // выход из обрботчика
            }

            const idComedian = bookingTomSelectComedian.getValue();  // метод Tomselet, возвращает выбарнне значение из спика
            console.log('idComedian ', idComedian)

            const { performances } = comedians.find((item) => item.id === idComedian);   // [ {time, hall}, {time, hall} ]
           
            const { hall } = performances.find((item) => {        // у  {time, hall} берем толко свойство hall
                  return (item.time === time); 
            });

            inputHidden.value = `${idComedian},${time}`;    // для qr  нужно будет это поле
            bookingHall.textContent = hall;

            bookingComedian.append(bookingHall);
      });


      const createNextBookingComedian = () => {
            if(bookingComedianList.children.length < MAX_COMEDIANS){
                  const nextComedianBlock = createComedianBlock(comedians);  // li
                  bookingComedianList.append(nextComedianBlock);
            }

            bookingTomSelectTime.off('change', createNextBookingComedian);
      };

      bookingTomSelectTime.on('change', createNextBookingComedian);

      
      return bookingComedian; // <li>
};




const getComedians = async() => {

      const response = await fetch('http://localhost:4024/comedians');  // запрос на сервер

      return response.json();  // вернет промис
}





const init = async() => {

      const comedians = await getComedians();  // await  тк решаем когда разрешится промис
      console.log('comedians ', comedians);
      
      const countComedians = document.querySelector('.event__info-item--comedians .event__info-number');
      countComedians.textContent = comedians.length;

      const comedianBlock = createComedianBlock(comedians); // li
      bookingComedianList.append(comedianBlock);

      // для валидации используем библиотеку just-validate:
      const validate = new JustValidate(bookingForm, {
            errorFieldCssClass: 'booking__input--invalid',  // наши классы указываем из booking.css
            successFieldCssClass: 'booking__input--valid',
      });

      const bookingInputFullname = document.querySelector('.booking__input--fullname');
      const bookingInputPhone = document.querySelector('.booking__input--phone');
      const bookingInputTicket = document.querySelector('.booking__input--ticket');

      new Inputmask('+7(999)-999-9999').mask(bookingInputPhone);
      new Inputmask('999999999').mask(bookingInputTicket);
     

      // 
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

                  notification.show(errorMessage.slice(0, -2), false);  // отрезаем полсдение два символа(запятая и пробел)
            })


      // отправка данных формы:
      bookingForm.addEventListener('submit', (evt) => {  
            evt.preventDefault();               // чтобы полсе отправки формы, страница не перезагружалась
            const data = { 
                  booking: []    // нач значение, потом будет ["fullName": "Rufina",  "phone": "7654",  "ticketNumber": "8888888",  "booking": [{comedoan: "10", time: "10:45"},{},{}]} ]
            };      

            const times = new Set();  // коллекция (хранит уникальные значения)

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

                  if(times.size !== data.booking.length){  // если в одно время на двух комиков запсиываемся
                        notification.show('нельзя в одно время записаться на двух комиков', false);   
                  }
            });
            console.log('data ', data);   // data = [{"fullName": "Rufina",  "phone": "7654",  "ticketNumber": "8888888",  "booking": [{comedoan: "10", time: "10:45"},{},{}]} ] - тело мтеода POSTT
            
            
      });

};



init();
