import re
# from rasa_core_sdk import Action
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from typing import Any, Text, Dict, List
import pandas as pd
from fuzzywuzzy import fuzz, process
from .helpers import getRelativePath

"""
  @findCloseAcronymMatch

  Returns a list of close matches of a given entity string in a given list of acronyms using fuzzywuzzy
"""
def findCloseAcronymMatch(acronyms, entity, lang='EN', max_results=3):
  if acronyms.empty or not entity:
    return False

  acronymlist = acronyms[ lang ].values

  return process.extract( entity, acronymlist, limit=max_results )

"""
  @ActionAcronym

  Rasa action class for handling acronym searching
"""
class ActionAcronym(Action):
  def name(self) -> Text:
    return "action_acronym"

  def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
    ent = next( tracker.get_latest_entity_values( "acronym" ), None )

    if not ent:
      # no acronym was found in the latest user intent
      dispatcher.utter_message("I couldn't find an acronym in '" + tracker.latest_message["text"] + "'. I'm am still a work in progress :)")

      # TODO: Use regex to look for group of capital letters.
        # If regex match: confirm with user
        # else: send couldn't find acronym message
      # TODO: Log query with no identifiable acronym
      
      return[]

    # print("\n\nENTITY: " + ent + "\n\n")

    csvPath = getRelativePath( "../data/acronyms.csv" )    

    with open(csvPath, 'r') as csvFile:
      # TODO: French columns
      acronyms = pd.read_csv(csvFile, usecols=['EN', 'EN-FULL'])
      # acronyms_fr = pd.read_csv(csvFile, usecols=['FR', 'FR-FULL'])

      found = False

      for _, acronym in acronyms.iterrows():
        if acronym[0].lower() == ent.lower():
          found = acronym
          break

      if not ( type(found) == pd.core.series.Series ):
        # Perform a fuzzy match with fuzzywuzzy if there are no direct matches, give top 2-4 options to user
        # TODO: present to user as options to follow up with
        closeMatches = findCloseAcronymMatch( acronyms, ent )

        if not closeMatches:
          dispatcher.utter_message("I'm sorry I don't seem to remember what '" + ent + "' stands for, come back to me later.")
        else:
          message = "I'm sorry I don't seem to remember what '" + ent + "' stands for. Did you mean one of these: "

          for match in closeMatches:
            match, _ = match
            message += match + ", "

          message = message[:-2] + "?"

          dispatcher.utter_message( message )

        # TODO: Log queries that don't match and review to improve nlp model
      else:
        dispatcher.utter_message("The acronym '" + found[ 0 ] + "' stands for '" + found[ 1 ] + "'.")
      
      csvFile.close()

    return []
    