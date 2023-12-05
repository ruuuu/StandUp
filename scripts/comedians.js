import TomSelect from 'tom-select';
const MAX_COMEDIANS = 6;



export const createComedianBlock = (comedians, bookingComedianList) => {    // comedians = [{},{},{}]

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

   // создаем список комедиантов:
   const bookingTomSelectComedian = new TomSelect(bookingSelectComedian, {
         hideSelected: true,      //  скрывает в спсике  уже выбранные элементы
         placeholder: 'Выбрать комика',
         options: comedians.map((item) => {              // [ {value, text}, {value, text} ]
               return { value: item.id, text: item.comedian }
         })
   });
   
   // создаем список времен:
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




   //                              time of comedian
   bookingTomSelectTime.on('change', (time) => {  // навешиваем событие на список времен, когад выбирем время из списка Времен, вызовется коллбэк
         
         if(!time){
               return;  // выход из обрботчика
         }

         const idComedian = bookingTomSelectComedian.getValue();  // метод Tomselet, возвращает выбарнне значение из спика
         console.log('idComedian ', idComedian)

         const { performances } = comedians.find((item) => item.id === idComedian);   // [ {time, hall}, {time, hall} ]
        
         const { hall } = performances.find((item) => {        // у  {time, hall} берем толко свойство hall
               return (item.time === time); 
         });

         inputHidden.value = `${idComedian},${time}`;    // для qr кода нужно будет это поле
         bookingHall.textContent = hall;

         bookingComedian.append(bookingHall);
   });



   const createNextBookingComedian = () => {

         if(bookingComedianList.children.length < MAX_COMEDIANS){
               const nextComedianBlock = createComedianBlock(comedians, bookingComedianList);  // li
               bookingComedianList.append(nextComedianBlock);
         }

         bookingTomSelectTime.off('change', createNextBookingComedian);  // деактививруем событие change(встроенный метод TomSelect)
   };

   bookingTomSelectTime.on('change', createNextBookingComedian);

   
   return bookingComedian; // <li>
};