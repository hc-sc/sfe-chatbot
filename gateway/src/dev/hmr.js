try {
  if ( module.hot ) {
    console.log( "HOT MODULE RELOADING ENABLED" );
    module.hot.accept();
    module.hot.dispose( () => {
      console.log( "Cleanup goes here." );
    } );
  }
  
}
catch( err ) {
  console.log( "Error initializing HMR in dev:\n", err );
}
