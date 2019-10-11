""" import re, json
from rasa_core_sdk import Action
import requests
import urllib.parse """

"""
  @ActionGatewaySearch

  Rasa action class for handling gateway page searching

  REQUIRES NODEJS V10+
"""
""" class ActionGatewaySearch(Action):
  def name(self):
    return "action_gateway_search"

  def run(self, dispatcher, tracker, domain):
    if not tracker.latest_message['entities']:
      # no acronym was found in the latest user intent
      dispatcher.utter_message("I couldn't find a search term in '" + tracker.latest_message["text"] + "'. I'm am still a work in progress :)")
      # TODO: Log failed intent
      
      return []

    # Get entity from latest message
    searchTerm = tracker.latest_message['entities'][0]['value']
    query = re.sub( r'[^\w\s]', '', searchTerm )

    response = requests.get( "http://localhost:3000/api/search/gateway/" + urllib.parse.quote( query ) )
    
    # TODO: Check response headers, handle bad request

    # Parse JSON response
    results = json.loads( response.content )

    if "error" in results:
      # Error found in response - apologize to the user and cancel search.
      dispatcher.utter_template( "utter_error_generic" )
      print( json.dumps( results, indent=2 ) )
      return []

    print( json.dumps( results, indent=4, sort_keys=True ) )

    resultsCount = len( results["results"] )

    response = None
    
    if resultsCount > 0:
        # TODO: Bilingual
      response = "I found " + str( resultsCount ) + " result" + ( "s" if resultsCount > 1 else "" ) + " for \"" + searchTerm + "\". Were you looking for: "
      buttons = []

      maxResults = 5
      resultsCount = 0

      # TODO: Respond with top 2 results and offer link to full results page.
      for result in results["results"]:
        btn = { "type": "web_url", "title": result["en"]["title"], "url": result["url"] }
        buttons.append( btn )
        resultsCount += 1
        if resultsCount >= maxResults:
          break
      
      dispatcher.utter_button_message( response, buttons )
      
      return []
    else:
      # response = "Hmm, I couldn't seem to find anything on the gateway related to \"" + query + "\"."
      
      dispatcher.utter_template( "utter_search_results_none", gw_search_query = query )

      return [] """