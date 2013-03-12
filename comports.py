import serial, ConfigParser

config = ConfigParser.ConfigParser()
config.optionxform = str
config.read('config.txt')
comDevices = dict(config.items('comports'))

com = {}

for device in comDevices:
  settings = config.get('comports', device)
  comport = settings.split(',')[0]
  baud = settings.split(',')[1]
  to = settings.split(',')[2]
  com[device] = serial.Serial(port='COM'+comport, baudrate=baud, timeout=int(to))
  com[device].close()
  com[device].open()
  if com[device].isOpen():
    print device + ' Connected!'

print com

def serialWrite(msg):
  #Temp lists as buffers
  commands = []
  toSend = []
  # '&' is used to combine commands send to a single COM port in config
  if '&' in msg:
    splits = msg.split('&')
    for indy in splits:
      commands.append(indy)
  else:
    commands.append(msg)
  #Separate the header from the command string
  for string in commands:
    header = string.split('|')[0]
    string = string.split('|')[1]
    toSend.append(string)
  if toSend:
    for stuff in toSend:
      #print '('+header+').write('+stuff+'\r\n)'
      print stuff
      com[header].write(stuff+'\r\n')