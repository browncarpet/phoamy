from threading import Thread
import __main__ as mainMod
import serial
import comports

comBuffer = []
comQueue = []
hvacStatus = {'03':['temp','coolsp','heatsp','mode'],'102':['temp','coolsp','heatsp','mode'],'103':['temp','coolsp','heatsp','mode'],'104':['temp','coolsp','heatsp','mode'],}
hvacZone = ''

class hvacRead(Thread):
	name = 'readHVACThread'
	def run(self):
		x = 1
		global comBuffer, comQueue
		while x is 1 :
			fromhvac = hvac.read()
			if fromhvac != '':
				#print fromhvac
				if '\r' not in fromhvac:
					comBuffer.append(fromhvac)
				else:
					try:
						x = 0
						comQueue.append(comBuffer)
						b = comQueue.pop()
						data = ''.join(b)
						print data
						if 'A=00' in data:
							try:							
								rcsToWeb(data)
							except:
								mainMod.factory.broadcast('Bad A= String')
								raise
						elif '##0' in data:
							pass
						#elif data[14:16] == 'R5':
							#pass
						elif data[14:16] == 'd0':
							mainMod.factory.broadcast(cmdToWeb(data))
						elif data[14] == 'b':
							mainMod.factory.broadcast(cmdToWeb(data))
						else:
							pass
					except:
						if hvacRead().isAlive():
							print 'thread still alive'
						else:
							print 'thread dead'
							hvacRead().start()
						raise
					finally:
						comBuffer = []
						x = 1
				
#Interpretations between RCS and Web through RCS 485 controller and Comstar


def rcsToWeb(command):
	modeList = {'A':'Auto','O':'Off','C':'Cool','H':'Heat'}
	updateList = []
	addy = command[command.index(' O=')+3:command.index(' O=')+5]
	if addy[1] == ' ':
		addy = '0' + addy[0]
	temp = command[command.index(' T=')+3:command.index(' T=')+6]
	mode = command[command.index(' M=')+3:command.index(' M=')+4]
	sph = command[command.index(' SPH=')+5:command.index(' SPH=')+8]
	spc = command[command.index(' SPC=')+5:command.index(' SPC=')+8]
	updateList.append('hvac'+addy+'temp'+temp)
	updateList.append('hvac'+addy+'mode'+modeList[mode])
	updateList.append('hvac'+addy+'maxt'+spc)
	updateList.append('hvac'+addy+'mint'+sph)
	for c in updateList:
		mainMod.factory.broadcast(c)
	
	
def cmdToWeb(command):
	global hvacZone
	methodList = {'b0':'temp', 'b9':'maxt', 'b8':'mint', 'b3':'mode', 'b1':'none', 'b6':'none', 'b4':'fans'}
	modeList = {'00':'Off', '01':'Heat', '02':'Cool','03':'Auto'}
	#added additional index increment because of leading <LF> or \n we can't see
	if command[14:16] == 'd0':
		hvacZone = str(int(int(command[16:18], 16) + 1))
		if len(hvacZone) < 2:
			hvacZone = '0'+hvacZone
		print 'Current HVAC Addr: '+hvacZone
		return 'hvac00modeAuto'
	if command[14] == 'b':
		data = int(command[16:18], 16)
		method = methodList[command[14:16]]
		if method == 'mode':
			data = modeList[command[16:18]]
		webString = 'hvac'+hvacZone+method+str(data)
		return webString

def webToCmd(command):
  methodList = {'mint':'c0','maxt':'e0','mode':'30'}
  modeList = {'Off':'01', 'Heat':'02', 'Cool':'03','Auto':'04'}
  addy = str(int(command[4:6])-1)
  if len(addy) < 2:
		addy = '0'+ addy
  method = command[6:10]
  rawData = command[10:14]
  if method == 'mode':
    data = modeList[rawData]
  else:
    data = hex(int(rawData))[2:4]
  commandString = '##%5e'+addy+methodList[method]+data
  return commandString