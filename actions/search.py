import re, json, sys
# from rasa_core_sdk import Action
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from typing import Any, Text, Dict, List
from gql import gql, Client, AIOHTTPTransport
from urllib.parse import quote

"""
  @ActionGatewaySearch

  Rasa action class for handling gateway page searching
  
"""

class ActionGatewaySearch(Action):
  def name(self) -> Text:
    return "action_gateway_search"

  async def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
    if not tracker.latest_message['entities']:
      # no acronym was found in the latest user intent
      dispatcher.utter_message("I couldn't find a search term in '" + tracker.latest_message["text"] + "'. I'm am still a work in progress :)")
      # TODO: Log failed intent
      
      return []

    # Get entity from latest message
    searchTerm = tracker.latest_message['entities'][0]['value']
    query = re.sub( r'[^\w\s]', '', searchTerm )

    transport = AIOHTTPTransport(url="http://sfe-chatbot-gateway-api:1337/graphql")
  
    async with Client(transport=transport, fetch_schema_from_transport=True) as session:
      gqlQuery = gql(
        """
          query getSearchResults($query: String, $locale: String) {
            gatewaySearch(query: $query, locale: $locale) {
              _id
              _score
              _source {
                name
                parent_page
                header_en
                description_en
              }
            }
          }
        """
      )

      params = { "query": query, "locale": "en" }

      results = await session.execute( gqlQuery, variable_values=params )

      # print( results )
      # sys.stdout.flush()      

      results = results[ "gatewaySearch" ]
      resultsCount = len( results )

      response = None

      if resultsCount > 0:
          # TODO: Bilingual
        response = "I found " + str( resultsCount ) + " result" + ( "s" if resultsCount > 1 else "" ) + " for \"" + searchTerm + "\". Were you looking for:"

        maxResults = 2
        resultsCount = 0

        for result in results:
          path = "/en/" + ( result[ "_source" ][ "parent_page" ] + "/" if result[ "_source" ][ "parent_page" ] is not None else "" ) + result[ "_source" ][ "name" ]
          response += "\n\n[" + result[ "_source" ][ "header_en" ] + "](" + path + ")"
          resultsCount += 1
          
          if resultsCount >= maxResults:
            more = "/en/search/" + quote( searchTerm )
            response += "\n\n[More...](" + more + ")"
            break

        # print( response )
        # sys.stdout.flush()
        
        dispatcher.utter_message( text=response )
        
        return []
      else:
        response = "Hmm, I couldn't seem to find anything on the gateway related to \"" + query + "\"."
        
      dispatcher.utter_message( template="utter_search_results_none", gw_search_query=query, tracker=tracker )

    return []
