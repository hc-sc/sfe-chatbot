import { Express } from "jest-express/lib/express";
import { app } from "../";

let httpServer;

describe( 'Server', () => {
  
  beforeEach( () => {
    httpServer = new Express( app );
  } );

  afterEach( () => {
    httpServer.resetMocked();
  } );

  it ( 'should setup server', () => {
    // TODO:
    expect( httpServer ).toBeTruthy();
  } );
  
  
  // it ( 'handle get new user', () => {
    
    //   expect( httpServer.get ).toBeCalledWith( '/api/alfred/users/new', ( ...args ) => {
      //     console.log( 'DEBUG: ARGS\n', args );
      //   } );
      // } );
      
  // TODO: More tests!
  
} );
