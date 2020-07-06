# from rasa_core_sdk import Action
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from typing import Any, Text, Dict, List
import pandas as pd
import re
import requests
import json
import os
from benedict import benedict

from .helpers import getRelativePath

"""
  @appendOrgTree

  Recursively parse through employee org structure, returning a concatenated string of it's entirety
"""
def appendOrgTree( result, orgString="" ):
  result = benedict( result )
  orgString = result[ 'organizationInformation' ][ 'organization' ][ 'description' ][ 'en' ] + ", " + orgString

  if [ 'organizationInformation', 'organization', 'organizationInformation' ] in result: #organizationInformation.organization
    return appendOrgTree( result=result[ 'organizationInformation' ][ 'organization' ], orgString=orgString )
  else:
    return orgString

"""
  @ActionPersonLookup

  Rasa action class for handling person lookup
"""
class ActionPersonLookup(Action):
  def name(self) -> Text:
    return "action_person_lookup"

  def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
    print( "DEBUG: ENTERED PERSON LOOKUP ACTION HANDLER" )
    person = next( tracker.get_latest_entity_values( "person" ), None )

    # if not tracker.latest_message['entities']:
    if not person:
      print( "Couldn't find person in GEDS lookup intent:" )
      print( person )

      # no acronym was found in the latest user intent
      dispatcher.utter_message("I couldn't find a person in '" + tracker.latest_message["text"] + "'.")
      # TODO: Log failed intent      
      
      return []

    ## Get entity from latest message
    person = re.sub( r'[^\w\s]', '', person )

    ## Format name for GEDS API: "{last}, {first}"
    # FIXME: GEDS API needs format "{last}, {first}" as opposed to "{first} {last}" provided by current entity extraction method
    # Currently formatting below, however being able to extract First and Last names separately may be ideal?
    namePattern = re.search( '(\w*)\s(\w*)', person, flags=re.IGNORECASE )
    formattedSearchName = ( namePattern.group( 2 ) + ", " + namePattern.group( 1 ) ).lower()

    gedsQueryURI = "https://geds-sage-ssc-spc-apicast-production.api.canada.ca/gapi/v2/employees?searchValue=" + formattedSearchName + "&searchField=0&searchCriterion=2&searchScope=sub&&searchFilter=2&maxEntries=10&returnOrganizationInformation=yes"
    gedsQueryHeaders = {
      u'Accept': 'application/json',
      u'user-key': os.environ[ 'GEDS_API_KEY' ]
    }

    gedsQueryURI = requests.utils.requote_uri( gedsQueryURI ) 

    print( "Attempting GEDS query;" )
    print( gedsQueryURI )

    response = requests.get( gedsQueryURI, headers=gedsQueryHeaders )

    if response.status_code == 204:
      # No entries found
      dispatcher.utter_message( "Sorry I couldn't find \"" + person + "(" + formattedSearchName + ")\" in the Government Electronic Directory. -- " + gedsQueryURI )
    elif response.status_code >= 400:
      # Problem with request
      dispatcher.utter_message( "Sorry I had some trouble reaching the Government Electronic Directory. Please try again later." )
    else:
      # Found a match!
      result = json.loads( response.content )[ 0 ]

      # FIXME: Not curently checking for multiple results.
      # TODO: If multiple results, give user top 3-5 and send request directly to geds?

      # TODO: log and explore response object

      organization = appendOrgTree( result=result ) if ("organizationInformation" in result ) else "(organization information currently unavailable)"
      foundMessage = "I know " + person + ": " + str( result[ 'title' ][ 'en' ] ) + " at " + organization + ". Telephone number " + str( result[ 'contactInformation' ][ 'phoneNumber' ] ) + "."

      dispatcher.utter_message( foundMessage )
    
    return []
