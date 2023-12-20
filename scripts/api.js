import { Notification } from "./notification";

const API_URL = 'https://royal-scarce-barge.glitch.me'; //    http://localhost:4024  https://grizzled-glorious-flight.glitch.me


export  const getComedians = async() => {

      try{
            const response = await fetch(`${API_URL}/comedians`);  // запрос на сервер
            console.log('response ', response)
            
            if(!response.ok){
                  throw new Error(`сервер вернул ошибку ${response.status}`) // выведем ошибку и передйдм в блок catch()
            }

            return response.json();  // вернет промис
      }catch(err){
            console.error(`возникла проблема с fecth запросом ${err.message}`);
            Notification.getInstance().show('Возникла ошибка сервера, попробуйте позже')
      } 
};



export const getClient = async(ticketNumber) => {

      try{
            const response = await fetch(`${API_URL}/clients/${ticketNumber}`);  // запрос на сервер
            console.log('response Client', response)
            
            if(!response.ok){
                  throw new Error(`сервер вернул ошибку ${response.status}`) // выведем ошибку и передйдм в блок catch()
            }

            return response.json();  // вернет промис
      }catch(err){
            console.error(`возникла проблема с fecth запросом ${err.message}`);
            Notification.getInstance().show('Возникла ошибка сервера, попробуйте позже')
      } 
};



export const sendData = async(method, data, id) => {  // id клиента

      try{
            const response = await fetch(`${API_URL}/clients/${id ? `${id}` : ''}`,  {    // POST запрос на сервер(добавление клиента)
                  method: method,
                  heades:{
                        "Content-Type": 'application/json'
                  }, 
                  body: JSON.stringify(data)          // преваращет в JSON
            }); 

            console.log('response ', response)
            
            if(!response.ok){
                  throw new Error(`сервер вернул ошибку ${response.status}`) // выведем ошибку и передйдм в блок catch()
            }

            //return response.json();  // вернет промис
            return true;
            
      }catch(err){
            console.error(`возникла проблема с fecth запросом ${err.message}`);
            Notification.getInstance().show('Возникла ошибка сервера, попробуйте позже');
            return false;
      } 
};



