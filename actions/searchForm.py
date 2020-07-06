import re, json
from rasa_sdk import Tracker
from rasa_sdk.forms import FormAction
import requests
import urllib.parse

"""
  @FormGatewaySearch

  Rasa action class for handling gateway page searching

  REQUIRES NODEJS V10+
"""
class FormGatewaySearch(FormAction):
  def name(self):
    return "form_gateway_search"

  @staticmethod
  def required_slots(tracker):
    return [
      'gw_search_query'
    ]

  def slot_mapping(self):
    return {
      'gw_search_query': [
        self.from_entity(entity='gw_search_query'),
        self.from_text(intent='gw_search_query')
      ]
    }

  def submit(self, dispatcher, tracker, domain):
    # searchTerm = tracker.get_slot( "gw_search_query" )
    searchTerm = next( tracker.get_latest_entity_values( "gw_search_query" ), None )
    query = re.sub( r'[^\w\s]', r'', searchTerm )
    query = re.sub( r'[.,\/#!$%\^&\*;:{}=\-_`~()]', r'', searchTerm )
    response = requests.get( "http://sfe-chatbot-gateway:3000/api/search/gateway/" + urllib.parse.quote( query ) )
    results = json.loads( response.content )

    # print( json.dumps( results, indent=4, sort_keys=True ) )

    if "error" in results:
      # Error found in response - apologize to the user and cancel search.
      dispatcher.utter_template( "utter_error_generic" )
      print( json.dumps( results, indent=2 ) )
      return []

    resultsCount = len( results["results"] )

    response = None
    
    if resultsCount > 0:
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

      return []

    return []
