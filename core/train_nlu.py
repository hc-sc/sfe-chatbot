import os.path
from rasa_nlu.training_data import load_data
from rasa_nlu.model import Trainer
from rasa_nlu import config

CORE_MODELS = [ "nlu" ]

def getRelativePath( path ):
  localPath = os.path.abspath( os.path.dirname( __file__ ) )
  relativePath = os.path.join( localPath, path )
  return relativePath

def trainModel( tdFile, configFile, modelDir ):
  trainingData = load_data( tdFile )
  trainer = Trainer( config.load( configFile ) )
  trainer.train( trainingData )

  trainer.persist( modelDir )
  # modelLocation = trainer.persist( modelDir )

def getModelPaths( key ):
  if key not in CORE_MODELS:
    raise ValueError( "Invalid value \"" + key + "\" - cannot get paths." )

  tdFileDict = {
    "nlu": "data/nlu_data.md" 
  }
  configFileDict = {
    "nlu": "core/nlu_config.yml"
  }

  tdFile = tdFileDict[ key ]
  configFile = configFileDict[ key ]
  modelDir = "models/current/" + key

  return tdFile, configFile, modelDir

def run():
  for key in CORE_MODELS:
    tdFile, configFile, modelDir = getModelPaths( key )
    trainModel( tdFile, configFile, modelDir )

run()