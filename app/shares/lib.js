const { exec } = require("child_process");

const getPrinters = () => {
  return new Promise((res, rej) => {
    exec('wmic printer list brief', (err, stdout, stderr) => {
        if (err) {
          // node couldn't execute the command
          rej(err);
        }
        // list of printers with brief details
        console.log(stdout);
        // the *entire* stdout and stderr (buffered)
        stdout=stdout.split("  ");
        var printers=[];
        j=0;
        stdout = stdout.filter(item => item);
        for (i = 0; i < stdout.length; i++)
        {
          if(stdout[i]==" \r\r\n" ||stdout[i]=="\r\r\n")
          {
             printers[j]=stdout[i+1];
             j++; 
          }
        }
        // list of only printers name
  
        console.log(stderr);
        res(printers) ;
      });
  });
};

module.exports = { getPrinters };
