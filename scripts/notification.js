
export class Notification {  // sigletone(нужен для опимизации работы)  значит сколкьо бы раз вы не вызвали этот бъект, вызывться будет тот instance который был первым(то есть будет возвращаться первый объект)

   static instance; 
   
   constructor(){                // это метод котрый запускается при создании класса
      if(Notification.instance){
         return Notification.instance;
      }
      
      this.timeout = 3000;          // сколкь секунд отобрадать notification
      Notification.instance = this;
   }


   static getInstance (){

      if (!Notification.instance){  
         Notification.instance = new Notification();
      }

      return Notification.instance;
   }



   show(message, isSuccess){
      const notification = this.createNotification(message, isSuccess);
      document.body.append(notification);
      this.animationNotification(notification, true);  // true значит, что надо показать notification

      setTimeout(() => {
         this.animationNotification(notification, false).then(() => {  // then() обрабатывате промис
            notification.remove();  // удалем элемент
         }); 
      }, this.timeout);
   }


   createNotification(message, isSuccess){
      const notification = document.createElement('div');
      notification.className = `notification ${isSuccess ? "notification--success" : "notification--error"}`;
      notification.textContent = message;

      return notification;
   }



   animationNotification(notification, show){
      
      return new Promise((resolve, reject) => {  // resolve() это функция
         if(show){            // если показываем notification
            requestAnimationFrame(() => {    // встроеннй метод
               notification.classList.add('notification--show');
               resolve();
            })   
         }
         else{
            notification.classList.remove('notification--show');
            setTimeout(resolve, 500);
         }
      })
   }



}




