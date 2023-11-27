import './style.css';
import TomSelect from 'tom-select';

const bookingComedianList = document.querySelector('.booking__comedian-list');

const createComedianBlock = () => {
      const bookingComedian = document.createElement('li');  // li
      bookingComedian.classList.add('booking__comedian');

      const bookingSelectComedian = document.createElement('select');
      bookingSelectComedian.classList.add('booking__select', 'booking__select--comedian');
     

      const bookingSelectTime = document.createElement('select');
      bookingSelectTime.classList.add('booking__select', 'booking__select--time');
     



      bookingComedian.append(bookingSelectComedian);  
      return bookingComedian; // <li>
};



const init = () => {

      const comedianBlock = createComedianBlock(); // li
      bookingComedianList.append(comedianBlock);
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