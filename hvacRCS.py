from threading import Thread
import __main__ as mainMod
import serial

comBuffer = []
comQueue = []
hvacStatus = {'03':['temp','coolsp','heatsp','mode'],'102':['temp','coolsp','heatsp','mode'],'103':['temp','coolsp','heatsp','mode'],'104':['temp','coolsp','heatsp','mode'],}


hvac = serial.Serial(
	port='COM4',
	baudrate = 9600,
	timeout=1
)

hvac.close()
hvac.open()
if hvac.isOpen():
	print 'HVAC Connected!'
	#hvac.write('##%a507A=1,R=1')


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
							factory.broadcast(cmdToWeb(data))
						elif data[14] == 'b':
							factory.broadcast(cmdToWeb(data))
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


def webToRCS(command):
    print command
    methodList = {'mint':'SPH=','maxt':'SPC=','mode':'M='}
    addy = command[4:6]
    method = command[6:10]
    data = command[10:14]
    commandString = "A="+addy+" "+methodList[method]+data
    return commandString
			
def rcsToWeb(command):
	modeList = {'A':'Auto','O':'Off','C':'Cool','H':'Heat'}
	updateList = []
	addy = command[command.index(' O=')+3:command.index(' O=')+5]
	if addy[1] == ' ':
		addy = '0' + addy[0]
	if ' T=' in command:
		temp = command[command.index(' T=')+3:command.index(' T=')+6]
		updateList.append('hvac'+addy+'temp'+temp)
		hvacStatus[addy][0] = str(temp)
	if ' M=' in command:
		mode = command[command.index(' M=')+3:command.index(' M=')+4]
		updateList.append('hvac'+addy+'mode'+modeList[mode])
		hvacStatus[addy][3] = str(mode)
	if ' SPH=' in command:
		sph = command[command.index(' SPH=')+5:command.index(' SPH=')+8]
		updateList.append('hvac'+addy+'mint'+sph)
		hvacStatus[addy][2] = str(sph)
	if ' SPC=' in command:
		spc = command[command.index(' SPC=')+5:command.index(' SPC=')+8]
		updateList.append('hvac'+addy+'maxt'+spc)
		hvacStatus[addy][1] = str(spc)
	for c in updateList:
		mainMod.factory.broadcast(c)
	print hvacStatus[addy]