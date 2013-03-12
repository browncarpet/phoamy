from threading import Thread
import serial, time
import __main__ as mainMod
import comports

audioZoneStatus = {}
audioZones = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14']

for zone in audioZones:
  audioZoneStatus[zone] = {'source':'-','vol':'-','mute':'-'}

def makeCommand(zone, bracket=']'):
  print "Making command for Audio Zone: " +zone
  if audioZoneStatus[zone]['vol'] != '-':
    volStatus = "[VO"+zone+"R"+audioZoneStatus[zone]['vol']+bracket
    print volStatus
    audioParse(volStatus)
  if audioZoneStatus[zone]['source'] != '-':
    sourceStatus = "[CO"+zone+"I"+audioZoneStatus[zone]['source']+bracket
    print sourceStatus
    audioParse(sourceStatus)
  if audioZoneStatus[zone]['mute'] == 'on':
   print "[VMO"+zone+bracket
   audioParse("[VMO"+zone+bracket)
  if audioZoneStatus[zone]['mute'] == 'off':
   print "[VUMO"+zone+bracket
   audioParse("[VUMO"+zone+bracket)

def updateAudioUI():
  for zone in audioZones:
    makeCommand(zone)

class audioRead(Thread):
  name = 'readHVACThread'
  print name,'has started'
  def run(self):
    x = 1
    comBuffer = []
    comQueue = []
    while x is 1 :
      fromaudio = comports.com['audioa'].read()
      if fromaudio != '':
        if '\n' not in fromaudio:
          comBuffer.append(fromaudio)
        else:
          try:
            x = 0
            comQueue.append(comBuffer)
            b = comQueue.pop()
            data = ''.join(b)
            data = data.replace('\r', '')
            print data
            audioParse(data)
          except:
            if audioRead().isAlive():
							print 'thread still alive'
            else:
              print 'thread dead'
              audioRead().start()
              raise
          finally:
						comBuffer = []
						x = 1


class audioPoll(Thread):
  name = 'pollAA'
  print name,'has started'
  def run(self):
    while True:
      for zone in audioZones:
        print "[QO"+zone+"]"
        time.sleep(1)
      time.sleep(900)

def audioParse(reply):
  print "printing audioParse reply variable: " + reply
  if 'CO' in reply:
    zone = reply[reply.index('CO')+2:reply.index('I')]
    if len(zone) < 2:
      zone = '0'+zone
    inputSource = reply[reply.index('I')+1:reply.index(')')]
    print 'Zone: '+zone, 'Source: '+inputSource
    audioZoneStatus[zone]['source'] = inputSource
    reply = reply.replace('(','[')
    reply = reply.replace(')',']')
    mainMod.factory.broadcast('music.source.sourceSelect'+zone+"."+reply)
    #mainMod.factory.broadcast('music.source.musicZone'+zone+'Source'+inputSource)
  if 'VO' in reply:
    zone = reply[reply.index('VO')+2:reply.index('R')]
    if len(zone) < 2:
      zone = '0'+zone
    volLevel = reply[reply.index('R')+1:reply.index(')')]
    print 'Zone: '+zone, 'Volume: '+volLevel
    audioZoneStatus[zone]['vol'] = volLevel
    mainMod.factory.broadcast('music.vol.musicZone'+zone+'Vol.'+volLevel)
  if 'VMO' in reply:
    zone = reply[reply.index('VMO')+3:reply.index(')')]
    if len(zone) < 2:
      zone = '0'+zone
    print 'Zone: '+zone, 'is muted.'
    audioZoneStatus[zone]['mute'] = 'on'
    mainMod.factory.broadcast('music.mute.musicZone'+zone+'Mute.on')
  if 'VUMO' in reply:
    zone = reply[reply.index('VUMO')+4:reply.index(')')]
    if len(zone) < 2:
      zone = '0'+zone
    print 'Zone: '+zone, 'is unmuted.'
    audioZoneStatus[zone]['mute'] = 'off'
    mainMod.factory.broadcast('music.mute.musicZone'+zone+'Mute.off')



audioRead().start()
audioPoll().start()

