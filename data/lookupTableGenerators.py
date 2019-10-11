import os
import pandas as pd
import threading

def getRelativePath( path ):
    localPath = os.path.abspath( os.path.dirname( __file__ ) )
    relativePath = os.path.join( localPath, path )
    return relativePath

class AcronymTableGenerator( threading.Thread ):

  def __init__( self, threadID, name ):
    threading.Thread.__init__( self )
    self.threadID = threadID
    self.name = name

  def run( self ):
    print ( "Starting " + self.name )
    threadLock.acquire()
    self.extractAcronymEntities()
    threadLock.release()

  def extractAcronymEntities( self ):
    acronymPath = getRelativePath( "../data/acronyms.csv" )

    with open(acronymPath, 'r') as csvFile:
      acronymCols = [ 'EN' ] # TODO: Use args for french!!
      
      acronyms = pd.read_csv(csvFile, encoding="UTF-8", usecols=acronymCols)
      
      acronyms.to_csv(
        getRelativePath( "../data/tables/acronyms.csv" ),
        header=False,
        index=False,
        sep=",",
        encoding="UTF-8"
      )

class GEDSTableGenerator( threading.Thread ):

  def __init__( self, threadID, name ):
    threading.Thread.__init__( self )
    self.threadID = threadID
    self.name = name

  def run( self ):
    print ( "Starting " + self.name )
    threadLock.acquire()
    self.extractGEDSEntities()
    threadLock.release()

  def extractGEDSEntities( self ):
    gedsPath = getRelativePath( "../data/gedsOpenData.csv" )

    with open(gedsPath, 'r') as csvFile:
      gedsCols = [ 'Surname', 'GivenName' ]

      people = pd.read_csv(csvFile, encoding="UTF-8", usecols=gedsCols)
      
      # Concatonate full names and remove old columns
      people[ "FullName" ] = people.GivenName + ' ' + people.Surname

      del people[ "Surname" ]
      del people[ "GivenName" ]

      people.to_csv(
        getRelativePath( "../data/tables/geds.csv" ),
        header=False,
        index=False,
        sep=",",
        encoding="UTF-8"
      )

print ( "Generating lookup tables..." )

# Create threads
threadLock = threading.Lock()
threads = []

acronymThread = AcronymTableGenerator( 1, "AcronymThread" )
gedsThread = GEDSTableGenerator( 2, "GEDSThread" )

# Start threads
acronymThread.start()
gedsThread.start()

threads.append( acronymThread )
threads.append( gedsThread )

for t in threads:
  t.join()
