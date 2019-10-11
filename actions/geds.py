from rasa_core_sdk import Action
import pandas as pd
import re

from .helpers import getRelativePath

"""
  @ActionPersonLookup

  Rasa action class for handling person lookup
"""
class ActionPersonLookup(Action):
  def name(self):
    return "action_person_lookup"


  def run(self, dispatcher, tracker, domain):
    print( "DEBUG: ENTERED PERSON LOOKUP ACTION HANDLER" )
    person = tracker.get_slot( "person" )

    # if not tracker.latest_message['entities']:
    if not person:
      # no acronym was found in the latest user intent
      dispatcher.utter_message("I couldn't find a person in '" + tracker.latest_message["text"] + "'. I'm am still a work in progress :)")
      # TODO: Log failed intent
      
      return []
    
    # GEDS data path
    csvPath = getRelativePath( "../data/gedsOpenData.csv" )

    ## Get entity from latest message
    person = re.sub( r'[^\w\s]', '', person )
    # person = re.sub( r'[^\w\s]', '', tracker.latest_message['entities'][0]['value'] )
    # firstName = ""
    # lastName = ""

    # try:
    #   firstName = person.split()[0].upper()
    #   lastName = person.split()[1].upper()
    # except:
    #   print("")

    """
      Read GEDS CSV and search for matching entry.

      TODO: Operation is slow: improve efficiency

      CVS Columns:
        Surname,
        GivenName,
        Initials,
        Prefix (EN),
        Prefix (FR),
        Suffix (EN),
        Suffix (FR),
        Title (EN),
        Title (FR),
        Telephone Number,
        Fax Number,
        TDD Number,
        Secure Telephone Number,
        Secure Fax Number,
        Alternate Telephone Number,
        Email,
        Street Address (EN),
        Street Address (FR),
        Country (EN),
        Country (FR),
        Province (EN),
        Province (FR),
        City (EN),
        City (FR),
        Postal Code,
        PO Box (EN),
        PO Box (FR),
        Mailstop,
        Building (EN),
        Building (FR),
        Floor,
        Room,
        Administrative Assistant,
        Administrative Assistant Telephone Number,
        Executive Assistant,
        Executive Assistant Telephone Number,
        Department Acronym,
        Department Name (EN),
        Department Name (FR),
        Organization Acronym,
        Organization Name (EN),
        Organization Name (FR),
        Organization Structure (EN),
        Organization Structure (FR)
    """      
    with open(csvPath, 'r') as csvFile:
      gedsCols = ['Surname', 'GivenName', 'Prefix (EN)', 'Title (EN)', 'Telephone Number', 'Department Name (EN)', 'Organization Name (EN)']
      # chunkSize = 10 ** 4
      found = False
      pronoun = "They are"
      # matchCount = False

      # TODO: https://stackoverflow.com/questions/653509/breaking-out-of-nested-loops
      # for people in pd.read_csv(csvFile, encoding="UTF-8", usecols=gedsCols, low_memory=False, chunksize=chunkSize):
      people = pd.read_csv(csvFile, encoding="UTF-8", usecols=gedsCols)
      # search for matching entry 
      for _, employee in people.iterrows():
        if employee[1].upper() == person.split()[0].upper() and employee[0].upper() == person.split()[1].upper():
          found = str(employee[3]) + " at " + str(employee[5]) + ", " + str(employee[6]) + ". Telephone number " + str(employee[4]) + "."
          prefix = str(employee[2])
          
          if prefix.lower() == "dr":
            person = "Doctor " + person

          elif prefix.lower() == "mr":
            pronoun = "He is"

          elif "s" in prefix.lower():
            pronoun = "She is"

          break

      #   #TODO: multiple
      if not found:
        # TODO: Perform a fuzzy match with fuzzywuzzy if there are no direct matches, give top 2-4 options to user
        # TODO: Log queries that don't match and review to improve nlp model
        dispatcher.utter_message( "Sorry I couldn't find \"" + person + "\" in GEDS." )
      else:
        dispatcher.utter_message( "I know " + person + ". " + pronoun + " " + found )
      
      csvFile.close()
    
    return []
