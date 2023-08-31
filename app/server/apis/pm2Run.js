const pm2 = require('pm2')
const path = require('path')
const t = path.join(__dirname,'./testpm2.js');
    console.log(t)
    
    pm2.connect(function(err) {
        if (err) {
          console.error(err)
          process.exit(2)
        }
      
        pm2.start({
          script    : t,
          name      : 'api',
          autorestart: false
        }, function(err, apps) {
          if (err) {
           // console.error(err)
            return pm2.disconnect()
          }
      
          pm2.list((err, list) => {
            console.log(err, list)
      
            pm2.restart('api', (err, proc) => {
              // Disconnects from PM2
              pm2.disconnect()
            })
          })
        })
      })