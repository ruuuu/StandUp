// создали файл с настройками vite:

import { defineConfig } from "vite";  // настройки vite по умолчанию

export default defineConfig({  // определяем свои настройки(включая натсроки по умолчанию)
   build: {
      rollupOptions: {
         input: {
            main: 'index.html',
            qr: 'qr.html'
         }
      }
   }
})
