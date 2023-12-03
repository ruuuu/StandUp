import { Notification } from "./notification";



export  const getComedians = async() => {

      try{
            const response = await fetch('http://localhost:4024/comedians');  // запрос на сервер
            console.log('response ', response)
            
            if(!response.ok){
                  throw new Error(`сервер вернул ошибку ${response.status}`) // выведем ошибку и передйдм в блок catch()
            }

            return response.json();  // вернет промис
      }catch(err){
            console.error(`возникла проблема с fecth запросом ${err.message}`);
            Notification.getInstance().show('Возникла ошибка сервера, попробуйте позже')
      } 
}



