from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from __future__ import unicode_literals

import argparse
import warnings

from rasa_nlu.training_data import load_data as load_td
from rasa_nlu import config as nlu_config
from rasa_nlu.model import Trainer

from rasa_core import utils, config as core_config
from rasa_core.agent import Agent
from rasa_core.policies import Policy
# from rasa_core.policies.keras_policy import KerasPolicy
# from rasa_core.policies.memoization import MemoizationPolicy

def train_nlu():
  training_data = load_td( "data/nlu_data.md" )
  trainer = Trainer( nlu_config.load( "core/nlu_config.yml" ) )
  trainer.train(training_data)
  model_location = trainer.persist( "models/", fixed_model_name="nlu" )
  return model_location

def train_dialogue(
  domain_file = "core/domain.yml",
  policy_file = "core/policies.yml",
  model_path = "models/",
  training_data_location = "data/stories.md"
):
  policies = core_config.load( policy_file )

  agent = Agent(
    domain_file,
    policies=policies
  )

  training_data = agent.load_data( training_data_location )

  agent.train(
    training_data
  )

  agent.persist( ''.join([ model_path, "default/dialogue" ]) )

  return agent

def train_all():
  model_directory = train_nlu()
  agent = train_dialogue()
  return [ model_directory, agent ]

if __name__ == '__main__':
  warnings.filterwarnings(
    action='ignore',
    category=DeprecationWarning
  )
  utils.configure_colored_logging(loglevel="INFO")

  parser = argparse.ArgumentParser(
    description="Begin Alfred training..."
  )

  parser.add_argument(
    'task',
    choices=[
      "train_nlu",
      "train_dialogue",
      "train_all",
    ],
    help="What will be trained?"
  )

  task = parser.parse_args().task

  if task == "train_nlu":
    train_nlu()
  elif task == "train_dialogue":
    train_dialogue()
  else:
    train_all()
