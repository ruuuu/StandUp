import './style.css';
import TomSelect from 'tom-select';


const MAX_COMEDIANS = 6;

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
            
            bookingTomSelectTime.enable(); // делаем активным
            bookingTomSelectComedian.blur();
            bookingTomSelectTime.blur();
            
            const { performances } = comedians.find((item) => item.id === id);  // find вернет { id, comedian, perfomanse: [{time, hall}, {time, hall}] } и вытащит из него свойсов perfomanse(деструктризация)

            bookingTomSelectTime.clear();  // очищаем выбранное значение на преддущем шаге
            bookingTomSelectTime.clearOptions(); // очищает опции от предыдущего значения
            
            bookingTomSelectTime.addOptions(
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

            const idComedian = bookingTomSelectComedian.getValue();  // возвращает выбарнне значение из спика
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


      bookingForm.addEventListener('submit', (evt) => {
            evt.preventDefault();               // чтобы полсе отправки формы, страница не перезагружалась
            const data = { 
                  booking: []    // нач значение
            };      

            const times = new Set();  // коллекция (хранит уникальные значения)

            //new FormData(bookingForm) // считыывает данные полей, хранит ввиде объекта
            new FormData(bookingForm).forEach((value, field) => {  // (Иванова, fullName) (897654, phone) (324, ticketNumber)
                  //console.log(value, field);
                  if(field === 'booking'){
                        //comedian, time это значения атрибутов name у select
                        const [comedianId, time] = value.split(",");  // value = 3,11:45, это строка, метод split() возвращает массив элементов
                        if(comedianId && time){
                              data.booking.push({ comedianId, time });
                              times.add(time);                    // добавляем значение в коллекцию
                        }
                        else{
                              data[field] = value;  
                        }

                        console.log('data ', data)
                        if(times.size !== data.booking.length){  // если в одно время на двух комиков запсиываемся
                              console.log('нельзя быть в одно и то же время на двух комиках')
                        }




                  }
            }) 
      });

};



init();

//  <li class="booking__comedian">
//    <select class="booking__select booking__select--comedian" name="comedian">
//          <option value="1"> Юлия Ахмедова </option>     в value указывается значения котрые пойдут на сервер 
//          <option value="2"> Слава Коммисаренко </option>
//    </select>

//    <select class="booking__select booking__select--time" name="time">
//          <option value="11:00"> 11:00 </option>
//          <option value="10:00"> 10:00 </option>
//    </select>

//    <button class="booking__hall"> Зал 1 </button>
// </li> 