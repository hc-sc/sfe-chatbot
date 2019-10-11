import requests
import json
from rasa_core_sdk import Action

class ActionCatFact(Action):
  def name(self):
    return "action_cat_fact"

  def run(self, dispatcher, tracker, domain):
    response = requests.get( "https://catfact.ninja/fact?max_length=200" )

    result = json.loads( response.content )

    if "error" in result:
      dispatcher.utter_template( "utter_error_generic", tracker )
      print( json.dumps( result, indent=2 ) )
      return []

    dispatcher.utter_template( "utter_cat_fact_pre", tracker )
    dispatcher.utter_message( result["fact"] )

    return []
