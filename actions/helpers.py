import os.path

"""
  @getRelativePath
  
  Returns relative path derived from path
  https://stackoverflow.com/a/40416154

  TODO: Look into configuration workaround...
"""
def getRelativePath( path ):
  localPath = os.path.abspath( os.path.dirname( __file__ ) )
  relativePath = os.path.join( localPath, path )
  return relativePath
