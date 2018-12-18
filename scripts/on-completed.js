function onCompleted(opts){

  const {errors = [], args = {}, apps = []} = opts;
  console.log("\n  ------------------------------------------\n");
  if(errors.length && args.verbose){
    errors.forEach(err=>{
      console.log("\n\n",`${err.app}`.red,"\n",err.error,"\n");
    });
  }
  console.log(
    `  (${apps.length - errors.length}) Completed.`.green,
    `  (${errors.length}) Failed.`.red,
    "\n\n",
    "  PROCESS COMPLETED  ".bgWhite.black,
    "\n\n"
  );

}

module.exports = onCompleted;
