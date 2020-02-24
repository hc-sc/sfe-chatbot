/**
 * @file alfred.dev.js
 * @description Contains dev methods for alfred module
 */

/**
 * @function alfredReset
 * @description Resets localstorage items and reloads page
 */
window.alfredReset = () => {
  localStorage.removeItem( "alfred-is-open" );
  localStorage.removeItem( "alfred-user-id" );
  location.reload( true );
};
